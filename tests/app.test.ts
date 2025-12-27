import app from '../src/app';

describe('App', () => {
  it('exports an initialized express app', () => {
    expect(app).toBeDefined();
    expect(typeof (app as any).use).toBe('function');
  });

  it('responds with health status and timestamp', async () => {
    const handler = (() => {
      const stack = (app as any)?._router?.stack || [];
      for (const layer of stack) {
        if (layer?.route && layer.route.path === '/health') {
          const methodLayer = layer.route.stack.find((s: any) => s.method === 'get');
          return methodLayer?.handle;
        }
      }
      return null;
    })();

    expect(handler).toBeInstanceOf(Function);

    const result = await new Promise<any>((resolve) => {
      const res = {
        json: (body: any) => resolve(body),
      } as any;

      // Minimal mock req; handler doesn't use it
      const req = {} as any;
      (handler as Function)(req, res);
    });

    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.timestamp).toBe('string');
    // Validate ISO 8601 string
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});

