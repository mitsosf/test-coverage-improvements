import app from '../src/app';

describe('Server Entry Point', () => {
  it('should import app successfully', () => {
    expect(app).toBeDefined();
  });

  it('should have app listening configured', () => {
    expect(app.listen).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });
});
