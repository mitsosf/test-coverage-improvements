describe('Server entry (src/index.ts)', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.clearAllMocks();
  });

  it('imports app and starts listening on env PORT', () => {
    const listen = jest.fn((_port: number | string, cb?: () => void) => {
      if (cb) cb();
      return {} as any;
    });

    jest.doMock('../src/app', () => ({
      __esModule: true,
      default: { listen },
    }));

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    process.env.PORT = '4001';

    // Import the entry after mocks & env are set
    // This should execute the import (covering line 1) and call listen
    require('../src/index');

    expect(listen).toHaveBeenCalledWith('4001', expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith('Server running on port 4001');
  });
});

