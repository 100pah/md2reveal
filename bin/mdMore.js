// Add more tags for convenient.

var FRAGMENT_REG = /\{(\d+)\|([^\}]*?)\}/g;
var IFRAEM_REG = /~\[([\d.%]*)\*?([\d.%]*)\]\(([^\(\)]+?)\)/g;

function process(mdText) {

    // {0|xxx} =>
    // <div class="fragment" data-fragment-index="0">xxx</div>
    mdText = mdText.replace(
        FRAGMENT_REG,
        '<div class="fragment" data-fragment-index="$1">$2</div>'
    );

    // ~[23*45%](http://xxx.xxx.xxx/xxx) =>
    // <iframe style="width: 23px; height: 45%" data-md2r-src="http://xxx.xxx.xxx/xxx"></iframe>
    mdText = mdText.replace(
        IFRAEM_REG,
        function (o, width, height, url) {
            return ''
                + '<iframe style="'
                + formatSize(width, 'width')
                + formatSize(height, 'height')
                + '" data-md2r-src="'
                + url
                + '"></iframe>';
        }
    );

    return mdText;
}

function formatSize(value, name) {
    if (value) {
        if (value.indexOf('%') >= 0) {
            return name + ':' + value + ';';
        }
        else {
            return name + ':' + parseInt(value) + 'px;';
        }
    }
    else {
        return '';
    }
}

module.exports = process;
