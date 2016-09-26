var $ = require('gulp-load-plugins')({lazy: true});
var eventStream = require('event-stream');
var gulp = require('gulp');
var paths = require('../paths');
var typescriptCompiler = typescriptCompiler || null;

gulp.task('lint-typescript', function() {
    return gulp.src(paths.typescript)
               .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
               .pipe($.tslint({ configuration: './tslint.json', formatter: 'verbose' }))
               .pipe($.tslint.report());
});

gulp.task('process-typescript', ['lint-typescript'], function() {
    if(!typescriptCompiler) {
        typescriptCompiler = $.typescript.createProject('./tsconfig.json', { typescript: require('typescript') });
    }

    let dts = gulp.src(paths.typings);
    let src = gulp.src(paths.typescript)
                  .pipe($.changedInPlace({firstPass: true}));

    return eventStream.merge(dts, src)
                      .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
                      .pipe($.sourcemaps.init())
                      .pipe($.typescript(typescriptCompiler))
                      .pipe($.sourcemaps.write('./maps'))
                      .pipe(gulp.dest(paths.jsOutput));
});