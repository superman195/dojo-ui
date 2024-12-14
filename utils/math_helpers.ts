export const getFirstFourLastFour = (str: string) => {
  if (str === '' || str === null) {
    return '-';
  }
  return `${str.slice(0, 4)}...${str.slice(-4)}`;
};

export const getFirstSixLastSix = (str: string) => {
  if (str === '' || str === null) {
    return '-';
  }
  return `${str.slice(0, 6)}...${str.slice(-6)}`;
};

export const getFirstAndLastCharacters = (str: string, num: number) => {
  if (str === '' || str === null) {
    return '-';
  }
  return `${str.slice(0, num)}...${str.slice(-num)}`;
};

export const makeDollarReadable = (value: string | number, decimalPlace?: number, locale?: string): string => {
  if (!value) return '0';
  if (isNaN(Number(value))) return '0';
  return new Intl.NumberFormat(locale || navigator.language || 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimalPlace || 2,
  }).format(Number(value));
};

/**
 * The concept is to split the number into LHS and RHS.
 * e.g. 19324.83 -> [19] [324]
 * e.g. 218827112 -> [218] [827112]
 * Done using a while loop, it starts slicing 3 number by 3 number from RHS
 * Everytime 3 number is sliced, the suffix moves from k->m or m->b
 * @param value The number to be abbreviated
 * @returns
 */
export const abbreviateNumber = (value?: number) => {
  if (!value) return '0';
  let newValue: string = value.toString();
  if (value < 1000) {
    return newValue;
  }
  const valueRounded = Math.floor(value) + ''; //Removing decimals and convert to string
  const suffixes = ['', 'k', 'm', 'b', 't'];
  let suffixFinalIndex = 0;
  let remainingLHS = valueRounded + '';
  while (remainingLHS.length > 3) {
    remainingLHS = remainingLHS.slice(0, remainingLHS.length - 3);
    suffixFinalIndex++; // Everytime we slice 3 numbers, means suffix go to next one; k->m->b->t
  }
  const remainingRHS = valueRounded.slice(remainingLHS.length, valueRounded.length);
  newValue = `${remainingLHS}.${remainingRHS[0]}${
    remainingRHS.length > 0 && remainingRHS[1]
  }${suffixes[suffixFinalIndex]}`;
  return newValue;
};
