
## Getting started

You can use **docsuper** to generate documentation from the command-line interface or [manually](#the-library) parsing, converting or rendering content in a Node application.

### The CLI

Install globally by running:

```sh
npm install -g @lamnhan/docsuper
```

A command now available from the terminal, you can run: `docsuper`.

If you wish to run the CLI locally, install the package with `--save-dev` flag:

```sh
npm install --save-dev @lamnhan/docsuper
```

Then put a script in the `package.json`, so you can do `npm run docs` every build.

```json
{
  "scripts": {
    "docs": "docsuper generate"
  }
}
```

### The library

Install as dev dependency:

```sh
npm install --save-dev @lamnhan/docsuper
```

Use the library:

```ts
import { docsuper } from "@lamnhan/docsuper";

// init an instance
const generator = docsuper(/* Options */);

// parsing
const parsing = generator.parse("Main");

// rendering
const rendering = generator.render({
  section1: ["Options"],
  section2: ["Main"]
});
```

See [Main](#main) for service detail and [Options](#options) for more options.