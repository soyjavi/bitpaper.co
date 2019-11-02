const localStorage = (typeof window !== 'undefined' && window.localStorage)
  ? window.localStorage
  : { getItem: () => {}, setItem: () => {} };

export default class storageAdapter {
  constructor({ defaults = {}, filename }) {
    this.key = filename;
    if (!localStorage.getItem(this.key)) localStorage.setItem(this.key, JSON.stringify(defaults));

    return this;
  }

  read() {
    const { key } = this;
    let data;

    try {
      data = JSON.parse(localStorage.getItem(key));
    } catch (error) {
      throw new Error(`${key} could not be loaded correctly.`);
    }

    return data;
  }

  write(data = {}) {
    const { key } = this;

    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      throw new Error(`${key} could not be saved correctly.`);
    }
  }
}
