import type { Router } from 'express';

describe('routes/index router mounting', () => {
  it('exports an express Router with all sub-routers mounted', async () => {
    const router: Router = (await import('../src/routes/index')).default as any;

    expect(typeof router).toBe('function');

    // Express router exposes internal stack of layers
    const stack: any[] = (router as any).stack || [];
    const layers = stack.filter((l) => l && l.regexp);

    const expected = [
      'users',
      'products',
      'orders',
      'comments',
      'tags',
      'categories',
      'reviews',
      'notifications',
      'settings',
      'logs',
    ];

    for (const seg of expected) {
      const found = layers.some((l) => new RegExp(`\\/${seg}\\/?`).test(String(l.regexp)));
      expect(found).toBe(true);
    }
  });
});

