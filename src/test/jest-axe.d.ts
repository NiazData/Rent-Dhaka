// jest-axe ships no TypeScript declarations (v9 dropped the hand-rolled index.d.ts
// that @types/jest-axe was written against). This minimal shim covers the subset
// of the API this project uses: `axe()` and the `toHaveNoViolations` matcher.
declare module "jest-axe" {
  import type { AxeResults, RunOptions, Spec } from "axe-core";

  export interface JestAxeConfigureOptions extends RunOptions {
    globalOptions?: Spec;
  }

  export function configureAxe(
    options?: JestAxeConfigureOptions
  ): (html: Element | string, options?: JestAxeConfigureOptions) => Promise<AxeResults>;

  export const axe: ReturnType<typeof configureAxe>;

  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): {
      pass: boolean;
      message(): string;
    };
  };
}
