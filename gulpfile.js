var gulp = require('gulp-param')(require('gulp'), process.argv);
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var flatten = require('gulp-flatten');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');
var react = require('gulp-react');

gulp.task('build', function () {
      angularBuild();
      backboneBuild();
      emberBuild();
      reactBuild();
});

gulp.task('ftp-deploy', function (pass) {
      if (pass === undefined || pass === true) {
            console.log('Param password is required');
            return;
      }
      gulp.src('build/**/*.*')
            .pipe(ftp({
                  host: 'kaiwoklaw.pl',
                  user: 'admin@kaiwoklaw.pl',
                  pass: pass,
                  remotePath: '/sites'
            }))
            .pipe(gutil.noop());
});

function scriptsComponentsBuild(version, name, listOfScripts) {
      gulp.src(listOfScripts)
            .pipe(uglify({ mangle: false }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));
};

function scriptsAppBuild(version, name, listOfScripts) {
      //uglify (JS) app scripts and concat (save as app.min.js)
      gulp.src(listOfScripts)
            .pipe(uglify({ mangle: false }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));
};

function cssBuild(version, name) {
      //uglify (CSS) styles and concat (save as styles.min.css)
      gulp.src(version + "/" + name + '/libs/**/*.css')
            .pipe(cleanCSS())
            .pipe(concat("styles.min.css"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/css'));
};
function imgBuild(version, name) {
      //copy images png
      gulp.src(version + "/" + name + '/**/*.png')
            .pipe(flatten())
            .pipe(gulp.dest('build/' + version + "/" + name + '/css'));
}
function indexBuild(version, name) {
      //copy index.html and replace resources of scripts and styles
      gulp.src(version + "/" + name + '/index.html')
            .pipe(flatten())
            .pipe(htmlreplace({
                  'css': 'css/styles.min.css',
                  'libsJS': 'js/libs.min.js',
                  'appJS': 'js/app.min.js'
            }))
            .pipe(gulp.dest('build/' + version + "/" + name));
}

function angularBuild() {
      var version = "old-versions";
      var name = "angular";
      
      var scriptsComponents = ["old-versions/angular/bower_components/todomvc-common/base.js",
            "old-versions/angular/bower_components/angular/angular.min.js",
            "old-versions/angular/bower_components/angular-route/angular-route.min.js"];

      var scriptsApp = [
            "old-versions/angular/js/app.js",
            "old-versions/angular/js/controllers/todoCtrl.js",
            "old-versions/angular/js/services/todoStorage.js",
            "old-versions/angular/js/views/app-view.js",
            "old-versions/angular/js/directives/todoFocus.js",
            "old-versions/angular/js/directives/todoEscape.js"];

      scriptsComponentsBuild(version, name, scriptsComponents);
      scriptsAppBuild(version, name, scriptsApp);
      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
};


function backboneBuild() {
      var version = "old-versions";
      var name = "backbone";

      var scriptsComponents = ["old-versions/backbone/bower_components/underscore/underscore.js",
            "old-versions/backbone/bower_components/jquery/dist/jquery.js",
            "old-versions/backbone/bower_components/todomvc-common/base.js",
            "old-versions/backbone/bower_components/backbone/backbone.js",
            "old-versions/backbone/bower_components/backbone.localstorage/backbone.localStorage.js"];
      var scriptsApp = [
            "old-versions/backbone/js/models/todo.js",
            "old-versions/backbone/js/collections/todos.js",
            "old-versions/backbone/js/views/todo-view.js",
            "old-versions/backbone/js/views/app-view.js",
            "old-versions/backbone/js/routers/router.js",
            "old-versions/backbone/js/app.js"];

      scriptsComponentsBuild(version, name, scriptsComponents);
      scriptsAppBuild(version, name, scriptsApp);
      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
};


function emberBuild() {
      var version = "old-versions";
      var name = "ember";

      var scriptsComponents = ["old-versions/ember/bower_components/todomvc-common/base.js",
            "old-versions/ember/bower_components/jquery/dist/jquery.js",
            "old-versions/ember/bower_components/handlebars/handlebars.js",
            "old-versions/ember/bower_components/ember/ember.js",
            "old-versions/ember/bower_components/ember-data/ember-data.js",
            "old-versions/ember/bower_components/ember-localstorage-adapter/localstorage_adapter.js"];

      var scriptsApp = [
            "old-versions/ember/js/app.js",
            "old-versions/ember/js/router.js",
            "old-versions/ember/js/models/todo.js",
            "old-versions/ember/js/controllers/todos_controller.js",
            "old-versions/ember/js/controllers/todos_list_controller.js",
            "old-versions/ember/js/controllers/todo_controller.js",
            "old-versions/ember/js/views/todo_input_component.js",
            "old-versions/ember/js/helpers/pluralize.js"];

      scriptsComponentsBuild(version, name, scriptsComponents);
      scriptsAppBuild(version, name, scriptsApp);
      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
};


function reactBuild() {
      var version = "old-versions";
      var name = "react";

      var scriptsComponents = ["old-versions/react/bower_components/todomvc-common/base.js",
            "old-versions/react/bower_components/react/react-with-addons.js",
            "old-versions/react/bower_components/react/JSXTransformer.js",
            "old-versions/react/bower_components/director/build/director.js"];

      var scriptsApp = [
            "old-versions/react/js/utils.js",
            "old-versions/react/js/todoModel.js",
            "old-versions/react/js/todoItem.jsx",
            "old-versions/react/js/footer.jsx",
            "old-versions/react/js/app.jsx"];

      scriptsComponentsBuild(version, name, scriptsComponents);

      gulp.src(scriptsApp)
            .pipe(react())
            .pipe(uglify({ mangle: false }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
};