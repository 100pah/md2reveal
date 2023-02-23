var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var md = require('reveal.js/plugin/markdown/markdown');
var cpdir = require('./cpdir');
var rmdir = require('./rmdir');
var mdMore = require('./mdMore');

var baseBasePath = path.join(__dirname, '..');
var userAssetName = 'asset';
var md2revealLibNameBase = 'md2reveal-';

var opts = {
    assetPath: path.join(__dirname, '../asset'),
    template: fs.readFileSync(path.join(baseBasePath, 'template', 'reveal.html')).toString(),
    theme: 'black',
    highlightTheme: 'zenburn',
    separator: '^(\r\n?|\n)---(\r\n?|\n)$',
    verticalSeparator: '^(\r\n?|\n)----(\r\n?|\n)$',
    revealOptions: {}
};

function start(options) {
    opts.userBasePath = options.basePath;
    opts.theme = options.theme || opts.theme;
    opts.highlightTheme = options.highlightTheme || opts.highlightTheme;
    opts.separator = options.separator || opts.separator;
    opts.verticalSeparator = options.verticalSeparator || opts.verticalSeparator;
    opts.revealOptions = options.revealOptions || {};
    opts.mdPath = options.mdPath;
    opts.libVersion = options.libVersion;

    // Path for html, not for node.
    // opts.revealOptions.math = {
    //     mathjax: './asset/' + md2revealLibNameBase + opts.libVersion + '/thirdPart/mathJax.js'
    // };

    var html = render();
    output(html);
}

function render() {

    var markdown = '';
    var markdownPath;

    markdownPath = path.resolve(path.join(opts.userBasePath, opts.mdPath));

    if (fs.existsSync(markdownPath)) {
        markdown = fs.readFileSync(markdownPath).toString();

        var slides = md.slidify(markdown, opts);
        slides = mdMore(slides);

        return mustache.to_html(opts.template, { // jshint ignore:line
            theme: opts.theme,
            themeMine: opts.theme.replace('.css', '-md2reveal.css'),
            highlightTheme: opts.highlightTheme,
            slides: slides,
            options: JSON.stringify(opts.revealOptions, null, 2),
            libName: md2revealLibNameBase + opts.libVersion
        });
    }
    else {
        console.error(markdownPath + ' not exists');
    }
}

function output(html) {

    var resultFileNameBase = opts.mdPath.replace('.md', '');
    var assetDirPath = path.join(opts.userBasePath, userAssetName);

    if (!fs.existsSync(assetDirPath)) {
        fs.mkdirSync(assetDirPath);
    }
    else if (!fs.statSync(assetDirPath).isDirectory()) {
        console.error(assetDirPath + ' should be a directory!' );
        return;
    }

    var resultHTMLPath = path.join(opts.userBasePath, resultFileNameBase + '.html');
    fs.writeFileSync(resultHTMLPath, html, {encoding:'utf-8'});

    var currMd2revealLibPath = path.join(
        assetDirPath, md2revealLibNameBase + opts.libVersion
    );

    // If no old version exists, do nothing,
    // otherwise, copy lib.
    // It is not necessary to do copy every time,
    // which I think is not good for my SSD disk,
    // especially when using 'watch'.
    if (!fs.existsSync(currMd2revealLibPath)) {
        fs.mkdirSync(currMd2revealLibPath);
        cpdir(opts.assetPath, currMd2revealLibPath);
    }

    // Delete lib with old version if exists.
    var paths = fs.readdirSync(assetDirPath);
    paths.forEach(function (p) {
        if (p !== md2revealLibNameBase + opts.libVersion
            && p.indexOf(md2revealLibNameBase) === 0
        ) {
            rmdir(path.join(assetDirPath, p));
        }
    });

    console.log('done.');
}

module.exports = {
    start: function (options) {
        try {
            process
                .on('unhandledRejection', function (reason, p) {
                    console.error(reason, 'Unhandled Rejection at Promise', p);
                })
                .on('uncaughtException', function (err) {
                    console.error(err, 'Uncaught Exception thrown');
                    process.exit(1);
                });
            start(options);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
};
