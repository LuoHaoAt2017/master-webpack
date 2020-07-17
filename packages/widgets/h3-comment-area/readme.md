---
category: Components
type: Feedback
title: ActionSheet
subtitle: 动作面板
---

文本框组件，提供和当前场景相关的评论文本框,
可定制文本框的占位提示符
可定制文本框的最大字符数(默认140),
可定制文本框的一键清除文本功能(默认可清除),
也可定制是否在文本框右下角显示当前文本字数/最大字符数(默认不显示),
可定制文本框的上下边距样式(默认上边距15px,下边距15px),
可定制是否显示文本框的底部边框(默认不显示)


## API

属性 | 说明 | 类型 | 默认值| 结构
----|-----|------|------|------
| maxLength |最大字符数 | Number | 140| 140
| placeholder | 占位提示符 | String | '' | ''
| clear | 一键清除文本框文字 | Boolean | true | true
| hasCount | 是否在右下角显示当前文本框字数/最大字符数 | Boolean | false | false
|controlStyle | 上下边距的样式 | Object | {paddingTop: '15px',paddingBottom: '15px',} | {paddingTop:String,paddingBottom:String}
|hasBottomLine | 是否显示底部边框 | Boolean | false |false