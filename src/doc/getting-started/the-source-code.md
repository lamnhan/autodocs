A Typescript project source code contains many elements with different kinds: `Variable/Property`, `Function/Method`, `Interface`, `Class`, ...

Imagine your source code has 3 files: `file1.ts`, `file2.ts`, `file3.ts`. Each file exports certain elements.

But you can see your whole source code as a single flattened file like this:

```ts
// ================== file1.ts ==================

/**
 * This is a Variable element named `PI`
 */
export const PI = 3.14;

// ================== file2.ts ==================

/**
 * This is a Function element named `doSomething`
 */
export function doSomething() {
  return true;
}

// ================== file3.ts ==================

/**
 * This is an Interface element named `Options`
 *
 * And this is the `Options` element detail.
 *
 * Supports Markdown content.
 */
export interface Options {
  /**
   * This is a Property element named `prop1`
   */
  prop1?: string;
  prop2?: number;
}

/**
 * This is a Class element named `Lib`
 *
 * And this is the `Lib` element detail.
 *
 * Supports Markdown content.
 */
export class Lib {
  property = "a property";
  constructor() {}
  /**
   * This is a Method element named `method1`
   */
  method1() {
    return "a method";
  }
}
```

To get information, we turn any element of the source code into a [[Declaration]] (a source code unit). There are 2 types of [[Declaration]]:

- **Direct**: for top level elements, such as: `Variable`, `Function`, `Interface`, `Class` and a `Collection` of any top level elements.
- **Indirect**: for child elements of a top level element, such as: `Property` and `Method`.
