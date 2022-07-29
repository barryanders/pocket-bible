var root  = '../../../';
var api   = 'core/api/';
var tools = 'core/tools/';

scribe = {
  route:     '#',
  primary:   'asv',
  build:     root + 'content/',

  api:       root + api,
  library:   root + api + 'literature/',
  maps:      root + api + 'maps/',
  animals:   root + api + 'animals/',

  tools:     root + tools,
  translate: root + tools + 'scribe/literature/',

  process: {
  	overwrite: true // Set true to overwrite existing literature.
  }
};