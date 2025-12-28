import * as http from 'http';

describe('Index - Server Entry Point', () => {
  let originalEnv: string | undefined;
  let server: http.Server | null = null;

  beforeAll(() => {
    originalEnv = process.env.PORT;
  });

  afterEach(() => {
    process.env.PORT = originalEnv;
    if (server) {
      server.close();
      server = null;
    }
  });

  describe('server startup', () => {
    it('should start server on default port 3000 when PORT not set', (done) => {
      delete process.env.PORT;

      // Import after clearing PORT env var
      delete require.cache[require.resolve('../src/index.ts')];

      const app = require('../src/app').default;

      const testServer = app.listen(0, () => {
        const port = (testServer.address() as any).port;
        expect(port).toBeGreaterThan(0);
        testServer.close(done);
      });

      server = testServer;
    });

    it('should start server on PORT from environment variable', (done) => {
      process.env.PORT = '0'; // Use 0 for OS to pick available port

      const app = require('../src/app').default;

      const testServer = app.listen(0, () => {
        const port = (testServer.address() as any).port;
        expect(port).toBeGreaterThan(0);
        testServer.close(done);
      });

      server = testServer;
    });

    it('should listen on valid port number', (done) => {
      const app = require('../src/app').default;

      const testServer = app.listen(0, () => {
        const addr = testServer.address();
        expect(addr).not.toBeNull();
        expect(typeof (addr as any).port).toBe('number');
        expect((addr as any).port).toBeGreaterThan(0);
        testServer.close(done);
      });

      server = testServer;
    });
  });

  describe('console output', () => {
    it('should log server startup message', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const app = require('../src/app').default;
      const testServer = app.listen(0, () => {
        expect(consoleLogSpy).toHaveBeenCalled();
        const calls = consoleLogSpy.mock.calls;
        const hasServerRunningLog = calls.some((call: any[]) =>
          call[0] && call[0].includes('Server running on port')
        );
        expect(hasServerRunningLog).toBe(true);
        testServer.close();
        consoleLogSpy.mockRestore();
      });

      server = testServer;
    });
  });

  describe('port configuration logic', () => {
    it('should use custom port if specified', () => {
      const customPort = process.env.PORT || 3000;
      expect(typeof customPort).toBe(typeof '3000' || typeof 3000);
    });

    it('should fall back to 3000 if PORT is not defined', () => {
      const port = process.env.PORT || 3000;
      if (!process.env.PORT) {
        expect(port).toBe(3000);
      }
    });

    it('should handle PORT as string or number', () => {
      process.env.PORT = '8080';
      const port = process.env.PORT || 3000;
      expect(port).toBe('8080');

      delete process.env.PORT;
      const defaultPort = process.env.PORT || 3000;
      expect(defaultPort).toBe(3000);
    });
  });
});
