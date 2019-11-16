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
      'getting-started': 'Getting started'
    },
    files: {
      'introduction.html': {
        pageTitle: 'Introduction',
        deepMenu: true,
        file: '@doc/introduction.md'
      },
      'getting-started/installation.html': {
        pageTitle: 'Installation',
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
          options: ['Options', 'FULL'],
          webrender: ['WebRender', 'FULL']
        }
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
