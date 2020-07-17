<template>
  <div :class="wrapCls">
    <div :class="tipCls">
      <!-- <span :style="imageStyle" style="height: 300px;display: block;margin-left: auto;margin-right: auto;"></span> -->
      <img :src="imageUrl" :class="imgCls" alt="" v-if="imageUrl" :style="{width:imgWidth+'px',height:imgHeight+'px'}">
      <span :class="tipTextCls" v-html="tipText"></span>
      <h3-button type="ghost" activeClassName="h3-button" style="margin-right: auto;margin-left:auto;margin-top:5px;" class="h3-button-borderfix" v-if="showButton" :onClick="buttonClick">{{buttonText}}</h3-button>
    </div>

  </div>
</template>
<script>
import cx from 'classnames';
import h3Button from '../../components/h3-button/index';

export default {
  name: 'h3-blank-page',
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
      default: require('../../assets/img/blankpage.png'),
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
    imgWidth: {
      type: [String, Number],
      default: 135,
    },
    imgHeight: {
      type: [String, Number],
      default: 135,
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
    imgCls() {
      return `${this.prefixCls}-img`;
    },
  },
  watch: {
  },
};
</script>

<style lang="less">
@import '../../styles/mixins.less';

@blankpagePrefixCls: h3-blank-page;
@searchBlankpagePrefixCls: h3-search-blank-page;
@tip-text-color: #999999;

.@{blankpagePrefixCls} {
  position: absolute;
  top:0;
  bottom:0;
  height: 100%;
  width:100%;
  //background-color: #ccc;
  .@{blankpagePrefixCls}-tips {
    text-align: center;
    position: relative;
    left: 50%;
    transform: translate(-50%, 50%);
  }
  .@{blankpagePrefixCls}-text {
    color:@tip-text-color;
    .px2rem(font-size,28);
    .px2rem(padding,28);
    // font-size:14px;
    // padding:14px;
    display:block;
  }
  .@{blankpagePrefixCls}-img {
    .px2rem(width,269);
    .px2rem(height,269);
    //.px2rem('height',28);
    // width:156px;
    //height:166px;
  }
  .h3-button-borderfix {
    .px2rem(width,329);
    white-space: nowrap;
  }
  .h3-button-ghost {
    color: #1890FF;
    &::before {
      border: 1PX solid #1890FF;
      background-color: transparent !important;
    }
  }
}

.@{searchBlankpagePrefixCls} {
  position: absolute;
  top:0;
  bottom:0;
  height: 100%;
  width:100%;
  .@{searchBlankpagePrefixCls}-tips {
    text-align: center;
    position: relative;
    .px2rem(top,100);
    .px2rem(padding-left,60);
    .px2rem(padding-right,60);
  }
  .@{searchBlankpagePrefixCls}-text {
    color:@tip-text-color;
    .px2rem(font-size,26);
    .px2rem(font-size,28);
    display:block;
  }
}
</style>


