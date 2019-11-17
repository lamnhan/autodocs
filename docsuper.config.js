module.exports = {
  url: 'https://lamnhan.com/docsuper',
  typedocConfigs: {
    readme: 'none',
  },
  cleanOutput: true,
  fileRender: {
    'README.md': {
      cleanOutput: false,
      rendering: {
        head: true,
        tocx: true,
        options: [
          ['Options', 'SELF', { title: 'Options' }],
          ['Options', 'SUMMARY_PROPERTIES', { heading: true }]
        ],
        main: ['Main', 'FULL', { title: 'The Module' }],
        declaration: ['Declaration', 'FULL', { title: 'Declaration' }],
        parser: ['ParseService', 'FULL', { title: 'Parsing' }],
        converter: ['ConvertService', 'FULL', { title: 'Converting' }],
        renderer: ['RenderService', 'FULL', { title: 'Rendering' }],
        license: true
      }
    }
  },
  webRender: {
    categories: {
      'getting-started': 'Getting started',
      'advanced': 'Advanced topics'
    },
    files: {
      'introduction.html': {
        pageTitle: 'Introduction',
        deepMenu: true,
        autoTOC: true,
        file: '@doc/introduction.md'
      },
      'getting-started/installation.html': {
        pageTitle: 'Installation',
        autoTOC: true,
        file: '@doc/getting-started/installation.md'
      },
      'getting-started/how-it-works.html': {
        pageTitle: 'How it works?',
        file: '@doc/getting-started/how-it-works.md'
      },
      'getting-started/the-source-code.html': {
        pageTitle: 'Understand the code',
        file: '@doc/getting-started/the-source-code.md'
      },
      'getting-started/basic-use.html': {
        pageTitle: 'Basic use',
        autoTOC: true,
        file: '@doc/getting-started/basic-use.md'
      },
      'getting-started/options.html': {
        pageTitle: 'Options',
        rendering: {
          optionsintro: '@doc/getting-started/options.md',
          options: ['Options', 'FULL'],
          webrender: ['WebRender', 'FULL']
        }
      },
      'getting-started/templates.html': {
        pageTitle: 'Built-in templates',
        file: '@doc/getting-started/templates.md'
      },
      'getting-started/convert-outputs.html': {
        pageTitle: 'Convert outputs',
        file: '@doc/getting-started/convert-outputs.md'
      },
      'getting-started/basic-advanced-rendering.html': {
        pageTitle: 'Basic advanced rendering',
        file: '@doc/getting-started/basic-advanced-rendering.md'
      },
      'getting-started/custom-sections.html': {
        pageTitle: 'Custom sections',
        file: '@doc/getting-started/custom-sections.md'
      },
      'the-cli.html': {
        pageTitle: 'The CLI',
        topSecs: { toc: true },
        template: 'cli'
      },
      'the-library.html': {
        pageTitle: 'The library',
        rendering: {
          toc: true,
          init: ['main', 'FULL'],
          main: ['Main', 'FULL'],
        }
      }
    }
  }
};
