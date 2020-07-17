module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-env',
      [
        '@vue/app',
        {
          modules: false,
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
          },
        },
      ],
    ],
    sourceType: 'unambiguous',
    plugins: [
      [
        'component',
        {
          libraryName: 'h3-mobile-vue',
          styleLibrary: {
            name: 'theme',
            base: false,
          },
        },
        'h3-mobile-vue',
      ],
      [
        'import',
        { libraryName: '@h3/report', libraryDirectory: 'lib', style: false },
        '@h3/report',
      ],
      [
        'import',
        {
          libraryName: '@h3/thinking-ui',
          libraryDirectory: 'lib',
          style: true,
        },
        '@h3/thinking-ui',
      ],
    ],
  };
};
