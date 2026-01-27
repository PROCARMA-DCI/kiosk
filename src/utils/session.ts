const SESSION_KEY = "session_id";
const SESSION_DATE_KEY = "session_date"; // YYYY-MM-DD

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

export const getOrCreateSession = () => {
  if (typeof window === "undefined") return null;

  const newSession = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, newSession);

  return newSession;
};

export const getSessionId = () => {
  if (typeof window === "undefined") return null;

  let session = sessionStorage.getItem(SESSION_KEY);

  // Create only if missing
  if (!session) {
    session = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, session);
  }

  return session;
};
