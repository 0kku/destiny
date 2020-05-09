/**
 * An error that is thrown for features that are intended to be implemented, but are not implemented yet.
 */
export class NotImplementedError extends Error {
  /**
   * @param message Additional information about the feature or why it's not supported yet
   */
  constructor (
    message?: string,
  ) {
    super(message);
    this.name = "NotImplementedError";
  }
}
