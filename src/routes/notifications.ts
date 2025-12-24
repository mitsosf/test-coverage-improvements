import { Router, Request, Response } from 'express';
import * as notificationsService from '../services/notifications';
import { CreateNotificationInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateNotificationInput = req.body;
  const notification = notificationsService.create(input);
  res.status(201).json(notification);
});

router.get('/', (_req: Request, res: Response) => {
  const notifications = notificationsService.getAll();
  res.json(notifications);
});

router.get('/:id', (req: Request, res: Response) => {
  const notification = notificationsService.getById(req.params.id);
  if (!notification) {
    res.status(404).json({ error: 'Notification not found' });
    return;
  }
  res.json(notification);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = notificationsService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Notification not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = notificationsService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Notification not found' });
    return;
  }
  res.status(204).send();
});

export default router;
