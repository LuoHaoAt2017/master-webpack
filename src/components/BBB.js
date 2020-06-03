const React = require('react');
const CCC = require('./CCC').default;

function BBB() {
    return(
        <div>
            Hello BBB
            <CCC/>
            CommonJS模块规范兼容ES6模块规范需要做些处理
        </div>
    )
}

module.exports = BBB;