export function throwExpression(
  message: string,
  ErrorType = Error,
): never {
  throw new ErrorType(message);
}
