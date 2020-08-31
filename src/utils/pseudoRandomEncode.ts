/**
 * Makes sequential numbers appear random.
 * @param count   Maximum number of items
 * @param coprime A coperime of count which is also greater than count
 */
export const pseudoRandomEncode = (
  count: bigint,
  coprime: bigint,
) => (
  seed: bigint,
): bigint => seed * coprime % count;
