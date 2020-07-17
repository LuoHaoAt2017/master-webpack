---
category: Components
type: DataEntry
title: AreaSelector
subtitle: 地址选择
---

地址选择组件，支持自定义显示模式 省、省-市、省-市-区等


## API

适用平台：WEB
属性 | 说明 | 类型 | 默认值
----|-----|------|------
| raw-value | 指定初始化时绑定的数据是否为文本(即省市名，而不是id)类型，即对于非id值组件内部会转换为id。如果是异步设置value，只能使用id赋值。 | Boolean   | false |
| title      | 弹出选择框的标题 | String | NULL |
| value      | 表单值, 使用v-model绑定 | Array | [] |
| list      | 地址列表, 可以引入内置地址数据或者用自己的数据，但是需要按照一致的数据结构。 | Array | 无 |
| inline-desc      | 标题下的描述 | String | NULL |
| placeholder      | 没有值时的提示文字 | String | NULL |
| mode      | 地址选择模式（P-C-T,P-C,P） | String | P-C-T |
| value-text-align      | value 对齐方式(text-align) | String | right |
| show      | 是否显示(支持.sync修饰 next) | Boolean | right |
| popup-style      | 弹窗样式，可以用于强制指定 z-index | Object | NULL |

## Events
事件 | 参数 | 说明 
| on-hide  |	 -- |关闭后触发，当非确定时，参数为false，反之为true |
| on-show  |	 -- |	显示时触发 |
| on-shadow-change |	(Array ids, Array names) |	picker 值变化时触发，即滑动 picker 时触发 |


##Slots
名字 | 说明 
| title  | title 插槽，可以使用它来添加 icon 等自定义样式，受控于 group 需要从 scope 里继承 class 和 样式

