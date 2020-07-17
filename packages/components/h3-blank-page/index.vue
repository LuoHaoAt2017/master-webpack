<template>
  <div :class="wrapCls">
    <div :class="tipCls">
      <!-- <span :style="imageStyle" style="height: 300px;display: block;margin-left: auto;margin-right: auto;"></span> -->
      <img :src="imageUrl" v-if="imageUrl" alt="">
      <img src="../../assets/img/search-blank.png" v-if="!imageUrl && type === 'search'" alt="">
      <img src="../../assets/img/list-blank.png" v-if="!imageUrl && type === 'list'" alt="">
      <img src="../../assets/img/filternodata.png" v-if="!imageUrl && type === 'filter'" alt="">
      <span :class="tipTextCls" v-html="tipText"></span>
      <h3-button type="ghost" style="margin-right: auto;margin-left:auto;" class="h3-button-borderfix" v-if="showButton" :onClick="buttonClick">{{buttonText}}</h3-button>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';
import h3Button from '../h3-button/index';

export default {
  name: 'h3-black-page',
  components: {
    h3Button,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'h3-blank-page',
    },
    className: String,
    imageUrl: {
      type: String, // 图片链接
      // default: '/static/img/blankpage.38e560d.png',
    },
    tipText: {
      type: String, // 提示语
      default: '暂无任何应用,前往氚云模板中心获取精品应用',
    },
    showButton: Boolean, // 是否显示按钮
    buttonText: {
      type: String, // 按钮显示文字
      default: '',
    },
    type: {
      type: String,
      default: 'list',
      validator: val => ['list', 'search', 'filter'].indexOf(val) > -1,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    buttonClick() {
      this.$emit('buttonClick'); // 按钮事件
    },
  },
  computed: {
    wrapCls() {
      return cx(this.prefixCls, this.className);
    },
    tipCls() {
      return `${this.prefixCls}-tips`;
    },
    tipTextCls() {
      return `${this.prefixCls}-text`;
    },
    imageStyle() {
      if (this.imageUrl) {
        const url = '';
        return {
          background: `url(${url}) no-repeat center center`,
        };
      }
      return {};
    },
  },
  watch: {
  },
};
</script>
<style lang="less">

@blankpagePrefixCls: h3-blank-page;
@tip-text-color: #999999;

.@{blankpagePrefixCls} {
  position: fixed;
  top:0;
  bottom: 0;
  height: 100%;
  width:100%;
  background-color: #F8F8F8;
  .@{blankpagePrefixCls}-search {
    position: relative;
    top: 44px;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    font-size: 13px;
    color: #999999;
  }
  .@{blankpagePrefixCls}-tips {
    text-align: center;
    position: fixed;
    width: 100%;
    top: 40%;
    transform: translateY(-50%);
    img{
      width: 132px;
      height: 132px;
    }
  }
  .@{blankpagePrefixCls}-text {
    color:@tip-text-color;
    font-size: 15px;
    padding: 12px 15px;
    display:block;
  }
  .h3-button-borderfix {
    width: 120px;
    white-space: nowrap;
  }
  .h3-button-ghost {
    color: #1890FF;
    &::before {
      border: 1PX solid #1890FF;
    }
  }
}
</style>


