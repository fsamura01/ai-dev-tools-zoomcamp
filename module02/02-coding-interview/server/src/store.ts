export interface Session {
  id: string;
  language: 'javascript' | 'python';
  code: string;
  output: string;
}

// In-memory store: sessionId -> Session
// Ideally this would be a database (Redis/Postgres)
const sessions: Map<string, Session> = new Map();

export const getSession = (id: string): Session | undefined => {
  return sessions.get(id);
};

export const createSession = (id: string): Session => {
  const session: Session = {
    id,
    language: 'javascript',
    code: '// Start coding here\nconsole.log("Hello World");',
    output: '',
  };
  sessions.set(id, session);
  return session;
};

export const updateSession = (id: string, updates: Partial<Session>) => {
  const session = sessions.get(id);
  if (session) {
    sessions.set(id, { ...session, ...updates });
  }
};
