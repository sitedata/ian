var gulp = require('gulp');

gulp.task('sass', sassCompile);
gulp.task('assets', assetCopy);
gulp.task('scripts', browserifyScripts);
gulp.task('clean', clean);

gulp.task('texts', updateTexts);

gulp.task('prepareAndReload', ['prepare'], reloader);
gulp.task('prepare', ['default'], cordovaPrepare);
gulp.task('devEnvironment', devEnvironment);
gulp.task('dev', ['devEnvironment', 'prepareAndReload'], liveReloadServer);

gulp.task('default', ['sass', 'assets', 'scripts']);

var Path = require('path');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var del = require('del');
var fs = require('fs');
var csv = require('fast-csv');
var browserify = require('browserify');
var shell = require('gulp-shell');
var liveReload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var corsProxy = require('cors-anywhere');
var internalIp = require('internal-ip');
var request = require('request');
var source = require('vinyl-source-stream');
var through = require('through');
var config = require('./config.json');

var devMode = false;

var settings = {
  corsProxyHost : internalIp(),
  corsProxyPort : 1234
};

console.log('settings.corsProxyHost=' + settings.corsProxyHost);

function updateTexts(cb) {
  var count = config.worksheetIds.length;
  var sheetId = config.sheetId;
  var allTexts = [];

  config.worksheetIds.forEach(function (id, idx) {
    var first = true;
    var texts = [];
    var link = getCsvLink(sheetId, id);

    request(link)
      .pipe(csv().on('data', function (data) {
        var i, len;
        len = data.length;

        if (first) {
          for (i = 0; i < len; i++) {
            texts[i] = [];
          }
          first = false;
        }

        data.forEach(function (elem, i) {
          if (elem !== '') {
            texts[i].push(elem);
          }
        });
      }).on('end', function () {
        allTexts[idx] = texts;
        done();
      }))
      .on('error', function (err) {
        console.log('error!');
        cb(err);
      });
  });

  function getCsvLink(sheetId, id) {
    return 'https://docs.google.com/feeds/download/spreadsheets/Export?key=' + sheetId + '&exportFormat=csv&gid=' + id;
  }

  function done() {
    count--;
    if (count === 0) {
      fs.writeFileSync(config.outputJson, JSON.stringify(allTexts));
      cb();
    }
  }
}

function devEnvironment(cb) {
  devMode = true;
  process.env['SERVER_HOST'] = internalIp();
  process.env['SERVER_PORT'] = 8000;
  process.env['LIVERELOAD_PORT'] = 35729;
  cb();
}

function sassCompile() {
  return gulp.src('src/scss/style.scss')
    .pipe(plumber({
      errorHandler : function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(compass({
      project : Path.join(__dirname),
      css : 'www/css',
      sass : 'src/scss',
      image : 'src/img'
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('www/css'));
}

function browserifyScripts() {
  return browserify('./src/js/app.js')
    .transform('browserify-shim')
    .transform(function (file) {
      if (devMode) {
        if (/\/settings.js$/.test(file)) {
          console.log('changing settings.js');
          var data = '';
          return through(write, end);
        }
      }
      return through();

      function write(buf) {
        data += buf;
      }

      function end() {
        var d = data.replace(/(\s*["']?domain["']?\s*:\s*["'])(.*)(["']\s*)/m,
          '$1http://' + settings.corsProxyHost + ':' + settings.corsProxyPort + '/$2$3');
        this.queue(d);
        this.queue(null);
      }
    })
    .bundle()
    .on('error', function (err) {
      console.log('error', err);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('www/js/'));
}

function assetCopy() {
  return gulp.src('src/static/**')
    .pipe(gulp.dest('www/'));
}

function liveReloadServer() {
  liveReload.listen();

  corsProxy.createServer({
    requireHeader : ['origin', 'x-requested-with'],
    removeHeaders : ['cookie', 'cookie2']
  }).listen(settings.corsProxyPort, settings.corsProxyHost, function () {
    console.log('Running CORS Anywhere on ' + settings.corsProxyHost + ':' + settings.corsProxyPort);
  });

  gulp.watch('src/static/**', ['prepareAndReload']);
  gulp.watch('src/js/**', ['prepareAndReload']);
  gulp.watch('src/scss/**/*.scss', ['prepareAndReload']);
}

function cordovaPrepare() {
  return gulp.src('')
    .pipe(plumber())
    .pipe(shell(['cordova prepare']));
}

function reloader() {
  return gulp.src('')
    .pipe(plumber())
    .pipe(liveReload());
}

// clean Task
function clean(cb) {
  del(['www/'], cb);
}
