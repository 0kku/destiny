let counter = 0;
export function id () {
  return Date.now().toString(36)+counter.toString(36);
}
