import {type ListenOptions} from 'node:net';
import {type Server} from 'node:http';
import {server} from './core.js';
import {logger} from '#config/logger.js';

export const start = async (
  portOrOptions?: number | string | ListenOptions,
  hostname?: string,
): Promise<Server> => {
  return new Promise((resolve, reject) => {
    const _server =
      typeof portOrOptions === 'number'
        ? server.listen(portOrOptions, hostname)
        : server.listen(portOrOptions);

    _server
      .once('listening', () => {
        const address = _server.address();
        if (typeof address === 'string') {
          logger.info(`server started at ${address}`);
        } else {
          const isIPv6 = address?.family === 'IPv6';
          const host = isIPv6 ? `[${address?.address}]` : address?.address;
          logger.info(`server started at http://${host}:${address?.port}`);
        }

        resolve(server);
      })
      .once('error', reject);
  });
};

export const close = async (): Promise<void> => {
  const serverClosedPromise = new Promise((resolve) => {
    server.on('close', () => {
      resolve(undefined);
    });
  });

  server.closeAllConnections();
  server.close();

  await serverClosedPromise;
};
