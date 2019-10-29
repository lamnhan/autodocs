module.exports = {
  apiUrl: 'https://lamnhan.com/docsuper',
  apiGenerator: 'none',
  typedoc: {
    readme: 'none',
  },
  files: {
    'README.md': {
      head: true,
      tocx: true,
      options: [
        ['Options', 'SELF', { title: 'Options' }],
        ['Options', 'SUMMARY_PROPERTIES', { heading: true }]
      ],
      main: ['Main', 'FULL', { title: 'Main service' }],
      declaration: ['Declaration', 'FULL', { title: 'Declaration' }],
      parser: ['ParseService', 'FULL', { title: 'The Parser' }],
      converter: ['ConvertService', 'FULL', { title: 'The Converter' }],
      renderer: ['RenderService', 'FULL', { title: 'The Renderer' }],
      license: true
    },
  }
};
