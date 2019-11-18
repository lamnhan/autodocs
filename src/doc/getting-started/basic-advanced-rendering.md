If you wish more control over rendering, you can use the advanced rendering format.

Advanced rendering allows you to defined more sections with specific config.

```ts
{
  section1: ['Options'],
  section2: ['Main', 'FULL']
}
```

## The 3 parts

The smallest unit of the advanced rendering has of 3 parts:

- The **WHAT**: what the target?
- The **HOW** (optional): how to output the WHAT, default to `SELF`.
- The extra (optional): more rendering options.

For the WHAT part, use this format to target a source code element:

- Direct element: provide its name, ex. `Options`, 'function1', ...
- Indirect element: its parent name and its name with `.` in between, ex. `Main.method1`, ...
- Custom source: list of path, ex. `[path1.ts,path2.ts]`

## Advanced rendering variants

- Builtin sections, `[name]: true`:

```ts
{
  head: true,
}
```

- Content from a file, provide the file path:

```ts
{
  section1: '@docs/file1.md'
}
```

- Custom content block:

```ts
{
  section1: {
    type: 'text',
    data: 'Some text ...'
  }
}
```

- Multiple blocks for one section:

```ts
{
  section1: [
    {
      type: 'text',
      data: 'Some text ...'
    },
    ['Options', 'SELF'],
    ['Options', 'SUMMARY_PROPERTIES']
  ]
}
```
