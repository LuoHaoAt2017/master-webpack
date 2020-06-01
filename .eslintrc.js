module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "plugin:vue/essential",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 11
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        // 不需要
        "space-before-function-paren": 0,
        "eol-last": 0,
        "no-extra-semi": 0,
        "semi": 0,
        "eqeqeq": 0,
        "one-var": 0,
        "no-undef": 0,

        // 警告
        "no-use-before-define": [1, "nofunc"]
    }
};
