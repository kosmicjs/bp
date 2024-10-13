import {
  type PluginTransformQueryArgs,
  type RootOperationNode,
  type KyselyPlugin,
  type PluginTransformResultArgs,
  type QueryResult,
  type UnknownRow,
  InsertQueryNode,
  UpdateQueryNode,
  ColumnNode,
  ValueNode,
  ColumnUpdateNode,
  ValuesNode,
  PrimitiveValueListNode,
} from 'kysely';
import logger from '../../config/logger.js';

export class TimestampsPlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    const {node: originalNode} = args;

    // ignore kysely migrations

    logger.trace({node: originalNode}, 'Transforming query node');
    if (
      InsertQueryNode.is(originalNode) &&
      Array.isArray(originalNode.columns)
    ) {
      if (originalNode.into?.table.identifier.name === 'kysely_migration') {
        return originalNode;
      }

      let node = {
        ...originalNode,
        columns: [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ...originalNode.columns,
          ColumnNode.create('created_at'),
          ColumnNode.create('updated_at'),
        ],
      };

      if (
        originalNode.values &&
        ValuesNode.is(originalNode.values) &&
        node.values &&
        ValuesNode.is(node.values)
      ) {
        node = {
          ...node,
          values: ValuesNode.create([
            PrimitiveValueListNode.create([
              ...originalNode.values.values[0].values,
              new Date(),
              new Date(),
            ]),
          ]),
        };
      }

      return node;
    }

    if (
      UpdateQueryNode.is(originalNode) &&
      Array.isArray(originalNode.updates)
    ) {
      originalNode.updates.push(
        ColumnUpdateNode.create(
          ColumnNode.create('updated_at'),
          ValueNode.create(new Date()),
        ),
      );
    }

    return originalNode;
  }

  async transformResult(
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    return args.result;
  }
}
