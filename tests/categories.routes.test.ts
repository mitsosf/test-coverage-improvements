import router from '../src/routes/categories';
import * as categoriesService from '../src/services/categories';

jest.mock('../src/services/categories');

type Handler = (req: any, res: any, next?: any) => any;

function getHandler(method: string, path: string): Handler {
  // @ts-ignore access internal Express Router stack for testing
  const stack = router.stack as any[];
  for (const layer of stack) {
    if (layer.route && layer.route.path === path && layer.route.methods[method]) {
      return layer.route.stack[0].handle as Handler;
    }
  }
  throw new Error(`Handler not found for ${method.toUpperCase()} ${path}`);
}

function createMockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.body = undefined;
  res.sent = false;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: any) => {
    res.body = payload;
    return res;
  };
  res.send = (payload?: any) => {
    res.body = payload;
    res.sent = true;
    return res;
  };
  return res;
}

describe('Categories Routes', () => {
  const svc = categoriesService as jest.Mocked<typeof categoriesService>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('POST / creates a category and returns 201', () => {
    const input = { name: 'Gadgets', description: 'All gadgets' };
    const created = { id: '1', ...input, createdAt: new Date(), updatedAt: new Date() } as any;
    svc.create.mockReturnValue(created);

    const handler = getHandler('post', '/');
    const req = { body: input } as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.create).toHaveBeenCalledWith(input);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(created);
  });

  it('GET / returns all categories', () => {
    const categories = [
      { id: '1', name: 'A', description: 'a', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'B', description: 'b', createdAt: new Date(), updatedAt: new Date() },
    ] as any;
    svc.getAll.mockReturnValue(categories);

    const handler = getHandler('get', '/');
    const req = {} as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.getAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(categories);
  });

  it('GET /:id returns category when found', () => {
    const found = { id: 'abc', name: 'X', description: 'x', createdAt: new Date(), updatedAt: new Date() } as any;
    svc.getById.mockReturnValue(found);

    const handler = getHandler('get', '/:id');
    const req = { params: { id: 'abc' } } as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.getById).toHaveBeenCalledWith('abc');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(found);
  });

  it('GET /:id returns 404 when not found', () => {
    svc.getById.mockReturnValue(undefined as any);

    const handler = getHandler('get', '/:id');
    const req = { params: { id: 'missing' } } as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.getById).toHaveBeenCalledWith('missing');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Category not found' });
  });

  it('PUT /:id updates category when found', () => {
    const updateInput = { name: 'Updated' } as any;
    const updated = { id: 'abc', name: 'Updated', description: 'x', createdAt: new Date(), updatedAt: new Date() } as any;
    svc.update.mockReturnValue(updated);

    const handler = getHandler('put', '/:id');
    const req = { params: { id: 'abc' }, body: updateInput } as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.update).toHaveBeenCalledWith('abc', updateInput);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updated);
  });

  it('PUT /:id returns 404 when not found', () => {
    svc.update.mockReturnValue(undefined as any);

    const handler = getHandler('put', '/:id');
    const req = { params: { id: 'missing' }, body: { name: 'Nope' } } as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.update).toHaveBeenCalledWith('missing', { name: 'Nope' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Category not found' });
  });

  it('DELETE /:id returns 204 when removed', () => {
    svc.remove.mockReturnValue(true);

    const handler = getHandler('delete', '/:id');
    const req = { params: { id: 'gone' } } as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.remove).toHaveBeenCalledWith('gone');
    expect(res.statusCode).toBe(204);
    expect(res.sent).toBe(true);
  });

  it('DELETE /:id returns 404 when not found', () => {
    svc.remove.mockReturnValue(false);

    const handler = getHandler('delete', '/:id');
    const req = { params: { id: 'missing' } } as any;
    const res = createMockRes();

    handler(req, res);

    expect(svc.remove).toHaveBeenCalledWith('missing');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Category not found' });
  });
});

