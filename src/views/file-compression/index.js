import React from 'react';
import './index.scss';
class FileCompression extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
        <div className='file-compression'>
            <ul>
                <li><strong>html</strong>: 根据特定的模板创建html文件。</li>
                <li>
                    <strong>css</strong>: 
                        MiniCssExtractPlugin(只针对CSS)。
                        将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件。
                        OptimizeCSSAssetsPlugin对css文件进行压缩。
                </li>
                <li>
                    <strong>js</strong>: webpack v4内置了uglifyjs-webpack-plugin。
                    所以我们默认打包就会压缩js文件。但是，假如你需要自定义配置，
                    那么需要手动下载插件进行配置。
                </li>
            </ul>
        </div>);
    }
}

export default FileCompression;