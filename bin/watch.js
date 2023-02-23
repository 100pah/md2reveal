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
            // Try to avoid occational compile fail.
            setTimeout(function () {
                console.log(markdownPath + ' changed, auto compile ...');
                main.start(opts);
            }, 500);
        }
    });
}

module.exports = {
    start: start
};
