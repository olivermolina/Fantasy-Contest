interface Address {
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

export const convertUserAddressToString = (address: Address) => {
  const { address1, address2, city, state, postalCode } = address;
  const components = [];

  if (address1) {
    components.push(address1);
  }

  if (address2) {
    components.push(address2);
  }

  if (city) {
    components.push(city);
  }

  if (state) {
    components.push(state);
  }

  if (postalCode) {
    components.push(postalCode);
  }

  const addressString = components.join(', ');

  return addressString;
};
