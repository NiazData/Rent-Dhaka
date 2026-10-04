// Augment vitest's `expect` so `.toHaveNoViolations()` type-checks after
// `expect.extend(toHaveNoViolations)` in src/test/setup.ts.
import "vitest";

declare module "vitest" {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
}
