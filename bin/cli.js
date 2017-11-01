#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var commander = require('commander');
var main = require('./main');
var watch = require('./watch');
var pkg = require('../package.json');

var basePath = process.cwd();
var baseName;
var filePath;
var revealPath = path.resolve(require.resolve('reveal.js'), '..', '..');
var highlightTheme = 'zenburn';

commander
    .version(pkg.version)
    .usage('<slides.md> [options]')
    .option('-w, --watch', 'Watch modification of file can auto compile.')
    .option('-t, --theme [theme]', 'Theme')
    .option('-H, --highlightTheme [highlight theme]', 'Highlight theme')
    .option('-s, --separator [separator]', 'Slide separator')
    .option('-v, --verticalSeparator [vertical separator]', 'Vertical slide separator')
    .parse(process.argv);


if (commander.args.length > 2) {
    commander.help();
}

var pathArg = commander.args[0];
var theme = commander.theme || 'black';

if (!pathArg) {
    console.error('no path arg');
    return;
}

filePath = path.resolve(pathArg);

if(fs.existsSync(filePath)) {

    var stat = fs.statSync(filePath);
    if(stat.isFile()) {
        basePath = path.dirname(filePath);
        baseName = path.basename(filePath);
    }
    else {
        console.error('Must be file but not dir');
        return;
    }
}
else {
    console.error('Must be input file path');
    return;
}

theme = glob
    .sync('css/theme/*.css', {cwd: revealPath})
    .concat(
        glob.sync('theme/*.css', {cwd: path.resolve(basePath)})
    )
    .filter(
        function(themePath) {
            return path.basename(themePath).replace(path.extname(themePath), '') === commander.theme;
        }
    ).pop()
    || 'css/theme/' + theme + '.css';

highlightTheme = commander.highlightTheme || highlightTheme;

// load custom reveal.js options from reveal.json
var revealOptions = {};
var manifestPath = path.join(basePath, 'reveal.json');
if (fs.existsSync(manifestPath) && fs.statSync(manifestPath).isFile(manifestPath)) {
    try {
        var options = require(manifestPath);
        if(typeof options === 'object') {
            revealOptions = options;
        }
    } catch(err) {
        console.log(err);
    }
}
// overide default theme from manifest options
if(!commander.theme && revealOptions.theme) {
    theme = revealOptions.theme;
}

// overide default highlight theme from manifest options
if(!commander.highlightTheme && revealOptions.highlightTheme) {
    highlightTheme = revealOptions.highlightTheme;
}

var startOpt = {
    libVersion: pkg.version,
    basePath: basePath,
    mdPath: baseName,
    theme: theme,
    highlightTheme: highlightTheme,
    separator: commander.separator,
    verticalSeparator: commander.verticalSeparator,
    printFile: commander.print,
    revealOptions: revealOptions,
    openWebBrowser: !commander.disableAutoOpen
};
if (commander.watch) {
    watch.start(startOpt);
}
else {
    main.start(startOpt);
}