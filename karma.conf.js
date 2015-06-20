// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'testDependencies/angular/angular.js',
      'testDependencies/angular-mocks/angular-mocks.js',
      'testDependencies/angular-sanitize/angular-sanitize.js',
      'testDependencies/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
      'bower_components/underscore/underscore.js',
      'src/angular-breadcrumb.js',
      'sample/app.js',
      'sample/controllers/room_detail.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    preprocessors: {
      'src/angular-breadcrumb.js': 'coverage'
    },

    reporters: ['story', 'coverage'],

    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
