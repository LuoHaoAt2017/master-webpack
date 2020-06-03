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
            <article>
                <section>
                    <h3><img src={WebpackIcon} alt='webpack'></img></h3>
                    <ul>
                        <li>代码转换: TypeScript 编译成 JavaScript、SCSS,LESS 编译成 CSS.</li>
                        <li>文件压缩：压缩 JavaScript、CSS、HTML 代码，压缩合并图片。</li>
                        <li>代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。</li>
                        <li>模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。</li>
                        <li>自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。</li>
                    </ul>
                    <footer><AAA/></footer>
                </section>
            </article>
        </div>
    )
}
export default Home;