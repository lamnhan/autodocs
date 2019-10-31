<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

# @lamnhan/docsuper

**Document generator for Typescript projects.**

</section>

<section id="header">

[![License][license_badge]][license_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/lamnhan/docsuper/blob/master/LICENSE
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/lamhiennhan

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

**Table of content**

- [Introduction](#introduction)
  - [What is it?](#what-is-it)
  - [What the benefits?](#what-the-benefits)
  - [The workflow](#the-workflow)
- [Getting started](#getting-started)
  - [The CLI](#the-cli)
  - [The library](#the-library)
  - [Understand the source code](#understand-the-source-code)
  - [Configuration](#configuration)
  - [Rendering input](#rendering-input)
  - [Using templates](#using-templates)
  - [Custom sections](#custom-sections)
- [Options](#options)
- [Options properties](#options-properties)
- [The Module](#main)
  - [Main properties](#main-properties)
  - [Main methods](#main-methods)
    - [`convert(declaration, output, options?)`](#main-convert-0)
    - [`extend(optionsInput?)`](#main-extend-0)
    - [`generateDocs()`](#main-generatedocs-0)
    - [`output(path, rendering)`](#main-output-0)
    - [`outputLocal()`](#main-outputlocal-0)
    - [`parse(input?)`](#main-parse-0)
    - [`render(rendering, currentContent?)`](#main-render-0)
    - [`renderLocal()`](#main-renderlocal-0)
- [Declaration](#declaration)
  - [Declaration properties](#declaration-properties)
  - [Declaration methods](#declaration-methods)
    - [`getChild(name)`](#declaration-getchild-0)
    - [`getChildId(childName)`](#declaration-getchildid-0)
    - [`getClasses(filter?)`](#declaration-getclasses-0)
    - [`getFunctionsOrMethods(filter?)`](#declaration-getfunctionsormethods-0)
    - [`getInterfaces(filter?)`](#declaration-getinterfaces-0)
    - [`getVariablesOrProperties(filter?)`](#declaration-getvariablesorproperties-0)
    - [`hasClasses()`](#declaration-hasclasses-0)
    - [`hasFunctionsOrMethods()`](#declaration-hasfunctionsormethods-0)
    - [`hasInterfaces()`](#declaration-hasinterfaces-0)
    - [`hasVariablesOrProperties()`](#declaration-hasvariablesorproperties-0)
    - [`isCollection()`](#declaration-iscollection-0)
    - [`isKind(kindString)`](#declaration-iskind-0)
    - [`isRoot()`](#declaration-isroot-0)
    - [`setId(id)`](#declaration-setid-0)
- [Parsing](#parseservice)
  - [ParseService methods](#parseservice-methods)
    - [`parse(input?)`](#parseservice-parse-0)
- [Converting](#convertservice)
  - [ConvertService methods](#convertservice-methods)
    - [`convert(declaration, output, options?)`](#convertservice-convert-0)
- [Rendering](#renderservice)
  - [RenderService methods](#renderservice-methods)
    - [`getData(rendering)`](#renderservice-getdata-0)
    - [`getDataBatch(batchRendering)`](#renderservice-getdatabatch-0)
    - [`render(rendering, currentContent?)`](#renderservice-render-0)
    - [`renderBatch(batchRendering, batchCurrentContent?)`](#renderservice-renderbatch-0)
- [Detail API reference](https://lamnhan.com/docsuper)


</section>

<section id="introduction">

## Introduction

Documentation is a crucial part of every great open-source projects. But making docs is such a Pain-In-The-Brain process.

Since [Typescript](https://www.typescriptlang.org) is an self documenting language, we can leverage its power to extract the source code information. This library is based on [Typedoc](https://typedoc.org), one of the best tool for generating Typescript documentation.

### What is it?

**docsuper** is a tool for generating documentation directly from the source code.

It provides 3 main services:

- [The `Parser`](#parser): turns the source into a [Declaration](#declaration).
- [The `Converter`](#converter): converts a [Declaration](#declaration) into content data.
- [The `Renderer`](#renderer): renders the content data to the final content.

Using [the CLI](#the-cli), you can easily generate a document by providing [the configuration](#options) in `package.json` or `docsuper.config.js` file.

An example configuration:

```json
{
  "files": {
    "README.md": {
      "head": true,
      "toc": true,
      "section1": ["Class1"],
      "section2": ["Interface2"],
      "license": true
    }
  }
}
```

Run `docsuper generate` will output:

- The `docs/` folder: the detail document, generated by [Typedoc](https://typedoc.org).
- And every document files based on the configuration.

> NOTE: **docsuper** uses [Typedoc](https://typedoc.org) to generate the detail documentation (can be ignored).
> [The CLI](#the-cli) is only used to generate simpler additional document files, such as `README.md`.

### What the benefits?

- Easy to config & usage
- Avoid reference mistakes and code duplications
- Improve source code quality with [TSdoc](https://github.com/microsoft/tsdoc)
- Save time and avoid brain damage

### The workflow

Adding **docsuper** to any project in less than 5 simple steps:

1. Coding as usual
2. (Optional) Documenting the source code with [TSdoc](https://github.com/microsoft/tsdoc)
3. (Optional) Putting custom sections and placeholders to files
4. Add [configuration](#configuration) to `package.json` or `docsuper.config.js`
5. Run `docsuper generate` to generate content

</section>

<section id="getting-started">

## Getting started

You can use **docsuper** to generate documentation from the command-line interface or [manually](#the-library) parsing, converting or rendering content in a Node application.

### The CLI

Install globally by running:

```sh
npm install -g @lamnhan/docsuper
```

A command now available from the terminal, you can run: `docsuper`.

If you wish to run the CLI locally, install the package with `--save-dev` flag:

```sh
npm install --save-dev @lamnhan/docsuper
```

Then put a script in the `package.json`, so you can do `npm run docs` every build.

```json
{
  "scripts": {
    "docs": "docsuper generate"
  }
}
```

### The library

Install as dev dependency:

```sh
npm install --save-dev @lamnhan/docsuper
```

Use the library:

```ts
import { docsuper } from "@lamnhan/docsuper";

// init an instance
const generator = docsuper(/* Options */);

// parsing
const parsing = generator.parse("Main");

// rendering
const rendering = generator.render({
  section1: ["Options"],
  section2: ["Main"]
});
```

See [Main](#main) for service detail and [Options](#options) for more options.

### Understand the source code

A Typescript project source code contains many elements with different kinds: `Variable/Property`, `Function/Method`, `Interface`, `Class`, ...

Imagine your source code has 3 files: `file1.ts`, `file2.ts`, `file3.ts`. Each file exports certain elements.

But you can see your whole source code as a single flattened file like this:

```ts
// ================== file1.ts ==================

/**
 * This is a Variable element named `PI`
 */
export const PI = 3.14;

// ================== file2.ts ==================

/**
 * This is a Function element named `doSomething`
 */
export function doSomething() {
  return true;
}

// ================== file3.ts ==================

/**
 * This is an Interface element named `Options`
 *
 * And this is the `Options` element detail.
 *
 * Supports Markdown content.
 */
export interface Options {
  /**
   * This is a Property element named `prop1`
   */
  prop1?: string;
  prop2?: number;
}

/**
 * This is a Class element named `Main`
 *
 * And this is the `Main` element detail.
 *
 * Supports Markdown content.
 */
export class Main {
  property = "a property";
  constructor() {}
  /**
   * This is a Method element named `method1`
   */
  method1() {
    return "a method";
  }
}
```

To get information, we turn any element of the source code into a [Declaration](#declaration) (a source code unit). There are 2 types of [Declaration](#declaration):

- **Direct**: for top level elements, such as: `Variable`, `Function`, `Interface`, `Class` and a `Collection` of any top level elements.
- **Indirect**: for child elements of a top level element, such as: `Property` and `Method`.

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

### Rendering input

Take a look at the `s1` section configuration above. We see it holds an array of values: `["Main", "SELF"]`. This array is called **a rendering input**.

A rendering input provide instructions for [the Parser](#parser) and [the Converter](#converter), it has 3 parts:

- The **WHAT**: tells [the Parser](#parser) to parse what source code element:
  - Top level elements: provide the name of the element, example: `PI`, `Options`, ...
  - Child elements: put a `.` between the parent and the child name, example: `Options.prop1`, `Main.method1`, ...
  - Collection of elements: the list of paths, `@` for `./src/` and separated by `+`, example: `@file1.ts+@lib/filex.ts`
- The **HOW** (optional, default to `SELF`): tells [the Converter](#converter) how we want to extract the information from the parsing result.
- The **options** (optional): custom converter options, see [ConverterOptions](https://lamnhan.com/docsuper/interfaces/converteroptions.html).

See [the Parser](#parser) for parsing detail and [the Converter](#converter) for converting detail.

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

### Custom sections

You can add any custom sections to a document file. [The CLI](#the-cli) will replace any section exists in the configuration with generated content and keep others as is.

You must wrap content inside the HTML `section` tag with a **unique id**.

```md
<\section id="xxx">

Any markdown content goes here!

</\section>
```

Section can also be put in the source file, called [**local section**](#rendering).

**IMPORTANT**: If the content has these structures, you must escape them to avoid conflicts:

- `<\section id="xxx">...</\section>` (HTML sections with an id)
- `\# A heading` (Markdown headings, but **not intended** to be headings)
- `<\h1>A heading</\h1>` (HTML headings, but **not intended** to be headings)

</section>

<section id="options" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2><a name="options" href="https://lamnhan.com/docsuper/interfaces/options.html"><p>Options</p></a></h2>

**Custom generator options**

Options can be provided in 3 ways:

- Under the **@lamnhan/docsuper** property of `package.json` file
- The `docsuper.config.js` file for more advanced config
- By the `options` param when init new <a data-sref="docsuper" href="https://lamnhan.com/docsuper/globals.html">`docsuper(options?)`</a> instance.

<h2><a name="options-properties"><p>Options properties</p></a></h2>

| Name                                                                              | Type                                                                                               | Description                                                                                                                  |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [apiGenerator](https://lamnhan.com/docsuper/interfaces/options.html#apigenerator) | <code>"typedoc" \| "none"</code>                                                                   | Detail API generator                                                                                                         |
| [apiUrl](https://lamnhan.com/docsuper/interfaces/options.html#apiurl)             | <code>string</code>                                                                                | Custom API reference url, default to the Github Pages repo url                                                               |
| [converts](https://lamnhan.com/docsuper/interfaces/options.html#converts)         | <code>[AdditionalConverts](https://lamnhan.com/docsuper/interfaces/additionalconverts.html)</code> | Additional converts                                                                                                          |
| [files](https://lamnhan.com/docsuper/interfaces/options.html#files)               | <code>object</code>                                                                                | List of documents to be generated: **key** is the path to the document and **value** is a template name or a rendering input |
| [noAttr](https://lamnhan.com/docsuper/interfaces/options.html#noattr)             | <code>boolean</code>                                                                               | No generator footer attribution                                                                                              |
| [srcPath](https://lamnhan.com/docsuper/interfaces/options.html#srcpath)           | <code>string</code>                                                                                | Path to the source code, default to `src`                                                                                    |
| [typedoc](https://lamnhan.com/docsuper/interfaces/options.html#typedoc)           | <code>[TypedocConfigs](https://lamnhan.com/docsuper/interfaces/typedocconfigs.html)</code>         | Custom [Typedoc](https://typedoc.org) config                                                                                 |

</section>

<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2><a name="main" href="https://lamnhan.com/docsuper/classes/main.html"><p>The Module</p></a></h2>

**The Docsuper module**

<h3><a name="main-properties"><p>Main properties</p></a></h3>

| Name                                                              | Type                                                                                    | Description             |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------- |
| [Content](https://lamnhan.com/docsuper/classes/main.html#content) | <code>[ContentService](https://lamnhan.com/docsuper/classes/contentservice.html)</code> | Get the Content service |
| [Convert](https://lamnhan.com/docsuper/classes/main.html#convert) | <code>[ConvertService](https://lamnhan.com/docsuper/classes/convertservice.html)</code> | Get the Convert service |
| [Load](https://lamnhan.com/docsuper/classes/main.html#load)       | <code>[LoadService](https://lamnhan.com/docsuper/classes/loadservice.html)</code>       | Get the Load service    |
| [Parse](https://lamnhan.com/docsuper/classes/main.html#parse)     | <code>[ParseService](https://lamnhan.com/docsuper/classes/parseservice.html)</code>     | Get the Parse service   |
| [Project](https://lamnhan.com/docsuper/classes/main.html#project) | <code>[ProjectService](https://lamnhan.com/docsuper/classes/projectservice.html)</code> | Get the Project service |
| [Render](https://lamnhan.com/docsuper/classes/main.html#render)   | <code>[RenderService](https://lamnhan.com/docsuper/classes/renderservice.html)</code>   | Get the Render service  |
| [Typedoc](https://lamnhan.com/docsuper/classes/main.html#typedoc) | <code>[TypedocService](https://lamnhan.com/docsuper/classes/typedocservice.html)</code> | Get the Typedoc service |

<h3><a name="main-methods"><p>Main methods</p></a></h3>

| Function                                                  | Returns type                                                                                                                                                                                                                                                                                                    | Description                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [convert(declaration, output, options?)](#main-convert-0) | <code>[HeadingBlock](https://lamnhan.com/docsuper/interfaces/headingblock.html) \| [TextBlock](https://lamnhan.com/docsuper/interfaces/textblock.html) \| [ListBlock](https://lamnhan.com/docsuper/interfaces/listblock.html) \| [TableBlock](https://lamnhan.com/docsuper/interfaces/tableblock.html)[]</code> | Convert a declaration into content blocks.              |
| [extend(optionsInput?)](#main-extend-0)                   | <code>[Main](https://lamnhan.com/docsuper/classes/main.html)</code>                                                                                                                                                                                                                                             | Create a new instance                                   |
| [generateDocs()](#main-generatedocs-0)                    | <code>void</code>                                                                                                                                                                                                                                                                                               | Generate the API reference using Typedoc.               |
| [output(path, rendering)](#main-output-0)                 | <code>void</code>                                                                                                                                                                                                                                                                                               | Render and save a document                              |
| [outputLocal()](#main-outputlocal-0)                      | <code>void</code>                                                                                                                                                                                                                                                                                               | Render and save documents based on local configuration. |
| [parse(input?)](#main-parse-0)                            | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code>                                                                                                                                                                                                                               | Turn the source code into a <a data-sref="Declaration" href="#declaration">Declaration</a>.            |
| [render(rendering, currentContent?)](#main-render-0)      | <code>string</code>                                                                                                                                                                                                                                                                                             | Render content based on configuration.                  |
| [renderLocal()](#main-renderlocal-0)                      | <code>[BatchRenderResult](https://lamnhan.com/docsuper/interfaces/batchrenderresult.html)</code>                                                                                                                                                                                                                | Render content based on local configuration.            |

<h4><a name="main-convert-0" href="https://lamnhan.com/docsuper/classes/main.html#convert"><p><code>convert(declaration, output, options?)</code></p></a></h4>

**Convert a declaration into content blocks.**

**Parameters**

| Param           | Type                                                                                       | Description                             |
| --------------- | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| **declaration** | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code>          | The declaration                         |
| **output**      | <code>string</code>                                                                        | Expected output, see <a data-sref="ConvertService" href="#convertservice">ConvertService</a> |
| options         | <code>[ConvertOptions](https://lamnhan.com/docsuper/interfaces/convertoptions.html)</code> | Custom convertion options               |

**Returns**

<code>[HeadingBlock](https://lamnhan.com/docsuper/interfaces/headingblock.html) | [TextBlock](https://lamnhan.com/docsuper/interfaces/textblock.html) | [ListBlock](https://lamnhan.com/docsuper/interfaces/listblock.html) | [TableBlock](https://lamnhan.com/docsuper/interfaces/tableblock.html)[]</code>

---

<h4><a name="main-extend-0" href="https://lamnhan.com/docsuper/classes/main.html#extend"><p><code>extend(optionsInput?)</code></p></a></h4>

**Create a new instance**

**Parameters**

| Param        | Type                                                                                | Description |
| ------------ | ----------------------------------------------------------------------------------- | ----------- |
| optionsInput | <code>[OptionsInput](https://lamnhan.com/docsuper/globals.html#optionsinput)</code> |             |

**Returns**

<code>[Main](https://lamnhan.com/docsuper/classes/main.html)</code>

---

<h4><a name="main-generatedocs-0" href="https://lamnhan.com/docsuper/classes/main.html#generatedocs"><p><code>generateDocs()</code></p></a></h4>

**Generate the API reference using Typedoc.**

The default folder is **/docs**. You can change the output folder by providing the `out` property of <a data-sref="Options" href="#options">Options</a>.

**Returns**

<code>void</code>

---

<h4><a name="main-output-0" href="https://lamnhan.com/docsuper/classes/main.html#output"><p><code>output(path, rendering)</code></p></a></h4>

**Render and save a document**

**Parameters**

| Param         | Type                                                                             | Description             |
| ------------- | -------------------------------------------------------------------------------- | ----------------------- |
| **path**      | <code>string</code>                                                              | Path to the document    |
| **rendering** | <code>[Rendering](https://lamnhan.com/docsuper/interfaces/rendering.html)</code> | Rendering configuration |

**Returns**

<code>void</code>

---

<h4><a name="main-outputlocal-0" href="https://lamnhan.com/docsuper/classes/main.html#outputlocal"><p><code>outputLocal()</code></p></a></h4>

**Render and save documents based on local configuration.**

**Returns**

<code>void</code>

---

<h4><a name="main-parse-0" href="https://lamnhan.com/docsuper/classes/main.html#parse"><p><code>parse(input?)</code></p></a></h4>

**Turn the source code into a <a data-sref="Declaration" href="#declaration">Declaration</a>.**

**Parameters**

| Param | Type                | Description   |
| ----- | ------------------- | ------------- |
| input | <code>string</code> | Parsing input |

**Returns**

<code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code>

---

<h4><a name="main-render-0" href="https://lamnhan.com/docsuper/classes/main.html#render"><p><code>render(rendering, currentContent?)</code></p></a></h4>

**Render content based on configuration.**

**Parameters**

| Param          | Type                                                                                             | Description                 |
| -------------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| **rendering**  | <code>[Rendering](https://lamnhan.com/docsuper/interfaces/rendering.html)</code>                 | Redering configuration      |
| currentContent | <code>[ContentBySections](https://lamnhan.com/docsuper/interfaces/contentbysections.html)</code> | Current content by sections |

**Returns**

<code>string</code>

---

<h4><a name="main-renderlocal-0" href="https://lamnhan.com/docsuper/classes/main.html#renderlocal"><p><code>renderLocal()</code></p></a></h4>

**Render content based on local configuration.**

**Returns**

<code>[BatchRenderResult](https://lamnhan.com/docsuper/interfaces/batchrenderresult.html)</code>

---

</section>

<section id="declaration" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2><a name="declaration" href="https://lamnhan.com/docsuper/classes/declaration.html"><p>Declaration</p></a></h2>

**A Declaration is an unit that holds the information of a source code element.**

<h3><a name="declaration-properties"><p>Declaration properties</p></a></h3>

| Name                                                                                 | Type                                                                                             | Description |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ----------- |
| [DEFAULT_VALUE](https://lamnhan.com/docsuper/classes/declaration.html#default_value) | <code>any</code>                                                                                 |             |
| [DISPLAY_TYPE](https://lamnhan.com/docsuper/classes/declaration.html#display_type)   | <code>string</code>                                                                              |             |
| [FULL_TEXT](https://lamnhan.com/docsuper/classes/declaration.html#full_text)         | <code>string</code>                                                                              |             |
| [ID](https://lamnhan.com/docsuper/classes/declaration.html#id)                       | <code>string</code>                                                                              |             |
| [IS_OPTIONAL](https://lamnhan.com/docsuper/classes/declaration.html#is_optional)     | <code>boolean</code>                                                                             |             |
| [LINK](https://lamnhan.com/docsuper/classes/declaration.html#link)                   | <code>string</code>                                                                              |             |
| [NAME](https://lamnhan.com/docsuper/classes/declaration.html#name)                   | <code>string</code>                                                                              |             |
| [PARAMETERS](https://lamnhan.com/docsuper/classes/declaration.html#parameters)       | <code>[ReflectionData](https://lamnhan.com/docsuper/interfaces/reflectiondata.html)[]</code>     |             |
| [REFLECTION](https://lamnhan.com/docsuper/classes/declaration.html#reflection)       | <code>Reflection</code>                                                                          |             |
| [RETURNS](https://lamnhan.com/docsuper/classes/declaration.html#returns)             | <code>string</code>                                                                              |             |
| [SECTIONS](https://lamnhan.com/docsuper/classes/declaration.html#sections)           | <code>[ContentBySections](https://lamnhan.com/docsuper/interfaces/contentbysections.html)</code> |             |
| [SHORT_TEXT](https://lamnhan.com/docsuper/classes/declaration.html#short_text)       | <code>string</code>                                                                              |             |
| [TEXT](https://lamnhan.com/docsuper/classes/declaration.html#text)                   | <code>string</code>                                                                              |             |
| [TYPE](https://lamnhan.com/docsuper/classes/declaration.html#type)                   | <code>string</code>                                                                              |             |

<h3><a name="declaration-methods"><p>Declaration methods</p></a></h3>

| Function                                                                     | Returns type                                                                        | Description |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------- |
| [getChild(name)](#declaration-getchild-0)                                    | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code>   |             |
| [getChildId(childName)](#declaration-getchildid-0)                           | <code>string</code>                                                                 |             |
| [getClasses(filter?)](#declaration-getclasses-0)                             | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code> |             |
| [getFunctionsOrMethods(filter?)](#declaration-getfunctionsormethods-0)       | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code> |             |
| [getInterfaces(filter?)](#declaration-getinterfaces-0)                       | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code> |             |
| [getVariablesOrProperties(filter?)](#declaration-getvariablesorproperties-0) | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code> |             |
| [hasClasses()](#declaration-hasclasses-0)                                    | <code>boolean</code>                                                                |             |
| [hasFunctionsOrMethods()](#declaration-hasfunctionsormethods-0)              | <code>boolean</code>                                                                |             |
| [hasInterfaces()](#declaration-hasinterfaces-0)                              | <code>boolean</code>                                                                |             |
| [hasVariablesOrProperties()](#declaration-hasvariablesorproperties-0)        | <code>boolean</code>                                                                |             |
| [isCollection()](#declaration-iscollection-0)                                | <code>boolean</code>                                                                |             |
| [isKind(kindString)](#declaration-iskind-0)                                  | <code>boolean</code>                                                                |             |
| [isRoot()](#declaration-isroot-0)                                            | <code>boolean</code>                                                                |             |
| [setId(id)](#declaration-setid-0)                                            | <code>this</code>                                                                   |             |

<h4><a name="declaration-getchild-0" href="https://lamnhan.com/docsuper/classes/declaration.html#getchild"><p><code>getChild(name)</code></p></a></h4>

**The `getChild` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code>

---

<h4><a name="declaration-getchildid-0" href="https://lamnhan.com/docsuper/classes/declaration.html#getchildid"><p><code>getChildId(childName)</code></p></a></h4>

**The `getChildId` call signature.**

**Parameters**

| Param         | Type                | Description |
| ------------- | ------------------- | ----------- |
| **childName** | <code>string</code> |             |

**Returns**

<code>string</code>

---

<h4><a name="declaration-getclasses-0" href="https://lamnhan.com/docsuper/classes/declaration.html#getclasses"><p><code>getClasses(filter?)</code></p></a></h4>

**The `getClasses` call signature.**

**Parameters**

| Param  | Type                                                                                          | Description |
| ------ | --------------------------------------------------------------------------------------------- | ----------- |
| filter | <code>[DeclarationFilter](https://lamnhan.com/docsuper/globals.html#declarationfilter)</code> |             |

**Returns**

<code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code>

---

<h4><a name="declaration-getfunctionsormethods-0" href="https://lamnhan.com/docsuper/classes/declaration.html#getfunctionsormethods"><p><code>getFunctionsOrMethods(filter?)</code></p></a></h4>

**The `getFunctionsOrMethods` call signature.**

**Parameters**

| Param  | Type                                                                                          | Description |
| ------ | --------------------------------------------------------------------------------------------- | ----------- |
| filter | <code>[DeclarationFilter](https://lamnhan.com/docsuper/globals.html#declarationfilter)</code> |             |

**Returns**

<code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code>

---

<h4><a name="declaration-getinterfaces-0" href="https://lamnhan.com/docsuper/classes/declaration.html#getinterfaces"><p><code>getInterfaces(filter?)</code></p></a></h4>

**The `getInterfaces` call signature.**

**Parameters**

| Param  | Type                                                                                          | Description |
| ------ | --------------------------------------------------------------------------------------------- | ----------- |
| filter | <code>[DeclarationFilter](https://lamnhan.com/docsuper/globals.html#declarationfilter)</code> |             |

**Returns**

<code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code>

---

<h4><a name="declaration-getvariablesorproperties-0" href="https://lamnhan.com/docsuper/classes/declaration.html#getvariablesorproperties"><p><code>getVariablesOrProperties(filter?)</code></p></a></h4>

**The `getVariablesOrProperties` call signature.**

**Parameters**

| Param  | Type                                                                                          | Description |
| ------ | --------------------------------------------------------------------------------------------- | ----------- |
| filter | <code>[DeclarationFilter](https://lamnhan.com/docsuper/globals.html#declarationfilter)</code> |             |

**Returns**

<code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)[]</code>

---

<h4><a name="declaration-hasclasses-0" href="https://lamnhan.com/docsuper/classes/declaration.html#hasclasses"><p><code>hasClasses()</code></p></a></h4>

**The `hasClasses` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="declaration-hasfunctionsormethods-0" href="https://lamnhan.com/docsuper/classes/declaration.html#hasfunctionsormethods"><p><code>hasFunctionsOrMethods()</code></p></a></h4>

**The `hasFunctionsOrMethods` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="declaration-hasinterfaces-0" href="https://lamnhan.com/docsuper/classes/declaration.html#hasinterfaces"><p><code>hasInterfaces()</code></p></a></h4>

**The `hasInterfaces` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="declaration-hasvariablesorproperties-0" href="https://lamnhan.com/docsuper/classes/declaration.html#hasvariablesorproperties"><p><code>hasVariablesOrProperties()</code></p></a></h4>

**The `hasVariablesOrProperties` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="declaration-iscollection-0" href="https://lamnhan.com/docsuper/classes/declaration.html#iscollection"><p><code>isCollection()</code></p></a></h4>

**The `isCollection` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="declaration-iskind-0" href="https://lamnhan.com/docsuper/classes/declaration.html#iskind"><p><code>isKind(kindString)</code></p></a></h4>

**The `isKind` call signature.**

**Parameters**

| Param          | Type                              | Description |
| -------------- | --------------------------------- | ----------- |
| **kindString** | <code>keyof ReflectionKind</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="declaration-isroot-0" href="https://lamnhan.com/docsuper/classes/declaration.html#isroot"><p><code>isRoot()</code></p></a></h4>

**The `isRoot` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="declaration-setid-0" href="https://lamnhan.com/docsuper/classes/declaration.html#setid"><p><code>setId(id)</code></p></a></h4>

**The `setId` call signature.**

**Parameters**

| Param  | Type                | Description |
| ------ | ------------------- | ----------- |
| **id** | <code>string</code> |             |

**Returns**

<code>this</code>

---

</section>

<section id="parser" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2><a name="parseservice" href="https://lamnhan.com/docsuper/classes/parseservice.html"><p>Parsing</p></a></h2>

**The `Parser` turns source code into <a data-sref="Declaration" href="#declaration">Declaration</a>**

<h3><a name="parseservice-methods"><p>ParseService methods</p></a></h3>

| Function                               | Returns type                                                                      | Description |
| -------------------------------------- | --------------------------------------------------------------------------------- | ----------- |
| [parse(input?)](#parseservice-parse-0) | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code> |             |

<h4><a name="parseservice-parse-0" href="https://lamnhan.com/docsuper/classes/parseservice.html#parse"><p><code>parse(input?)</code></p></a></h4>

**The `parse` call signature.**

**Parameters**

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| input | <code>string</code> |             |

**Returns**

<code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code>

---

</section>

<section id="converter" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2><a name="convertservice" href="https://lamnhan.com/docsuper/classes/convertservice.html"><p>Converting</p></a></h2>

**The Converter turns a <a data-sref="Declaration" href="#declaration">Declaration</a> into <a data-sref="Block">content blocks</a>**

### Converter output

A <a data-sref="Declaration" href="#declaration">Declaration</a> supports certain convert output depended on its kind. You can also provide your custom converts output, use the `converts` field of <a data-sref="Options" href="#options">Options</a>.

Here the list of default output:

| Output                 | Kinds                  | Options                                                           | Description                                                                             |
| ---------------------- | ---------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **SECTION:`ID`**       | any                    | <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                                             | A local section                                                                         |
| **VALUE**              | `Variable`, `Property` | <a data-sref="ValueOptions" href="https://lamnhan.com/docsuper/interfaces/valueoptions.html">ValueOptions</a>                                                  | Default value                                                                           |
| **SELF**               | any                    | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>, <a data-sref="HeadingOptions">HeadingOptions</a> | Title, description, content WITHOUT local sections, parameters & returns (for function) |
| **FULL**               | any                    | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>, <a data-sref="HeadingOptions">HeadingOptions</a> | All content (with headings)                                                             |
| **SUMMARY_VARIABLES**  | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table of variables                                                              |
| **DETAIL_VARIABLES**   | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Detail list of variables                                                                |
| **FULL_VARIABLES**     | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table & detail list of variables                                                |
| **SUMMARY_FUNCTIONS**  | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table of functions                                                              |
| **DETAIL_FUNCTIONS**   | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Detail list of functions                                                                |
| **FULL_FUNCTIONS**     | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table & detail list of functions                                                |
| **SUMMARY_PROPERTIES** | `Interface`, `Class`   | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table of properties                                                             |
| **DETAIL_PROPERTIES**  | `Interface`, `Class`   | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Detail list of properties                                                               |
| **FULL_PROPERTIES**    | `Interface`, `Class`   | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table & detail list of properties                                               |
| **SUMMARY_METHODS**    | `Class`                | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table of methods                                                                |
| **DETAIL_METHODS**     | `Class`                | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Detail list of methods                                                                  |
| **FULL_METHODS**       | `Class`                | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table & detail list of methods                                                  |
| **SUMMARY_INTERFACES** | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table of interfaces                                                             |
| **DETAIL_INTERFACES**  | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Detail list of interfaces                                                               |
| **FULL_INTERFACES**    | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table & detail list of interfaces                                               |
| **SUMMARY_CLASSES**    | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table of classes                                                                |
| **DETAIL_CLASSES**     | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Detail list of classes                                                                  |
| **FULL_CLASSES**       | `Collection`           | <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a>, <a data-sref="ConvertingOptions" href="https://lamnhan.com/docsuper/interfaces/convertingoptions.html">ConvertingOptions</a>                     | Summary table & detail list of classes                                                  |

Provide options with the third item of a rendering input:

- Declaration id: `{ id }`
- **SELF** header: `{ title, link }`
- Raw object: `{ raw: true }`
- Level: `{ level }`
- Use the default heading: `{ heading: true }`
- Use local anchors (instead of detail links): `{ local: true }`

<h3><a name="convertservice-methods"><p>ConvertService methods</p></a></h3>

| Function                                                            | Returns type                                                                                                                                                                                                                                                                                                    | Description |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [convert(declaration, output, options?)](#convertservice-convert-0) | <code>[HeadingBlock](https://lamnhan.com/docsuper/interfaces/headingblock.html) \| [TextBlock](https://lamnhan.com/docsuper/interfaces/textblock.html) \| [ListBlock](https://lamnhan.com/docsuper/interfaces/listblock.html) \| [TableBlock](https://lamnhan.com/docsuper/interfaces/tableblock.html)[]</code> |             |

<h4><a name="convertservice-convert-0" href="https://lamnhan.com/docsuper/classes/convertservice.html#convert"><p><code>convert(declaration, output, options?)</code></p></a></h4>

**The `convert` call signature.**

**Parameters**

| Param           | Type                                                                                       | Description |
| --------------- | ------------------------------------------------------------------------------------------ | ----------- |
| **declaration** | <code>[Declaration](https://lamnhan.com/docsuper/classes/declaration.html)</code>          |             |
| **output**      | <code>string</code>                                                                        |             |
| options         | <code>[ConvertOptions](https://lamnhan.com/docsuper/interfaces/convertoptions.html)</code> |             |

**Returns**

<code>[HeadingBlock](https://lamnhan.com/docsuper/interfaces/headingblock.html) | [TextBlock](https://lamnhan.com/docsuper/interfaces/textblock.html) | [ListBlock](https://lamnhan.com/docsuper/interfaces/listblock.html) | [TableBlock](https://lamnhan.com/docsuper/interfaces/tableblock.html)[]</code>

---

</section>

<section id="renderer" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2><a name="renderservice" href="https://lamnhan.com/docsuper/classes/renderservice.html"><p>Rendering</p></a></h2>

**The Renderer turns a rendering input into the final content**

Builtin sections:

- `head`: Package name & description
- `toc`: Table of content
- `tocx`: Table of content, with detail API reference link
- `license`: License information

<h3><a name="renderservice-methods"><p>RenderService methods</p></a></h3>

| Function                                                                          | Returns type                                                                                       | Description |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| [getData(rendering)](#renderservice-getdata-0)                                    | <code>[RenderingData](https://lamnhan.com/docsuper/interfaces/renderingdata.html)</code>           |             |
| [getDataBatch(batchRendering)](#renderservice-getdatabatch-0)                     | <code>[BatchRenderingData](https://lamnhan.com/docsuper/interfaces/batchrenderingdata.html)</code> |             |
| [render(rendering, currentContent?)](#renderservice-render-0)                     | <code>string</code>                                                                                |             |
| [renderBatch(batchRendering, batchCurrentContent?)](#renderservice-renderbatch-0) | <code>[BatchRenderResult](https://lamnhan.com/docsuper/interfaces/batchrenderresult.html)</code>   |             |

<h4><a name="renderservice-getdata-0" href="https://lamnhan.com/docsuper/classes/renderservice.html#getdata"><p><code>getData(rendering)</code></p></a></h4>

**The `getData` call signature.**

**Parameters**

| Param         | Type                                                                             | Description |
| ------------- | -------------------------------------------------------------------------------- | ----------- |
| **rendering** | <code>[Rendering](https://lamnhan.com/docsuper/interfaces/rendering.html)</code> |             |

**Returns**

<code>[RenderingData](https://lamnhan.com/docsuper/interfaces/renderingdata.html)</code>

---

<h4><a name="renderservice-getdatabatch-0" href="https://lamnhan.com/docsuper/classes/renderservice.html#getdatabatch"><p><code>getDataBatch(batchRendering)</code></p></a></h4>

**The `getDataBatch` call signature.**

**Parameters**

| Param              | Type                                                                                       | Description |
| ------------------ | ------------------------------------------------------------------------------------------ | ----------- |
| **batchRendering** | <code>[BatchRendering](https://lamnhan.com/docsuper/interfaces/batchrendering.html)</code> |             |

**Returns**

<code>[BatchRenderingData](https://lamnhan.com/docsuper/interfaces/batchrenderingdata.html)</code>

---

<h4><a name="renderservice-render-0" href="https://lamnhan.com/docsuper/classes/renderservice.html#render"><p><code>render(rendering, currentContent?)</code></p></a></h4>

**The `render` call signature.**

**Parameters**

| Param          | Type                                                                                             | Description |
| -------------- | ------------------------------------------------------------------------------------------------ | ----------- |
| **rendering**  | <code>[Rendering](https://lamnhan.com/docsuper/interfaces/rendering.html)</code>                 |             |
| currentContent | <code>[ContentBySections](https://lamnhan.com/docsuper/interfaces/contentbysections.html)</code> |             |

**Returns**

<code>string</code>

---

<h4><a name="renderservice-renderbatch-0" href="https://lamnhan.com/docsuper/classes/renderservice.html#renderbatch"><p><code>renderBatch(batchRendering, batchCurrentContent?)</code></p></a></h4>

**The `renderBatch` call signature.**

**Parameters**

| Param               | Type                                                                                       | Description |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| **batchRendering**  | <code>[BatchRendering](https://lamnhan.com/docsuper/interfaces/batchrendering.html)</code> |             |
| batchCurrentContent | <code>object</code>                                                                        |             |

**Returns**

<code>[BatchRenderResult](https://lamnhan.com/docsuper/interfaces/batchrenderresult.html)</code>

---

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

## License

**@lamnhan/docsuper** is released under the [MIT](https://github.com/lamnhan/docsuper/blob/master/LICENSE) license.

</section>

<section id="attr" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

---

⚡️ This document is generated automatically using [@lamnhan/docsuper](https://github.com/lamnhan/docsuper).

</section>
