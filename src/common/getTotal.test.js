import getTotal from './getTotal';

describe('getTotal', () => {
  it('default', () => {
    expect(getTotal).toBeDefined();
    expect(getTotal()).toEqual(0);
  });

  it('giving and empty array', async () => {
    expect(getTotal([])).toEqual(0);
  });

  it('giving and array without the mandatory interface', async () => {
    expect(getTotal([
      { id: 1 },
      { id: 2 },
     ])).toEqual(0);
  });

  it('giving and array with the mandatory interface', async () => {
    expect(getTotal([
      { quantity: 1, price: 100 },
      { quantity: 3, price: 25 },
      { quantity: 3, price: -5 },
     ])).toEqual(160);
  });
});
