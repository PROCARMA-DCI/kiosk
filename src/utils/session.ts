const SESSION_KEY = "session_id";
const SESSION_DATE_KEY = "session_date"; // YYYY-MM-DD

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

export const getOrCreateSession = () => {
  if (typeof window === "undefined") return null;

  const today = getToday();

  const session = sessionStorage.getItem(SESSION_KEY);
  const sessionDate = sessionStorage.getItem(SESSION_DATE_KEY);

  // 🔄 New day OR missing session
  if (!session || sessionDate !== today) {
    const newSession = crypto.randomUUID();

    sessionStorage.setItem(SESSION_KEY, newSession);
    sessionStorage.setItem(SESSION_DATE_KEY, today);

    return newSession;
  }

  return session;
};

export const getSessionId = () => {
  if (typeof window === "undefined") return null;

  const today = getToday();

  const session = sessionStorage.getItem(SESSION_KEY);
  const sessionDate = sessionStorage.getItem(SESSION_DATE_KEY);

  // 🔄 Expired → recreate & return immediately
  if (!session || sessionDate !== today) {
    return getOrCreateSession(); // ✅ always returns ID
  }

  return session;
};
