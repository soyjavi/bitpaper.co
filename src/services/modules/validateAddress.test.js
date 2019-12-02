import validateAddress from './validateAddress';

describe('validateAddress', () => {
  it('default', () => {
    expect(validateAddress).toBeDefined();
    expect(validateAddress()).toEqual(undefined);
  });

  it('giving a valid bitcoin address', async () => {
    // P2PKH
    expect(validateAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2')).toBeDefined();
    // P2SH
    expect(validateAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')).toBeDefined();
    // Bech32
    expect(validateAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBeDefined();
  });

  it('giving and array without the mandatory interface', async () => {
    try {
      validateAddress('invalid-address');
    } catch (error) {
      expect(error.message).toEqual('invalid-address has no matching Script');
    }
  });
});
