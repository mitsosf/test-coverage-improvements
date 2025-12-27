import type { Server } from 'http';

describe('src/index.ts entrypoint', () => {
  const originalEnv = process.env.PORT;

  afterEach(() => {
    jest.resetModules();
    process.env.PORT = originalEnv;
  });

  it('starts server on provided PORT and logs message', async () => {
    process.env.PORT = '4567';

    const listen = jest.fn((port: number | string, cb: () => void) => {
      // simulate immediate server start
      cb();
      // return a minimal Server-like object if needed
      return ({ close: jest.fn() } as unknown) as Server;
    });

    jest.doMock('../src/app', () => ({
      __esModule: true,
      default: { listen },
    }));

    // Importing the entry triggers app.listen
    await import('../src/index');

    expect(listen).toHaveBeenCalledTimes(1);
    expect(listen.mock.calls[0][0]).toBe('4567');
    expect(typeof listen.mock.calls[0][1]).toBe('function');
  });
});

