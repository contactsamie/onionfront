var gulp = require("gulp");
var spawn = require("spawn-cmd").spawn;
var es = require("event-stream");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var chalk = require("chalk");

var appConfig = require("./onion_components.json");
var local_componentsMap = appConfig.local_components;
var apps = appConfig.apps;

var createTask = function (taskName, pathName, cmd) {
    console.log("setting up npm '" + cmd + "' task '" + pathName + "' .... ");
    gulp.task(taskName, function (cb) {
        console.log(chalk.yellow("performing npm tasks in " + pathName + " ...."));
        spawn(cmd, ["--cwd", pathName], { stdio: "inherit" }).on("exit", cb);
    });
};

var npm_apps = [];
var gulp_apps = [];
for (var i = 0; i < apps.length; i++) {
    var _app = apps[i];
    var _npm = _app + "_npm";
    var _gulp = _app + "_gulp";
    createTask(_npm, apps[i], "npm install");
    createTask(_gulp, apps[i], "gulp");
    npm_apps.push(_npm);
    gulp_apps.push(_gulp);
}

gulp.task("clean", function () {
    var cleanApps = [];
    cleanApps.push(gulp.src("dist", { read: false }).pipe(clean()));
    for (var i = 0; i < apps.length; i++) {
        console.log("cleaning dist & temp '" + apps[i] + "' .... ");
        cleanApps.push(gulp.src(apps[i] + "/dist", { read: false }).pipe(clean()));
        cleanApps.push(gulp.src(apps[i] + "/tmp", { read: false }).pipe(clean()));
    }
    for (var j = 0; j < local_componentsMap.dest.length; j++) {
        console.log("cleaning local components '" + local_componentsMap.dest[j] + "' .... ");
        cleanApps.push(gulp.src(local_componentsMap.dest[j], { read: false }).pipe(clean()));
    }
    return es.concat.apply(null, cleanApps);
});

gulp.task("local_components", ["clean"], function () {
    var localModuleApps = [];
    console.log("Moving components from  '" + local_componentsMap.source + "' .... ");
    for (var j = 0; j < local_componentsMap.dest.length; j++) {
        console.log("To  '" + local_componentsMap.dest[j] + "' .... ");
        localModuleApps.push(gulp.src(local_componentsMap.source).pipe(gulp.dest(local_componentsMap.dest[j])));
    }
    return es.concat.apply(null, localModuleApps);
});

gulp.task("build_npm", ["local_components"], function (callback) {
    runSequence(npm_apps, callback);
});
gulp.task("build_gulp", ["build_npm"], function (callback) {
    runSequence(gulp_apps, callback);
});
gulp.task("distribute_components", ["build_gulp"], function () {
    var localComponentApps = [];
    console.log("Moving components from  '" + local_componentsMap.source + "' .... ");
    for (var j = 0; j < local_componentsMap.dist.length; j++) {
        console.log("To  '" + local_componentsMap.dist[j] + "' .... ");
        localComponentApps.push(gulp.src(local_componentsMap.source).pipe(gulp.dest(local_componentsMap.dist[j])));
    }
    return es.concat.apply(null, localComponentApps);
});

gulp.task("default", ["distribute_components"], function () {
    console.log("completed all task build ");
    for (var i = 0; i < apps.length; i++) {
        console.log("Pushing distributions for '" + apps[i] + "' to deployable .... ");
        gulp.src(apps[i] + "/dist/**/*.*").pipe(gulp.dest("./dist/" + apps[i]));
    }
});