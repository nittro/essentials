var gulp = require('gulp'),
    nittro = require('gulp-nittro'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip');

var builder = new nittro.Builder({
    base: {
        core: true,
        datetime: true,
        neon: true,
        di: true,
        ajax: true,
        page: true,
        forms: true,
        flashes: true
    },
    bootstrap: true,
    stack: true
});

var info = require('./package.json');

gulp.task('js', function () {
    return nittro('js', builder)
        .pipe(sourcemaps.init())
        .pipe(concat('nittro.min.js'))
        .pipe(uglify({compress: true, mangle: false}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('css', function () {
    return nittro('css', builder)
        .pipe(sourcemaps.init())
        .pipe(less({compress: true}))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(concat('nittro.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('zip', ['js', 'css'], function () {
    return gulp.src(['dist/nittro.min.*', 'Readme.md'])
        .pipe(zip(info.name + '-' + info.version + '.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js', 'css', 'zip']);
