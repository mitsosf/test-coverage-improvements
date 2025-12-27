import express from 'express';
import http from 'http';

// Mock the comments service used by the router
jest.mock('../src/services/comments', () => {
  const fns = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  return { __esModule: true, ...fns };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commentsService = require('../src/services/comments');

function startServer(app: express.Express) {
  return new Promise<{ server: http.Server; url: string }>((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });
}

function requestJSON(method: string, url: string, path: string, body?: unknown): Promise<{ status: number; json: any; text: string }>{
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : undefined;
    const req = http.request(
      new URL(path, url),
      {
        method,
        headers: {
          'content-type': 'application/json',
          'content-length': data ? String(data.length) : '0',
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          try {
            const json = text ? JSON.parse(text) : undefined;
            resolve({ status: res.statusCode || 0, json, text });
          } catch {
            resolve({ status: res.statusCode || 0, json: undefined, text });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

describe('routes/comments', () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
  });

  it('POST / creates a comment and returns 201', async () => {
    const router = (await import('../src/routes/comments')).default;
    app.use('/', router);

    const mock = { id: 'c1', content: 'Nice', createdAt: 'x', updatedAt: 'y' };
    commentsService.create.mockReturnValue(mock);

    const { server, url } = await startServer(app);
    const res = await requestJSON('POST', url, '/', { content: 'Nice' });
    server.close();

    expect(commentsService.create).toHaveBeenCalledWith({ content: 'Nice' });
    expect(res.status).toBe(201);
    expect(res.json).toEqual(mock);
  });

  it('GET / returns all comments', async () => {
    const router = (await import('../src/routes/comments')).default;
    app.use('/', router);

    const items = [{ id: 'a' }];
    commentsService.getAll.mockReturnValue(items);

    const { server, url } = await startServer(app);
    const res = await requestJSON('GET', url, '/');
    server.close();

    expect(commentsService.getAll).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.json).toEqual(items);
  });

  it('GET /:id returns item when found, else 404', async () => {
    const router = (await import('../src/routes/comments')).default;
    app.use('/', router);

    commentsService.getById.mockReturnValueOnce({ id: 'x' }).mockReturnValueOnce(undefined);

    const { server, url } = await startServer(app);
    const ok = await requestJSON('GET', url, '/123');
    const notFound = await requestJSON('GET', url, '/456');
    server.close();

    expect(ok.status).toBe(200);
    expect(ok.json).toEqual({ id: 'x' });
    expect(notFound.status).toBe(404);
    expect(notFound.json).toEqual({ error: 'Comment not found' });
  });

  it('PUT /:id updates when found, else 404', async () => {
    const router = (await import('../src/routes/comments')).default;
    app.use('/', router);

    commentsService.update
      .mockReturnValueOnce({ id: 'u1', content: 'n1' })
      .mockReturnValueOnce(undefined);

    const { server, url } = await startServer(app);
    const ok = await requestJSON('PUT', url, '/u1', { content: 'n1' });
    const notFound = await requestJSON('PUT', url, '/missing', { content: 'n2' });
    server.close();

    expect(commentsService.update).toHaveBeenCalledWith('u1', { content: 'n1' });
    expect(ok.status).toBe(200);
    expect(ok.json).toEqual({ id: 'u1', content: 'n1' });
    expect(notFound.status).toBe(404);
    expect(notFound.json).toEqual({ error: 'Comment not found' });
  });

  it('DELETE /:id returns 204 when removed, else 404', async () => {
    const router = (await import('../src/routes/comments')).default;
    app.use('/', router);

    commentsService.remove.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const { server, url } = await startServer(app);
    const ok = await requestJSON('DELETE', url, '/d1');
    const notFound = await requestJSON('DELETE', url, '/missing');
    server.close();

    expect(commentsService.remove).toHaveBeenCalledWith('d1');
    expect(ok.status).toBe(204);
    expect(ok.text).toBe('');
    expect(notFound.status).toBe(404);
    expect(notFound.json).toEqual({ error: 'Comment not found' });
  });
});

