<template>
  <div class="app-container">
    <div class="app-header" v-if="_showHeader">
      <div class="header-left">
        <slot name="header__left">
          <div class="header-left__icon header-left__icon--arrow" v-show="_leftOptions.showBack"></div>
          <a
            class="header-left__text"
            v-show="_leftOptions.showBack"
            @click="onClickLeft"
          >{{_leftOptions.backText}}</a>
        </slot>
      </div>
      <h3 class="header-title">
        <slot name="title">
          <span v-show="title" v-cloak>{{title}}</span>
        </slot>
      </h3>
      <div class="header-right">
        <slot name="header__right">
          <a
            class="header-right__text"
            :class="rightOpts[0].iconClass"
            v-if="rightOpts.length === 1"
            @click="rightOpts[0].callback"
          >{{rightOpts[0].text}}</a>
          <h3-popover mask :menus="popoverMenus" :onSelect="onMenuSelect">
            <i class="icon aufont right-alignment icon-base-right-alignment" v-if="popoverMenus.length > 1"></i>
          </h3-popover>
        </slot>
      </div>
    </div>
    <div class="app-main">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Watch
} from 'vue-property-decorator';
import { setTitle, setLeft, closeApp, setRightMenu, setRightMultiMenu, hideRightMenu  } from '../../../config/dingtalk-interface';
import { addClass, removeClass } from '@/utils/dom';
import { H3Popover } from 'h3-mobile-vue';

interface Menu {
  showText: boolean;
  iconClass: string;
  text: string;
  callback():void;
}

Component.registerHooks(['beforeRouteLeave']);

@Component({
  name: 'Layout',
  components:{
    H3Popover
  }
})
export default class Layout extends Vue {
  @Prop()
  title!: string;

  @Prop()
  transition!: string;

  @Prop({
    type: Boolean,
    default: undefined
  })
  showHeader!: boolean;

  @Prop()
  leftOptions!: any;

  @Prop()
  rightOptions!: any;

  @Prop({
    type: Boolean,
    default: undefined
  })
  noSetleft!: boolean;

  /**
   * 是否采取自定义按钮
   */
  @Prop()
  custom!: boolean;

  rightOpts:any[] = []

  get popoverMenus() {
    return (this.rightOpts || []).map(item => {
      return {
        icon: item.iconClass,
        content: item.text,
      }
    })
  }

  @Watch('title')
  titleChanged(val, oldVal) {
    if(val !== oldVal){
      setTitle(val);
    }
  }

  @Watch('rightOptions')
  rightOptionsChanged(val, oldVal) {
    if(val !== oldVal){
      this.initRightMenu()
    }
  }

  get _leftOptions() {
    return Object.assign({
      showBack: true,
      preventGoBack: false,
      backText: '返回'
    }, this.leftOptions || {})
  }

  get _showHeader() {
    if (this.showHeader !== undefined) {
      return this.showHeader
    }
    return !this.$store.state.corpId;
  }

  @Watch('_showHeader')
  _showHeaderChanged(val, oldVal) {
    if(val !== oldVal){
      this.setVirtualHeader()
    }
  }

  created() {
    this.setLeftAndRightMenu()
  }

  activated() {
    this.setLeftAndRightMenu();
  }

  deactivated() {
    //this.hideRightMenu()
  }

  setLeftAndRightMenu() {
    this.setVirtualHeader()
    this.initRightMenu()
    setTitle(this.title);
    if (!this.noSetleft) {
      setLeft(() => {
        this.onClickLeft();
      });
    }
  }

  onClickLeft () {
    if (this.backStack.getStackSize() > 0) {
      this.backStack.pop();
    } else if (this._leftOptions.preventGoBack) {
      this.$emit('on-click-back');
    } else {
      this.$router ? this.$router.back() : window.history.back();
    }
  }

  onMenuSelect(index) {
    const selectItem:any = this.popoverMenus[index]
    if(selectItem.callback){
      selectItem.callback()
    }
  }

  setVirtualHeader() {
    if(this._showHeader){
      addClass(document.body, 'virtual-header')
    }else{
      removeClass(document.body, 'virtual-header')
    }
    //动态设置是否带有虚拟头部变量
    this.$store.state.hasVirtualHeader = this._showHeader
  }

  initRightMenu(){

    if(this.custom){
      return;
    }
    let rightMenus:Menu[] = []
    if(Array.isArray(this.rightOptions)){

      this.rightOptions.forEach(item => {
        if(item.text || item.iconClass){
          rightMenus.push({
            showText: item.showText,
            iconClass: item.iconClass,
            text: item.text,
            callback: item.callback
          })
        }
      })
    }else if(this.rightOptions && (this.rightOptions.text || this.rightOptions.iconClass)){
      rightMenus = [Object.assign({
        showText: true,
        iconClass: '',
        text: ''
      }, this.rightOptions || {})]
    }
    this.rightOpts = rightMenus
    //当单个按钮
    if(this.rightOpts.length === 1){
      setRightMenu(this.rightOpts[0].text, this.rightOpts[0].callback);
    }else{
      this.hideRightMenu()
    }
  }

  hideRightMenu() {
    if(this.custom){
      return;
    }
    hideRightMenu();
  }
}
</script>

<style lang="less">
@import "~src/styles/mixins.less";
body {
  overflow: hidden;
}
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-main {
  flex: 1;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.app-header {
  display: flex;
  .px2rem(height, 98);
  .px2rem(line-height, 98);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #fff;
  position: relative;
  z-index: 9999999;
  .header-left {
    width: 88px;
    .px2rem(line-height, 98);
    padding-left: 16px;
    box-sizing: border-box;
    .header-left__text {
      float: left;
      padding-left: 20px;
      color: #333;
      .px2rem(font-size, 30);
    }
    .header-left__icon {
      position: relative;
      float: left;
      height: 100%;
      .px2rem(line-height, 100);
    }
    .header-left__icon--arrow:before {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
      border: 1px solid #333;
      border-width: 1px 0 0 1px;
      -webkit-transform: rotate(315deg);
      -ms-transform: rotate(315deg);
      transform: rotate(315deg);
      top: 50%;
      left: 7px;
      margin-top: -6px;
    }
  }
  .header-title {
    flex: 1;
    text-align: center;
    .px2rem(font-size, 34);
    font-weight: 400;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      font-size: inherit;
    }
  }
  .header-right {
    width: 88px;
    .header-right__text {
      /*color: #fff;*/
    }
    .dropdown{
      display: inline-block;
      position: relative;
      ul{
        display: none;
        position: absolute;
        .px2rem(top, 98);
        right: 0px;
        .dropdown-item{
          height: 30px;
          line-height: 30px;
          padding-left: 20px;
          padding-right: 20px;
        }
      }
      &.open ul{
        display: block;
      }
    }
  }
}
</style>
