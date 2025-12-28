import * as logsService from '../src/services/logs';

describe('Logs Service', () => {
  beforeEach(() => {
    logsService.clear();
  });

  describe('create', () => {
    it('should create a log entry with required fields', () => {
      const input = { level: 'info' as const, message: 'App started', metadata: { port: 3000 } };
      const log = logsService.create(input);

      expect(log.id).toBeDefined();
      expect(log.level).toBe('info');
      expect(log.message).toBe('App started');
      expect(log.metadata).toEqual({ port: 3000 });
      expect(log.createdAt).toBeInstanceOf(Date);
      expect(log.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return a log by id', () => {
      const created = logsService.create({ level: 'error', message: 'Failure', metadata: { code: 500 } });

      const found = logsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for missing id', () => {
      const found = logsService.getById('missing-log');
      expect(found).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no logs exist', () => {
      const logs = logsService.getAll();
      expect(logs).toEqual([]);
    });

    it('should return all log entries', () => {
      logsService.create({ level: 'debug', message: 'Debugging', metadata: { trace: true } });
      logsService.create({ level: 'warn', message: 'Warning', metadata: { context: 'startup' } });

      const logs = logsService.getAll();

      expect(logs).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should merge updates into an existing log', () => {
      const created = logsService.create({ level: 'info', message: 'Initial', metadata: { count: 1 } });

      const updated = logsService.update(created.id, { message: 'Updated', metadata: { count: 2 } });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.level).toBe('info');
      expect(updated!.message).toBe('Updated');
      expect(updated!.metadata).toEqual({ count: 2 });
      expect(updated!.createdAt).toEqual(created.createdAt);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined when updating non-existent log', () => {
      const updated = logsService.update('missing', { message: 'No-op' });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should delete an existing log', () => {
      const created = logsService.create({ level: 'warn', message: 'Remove me', metadata: {} });

      const deleted = logsService.remove(created.id);

      expect(deleted).toBe(true);
      expect(logsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent log', () => {
      const deleted = logsService.remove('missing-log');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all logs', () => {
      logsService.create({ level: 'info', message: 'To be cleared', metadata: {} });

      logsService.clear();

      expect(logsService.getAll()).toEqual([]);
    });
  });
});
