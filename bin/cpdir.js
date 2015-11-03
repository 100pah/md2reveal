var fs = require('fs');
var path = require('path');

/**
 * @example
 * copy('./src/aa/', './build/')
 * result: ./build/aa/ exists
 */
function copy(src, dst) {
    if (!fs.statSync(dst).isDirectory()) {
        console.error(dst + ' must be directory!');
        return;
    }

    fs.readdir(src, function(err, paths){

        if (err){
            throw err;
        }

        paths.forEach(function(p){
            var fullSrc = path.join(src, p);
            var fullDst = path.join(dst, p);

            fs.stat(fullSrc, function(err, st){
                if (err){
                    throw err;
                }

                if (st.isFile()){
                    var readable = fs.createReadStream(fullSrc);
                    var writable = fs.createWriteStream(fullDst);
                    readable.pipe(writable);
                }
                else if (st.isDirectory()){
                    exists(fullSrc, fullDst, copy);
                }
            });
        });
    });
}

function exists(src, dst, callback) {
    fs.exists(dst, function(exists){
        if (exists){
            callback(src, dst);
        }
        else {
            fs.mkdir(dst, function(){
                callback(src, dst);
            });
        }
    });
}

module.exports = copy;