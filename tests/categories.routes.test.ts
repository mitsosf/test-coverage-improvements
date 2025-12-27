import router from '../src/routes/categories';
import * as categoriesService from '../src/services/categories';

type Handler = (req: any, res: any, next?: any) => any;

function getHandler(method: 'get' | 'post' | 'put' | 'delete', path: string): Handler {
  const stack: any[] = (router as any).stack;
  const layer = stack.find(
    (l) => l.route && l.route.path === path && l.route.methods && l.route.methods[method]
  );
  if (!layer) {
    throw new Error(`Route not found: [${method.toUpperCase()}] ${path}`);
  }
  return layer.route.stack[0].handle;
}

function createRes() {
  const res: any = {};
  res.statusCode = 200;
  res.status = jest.fn().mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });
  res.jsonData = undefined;
  res.json = jest.fn().mockImplementation((data: any) => {
    res.jsonData = data;
    return res;
  });
  res.sendData = undefined;
  res.sent = false;
  res.send = jest.fn().mockImplementation((data?: any) => {
    res.sendData = data;
    res.sent = true;
    return res;
  });
  return res;
}

describe('routes/categories', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('POST / creates a category and returns 201', () => {
    const body = { name: 'Electronics' };
    const created = { id: '1', name: 'Electronics', createdAt: new Date(), updatedAt: new Date() } as any;
    jest.spyOn(categoriesService, 'create').mockReturnValue(created);

    const handler = getHandler('post', '/');
    const req: any = { body };
    const res = createRes();

    handler(req, res);

    expect(categoriesService.create).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('GET / returns all categories', () => {
    const list = [
      { id: '1', name: 'A', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'B', createdAt: new Date(), updatedAt: new Date() },
    ] as any;
    jest.spyOn(categoriesService, 'getAll').mockReturnValue(list);

    const handler = getHandler('get', '/');
    const req: any = {};
    const res = createRes();

    handler(req, res);

    expect(categoriesService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(list);
  });

  it('GET /:id returns 404 when not found', () => {
    jest.spyOn(categoriesService, 'getById').mockReturnValue(undefined);

    const handler = getHandler('get', '/:id');
    const req: any = { params: { id: 'missing' } };
    const res = createRes();

    handler(req, res);

    expect(categoriesService.getById).toHaveBeenCalledWith('missing');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });

  it('GET /:id returns the category when found', () => {
    const item = { id: '3', name: 'C', createdAt: new Date(), updatedAt: new Date() } as any;
    jest.spyOn(categoriesService, 'getById').mockReturnValue(item);

    const handler = getHandler('get', '/:id');
    const req: any = { params: { id: '3' } };
    const res = createRes();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith(item);
  });

  it('PUT /:id returns 404 when update target not found', () => {
    jest.spyOn(categoriesService, 'update').mockReturnValue(undefined);

    const handler = getHandler('put', '/:id');
    const req: any = { params: { id: 'nope' }, body: { name: 'X' } };
    const res = createRes();

    handler(req, res);

    expect(categoriesService.update).toHaveBeenCalledWith('nope', { name: 'X' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });

  it('PUT /:id returns updated category when found', () => {
    const updated = { id: '1', name: 'Updated', createdAt: new Date(), updatedAt: new Date() } as any;
    jest.spyOn(categoriesService, 'update').mockReturnValue(updated);

    const handler = getHandler('put', '/:id');
    const req: any = { params: { id: '1' }, body: { name: 'Updated' } };
    const res = createRes();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('DELETE /:id returns 404 when not found', () => {
    jest.spyOn(categoriesService, 'remove').mockReturnValue(false);

    const handler = getHandler('delete', '/:id');
    const req: any = { params: { id: '404' } };
    const res = createRes();

    handler(req, res);

    expect(categoriesService.remove).toHaveBeenCalledWith('404');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });

  it('DELETE /:id returns 204 when deletion succeeds', () => {
    jest.spyOn(categoriesService, 'remove').mockReturnValue(true);

    const handler = getHandler('delete', '/:id');
    const req: any = { params: { id: 'gone' } };
    const res = createRes();

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});

