var fs = require('fs');
var path = require('path');

function rmdir(dstPath) {
    var files = [];

    if (fs.existsSync(dstPath)) {

        files = fs.readdirSync(dstPath);

        files.forEach(function(file, index) {
            var curPath = path.join(dstPath, file);

            if(fs.statSync(curPath).isDirectory()) {
                rmdir(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(dstPath);
    }
}

module.exports = rmdir;