import http from 'http';
import app from '../src/app';

// Helper to start and stop a server around the express app
let server: http.Server;
let port: number;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  port = address.port as number;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

function request(method: string, path: string, body?: any): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }>
{
  return new Promise((resolve, reject) => {
    const data = body !== undefined ? JSON.stringify(body) : undefined;
    const options: http.RequestOptions = {
      host: '127.0.0.1',
      port,
      path,
      method,
      headers: data
        ? {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
          }
        : undefined,
    };

    const req = http.request(options, (res) => {
      let chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

describe('app.ts', () => {
  it('initializes express app and middleware', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('GET /health returns ok with ISO timestamp', async () => {
    const res = await request('GET', '/health');
    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.status).toBe('ok');
    expect(typeof json.timestamp).toBe('string');
    // Validate parsable ISO-like timestamp
    expect(Number.isNaN(Date.parse(json.timestamp))).toBe(false);
  });

  it('POST /api/users accepts JSON body via express.json()', async () => {
    const payload = { name: 'Alice', email: 'alice@example.com' };
    const res = await request('POST', '/api/users', payload);
    expect(res.statusCode).toBe(201);
    const json = JSON.parse(res.body);
    expect(json).toHaveProperty('id');
    expect(json.name).toBe(payload.name);
    expect(json.email).toBe(payload.email);
  });
});

