#!/usr/bin/env node

var fs = require('fs');
var rootDir = process.argv[2];
var platforms = process.env['CORDOVA_PLATFORMS'].split(',');
var config = require(rootDir + '/config.json');
var antFile;

if (platforms.indexOf('android') !== -1) {
  antFile = rootDir + '/platforms/android/ant.properties';
  if (config.key) {
    console.log('android platform exists, adding ant.properties');
    if (config.key.store) {
      props = 'key.store=' + config.key.store;
    }
    if (config.key.storePassword) {
      props += '\nkey.store.password=' + config.key.storePassword;
    }
    if (config.key.alias) {
      props += '\nkey.alias=' + config.key.alias;
    }
    if (config.key.aliasPassword) {
      props += '\nkey.alias.password=' + config.key.aliasPassword;
    }
    fs.writeFileSync(antFile, props, 'utf8');
  } else {
    console.log('config.key not set, adding empty ant.properties');
    fs.writeFileSync(antFile, '', 'utf8');
  }
} else {
  console.log('android platform does not exist, NOT adding ant.properties');
}
