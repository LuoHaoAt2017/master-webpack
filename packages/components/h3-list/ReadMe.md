---
category: Components
type: Data Display
title: List
subtitle: 列表
---


单个连续模块垂直排列，显示当前的内容、状态和可进行的操作。eg：联系人列表。

### 规则
- 一般由主要信息、主要操作、次要信息、次要操作组成。
- 主要信息和主要操作放在列表的左边，次要信息和次要操作放在列表的右边。


## API

适用平台：WEB

### List

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| h3style | 列表Style样式 | Object | {} |
| className | 列表CSS类 | String | '' |
| hasHeader | 是否显示头部，同slot="header"配合使用   |  Boolean  |  false  |
| hasFooter | 是否显示底部，同slot="footer"配合使用  | Boolean |  false  |

### ListItem

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| h3style | 列表Style样式 | Object | {} |
| className | 列表CSS类 | String | '' |
| hasThumb       | 是否显示缩略图,配合<slot name="thumb"></slot>使用  | Boolean |  false  |
| hasExtra      | 是否右边内容,配合<slot name="thumb"></slot>使用 | Boolean |  无  |
| extra      | 右边内容,配合hasExtra使用，如果没有写thumb的插槽内容时，显示extra的内容 | html或String |  无  |
| arrow      | 箭头方向(右,上,下), 可选`horizontal`,`up`,`down`,`empty`，如果是`empty`则存在对应的dom,但是不显示   | String |   无  |
| align    |  子元素垂直对齐，可选`top`,`middle`,`bottom`  | String   | `middle` |
| error(`web only`)    | 是否有报错，报错样式,右侧文字颜色变成橙色 | Boolean  | `false`  |
| multipleLine    | 多行 | Boolean  | `false`  |
| wrap    | 是否换行，默认情况下，文字超长会被隐藏， | Boolean  | `false`  |
| activeStyle(`web only`)    | 自定义active的样式 | Object  |   |
| platform (`web only`) |  设定组件的平台特有样式, 可选值为 `android`, `ios`， 默认为 `cross`， 即组件会自动检测设备 UA 应用不同平台的样式    | String | `'cross'`|
| onClick    | 点击事件的回调函数 | (): void |  无  |

### List.Item.Brief

辅助说明 ，内容放在插槽'brief'中,可以用来设置item的子标题或摘要
```html
<h3-list-item arrow="horizontal" :hasThumb="true" :hasExtra="true" multipleLine platform="android">
  <img src="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" slot="thumb"></img>
  <template slot='extra'>extra content</template>
  Title
  <template slot="brief">subtitle</template>
</h3-list-item>
```