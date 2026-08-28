export const StorageKeys = {
  DEALER_ID: "dealer_id",
  SCREENS: "screens",
  SELECTED_SCREEN: "selected_screen",
} as const;

export const setLocalStorageItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getLocalStorageItem = (key: string) => {
  return localStorage.getItem(key);
};

export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const setLocalStorageDealerID = (id: string) =>
  setLocalStorageItem(StorageKeys.DEALER_ID, id);

export const getLocalStorageDealerID = () =>
  getLocalStorageItem(StorageKeys.DEALER_ID);

export const removeLocalStorageDealerID = () =>
  removeLocalStorageItem(StorageKeys.DEALER_ID);

export const setLocalStorageSelectedScreen = (screen: unknown) =>
  setLocalStorageItem(StorageKeys.SELECTED_SCREEN, JSON.stringify(screen));

export const getLocalStorageSelectedScreen = <T = unknown>(): T | null => {
  const stored = getLocalStorageItem(StorageKeys.SELECTED_SCREEN);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
};

export const removeLocalStorageSelectedScreen = () =>
  removeLocalStorageItem(StorageKeys.SELECTED_SCREEN);

export const setLocalStorageScreens = (screens: unknown) =>
  setLocalStorageItem(StorageKeys.SCREENS, JSON.stringify(screens));

export const getLocalStorageScreens = <T = unknown>(): T | null => {
  const stored = getLocalStorageItem(StorageKeys.SCREENS);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
};

export const removeLocalStorageScreens = () =>
  removeLocalStorageItem(StorageKeys.SCREENS);
