import { pseudoRandomEncode } from "./pseudoRandomEncode.ts";

const idEncoder = pseudoRandomEncode(2n ** 20n, 387_420_489n);

/**
 * Generates up to 2**20 (~1M) IDs that are unique across the session.
 */
export function* pseudoRandomIdGenerator (): Generator<string, never, never> {
  let i = 0n;
  while (true) {
    // Intentionally skip the first one because 0n converts to "0"
    yield idEncoder(++i).toString(36);
  }
}
