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

function ftp_deploy(pass, path) {
      if (pass === undefined || pass === true) {
            console.log('Param password is required');
            return;
      }
      gulp.src('build/' + path + '/**/' + '*.*')
            .pipe(ftp({
                  host: 'test.allenotify.pl',
                  user: 'userTestWebSite',
                  pass: pass,
                  remotePath: '/sites/' + path
            }))
            .pipe(gutil.noop());
};
gulp.task('ftp-deploy-angular', function (pass) {
      ftp_deploy(pass, 'article-versions/angular');
      console.log("Angular files uploaded")
});
gulp.task('ftp-deploy-backbone', function (pass) {
      ftp_deploy(pass, 'article-versions/backbone');
      console.log("Backbone files uploaded")
});
gulp.task('ftp-deploy-ember', function (pass) {
      ftp_deploy(pass, 'article-versions/ember');
      console.log("Ember files uploaded");
});
gulp.task('ftp-deploy-react', function (pass) {
      ftp_deploy(pass, 'article-versions/react');
      console.log("React files uploaded");
});
gulp.task('ftp-deploy-all', ['ftp-deploy-angular', 'ftp-deploy-backbone', 'ftp-deploy-ember', 'ftp-deploy-react'], function (pass) {
      console.log("All files uploaded");
});
function cssBuild(version, name) {
      //uglify (CSS) styles and concat (save as styles.min.css)
      gulp.src(version + "/" + name + '/**/*.css')
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
gulp.task('build-angular', function () {
      var version = "article-versions";
      var name = "angular";

      var scriptsComponents = ["article-versions/angular/bower_components/todomvc-common/base.js",
            "article-versions/angular/bower_components/angular/angular.js",
            "article-versions/angular/bower_components/angular-route/angular-route.js"];

      var scriptsApp = [
            "article-versions/angular/js/app.js",
            "article-versions/angular/js/controllers/todoCtrl.js",
            "article-versions/angular/js/services/todoStorage.js",
            "article-versions/angular/js/directives/todoFocus.js",
            "article-versions/angular/js/directives/todoEscape.js"
      ];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      gulp.src(scriptsApp)      
            .pipe(uglify({ mangle: false, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
});
gulp.task('build-backbone', function () {
      var version = "article-versions";
      var name = "backbone";

      var scriptsComponents = ["article-versions/backbone/bower_components/underscore/underscore.js",
            "article-versions/backbone/bower_components/jquery/dist/jquery.js",
            "article-versions/backbone/bower_components/todomvc-common/base.js",
            "article-versions/backbone/bower_components/backbone/backbone.js",
            "article-versions/backbone/bower_components/backbone.localstorage/backbone.localStorage.js"];

      var scriptsApp = [
            "article-versions/backbone/js/models/todo.js",
            "article-versions/backbone/js/collections/todos.js",
            "article-versions/backbone/js/views/todo-view.js",
            "article-versions/backbone/js/views/app-view.js",
            "article-versions/backbone/js/routers/router.js",
            "article-versions/backbone/js/app.js"];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      gulp.src(scriptsApp)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
});
gulp.task('build-ember', function () {
      var version = "article-versions";
      var name = "ember";

      var scriptsComponents = ["article-versions/ember/bower_components/todomvc-common/base.js",
            "article-versions/ember/bower_components/jquery/dist/jquery.js",
            "article-versions/ember/bower_components/handlebars/handlebars.js",
            "article-versions/ember/bower_components/ember/ember.js",
            "article-versions/ember/bower_components/ember-data/ember-data.js",
            "article-versions/ember/bower_components/ember-localstorage-adapter/localstorage_adapter.js"];

      var scriptsApp = [
            "article-versions/ember/js/app.js",
            "article-versions/ember/js/router.js",
            "article-versions/ember/js/models/todo.js",
            "article-versions/ember/js/controllers/todos_controller.js",
            "article-versions/ember/js/controllers/todos_list_controller.js",
            "article-versions/ember/js/controllers/todo_controller.js",
            "article-versions/ember/js/views/todo_input_component.js",
            "article-versions/ember/js/helpers/pluralize.js"];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      gulp.src(scriptsApp)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
});
gulp.task('build-react', function () {
      var version = "article-versions";
      var name = "react";

      var scriptsComponents = [
            "article-versions/react/bower_components/todomvc-common/base.js",
            "article-versions/react/bower_components/react/react-with-addons.js",
            "article-versions/react/bower_components/director/build/director.js"
      ];

      var scriptsApp = [
            "article-versions/react/js/utils.js",
            "article-versions/react/js/todoModel.js",
            "article-versions/react/js/todoItem.jsx",
            "article-versions/react/js/footer.jsx",
            "article-versions/react/js/app.jsx"];

      gulp.src(scriptsComponents)
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      gulp.src(scriptsApp)
            .pipe(react())
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest('build/' + version + "/" + name + '/js'));

      cssBuild(version, name);
      imgBuild(version, name);
      indexBuild(version, name);
});
gulp.task('build-all', ['build-angular', 'build-backbone', 'build-ember', 'build-react'], function () {
      console.log('All frameworks builded');
});
