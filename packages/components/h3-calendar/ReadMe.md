---
category: Components;
type: Data Display;
title: Calendar;
subtitle: 日历;
---

日历组件。

## API

### Accordion

适用平台：WEB

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| markDate | 如果需要某月的几天被标注，传当月的日期数组。如[2,6,8]则当月2号、6号、8号回被标注 | Array   | [] |
| markDateMore      | 需要不同的标记样式 | Array | [] |
| agoDayHide      | 多少天以前的日期不可以选中 | String | 0 |
| futureDayHide      | 多少天以后的日期不可以选中 | String | 2554387200 |
| choseDay      | 选中某天调用的方法，返回选中的日期 | Function | Null |
| changeMonth      | 返回切换到某个月的日期 | Function | Null |

##demo
<template>
  <calendar :choseDay="clickDay" :changeMonth="changeMonth"
  :markDate="arr" // arr=['2018/4/1', '2018/04/15']
  :markDateMore="arr2" // arrs=[{date:2018/4/1',className: 'mark1'}]
  ></calendar>
</template>

