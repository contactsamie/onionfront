var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var es = require('event-stream');
var debug = require('gulp-debug');
var ngmin = require('gulp-ngmin');
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


gulp.task('default', function () {    
    var scripts = gulp.src(['./app.js'])	
	.pipe(concat(app.appName+'.js')).pipe(header(banner, { pkg: pkg }))
	.pipe(gulp.dest('./' + app.dist ));      
  
    return es.concat.apply(null, [scripts]);
});




