var gulp         = require('gulp'),
    del          = require('del'),
    path         = require('path'),
    sequence     = require('gulp-sequence'),
    concat       = require('gulp-concat'),
    cheerio      = require('gulp-cheerio'),
    filter       = require('gulp-filter'),
    minifier     = require('gulp-uglify/minifier'),
    uglifyjs     = require('uglify-js'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    browserSync  = require('browser-sync').create(),
    minifyCSS    = require('gulp-minify-css'),
    util         = require('gulp-util'),
    changed      = require('gulp-changed'),
    filesize     = require('gulp-filesize'),
    rename       = require('gulp-rename'),
    svgmin       = require('gulp-svgmin'),
    svgstore     = require('gulp-svgstore'),
    useref       = require('gulp-useref'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('js', function() {
  var files = ['./src/js/lib/*.js'
              ,'./src/js/plugin/*.js'
              ,'./src/js/global/*.js'
              ,'./src/js/util/*.js'
              ,'./src/js/component/*.js'
              ,'./src/js/module/*.js'
              ,'./src/js/main.js'];

  return gulp.src(files)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./static/js'));
});

// create a task that ensures the js task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function() {
  browserSync.reload();
});

// compiling sass to css
gulp.task('sass', function() {
  return gulp.src('./src/style/bundle.scss')
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['last 2 Chrome versions', 'iOS >= 7', 'not ie <= 8', 'last 5 Firefox versions', 'last 2 Safari versions'],
          cascade: false
        }))
        .pipe(rename('app.css'))
        .pipe(gulp.dest('./static/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

// copy over all font files for deployment
gulp.task('font', function() {
    return gulp.src('./src/font/*.*')
          .pipe(gulp.dest('./static/font'));
});

// build svg icon sprite
gulp.task('icon-sprite', function() {
    return gulp.src('./src/img/icon/*.svg')
          .pipe(svgmin(function getOptions (file) {
              var prefix = path.basename(file.relative, path.extname(file.relative));
              return {
                  plugins: [{
                      cleanupIDs: {
                          prefix: prefix + '-',
                          minify: true
                      }
                  }]
              }
          }))
          .pipe(cheerio({
              run: function ($) {
                  $('[fill]').removeAttr('fill');
              },
              parserOptions: { xmlMode: true }
          }))
          .pipe(svgstore({ inlineSvg: true }))
          .pipe(rename('icon-sprite.svg'))
          .pipe(gulp.dest('./static/img'));
});

gulp.task('icon-extra', function() {
  var svgFilter = filter('*.svg', {restore: true});

  return gulp.src('./src/img/*.*')
        .pipe(svgFilter)
        .pipe(svgmin())
        .pipe(svgFilter.restore)
        .pipe(gulp.dest('./static/img'));
});

gulp.task('img-bitmap', function(){
    var rasterFilter = filter(['*.jpg', '*.png'], {restore: true});

    return gulp.src('./src/img/*.*')
          .pipe(rasterFilter)
          .pipe(gulp.dest('./static/img'));
});

gulp.task('img', ['icon-sprite', 'icon-others', 'img-bitmap']);

// Static Server + watching html/scss/js files
gulp.task('serve', ['sass', 'js', 'font'], function() {

    browserSync.init({
      // if use proxy if there is a local server
      // proxy: '127.0.0.1:8080'

      // otherwise use server
      server: './'
    });

    gulp.watch('./src/style/**/*.scss', ['sass']);
    gulp.watch('./src/js/**/*.js', ['js-watch']);
    // watch html files and reload if there's edits
    gulp.watch('./**/*.html').on('change', browserSync.reload);
});

// build css files for deployment
gulp.task('style', function() {
    return gulp.src('./static/css/app.css')
          .pipe(sourcemaps.init())
          .pipe(minifyCSS())
          .pipe(rename('app.min.css'))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('./static/css'));
});

// build js files for deployment
gulp.task('script', function() {
    return gulp.src('./static/js/app.js')
          .pipe(sourcemaps.init())
          .pipe(minifier({}, uglifyjs))
          .pipe(rename('app.min.js'))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('./static/js'));
});

// what are you trying to do? try to be more specific
gulp.task('default', function() {
    util.log("Miss Gulp: You missed a few keystrokes.");
});

// start your development with gulp start
gulp.task('start', ['serve']);

// prepare your assets for development
gulp.task('build', ['style', 'script']);

gulp.task('deploy', function() {
    util.log('Miss Gulp: The task "deploy" is being built at the moment.');
});
