import { createSession, getSession, updateSession } from './store';

describe('Store', () => {
  it('should create and retrieve a session', () => {
    const session = createSession('123');
    expect(session.id).toBe('123');
    expect(getSession('123')).toEqual(session);
  });

  it('should update a session', () => {
    createSession('123');
    updateSession('123', { code: 'new code' });
    const session = getSession('123');
    expect(session?.code).toBe('new code');
  });

  it('should return undefined for non-existent session', () => {
    expect(getSession('999')).toBeUndefined();
  });
});
