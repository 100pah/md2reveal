// Add more tags for convenient.

var FRAGMENT_REG = /\{([0-9a-zA-Z:_]+)\|([^\}]*?)\}/g;
var IFRAEM_REG = /~\[([\d.%]*)\*?([\d.%]*)\]\(([^\(\)]+?)\)/g;

var uid = 0;

function process(mdText) {

    // {0|xxx} =>
    // <div class="fragment" data-fragment-index="0" id="fregment_12341234_0">xxx</div>
    // {0_2:code_1|xxx} =>
    // <div class="fragment" data-fragment-index="0" id="fregment_12341234_0">xxx</div>
    // <div class="fragment" data-fragment-index="2" data-fragement-ref-id="fregment_12341234_0"></div>
    // <div class="fragment" data-fragment-index="1" data-fragment-param="code" data-fragement-ref-id="fregment_12341234_0"></div>
    mdText = mdText.replace(
        FRAGMENT_REG,
        function (match, fragmentIndex, content) {
            var mainId = 'fregment_' + Math.random() + '_' + uid++;
            return fragmentIndex.split('_').map(function (fragIdx, index) {
                var parsed = fragIdx.match(/^(\d+)(\:([a-zA-Z]+))?$/);
                if (!parsed || !parsed[0]) {
                    throw new Error('Illegal fragment index: ' + fragIdx);
                }
                fragIdx = parsed[1];
                fragParam = parsed[3] || '';

                var fragAttrs = ''
                    + ' data-fragment-index="' + fragIdx + '" '
                    + ' data-fragment-param="' + fragParam + '" ';

                return !index
                    ? ('<div class="fragment"' + fragAttrs
                        + ' id="' + mainId + '" >' + content + '</div>'
                    )
                    : ('<div class="fragment"' + fragAttrs
                        + ' data-fragment-ref-id="' + mainId + '" ></div>'
                    )
            }).join('');
        }
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
