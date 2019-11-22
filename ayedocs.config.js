module.exports = {
  url: 'https://lamnhan.com/ayedocs',
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
          options: [
            ['Options', 'SELF'],
            ['Options', 'SUMMARY_PROPERTIES']
          ],
          webrender: [
            ['WebRender', 'SELF'],
            ['WebRender', 'SUMMARY_PROPERTIES']
          ]
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
      'getting-started/linkings.html': {
        pageTitle: 'Content linkings',
        file: '@doc/getting-started/linkings.md'
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
      },
      'advanced/file-render-options.html': {
        pageTitle: 'File render options',
        rendering: {
          filerenderoptions: ['FileRenderOptions', 'FULL'],
        }
      },
      'advanced/template-render-options.html': {
        pageTitle: 'Template render options',
        rendering: {
          templaterenderoptions: ['TemplateRenderOptions', 'FULL']
        }
      },
      'advanced/more-options.html': {
        pageTitle: 'More render options',
        rendering: {
          localrenderoptions: ['LocalRenderOptions', 'FULL'],
          webrenderoptions: ['WebRenderOptions', 'FULL']
        }
      },
      'advanced/advanced-rendering-options.html': {
        pageTitle: 'Advanced rendering options',
        rendering: {
          declarationoptions: [
            ['DeclarationOptions', 'SELF'],
            ['DeclarationOptions', 'SUMMARY_PROPERTIES']
          ],
          headingoptions: [
            ['HeadingOptions', 'SELF'],
            ['HeadingOptions', 'SUMMARY_PROPERTIES']
          ],
          valueoptions: [
            ['ValueOptions', 'SELF'],
            ['ValueOptions', 'SUMMARY_PROPERTIES']
          ],
          convertingoptions: [
            ['ConvertingOptions', 'SELF'],
            ['ConvertingOptions', 'SUMMARY_PROPERTIES']
          ],
          filteroptions: [
            ['FilterOptions', 'SELF'],
            ['FilterOptions', 'SUMMARY_PROPERTIES']
          ],
          customconvertoptions: [
            ['CustomConvertOptions', 'SELF'],
            ['CustomConvertOptions', 'SUMMARY_PROPERTIES']
          ],
        }
      },
      'advanced/custom-api-generator.html': {
        pageTitle: 'Custom API generator',
        file: '@doc/advanced/custom-api-generator.md'
      },
      'advanced/web-theming.html': {
        pageTitle: 'Web theming',
        file: '@doc/advanced/web-theming.md'
      },
      'advanced/web-categories.html': {
        pageTitle: 'Web categories',
        file: '@doc/advanced/web-categories.md'
      },
    }
  }
};
