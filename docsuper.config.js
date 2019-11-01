module.exports = {
  apiUrl: 'https://lamnhan.com/docsuper',
  render: {
    'README.md': {
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
    },
  }
};
