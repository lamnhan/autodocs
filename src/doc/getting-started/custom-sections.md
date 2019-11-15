
You can add any custom sections to a document file (for standalone markdown files). [The CLI](#the-cli) will replace any section exists in the configuration with generated content and keep others as is.

These section called **global section**, and will be ignore if `cleanOuput` is set in [[Options]].

You must wrap content inside the HTML `section` tag with a **unique id**.

```md
<\section id="xxx">

Any markdown content goes here!

</\section>
```

Section can also be put in the source file, called **local section**.

**IMPORTANT**: If the content has these structures, you must escape them to avoid conflicts:

- `<\section id="xxx">...</\section>` (HTML sections with an id)
- `\# A heading` (Markdown headings, but **not intended** to be headings)
- `<\h1>A heading</\h1>` (HTML headings, but **not intended** to be headings)
