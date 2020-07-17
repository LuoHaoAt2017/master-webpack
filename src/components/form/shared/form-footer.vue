<template>
  <div v-if="buttons.length && isShowTab" class="bd-top form-footer">
    <a
      v-for="item in shownButtons"
      :key="item.Text"
      href="Javascript:;"
      class="dp-font32 bd-top"
      @click="buttonClicked(item)"
    ><span :class="item.Icon"></span>{{ item.Text }}</a>
    <a
      v-if="hiddenButtons.length > 0"
      href="Javascript:;"
      class="dp-font32 bd-top"
      @click="showMoreActions"
    ><span class="h3yun_All ellipsis-o"></span>更多</a>
    <transition
      :duration="100"
      enterActiveClass="animated slideInUp"
      leaveActiveClass="animated slideOutDown"
    >
      <div v-show="isPopUp" class="popupBtn" @click="popDown">
        <div class="popup-btn-sheet">
          <div class="popup-btn-ctn">
            <a
              v-for="item in hiddenButtons"
              :key="item.Text"
              href="Javascript:;"
              class="dp-font32"
              @click="buttonClicked(item)"
            ><span :class="item.Icon"></span>{{ item.Text }}</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Emit, Watch,
} from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import jQuery from 'jquery';

const FormVM = namespace('Form/ViewModel');

@Component
export default class FormFooter extends Vue {
  @Prop()
  buttons!: any[];

  @Prop()
  islight!: boolean;

  @Prop()
  popup!: boolean;

  isPopUp: boolean = false;

  allButtons: any[] = [];

  // 控制底部菜单显示隐藏
  isShowTab: boolean = true;

  created () {
    // 接受评论数量变化
    this.$root.eventHub.$on('sns-updated', (count) => {
      for (const item of this.buttons) {
        if (item.Action === 'LinkToSns') {
          item.Text = count > 99 ? '评论(99+)' : `评论(${count})`;
        }
      }
    });
  }

  mounted () {

    // let w = jQuery(window);
    // let h = w.height();

    // w.resize( () => {
    //   if( w.height() < h ){
    //       this.isShowTab = false;
    //   }
    //   if( w.height() >= h ){
    //       this.isShowTab = true;
    //   }

    // } )

  }

  transferButtons (buttons) {
    return buttons.map((button) => {
      let icon = '';
      switch (button.Action) {
        case 'Submit':
          icon = 'h3yun_All check';
          break;
        case 'Save':
          icon = 'h3yun_All save-o';
          break;
        case 'Reject':
          icon = 'h3yun_All close';
          break;
        case 'Forward':
          icon = 'h3yun_All transmit-o';
          break;
        case 'QrCode':
          icon = 'h3yun_All scan-o';
          break;
        case 'ExternalShare':
          icon = 'h3yun_All share-o';
          break;
        case 'Remove':
          icon = 'h3yun_All delete-o';
          break;
        case 'LinkToSns':
          icon = 'h3yun_All conversation-o';
          break;
        case 'CancelInstance':
          icon = 'h3yun_All exception-o';
          break;
        case 'RetrieveInstance':
          icon = 'h3yun_All rollback-o';
          break;
        case 'Edit':
          icon = 'h3yun_All edit-o';
          break;
        case 'Read':
          icon = 'h3yun_All check';
          break;
        default:
          break;
      }
      button.Icon = icon;
      return button;
    });
  }

  @Watch('popup')
  popupChange (val) {
    this.isPopUp = val;
  }

  @Watch('buttons')
  buttonsChange () {
    // 轻应用暂时去掉二维码
    const buttons = this.buttons;
    if (this.islight) {
      const index = buttons.findIndex(item => { return item.Action === 'QrCode'; });
      if (index > 0) buttons.splice(index, 1);
    }
    this.allButtons = this.transferButtons(buttons);
  }

  // 按钮过多隐藏成弹出框的弹回
  // 这个方法是干什么用的
  popDown (e) {
    if (e.target.className === 'popupBtn') {
      this.isPopUp = false;
    }
  }

  // 点击更多按钮，弹出弹窗
  showMoreActions () {
    this.isPopUp = !this.isPopUp;
  }

  @Emit('onClickButton')
  buttonClicked (item) {
    this.isPopUp = false;
    return item;
  }

  get shownButtons () {
    if (this.allButtons.length > 3) {
      return this.allButtons.slice(0, 2);
    }
    return this.allButtons;
  }

  get hiddenButtons () {
    if (this.allButtons.length > 3) {
      return this.allButtons.slice(2, this.allButtons.length);
    }
    return [];
  }
}
</script>
<style lang="less">
@import "../../../../packages/styles/mixins";
@import "~@/styles/form-base.less";
  .form-footer {
    position: absolute; //fixed;
    bottom: 0;
    width: 100%; // height: .98rem;
    .px2rem(height, 98);
    background-color: white;
    display: flex;
    justify-content: space-around;
    left: 0; // border-top:1px solid #D9D9D9;
    // box-shadow: inset 0 1px 0 0 #D9D9D9;
    z-index: 101;
    a {
      border: none; // background-color: white;
      color: @font-color-blue;
      flex-grow: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    a:after {
      content: ""; // top: .34rem;
      .px2rem(top, 34);
      bottom: 0;
      position: absolute;
      width: 1px; // height: .3rem;
      .px2rem(height, 30);
      background-color: #d9d9d9;
      right: 0;
    }
    a:last-of-type:after {
      width: 0;
    }
    .popupBtn {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0); // z-index: 99999;
      text-align: center; // transition: opacity .5s;
      z-index: 104;
      .popup-btn-sheet {
        position: absolute;
        .px2rem(min-width, 192);
        .px2rem(right, 24);
        .px2rem(max-width, 310);
        .px2rem(bottom, 124);
        border: 1px solid #d9d9d9;
        background-color: white;
        .px2rem(padding-top, 10);
        .px2rem(padding-bottom, 10); // .px2rem(padding-left,24);
        .px2rem(border-radius, 8);
        box-shadow: 0 2px 4px 0 rgba(183, 200, 224, 0.1);
        &:before {
          content: " ";
          border-top: 7px solid #d9d9d9;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          position: absolute;
          right: 42px;
          bottom: -7px;
        }
        &:after {
          content: " ";
          border-top: 5px solid #fff;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          position: absolute;
          right: 44px;
          bottom: -5px;
        }
        .popup-btn-ctn {
          a {
            width: 100%;
            background-color: transparent;
            color: @font-color-blue;
            .px2rem(height, 86);
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            .px2rem(line-height, 86);
            .px2rem(padding-left, 24);
            box-sizing: border-box;
            &:active {
              background-color: #f2f3f5;
            }
            &:after {
              width: 0;
            }
          }
        }
      }
    }
    .h3yun_All {
      .px2rem(padding-right, 22);
    }
  }
</style>
