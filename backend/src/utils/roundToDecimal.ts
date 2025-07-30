export function roundToDecimals(value: number, decimals = 2): number {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("Number of decimals must be a positive integer");
  }

  if (typeof value !== "number") {
    throw new Error("Value to round is not a number");
  }

  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
