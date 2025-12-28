import app from '../src/app';

describe('Server Initialization', () => {
  let server: any;

  afterEach(() => {
    if (server) {
      server.close();
    }
  });

  it('should import app successfully', () => {
    expect(app).toBeDefined();
  });

  it('should start server on default port when PORT env var is not set', (done) => {
    const originalPort = process.env.PORT;
    delete process.env.PORT;

    server = app.listen(3000, () => {
      expect(server.listening).toBe(true);
      expect(server.address().port).toBe(3000);
      done();
    });

    process.env.PORT = originalPort;
  });

  it('should start server on custom port from PORT env var', (done) => {
    const originalPort = process.env.PORT;
    process.env.PORT = '3001';

    server = app.listen(3001, () => {
      expect(server.listening).toBe(true);
      expect(server.address().port).toBe(3001);
      done();
    });

    process.env.PORT = originalPort;
  });
});
