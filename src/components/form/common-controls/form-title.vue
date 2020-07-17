<template>
  <div v-show="options.visible" class="form-title" :class="[options.isDescription ? 'form-describe' : '',!options.expaneded ? 'title-reverse' : '']">
    <div v-if="options.isDescription" class="content">
      <strong class="dp-font30 des-content" v-html="options.displayname" @click="clickContent">{{ options.displayname }}<i v-if="options.description" class="icon-tip h3yun_All exclamation-circle-o" @click="hideQuestion"></i></strong>
    </div>
    <div v-else class="content" @click="collapse">
      <strong class="dp-font40" :style="{textAlign: options.alignment}" v-html="options.displayname">{{ options.displayname }}<i v-if="options.description" class="icon-tip h3yun_All exclamation-circle-o" @click="hideQuestion"></i></strong>
      <span class="h3yun_All right-o" :class="[options.expanded ? 'arrow-animate' : 'arrow-reverse-animate']"></span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { openLink } from '../../../config/dingtalk-interface';
import { isDingtalk } from '@/config/common';

@Component
export default class FormTitle extends Vue {
  @Prop()
  dataField!: string;

  scrollTop: string = '';

  windowHeight: string = '';

  mounted () {
    if (this.options.isDescription) {
      const Doma = Array.from(this.$el.getElementsByTagName('a'));
      for (const ele of Doma) {
        const href = ele.getAttribute('href');
        href && ele.setAttribute('data-href', href);
        ele.setAttribute('href', 'javascript:void(0);');
      }
    }
  }

  clickContent (e) {
    if (e.target.tagName === 'A') {
      const href = e.target.getAttribute('data-href');
      let url = href || e.target.innerText;
      url = /^\/\//.test(url) ? `http:${url}` : url;
      url = /^www./.test(url) ? `http://${url}` : url;
      if (isDingtalk) {
        openLink(url, '无效的网址或URL链接');
      } else {
        window.open(url, '_blank');
      }
    }
  }

  collapse () {
    this.options.expanded = !this.options.expanded;
  }

  get options () {
    return (this.$parent as any).form[this.dataField];
  }
}
</script>
<style lang="less">
@import '~@/styles/form-base.less';
.form-title {
  position: relative;
  background-color: white;
  .content {
    // margin-left:.24rem;
    .px2rem(margin-left,24);
    // padding: .4rem 0 .32rem 0;
    .px2rem(padding-top,40);
    .px2rem(padding-bottom,40);
    // border-bottom: 1px solid #EBEBEB;
    word-break: break-all;
    strong {
      font-weight: bold;
      color: @font-color0;
      text-align: left;
      display: block;
      max-width: 90%;
      // font-weight:bold;
    }
    .h3yun_All,.right-o {
      position: absolute;
      // right: .24rem;
      .px2rem(right,24);
      top: 50%;
      color: @font-color9;
      transition: all 0.5s;
      -moz-transition: all 0.5s; /* Firefox 4 */
      -webkit-transition: all 0.5s; /* Safari 和 Chrome */
      -o-transition: all 0.5s; /* Opera */
    }
    .arrow-animate {
      transform-origin: center;
      transform: translateY(-50%) rotate(90deg);
    }

    .arrow-reverse-animate {
      transform-origin: center;
      transform: translateY(-50%) rotate(-90deg);
    }
    .icon-tip {
      .px2rem(padding-left, 20);
      .px2rem(padding-right, 20);
      vertical-align: text-bottom;
    }
    .des-content {
      .px2rem(padding-right,24);
      max-width: 100%;
    }
  }
  .question-wrap {
    color: @font-color6;
    background-color: #f5f5f5;
    padding: 2px 12px 4px;
    position: relative;
    word-wrap: break-word;
    &:before {
      content: ' ';
      border-bottom: 7px solid #f5f5f5;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      position: absolute;
      left: 28px;
      top: -7px;
    }
    &:after {
      content: ' ';
      border-bottom: 5px solid #f5f5f5;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      position: absolute;
      left: 30px;
      top: -5px;
    }
  }
}
</style>
