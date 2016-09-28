module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    files: [
      'dist/js/pager.js',
      'test/unit/*.spec.js'
    ],
    exclude: [],
    preprocessors: { 
      '**/dist/js/*.js': 'coverage'
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};