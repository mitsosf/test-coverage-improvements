import { Router } from 'express';
import * as notificationsService from '../src/services/notifications';
import notificationsRouter from '../src/routes/notifications';

// Mock the notifications service
jest.mock('../src/services/notifications');

describe('Notifications Router', () => {
  let mockReq: any;
  let mockRes: any;
  let routeHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();
    notificationsService.clear();

    // Mock Express request and response objects
    mockReq = {
      body: {},
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('POST / - create notification', () => {
    it('should create a notification and return 201 status', () => {
      const input = {
        userId: 'user123',
        type: 'info' as const,
        message: 'Test notification',
        read: false,
      };
      const createdNotification = {
        id: 'notif123',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (notificationsService.create as jest.Mock).mockReturnValue(createdNotification);

      mockReq.body = input;

      // Get the POST route handler
      const stack = (notificationsRouter as any).stack;
      const postRoute = stack.find((layer: any) => layer.route && layer.route.methods.post);
      const handler = postRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.create).toHaveBeenCalledWith(input);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdNotification);
    });
  });

  describe('GET / - get all notifications', () => {
    it('should return all notifications', () => {
      const notifications = [
        {
          id: 'notif1',
          userId: 'user1',
          type: 'info' as const,
          message: 'First notification',
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'notif2',
          userId: 'user2',
          type: 'warning' as const,
          message: 'Second notification',
          read: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (notificationsService.getAll as jest.Mock).mockReturnValue(notifications);

      // Get the GET / route handler (first GET route, not with :id)
      const stack = (notificationsRouter as any).stack;
      const getRoutes = stack.filter((layer: any) => layer.route && layer.route.methods.get);
      const firstGetRoute = getRoutes[0];
      const handler = firstGetRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(notifications);
    });

    it('should return empty array when no notifications exist', () => {
      (notificationsService.getAll as jest.Mock).mockReturnValue([]);

      const stack = (notificationsRouter as any).stack;
      const getRoutes = stack.filter((layer: any) => layer.route && layer.route.methods.get);
      const firstGetRoute = getRoutes[0];
      const handler = firstGetRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe('GET /:id - get notification by id', () => {
    it('should return a notification by id', () => {
      const notification = {
        id: 'notif123',
        userId: 'user123',
        type: 'error' as const,
        message: 'Error notification',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (notificationsService.getById as jest.Mock).mockReturnValue(notification);

      mockReq.params.id = 'notif123';

      const stack = (notificationsRouter as any).stack;
      const getRoutes = stack.filter((layer: any) => layer.route && layer.route.methods.get);
      const paramRoute = getRoutes.find((layer: any) => layer.route.path === '/:id');
      const handler = paramRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.getById).toHaveBeenCalledWith('notif123');
      expect(mockRes.json).toHaveBeenCalledWith(notification);
    });

    it('should return 404 when notification not found', () => {
      (notificationsService.getById as jest.Mock).mockReturnValue(undefined);

      mockReq.params.id = 'nonexistent';

      const stack = (notificationsRouter as any).stack;
      const getRoutes = stack.filter((layer: any) => layer.route && layer.route.methods.get);
      const paramRoute = getRoutes.find((layer: any) => layer.route.path === '/:id');
      const handler = paramRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.getById).toHaveBeenCalledWith('nonexistent');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Notification not found' });
    });
  });

  describe('PUT /:id - update notification', () => {
    it('should update a notification', () => {
      const updateData = {
        message: 'Updated message',
        read: true,
      };
      const updatedNotification = {
        id: 'notif123',
        userId: 'user123',
        type: 'success' as const,
        message: 'Updated message',
        read: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (notificationsService.update as jest.Mock).mockReturnValue(updatedNotification);

      mockReq.params.id = 'notif123';
      mockReq.body = updateData;

      const stack = (notificationsRouter as any).stack;
      const putRoute = stack.find((layer: any) => layer.route && layer.route.methods.put);
      const handler = putRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.update).toHaveBeenCalledWith('notif123', updateData);
      expect(mockRes.json).toHaveBeenCalledWith(updatedNotification);
    });

    it('should return 404 when notification to update not found', () => {
      const updateData = { message: 'Updated' };

      (notificationsService.update as jest.Mock).mockReturnValue(undefined);

      mockReq.params.id = 'nonexistent';
      mockReq.body = updateData;

      const stack = (notificationsRouter as any).stack;
      const putRoute = stack.find((layer: any) => layer.route && layer.route.methods.put);
      const handler = putRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.update).toHaveBeenCalledWith('nonexistent', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Notification not found' });
    });
  });

  describe('DELETE /:id - delete notification', () => {
    it('should delete a notification and return 204 status', () => {
      (notificationsService.remove as jest.Mock).mockReturnValue(true);

      mockReq.params.id = 'notif123';

      const stack = (notificationsRouter as any).stack;
      const deleteRoute = stack.find((layer: any) => layer.route && layer.route.methods.delete);
      const handler = deleteRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.remove).toHaveBeenCalledWith('notif123');
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 when notification to delete not found', () => {
      (notificationsService.remove as jest.Mock).mockReturnValue(false);

      mockReq.params.id = 'nonexistent';

      const stack = (notificationsRouter as any).stack;
      const deleteRoute = stack.find((layer: any) => layer.route && layer.route.methods.delete);
      const handler = deleteRoute.route.stack[0].handle;

      handler(mockReq, mockRes);

      expect(notificationsService.remove).toHaveBeenCalledWith('nonexistent');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Notification not found' });
    });
  });
});
