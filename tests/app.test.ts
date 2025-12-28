import http from 'http';
import app from '../src/app';
import * as usersService from '../src/services/users';

describe('App', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll((done) => {
    server = app.listen(0, () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        baseUrl = `http://127.0.0.1:${address.port}`;
      }
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    usersService.clear();
  });

  const requestJson = (
    path: string,
    options?: { method?: string; body?: unknown; headers?: Record<string, string> }
  ): Promise<{ status: number; body: any }> =>
    new Promise((resolve, reject) => {
      const json = options?.body ? JSON.stringify(options.body) : undefined;
      const req = http.request(
        `${baseUrl}${path}`,
        {
          method: options?.method ?? 'GET',
          headers: {
            ...(json ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(json).toString() } : {}),
            ...options?.headers,
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          });
          res.on('end', () => {
            const text = Buffer.concat(chunks).toString();
            const parsed = text ? JSON.parse(text) : undefined;
            resolve({ status: res.statusCode ?? 0, body: parsed });
          });
        }
      );

      req.on('error', reject);
      if (json) {
        req.write(json);
      }
      req.end();
    });

  it('returns ok status and timestamp from /health', async () => {
    const response = await requestJson('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(Date.parse(response.body.timestamp)).not.toBeNaN();
  });

  it('routes API requests and parses JSON bodies', async () => {
    const response = await requestJson('/api/users', {
      method: 'POST',
      body: { email: 'test@example.com', name: 'Test User', role: 'user' },
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('test@example.com');
    expect(response.body.name).toBe('Test User');
    expect(response.body.id).toBeDefined();
    expect(usersService.getAll()).toHaveLength(1);
  });
});
