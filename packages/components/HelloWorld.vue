<template>
  <div class="index-demos-wrapper">
    <div class="demoTitle">氚云移动端组件库</div>
    <h3-accordion default-index="0">
      <h3-accordion-item title="布局Layout" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('flexbox')" >
            Flex Flex布局
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('whitespace')" >
            WhiteSpace 上下留白
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('wingblank')" >
            WingBlank 两翼留白
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="导航Navigation" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('navbar')" >
            Navbar 导航栏
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('popover')" >
            Popover 气泡
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('tabbar')">
            Tabbar 标签栏
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('tab')">
            Tabs 标签页
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="数据录入Data Entry" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('button')">
            Button 按钮
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('checkbox')" >
            Checkbox 复选框
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('datetime')">
            DatePicker 日期选择
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('areaSelector')">
            AreaSelector 地区选择
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('input')">
            inputitem 文本输入
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('picker')">
            picker 选择器
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('pickerview')">
            pickerview 选择器
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('radio')">
            radio 单选框
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('searchbar')">
            searchbar 搜索栏
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('h3switch')">
            switch 滑动开关
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('textarea')">
            textareaitem 多行输入
          </h3-list-item>
           <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('h3userdemo')" >
            选人控件
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('field')">
           Field 表单字段
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('photofield')">
           PhotoField 图片上传字段
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('filefield')">
           FileField 附件上传字段
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('property')" >
            流水号，公式型控件，关联属性
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('association')" >
            关联表单
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="数据展示Data Display" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('accordion')"> 
            accordion 手风琴
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('badge')">
            Badge 徽标
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('avatar')">
            Avatar 头像
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('card')">
            Card 卡片
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @onClick="jump" event-args="grid">
            Grid 宫格
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('icon')">
            icon 图标
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('list')">
            list 列表
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('noticebar')">
            NoticeBar 通告栏
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('tag')">
            Tag 标签
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('calendar')">
            Calendar 日历
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="操作反馈Feedback" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('actionsheet')">
            actionsheet 动作面板
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('activityIndicator')" >
            ActivityIndicator 活动指示器
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('modal')" >
            Modal 对话框
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('toast')" >
            Toast 轻提示
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('dialog')" >
            dialog 对话框
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('sortlist')" >
            sortlist 列表拖拽排序
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="手势Gesture" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('scroll')">
            Pulltorefresh 刷新、加载更多
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('swipeout')" >
            Swipeout 滑动
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('swipe')">
            Swipe 滑动
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('slider')">
            Slide 滑动
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('imageviewer')">
            ImageViewer 图片预览
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="首页所需基础组件" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('title')">
            标题-h3-title组件
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('cardNew')">
            卡片-card组件
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('buttonGroup')">
            简易按钮组组件
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('toolTip')">
            气泡框组件
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('qrcode')">
            二维码组件
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('signaturePad')">
            手写板组件
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="子表部分组件" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('viewChildrenForm')">
            子表查看状态页面
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('editChildrenForm')">
            子表编辑状态页面
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('childrenFormtab')">
            子表编辑状态左侧tab栏页面
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="业务demo" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('testDataList')">
            业务demo
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
    </h3-accordion>
  </div>
</template>

<script>

import h3List from '../components/h3-list/h3-list';
import h3ListItem from '../components/h3-list/h3-list-item';
import H3Accordion from '../components/h3-accordion/h3-accordion';
import H3AccordionItem from '../components/h3-accordion/h3-accordion-item';

export default {
  name: 'HelloWorld',
  components: {
    H3Accordion,
    H3AccordionItem,
    h3List,
    h3ListItem,
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    jump(type) {
      this.$router.push({
        name: type,
      });
    },
  },
  computed: {
    wrapClass() {
      return 'h3-test2';
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.index-demos-wrapper {
  .h3-list-item .h3-list-line {
    padding-right: 0;
  }
}
</style>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} 
.item {
  height: 40px;
  line-height: 40px;
  text-align: left;
}

*:focus {
    outline: none;
}
.accordion-content p {
    padding: 10px 15px 10px 0;
    font-size: 12px;
    line-height: 22px;
    text-align: justify;
  }

.anticon {
  display: inline-block;
  line-height: 1;
  font-style: normal;
  vertical-align: baseline;
  text-align: center;
  text-transform: none;
  line-height: 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
.anticon::before {
  display: inline-block;
  animation: cirle-anim 1s linear infinite;
}
 @keyframes cirle-anim {
    100% {
      transform: rotate(360deg);
      transform-origin: center center;
    }
  }
</style>
