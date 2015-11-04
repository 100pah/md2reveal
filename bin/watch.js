var path = require('path');
var fs = require('fs');
var main = require('./main');

function start(opts) {
    var markdownPath = path.resolve(path.join(opts.basePath, opts.mdPath));

    if (!fs.existsSync(markdownPath) || !fs.statSync(markdownPath).isFile()) {
        console.error(markdownPath + ' must be a md file');
        return;
    }

    fs.watch(markdownPath, function (event) {
        if (event === 'change') {
            console.log(markdownPath + ' changed, auto compile ...');
            main.start(opts);
        }
    });
}

module.exports = {
    start: start
};
