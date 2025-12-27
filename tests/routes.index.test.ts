import express from 'express';
import http from 'http';
import appRoutes from '../src/routes';
import * as users from '../src/services/users';
import * as products from '../src/services/products';
import * as orders from '../src/services/orders';
import * as comments from '../src/services/comments';
import * as tags from '../src/services/tags';
import * as categories from '../src/services/categories';
import * as reviews from '../src/services/reviews';
import * as notifications from '../src/services/notifications';
import * as settings from '../src/services/settings';
import * as logs from '../src/services/logs';

function startTestServer(app: express.Express): Promise<{ server: http.Server; port: number }> {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, () => {
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      resolve({ server, port });
    });
  });
}

function get(port: number, path: string): Promise<{ status: number }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'GET',
      },
      (res) => {
        // Drain response
        res.resume();
        res.on('end', () => resolve({ status: res.statusCode || 0 }));
      },
    );
    req.on('error', reject);
    req.end();
  });
}

describe('routes index mounts subrouters', () => {
  let server: http.Server;
  let port: number;

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use('/api', appRoutes);
    const started = await startTestServer(app);
    server = started.server;
    port = started.port;
  });

  afterAll(async () => {
    await new Promise((r) => server.close(() => r(undefined)));
  });

  beforeEach(() => {
    users.clear();
    products.clear();
    orders.clear();
    comments.clear();
    tags.clear();
    categories.clear();
    reviews.clear();
    notifications.clear();
    settings.clear();
    logs.clear();
  });

  it('mounts all routers at expected prefixes', async () => {
    const checks = [
      '/api/users',
      '/api/products',
      '/api/orders',
      '/api/comments',
      '/api/tags',
      '/api/categories',
      '/api/reviews',
      '/api/notifications',
      '/api/settings',
      '/api/logs',
    ];

    for (const path of checks) {
      const res = await get(port, path);
      expect(res.status).toBe(200);
    }
  });
});

