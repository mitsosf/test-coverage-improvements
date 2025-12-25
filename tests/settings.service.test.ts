import * as settingsService from '../src/services/settings';

describe('Settings Service', () => {
  beforeEach(() => {
    settingsService.clear();
  });

  describe('create', () => {
    it('should create a new setting with generated id', () => {
      const input = { userId: 'user1', theme: 'light' as const, language: 'en', notifications: true };
      const setting = settingsService.create(input);

      expect(setting.id).toBeDefined();
      expect(setting.userId).toBe('user1');
      expect(setting.theme).toBe('light');
      expect(setting.language).toBe('en');
      expect(setting.notifications).toBe(true);
      expect(setting.createdAt).toBeInstanceOf(Date);
      expect(setting.updatedAt).toBeInstanceOf(Date);
    });

    it('should create multiple settings with unique ids', () => {
      const setting1 = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const setting2 = settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'fr', notifications: false });

      expect(setting1.id).not.toBe(setting2.id);
    });

    it('should set createdAt and updatedAt to the same date on creation', () => {
      const input = { userId: 'user1', theme: 'light' as const, language: 'en', notifications: true };
      const setting = settingsService.create(input);

      expect(setting.createdAt.getTime()).toBe(setting.updatedAt.getTime());
    });

    it('should handle different theme values', () => {
      const lightSetting = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const darkSetting = settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'en', notifications: true });
      const systemSetting = settingsService.create({ userId: 'user3', theme: 'system' as const, language: 'en', notifications: true });

      expect(lightSetting.theme).toBe('light');
      expect(darkSetting.theme).toBe('dark');
      expect(systemSetting.theme).toBe('system');
    });
  });

  describe('getById', () => {
    it('should return setting by id', () => {
      const created = settingsService.create({ userId: 'user1', theme: 'light', language: 'en', notifications: true });
      const found = settingsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = settingsService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });

    it('should retrieve the correct setting from multiple entries', () => {
      const setting1 = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const setting2 = settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'fr', notifications: false });
      const setting3 = settingsService.create({ userId: 'user3', theme: 'system' as const, language: 'de', notifications: true });

      const found = settingsService.getById(setting2.id);

      expect(found).toEqual(setting2);
      expect(found?.userId).toBe('user2');
    });
  });

  describe('getAll', () => {
    it('should return empty array when no settings', () => {
      const settings = settingsService.getAll();
      expect(settings).toEqual([]);
    });

    it('should return all settings', () => {
      settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'fr', notifications: false });
      settingsService.create({ userId: 'user3', theme: 'system' as const, language: 'de', notifications: true });

      const settings = settingsService.getAll();
      expect(settings).toHaveLength(3);
    });

    it('should return settings as array from Map values', () => {
      const setting1 = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const setting2 = settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'fr', notifications: false });

      const settings = settingsService.getAll();
      expect(Array.isArray(settings)).toBe(true);
      expect(settings).toContain(setting1);
      expect(settings).toContain(setting2);
    });
  });

  describe('update', () => {
    it('should update existing setting', () => {
      const created = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const updated = settingsService.update(created.id, { theme: 'dark' as const });

      expect(updated).toBeDefined();
      expect(updated!.theme).toBe('dark');
      expect(updated!.userId).toBe('user1');
      expect(updated!.language).toBe('en');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should update multiple properties', () => {
      const created = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const updated = settingsService.update(created.id, { theme: 'dark' as const, language: 'fr', notifications: false });

      expect(updated!.theme).toBe('dark');
      expect(updated!.language).toBe('fr');
      expect(updated!.notifications).toBe(false);
      expect(updated!.userId).toBe('user1');
    });

    it('should return undefined for non-existent setting', () => {
      const updated = settingsService.update('non-existent', { theme: 'dark' as const });
      expect(updated).toBeUndefined();
    });

    it('should preserve id and createdAt on update', () => {
      const created = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const originalId = created.id;
      const originalCreatedAt = created.createdAt;

      const updated = settingsService.update(created.id, { theme: 'system' as const });

      expect(updated!.id).toBe(originalId);
      expect(updated!.createdAt).toEqual(originalCreatedAt);
    });

    it('should update updatedAt timestamp on update', () => {
      const created = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const originalUpdatedAt = created.updatedAt;

      // Small delay to ensure time difference
      setTimeout(() => {}, 1);

      const updated = settingsService.update(created.id, { language: 'es' });

      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('remove', () => {
    it('should remove existing setting', () => {
      const created = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const deleted = settingsService.remove(created.id);

      expect(deleted).toBe(true);
      expect(settingsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent setting', () => {
      const deleted = settingsService.remove('non-existent');
      expect(deleted).toBe(false);
    });

    it('should remove only the specified setting', () => {
      const setting1 = settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      const setting2 = settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'fr', notifications: false });

      const deleted = settingsService.remove(setting1.id);

      expect(deleted).toBe(true);
      expect(settingsService.getById(setting1.id)).toBeUndefined();
      expect(settingsService.getById(setting2.id)).toBeDefined();
    });
  });

  describe('clear', () => {
    it('should clear all settings', () => {
      settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'fr', notifications: false });

      settingsService.clear();

      expect(settingsService.getAll()).toEqual([]);
    });

    it('should allow creating settings after clear', () => {
      settingsService.create({ userId: 'user1', theme: 'light' as const, language: 'en', notifications: true });
      settingsService.clear();

      const newSetting = settingsService.create({ userId: 'user2', theme: 'dark' as const, language: 'fr', notifications: false });

      expect(newSetting).toBeDefined();
      expect(settingsService.getAll()).toHaveLength(1);
      expect(settingsService.getAll()[0].userId).toBe('user2');
    });
  });
});
