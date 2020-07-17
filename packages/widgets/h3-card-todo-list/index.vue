<template>
  <div class="h3-card-to-dos-wrapper">
    <card-body :hasContent="true" class="h3-card-to-do-list-wrapper"> 
      <div class="h3-card-to-do-list" @click="toggleSelected">
        <div class="h3-card-to-do-list-avatar" :class="{'h3-card-to-do-list-avatar-cancellation':request&&requestResult=='cancellation'}">
          <!-- <img src="../../../src/assets/img/handler.png" alt="" class="h3-card-to-do-list-avatar-img"> -->
          <img v-if="photo"  :src="photo" alt="" class="h3-card-to-do-list-avatar-img">
          <div v-else class="handler-name">{{name.substr(-2,2)}}</div>
        </div>
        <div class="h3-card-to-do-list-mian-content">
          <div class="h3-card-to-do-list-mian-content-left">
            <div class="h3-card-to-do-list-title"> 
              <div style="float:left;margin-top:6px;"><div class="h3-card-to-do-list-cc2me" v-show="chaosong && chaosongState!='all'"></div> </div>
              <div class="h3-card-to-do-list-title-request-wrapper">
                <div class="h3-card-to-do-list-title-request-word" :class="{'h3-card-to-do-list-request-limited-width': request, 'h3-card-to-do-list-request-cancellation':request&&requestResult=='cancellation','h3-card-to-do-list-chaosong-limited-width': chaosong && chaosongState!='all','h3-card-to-do-list-chaosong-limited-width-isEditing':chaosong && chaosongState!='all'&&isEditing}">{{title}}</div> 
                <h3-status-tip :type="requestResult" v-show="request"></h3-status-tip>
              </div>
            </div>
            <p class="h3-card-to-do-list-dataTitle" :class="{'h3-card-to-do-list-request-cancellation':request&&requestResult=='cancellation'}"  v-html="getDataTitleName(dataTitle)"></p>
            <div class="h3-card-to-do-list-progress" v-if="requestResult=='approving'|| !request ">
              <div class="h3-card-to-do-list-progress-left">
                {{progress}}<span v-show="request">: {{currentParticipant}}</span>
                <div class="h3-card-to-do-list-deadline" v-show="request">
                  <span>已等待</span>
                  <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay >= 365">已超过365天</span>
                  <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay >= 1">{{waitedDay}}天</span>
                  <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay <= 0 && waitedHour >= 0">{{waitedHour}}小时</span>
                  <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay <= 0 && waitedHour<0">{{waitedMinute}}分</span>
                </div>
              </div>
              <div class="h3-card-to-do-list-deadline" v-show="(request || handle) && allowedTime">
                距截止时间 
                <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay >= 365">已超过365天</span>
                <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay >= 1">{{waitedDay}}天</span>
                <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay <= 0 && waitedHour >= 0">{{waitedHour}}小时</span>
                <span class="h3-card-to-do-list-deadline-num" v-show="waitedDay <= 0 && waitedHour<0">{{waitedMinute}}分</span>
              </div>
            </div>
            <p class="h3-card-to-do-list-arriveTime" v-show="!request && toDo">到达时间：{{arriveTime}}</p>
            <p class="h3-card-to-do-list-arriveTime" v-show="approve && !toDo">审批时间：{{finishTime}}</p>
            <p class="h3-card-to-do-list-arriveTime" v-show="handle && !toDo">完成时间：{{finishTime}}</p>
            <p class="h3-card-to-do-list-arriveTime" v-show="request">
              <span v-if="requestResult=='draft'" >草稿保存时间: {{requestResultTime}}</span>
              <span v-if="requestResult=='approving'">创建时间: {{requestResultTime}}</span>
              <span v-if="requestResult=='executed'">生效时间: {{requestResultTime}}</span>
              <span v-if="requestResult=='cancellation'" :class="{'h3-card-to-do-list-request-cancellation':request&&requestResult=='cancellation'}" >生效时间: {{requestResultTime}}</span>
            </p>
            <div class="h3-card-to-do-list-reviewResult">  
              <img src="../../../src/assets/img/tongyi.png" alt="" class="h3-card-to-do-list-reviewResultImg" v-show="reviewResult=='approved'">
              <img src="../../../src/assets/img/butongyi.png" alt="" class="h3-card-to-do-list-reviewResultImg" v-show="reviewResult=='disapproved'">
              <img src="../../../src/assets/img/beichuiban.png" alt="" class="h3-card-to-do-list-reviewResultImg" v-show="reviewResult=='urged'">
            </div>
            <div class="h3-card-to-do-list-request-urge-button" v-show="request && requestResult=='approving'" @click.stop="onClickUrgeButton">
              催办
            </div>
          </div>
          <transition name="circle-show">
            <div class="h3-card-to-do-list-cc2me-edit-circle"  v-show="isEditing">
              <div class="h3-card-to-do-list-cc2me-circle" :class="selected ? 'h3-card-to-do-list-cc2me-circle-selected' : ''">
                <i class="icon aufont icon-base-circle-o" v-if="!selected"></i>
                <h3-icon type="check" style="color:#fff" v-if="selected"></h3-icon>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </card-body>
  </div>
</template>
<script>
import H3Icon from '../../components/h3-icon/index.vue';
import cardBody from './h3-card-body.vue';
import touch from '../../directives/touch';
import H3StatusTip from '../h3-tool-tip/h3-status-tip.vue';
import H3Button from '../../components/h3-button/index.vue';

export default {
  name: 'h3-card-to-do-list',
  components: {
    cardBody,
    H3Icon,
    H3StatusTip,
    H3Button,
  },
  directives: {
    touch,
  },
  props: {
    photo: {
      type: String,
    },
    name: String,
    title: String,
    dataTitle: String,
    progress: String,
    currentParticipant: String,
    waitedDay: [String, Number],
    waitedHour: [String, Number],
    waitedMinute: [String, Number],
    arriveTime: String,
    allowedTime: String,
    finishTime: String,
    deadlineDay: [String, Number],
    deadlineHour: Number,
    deadlineMinute: Number,
    reviewResult: String,
    highLightText: String,
    handle: {
      type: Boolean,
      default: false,
    },
    approve: {
      type: Boolean,
      default: false,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    objectId: {
      type: String,
      required: true,
    },
    chaosong: {
      type: Boolean,
      default: false,
    },
    chaosongState: {
      type: String,
    },
    request: {
      type: Boolean,
      default: false,
    },
    requestResult: {
      type: String,
    },
    requestResultTime: {
      type: String,
    },
    toDo: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    toggleSelected() {
      if (this.chaosong && this.isEditing) {
        this.$emit('toggleSelected', this.objectId);
      } else {
        this.$emit('openSheet');
      }
    },
    getDataTitleName (dataTitle) {
      if (dataTitle) {
        return dataTitle.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
      }
      return dataTitle;
    },
    onClickUrgeButton () {
      this.$emit('urge');
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/h3-ui/h3-card';
@prefixCls: h3-card-to-do-list;

.h3-card-to-dos-wrapper{
  box-shadow: 0 0 0 0 transparent !important;
  background: #fff;
  position: relative;
  &:first-of-type{
    .backgroundline('top', #e4e4e4);
  }
  &:not(:first-of-type) {
    .backgroundline('top', #eeeeee);
  }
}
.handler-name {
  background: #38adff;
  color: #fff;
  .px2rem(line-height, 80);
  .px2rem(width, 80);
  .px2rem(height, 80);
  border-radius: 50%;
  text-align: center;
}

.@{prefixCls}{
  position: relative;
}
.@{prefixCls}-wrapper{
  padding: 0.4rem !important;
  height: auto;
  box-sizing: border-box;
  &-cancellation{
    color: #ccc;
  }
}
.@{prefixCls}-avatar{
  position: absolute;
  left: 0;
  top: 0;
  .px2rem(width, 80);
  .px2rem(height, 80);
  border-radius:100%;
  // background: hotpink;
  .@{prefixCls}-avatar-img{
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
.@{prefixCls}-avatar-cancellation{
  opacity: 0.2;
}

.@{prefixCls}-mian-content{
  position: relative;
  height: 100%;
  .px2rem(margin-left, 110);
  display: flex;
  justify-content: flex-start;
  text-align: left;
  overflow: hidden;
  .@{prefixCls}-title{
    .px2rem(height, 45);
    .@{prefixCls}-cc2me{
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #1890FF;
    }
    &-short{
      .px2rem(width, 484);
      .h5{
        .px2rem(width, 484);
        color: #333333;
      }
    }
    &-request-wrapper{
      display: flex;
      align-items: center;
    }
    &-request-word{
      font-family: PingFang-SC-Medium;
      .px2rem(font-size, 32);
      .px2rem(line-height, 45);
      color: #333333;
      letter-spacing: 0;
      .px2rem(height, 45);
      .px2rem(max-width, 580);
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      .px2rem(padding-right, 16);
    }
    .@{prefixCls}-chaosong-limited-width{
      .px2rem(width, 548);
      .px2rem(max-width, 548);
      .px2rem(margin-left, 12);
    }
    .@{prefixCls}-chaosong-limited-width-isEditing{
      .px2rem(width, 474);
      .px2rem(max-width, 474);
    }
    .@{prefixCls}-request-limited-width{
      // .px2rem(max-width, 484);
      .px2rem(max-width, 484);
    }
    .@{prefixCls}-cc2me-title{
      .px2rem(width, 548);
    }
    .@{prefixCls}-cc2me-edit-title{
      .px2rem(width, 474);
    }
  }
  .@{prefixCls}-request-cancellation{
    color: #ccc !important;
  }
  .@{prefixCls}-dataTitle{
    .px2rem(margin-top, 16);
    .px2rem(font-size, 26);
    .px2rem(line-height, 34);
    color: #999999;
    letter-spacing: 0;
    .px2rem(line-height, 34);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .@{prefixCls}-progress{
    .px2rem(margin-top, 8);
    .px2rem(line-height, 34);
    .px2rem(height, 34);
    color: #F58522;
    letter-spacing: 0;
    display: flex;
    align-items: center;
    .@{prefixCls}-progress-left{
      .px2rem(font-size, 26);
      .px2rem(line-height, 34);
      display: inline-block;
    }
    .@{prefixCls}-deadline{
      display: inline-block;
      .px2rem(font-size, 24);
      .px2rem(line-height, 33);
      color: #9BAABD;
      letter-spacing: 0;
      margin-left: 0.4rem;
    }
    .@{prefixCls}-deadline-num{
      color: #F5222D;
      .px2rem(font-size, 24);
      .px2rem(line-height, 33);
    }

  }
  .@{prefixCls}-arriveTime{
    .px2rem(margin-top, 8);
    .px2rem(font-size, 24);
    .px2rem(line-height, 34);
    color: #999999;
    letter-spacing: 0;
    span{
      .px2rem(font-size, 24);
      .px2rem(line-height, 34);
      color: #999999;
      letter-spacing: 0;
    }
  }
  .@{prefixCls}-reviewResult{
    position: absolute;
    bottom: 0;
    right: 0;
    .px2rem(width, 113);
    .px2rem(height, 91);
    .@{prefixCls}-reviewResultImg{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .@{prefixCls}-cc2me-edit-circle{
    position: absolute;
    right: 0;
    top: 50%;
    .px2rem(width, 44);
    .px2rem(height, 44);
    transform: translateY(-50%);
    .@{prefixCls}-cc2me-circle{
      .px2rem(width, 44);
      .px2rem(height, 44);
      border: 2px solid transparent;
      box-sizing: border-box;
      border-radius: 100%;
    }
    .icon-base-circle-o{
      .px2rem(font-size, 44);
      position: absolute;
      top: 0;
      left: 0;
      color: #ccc;
    }
    .@{prefixCls}-cc2me-circle-selected{
      background: #1890FF;
      border: 2px solid transparent;
    }
  }

  .@{prefixCls}-cc2me-circel-hidden{
    .px2rem(width, 44);
    height: 100%;
    position: absolute;
    .px2rem(right, -74);
    top: 0;
    display: flex;
    align-items: center;
    .@{prefixCls}-cc2me-circle{
      .px2rem(width, 44);
      .px2rem(height, 44);
      border: 2px solid #CCCCCC;
      box-sizing: border-box;
      border-radius: 100%;
    }
  }
}
.@{prefixCls}-request-urge-button{
  .px2rem(width, 200);
  .px2rem(height, 96);
  .px2rem(line-height, 96);
  .px2rem(font-size, 52);
  background:#fff;
  color:#1890ff;
  position:absolute !important;
  .px2rem(right, -100);
  .px2rem(bottom, -48);
  // right: -50px;
  // bottom: -24px;
  display: inline-block;
  text-align: center;
  border: 1px solid #1890ff;
  border-radius: 6px;
  transform-origin: 0 0; 
  transform: scale(.5,.5);
}
// .@{prefixCls}-request-urge-button::before{
//   z-index: -1;
//   content:'';
//   display: block;
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 200%;
//   height: 200%;
//   background: #1890ff;
//   transform-origin: 0 0; 
//   transform: scale(.5,.5);
//   border: 1px solid #1890ff;
//   border-radius: 10px;
// }
.@{prefixCls}-copy-selected{
  background: #e6f7ff;
}

.h3-card-grid-highlight {
  color:#1890FF;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.circle-show-enter-active {
  transition: all .2s ease;
}
.circle-show-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.circle-show-enter, .circle-show-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(44px);
  opacity: 0;
}

</style>


