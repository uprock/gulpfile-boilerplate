require('portfinder').getPort(function (err, port) {
    if (err) return console.log(err);
    require('gulp-connect').server({
        port: port,
        root: process.env.STATIC_FILE_DIR,
        livereload: true
    });
    require('open')('http://localhost:' + port);
});
