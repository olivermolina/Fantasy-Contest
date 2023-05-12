import { convertUserAddressToString } from './convertUserAddressToString';

describe('convertUserAddressToString', () => {
  it('returns the correct string conversion of user address  ', () => {
    const expectedResult = `321 Street, Los Angeles, CA, 12345`;

    expect(
      convertUserAddressToString({
        address1: '321 Street',
        address2: '',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '12345',
      }),
    ).toBe(expectedResult);
  });
});
