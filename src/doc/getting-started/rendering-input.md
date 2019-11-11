
### Rendering input

Take a look at the `s1` section configuration above. We see it holds an array of values: `["Main", "SELF"]`. This array is called **a rendering input**.

A rendering input provide instructions for [the Parser](#parser) and [the Converter](#converter), it has 3 parts:

- The **WHAT**: tells [the Parser](#parser) to parse what source code element:
  - Top level elements: provide the name of the element, example: `PI`, `Options`, ...
  - Child elements: put a `.` between the parent and the child name, example: `Options.prop1`, `Main.method1`, ...
  - Collection of elements: the list of paths, `@` for `./src/` and separated by `+`, example: `@file1.ts+@lib/filex.ts`
- The **HOW** (optional, default to `SELF`): tells [the Converter](#converter) how we want to extract the information from the parsing result.
- The **options** (optional): custom converter options, see [ConverterOptions](https://lamnhan.com/docsuper/interfaces/converteroptions.html).

See [the Parser](#parser) for parsing detail and [the Converter](#converter) for converting detail.
