import * as notificationsService from '../src/services/notifications';

describe('Notifications Service', () => {
  beforeEach(() => {
    notificationsService.clear();
  });

  describe('create', () => {
    it('should create a new notification with generated id', () => {
      const input = {
        userId: 'user-123',
        type: 'info' as const,
        message: 'Test notification',
        read: false,
      };
      const notification = notificationsService.create(input);

      expect(notification.id).toBeDefined();
      expect(notification.userId).toBe('user-123');
      expect(notification.type).toBe('info');
      expect(notification.message).toBe('Test notification');
      expect(notification.read).toBe(false);
      expect(notification.createdAt).toBeInstanceOf(Date);
      expect(notification.updatedAt).toBeInstanceOf(Date);
    });

    it('should create multiple notifications with unique ids', () => {
      const notification1 = notificationsService.create({
        userId: 'user-1',
        type: 'success',
        message: 'Notification 1',
        read: false,
      });
      const notification2 = notificationsService.create({
        userId: 'user-2',
        type: 'error',
        message: 'Notification 2',
        read: true,
      });

      expect(notification1.id).not.toBe(notification2.id);
    });

    it('should create notification with different types', () => {
      const types: Array<'info' | 'warning' | 'error' | 'success'> = [
        'info',
        'warning',
        'error',
        'success',
      ];

      types.forEach((type) => {
        const notification = notificationsService.create({
          userId: `user-${type}`,
          type,
          message: `${type} message`,
          read: false,
        });

        expect(notification.type).toBe(type);
      });
    });
  });

  describe('getById', () => {
    it('should return notification by id', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const found = notificationsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = notificationsService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no notifications', () => {
      const notifications = notificationsService.getAll();
      expect(notifications).toEqual([]);
    });

    it('should return all notifications', () => {
      notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'Notification 1',
        read: false,
      });
      notificationsService.create({
        userId: 'user-2',
        type: 'warning',
        message: 'Notification 2',
        read: false,
      });
      notificationsService.create({
        userId: 'user-3',
        type: 'error',
        message: 'Notification 3',
        read: true,
      });

      const notifications = notificationsService.getAll();
      expect(notifications).toHaveLength(3);
    });

    it('should return notifications in insertion order', () => {
      const notification1 = notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'First',
        read: false,
      });
      const notification2 = notificationsService.create({
        userId: 'user-2',
        type: 'info',
        message: 'Second',
        read: false,
      });

      const all = notificationsService.getAll();
      expect(all[0].id).toBe(notification1.id);
      expect(all[1].id).toBe(notification2.id);
    });
  });

  describe('update', () => {
    it('should update existing notification', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const updated = notificationsService.update(created.id, {
        message: 'Updated message',
      });

      expect(updated).toBeDefined();
      expect(updated!.message).toBe('Updated message');
      expect(updated!.userId).toBe('user-123');
      expect(updated!.type).toBe('info');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime()
      );
    });

    it('should update read status', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const updated = notificationsService.update(created.id, { read: true });

      expect(updated).toBeDefined();
      expect(updated!.read).toBe(true);
    });

    it('should update notification type', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const updated = notificationsService.update(created.id, {
        type: 'warning',
      });

      expect(updated).toBeDefined();
      expect(updated!.type).toBe('warning');
    });

    it('should return undefined for non-existent notification', () => {
      const updated = notificationsService.update('non-existent', {
        message: 'Test',
      });
      expect(updated).toBeUndefined();
    });

    it('should update multiple fields at once', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Original',
        read: false,
      });
      const updated = notificationsService.update(created.id, {
        message: 'Updated',
        type: 'success',
        read: true,
      });

      expect(updated).toBeDefined();
      expect(updated!.message).toBe('Updated');
      expect(updated!.type).toBe('success');
      expect(updated!.read).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove existing notification', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const deleted = notificationsService.remove(created.id);

      expect(deleted).toBe(true);
      expect(notificationsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent notification', () => {
      const deleted = notificationsService.remove('non-existent');
      expect(deleted).toBe(false);
    });

    it('should remove notification from getAll', () => {
      const notification1 = notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'Notification 1',
        read: false,
      });
      notificationsService.create({
        userId: 'user-2',
        type: 'info',
        message: 'Notification 2',
        read: false,
      });

      notificationsService.remove(notification1.id);
      const all = notificationsService.getAll();

      expect(all).toHaveLength(1);
      expect(all[0].id).not.toBe(notification1.id);
    });
  });

  describe('clear', () => {
    it('should clear all notifications', () => {
      notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'Notification 1',
        read: false,
      });
      notificationsService.create({
        userId: 'user-2',
        type: 'info',
        message: 'Notification 2',
        read: false,
      });

      notificationsService.clear();
      const notifications = notificationsService.getAll();

      expect(notifications).toEqual([]);
    });

    it('should allow creating notifications after clear', () => {
      notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'Notification 1',
        read: false,
      });
      notificationsService.clear();

      const newNotification = notificationsService.create({
        userId: 'user-2',
        type: 'success',
        message: 'New Notification',
        read: false,
      });

      const all = notificationsService.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe(newNotification.id);
    });
  });
});
