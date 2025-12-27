import http from 'http';
import app from '../src/app';

describe('App', () => {
  it('should export an Express app', () => {
    expect(app).toBeDefined();
    // Express apps are functions with HTTP methods like get/post
    expect(typeof (app as any).get).toBe('function');
  });

  it('GET /health should return ok status and ISO timestamp', async () => {
    const server = app.listen(0);
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;

    const resBody: any = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/health', method: 'GET' },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            try {
              const bodyStr = Buffer.concat(chunks).toString('utf8');
              expect(res.statusCode).toBe(200);
              const json = JSON.parse(bodyStr);
              resolve(json);
            } catch (err) {
              reject(err);
            }
          });
        }
      );
      req.on('error', reject);
      req.end();
    }).finally(() => {
      server.close();
    });

    expect(resBody).toHaveProperty('status', 'ok');
    expect(typeof resBody.timestamp).toBe('string');
    // Basic ISO 8601 check ending with Z
    expect(resBody.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T[^Z]+Z$/);
  });
});

