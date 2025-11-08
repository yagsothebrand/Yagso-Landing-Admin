export const getStored = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const saveStored = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const addToStored = (key, item) => {
  const list = getStored(key);
  const exists = list.some((p) => p.id === item.id);

  if (!exists) {
    list.push(item);
    saveStored(key, list);
  }

  return !exists;
};
