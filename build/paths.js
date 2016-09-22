var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
    markup: appRoot + '**/*.html',
    output: outputRoot,
    root: appRoot,
    styles: appRoot + '**/*.s+(a|c)ss',
    typescript: appRoot + '**/*.ts',
    typings: 'typings/**/*.d.ts'
}