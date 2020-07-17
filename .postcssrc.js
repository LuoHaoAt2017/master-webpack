// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    "plugins": {
        // to edit target browsers: use "browserslist" field in package.json
        "postcss-import": {},
        "autoprefixer": {
            "remove": false
        },
        'postcss-plugin-px2rem': {
            rootValue: 75,
            unitPrecision: 4,
            propWhiteList: [],
            propBlackList: [],
            exclude: /(src)|(packages)|(node_modules[\\/]@h3[\\/]report)|(node_modules[\\/]h3-mobile-vue)/,
            selectorBlackList: [],
            ignoreIdentifier: false,
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
        },
        'postcss-design-convert': {
            multiple: 2,
            units: ['rem'],
            selector: /^\.h3think/,
        },
    }
}
