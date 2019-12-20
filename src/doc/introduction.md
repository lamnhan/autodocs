Documentation is a crucial part of every great open-source projects. But making docs is such a Pain-In-The-Brain process.

Since [Typescript](https://www.typescriptlang.org) is an self documenting language, we can leverage its power to extract the source code information. This library is based on [Typedoc](https://typedoc.org), one of the best tool for generating Typescript documentation.

**ayedocs** is a tool for generating documentation directly from the source code. It can be used to generate standalone markdown files or a full documentation website.

## Use cases

We can always manually create files with content. But for some situations, using **ayedocs** can be very helpful.

### Listing options

Options usually defined by an interface, example:

```ts
interface Options {
  option1: string;
  option2?: boolean;
  // ...
}
```

You may document it by copy the source code, because it is Typescript so any developer can understand what you mean.

Or, using **ayedocs** you can output a listing table of the options with a simple config:

```ts
{
  options: ['Options', 'SUMMARY_PROPERTIES'],
}
```

### Listing methods

Just like showing the options, instead of manually copy and paste every method od a class with it **type**, **parameters**, ...

You can listing methods of a class by providing a config:

```ts
{
  main: ['Main', 'DETAIL_METHODS']
}
```

### Listing commands for CLI apps

Using our recommended structure for CLI apps, you can extract the list of commands easily with the `cli` template:

```ts
{
  template: 'cli',
}
```

### Listing modules, services, components, pipes for Angular libraries

Use the `angular` template to listing all modules, services, components, pipes of an Angular lib:

```ts
{
  template: 'angular',
}
```

## What the benefits?

- Easy to use CLI & API
- Avoid reference mistakes and code duplications
- Improve source code quality with [TSdoc](https://github.com/microsoft/tsdoc)
- Save time and avoid brain damage

## The workflow

Adding **ayedocs** to any project in 3 simple steps:

1. (Optional) Documenting the source code with [TSdoc](https://github.com/microsoft/tsdoc)
2. Add **configuration** to `package.json` or `ayedocs.config.js`
3. Run `ayedocs generate` to generate content
