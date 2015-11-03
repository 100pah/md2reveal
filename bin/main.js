var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var md = require('reveal.js/plugin/markdown/markdown');
var cpdir = require('./cpdir');
var rmdir = require('./rmdir');

var baseBasePath = path.join(__dirname, '..');
var userAssetName = 'asset';
var enterName = 'main.js';
var md2revealLibName = 'md2reveal';

var opts = {
    userBasePath: process.cwd(),
    assetPath: path.join(__dirname, '../asset'),
    revealBasePath: path.resolve(require.resolve('reveal.js'), '..', '..'),
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

        return mustache.to_html(opts.template, { // jshint ignore:line
            theme: opts.theme,
            highlightTheme: opts.highlightTheme,
            slides: slides,
            options: JSON.stringify(opts.revealOptions, null, 2)
        });
    }
    else {
        console.log(markdownPath + ' not exists');
    }
}

function output(html) {

    var resultFileNameBase = opts.mdPath.replace('.md', '');
    var assetDirPath = path.join(opts.userBasePath, userAssetName);

    if (!fs.existsSync(assetDirPath)) {
        if (!fs.statSync(assetDirPath).isDirectory()) {
            console.error(assetDirPath + ' should be a directory!' );
            return;
        }
        fs.mkdirSync(assetDirPath);
    }

    var resultHTMLPath = path.join(opts.userBasePath, resultFileNameBase + '.html');
    fs.writeFileSync(resultHTMLPath, html, {encoding:'utf-8'});

    var md2revealLibPath = path.join(assetDirPath, md2revealLibName);
    if (fs.existsSync(md2revealLibPath)) {
        rmdir(md2revealLibPath);
    }
    fs.mkdirSync(md2revealLibPath);
    cpdir(opts.assetPath, md2revealLibPath);

    console.log('done.');
}

module.exports = {
    start: start
};
