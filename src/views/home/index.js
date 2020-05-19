import React from 'react';
class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='home'>
                <article>
                    <section>
                        <h3>Webpack的功能</h3>
                        <p>
                            代码转换: TypeScript 编译成 JavaScript、SCSS,LESS 编译成 CSS.
                            文件压缩：压缩 JavaScript、CSS、HTML 代码，压缩合并图片。
                            代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
                            模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
                            自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
                        </p>
                    </section>
                </article>
            </div>
        )
    }
}

export default Home;