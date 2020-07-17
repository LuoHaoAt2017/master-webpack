---
category: Components
type: Feedback
title: ActionSheet
subtitle: 动作面板
---

从底部弹出的模态框，提供和当前场景相关的 2 个以上的操作动作，也支持提供描述。内置固定的展示样式、不支持特别灵活的修改。


## API

适用平台：WEB
属性 | 说明 | 类型 | 默认值
----|-----|------|------
| value | 绑定model，显示隐藏模态框 | Boolean   | false |
| showCancel      | 是否显示取消菜单 | Boolean | true |
| cancelText      | 取消菜单显示文字 | String | 无 |
| message      | 模态框标题描述文字 | String | 无 |
| theme      | 模态框显示主题风格(可选风格ios,android) | String | ios |
| menus      | 模态框菜单对象 | Object,Array | 无 |
| closeOnClickingMask      | 点击背景mask层时是否关闭模态框 | Boolean | true |
| closeOnClickingMenu      | 点击菜单项时是否关闭模态框 | Boolean | true |

