
### Configuration

The CLI load configuration from `package.json` or `docsuper.config.js`. See [Options](#options) section for detail.

Open `package.json` and add:

```json
{
  "name": "my-package",
  "description": "My package description.",
  "@lamnhan/docsuper": {
    "files": {
      "TEST.md": {
        "head": true,
        "s1": ["Main", "SELF"]
      }
    }
  }
}
```

With the configuration above, you tell the CLI to create a file named `TEST.md` with two sections:

- The `head` section: a [built-in](#renderer) section that display the package name and description.
- The `s1` section: a [rendering](#rendering-input) section that display the source code element title and description.

The `TEST.md` content would be:

```md
<\section id="head">

\# my-package

**My package description.**

</\section>

</\section id="s1">

\## The `Main` class

**This is a Class element named `Main`**

And this is the `Main` element detail.

Supports Markdown content.

</\section>
```
