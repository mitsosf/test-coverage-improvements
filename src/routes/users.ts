import { Router, Request, Response } from 'express';
import * as usersService from '../services/users';
import { CreateUserInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateUserInput = req.body;
  const user = usersService.create(input);
  res.status(201).json(user);
});

router.get('/', (_req: Request, res: Response) => {
  const users = usersService.getAll();
  res.json(users);
});

router.get('/:id', (req: Request, res: Response) => {
  const user = usersService.getById(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = usersService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = usersService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.status(204).send();
});

export default router;
