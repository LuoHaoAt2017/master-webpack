<template>
    <div class="signature-test">
      <div>
        <h3-swipeout class="signature-test-swipeout">
          <transition-group name="signature-list" tag="div" class="signature-list-wrapper" >
            <h3-swipeout-item v-for="(item, index) in signatureList" :key="item.signatureId"  underlay-color="#ccc"  transition-mode="follow" class="signature-list-item" :disabled="isEditing" :class="[item.added ? 'add': '', item.hide ? 'signature-list-hide': '']">
              <div slot="right-menu" v-if="!isEditing">
                <h3-swipeout-button @click.native="swiperoutDefaultButton(item, index)" :width="90" style="background:#ccc;font-size:0.4rem;" v-if="!isEditing">{{item.defaulted?'取消':'设为'}}默认</h3-swipeout-button><h3-swipeout-button @click.native="swiperoutDelButton(item, index)" :width="60" style="background:#F5222D;font-size:0.4rem;" v-if="!isEditing">删除</h3-swipeout-button>
              </div>
              <div slot="content" class="signature-item" >
                <h3-card-form @click.native="clickCardForm(item, index)" :key="index"  v-touch="{}">
                  <div  class="signature-default-aside"  slot="aside">
                    <div v-if="item.defaulted">
                      <i class="icon aufont icon-base-edit"></i>
                      <span>默认签名</span>
                    </div>
                  </div>
                  <div class="signature-name"> 
                    <!-- {{item.signature}} -->
                    <img :src="item.src"/>
                  </div>
                  <template slot="extra">
                    <h3-multiple-check-item  :is-editing="isEditing" :selected="item.selected"
                    @tigger-multiple-check = "triggerMultipleCheck" v-show="isEditing"></h3-multiple-check-item>
                  </template>
                </h3-card-form>
              </div>
            </h3-swipeout-item>
          </transition-group>
          
        </h3-swipeout>
      </div>
      <h3-button-group :buttonGroup="buttonGroup" border-type="center-border"></h3-button-group>
      
      <h3-action-sheet
        :menus="menus" 
        show-cancel
        @on-click-menu="onClickMenu" 
        v-model="actionsheetShow">
      </h3-action-sheet>

      <h3-blank-page :style="wrapNoContentStyle"  tipText="暂无签名" img="../../assets/img/blankpage.png" v-if="showEmptyResult" >

      </h3-blank-page>
      
    </div>  
</template>

<script>
import cx from 'classnames';
import H3Modal from '../../components/h3-modal/index';
import H3CardForm from '../../widgets/h3-card-data-list/index';
import H3Scroll from '../../components/h3-scroll/mescroll';
import H3StatusTip from '../../widgets/h3-tool-tip/h3-status-tip';
import { H3Swipeout, H3SwipeoutItem, H3SwipeoutButton } from '../../components/h3-swipeout';
import H3MultipleCheckItem from '../../widgets/h3-multiple-check/h3-multiple-check-item';
import H3BatchingActionSheet from '../../widgets/h3-filter/h3-batch-action-sheet';
import H3ButtonGroup from '../../widgets/h3-button/h3-button-group2';
import H3ActionSheet from '../../components/h3-actionsheet/index';
import H3BlankPage from '../../widgets/h3-blank-page/index';
import touch from '../../directives/touch';

export default {
  components: {
    H3CardForm,
    H3StatusTip,
    H3Swipeout,
    H3SwipeoutItem,
    H3SwipeoutButton,
    H3Scroll,
    H3Modal,
    H3MultipleCheckItem,
    H3BatchingActionSheet,
    H3ActionSheet,
    H3ButtonGroup,
    H3BlankPage,
  },
  directives: {
    touch,
  },
  data() {
    return {
      signatureList: [
        {
          signature: '陈浩',
          defaulted: false,
          signatureId: this.IGuid(),
        },
        {
          signature: '刘媛',
          defaulted: false,
          signatureId: this.IGuid(),
          src: `data:image/png;base64,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`
        },
        {
          signature: '刘媛',
          defaulted: false,
          src: `data:image/png;base64,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`,
          signatureId: this.IGuid(),
        },
        {
          signature: '刘媛',
          defaulted: false,
          signatureId: this.IGuid(),
        },
      ],
      menus: [
        {
          type: 'error',
          label: '删除',
        },
      ],
      buttonGroup: [
        {
          title: '新增',
          type: 'share',
          onClick: this.goToSignature,
        },
        {
          title: '编辑',
          type: 'share',
          onClick: this.editSignature,
        },
      ],
      actionsheetShow: false,
      isEditing: false,
      selectedCount: 0,
      isEditingIndex: -1,
      showEmptyResult: false,
      active: true,
    };
  },
  created() {
    // this.$root.eventHub.$on('signatureData', (data) => {
    //   // data是对象 其中img是base64编码的图片 isDefault是是否为默认
    //   console.log(data);
    //   this.addSignature(data);
    // });
  },
  // activated() {
  //   setTitle('签名');
  // },
  methods: {
    IGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        /* eslint-disable no-bitwise */
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
      });
    },
    loadMore(page, done, err) {
      done(0, 0);
    },
    goToSignature() {
      this.$router.push({
        path: '/signature',
        query: {
          hasDefault: this.hasDefault,
        },
      });
    },
    addSignature(signatureData) {
      // 新增签名(跳转到签名页面)
      if (!signatureData.isDefault) { // 新增签名非默认
        if (this.signatureList.length === 0) {
          this.signatureList.unshift({
            // signature: '新增',
            defaulted: signatureData.isDefault,
            src: signatureData.img,
            signatureId: this.IGuid(),
          });
        }
        if (this.signatureList[0].defaulted) { // 第一个是默认签名
          const first = this.signatureList[0];
          this.signatureList.splice(0, 1);
          this.signatureList.unshift({
            // signature: '新增',
            defaulted: signatureData.isDefault,
            src: signatureData.img,
            added: true,
            signatureId: this.IGuid(),
          });
          this.signatureList.unshift(first);
        } else {
          this.signatureList.unshift({
            // signature: '新增',
            defaulted: signatureData.isDefault,
            src: signatureData.img,
            signatureId: this.IGuid(),
          });
        }
      } else { // 新增签名是默认签名
        for (let i = 0; i < this.signatureList.length; i += 1) {
          const signature = this.signatureList[i];
          this.$set(signature, 'defaulted', false);
        }
        this.signatureList.unshift({
          defaulted: signatureData.isDefault,
          src: signatureData.img,
          signatureId: this.IGuid(),
        });
      }
      setTimeout(() => {
        for (let i = 0; i < this.signatureList.length; i +=1) {
          const item = this.signatureList[i];
          if (item.added) {
            this.$set(item, 'added', false);
          }
        }
      }, 1000);
    },
    editSignature() {
      this.isEditing = true;
      this.selectedCount = 0;
      const buttonGroup = [
        {
          title: '删除',
          type: 'disabled',
        },
        {
          title: '设为默认',
          type: 'disabled',
        },
        {
          title: '完成',
          type: 'share',
          onClick: this.finishedGoOther,
        },
      ];
      this.buttonGroup = buttonGroup;
    },
    triggerMultipleCheck() {
      this.isEditing = true;
    },
    clickCardForm(item, index) {
      if (this.isEditing) {
        if (item.selected === undefined || !item.selected) {
          this.selectedCount += 1;
        } else {
          this.selectedCount -= 1;
        }
        this.$set(item, 'selected', !item.selected);
        if (item.selected) {
          if (item.defaulted) {
            this.$set(this.buttonGroup[1], 'title', '取消默认');
            this.$set(this.buttonGroup[1], 'type', '');
            this.$set(this.buttonGroup[1], 'onClick', this.cancelDefault);
          } else {
            this.$set(this.buttonGroup[1], 'title', '设为默认');
            this.$set(this.buttonGroup[1], 'onClick', this.setDefault);
          }
        }
        if (item.selected) {
          this.isEditingIndex = index;
        }
      } else { // 点击card
        this.$set(item, 'active', true);
        this.$router.push({
          path: '/remarkSignatureList',
          query: {
            img: item.src,
            isDefault: item.defaulted,
          },
        });
      }
    },
    showActionSheet() {
      this.actionsheetShow = true;
    },
    onClickMenu(text) {
      if (text === 'cancel') {
        return false;
      }
      if (this.isEditing) { // 编辑界面的删除
        for (let i = 0; i < this.signatureList.length; i += 1) {
          const signature = this.signatureList[i];
          if (signature.selected) {
            this.$set(signature, 'hide', true);
            this.signatureList.splice(i, 1);
            i -= 1;
          }
        }
        this.selectedCount = 0;
      } else { // 列表非编辑界面的删除
        const signature = this.signatureList[this.isEditingIndex];
        this.$set(signature, 'hide', true);
        this.signatureList.splice(this.isEditingIndex, 1);
      }
    },
    swiperoutDefaultButton(item, index) {
      this.isEditingIndex = index;
      if (item.defaulted) {
        this.cancelDefault();
      } else {
        this.setDefault();
      }
    },
    swiperoutDelButton(item, index) {
      this.isEditingIndex = index;
      this.showActionSheet();
    },
    cancelDefault() {
      // this.signatureList.splice(this.is)
      this.$set(this.signatureList[this.isEditingIndex], 'defaulted', false);
      if (this.isEditing) {
        this.$set(this.signatureList[this.isEditingIndex], 'selected', false);
        this.selectedCount -= 1;
      }
    },
    setDefault() {
      for (let i = 0; i < this.signatureList.length; i += 1) {
        const signature = this.signatureList[i];
        this.$set(signature, 'defaulted', false);
      }
      this.$set(this.signatureList[this.isEditingIndex], 'defaulted', true);
      if (this.isEditing) {
        this.$set(this.signatureList[this.isEditingIndex], 'selected', false);
        this.selectedCount -= 1;
      }
      this.finishedOnPage();
    },
    finishedOnPage() {
      this.isEditing = false;
      this.buttonGroup = [
        {
          title: '新增',
          type: 'share',
          onClick: this.goToSignature,
        },
        {
          title: '编辑',
          type: 'share',
          onClick: this.editSignature,
        },
      ];
      let defaultedIndex = -1;
      for (let i = 0; i < this.signatureList.length; i += 1) {
        const signature = this.signatureList[i];
        if (signature.defaulted) {
          defaultedIndex = i;
          break;
        }
      }
      if (defaultedIndex >= 0) {
        const first = this.signatureList[defaultedIndex];
        this.signatureList.splice(defaultedIndex, 1);
        this.signatureList.unshift(first);
      }
    },
    finishedGoOther() {
      this.finishedOnPage();
      this.$router.push({
        path: 'remarkSignatureList',
        query: {
          img: this.signatureList[0].src,
          isDefault: this.signatureList[0].defaulted,
        },
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    // const routerFrom = from.path;
    const signatureData = to.query;
    next((vm) => {
      if (signatureData.img) {
        vm.addSignature(signatureData);
      }
    });
  },
  computed: {
    wrapNoContentStyle() {
      return {
        top: '44px',
        bottom: '44px',
        height: 'auto',
        background: '#f8f8f8',
      };
    },
    signatureListLength() {
      return this.signatureList.length;
    },
    hasDefault() {
      for (let i = 0; i < this.signatureList.length; i += 1) {
        const signature = this.signatureList[i];
        if (signature.defaulted) {
          return true;
        }
      }
      return false;
    },
  },
  watch: {
    selectedCount(val) {
      if (val === 0) {
        this.$set(this.buttonGroup[0], 'type', 'disabled');
        this.$set(this.buttonGroup[0], 'size', 'lger');
        this.$set(this.buttonGroup[1], 'type', 'disabled');
        this.$set(this.buttonGroup[1], 'size', 'lger');
        this.$set(this.buttonGroup[1], 'title', '设为默认');
      }
      if (val === 1) {
        this.$set(this.buttonGroup[0], 'type', 'share');
        this.$set(this.buttonGroup[1], 'type', 'share');
        this.$set(this.buttonGroup[0], 'onClick', this.showActionSheet);
      }
      if (val > 1) {
        this.$set(this.buttonGroup[1], 'type', 'disabled');
      }
    },
    signatureListLength(val) {
      if (val === 0) {
        this.showEmptyResult = true;
        this.buttonGroup = [
          {
            title: '新增',
            type: 'share',
            onClick: this.goToSignature,
          },
          {
            title: '编辑',
            type: 'disabled',
          },
        ];
      } else {
        this.showEmptyResult = false;
      }
    }
  },
};
</script> 
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';

// @import './style/data-list.less';
.signature-test{
  .h3-card-form{
    .px2rem(height, 194);
    align-items: center;
    justify-content: flex-start;
    border: none;
    .h3-card-form-aside{
      .px2rem(width, 160);
      height: auto;
      .px2rem(margin-right, 100);
    }
    .signature-default-aside{
      i{
        color: #1890ff;
      }
      span{
        .px2rem(line-height, 40);
        color: #666;
      }
    }
    .h3-card-form-main{
      flex: none;
      .px2rem(width, 134);
      .px2rem(height, 134);
      // border: 1px solid #ccc;
    }
    .signature-name{
      width: 100%;
      height: 100%;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .trigger-point{
      .px2rem(font-size, 44);
    }
  }
  .signature-list-item:not(:last-child){
    // .hairline('bottom', #eee);
    border-bottom: 1px solid #eee;
  }
  .signature-list-item-active{
    background-color: @fill-tap;
  }
  .h3-button-group{
    position: fixed;
    bottom: 0;
    color: #1890ff;
  }
  span.h3-button-group-disabled{
    .px2rem(font-size, 34);
  }
  .h3-blank-page-tips{
    top: 45% !important;
  }
}

.signature-test-swipeout{
  // .px2rem(padding-bottom, 100);
  position: absolute;
  top: 0;
  // bottom: 0;
  .px2rem(bottom, 88);
  overflow-y: scroll !important;
  background: #f8f8f8;
}

.h3-swipeout-button{
  .px2rem(width,120);
}

.signature-list-hide{
  display: none !important;
}

.signature-list-item {
  transition: all 500ms;
  display: inline-block;
  width: 100%;
}

// .signature-list-enter{
//   opacity: 1;
// }
.signature-list-leave-to{
  opacity: 0;
}

// .signature-list-enter, .signature-list-leave-to
// /* .signature-list-leave-active for below version 2.1.8 */ {
//   opacity: 0;
//   transform: translateY(-100%);
// }

// .signature-list-leave-active {
//   position: absolute;
// }

.add{
  animation: appear 1s linear;
}
@keyframes appear{
  from {
    background: #EAF4FE;
  }
  to{
    background: #fff;
  }
}
</style>