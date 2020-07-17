<template>
  <div>
    <div :class="wrapCls" v-for="(item, index) in toDos" :key="index" @click="goFlows(item)">
      <card-body :className="bodyClassName" :h3Style="bodyStyle" :hasContent="true"  > 
        <div class="h3-card-to-do-leftborder" :class="leftBorderStyle(item)"></div>
        <div class="h3-card-to-do-wrapper" >
          <p class="h3-card-to-do-word">
            <span class="process-title" v-if="item.state=='抄送'">{{item.state}}我的 </span>
            <span class="process-title" v-else>我{{item.state}}的 </span>
            <span class="numWrapper">
              <span class="num">{{item.num}}</span> 
              <span v-if="item.state=='审批'" class="process">待审批</span>
              <span v-if="item.state=='经办'" class="process">待办理</span>
              <span v-if="item.state=='申请'" class="process">进行中</span>
              <span v-if="item.state=='抄送'" class="process">未查阅</span>
            </span>
          </p>
          <div class="h3-card-to-do-imgwrapper">
            <img src="../../../src/assets/img/sp.png" alt="" class="h3-card-to-do-img" v-if="item.state=='审批'">
            <img src="../../../src/assets/img/jb.png" alt="" class="h3-card-to-do-img" v-if="item.state=='经办'">
            <img src="../../../src/assets/img/sqq.png" alt="" class="h3-card-to-do-img" v-if="item.state=='申请'">
            <img src="../../../src/assets/img/chuanyue.png" alt="" class="h3-card-to-do-img" v-if="item.state=='抄送'">
          </div>
        </div>
      </card-body>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';
import cardHeader from './h3-card-header.vue';
import cardBody from './h3-card-body.vue';
import cardFooter from './h3-card-footer.vue';

const prefixCls = 'h3-card-to-do';
export default {
  name: 'h3-card-to-do',
  components: {
    cardBody,
    cardFooter,
    cardHeader,
  },
  props: {
    isDemo: {
      type: Boolean,
      default: false,
    },
    full: Boolean,
    className: {
      type: String,
      default: 'cmheight',
    },
    thumbStyle: Object,
    bodyClassName: String,
    toDos: {
      type: Array,
      default: () => [{
        state: '审批',
        num: 1,
        item: '待审批',
        title: '我审批的',
        routeUrl: 'processApproval',
        workItemType: 2,
      },
      {
        state: '经办',
        num: 3,
        item: '待办理',
        title: '我经办的',
        workItemType: 0,
        routeUrl: 'processHandle',
      },
      {
        state: '申请',
        num: 0,
        item: '进行中',
        title: '我发起的',
        workItemType: -1,
        routeUrl: 'processRequest',
      },
      {
        state: '抄送',
        num: 99,
        item: '未读的',
        title: '抄送我的',
        workItemType: 3,
        routeUrl: 'processCopy',
      }],
    },
  },
  data() {
    return {
      bodyStyle: {
        padding: 0,
        height: '2rem',
        paddingLeft: '0.4rem',
        boxShadow: '0 2px 11px 0 rgba(90,121,143,0.20)',
        borderRadius: '6px',
        minHeight: '2rem',
      },
    };
  },
  methods: {
    leftBorderStyle(item) {
      if (item.state === '审批') {
        return 'leftBorderKind-1';
      } else if (item.state === '经办') {
        return 'leftBorderKind-2';
      } else if (item.state === '申请') {
        return 'leftBorderKind-3';
      } else if (item.state === '抄送') {
        return 'leftBorderKind-4';
      }
      return '';
    },
    goFlows(item) {
      this.$emit('goFlows', item);
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, this.className, {
        [`${prefixCls}-line`]: this.hasLine,
        [`${prefixCls}-full`]: this.full,
      });
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-card';

.todocard{
  .px2rem(margin-top, 28);
  &:first-child{
    margin-top: 0 !important;
  }
}

@prefixCls: h3-card-to-do;
.@{prefixCls}-leftborder{
  position: absolute;
  left: 0;
  .px2rem(width, 8);
  height: 100%;
  .px2rem(border-top-left-radius, 8);
  .px2rem(border-bottom-left-radius, 8);
}
.@{prefixCls}-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  .@{prefixCls}-word{
    span{
      .px2rem(font-size, 34);
      .px2rem(line-height, 48);
    }
    .process-title{
      font-weight: 500;
      color: #333;
    }
    span.numWrapper{
      .px2rem(margin-left, 38);
      .px2rem(font-size, 20);
      .num{
        .px2rem(font-size, 50);
        color:#1890FF;
        position:relative;
        top: 2px;
      }
    }
    span.process{
      .px2rem(font-size, 20);
      .px2rem(line-height, 28);
      color: #666;
    }

  }
  .@{prefixCls}-imgwrapper{
    .px2rem(width,141);
    .px2rem(height,141);
    .@{prefixCls}-img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

.cmheight{
  min-height: 1rem !important;
  padding-bottom: 0;
  margin-bottom: 0.32rem !important;
  background: #fff;
}

.leftBorderKind-1{
  background: #FE6750;
}
.leftBorderKind-2{
  background: #FDAA3F;
}
.leftBorderKind-3{
  background: #40A9FF;
}
.leftBorderKind-4{
  background: #74D03D;
}

.item-flag {
  position: absolute;
  top: 0;
  // .px2rem(top, -52);
  right: 0;
  .px2rem(height, 86);
  .px2rem(width, 86);
  img {
    width: 100%;
    height: 100%;
    .px2rem(border-top-right-radius, 6);
  }
}
.backdrop {
  position: absolute;
  z-index: 11;
  top: -1px;
  width: 100%;
  .px2rem(height,350);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  opacity: 0.8;
}
</style>


