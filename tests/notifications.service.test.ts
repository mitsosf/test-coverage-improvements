import * as notificationsService from '../src/services/notifications';

describe('Notifications Service', () => {
  beforeEach(() => {
    notificationsService.clear();
  });

  describe('create', () => {
    it('should create a new notification with generated id', () => {
      const input = { userId: 'user-1', type: 'info' as const, message: 'Test notification', read: false };
      const notification = notificationsService.create(input);

      expect(notification.id).toBeDefined();
      expect(notification.userId).toBe('user-1');
      expect(notification.type).toBe('info');
      expect(notification.message).toBe('Test notification');
      expect(notification.read).toBe(false);
      expect(notification.createdAt).toBeInstanceOf(Date);
      expect(notification.updatedAt).toBeInstanceOf(Date);
    });

    it('should create multiple notifications with unique ids', () => {
      const notif1 = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Message 1', read: false });
      const notif2 = notificationsService.create({ userId: 'user-2', type: 'warning', message: 'Message 2', read: true });

      expect(notif1.id).not.toBe(notif2.id);
    });

    it('should create notification with different types', () => {
      const infoNotif = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Info', read: false });
      const errorNotif = notificationsService.create({ userId: 'user-1', type: 'error', message: 'Error', read: false });
      const successNotif = notificationsService.create({ userId: 'user-1', type: 'success', message: 'Success', read: false });

      expect(infoNotif.type).toBe('info');
      expect(errorNotif.type).toBe('error');
      expect(successNotif.type).toBe('success');
    });
  });

  describe('getById', () => {
    it('should return notification by id', () => {
      const created = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Test', read: false });
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
      notificationsService.create({ userId: 'user-1', type: 'info', message: 'Message 1', read: false });
      notificationsService.create({ userId: 'user-2', type: 'warning', message: 'Message 2', read: false });
      notificationsService.create({ userId: 'user-3', type: 'error', message: 'Message 3', read: true });

      const notifications = notificationsService.getAll();
      expect(notifications).toHaveLength(3);
    });

    it('should return notifications in insertion order', () => {
      const notif1 = notificationsService.create({ userId: 'user-1', type: 'info', message: 'First', read: false });
      const notif2 = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Second', read: false });
      const notif3 = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Third', read: false });

      const all = notificationsService.getAll();
      expect(all[0].message).toBe('First');
      expect(all[1].message).toBe('Second');
      expect(all[2].message).toBe('Third');
    });
  });

  describe('update', () => {
    it('should update existing notification', () => {
      const created = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Test', read: false });
      const updated = notificationsService.update(created.id, { read: true });

      expect(updated).toBeDefined();
      expect(updated!.read).toBe(true);
      expect(updated!.userId).toBe('user-1');
      expect(updated!.message).toBe('Test');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined for non-existent notification', () => {
      const updated = notificationsService.update('non-existent', { read: true });
      expect(updated).toBeUndefined();
    });

    it('should update message and type', () => {
      const created = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Original', read: false });
      const updated = notificationsService.update(created.id, { message: 'Updated', type: 'warning' });

      expect(updated!.message).toBe('Updated');
      expect(updated!.type).toBe('warning');
    });

    it('should preserve other fields when updating', () => {
      const created = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Test', read: false });
      const originalUserId = created.userId;
      const updated = notificationsService.update(created.id, { type: 'success' });

      expect(updated!.userId).toBe(originalUserId);
      expect(updated!.type).toBe('success');
    });
  });

  describe('remove', () => {
    it('should remove existing notification', () => {
      const created = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Test', read: false });
      const deleted = notificationsService.remove(created.id);

      expect(deleted).toBe(true);
      expect(notificationsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent notification', () => {
      const deleted = notificationsService.remove('non-existent');
      expect(deleted).toBe(false);
    });

    it('should not affect other notifications when removing one', () => {
      const notif1 = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Message 1', read: false });
      const notif2 = notificationsService.create({ userId: 'user-1', type: 'info', message: 'Message 2', read: false });

      notificationsService.remove(notif1.id);

      expect(notificationsService.getById(notif2.id)).toBeDefined();
      expect(notificationsService.getAll()).toHaveLength(1);
    });
  });
});
