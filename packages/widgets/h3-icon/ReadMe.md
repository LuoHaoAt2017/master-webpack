---
category: Components
type: Data Display
title: Icon
subtitle: 图标
---



## 图标的命名规范

我们为每个图标赋予了语义化的命名，命名规则如下:

- 实心和描线图标保持同名，用 `-o` 来区分，比如 `question-circle`(实心) 和 `question-circle-o`(描线)；

- 命名顺序：`[icon名]-[形状可选]-[描线与否]-[方向可选]`。

## 如何使用 (WEB 版)

```html
<h3-icon type="check" />
```

### 提示

现在，我们只支持内置的 'check-circle', 'check', 'check-circle-o', 'cross-circle', 'cross', 'cross-circle-o', 'up', 'down', 'left', 'right', 'ellipsis', 'loading' 这些 icon 类型，**不再默认支持其他自定义类型的 icon**。


## 如何使用 (RN 版)

使用方式：

```html
内置的几个图标： <Icon type="check" size="md" color="red" />
自定义图标：<Icon type={'\ue601'} size={55} /> (具体参看 demo)
```
> 注： 自定义图标需要先查找对应图标的 unicode 字符，可以去 ant.design 官网用 chrome 调试工具查看对应图标的值

## API

适用平台：WEB

| 属性        | 说明           | 类型            | 默认值       |
|------------|----------------|----------------|--------------|
| type    |   内置 icon 名称 (`web`) | String   |
| size    |   图标大小    | 'xxs'/'xs'/'sm'/'md'/'lg' (`RN/WEB`)/ number(`RN Only`)  | `md` |
| color   | 图标颜色  | Color | '#000' |
| className   | 自定义css类名  | String | - |
| h3style   | 自定义Style  | Object | - |
