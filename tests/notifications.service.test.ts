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
        type: 'info',
        message: 'Notification 1',
        read: false,
      });
      const notification2 = notificationsService.create({
        userId: 'user-2',
        type: 'warning',
        message: 'Notification 2',
        read: true,
      });

      expect(notification1.id).not.toBe(notification2.id);
    });

    it('should create notifications with different types', () => {
      const types = ['info', 'warning', 'error', 'success'] as const;
      const notifications = types.map((type) =>
        notificationsService.create({
          userId: 'user-123',
          type,
          message: `${type} message`,
          read: false,
        })
      );

      expect(notifications[0].type).toBe('info');
      expect(notifications[1].type).toBe('warning');
      expect(notifications[2].type).toBe('error');
      expect(notifications[3].type).toBe('success');
    });

    it('should set createdAt and updatedAt to the same time', () => {
      const notification = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });

      expect(notification.createdAt.getTime()).toBe(notification.updatedAt.getTime());
    });
  });

  describe('getById', () => {
    it('should return notification by id', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test notification',
        read: false,
      });
      const found = notificationsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = notificationsService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });

    it('should return notification after creation', () => {
      const created = notificationsService.create({
        userId: 'user-456',
        type: 'error',
        message: 'Error notification',
        read: true,
      });

      const found = notificationsService.getById(created.id);
      expect(found).toBeDefined();
      expect(found!.userId).toBe('user-456');
      expect(found!.type).toBe('error');
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
        read: true,
      });
      notificationsService.create({
        userId: 'user-3',
        type: 'error',
        message: 'Notification 3',
        read: false,
      });

      const notifications = notificationsService.getAll();
      expect(notifications).toHaveLength(3);
    });

    it('should return notifications in the same order they were created', () => {
      const notif1 = notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'First',
        read: false,
      });
      const notif2 = notificationsService.create({
        userId: 'user-2',
        type: 'warning',
        message: 'Second',
        read: false,
      });

      const all = notificationsService.getAll();
      expect(all[0].id).toBe(notif1.id);
      expect(all[1].id).toBe(notif2.id);
    });
  });

  describe('update', () => {
    it('should update existing notification', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Original message',
        read: false,
      });
      const updated = notificationsService.update(created.id, {
        message: 'Updated message',
        read: true,
      });

      expect(updated).toBeDefined();
      expect(updated!.message).toBe('Updated message');
      expect(updated!.read).toBe(true);
      expect(updated!.userId).toBe('user-123');
      expect(updated!.type).toBe('info');
      expect(updated!.id).toBe(created.id);
    });

    it('should update updatedAt timestamp', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const originalUpdatedAt = created.updatedAt.getTime();

      // Small delay to ensure time difference
      const updated = notificationsService.update(created.id, {
        read: true,
      });

      expect(updated).toBeDefined();
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt);
    });

    it('should return undefined for non-existent notification', () => {
      const updated = notificationsService.update('non-existent', {
        message: 'Test',
      });
      expect(updated).toBeUndefined();
    });

    it('should update only specified fields', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'warning',
        message: 'Original',
        read: false,
      });
      const updated = notificationsService.update(created.id, {
        message: 'Updated only message',
      });

      expect(updated!.message).toBe('Updated only message');
      expect(updated!.userId).toBe('user-123');
      expect(updated!.type).toBe('warning');
      expect(updated!.read).toBe(false);
    });

    it('should allow updating notification type', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const updated = notificationsService.update(created.id, {
        type: 'success',
      });

      expect(updated!.type).toBe('success');
    });

    it('should allow updating read status', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const updated = notificationsService.update(created.id, { read: true });

      expect(updated!.read).toBe(true);
    });

    it('should preserve createdAt when updating', () => {
      const created = notificationsService.create({
        userId: 'user-123',
        type: 'info',
        message: 'Test',
        read: false,
      });
      const originalCreatedAt = created.createdAt.getTime();

      const updated = notificationsService.update(created.id, {
        message: 'New message',
      });

      expect(updated!.createdAt.getTime()).toBe(originalCreatedAt);
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

    it('should remove notification from getAll results', () => {
      const notif1 = notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'Notification 1',
        read: false,
      });
      const notif2 = notificationsService.create({
        userId: 'user-2',
        type: 'warning',
        message: 'Notification 2',
        read: false,
      });

      notificationsService.remove(notif1.id);

      const all = notificationsService.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe(notif2.id);
    });

    it('should not affect other notifications when removing one', () => {
      const notif1 = notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'Notification 1',
        read: false,
      });
      const notif2 = notificationsService.create({
        userId: 'user-2',
        type: 'warning',
        message: 'Notification 2',
        read: false,
      });
      const notif3 = notificationsService.create({
        userId: 'user-3',
        type: 'error',
        message: 'Notification 3',
        read: false,
      });

      notificationsService.remove(notif2.id);

      const all = notificationsService.getAll();
      expect(all).toHaveLength(2);
      expect(all.some((n) => n.id === notif1.id)).toBe(true);
      expect(all.some((n) => n.id === notif3.id)).toBe(true);
      expect(all.some((n) => n.id === notif2.id)).toBe(false);
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
        type: 'warning',
        message: 'Notification 2',
        read: false,
      });

      notificationsService.clear();

      const all = notificationsService.getAll();
      expect(all).toEqual([]);
    });

    it('should allow creating new notifications after clear', () => {
      notificationsService.create({
        userId: 'user-1',
        type: 'info',
        message: 'Notification 1',
        read: false,
      });

      notificationsService.clear();

      const newNotif = notificationsService.create({
        userId: 'user-2',
        type: 'success',
        message: 'New Notification',
        read: true,
      });

      expect(newNotif).toBeDefined();
      expect(notificationsService.getAll()).toHaveLength(1);
    });

    it('should clear all notifications even with many', () => {
      for (let i = 0; i < 10; i++) {
        notificationsService.create({
          userId: `user-${i}`,
          type: 'info',
          message: `Notification ${i}`,
          read: false,
        });
      }

      notificationsService.clear();

      expect(notificationsService.getAll()).toEqual([]);
    });
  });
});
