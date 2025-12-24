import * as usersService from '../src/services/users';

describe('Users Service', () => {
  beforeEach(() => {
    usersService.clear();
  });

  describe('create', () => {
    it('should create a new user with generated id', () => {
      const input = { email: 'test@example.com', name: 'Test User', role: 'user' as const };
      const user = usersService.create(input);

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('user');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create multiple users with unique ids', () => {
      const user1 = usersService.create({ email: 'user1@example.com', name: 'User 1', role: 'user' });
      const user2 = usersService.create({ email: 'user2@example.com', name: 'User 2', role: 'admin' });

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('getById', () => {
    it('should return user by id', () => {
      const created = usersService.create({ email: 'test@example.com', name: 'Test', role: 'user' });
      const found = usersService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = usersService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no users', () => {
      const users = usersService.getAll();
      expect(users).toEqual([]);
    });

    it('should return all users', () => {
      usersService.create({ email: 'user1@example.com', name: 'User 1', role: 'user' });
      usersService.create({ email: 'user2@example.com', name: 'User 2', role: 'admin' });
      usersService.create({ email: 'user3@example.com', name: 'User 3', role: 'guest' });

      const users = usersService.getAll();
      expect(users).toHaveLength(3);
    });
  });

  describe('update', () => {
    it('should update existing user', () => {
      const created = usersService.create({ email: 'test@example.com', name: 'Test', role: 'user' });
      const updated = usersService.update(created.id, { name: 'Updated Name' });

      expect(updated).toBeDefined();
      expect(updated!.name).toBe('Updated Name');
      expect(updated!.email).toBe('test@example.com');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined for non-existent user', () => {
      const updated = usersService.update('non-existent', { name: 'Test' });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove existing user', () => {
      const created = usersService.create({ email: 'test@example.com', name: 'Test', role: 'user' });
      const deleted = usersService.remove(created.id);

      expect(deleted).toBe(true);
      expect(usersService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent user', () => {
      const deleted = usersService.remove('non-existent');
      expect(deleted).toBe(false);
    });
  });
});
