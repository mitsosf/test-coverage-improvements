import type { Server } from 'http';
import express from 'express';
import categoriesRouter from '../src/routes/categories';
import * as categoriesService from '../src/services/categories';

describe('Categories routes', () => {
  let server!: Server;
  let baseUrl!: string;

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use('/categories', categoriesRouter);

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        const port = typeof address === 'object' && address ? address.port : 0;
        baseUrl = `http://127.0.0.1:${port}/categories`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err?: Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });

  beforeEach(() => {
    categoriesService.clear();
  });

  const jsonRequest = (path: string, options: any = {}) =>
    fetch(`${baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

  const createCategory = async (name = 'Books', description = 'Reading') => {
    const response = await jsonRequest('', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    const body = await response.json();
    return { response, body };
  };

  it('creates a category', async () => {
    const { response, body } = await createCategory('Movies', 'Films');

    expect(response.status).toBe(201);
    expect(body.name).toBe('Movies');
    expect(body.description).toBe('Films');
    expect(body.id).toBeDefined();
  });

  it('lists all categories', async () => {
    await createCategory('A', 'One');
    await createCategory('B', 'Two');

    const response = await jsonRequest('', { method: 'GET' });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body.map((category: any) => category.name)).toEqual(['A', 'B']);
  });

  it('retrieves a category by id', async () => {
    const { body: created } = await createCategory('Music', 'Songs');

    const response = await jsonRequest(`/${created.id}`, { method: 'GET' });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe(created.id);
    expect(body.name).toBe('Music');
  });

  it('returns 404 when category is missing', async () => {
    const response = await jsonRequest('/unknown-id', { method: 'GET' });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Category not found' });
  });

  it('updates an existing category', async () => {
    const { body: created } = await createCategory('Games', 'Board games');

    const response = await jsonRequest(`/${created.id}`, {
      method: 'PUT',
      body: JSON.stringify({ description: 'Video games' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.description).toBe('Video games');
    expect(body.name).toBe('Games');
    expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(new Date(created.updatedAt).getTime());
  });

  it('returns 404 when updating missing category', async () => {
    const response = await jsonRequest('/missing', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Nope' }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Category not found' });
  });

  it('deletes an existing category', async () => {
    const { body: created } = await createCategory('DeleteMe', 'Temp');

    const response = await jsonRequest(`/${created.id}`, { method: 'DELETE' });

    expect(response.status).toBe(204);
    expect(categoriesService.getById(created.id)).toBeUndefined();
  });

  it('returns 404 when deleting missing category', async () => {
    const response = await jsonRequest('/missing', { method: 'DELETE' });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Category not found' });
  });
});
