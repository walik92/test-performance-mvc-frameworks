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
var ngmin = require('gulp-ngmin');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');

function ftp_deploy(pass, name) {
      if (pass === undefined || pass === true) {
            console.log('Param password is required');
            return;
      }
      gulp.src('build/' + name + '/**/' + '*.*')
            .pipe(ftp({
                  host: 'test.allenotify.pl',
                  user: 'userTestWebSite',
                  pass: pass,
                  remotePath: '/sites/article-versions/' + name
            }))
            .pipe(gutil.noop());
};
gulp.task('ftp-deploy-angular', function (pass) {
      ftp_deploy(pass, 'angular');
      console.log("Angular files uploaded")
});
gulp.task('ftp-deploy-backbone', function (pass) {
      ftp_deploy(pass, 'backbone');
      console.log("Backbone files uploaded")
});
gulp.task('ftp-deploy-ember', function (pass) {
      ftp_deploy(pass, 'ember');
      console.log("Ember files uploaded");
});
gulp.task('ftp-deploy-react', function (pass) {
      ftp_deploy(pass, 'react');
      console.log("React files uploaded");
});
gulp.task('ftp-deploy-all', ['ftp-deploy-angular', 'ftp-deploy-backbone', 'ftp-deploy-ember', 'ftp-deploy-react'], function (pass) {
      console.log("All files uploaded");
});
function cssBuild(name) {
      //uglify (CSS) styles and concat (save as styles.min.css)
      gulp.src(name + '/**/*.css')
            .pipe(cleanCSS())
            .pipe(concat("styles.min.css"))
            .pipe(gulp.dest('build/' + name + '/css'));
};
function imgBuild(name) {
      //copy images png
      gulp.src(name + '/**/*.png')
            .pipe(flatten())
            .pipe(gulp.dest('build/' + name + '/css'));
}
function indexBuild(name) {
      //copy index.html and replace resources of scripts and styles
      gulp.src(name + '/index.html')
            .pipe(flatten())
            .pipe(htmlreplace({
                  'css': 'css/styles.min.css',
                  'libsJS': 'js/libs.min.js',
                  'appJS': 'js/app.min.js'
            }))
            .pipe(gulp.dest('build/' + name));
}
gulp.task('build-angular', function () {
      var name = "angular";

      var scriptsComponents = ["angular/bower_components/todomvc-common/base.js",
            "angular/bower_components/angular/angular.js",
            "angular/bower_components/angular-route/angular-route.js"];

      var scriptsApp = [
            "angular/js/app.js",
            "angular/js/controllers/todoCtrl.js",
            "angular/js/services/todoStorage.js",
            "angular/js/directives/todoFocus.js",
            "angular/js/directives/todoEscape.js"
      ];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      gulp.src(scriptsApp)
            .pipe(uglify({ mangle: false, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      cssBuild(name);
      imgBuild(name);
      indexBuild(name);
});
gulp.task('build-backbone', function () {
      var name = "backbone";

      var scriptsComponents = ["backbone/bower_components/underscore/underscore.js",
            "backbone/bower_components/jquery/dist/jquery.js",
            "backbone/bower_components/todomvc-common/base.js",
            "backbone/bower_components/backbone/backbone.js",
            "backbone/bower_components/backbone.localstorage/backbone.localStorage.js"];

      var scriptsApp = [
            "backbone/js/models/todo.js",
            "backbone/js/collections/todos.js",
            "backbone/js/views/todo-view.js",
            "backbone/js/views/app-view.js",
            "backbone/js/routers/router.js",
            "backbone/js/app.js"];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      gulp.src(scriptsApp)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      cssBuild(name);
      imgBuild(name);
      indexBuild(name);
});
gulp.task('build-ember', function () {

      var name = "ember";

      var scriptsComponents = ["ember/bower_components/todomvc-common/base.js",
            "ember/bower_components/jquery/dist/jquery.js",
            "ember/bower_components/handlebars/handlebars.js",
            "ember/bower_components/ember/ember.js",
            "ember/bower_components/ember-data/ember-data.js",
            "ember/bower_components/ember-localstorage-adapter/localstorage_adapter.js"];

      var scriptsApp = [
            "ember/js/app.js",
            "ember/js/router.js",
            "ember/js/models/todo.js",
            "ember/js/controllers/todos_controller.js",
            "ember/js/controllers/todos_list_controller.js",
            "ember/js/controllers/todo_controller.js",
            "ember/js/views/todo_input_component.js",
            "ember/js/helpers/pluralize.js"];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      gulp.src(scriptsApp)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      cssBuild(name);
      imgBuild(name);
      indexBuild(name);
});
gulp.task('build-react', function () {

      var name = "react";

      var scriptsComponents = [
            "react/bower_components/todomvc-common/base.js",
            "react/bower_components/react/react-with-addons.js",
            "react/bower_components/director/build/director.js"
      ];

      var scriptsApp = [
            "react/js/utils.js",
            "react/js/todoModel.js",
            "react/js/todoItem.jsx",
            "react/js/footer.jsx",
            "react/js/app.jsx"];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      gulp.src(scriptsApp)
            .pipe(react())
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + name + '/js'));

      cssBuild(name);
      imgBuild(name);
      indexBuild(name);
});
gulp.task('build-all', ['build-angular', 'build-backbone', 'build-ember', 'build-react'], function () {
      console.log('All frameworks builded');
});
