const gulp = require('gulp'),
    nittro = require('gulp-nittro'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip'),
    pump = require('pump');

const builder = new nittro.Builder({
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

const info = require('./package.json');

gulp.task('js', function (cb) {
    pump([
        nittro('js', builder),
        sourcemaps.init(),
        concat('nittro.min.js'),
        uglify({compress: true, mangle: false}),
        sourcemaps.write('.'),
        gulp.dest('dist/')
    ], cb);
});

gulp.task('css', function (cb) {
    pump([
        nittro('css', builder),
        sourcemaps.init(),
        less({compress: true}),
        postcss([ autoprefixer() ]),
        concat('nittro.min.css'),
        sourcemaps.write('.'),
        gulp.dest('dist/')
    ], cb);
});

gulp.task('zip', function (cb) {
    pump([
        gulp.src(['dist/nittro.min.*', 'Readme.md']),
        zip(info.name + '-' + info.version + '.zip'),
        gulp.dest('dist/')
    ], cb);
});

gulp.task('build', gulp.parallel('js', 'css'));
gulp.task('release', gulp.series('zip'));
