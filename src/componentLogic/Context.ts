// @ts-ignore The type argument T is not used within the class for anything, but it is used to infer the appropriate type for the associated context value externally.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Context <out T> {
  // @ts-ignore This "unused variable" is used to avoid literally anything non-nullish being assignable to Context, since it doesn't have any properties otherwise. Accidentally using objects that aren't Contexts would prevent type inference described above from working.
  #brand!: undefined;
}
