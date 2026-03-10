export class RepoError extends Error {
  constructor(
    message: string,
    public readonly entity: string,
    public readonly operation: string
  ) {
    super(message);
    this.name = "RepoError";
  }
}
