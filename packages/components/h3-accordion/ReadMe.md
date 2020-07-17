---
category: Components;
type: Data Display;
title: Accordion;
subtitle: 手风琴;
---

可以折叠/展开的内容区域。

### 规则
- 对复杂区域进行分组和隐藏。
- 通常，一次只允许单个内容区域展开；特殊情况，多个内容区域可以同时展开。


## API

### Accordion

适用平台：WEB

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| defaultIndex | 初始化选中面板的 key | String   | 0 |
| multi      | 是否可以同时展开多个面板 | Boolean | false |

### Accordion-Item

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| title  | 对应 activeKey   | String          | 无     |
| iconClass  | 右侧指示图标 | String           | icon-base-down |

