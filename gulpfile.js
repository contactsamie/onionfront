var gulp = require('gulp');
var spawn = require('spawn-cmd').spawn;
var es = require('event-stream');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var fs = require('fs');
var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
 
// Add a task to render the output 
gulp.task('tasks', taskListing);


var appsDir='!apps';
var tasks = fs.readdirSync(appsDir).map(function(arg){
	return appsDir+"/"+arg;
});

var appDirNames = fs.readdirSync(appsDir);

var createTask = function (pathName) {
    gulp.task(pathName, function (cb) {
        spawn('gulp', ['--cwd', pathName], { stdio: 'inherit' }).on('exit', cb);       
    });
};
for (var i = 0; i < tasks.length; i++) {
    createTask(tasks[i]);
}
gulp.task('clean', function () {
    var cleanTasks = [];
    cleanTasks.push(gulp.src('dist', { read: false }).pipe(clean()));
    for (var i = 0; i < tasks.length; i++) {
        cleanTasks.push(gulp.src(tasks[i] + '/dist', { read: false }).pipe(clean()));
        cleanTasks.push(gulp.src(tasks[i] + '/tmp', { read: false }).pipe(clean()));
    }
    return es.concat.apply(null, cleanTasks);
});
gulp.task('build', ['clean'], function (callback) {
    runSequence(tasks, callback);
});

gulp.task('default',['build'], function () {
    console.log("completed all task build ");
    for (var i = 0; i < tasks.length; i++) {
        gulp.src(tasks[i] + "/dist/**/*.*").pipe(gulp.dest('./dist/' + tasks[i]));
    }
});

var webserver = require('gulp-webserver');
 console.log('creating drive-'+appDirNames[i])
 for (var i = 0; i < appDirNames.length; i++) {  
 gulp.task('drive-'+appDirNames[i], function() {
  gulp.src("./"+appsDir+'/'+appDirNames[i]+'/app')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
	  port:8897,
      open: true
    }));
});
gulp.task('drive-dist-'+appDirNames[i], function() {
  gulp.src(appsDir+'/'+appDirNames[i]+'/dist')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
	  port:8896,
      open: true
    }));
});	
}
 
