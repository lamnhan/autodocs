**docsuper** recieve the render input and returns the content, simple that is.

A render input can be **a path to a .md file** (`file`), **a template name** (`template`), **a rendering** (`rendering`), or one of the input with [[RenderWithOptions | options]].

The CLI load configuration from `package.json` or `docsuper.config.js`. See [Options](#options) section for detail. Using the API, config can be provided directly when init the module.

Open `package.json` and add:

```json
{
  "name": "my-package",
  "description": "My package description.",
  "@lamnhan/docsuper": {
    "files": {
      "TEST.md": {
        "head": true,
        "section1": ["Main", "SELF"]
      }
    }
  }
}
```

With the configuration above, you tell the CLI to create a file named `TEST.md` with two sections:

- The `head` section: a [built-in](#renderer) section that display the package name and description.
- The `section1` section: a [rendering](#rendering-input) section that display the source code element title and description.

The `TEST.md` content would be:

```md
<\section id="head">

\# my-package

**My package description.**

</\section>

</\section id="section1">

\## The `Main` class

**This is a Class element named `Main`**

And this is the `Main` element detail.

Supports Markdown content.

</\section>
```
