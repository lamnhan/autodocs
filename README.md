<section id="head" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h1 id="lamnhandocsuper">
  <a href="https://github.com/lamnhan">@lamnhan</a>/docsuper
</h1>
<p><strong>Document generator for Typescript projects.</strong></p>


</section>
<section id="header">

<p><a href="https://github.com/lamnhan/docsuper/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="License" /></a> <a href="https://www.patreon.com/lamnhan"><img src="https://lamnhan.github.io/assets/images/badges/patreon.svg" alt="Support me on Patreon" /></a> <a href="https://www.paypal.me/lamnhan"><img src="https://lamnhan.github.io/assets/images/badges/paypal_donate.svg" alt="PayPal" /></a> <a href="https://m.me/lamhiennhan"><img src="https://img.shields.io/badge/ask/me-anything-1abc9c.svg" alt="Ask me anything" /></a></p>

</section>
<section id="tocx" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<p><strong>Table of content</strong></p>
<ul id="master-toc">
  <li>
    <a href="#introduction">Introduction</a>
    <ul>
      <li><a href="#what-is-it">What is it?</a></li>
      <li><a href="#what-the-benefits">What the benefits?</a></li>
      <li><a href="#the-workflow">The workflow</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting started</a>
    <ul>
      <li><a href="#the-cli">The CLI</a></li>
      <li><a href="#the-library">The library</a></li>
      <li>
        <a href="#understand-the-source-code">Understand the source code</a>
      </li>
      <li><a href="#configuration">Configuration</a></li>
      <li><a href="#rendering-input">Rendering input</a></li>
      <li><a href="#using-templates">Using templates</a></li>
      <li><a href="#custom-sections">Custom sections</a></li>
    </ul>
  </li>
  <li><a href="#options">Options</a></li>
  <li><a href="#options-properties">Options properties</a></li>
  <li>
    <a href="#main">The Module</a>
    <ul>
      <li><a href="#main-properties">Main properties</a></li>
      <li>
        <a href="#main-methods">Main methods</a>
        <ul>
          <li>
            <a href="#main-convert-0"
              ><code>convert(declaration, output, options?)</code></a
            >
          </li>
          <li>
            <a href="#main-extend-0"><code>extend(optionsInput?)</code></a>
          </li>
          <li>
            <a href="#main-generatedocs-0"><code>generateDocs()</code></a>
          </li>
          <li>
            <a href="#main-output-0"><code>output(path, rendering)</code></a>
          </li>
          <li>
            <a href="#main-outputlocal-0"><code>outputLocal()</code></a>
          </li>
          <li>
            <a href="#main-parse-0"><code>parse(input?)</code></a>
          </li>
          <li>
            <a href="#main-render-0"
              ><code>render(rendering, currentContent?)</code></a
            >
          </li>
          <li>
            <a href="#main-renderlocal-0"><code>renderLocal()</code></a>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <a href="#declaration">Declaration</a>
    <ul>
      <li><a href="#declaration-properties">Declaration properties</a></li>
      <li>
        <a href="#declaration-methods">Declaration methods</a>
        <ul>
          <li>
            <a href="#declaration-getchild-0"><code>getChild(name)</code></a>
          </li>
          <li>
            <a href="#declaration-getchildid-0"
              ><code>getChildId(childName)</code></a
            >
          </li>
          <li>
            <a href="#declaration-getclasses-0"
              ><code>getClasses(filter?)</code></a
            >
          </li>
          <li>
            <a href="#declaration-getfunctionsormethods-0"
              ><code>getFunctionsOrMethods(filter?)</code></a
            >
          </li>
          <li>
            <a href="#declaration-getinterfaces-0"
              ><code>getInterfaces(filter?)</code></a
            >
          </li>
          <li>
            <a href="#declaration-getvariablesorproperties-0"
              ><code>getVariablesOrProperties(filter?)</code></a
            >
          </li>
          <li>
            <a href="#declaration-hasclasses-0"><code>hasClasses()</code></a>
          </li>
          <li>
            <a href="#declaration-hasfunctionsormethods-0"
              ><code>hasFunctionsOrMethods()</code></a
            >
          </li>
          <li>
            <a href="#declaration-hasinterfaces-0"
              ><code>hasInterfaces()</code></a
            >
          </li>
          <li>
            <a href="#declaration-hasvariablesorproperties-0"
              ><code>hasVariablesOrProperties()</code></a
            >
          </li>
          <li>
            <a href="#declaration-iscollection-0"
              ><code>isCollection()</code></a
            >
          </li>
          <li>
            <a href="#declaration-iskind-0"><code>isKind(kindString)</code></a>
          </li>
          <li>
            <a href="#declaration-isroot-0"><code>isRoot()</code></a>
          </li>
          <li>
            <a href="#declaration-setid-0"><code>setId(id)</code></a>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <a href="#parseservice">Parsing</a>
    <ul>
      <li>
        <a href="#parseservice-methods">ParseService methods</a>
        <ul>
          <li>
            <a href="#parseservice-parse-0"><code>parse(input?)</code></a>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <a href="#convertservice">Converting</a>
    <ul>
      <li>
        <a href="#convertservice-methods">ConvertService methods</a>
        <ul>
          <li>
            <a href="#convertservice-convert-0"
              ><code>convert(declaration, output, options?)</code></a
            >
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <a href="#renderservice">Rendering</a>
    <ul>
      <li>
        <a href="#renderservice-methods">RenderService methods</a>
        <ul>
          <li>
            <a href="#renderservice-getdata-0"
              ><code>getData(rendering)</code></a
            >
          </li>
          <li>
            <a href="#renderservice-getdatabatch-0"
              ><code>getDataBatch(batchRendering)</code></a
            >
          </li>
          <li>
            <a href="#renderservice-render-0"
              ><code>render(rendering, currentContent?)</code></a
            >
          </li>
          <li>
            <a href="#renderservice-renderbatch-0"
              ><code>renderBatch(batchRendering, batchCurrentContent?)</code></a
            >
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li><a href="https://lamnhan.com/docsuper">Detail API reference</a></li>
</ul>


</section>
<section id="introduction">

<h2 id="introduction">Introduction</h2>
<p>Documentation is a crucial part of every great open-source projects. But making docs is such a Pain-In-The-Brain process.</p>
<p>Since <a href="https://www.typescriptlang.org">Typescript</a> is an self documenting language, we can leverage its power to extract the source code information. This library is based on <a href="https://typedoc.org">Typedoc</a>, one of the best tool for generating Typescript documentation.</p>
<h3 id="whatisit">What is it?</h3>
<p><strong>docsuper</strong> is a tool for generating documentation directly from the source code.</p>
<p>It provides 3 main services:</p>
<ul>
<li><a href="#parser">The <code>Parser</code></a>: turns the source into a <a href="#declaration">Declaration</a>.</li>
<li><a href="#converter">The <code>Converter</code></a>: converts a <a href="#declaration">Declaration</a> into content data.</li>
<li><a href="#renderer">The <code>Renderer</code></a>: renders the content data to the final content.</li>
</ul>
<p>Using <a href="#the-cli">the CLI</a>, you can easily generate a document by providing <a href="#options">the configuration</a> in <code>package.json</code> or <code>docsuper.config.js</code> file.</p>
<p>An example configuration:</p>
<pre><code class="json language-json">{
  "files": {
    "README.md": {
      "head": true,
      "toc": true,
      "section1": ["Class1"],
      "section2": ["Interface2"],
      "license": true
    }
  }
}</code></pre>
<p>Run <code>docsuper generate</code> will output:</p>
<ul>
<li>The <code>docs/</code> folder: the detail document, generated by <a href="https://typedoc.org">Typedoc</a>.</li>
<li>And every document files based on the configuration.</li>
</ul>
<blockquote>
  <p>NOTE: <strong>docsuper</strong> uses <a href="https://typedoc.org">Typedoc</a> to generate the detail documentation (can be ignored).<br />
  <a href="#the-cli">The CLI</a> is only used to generate simpler additional document files, such as <code>README.md</code>.</p>
</blockquote>
<h3 id="whatthebenefits">What the benefits?</h3>
<ul>
<li>Easy to config &amp; usage</li>
<li>Avoid reference mistakes and code duplications</li>
<li>Improve source code quality with <a href="https://github.com/microsoft/tsdoc">TSdoc</a></li>
<li>Save time and avoid brain damage</li>
</ul>
<h3 id="theworkflow">The workflow</h3>
<p>Adding <strong>docsuper</strong> to any project in less than 5 simple steps:</p>
<ol>
<li>Coding as usual</li>
<li>(Optional) Documenting the source code with <a href="https://github.com/microsoft/tsdoc">TSdoc</a></li>
<li>(Optional) Putting custom sections and placeholders to files</li>
<li>Add <a href="#configuration">configuration</a> to <code>package.json</code> or <code>docsuper.config.js</code></li>
<li>Run <code>docsuper generate</code> to generate content</li>
</ol>

</section>
<section id="getting-started">

<h2 id="gettingstarted">Getting started</h2>
<p>You can use <strong>docsuper</strong> to generate documentation from the command-line interface or <a href="#the-library">manually</a> parsing, converting or rendering content in a Node application.</p>
<h3 id="thecli">The CLI</h3>
<p>Install globally by running:</p>
<pre><code class="sh language-sh">npm install -g @lamnhan/docsuper</code></pre>
<p>A command now available from the terminal, you can run: <code>docsuper</code>.</p>
<p>If you wish to run the CLI locally, install the package with <code>--save-dev</code> flag:</p>
<pre><code class="sh language-sh">npm install --save-dev @lamnhan/docsuper</code></pre>
<p>Then put a script in the <code>package.json</code>, so you can do <code>npm run docs</code> every build.</p>
<pre><code class="json language-json">{
  "scripts": {
    "docs": "docsuper generate"
  }
}</code></pre>
<h3 id="thelibrary">The library</h3>
<p>Install as dev dependency:</p>
<pre><code class="sh language-sh">npm install --save-dev @lamnhan/docsuper</code></pre>
<p>Use the library:</p>
<pre><code class="ts language-ts">import { docsuper } from "@lamnhan/docsuper";

// init an instance
const generator = docsuper(/* Options */);

// parsing
const parsing = generator.parse("Main");

// rendering
const rendering = generator.render({
  section1: ["Options"],
  section2: ["Main"]
});</code></pre>
<p>See <a href="#main">Main</a> for service detail and <a href="#options">Options</a> for more options.</p>
<h3 id="understandthesourcecode">Understand the source code</h3>
<p>A Typescript project source code contains many elements with different kinds: <code>Variable/Property</code>, <code>Function/Method</code>, <code>Interface</code>, <code>Class</code>, …</p>
<p>Imagine your source code has 3 files: <code>file1.ts</code>, <code>file2.ts</code>, <code>file3.ts</code>. Each file exports certain elements.</p>
<p>But you can see your whole source code as a single flattened file like this:</p>
<pre><code class="ts language-ts">// ================== file1.ts ==================

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
}</code></pre>
<p>To get information, we turn any element of the source code into a <a href="#declaration">Declaration</a> (a source code unit). There are 2 types of <a href="#declaration">Declaration</a>:</p>
<ul>
<li><strong>Direct</strong>: for top level elements, such as: <code>Variable</code>, <code>Function</code>, <code>Interface</code>, <code>Class</code> and a <code>Collection</code> of any top level elements.</li>
<li><strong>Indirect</strong>: for child elements of a top level element, such as: <code>Property</code> and <code>Method</code>.</li>
</ul>
<h3 id="configuration">Configuration</h3>
<p>The CLI load configuration from <code>package.json</code> or <code>docsuper.config.js</code>. See <a href="#options">Options</a> section for detail.</p>
<p>Open <code>package.json</code> and add:</p>
<pre><code class="json language-json">{
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
}</code></pre>
<p>With the configuration above, you tell the CLI to create a file named <code>TEST.md</code> with two sections:</p>
<ul>
<li>The <code>head</code> section: a <a href="#renderer">built-in</a> section that display the package name and description.</li>
<li>The <code>s1</code> section: a <a href="#rendering-input">rendering</a> section that display the source code element title and description.</li>
</ul>
<p>The <code>TEST.md</code> content would be:</p>
<pre><code class="md language-md">&lt;\section id="head"&gt;

\# my-package

**My package description.**

&lt;/\section&gt;

&lt;/\section id="s1"&gt;

\## The `Main` class

**This is a Class element named `Main`**

And this is the `Main` element detail.

Supports Markdown content.

&lt;/\section&gt;</code></pre>
<h3 id="renderinginput">Rendering input</h3>
<p>Take a look at the <code>s1</code> section configuration above. We see it holds an array of values: <code>["Main", "SELF"]</code>. This array is called <strong>a rendering input</strong>.</p>
<p>A rendering input provide instructions for <a href="#parser">the Parser</a> and <a href="#converter">the Converter</a>, it has 3 parts:</p>
<ul>
<li>The <strong>WHAT</strong>: tells <a href="#parser">the Parser</a> to parse what source code element:<ul>
<li>Top level elements: provide the name of the element, example: <code>PI</code>, <code>Options</code>, …</li>
<li>Child elements: put a <code>.</code> between the parent and the child name, example: <code>Options.prop1</code>, <code>Main.method1</code>, …</li>
<li>Collection of elements: the list of paths, <code>@</code> for <code>./src/</code> and separated by <code>+</code>, example: <code>@file1.ts+@lib/filex.ts</code></li></ul></li>
<li>The <strong>HOW</strong> (optional, default to <code>SELF</code>): tells <a href="#converter">the Converter</a> how we want to extract the information from the parsing result.</li>
<li>The <strong>options</strong> (optional): custom converter options, see <a href="https://lamnhan.com/docsuper/interfaces/converteroptions.html">ConverterOptions</a>.</li>
</ul>
<p>See <a href="#parser">the Parser</a> for parsing detail and <a href="#converter">the Converter</a> for converting detail.</p>
<h3 id="usingtemplates">Using templates</h3>
<p>Rendering template is a convinient way to render documents for common source code structure. To use a template, just replace rendering sections with the template name:</p>
<pre><code class="json language-json">{
  "files": {
    "TEST.md": "mini"
  }
}</code></pre>
<p>Currently supported 2 templates:</p>
<ul>
<li><p><code>mini</code> template, included these sections:</p>
<ul>
<li><strong>head</strong>: package name &amp; description</li>
<li><strong>toc</strong>: table of content</li>
<li><strong>options</strong>: summary properties of <code>Options</code> interface</li>
<li><strong>main</strong>: full <code>Main</code> class info</li>
<li><strong>license</strong>: license informatiion</li></ul></li>
<li><p><code>full</code> template, included these sections:</p>
<ul>
<li><strong>head</strong>: package name &amp; description</li>
<li><strong>toc</strong>: table of content</li>
<li><strong>functions</strong>: full list of all functions</li>
<li><strong>interfaces</strong>: summary list of all interfaces</li>
<li><strong>classes</strong>: full list of all classes</li>
<li><strong>license</strong>: license informatiion</li></ul></li>
</ul>
<h3 id="customsections">Custom sections</h3>
<p>You can add any custom sections to a document file. <a href="#the-cli">The CLI</a> will replace any section exists in the configuration with generated content and keep others as is.</p>
<p>You must wrap content inside the HTML <code>section</code> tag with a <strong>unique id</strong>.</p>
<pre><code class="md language-md">&lt;\section id="xxx"&gt;

Any markdown content goes here!

&lt;/\section&gt;</code></pre>
<p>Section can also be put in the source file, called <a href="#rendering"><strong>local section</strong></a>.</p>
<p><strong>IMPORTANT</strong>: If the content has these structures, you must escape them to avoid conflicts:</p>
<ul>
<li><code>&lt;\section id="xxx"&gt;...&lt;/\section&gt;</code> (HTML sections with an id)</li>
<li><code>\# A heading</code> (Markdown headings, but <strong>not intended</strong> to be headings)</li>
<li><code>&lt;\h1&gt;A heading&lt;/\h1&gt;</code> (HTML headings, but <strong>not intended</strong> to be headings)</li>
</ul>

</section>
<section id="options" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2>
  <a name="options" href="https://lamnhan.com/docsuper/interfaces/options.html"
    ><p>Options</p></a
  >
</h2>
<p><strong>Custom generator options</strong></p>
<p>Options can be provided in 3 ways:</p>
<ul>
  <li>
    Under the <strong>@lamnhan/docsuper</strong> property of
    <code>package.json</code> file
  </li>
  <li>The <code>docsuper.config.js</code> file for more advanced config</li>
  <li>
    By the <code>options</code> param when init new <a data-sref="docsuper">
    <code>docsuper(options?)</code></a> instance.
  </li>
</ul>
<h2>
  <a name="options-properties"><p>Options properties</p></a>
</h2>
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/options.html#apigenerator"
          >apiGenerator</a
        >
      </p>
    </td>
    <td><p>"typedoc" | "none"</p></td>
    <td><p>Detail API generator</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/interfaces/options.html#apiurl"
          >apiUrl</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td>
      <p>Custom API reference url, default to the Github Pages repo url</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/interfaces/options.html#converts"
          >converts</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/additionalconverts.html"
          target="_blank"
          >AdditionalConverts</a
        >
      </p>
    </td>
    <td><p>Additional converts</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/interfaces/options.html#files"
          >files</a
        >
      </p>
    </td>
    <td><p>object</p></td>
    <td>
      <p>
        List of documents to be generated: <strong>key</strong> is the path to
        the document and <strong>value</strong> is a template name or a
        rendering input
      </p>
    </td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/interfaces/options.html#noattr"
          >noAttr</a
        >
      </p>
    </td>
    <td><p>boolean</p></td>
    <td><p>No generator footer attribution</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/interfaces/options.html#srcpath"
          >srcPath</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td>
      <p>Path to the source code, default to <code>src</code></p>
    </td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/interfaces/options.html#typedoc"
          >typedoc</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/typedocconfigs.html"
          target="_blank"
          >TypedocConfigs</a
        >
      </p>
    </td>
    <td>
      <p>Custom <a href="https://typedoc.org">Typedoc</a> config</p>
    </td>
  </tr>
</table>


</section>
<section id="main" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2>
  <a name="main" href="https://lamnhan.com/docsuper/classes/main.html"
    ><p>The Module</p></a
  >
</h2>
<p><strong>The Docsuper module</strong></p>
<h3>
  <a name="main-properties"><p>Main properties</p></a>
</h3>
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html#content"
          >Content</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/contentservice.html"
          target="_blank"
          >ContentService</a
        >
      </p>
    </td>
    <td><p>Get the Content service</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html#convert"
          >Convert</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/convertservice.html"
          target="_blank"
          >ConvertService</a
        >
      </p>
    </td>
    <td><p>Get the Convert service</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html#load">Load</a>
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/loadservice.html"
          target="_blank"
          >LoadService</a
        >
      </p>
    </td>
    <td><p>Get the Load service</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html#parse">Parse</a>
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/parseservice.html"
          target="_blank"
          >ParseService</a
        >
      </p>
    </td>
    <td><p>Get the Parse service</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html#project"
          >Project</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/projectservice.html"
          target="_blank"
          >ProjectService</a
        >
      </p>
    </td>
    <td><p>Get the Project service</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html#render"
          >Render</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/renderservice.html"
          target="_blank"
          >RenderService</a
        >
      </p>
    </td>
    <td><p>Get the Render service</p></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html#typedoc"
          >Typedoc</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/typedocservice.html"
          target="_blank"
          >TypedocService</a
        >
      </p>
    </td>
    <td><p>Get the Typedoc service</p></td>
  </tr>
</table>

<h3>
  <a name="main-methods"><p>Main methods</p></a>
</h3>
<table>
  <tr>
    <th>Function</th>
    <th>Returns type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#main-convert-0">convert(declaration, output, options?)</a>
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/headingblock.html"
          target="_blank"
          >HeadingBlock</a
        >
        |
        <a
          href="https://lamnhan.com/docsuper/interfaces/textblock.html"
          target="_blank"
          >TextBlock</a
        >
        |
        <a
          href="https://lamnhan.com/docsuper/interfaces/listblock.html"
          target="_blank"
          >ListBlock</a
        >
        |
        <a
          href="https://lamnhan.com/docsuper/interfaces/tableblock.html"
          target="_blank"
          >TableBlock</a
        >[]
      </p>
    </td>
    <td><p>Convert a declaration into content blocks.</p></td>
  </tr>
  <tr>
    <td>
      <p><a href="#main-extend-0">extend(optionsInput?)</a></p>
    </td>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/main.html" target="_blank"
          >Main</a
        >
      </p>
    </td>
    <td><p>Create a new instance</p></td>
  </tr>
  <tr>
    <td>
      <p><a href="#main-generatedocs-0">generateDocs()</a></p>
    </td>
    <td><p>void</p></td>
    <td><p>Generate the API reference using Typedoc.</p></td>
  </tr>
  <tr>
    <td>
      <p><a href="#main-output-0">output(path, rendering)</a></p>
    </td>
    <td><p>void</p></td>
    <td><p>Render and save a document</p></td>
  </tr>
  <tr>
    <td>
      <p><a href="#main-outputlocal-0">outputLocal()</a></p>
    </td>
    <td><p>void</p></td>
    <td><p>Render and save documents based on local configuration.</p></td>
  </tr>
  <tr>
    <td>
      <p><a href="#main-parse-0">parse(input?)</a></p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"
          >Declaration</a
        >
      </p>
    </td>
    <td><p>Turn the source code into a <a data-sref="Declaration" href="https://lamnhan.com/docsuper/classes/declaration.html">Declaration</a>.</p></td>
  </tr>
  <tr>
    <td>
      <p><a href="#main-render-0">render(rendering, currentContent?)</a></p>
    </td>
    <td><p>string</p></td>
    <td><p>Render content based on configuration.</p></td>
  </tr>
  <tr>
    <td>
      <p><a href="#main-renderlocal-0">renderLocal()</a></p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/batchrenderresult.html"
          target="_blank"
          >BatchRenderResult</a
        >
      </p>
    </td>
    <td><p>Render content based on local configuration.</p></td>
  </tr>
</table>

<h4>
  <a
    name="main-convert-0"
    href="https://lamnhan.com/docsuper/classes/main.html#convert"
    ><p><code>convert(declaration, output, options?)</code></p></a
  >
</h4>
<p><strong>Convert a declaration into content blocks.</strong></p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>declaration</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"&gt;Declaration&lt;/a&gt;</code
        >
      </p>
    </td>
    <td><p>The declaration</p></td>
  </tr>
  <tr>
    <td>
      <p><strong>output</strong></p>
    </td>
    <td>
      <p><code>string</code></p>
    </td>
    <td><p>Expected output, see <a data-sref="ConvertService" href="https://lamnhan.com/docsuper/classes/convertservice.html">ConvertService</a></p></td>
  </tr>
  <tr>
    <td><p>options</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/interfaces/convertoptions.html"
          target="_blank"&gt;ConvertOptions&lt;/a&gt;</code
        >
      </p>
    </td>
    <td><p>Custom convertion options</p></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/interfaces/headingblock.html"
    target="_blank"
    >HeadingBlock</a
  >
  |
  <a
    href="https://lamnhan.com/docsuper/interfaces/textblock.html"
    target="_blank"
    >TextBlock</a
  >
  |
  <a
    href="https://lamnhan.com/docsuper/interfaces/listblock.html"
    target="_blank"
    >ListBlock</a
  >
  |
  <a
    href="https://lamnhan.com/docsuper/interfaces/tableblock.html"
    target="_blank"
    >TableBlock</a
  >[]
</p>
<hr />
<h4>
  <a
    name="main-extend-0"
    href="https://lamnhan.com/docsuper/classes/main.html#extend"
    ><p><code>extend(optionsInput?)</code></p></a
  >
</h4>
<p><strong>Create a new instance</strong></p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><p>optionsInput</p></td>
    <td>
      <p>
        <code
          >&lt;a href="https://lamnhan.com/docsuper/globals.html#optionsinput"
          target="_blank"&gt;OptionsInput&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a href="https://lamnhan.com/docsuper/classes/main.html" target="_blank"
    >Main</a
  >
</p>
<hr />
<h4>
  <a
    name="main-generatedocs-0"
    href="https://lamnhan.com/docsuper/classes/main.html#generatedocs"
    ><p><code>generateDocs()</code></p></a
  >
</h4>
<p><strong>Generate the API reference using Typedoc.</strong></p>
<p>
  The default folder is <strong>/docs</strong>. You can change the output folder
  by providing the <code>out</code> property of <a data-sref="Options" href="https://lamnhan.com/docsuper/interfaces/options.html">Options</a>.
</p>
<p><strong>Returns</strong></p>
<p>void</p>
<hr />
<h4>
  <a
    name="main-output-0"
    href="https://lamnhan.com/docsuper/classes/main.html#output"
    ><p><code>output(path, rendering)</code></p></a
  >
</h4>
<p><strong>Render and save a document</strong></p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>path</strong></p>
    </td>
    <td>
      <p><code>string</code></p>
    </td>
    <td><p>Path to the document</p></td>
  </tr>
  <tr>
    <td>
      <p><strong>rendering</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a href="https://lamnhan.com/docsuper/interfaces/rendering.html"
          target="_blank"&gt;Rendering&lt;/a&gt;</code
        >
      </p>
    </td>
    <td><p>Rendering configuration</p></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>void</p>
<hr />
<h4>
  <a
    name="main-outputlocal-0"
    href="https://lamnhan.com/docsuper/classes/main.html#outputlocal"
    ><p><code>outputLocal()</code></p></a
  >
</h4>
<p><strong>Render and save documents based on local configuration.</strong></p>
<p><strong>Returns</strong></p>
<p>void</p>
<hr />
<h4>
  <a
    name="main-parse-0"
    href="https://lamnhan.com/docsuper/classes/main.html#parse"
    ><p><code>parse(input?)</code></p></a
  >
</h4>
<p><strong>Turn the source code into a <a data-sref="Declaration" href="https://lamnhan.com/docsuper/classes/declaration.html">Declaration</a>.</strong></p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><p>input</p></td>
    <td>
      <p><code>string</code></p>
    </td>
    <td><p>Parsing input</p></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    target="_blank"
    >Declaration</a
  >
</p>
<hr />
<h4>
  <a
    name="main-render-0"
    href="https://lamnhan.com/docsuper/classes/main.html#render"
    ><p><code>render(rendering, currentContent?)</code></p></a
  >
</h4>
<p><strong>Render content based on configuration.</strong></p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>rendering</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a href="https://lamnhan.com/docsuper/interfaces/rendering.html"
          target="_blank"&gt;Rendering&lt;/a&gt;</code
        >
      </p>
    </td>
    <td><p>Redering configuration</p></td>
  </tr>
  <tr>
    <td><p>currentContent</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/interfaces/contentbysections.html"
          target="_blank"&gt;ContentBySections&lt;/a&gt;</code
        >
      </p>
    </td>
    <td><p>Current content by sections</p></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>string</p>
<hr />
<h4>
  <a
    name="main-renderlocal-0"
    href="https://lamnhan.com/docsuper/classes/main.html#renderlocal"
    ><p><code>renderLocal()</code></p></a
  >
</h4>
<p><strong>Render content based on local configuration.</strong></p>
<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/interfaces/batchrenderresult.html"
    target="_blank"
    >BatchRenderResult</a
  >
</p>
<hr />


</section>
<section id="declaration" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2>
  <a
    name="declaration"
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    ><p>Declaration</p></a
  >
</h2>
<p>
  <strong
    >A Declaration is an unit that holds the information of a source code
    element.</strong
  >
</p>
<h3>
  <a name="declaration-properties"><p>Declaration properties</p></a>
</h3>
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html#default_value"
          >DEFAULT_VALUE</a
        >
      </p>
    </td>
    <td><p>any</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html#display_type"
          >DISPLAY_TYPE</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html#full_text"
          >FULL_TEXT</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/declaration.html#id"
          >ID</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html#is_optional"
          >IS_OPTIONAL</a
        >
      </p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/declaration.html#link"
          >LINK</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/declaration.html#name"
          >NAME</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html#parameters"
          >PARAMETERS</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/reflectiondata.html"
          target="_blank"
          >ReflectionData</a
        >[]
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html#reflection"
          >REFLECTION</a
        >
      </p>
    </td>
    <td><p>Reflection</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/declaration.html#returns"
          >RETURNS</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/declaration.html#sections"
          >SECTIONS</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/contentbysections.html"
          target="_blank"
          >ContentBySections</a
        >
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html#short_text"
          >SHORT_TEXT</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/declaration.html#text"
          >TEXT</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="https://lamnhan.com/docsuper/classes/declaration.html#type"
          >TYPE</a
        >
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
</table>

<h3>
  <a name="declaration-methods"><p>Declaration methods</p></a>
</h3>
<table>
  <tr>
    <th>Function</th>
    <th>Returns type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-getchild-0">getChild(name)</a></p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"
          >Declaration</a
        >
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-getchildid-0">getChildId(childName)</a></p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-getclasses-0">getClasses(filter?)</a></p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"
          >Declaration</a
        >[]
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#declaration-getfunctionsormethods-0"
          >getFunctionsOrMethods(filter?)</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"
          >Declaration</a
        >[]
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-getinterfaces-0">getInterfaces(filter?)</a></p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"
          >Declaration</a
        >[]
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#declaration-getvariablesorproperties-0"
          >getVariablesOrProperties(filter?)</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"
          >Declaration</a
        >[]
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-hasclasses-0">hasClasses()</a></p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#declaration-hasfunctionsormethods-0"
          >hasFunctionsOrMethods()</a
        >
      </p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-hasinterfaces-0">hasInterfaces()</a></p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#declaration-hasvariablesorproperties-0"
          >hasVariablesOrProperties()</a
        >
      </p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-iscollection-0">isCollection()</a></p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-iskind-0">isKind(kindString)</a></p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-isroot-0">isRoot()</a></p>
    </td>
    <td><p>boolean</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><a href="#declaration-setid-0">setId(id)</a></p>
    </td>
    <td><p>this</p></td>
    <td></td>
  </tr>
</table>

<h4>
  <a
    name="declaration-getchild-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#getchild"
    ><p><code>getChild(name)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getChild</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>name</strong></p>
    </td>
    <td>
      <p><code>string</code></p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    target="_blank"
    >Declaration</a
  >
</p>
<hr />
<h4>
  <a
    name="declaration-getchildid-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#getchildid"
    ><p><code>getChildId(childName)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getChildId</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>childName</strong></p>
    </td>
    <td>
      <p><code>string</code></p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>string</p>
<hr />
<h4>
  <a
    name="declaration-getclasses-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#getclasses"
    ><p><code>getClasses(filter?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getClasses</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><p>filter</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/globals.html#declarationfilter"
          target="_blank"&gt;DeclarationFilter&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    target="_blank"
    >Declaration</a
  >[]
</p>
<hr />
<h4>
  <a
    name="declaration-getfunctionsormethods-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#getfunctionsormethods"
    ><p><code>getFunctionsOrMethods(filter?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getFunctionsOrMethods</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><p>filter</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/globals.html#declarationfilter"
          target="_blank"&gt;DeclarationFilter&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    target="_blank"
    >Declaration</a
  >[]
</p>
<hr />
<h4>
  <a
    name="declaration-getinterfaces-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#getinterfaces"
    ><p><code>getInterfaces(filter?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getInterfaces</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><p>filter</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/globals.html#declarationfilter"
          target="_blank"&gt;DeclarationFilter&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    target="_blank"
    >Declaration</a
  >[]
</p>
<hr />
<h4>
  <a
    name="declaration-getvariablesorproperties-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#getvariablesorproperties"
    ><p><code>getVariablesOrProperties(filter?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getVariablesOrProperties</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><p>filter</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/globals.html#declarationfilter"
          target="_blank"&gt;DeclarationFilter&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    target="_blank"
    >Declaration</a
  >[]
</p>
<hr />
<h4>
  <a
    name="declaration-hasclasses-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#hasclasses"
    ><p><code>hasClasses()</code></p></a
  >
</h4>
<p>
  <strong>The <code>hasClasses</code> call signature.</strong>
</p>
<p><strong>Returns</strong></p>
<p>boolean</p>
<hr />
<h4>
  <a
    name="declaration-hasfunctionsormethods-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#hasfunctionsormethods"
    ><p><code>hasFunctionsOrMethods()</code></p></a
  >
</h4>
<p>
  <strong>The <code>hasFunctionsOrMethods</code> call signature.</strong>
</p>
<p><strong>Returns</strong></p>
<p>boolean</p>
<hr />
<h4>
  <a
    name="declaration-hasinterfaces-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#hasinterfaces"
    ><p><code>hasInterfaces()</code></p></a
  >
</h4>
<p>
  <strong>The <code>hasInterfaces</code> call signature.</strong>
</p>
<p><strong>Returns</strong></p>
<p>boolean</p>
<hr />
<h4>
  <a
    name="declaration-hasvariablesorproperties-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#hasvariablesorproperties"
    ><p><code>hasVariablesOrProperties()</code></p></a
  >
</h4>
<p>
  <strong>The <code>hasVariablesOrProperties</code> call signature.</strong>
</p>
<p><strong>Returns</strong></p>
<p>boolean</p>
<hr />
<h4>
  <a
    name="declaration-iscollection-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#iscollection"
    ><p><code>isCollection()</code></p></a
  >
</h4>
<p>
  <strong>The <code>isCollection</code> call signature.</strong>
</p>
<p><strong>Returns</strong></p>
<p>boolean</p>
<hr />
<h4>
  <a
    name="declaration-iskind-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#iskind"
    ><p><code>isKind(kindString)</code></p></a
  >
</h4>
<p>
  <strong>The <code>isKind</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>kindString</strong></p>
    </td>
    <td>
      <p><code>keyof ReflectionKind</code></p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>boolean</p>
<hr />
<h4>
  <a
    name="declaration-isroot-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#isroot"
    ><p><code>isRoot()</code></p></a
  >
</h4>
<p>
  <strong>The <code>isRoot</code> call signature.</strong>
</p>
<p><strong>Returns</strong></p>
<p>boolean</p>
<hr />
<h4>
  <a
    name="declaration-setid-0"
    href="https://lamnhan.com/docsuper/classes/declaration.html#setid"
    ><p><code>setId(id)</code></p></a
  >
</h4>
<p>
  <strong>The <code>setId</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>id</strong></p>
    </td>
    <td>
      <p><code>string</code></p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>this</p>
<hr />


</section>
<section id="parser" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2>
  <a
    name="parseservice"
    href="https://lamnhan.com/docsuper/classes/parseservice.html"
    ><p>Parsing</p></a
  >
</h2>
<p>
  <strong
    >The <code>Parser</code> turns source code into <a data-sref="Declaration" href="https://lamnhan.com/docsuper/classes/declaration.html">Declaration</a></strong
  >
</p>
<h3>
  <a name="parseservice-methods"><p>ParseService methods</p></a>
</h3>
<table>
  <tr>
    <th>Function</th>
    <th>Returns type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><a href="#parseservice-parse-0">parse(input?)</a></p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"
          >Declaration</a
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<h4>
  <a
    name="parseservice-parse-0"
    href="https://lamnhan.com/docsuper/classes/parseservice.html#parse"
    ><p><code>parse(input?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>parse</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><p>input</p></td>
    <td>
      <p><code>string</code></p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/classes/declaration.html"
    target="_blank"
    >Declaration</a
  >
</p>
<hr />


</section>
<section id="converter" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2>
  <a
    name="convertservice"
    href="https://lamnhan.com/docsuper/classes/convertservice.html"
    ><p>Converting</p></a
  >
</h2>
<p>
  <strong
    >The Converter turns a <a data-sref="Declaration" href="https://lamnhan.com/docsuper/classes/declaration.html">Declaration</a> into <a data-sref="Block">content
    blocks</a></strong
  >
</p>
<h3 id="converteroutput">Converter output</h3>
<p>
  A <a data-sref="Declaration" href="https://lamnhan.com/docsuper/classes/declaration.html">Declaration</a> supports certain convert output depended on its kind. You
  can also provide your custom converts output, use the
  <code>converts</code> field of <a data-sref="Options" href="https://lamnhan.com/docsuper/interfaces/options.html">Options</a>.
</p>
<p>Here the list of default output:</p>
<table>
  <thead>
    <tr>
      <th>Output</th>
      <th>Kinds</th>
      <th>Options</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>SECTION:<code>ID</code></strong>
      </td>
      <td>any</td>
      <td>none</td>
      <td>A local section</td>
    </tr>
    <tr>
      <td><strong>VALUE</strong></td>
      <td><code>Variable</code>, <code>Property</code></td>
      <td><a data-sref="ValueOptions" href="https://lamnhan.com/docsuper/interfaces/valueoptions.html">ValueOptions</a></td>
      <td>Default value</td>
    </tr>
    <tr>
      <td><strong>SELF</strong></td>
      <td>any</td>
      <td>
        <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a> &amp;
        <a data-sref="HeadingOptions" href="https://lamnhan.com/docsuper/interfaces/headingoptions.html">HeadingOptions</a>
      </td>
      <td>
        Title, description, content WITHOUT local sections, parameters &amp;
        returns (for function)
      </td>
    </tr>
    <tr>
      <td><strong>FULL</strong></td>
      <td>any</td>
      <td>
        <a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a> &amp;
        <a data-sref="HeadingOptions" href="https://lamnhan.com/docsuper/interfaces/headingoptions.html">HeadingOptions</a>
      </td>
      <td>All content (with headings)</td>
    </tr>
    <tr>
      <td><strong>SUMMARY_VARIABLES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table of variables</td>
    </tr>
    <tr>
      <td><strong>DETAIL_VARIABLES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Detail list of variables</td>
    </tr>
    <tr>
      <td><strong>FULL_VARIABLES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table &amp; detail list of variables</td>
    </tr>
    <tr>
      <td><strong>SUMMARY_FUNCTIONS</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table of functions</td>
    </tr>
    <tr>
      <td><strong>DETAIL_FUNCTIONS</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Detail list of functions</td>
    </tr>
    <tr>
      <td><strong>FULL_FUNCTIONS</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table &amp; detail list of functions</td>
    </tr>
    <tr>
      <td><strong>SUMMARY_PROPERTIES</strong></td>
      <td><code>Interface</code>, <code>Class</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table of properties</td>
    </tr>
    <tr>
      <td><strong>DETAIL_PROPERTIES</strong></td>
      <td><code>Interface</code>, <code>Class</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Detail list of properties</td>
    </tr>
    <tr>
      <td><strong>FULL_PROPERTIES</strong></td>
      <td><code>Interface</code>, <code>Class</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table &amp; detail list of properties</td>
    </tr>
    <tr>
      <td><strong>SUMMARY_METHODS</strong></td>
      <td><code>Class</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table of methods</td>
    </tr>
    <tr>
      <td><strong>DETAIL_METHODS</strong></td>
      <td><code>Class</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Detail list of methods</td>
    </tr>
    <tr>
      <td><strong>FULL_METHODS</strong></td>
      <td><code>Class</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table &amp; detail list of methods</td>
    </tr>
    <tr>
      <td><strong>SUMMARY_INTERFACES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table of interfaces</td>
    </tr>
    <tr>
      <td><strong>DETAIL_INTERFACES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Detail list of interfaces</td>
    </tr>
    <tr>
      <td><strong>FULL_INTERFACES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table &amp; detail list of interfaces</td>
    </tr>
    <tr>
      <td><strong>SUMMARY_CLASSES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table of classes</td>
    </tr>
    <tr>
      <td><strong>DETAIL_CLASSES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Detail list of classes</td>
    </tr>
    <tr>
      <td><strong>FULL_CLASSES</strong></td>
      <td><code>Collection</code></td>
      <td><a data-sref="DeclarationOptions" href="https://lamnhan.com/docsuper/interfaces/declarationoptions.html">DeclarationOptions</a> &amp; <a data-sref="ConvertingOptions">ConvertingOptions</a></td>
      <td>Summary table &amp; detail list of classes</td>
    </tr>
  </tbody>
</table>
<p>Provide options with the third item of a rendering input:</p>
<ul>
  <li>Declaration id: <code>{ id }</code></li>
  <li><strong>SELF</strong> header: <code>{ title, link }</code></li>
  <li>Raw object: <code>{ raw: true }</code></li>
  <li>Level: <code>{ level }</code></li>
  <li>Use the default heading: <code>{ heading: true }</code></li>
  <li>
    Use local anchors (instead of detail links): <code>{ local: true }</code>
  </li>
</ul>
<h3>
  <a name="convertservice-methods"><p>ConvertService methods</p></a>
</h3>
<table>
  <tr>
    <th>Function</th>
    <th>Returns type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#convertservice-convert-0"
          >convert(declaration, output, options?)</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/headingblock.html"
          target="_blank"
          >HeadingBlock</a
        >
        |
        <a
          href="https://lamnhan.com/docsuper/interfaces/textblock.html"
          target="_blank"
          >TextBlock</a
        >
        |
        <a
          href="https://lamnhan.com/docsuper/interfaces/listblock.html"
          target="_blank"
          >ListBlock</a
        >
        |
        <a
          href="https://lamnhan.com/docsuper/interfaces/tableblock.html"
          target="_blank"
          >TableBlock</a
        >[]
      </p>
    </td>
    <td></td>
  </tr>
</table>

<h4>
  <a
    name="convertservice-convert-0"
    href="https://lamnhan.com/docsuper/classes/convertservice.html#convert"
    ><p><code>convert(declaration, output, options?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>convert</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>declaration</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a href="https://lamnhan.com/docsuper/classes/declaration.html"
          target="_blank"&gt;Declaration&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p><strong>output</strong></p>
    </td>
    <td>
      <p><code>string</code></p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td><p>options</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/interfaces/convertoptions.html"
          target="_blank"&gt;ConvertOptions&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/interfaces/headingblock.html"
    target="_blank"
    >HeadingBlock</a
  >
  |
  <a
    href="https://lamnhan.com/docsuper/interfaces/textblock.html"
    target="_blank"
    >TextBlock</a
  >
  |
  <a
    href="https://lamnhan.com/docsuper/interfaces/listblock.html"
    target="_blank"
    >ListBlock</a
  >
  |
  <a
    href="https://lamnhan.com/docsuper/interfaces/tableblock.html"
    target="_blank"
    >TableBlock</a
  >[]
</p>
<hr />


</section>
<section id="renderer" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2>
  <a
    name="renderservice"
    href="https://lamnhan.com/docsuper/classes/renderservice.html"
    ><p>Rendering</p></a
  >
</h2>
<p>
  <strong>The Renderer turns a rendering input into the final content</strong>
</p>
<p>Builtin sections:</p>
<ul>
  <li><code>head</code>: Package name &amp; description</li>
  <li><code>toc</code>: Table of content</li>
  <li><code>tocx</code>: Table of content, with detail API reference link</li>
  <li><code>license</code>: License information</li>
</ul>
<h3>
  <a name="renderservice-methods"><p>RenderService methods</p></a>
</h3>
<table>
  <tr>
    <th>Function</th>
    <th>Returns type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><a href="#renderservice-getdata-0">getData(rendering)</a></p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/renderingdata.html"
          target="_blank"
          >RenderingData</a
        >
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#renderservice-getdatabatch-0">getDataBatch(batchRendering)</a>
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/batchrenderingdata.html"
          target="_blank"
          >BatchRenderingData</a
        >
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#renderservice-render-0">render(rendering, currentContent?)</a>
      </p>
    </td>
    <td><p>string</p></td>
    <td></td>
  </tr>
  <tr>
    <td>
      <p>
        <a href="#renderservice-renderbatch-0"
          >renderBatch(batchRendering, batchCurrentContent?)</a
        >
      </p>
    </td>
    <td>
      <p>
        <a
          href="https://lamnhan.com/docsuper/interfaces/batchrenderresult.html"
          target="_blank"
          >BatchRenderResult</a
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<h4>
  <a
    name="renderservice-getdata-0"
    href="https://lamnhan.com/docsuper/classes/renderservice.html#getdata"
    ><p><code>getData(rendering)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getData</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>rendering</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a href="https://lamnhan.com/docsuper/interfaces/rendering.html"
          target="_blank"&gt;Rendering&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/interfaces/renderingdata.html"
    target="_blank"
    >RenderingData</a
  >
</p>
<hr />
<h4>
  <a
    name="renderservice-getdatabatch-0"
    href="https://lamnhan.com/docsuper/classes/renderservice.html#getdatabatch"
    ><p><code>getDataBatch(batchRendering)</code></p></a
  >
</h4>
<p>
  <strong>The <code>getDataBatch</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>batchRendering</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/interfaces/batchrendering.html"
          target="_blank"&gt;BatchRendering&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/interfaces/batchrenderingdata.html"
    target="_blank"
    >BatchRenderingData</a
  >
</p>
<hr />
<h4>
  <a
    name="renderservice-render-0"
    href="https://lamnhan.com/docsuper/classes/renderservice.html#render"
    ><p><code>render(rendering, currentContent?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>render</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>rendering</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a href="https://lamnhan.com/docsuper/interfaces/rendering.html"
          target="_blank"&gt;Rendering&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td><p>currentContent</p></td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/interfaces/contentbysections.html"
          target="_blank"&gt;ContentBySections&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>string</p>
<hr />
<h4>
  <a
    name="renderservice-renderbatch-0"
    href="https://lamnhan.com/docsuper/classes/renderservice.html#renderbatch"
    ><p><code>renderBatch(batchRendering, batchCurrentContent?)</code></p></a
  >
</h4>
<p>
  <strong>The <code>renderBatch</code> call signature.</strong>
</p>
<p><strong>Parameters</strong></p>
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <p><strong>batchRendering</strong></p>
    </td>
    <td>
      <p>
        <code
          >&lt;a
          href="https://lamnhan.com/docsuper/interfaces/batchrendering.html"
          target="_blank"&gt;BatchRendering&lt;/a&gt;</code
        >
      </p>
    </td>
    <td></td>
  </tr>
  <tr>
    <td><p>batchCurrentContent</p></td>
    <td>
      <p><code>object</code></p>
    </td>
    <td></td>
  </tr>
</table>

<p><strong>Returns</strong></p>
<p>
  <a
    href="https://lamnhan.com/docsuper/interfaces/batchrenderresult.html"
    target="_blank"
    >BatchRenderResult</a
  >
</p>
<hr />


</section>
<section id="license" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<h2 id="license">License</h2>
<p>
  <strong>@lamnhan/docsuper</strong> is released under the
  <a href="https://github.com/lamnhan/docsuper/blob/master/LICENSE">MIT</a>
  license.
</p>


</section>
<section id="attr" note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY">

<hr />
<p>
  ⚡️ This document is generated automatically using
  <a href="https://github.com/lamnhan/docsuper">@lamnhan/docsuper</a>.
</p>


</section>