export function throwError(errorMessage: string): never {
    throw new Error(errorMessage);
}