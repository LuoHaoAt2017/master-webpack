let storage = {};

window.localStorage = {
  getItem(key) {
    return storage[key];
  },
  setItem(key, value) {
    storage[key] = value;
  },
  clear() {
    storage = {};
  },
};