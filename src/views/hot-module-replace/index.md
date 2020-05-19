<h3>注意事项: 模块热替换和样式表的修改问题</h3>
<p>
当我们对css文件只使用css-loader和sass-loader而不使用<strong>style-loader</strong>时，
即便启用了HMR，去更新css文件时发现修改的样式并没有及时地呈现在页面上。
只有手动去刷新时，修改的样式才会产生效果。那么说明模块热替换在样式上失效了。
<strong>CSS的模块热替换依赖style-loader</strong>。
</p>
<pre>
    {
        test: /\.(css|scss)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
            //"style-loader",
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: process.env.NODE_ENV === 'development',
                }
            },
            "css-loader",
            'sass-loader'
        ]
    }
</pre>
