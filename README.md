
## Webpack实践

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 优化开发体验
- 优化构建速度
- 优化用户体验

### 优化输出质量
- 减少首屏加载时间
- 提升流程度

### 优化构建速度
- 缩小文件搜索范围

- 使用DllPlugin

- 使用HappyPack

- 使用ParallelUglifyPlugin

- 压缩代码

### 优化用户体验
- 使用自动刷新

- 开启模块热替换

- 使用TreeShaking

- 区分环境

- CDN加速

- 提取公共代码

- 分割代码以按需加载

- 输出分析