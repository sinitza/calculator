var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    scss = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    del = require('del'),
    jade = require('gulp-jade'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create(),
    util = require('gulp-util');

gulp.task('default', ['clean'], function() {
    gulp.start('style', 'css', 'scripts', 'js', 'jade');
});

gulp.task('clean', function () {
    del(['public/css/*', 'public/js', 'public/']);
});

gulp.task('jade', function() {
    return gulp.src('src/template/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src(['src/js/app.js', 'src/js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', browserifyHandler)
        .pipe(ngAnnotate())
        .on('error', browserifyHandler)
        .pipe(concat('main.js'))
        // .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('public/js/'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src([
        'node_modules/angular/angular.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('css', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
    ])
        .pipe(gulp.dest('public/css/'))
});

gulp.task('style', function () {
    return gulp.src('src/css/*.css')
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync.init({
        scriptPath: function (path, port, options) {
            return "/browser-sync/browser-sync-client.js";
        },
        socket: {
            domain: 'localhost:3000'
        },
        server: {
            baseDir: "./"
        },
        notify: false
    });

    gulp.watch(['src/js/*.js'], ['scripts']);
    gulp.watch(['src/template/*.jade'], ['jade']);
});


function browserifyHandler(err) {
    util.log(util.colors.red('Error: ' + err.message));
    this.end();
}
