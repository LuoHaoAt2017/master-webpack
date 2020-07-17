---
category: Components
type: Feedback
title: Toast
subtitle: 轻提示
---


一种轻量级反馈/提示，可以用来显示不会打断用户操作的内容，适合用于页面转场、数据交互的等场景中。


### 规则
- 一次只显示一个 toast。
- 有 Icon 的 Toast，字数为 4-6 个；没有 Icon 的 Toast，字数不宜超过 14 个。


## API

适用平台：WEB

- <h3-toast :show="show" @onHide='hideFunction'> </h3-toast>

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| text    | 提示内容       | String    | 无           |
| duration   | 自动关闭的延时，单位秒 | number                 | 3          |
| mask    | 是否显示透明蒙层，防止触摸穿透 |  Boolean  | true          |
| onHide    | 关闭后回调 |  Function                 | 无          |

