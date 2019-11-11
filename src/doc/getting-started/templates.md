
### Using templates

Rendering template is a convinient way to render documents for common source code structure. To use a template, just replace rendering sections with the template name:

```json
{
  "files": {
    "TEST.md": "mini"
  }
}
```

Currently supported 2 templates:

- `mini` template, included these sections:

  - **head**: package name & description
  - **toc**: table of content
  - **options**: summary properties of `Options` interface
  - **main**: full `Main` class info
  - **license**: license informatiion

- `full` template, included these sections:
  - **head**: package name & description
  - **toc**: table of content
  - **functions**: full list of all functions
  - **interfaces**: summary list of all interfaces
  - **classes**: full list of all classes
  - **license**: license informatiion
