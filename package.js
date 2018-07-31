Package.describe({
  name: 'cultofcoders:grapher-schema-directives',
  version: '0.1.6',

  // Brief, one-line summary of the package.
  summary: 'Grapher and GraphQL Schema Directives',

  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/cult-of-coders/grapher-schema-directives',

  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('cultofcoders:grapher@1.3.3');
  api.mainModule('index.js', 'server');
});

Package.onTest(function(api) {});
