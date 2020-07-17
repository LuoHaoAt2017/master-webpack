<template>
  <div :class="wrapCls">
      <ul class="time-horizontal">
          <li class="past"><b></b></li>
          <li class="now">
              <div class="handler-name">
                  <img v-if="approveInfo.ProfilePhotoUrl" :src="approveInfo.ProfilePhotoUrl" />
                  <template v-else>{{approveInfo.PartcipantName.substr(-2,2)}}</template>
              </div>
          </li>
          <li calss="future"><b></b></li>
      </ul>
      <div class="item-handler" v-if="approveInfo.IsLastNode">{{ `待 `+approveInfo.PartcipantName+` 审批`}}</div>
      <div class="item-handler" v-if="!approveInfo.IsLastNode">{{ `待 `+approveInfo.PartcipantName+` 等审批`}}</div>
      <div class="item-handler-time">{{approveInfo.SpendTime}}</div>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-approve-trace';
export default {
  name: 'h3-approve-trace',
  components: {
  },
  props: {
    className: String,
    h3Style: Object,
    approveInfo: {
      type: Object,
      default() {
        return {
          DisplayName: '采购记录',
          ModifiedTime: '20:34',
          PartcipantName: '张三',
          ProfilePhotoUrl: 'https://cn.vuejs.org/images/bit.png',
          SpendTime: '666',
          IsLastNode: false,
        };
      },
    },
  },
  data() {
    return {
    };
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
    contentCls() {
      return cx('icon-float', `icon-float-${this.iconDirection}`);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.h3-approve-trace {
  .px2rem(padding-top, 74);
  .time-horizontal {
    list-style-type: none;
    border-top: 2px solid #e5f2ff;
    max-width: 800px;
    padding: 0px;
    margin: 0px;
  }

  .time-horizontal li {
    float: left;
    position: relative;
    text-align: center;
    width: 33%;
    padding-top: 10px;
  }
  .time-horizontal li.now div {
    position: absolute;
    left: 25%;
    .px2rem(top, -47);
    .px2rem(width, 94);
    .px2rem(height, 94);
    border-radius: 50%;
    &.handler-name {
      background: #108ee9;
      color: #fff;
      .px2rem(line-height, 94);
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .time-horizontal li b:before {
    content: '';
    position: absolute;
    .px2rem(top, -12);
    left: 47%;
    .px2rem(width, 12);
    .px2rem(height, 12);
    .px2rem(border-width, 4);
    border-style: solid;
    border-color: #d4d4d4;
    border-radius: 50%;
    background: #fff;
  }

  .time-horizontal li.past b:before {
    border-color: #108ee9;
  }

  .item-handler {
    .px2rem(margin-top, 74);
    .px2rem(font-size, 28);
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  .item-handler-time {
    .px2rem(margin-top, 10);
    .px2rem(margin-bottom, 20);
    text-align: center;
    .px2rem(font-size, 20);
    color: #999;
  }
  .item-toggle {
    .px2rem(margin-top, 10);
    text-align: center;
    span {
      color: #d8d8d8;
      margin-left: -10px;
    }
    span.active {
      color: #108ee9;
      margin-left: 0;
    }
  }
  .item-data {
    .item-detail {
      .px2rem(height, 30);
      .px2rem(line-height, 30);
      .px2rem(margin-bottom, 10);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .key {
        color: #999999;
        .px2rem(font-size, 24);
      }
      .value {
        color: #151515;
        .px2rem(font-size, 24);
      }
    }
  }
}
</style>