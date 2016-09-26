var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
    jsOutput: outputRoot + 'js/',
    markup: appRoot + '**/*.html',
    output: outputRoot,
    root: appRoot,
    styles: appRoot + '**/*.s+(a|c)ss',
    cssOutput: outputRoot + 'css/',
    typescript: appRoot + '**/*.ts',
    typings: 'typings/**/*.d.ts'
}