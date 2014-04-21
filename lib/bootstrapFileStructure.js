var bootstrapFileStructure = [
        '.jshintrc',
        'dist/.gitignore',
        'src/styles/.gitignore',
        'src/templates/.gitignore',
        'src/scripts/.gitignore',
        'src/images/.gitignore',
        'src/assets/.gitignore'
    ],
    fs = require('fs-extra'),
    path = require('path');

module.exports = function (userBootstrapFileStructure) {
    if (!userBootstrapFileStructure) userBootstrapFileStructure = bootstrapFileStructure;
    userBootstrapFileStructure.forEach(function (filePath) {
        fs.createFileSync(path.resolve('./' + filePath));
    });
};