import express from 'express';
import http from 'http';
import commentsRouter from '../src/routes/comments';
import * as commentsService from '../src/services/comments';

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

function request(
  port: number,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; text: string; json?: any }> {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : undefined;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data ? data.length : 0,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json: any | undefined;
          try {
            json = text ? JSON.parse(text) : undefined;
          } catch (_) {
            // ignore parse error, return text as is
          }
          resolve({ status: res.statusCode || 0, text, json });
        });
      },
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

describe('comments routes', () => {
  let server: http.Server;
  let port: number;

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use('/comments', commentsRouter);
    const started = await startTestServer(app);
    server = started.server;
    port = started.port;
  });

  afterAll(async () => {
    await new Promise((r) => server.close(() => r(undefined)));
  });

  beforeEach(() => {
    commentsService.clear();
  });

  it('POST /comments creates a comment (201)', async () => {
    const payload = { userId: 'u1', postId: 'p1', content: 'hello', likes: 0 };
    const res = await request(port, 'POST', '/comments', payload);
    expect(res.status).toBe(201);
    expect(res.json).toBeDefined();
    expect(res.json.id).toBeDefined();
    expect(res.json.content).toBe('hello');
    expect(typeof res.json.createdAt).toBe('string');
    expect(typeof res.json.updatedAt).toBe('string');
  });

  it('GET /comments returns all comments (200)', async () => {
    // create one first
    await request(port, 'POST', '/comments', { userId: 'u2', postId: 'p2', content: 'c2', likes: 1 });
    const res = await request(port, 'GET', '/comments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.json)).toBe(true);
    expect(res.json.length).toBe(1);
  });

  it('GET /comments/:id returns comment when found (200)', async () => {
    const created = await request(port, 'POST', '/comments', { userId: 'u3', postId: 'p3', content: 'c3', likes: 2 });
    const id = created.json.id as string;
    const res = await request(port, 'GET', `/comments/${id}`);
    expect(res.status).toBe(200);
    expect(res.json.id).toBe(id);
    expect(res.json.content).toBe('c3');
  });

  it('GET /comments/:id returns 404 when not found', async () => {
    const res = await request(port, 'GET', '/comments/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.json).toEqual({ error: 'Comment not found' });
  });

  it('PUT /comments/:id updates existing comment (200)', async () => {
    const created = await request(port, 'POST', '/comments', { userId: 'u4', postId: 'p4', content: 'old', likes: 0 });
    const id = created.json.id as string;
    const res = await request(port, 'PUT', `/comments/${id}`, { content: 'new' });
    expect(res.status).toBe(200);
    expect(res.json.content).toBe('new');
  });

  it('PUT /comments/:id returns 404 when not found', async () => {
    const res = await request(port, 'PUT', '/comments/missing', { content: 'x' });
    expect(res.status).toBe(404);
    expect(res.json).toEqual({ error: 'Comment not found' });
  });

  it('DELETE /comments/:id deletes existing comment (204)', async () => {
    const created = await request(port, 'POST', '/comments', { userId: 'u5', postId: 'p5', content: 'to-del', likes: 3 });
    const id = created.json.id as string;
    const res = await request(port, 'DELETE', `/comments/${id}`);
    expect(res.status).toBe(204);
    expect(res.text).toBe('');
  });

  it('DELETE /comments/:id returns 404 when not found', async () => {
    const res = await request(port, 'DELETE', '/comments/absent');
    expect(res.status).toBe(404);
    expect(res.json).toEqual({ error: 'Comment not found' });
  });
});

