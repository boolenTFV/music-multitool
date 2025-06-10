export const exhaustiveMatchGuard = (value: never): never => {
    throw new Error("Exhaustive match guard" + value);
}