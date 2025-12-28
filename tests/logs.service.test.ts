import * as logsService from '../src/services/logs';

describe('Logs Service', () => {
  beforeEach(() => {
    logsService.clear();
  });

  describe('create', () => {
    it('should create a log entry with timestamps and id', () => {
      const input = { level: 'info' as const, message: 'Started process', metadata: { context: 'init' } };

      const log = logsService.create(input);

      expect(log.id).toBeDefined();
      expect(log.level).toBe('info');
      expect(log.message).toBe('Started process');
      expect(log.metadata).toEqual({ context: 'init' });
      expect(log.createdAt).toBeInstanceOf(Date);
      expect(log.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return the log when it exists', () => {
      const created = logsService.create({ level: 'error', message: 'Failure', metadata: { code: 500 } });

      const found = logsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for missing log', () => {
      const found = logsService.getById('unknown-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no logs exist', () => {
      const all = logsService.getAll();
      expect(all).toEqual([]);
    });

    it('should return all logs', () => {
      logsService.create({ level: 'debug', message: 'Debug 1', metadata: {} });
      logsService.create({ level: 'warn', message: 'Warn 1', metadata: { retry: true } });

      const all = logsService.getAll();

      expect(all).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update an existing log and refresh updatedAt', () => {
      const created = logsService.create({ level: 'info', message: 'Initial', metadata: { step: 1 } });

      const updated = logsService.update(created.id, { message: 'Updated message', metadata: { step: 2 } });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.level).toBe('info');
      expect(updated!.message).toBe('Updated message');
      expect(updated!.metadata).toEqual({ step: 2 });
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined when updating a missing log', () => {
      const updated = logsService.update('missing-log', { message: 'No-op' });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an existing log', () => {
      const created = logsService.create({ level: 'warn', message: 'Removable', metadata: { reason: 'cleanup' } });

      const removed = logsService.remove(created.id);

      expect(removed).toBe(true);
      expect(logsService.getById(created.id)).toBeUndefined();
    });

    it('should return false when removing non-existent log', () => {
      const removed = logsService.remove('not-there');
      expect(removed).toBe(false);
    });
  });
});
