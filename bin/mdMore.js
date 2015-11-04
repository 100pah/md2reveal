// Add more tags for convenient.

var FRAGMENT_REG = /\{(\d+)\|([^\}]*?)\}/g;

function process(mdText) {
    // {0|xxx} =>
    // <div class="fragment" data-fragment-index="0">xxx</div>
    return mdText.replace(
        FRAGMENT_REG,
        '<div class="fragment" data-fragment-index="$1">$2</div>'
    )
}

module.exports = process;
