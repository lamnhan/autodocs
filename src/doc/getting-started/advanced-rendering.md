If you wish more control over rendering, you can use the advanced rendering format.

Advanced rendering allows you to defined more sections with specific config.

```ts
{
  section1: ['Options'],
  section2: ['Lib', 'FULL']
}
```

## Builtin sections

Use builtin sections with the format `[name]: true`:

```ts
{
  head: true,
}
```

List of builtin sections:

- `head`: Package name & description
- `toc`/`tocx`: Table of content
- `license`: License information

## Content from a file

Provide the file path:

```ts
{
  section1: '@docs/file1.md'
}
```

## Using template

```ts
{
  section1: 'basic', // built-in
  section2: customTemplate, // custom
}
```

## Declaration rendering

```ts
{
  section1: [ 'Options', 'SELF' ],
  section2: [ 'Lib', 'FULL', { /* options */ } ]
  section3: [ 'Class1', customConvert ]
}
```

A [[DeclarationRender]] has of 3 parts:

- The **WHAT**: what the target?
- The **HOW** (optional): how to output the WHAT, default to `SELF`.
- The extra (optional): more rendering options.

For the WHAT part, use this format to target a source code element:

- Direct element: provide its name, ex. `Options`, 'function1', ...
- Indirect element: its parent name and its name with `.` in between, ex. `Lib.method1`, ...
- Custom source: list of path, ex. `[path1.ts,path2.ts]`

## Multiple blocks

Multiple blocks for one section:

```ts
{
  section1: [
    // content block
    {
      type: 'text',
      data: 'Some text ...'
    },
    // 
    [ 'Options', 'SELF' ],
    [ 'Options', 'SUMMARY_PROPERTIES' ]
  ]
}
```

## Template or file with options

See [[SectionRenderWithOptions]] for template or file with options:

```ts
{
  section1: {
    // input
    template: '...', // or
    file: '...',
    // any options
    // for certain type of input
    // ...
  }
}

```
