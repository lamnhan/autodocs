You can provide custom theme for render website.

```ts
{
  webRender: {
    theme: 'path/to/html',
  }
}
```

For shorter path, use:

- `@`: equals **src/**
- `~`: equals **node_modules/**

A **ayedocs** theme may contains:

- `.html`: the main template file
- `assets` (optional): custom assets folder

The CLI load content the main template file, and replace placeholder text with the rendered content.

Placeholder text in the format `{{ name }}`, these are the data available to the theme:

- `title`: the `pageTitle`
- `menu`: the web menu
- `content`: the main content
- Any `webData` key-value pairs.

If there is the `assets` folder in the same place to the main file, the folder will be copied to the web output folder.
