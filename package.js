Package.describe({
  name: 'ncuillery:angular-breadcrumb',
  version: '0.3.3',
  summary: 'angular-breadcrumb for meteor!',
  git: 'https://github.com/ncuillery/angular-breadcrumb',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@0.9.0.1');
  api.use('urigo:angular@0.8.4', 'client');
  api.addFiles('dist/angular-breadcrumb.js', 'client');
});
