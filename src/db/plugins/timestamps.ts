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

export class TimestampsPlugin implements KyselyPlugin {
  createColumnName: string;
  updateColumnName: string;

  constructor(
    options: {createColumnName?: string; updateColumnName?: string} = {},
  ) {
    this.createColumnName = options.createColumnName ?? 'created_at';
    this.updateColumnName = options.updateColumnName ?? 'updated_at';
  }

  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    const {node: originalNode} = args;

    if (
      InsertQueryNode.is(originalNode) &&
      Array.isArray(originalNode.columns)
    ) {
      // ignore kysely migrations
      if (originalNode.into?.table.identifier.name === 'kysely_migration') {
        return originalNode;
      }

      let node = {
        ...originalNode,
        columns: [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ...originalNode.columns,
          ColumnNode.create(this.createColumnName),
          ColumnNode.create(this.updateColumnName),
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
          ColumnNode.create(this.updateColumnName),
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
