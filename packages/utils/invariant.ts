/* eslint-disable no-console */
export default function invariant(
  condition: any,
  message?: string
): asserts condition {
  if (process.env.NODE_ENV !== "production" && !condition) {
    console.error(`[transquant-fe]: ${message}`);
  }
}
