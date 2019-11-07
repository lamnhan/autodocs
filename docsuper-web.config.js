module.exports = {
  url: 'https://lamnhan.com/docsuper',
  typedocConfigs: {
    readme: 'none',
  },
  outputMode: 'website',
  outPath: 'docs',
  websiteCategories: {
    'getting-started': 'Getting started',
  },
  render: {
    'introduction.html': {
      title: 'Introduction',
      cleanOutput: true,
      rendering: {
        license: true
      }
    },
    'getting-started/the-cli.html': {
      title: 'The CLI',
      cleanOutput: true,
      rendering: {
        license: true
      }
    }
  }
};