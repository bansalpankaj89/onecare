var gulp = require('gulp');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');


var srcPath = {
   scripts: ['./www/app/**/*.js'],
   styles: ['./www/css/**/*.css'],
   images: ['./www/img/**/*']
};

var desPath = './www/build/';


// Delete the build directory
gulp.task('clean', function() {
   return gulp.src('./www/build/')
   .pipe(clean());
});

// default gulp task to build
gulp.task('default', ['image-min', 'scripts', 'styles'], function() {
    // watch for JS changes
      // gulp.watch('./www/scripts/*.js', function() {
      //   gulp.run('console-js-error', 'scripts');
      // });
      // watch for CSS changes
      // gulp.watch('./www/styles/*.css', function() {
      //   gulp.run('styles');
      // });
});

// gulp-jshint task to report if there is any error in js files on console
gulp.task('console-js-error', function() {
    gulp.src('./www/app/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// gulp-changed and gulp-imagemin to minify images
gulp.task('image-min',function(){
    gulp.src(srcPath.images)
      .pipe(changed(desPath+'img/'))
      .pipe(imagemin())
      .pipe(gulp.dest(desPath+'img/'));    
});


// JS concat, strip debugging and minify
gulp.task('scripts', function() {
    gulp.src(srcPath.scripts)
        .pipe(concat('appJS.min.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./www/build/scripts/'));
});

// CSS concat, auto-prefix and minify without saas
gulp.task('styles', function() {
    gulp.src(srcPath.styles)
      .pipe(concat('appCss.css'))
      .pipe(autoprefix('last 2 versions'))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./www/build/styles/'));
});

