import React from 'react';
import './index.scss';
import '@/assets/scss/common.scss';
import AAA from '@/components/AAA.js';
import _ from 'loadsh';
const current = _.now();
console.log('current: ', current);
// App.js中引入Home.js采取的方式ES6模块机制
// 在采取了ES6模块规范的Home.js中，使用CommonJS规范的方式引入图片
// 需要做兼容性处理。添加default。之前遇到过这个问题，当时不知道为什么图片引入失败。
const WebpackIcon = require('@/assets/img/webpack.jpg').default;
function Home() {
    return (
        <div className='home'>
          <img src={WebpackIcon} alt='webpack'></img>
        </div>
    )
}
export default Home;