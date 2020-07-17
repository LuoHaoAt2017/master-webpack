---
category: Components
type: Data Display
title: Card
subtitle: 卡片
---


用于组织信息和操作，通常也作为详细信息的入口。

### 规则
- 形状为矩形。
- 可包含多种类型的元素，eg：图片、文字、按钮等。

## API

适用平台：WEB

### Card

属性 | 说明 | 类型 | 默认值
----|-----|------|------
|   full  |  是否通栏  | boolean | `false` |

### CardHeader

属性 | 说明 | 类型 | 默认值
----|-----|------|------
|headerStyle| 卡片标题样式 | Object | {} |
|headerClassName| 卡片标题CSS类 | String | '' |
|title| 卡片标题 | React.Element、String | |
|headerThumb| 卡片标题图片 | slot，<template slot="headerThumb"></template> |  |
|headerExtra| 卡片标题辅助内容 | slot，<template slot="headerExtra"></template> |  |
|thumbStyle| 标题图片样式 | Object | {} |


### CardBody

属性 | 说明 | 类型 | 默认值
----|-----|------|------
|bodyStyle| 卡片内容样式 | Object | {} |
|bodyClassName| 卡片内容CSS类 | String | '' |

### CardFooter

属性 | 说明 | 类型 | 默认值
----|-----|------|------
|footerStyle| 卡片内容样式 | Object | {} |
|footerClassName| 卡片内容CSS类 | String | '' |
|footerContent|尾部内容 | slot，<template slot="footerContent"></template> | |
|footerExtra| 尾部辅助内容 | slot，<template slot="footerExtra"></template>|  |

### 示例
```html
<h3-list>
  <h3-wingblank>
    <h3-whitespace></h3-whitespace>
    <h3-card
      title="this is title">
    <template slot="headerThumb">
      <img src="https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png"></img>
    </template>
    <template slot="headerExtra">
      <span>this is extra</span>
    </template>
    <div>this is content of 'Card'</div>
    <div slot="footerContent">footer content</div>
    <div slot="footerExtra">extra footer content</div>
    </h3-card>
    <h3-whitespace></h3-whitespace>
  </h3-wingblank>
</h3-list>
```