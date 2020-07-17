<template>
    <div class="form-title" :class="[formVal.isDescription?'form-describe':'',!rotateBol?'title-reverse':'']">
        <div class="content" :class="{'bd-bot':!isQuestionShowBol}" @click='fold' v-if='!formVal.isDescription'>
            <strong class='check dp-font40' v-html='formVal.displayname'>{{formVal.displayname}}<i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i></strong>
            <span class="icon-next2" :class="[rotateBol?'arrow-animate':'arrow-reverse-animate']"></span>
        </div>
        <div class="content" :class="{'bd-bot':!isQuestionShowBol}" v-if='formVal.isDescription'>
            <strong class='check dp-font30 des-content' ref="description" v-html='formVal.displayname' @click="clickContent">{{formVal.displayname}}<i v-if='formVal.description' class="icon-tip"></i></strong>
        </div>
        <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
    </div>
</template>
<script>
import { openLink } from '../../../config/dingtalk-interface';

export default {
  name: 'FormTitle',
  // 从父组件传递过来的数据
  props: ['formVal'],
  data() {
    return {
      rotateBol: true,
      isQuestionShowBol: false,
      scrollTop: '',
      windowHeight: '',
    };
  },
  mounted() {
    if (this.formVal.isDescription) {
      let $a = $(this.$refs.description).find('a');
      for (let ele of $a) {
        let href = $(ele).attr('href');
        href && $(ele).attr('data-href', href);
        $(ele).attr('href', 'javascript:void(0);');
      }
    }
  },
  methods: {
    fold() {
      this.windowHeight = $(window).height();
      this.scrollTop = '';
      this.rotateBol = !this.rotateBol;
      const $siblings = $(this.$el).nextAll();
      for (let i = 0; i < $siblings.length; i += 1) {
        const dom = $siblings[i];
        if (
          $(dom)
            .eq(0)
            .hasClass('form-title')
        ) {
          return;
        }
        if (!this.rotateBol) {
          // 判斷之前是否是隱藏的,如果是添加屬性，如果不是，清除添加的屬性
          if ($(dom).is(':hidden')) {
            $(dom).attr('data-change', true);
          } else {
            $(dom).removeAttr('data-change');
          }
          if ($(dom)[0].className.indexOf('stamp-pic') < 0) {
            $(dom).hide();
          }
        } else {
          if ($(dom).attr('data-change')) {
            continue;
          }
          $(dom).show();
        }
      }
      if (this.rotateBol) {
        const ele = document.getElementById('vux_view_box_body');
        this.scrollTop = ele.scrollTop;
        const selfTop = $(this.$el).offset().top;
        if (this.windowHeight - selfTop < 300) {
          ele.scrollTop = this.scrollTop + 196;
        }
      }
    },
    clickContent (e) {
      if (e.target.tagName === 'A') {
        let href = $(e.target).attr('data-href');
        let url = href ? href : e.target.innerText;
        url = /^\/\//.test(url) ? `http:${url}` : url;
        url = /^www./.test(url) ? `http://${url}` : url;
        openLink(url, '无效的网址或URL链接');
      }
    }
  },
};
</script>
<style lang="less">
@import '../../../assets/css/form-base.less';
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
    strong {
      font-weight: bold;
      color: @font-color0;
      text-align: left;
      display: block;
      max-width: 90%;
      // font-weight:bold;
    }
    .icon-next2 {
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
