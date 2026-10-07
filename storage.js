/* Storage is optional: the estate remains usable when a browser blocks persistence. */
(() => {
  function safeStore(name) {
    const memory = new Map();
    let available = true;
    return {
      getItem(key) {
        try {
          if (available) {
            const value = window[name].getItem(key);
            if (value !== null) memory.set(key, value);else memory.delete(key);
            return value;
          }
        }
        catch { available = false; }
        return memory.get(key) ?? null;
      },
      setItem(key, value) {
        memory.set(key, String(value));
        try { if (available) window[name].setItem(key, String(value)); }
        catch { available = false; }
      },
      removeItem(key) {
        memory.delete(key);
        try { if (available) window[name].removeItem(key); }
        catch { available = false; }
      },
      readJSON(key, fallback) {
        try { return JSON.parse(this.getItem(key)) ?? fallback; }
        catch { return fallback; }
      },
      get available() { return available; }
    };
  }
  window.WellsStorage = safeStore('localStorage');
  window.WellsSession = safeStore('sessionStorage');
})();
