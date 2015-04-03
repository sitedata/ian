#!/usr/bin/env node
var replacer = require('./lib/replacer.js');

var path = require('path');

var rootDir = process.argv[2];
var ip = require('internal-ip')();

rootDir += '/platforms/';
process.env['CORDOVA_PLATFORMS'].split(',').forEach(function (platform) {

  if (platform === 'android') {
    replaceGapReload(rootDir + platform + '/assets/www/gapreload.xml');
  } else {
    replaceGapReload(rootDir + platform + '/www/gapreload.xml');
  }

  function replaceGapReload(dir) {
    var apiFile = path.resolve(dir);

    replacer(apiFile, [
      {
        regex : /\$SERVER_HOST/,
        substitution : ip
      },
      {
        regex : /\$SERVER_PORT/,
        substitution : 8000
      },
      {
        regex : /\$LIVERELOAD_HOST/,
        substitution : ip
      },
      {
        regex : /\$LIVERELOAD_PORT/,
        substitution : 35729
      }
    ]);
  }
});
