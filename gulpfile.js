var ENV = require('env');
var stylus = require('gulp-stylus'),
    cssmin = require('gulp-cssmin'),
    jade = require('gulp-jade'),
    htmlmin = require('gulp-htmlmin'),
    filter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    traceur = require('gulp-traceur'),
    browserify = require('gulp-browserify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cached'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer');

if (ENV.isDevelopment) require('./lib/bootstrapFileStructure')([
    '.jshintrc',
    'dist/.gitignore',
    'src/styles/.gitignore',
    'src/templates/.gitignore',
    'src/scripts/.gitignore',
    'src/images/.gitignore',
    'src/assets/.gitignore'
]);

module.exports = function (gulp) {
    gulp.task('dev', ['server', 'watch']);

    gulp.task('server', ['build'], function () {
        if (serverThread && serverThread.kill) serverThread.kill();
        var serverThread = require('child_process').fork(__dirname + '/server.js', [], {env: {STATIC_FILE_DIR: 'dist'}, cwd: process.cwd()});
        process.on('SIGINT', function () {
            if (serverThread && serverThread.kill) serverThread.kill();
            process.exit();
        });
    });
    gulp.task('watch', function () {
        gulp.watch(['src/**/*', 'src/*'], ['build']);
    });

    gulp.task('build', ['build-styles', 'build-templates', 'build-scripts', 'build-images', 'build-assets']);

    gulp.task('build-styles', ['build-styles-stylus', 'build-styles-css']);
    gulp.task('build-templates', ['build-templates-jade', 'build-templates-html']);
    gulp.task('build-scripts', ['build-scripts-traceur']);
    gulp.task('build-images', ['build-images-common']);
    gulp.task('build-assets', ['build-assets-all']);
    if (ENV.isProduction) { //strict mode && minification


        gulp.task('build-styles-stylus', function () {
            return gulp.src('src/styles/**/[!_]*.styl')
                .pipe(plumber())
                .pipe(stylus())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(cssmin())
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-styles-css', function () {
            return gulp.src('src/styles/**/[!_]*.css')
                .pipe(plumber())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(cssmin())
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-templates-jade', function () {
            return gulp.src('src/templates/**/[!_]*.jade')
                .pipe(plumber())
                .pipe(jade())
                .pipe(htmlmin())
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-templates-html', function () {
            return gulp.src('src/templates/**/[!_]*.html')
                .pipe(plumber())
                .pipe(htmlmin())
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-scripts-traceur', function () {
            return gulp.src('src/scripts/**/[!_]*.js')
                .pipe(plumber())
                .pipe(traceur({sourceMaps: true}))
                .pipe(browserify({transform: ['es6ify']}))
                .pipe(uglify())
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-images-common', function () {
            return gulp.src('src/images/**/[!_]*')
                .pipe(plumber())
                .pipe(imagemin())
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-assets-all', function () {
            return gulp.src('src/assets/**/[!_]*')
                .pipe(plumber())
                .pipe(gulp.dest('dist'));
        });


    } else {


        gulp.task('build-styles-stylus', function () {
            return gulp.src('src/styles/**/[!_]*.styl')
                .pipe(plumber())
                .pipe(cache('build-styles-stylus'))
                .pipe(stylus())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-styles-css', function () {
            return gulp.src('src/styles/**/[!_]*.css')
                .pipe(plumber())
                .pipe(cache('build-styles-css'))
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-templates-jade', function () {
            return gulp.src('src/templates/**/[!_]*.jade')
                .pipe(plumber())
                .pipe(cache('build-templates-jade'))
                .pipe(jade())
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-templates-html', function () {
            return gulp.src('src/templates/**/[!_]*.html')
                .pipe(plumber())
                .pipe(cache('build-templates-html'))
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-scripts-traceur', function () {
            return gulp.src('src/scripts/**/[!_]*.js')
                .pipe(plumber())
                .pipe(cache('build-scripts-traceur'))
                .pipe(traceur())
                .pipe(browserify({transform: ['es6ify']}))
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-images-common', function () {
            return gulp.src('src/images/**/[!_]*')
                .pipe(plumber())
                .pipe(cache('build-images-common'))
                .pipe(gulp.dest('dist'));
        });
        gulp.task('build-assets-all', function () {
            return gulp.src('src/assets/**/[!_]*')
                .pipe(plumber())
                .pipe(cache('build-assets-all'))
                .pipe(gulp.dest('dist'));
        });

        require('colors');
        process.on('uncaughtException', function (error) {
            console.log("----------ERROR MESSAGE START----------\n".bold.red.underline);
            console.log(("\n[" + error.name + " in " + error.plugin + "]").red.bold.inverse);
            console.log(error.message);
            console.log("----------ERROR MESSAGE END----------\n".bold.red.underline);
        });
    }
};