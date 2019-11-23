<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @lamnhan/ayedocs

**A Docs-o-matic document generator for Typescript projects.**

</section>

<section id="header">

[![License][license_badge]][license_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/lamnhan/ayedocs/blob/master/LICENSE
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/lamhiennhan

</section>

<section id="main">

## Install & usage

Install as a global CLI: `npm install -g @lamnhan/ayedocs`. Or locally using the `--save-dev` flag.

You may want to put a script in the `package.json`, so you can do `npm run docs` every build.

```json
{
  "scripts": {
    "docs": "ayedocs generate"
  }
}
```

See the documentation at: <https://lamnhan.com/ayedocs>

## What & how?

**@lamnhan/ayedocs** is mainly used to extract content & generate document from a Typescript source code, you start by providing instructions in the configuration.

An example configuration:

```js
module.exports = {
  fileRender: {
    'README.md': {
      head: true,
      main: ["Main", "FULL"]
      license: true
    }
  }
}
```

With the above config, you can run `ayedocs generate`, the result will be a `README.md` file with 3 sections as described in the config. Simple that is!

See some useful [use cases](https://lamnhan.com/ayedocs/introduction.html#use-cases) to see if it fits your need.

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@lamnhan/ayedocs** is released under the [MIT](https://github.com/lamnhan/ayedocs/blob/master/LICENSE) license.

</section>

<section id="attr">

---

⚡️ This document is generated automatically using [@lamnhan/ayedocs](https://github.com/lamnhan/ayedocs).

</section>
