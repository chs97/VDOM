module.exports = config => {
  config.set({
    browsers: ['ChromeHeadless'],

    frameworks: ['jasmine'],

    files: ['./src/**/*.ts', './test/**/*.tsx'],

    preprocessors: {
      './src/**/*.ts': ['webpack'],
      './test/**/*.tsx': ['webpack']
    },

    reporters: ['spec'],

    webpack: {
      resolve: {
        extensions: ['.webpack.js', '.ts']
      },
      module: {
        rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}