You can use **ayedocs** to generate documentation from the command-line interface or manually parsing, converting or rendering content in a Node application.

## The CLI

Install globally by running:

```sh
npm install -g @lamnhan/ayedocs
```

A command now available from the terminal, you can run: `ayedocs`.

If you wish to run the CLI locally, install the package with `--save-dev` flag:

```sh
npm install --save-dev @lamnhan/ayedocs
```

Then put a script in the `package.json`, so you can do `npm run docs` every build.

```json
{
  "scripts": {
    "docs": "ayedocs generate"
  }
}
```

## The library

Install as dev dependency:

```sh
npm install --save-dev @lamnhan/ayedocs
```

Use the library:

```ts
import { ayedocs } from "@lamnhan/ayedocs";

// init an instance
const generator = ayedocs(/* Options */);

// parsing
const parsing = generator.parse("Main");

// rendering
const rendering = generator.render({
  section1: ["Options"],
  section2: ["Main"]
});
```

See [[Main]] for service detail and [[Options]] for more options.
