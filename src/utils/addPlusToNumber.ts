/**
 * Will add a plus sign to any positive number.
 */
export function addPlusToNumber(num: number) {
  if (num > 0) {
    return `+${num}`;
  }
  return num;
}
