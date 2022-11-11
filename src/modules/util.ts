export const isLetter = (char: string) => {
  return char && char.toLowerCase() !== char.toUpperCase();
};
export const isDigit = (char: string) => {
  return char >= "0" && char <= "9";
};
