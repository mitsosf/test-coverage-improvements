import { Router, Request, Response } from 'express';
import * as settingsService from '../services/settings';
import { CreateSettingsInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateSettingsInput = req.body;
  const settings = settingsService.create(input);
  res.status(201).json(settings);
});

router.get('/', (_req: Request, res: Response) => {
  const settings = settingsService.getAll();
  res.json(settings);
});

router.get('/:id', (req: Request, res: Response) => {
  const settings = settingsService.getById(req.params.id);
  if (!settings) {
    res.status(404).json({ error: 'Settings not found' });
    return;
  }
  res.json(settings);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = settingsService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Settings not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = settingsService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Settings not found' });
    return;
  }
  res.status(204).send();
});

export default router;
