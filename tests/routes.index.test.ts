import type { Router as ExpressRouter } from 'express';

describe('Routes Index', () => {
  const setup = () => {
    jest.resetModules();

    const useMock = jest.fn();
    const routerInstance = { use: useMock } as unknown as ExpressRouter;
    const routerFactory = jest.fn(() => routerInstance);

    jest.doMock('express', () => ({
      __esModule: true,
      Router: routerFactory,
    }));

    const routeModules: Record<string, ExpressRouter> = {
      users: { name: 'usersRouter' } as unknown as ExpressRouter,
      products: { name: 'productsRouter' } as unknown as ExpressRouter,
      orders: { name: 'ordersRouter' } as unknown as ExpressRouter,
      comments: { name: 'commentsRouter' } as unknown as ExpressRouter,
      tags: { name: 'tagsRouter' } as unknown as ExpressRouter,
      categories: { name: 'categoriesRouter' } as unknown as ExpressRouter,
      reviews: { name: 'reviewsRouter' } as unknown as ExpressRouter,
      notifications: { name: 'notificationsRouter' } as unknown as ExpressRouter,
      settings: { name: 'settingsRouter' } as unknown as ExpressRouter,
      logs: { name: 'logsRouter' } as unknown as ExpressRouter,
    };

    Object.entries(routeModules).forEach(([name, mockRouter]) => {
      jest.doMock(`../src/routes/${name}`, () => ({
        __esModule: true,
        default: mockRouter,
      }));
    });

    let importedRouter: ExpressRouter | undefined;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      importedRouter = require('../src/routes').default as ExpressRouter;
    });

    return { useMock, routerInstance, routerFactory, routeModules, importedRouter: importedRouter! };
  };

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('creates a router and mounts all sub-routers on expected paths', () => {
    const { useMock, routerInstance, routerFactory, routeModules, importedRouter } = setup();

    expect(routerFactory).toHaveBeenCalledTimes(1);
    expect(importedRouter).toBe(routerInstance);

    const expectedCalls: Array<[string, ExpressRouter]> = [
      ['/users', routeModules.users],
      ['/products', routeModules.products],
      ['/orders', routeModules.orders],
      ['/comments', routeModules.comments],
      ['/tags', routeModules.tags],
      ['/categories', routeModules.categories],
      ['/reviews', routeModules.reviews],
      ['/notifications', routeModules.notifications],
      ['/settings', routeModules.settings],
      ['/logs', routeModules.logs],
    ];

    expect(useMock).toHaveBeenCalledTimes(expectedCalls.length);
    expectedCalls.forEach(([path, router], index) => {
      expect(useMock).toHaveBeenNthCalledWith(index + 1, path, router);
    });
  });
});
