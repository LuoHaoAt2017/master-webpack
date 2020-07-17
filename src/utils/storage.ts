const StorageHelper = {
  get (key) {
    const val = localStorage.getItem(key);
    if (val) {
      return JSON.parse(val) as any;
    }
    return null;
  },
  set (key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  clear (key) {
    localStorage.removeItem(key);
  },
  setExpire(key, value) {
    // 默认过期时间为一天
    let obj = {
      data: value,
      time: this.getFormatDate()
    }
    localStorage.setItem(key, JSON.stringify(obj));
  },
  getExpire(key) {
    const val = localStorage.getItem(key);
    if (val) {
      const obj = JSON.parse(val);
      if (this.getFormatDate() !== obj.time) {
        localStorage.removeItem(key);
        return null;
      }
      return obj.data;
    }
    return null;
  },
  getFormatDate() {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth();
    const date = current.getDate();
    return year + month + date;
  }
};

export default StorageHelper;