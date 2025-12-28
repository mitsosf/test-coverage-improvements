import http from 'http';
import app from '../src/app';

describe('App', () => {
  let server: http.Server;

  afterEach((done) => {
    if (server && server.listening) {
      server.close(() => done());
    } else {
      done();
    }
  });

  it('responds to GET /health with status and timestamp', async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Failed to get server address');
    }

    const { port } = address;

    const body = await new Promise<string>((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/health', method: 'GET' },
        (res) => {
          expect(res.statusCode).toBe(200);
          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        }
      );
      req.on('error', reject);
      req.end();
    });

    const json = JSON.parse(body);
    expect(json.status).toBe('ok');
    expect(typeof json.timestamp).toBe('string');
    // Validate ISO timestamp shape roughly
    expect(() => new Date(json.timestamp).toISOString()).not.toThrow();
  });
});

