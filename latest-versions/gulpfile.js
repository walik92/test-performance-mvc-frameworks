var gulp = require('gulp-param')(require('gulp'), process.argv);
var del = require('del');
var typescript = require('gulp-typescript');
var tscConfigAngular = require('./angular/tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var ftp = require('gulp-ftp');
var gutil = require('gulp-util');

function ftp_deploy(pass, name) {
      if (pass === undefined || pass === true) {
            console.log('Param password is required');
            return;
      }
      console.log(name + " files uploading");

      return gulp.src('build/' + name + '/**/' + '*.*')
            .pipe(ftp({
                  host: 'test.allenotify.pl',
                  user: 'userTestWebSite',
                  pass: pass,
                  remotePath: '/sites/latest-versions/' + name
            }))
            .pipe(gutil.noop());
};
gulp.task('ftp-deploy-angular', function (pass) {
      return ftp_deploy(pass, 'angular');
});
gulp.task('ftp-deploy-backbone', function (pass) {
      return ftp_deploy(pass, 'backbone');
});
gulp.task('build-angular', function () {
      var path = 'build/angular';

      del(path + '/*');
      gulp.src('angular/app/**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(typescript(tscConfigAngular.compilerOptions))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path + '/app'));

      gulp.src([
            'angular/node_modules/angular2/bundles/angular2-polyfills.js',
            'angular/node_modules/systemjs/dist/system.src.js',
            'angular/node_modules/rxjs/bundles/Rx.js',
            'angular/node_modules/angular2/bundles/angular2.dev.js'
      ])
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest(path + '/js'));

      gulp.src(['angular/app/**/*.html'])
            .pipe(gulp.dest(path + '/app'));

      gulp.src(['angular/index.html'])
            .pipe(htmlreplace({
                  'css': 'css/styles.min.css',
                  'libsJS': 'js/libs.min.js'
            }))
            .pipe(gulp.dest(path));

      gulp.src([
            'angular/node_modules/todomvc-common/base.css',
            'angular/node_modules/todomvc-app-css/index.css'
      ])
            .pipe(cleanCSS())
            .pipe(concat("styles.min.css"))
            .pipe(gulp.dest(path + '/css'));

});
gulp.task('build-backbone', function () {
      var path = 'build/backbone';

      del(path + '/*');

      gulp.src([
            'backbone/node_modules/todomvc-common/base.js',
            'backbone/node_modules/jquery/dist/jquery.js',
            'backbone/node_modules/underscore/underscore.js',
            'backbone/node_modules/backbone/backbone.js',
            'backbone/node_modules/backbone.localstorage/backbone.localStorage.js'
      ])
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("libs.min.js"))
            .pipe(gulp.dest(path + '/js'));

      gulp.src([
            "backbone/js/models/todo.js",
            "backbone/js/collections/todos.js",
            "backbone/js/views/todo-view.js",
            "backbone/js/views/app-view.js",
            "backbone/js/routers/router.js",
            "backbone/js/app.js"])
            .pipe(uglify({ mangle: true, compress: true, output: { beautify: false } }))
            .pipe(concat("app.min.js"))
            .pipe(gulp.dest(path + '/js'));

      gulp.src(['backbone/index.html'])
            .pipe(htmlreplace({
                  'css': 'css/styles.min.css',
                  'libsJS': 'js/libs.min.js',
                  'appJS': 'js/app.min.js'
            }))
            .pipe(gulp.dest(path));

      gulp.src([
            'backbone/node_modules/todomvc-common/base.css',
            'backbone/node_modules/todomvc-app-css/index.css'
      ])
            .pipe(cleanCSS())
            .pipe(concat("styles.min.css"))
            .pipe(gulp.dest(path + '/css'));
});
gulp.task('default', ['build-angular','build-backbone']);
gulp.task('ftp-deploy-all', ['ftp-deploy-angular','ftp-deploy-backbone']);