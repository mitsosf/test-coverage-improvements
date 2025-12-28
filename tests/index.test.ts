const listenMock = jest.fn();

jest.mock('../src/app', () => ({
  __esModule: true,
  default: { listen: listenMock },
}));

describe('index bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    listenMock.mockReset();
    listenMock.mockImplementation((_port: unknown, cb?: () => void) => {
      cb?.();
      return {} as unknown;
    });
  });

  afterEach(() => {
    delete process.env.PORT;
    jest.restoreAllMocks();
  });

  it('uses the PORT environment variable when provided', () => {
    process.env.PORT = '5555';
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../src/index');
    });

    expect(listenMock).toHaveBeenCalledWith('5555', expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith('Server running on port 5555');
  });

  it('falls back to port 3000 when PORT is not set', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../src/index');
    });

    expect(listenMock).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith('Server running on port 3000');
  });
});
