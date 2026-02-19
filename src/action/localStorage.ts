export const setLocalStorageDealerID = (id: string) => {
  localStorage.setItem("dealer_id", id);
};

export const getLocalStorageDealerID = () => {
  return localStorage.getItem("dealer_id");
};

export const removeLocalStorageDealerID = () => {
  localStorage.removeItem("dealer_id");
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
