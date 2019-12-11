module.exports = {
  url: 'https://lamnhan.com/ayedocs',
  cleanOutput: true,
  fileRender: {
    'README.md': {
      cleanOutput: false,
      rendering: {
        head: true,
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
        file: true,
        pageTitle: 'Introduction',
        deepMenu: true,
        autoTOC: true
      },
      'getting-started/installation.html': {
        file: true,
        pageTitle: 'Installation',
        autoTOC: true,
      },
      'getting-started/how-it-works.html': {
        file: true,
        pageTitle: 'How it works?'
      },
      'getting-started/the-source-code.html': {
        file: true,
        pageTitle: 'Understand the code'
      },
      'getting-started/basic-use.html': {
        file: true,
        pageTitle: 'Basic use',
        autoTOC: true
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
        file: true,
        pageTitle: 'Built-in templates'
      },
      'getting-started/convert-outputs.html': {
        file: true,
        pageTitle: 'Convert outputs'
      },
      'getting-started/basic-advanced-rendering.html': {
        file: true,
        pageTitle: 'Basic advanced rendering'
      },
      'getting-started/custom-sections.html': {
        file: true,
        pageTitle: 'Custom sections'
      },
      'getting-started/linkings.html': {
        file: true,
        pageTitle: 'Content linkings'
      },
      'getting-started/inline-render.html': {
        file: true,
        pageTitle: 'Inline render'
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
          renderfileoptions: ['RenderFileOptions', 'FULL'],
        }
      },
      'advanced/template-render-options.html': {
        pageTitle: 'Template render options',
        rendering: {
          rendertemplateoptions: ['RenderTemplateOptions', 'FULL']
        }
      },
      'advanced/more-options.html': {
        pageTitle: 'More render options',
        rendering: {
          renderlocaloptions: ['RenderLocalOptions', 'FULL'],
          renderweboptions: ['RenderWebOptions', 'FULL']
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
          ]
        }
      },
      'advanced/custom-reference-generator.html': {
        file: true,
        pageTitle: 'Custom reference generator'
      },
      'advanced/web-theming.html': {
        file: true,
        pageTitle: 'Web theming'
      },
      'advanced/web-categories.html': {
        file: true,
        pageTitle: 'Web categories'
      },
    }
  }
};
