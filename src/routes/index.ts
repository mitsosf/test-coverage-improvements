import { Router } from 'express';
import usersRouter from './users';
import productsRouter from './products';
import ordersRouter from './orders';
import commentsRouter from './comments';
import tagsRouter from './tags';
import categoriesRouter from './categories';
import reviewsRouter from './reviews';
import notificationsRouter from './notifications';
import settingsRouter from './settings';
import logsRouter from './logs';

const router = Router();

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/comments', commentsRouter);
router.use('/tags', tagsRouter);
router.use('/categories', categoriesRouter);
router.use('/reviews', reviewsRouter);
router.use('/notifications', notificationsRouter);
router.use('/settings', settingsRouter);
router.use('/logs', logsRouter);

export default router;
