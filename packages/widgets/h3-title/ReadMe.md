---
category: Components
type: Data Display
title: Title
subtitle: 标题
---


## 如何使用 (WEB 版)

```html
<h3-title title='' size='' iconFloat=''> </h3-title> 
```
## 图标
使用图标需要引入<h3-icon>组件 并设置插槽名称：icon.其他参数请详见<h3-icon>组件api
```html
<h3-icon slot="icon"></h3-icon>
```
## 右侧按钮组
如需在右侧添加按钮或按钮组，可自定义html结构 并设置插槽名称：extra.允许使用循环遍历出按钮组，并允许对按钮组提供点击事件。
```html
<span 
    slot="extra" 
    v-for="(item,index) in extraArr"
    @click="onClickExtra(index)">
    {{item.title}} 
    <b v-if="index!= extraArr.length -1">|</b>
</span>
```

## API

适用平台：WEB

| 属性        | 说明           | 类型            | 默认值       |
|------------|----------------|----------------|--------------|
| title    |   内置 icon 名称 (`web`) | String   |
| size    |   图标大小    | 'xxs'/'xs'/'sm'/'md'/'lg' | `md` |
| iconFloat   | 图标位置  | 'left','right','top','bottom' | 'left' |
| className   | 自定义css类名  | String | - |
| h3style   | 自定义Style  | Object | - |
