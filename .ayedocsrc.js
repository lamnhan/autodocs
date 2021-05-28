module.exports = {
  url: 'https://ayedocs.lamnhan.com',
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
        file: true,
        pageTitle: 'Options',
        autoTOC: true
      },
      'getting-started/use-templates.html': {
        file: true,
        pageTitle: 'Use templates',
        autoTOC: true
      },
      'getting-started/convert-outputs.html': {
        file: true,
        pageTitle: 'Convert outputs',
        autoTOC: true
      },
      'getting-started/advanced-rendering.html': {
        file: true,
        pageTitle: 'Advanced rendering',
        autoTOC: true,
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
      'advanced/the-cli.html': {
        pageTitle: 'The CLI',
        template: 'cli',
        topSecs: { toc: true }
      },
      'advanced/the-library.html': {
        pageTitle: 'The library',
        rendering: {
          toc: true,
          lib: ['Lib', 'FULL'],
        }
      },
      'advanced/render-options.html': {
        pageTitle: 'Render options',
        rendering: {
          local: ['RenderLocalOptions', 'FULL'],
          web: ['RenderWebOptions', 'FULL'],
          file: ['RenderFileOptions', 'FULL'],
          template: ['RenderTemplateOptions', 'FULL']
        }
      },
      'advanced/convert-options.html': {
        pageTitle: 'Convert options',
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
      'advanced/reference-generator.html': {
        file: true,
        pageTitle: 'Reference generator'
      },
      'advanced/web-theming.html': {
        file: true,
        pageTitle: 'Web theming'
      },
      'advanced/web-index.html': {
        file: true,
        pageTitle: 'Web index'
      },
      'advanced/web-categories.html': {
        file: true,
        pageTitle: 'Web categories'
      },
      'advanced/docs-api.html': {
        file: true,
        pageTitle: 'Docs API'
      },
    }
  }
};
