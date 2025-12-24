import { Router, Request, Response } from 'express';
import * as productsService from '../services/products';
import { CreateProductInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateProductInput = req.body;
  const product = productsService.create(input);
  res.status(201).json(product);
});

router.get('/', (_req: Request, res: Response) => {
  const products = productsService.getAll();
  res.json(products);
});

router.get('/:id', (req: Request, res: Response) => {
  const product = productsService.getById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = productsService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = productsService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.status(204).send();
});

export default router;
