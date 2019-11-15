Now is the time to generate some content.

## Output modes

There are 2 kinds output: as standalone files or as a website. You can use one or both of them in one configuration file.

### To standalone files

To render one or more standalone files, great for markdown files such as `README.md`, ...

Put your config under the `fileRender` key of the [[Options]].

```js
// docsuper.config.js
module.exports = {
  fileRender: {
    'README.md': 'mini'
  }
};
```

### To website

To render all files as a website, great for the `docs` site for Github pages.

Put rendering config under the `webRender` key.

```js
// docsuper.config.js
module.exports = {
  webRender: {
    files: {
      'file1.html': '@doc/file1.md',
      'file2.html': {
        section1: ['CLass1', 'SELF'],
        section2: ['CLass2', 'FULL']
      }
    }
  }
};
```

## Render input

A render input is what appears after the file name, for above configs, those are `mini`, `@doc/file1.md`, and `{ section1: [...], ... }`.

These render inputs provide instructions for the renderer to build the final content for the file.

### Direct files

You can input a markdown file by its path path, `@` will be replaced with `src/`.

The source file should puts top headings at level 2.

```ts
{
  'TEST.md': 'src/doc/test.md', // or `@doc/test.md`
}
```

### Using template

Template is the most easy way to generate content, but you must name the source or structure a project with certain format.

To render using a template, just provide the template name:

```ts
{
  'TEST.md': 'mini',
}
```

### Advanced rendering

To render a advanced rendering (custom sections):

```ts
{
  'TEST.md': {
    section1: ['Main', 'SELF']
    // more sections here
  },
}
```
