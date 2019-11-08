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
    },
    files: {
      'introduction.html': {
        title: 'Introduction',
        rendering: {
          license: true
        }
      },
      'getting-started/the-cli.html': {
        title: 'The CLI',
        rendering: {
          license: true
        }
      }
    }
  }
};
