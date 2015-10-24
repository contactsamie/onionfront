var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var es = require('event-stream');
var webserver = require('gulp-webserver');
var debug = require('gulp-debug');
var minifyHTML = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');
var uglifycss = require('gulp-uglifycss');
var ngmin = require('gulp-ngmin');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var bower = require('gulp-bower');
var header = require('gulp-header');
var pkg = require('./package.json');
var fs = require('fs');

console.log(app);
var app = require('./app-settings.json');
console.log(app);
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  new Date(),
 // ' * @link <%= pkg.homepage %>',
 // ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(''+app.appDir+'/bower_components/'));
});

gulp.task('preprocess', ['bower'], function () {
    var assets = useref.assets();
    var html = gulp.src(''+app.appDir+'/index.html') .pipe(assets).pipe(debug())
        .pipe(assets.restore()).pipe(useref()).pipe(debug()).pipe(gulp.dest('./'+app.tmp+''));

    var templates = gulp.src(''+app.appDir+'/'+app.views+'/**/*.html').pipe(templateCache('views.js', { module: 'views', standalone: true, root: 'views/' }))
	.pipe(debug()).pipe(gulp.dest('./' + app.tmp + '/scripts'));
    return es.concat.apply(null, [html, templates]);
});

gulp.task('build', ['preprocess'], function () {
    var images = gulp.src('./'+app.appDir+'/'+app.images+'/**/*').pipe(gulp.dest('./'+app.dist+'/'+app.images+'/'));
    var fonts = gulp.src('./'+app.appDir+'/'+app.fonts+'/**/*').pipe(gulp.dest('./'+app.dist+'/'+app.fonts+'/'));
    var scripts = gulp.src(['./' + app.tmp + '/scripts/js.js', './' + app.tmp + '/scripts/views.js', './' + app.tmp + '/scripts/js-app.js'])
	.pipe(concat('js.js')).pipe(header(banner, { pkg: pkg }))
	.pipe(gulp.dest('./' + app.dist + '/scripts'));   
   
    var styles = gulp.src(['./' + app.tmp + '/styles/*.css'])
	.pipe(header(banner, { pkg: pkg })).pipe(gulp.dest('./' + app.dist + '/styles'));
    var index = gulp.src(['./' + app.tmp + '/index.html'])
	.pipe(gulp.dest('./' + app.dist + ''));
    return es.concat.apply(null, [index, styles, scripts, images, fonts]);
});

gulp.task('complete', ['build'], function() {
     fs.writeFileSync('./' + app.dist + '/scripts/js-app.js', '');
});

var webserver = require('gulp-webserver');

gulp.task('dist',['complete'], function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
	  port:8877,
      open: true
    }));
});

 gulp.task('default',['dist'], function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
	  port:8866,
      open: true
    }));
});

