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
  cleanOutput: true,
  render: {
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
};