var $ = require('gulp-load-plugins')({lazy: true});
var gulp = require('gulp');
var paths = require('../paths');

gulp.task('process-markup', function() {
    return gulp.src(paths.markup)
               .pipe($.changedInPlace({firstPass:true}))
               .pipe(gulp.dest(paths.output));
});