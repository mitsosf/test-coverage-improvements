import { Router, Request, Response } from 'express';
import * as ordersService from '../services/orders';
import { CreateOrderInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateOrderInput = req.body;
  const order = ordersService.create(input);
  res.status(201).json(order);
});

router.get('/', (_req: Request, res: Response) => {
  const orders = ordersService.getAll();
  res.json(orders);
});

router.get('/:id', (req: Request, res: Response) => {
  const order = ordersService.getById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = ordersService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = ordersService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.status(204).send();
});

export default router;
