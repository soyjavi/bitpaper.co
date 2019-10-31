import C from './constants';

const { CACHE } = C;

class Cache {
  constructor() {
    this.store = {};
    this.interval = {};

    setInterval(() => {
      Object.keys(this.interval).map((key) => {
        this.interval[key] -= 1;
        if (this.interval[key] < 0) {
          delete this.interval[key];
          delete this.store[key];
        }

        return this;
      });
    }, 1000);
  }

  get(key) {
    return this.interval[key] ? this.store[key] : undefined;
  }

  set(key, value, seconds = CACHE) {
    this.store[key] = value;
    this.interval[key] = seconds;

    return value;
  }

  wipe() {
    this.store = {};
    this.interval = {};
  }

  get status() {
    return {
      keys: this.interval,
      bytes: JSON.stringify(this.store).length * 2,
    };
  }
}

export default new Cache();
