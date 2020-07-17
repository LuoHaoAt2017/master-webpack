<template>
  <div class="h3-modal-container" :style="wrapStyle" v-model="showValue">
    <div>
      <transition name="h3-mask">
        <div class="h3-modal-mask" :style="maskStyle" ref="mask" @click.prevent.stop="hide" v-show="showStatus" ></div>
      </transition>
      <transition  name="h3-fadeIn">
        <div class="h3-modal-wrap" ref="wrap" :style="maskStyle" v-show="showStatus" v-if="type!=='popup'" @click.prevent.stop="hide" >
          <div class="h3-modal h3-modal-transparent" :class="{'h3-modal-operation': type==='operation'}">
            <div class="h3-modal-content">
              <div class="h3-modal-header" v-if="type!=='operation'">
                <div class="h3-modal-title" v-html="title"></div>
              </div>
              <div class="h3-modal-body">
                <slot>
                  <div class="h3-modal-alert-content" v-if="type==='alert'" v-html="content">
                  </div>
                  <div class="h3-modal-propmt-content" v-if="type==='propmt'" v-html="content">
                    <div>
                      <div v-html="content"></div>
                      <div class="h3-modal-input-container">
                        <div class="h3-modal-input"  v-if="propmtType !== 'login'">
                          <label>
                            <input type="text" v-if="propmtType==='default'" ref="input" v-model="value" :placeholder="placeHolders && placeHolders[0]"/>
                            <input type="password" v-if="propmtType==='secure'" ref="input" v-model="password" />
                          </label>
                        </div>
                        <div class="h3-modal-input"  v-if="propmtType === 'login'">
                          <label>
                            <input type="text"  ref="input" v-model="value" :placeholder="placeHolders && placeHolders[0]"/>
                          </label>
                        </div>
                        <div class="h3-modal-input"   v-if="propmtType === 'login'">
                          <label>
                            <input type="password" ref="input"  v-model="password" :placeholder="placeHolders && placeHolders[1]"/>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-html="content" class="h3-modal-default-content" v-if="type==='default'"></div>
                </slot>
              </div>
              <div class="h3-modal-footer" v-if="actions && actions.length > 0">
                <div :class="btnGroupClass">
                  <a class="h3-modal-button" v-touch="{activeClass: 'h3-modal-button'}" v-for="(action, index) in actions" :style="action.style" :key="index" @click="onAction(index)">
                    {{action.text}}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="h3-slideup">
        <div class="h3-modal-wrap h3-modal-wrap-popup" :style="maskStyle" v-show="showStatus"  v-if="type==='popup' && popupDirection === 'up'" @click.stop="hide">
          <div class="h3-modal h3-modal-popup h3-modal-popup-slide-up">
            <div class="h3-modal-content">
              <div class="h3-modal-body">
                <slot>
                  <div v-html="content" v-if="content"></div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="h3-slidedown">
        <div class="h3-modal-wrap h3-modal-wrap-popup" :style="maskStyle" v-show="showStatus"  @click.prevent="hide"  v-if="type==='popup' && popupDirection === 'down'" >
          <div class="h3-modal h3-modal-popup h3-modal-popup-slide-down">
            <div class="h3-modal-content">
              <div class="h3-modal-body">
                <slot>
                  <div v-html="content" v-if="content"></div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="h3-slideleft">
        <div class="h3-modal h3-modal-popup h3-modal-popup-slide-left" :style="wrapScaleStyle" v-show="showStatus"  v-if="type==='popup' && popupDirection === 'left'" >
            <div class="h3-modal-content">
              <div class="h3-modal-body">
                <slot>
                  <div v-html="content" v-if="content"></div>
                </slot>
              </div>
            </div>
          </div>
      </transition>
      <div class="h3-modal h3-modal-popup-slide-right h3-modal-wrap-side" :class="wrapSlideRightCls"   v-if="type==='popup' && popupDirection === 'right'">
        <div class="h3-modal-content">
          <div class="h3-modal-body">
            <slot>
              <div v-html="content" v-if="content"></div>
            </slot>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import preventBodyScrollMixin from '../../mixins/prevent-body-scroll';
import Touch from '../../directives/touch';
// import noscroll from '../../directives/preventScroll';
// import { hasClass } from '../../utils/class';
import dom from '../../utils/dom';

const ExceptionClass = 'h3-modal-scroll-exception';

export default {
  name: 'h3-modal',
  mixins: [preventBodyScrollMixin],
  components: {
  },
  model: {
    prop: 'show',
    event: 'change',
  },
  directives: {
    Touch,
    // noscroll,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'default',
    },
    propmtType: {
      type: String,
      default: 'default',
    },
    popupDirection: {
      type: String,
      default: 'up',
      validator: val => ['up', 'down', 'left', 'right'].indexOf(val) > -1,
    },
    popupScale: {
      type: [Number, String],
      default: 80,
      validator: val => parseInt(val, 10) > 0 && parseInt(val, 10) < 100,
    },
    actions: {
      type: Array, // {text,onPress,style}
    },
    title: {
      type: String,
    },
    content: String,
    placeHolders: Array,
    defaultValue: [String, Number],
    maskTop: {
      type: String,
      default: '0',
    },
    maskStyle: Object,
  },
  mounted() {
    this.showValue = this.show;
  },
  watch: {
    showValue(val) {
      this.$emit(val ? 'on-show' : 'on-hide');
      if (val) {
        this.value = this.defaultValue || '';
        this.showStatus = true;
        this.addModalClassName();
        this.addPreventEvent();
        if (this.type === 'propmt') {
          setTimeout(() => {
            if (this.$refs.input) {
              this.setInputFocus();
            }
          }, 300);
        }
      } else {
        this.showStatus = false;
        this.removeModalClassName();
        this.removePreventEvent();
      }
    },
    show(val) {
      if (val) {
        this.showValue = true;
      } else {
        this.showValue = false;
      }
    },
  },
  methods: {
    setInputFocus() {
      this.$refs.input.focus();
    },
    onAction(index) {
      const self = this;
      if (this.actions && this.actions.length > 0) {
        // this.actions[index].onPress();
        const orginPress = this.actions[index].onPress;
        let res;
        if (this.type === 'propmt') {
          if (this.propmtType === 'login') {
            res = orginPress(this.value, this.password);
          } else if (this.type === 'secure') {
            res = orginPress(this.password);
          } else {
            res = orginPress(this.value);
          }
        } else {
          res = orginPress();
        }
        if (res && res.then) {
          res
            .then(() => {
              this.showStatus = false;
              setTimeout(() => {
                this.showValue = false;
              }, 500);
              self.$emit('update:show', false);
              // self.showValue = false;
            })
            .catch(() => {});
        } else {
          this.showStatus = false;
          setTimeout(() => {
            this.showValue = false;
          }, 500);
          self.$emit('update:show', false);
          // self.showValue = false;
        }
      }
      // 隐藏
      // this.$emit('update:show', false);
    },
    shouldPreventScroll() {
      return false;
    },
    hide() {
      if (this.maskClosable) {
        this.$emit('update:show', false);
        this.$emit('on-close');
        this.showStatus = false;
        setTimeout(() => {
          this.showValue = false;
        }, 500);
      }
    },
    prevent(e) {
      const clsNames = [ExceptionClass, 'h3-modal-default-content', 'h3-modal-alert-content', 'h3-modal-popup-slide-down', 'h3-modal-popup-slide-left', 'h3-modal-popup-slide-right', 'h3-modal-popup-slide-up'];
      const res = clsNames.filter(obj => dom.isWrapInCls(e.target, obj));
      if (!res || res.length === 0) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.stopPropagation();
      }
    },
    addPreventEvent() {
      document.addEventListener('touchmove', this.prevent, false);
    },
    removePreventEvent() {
      document.removeEventListener('touchmove', this.prevent, false);
    },
  },
  data() {
    return {
      showValue: false,
      value: '',
      password: '',
      layout: 'VIEW_BOX',
      showStatus: false,
    };
  },
  computed: {
    btnGroupClass() {
      if (this.type === 'operation') {
        return 'h3-modal-button-group-v h3-modal-button-group-operation';
      }
      if (this.actions.length === 2) {
        return 'h3-modal-button-group-h h3-modal-button-group-normal';
      }
      return 'h3-modal-button-group-v h3-modal-button-group-normal';
    },
    wrapStyle() {
      if (this.showValue) {
        return {
          display: 'block',
          top: this.maskTop,
        };
      }
      return {
        display: 'none',
      };
    },
    // maskStyle() {
    //   return {
    //     top: this.maskTop,
    //   };
    // },
    wrapSlideRightCls() {
      if (this.showStatus) {
        return 'h3-modal-slide-right-in';
      }
      return '';
    },
    wrapScaleStyle() {
      if (this.type === 'popup' && (this.popupDirection !== 'up' || this.popupDirection !== 'down')) {
        if (this.popupDirection === 'left') {
          return {
            width: `${parseInt(this.popupScale, 10)}%`,
            top: 0,
            bottom: 0,
            '-webkit-overflow-scrolling': 'touch',
          };
        }
        return {
          width: `${parseInt(this.popupScale, 10)}%`,
          top: 0,
          bottom: 0,
          right: 0,
          // left: `${100 - parseInt(this.popupScale, 10)}%`,
          '-webkit-overflow-scrolling': 'touch',
        };
      }
      return {};
    },
  },
};
</script>

<style lang="less">
@import '../../styles/transition.less';
@import '../../styles/h3-ui/h3-mask';
@import '../../styles/h3-ui/h3-dialog';
@import '../../styles/h3-ui/h3-modal.css';
.h3-modal-container {
  // position: relative;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
}
.h3-modal-mask {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.4);
}
.h3-modal-wrap-side {
  z-index: 1001;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  outline: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: #fff;
}
.h3-modal-wrap {
  position: absolute;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: 1002;
  -webkit-overflow-scrolling: touch;
  outline: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  //处理触摸默认
  touch-action: none;
}
.h3-modal-content {
  position: relative;
  background-color: #fff;
  border: 0;
  background-clip: padding-box;
  text-align: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .h3-modal-header {
    padding: 6px 15px 15px;
    .h3-modal-title {
      margin: 0;
      font-size: 18px;
      line-height: 1;
      color: #000;
      text-align: center;
    }
  }
  .h3-modal-body {
    font-size: 15px;
    color: #888;
    height: 100%;
    line-height: 1.5;
    overflow: auto;
  }
  .h3-modal-alert-content,
  .h3-modal-propmt-content {
    zoom: 1;
    overflow: hidden;
  }
}
.h3-modal-transparent {
  width: 270px;
  .h3-modal-content {
    border-radius: 7px;
    padding-top: 15px;
    .h3-modal-body {
      padding: 0 15px 15px;
    }
    &.has-no-title {
      padding-top: 32px;
      .h3-modal-body {
        padding-bottom: 32px;
      }
    }
  }

  .h3-modal-alert-content{
    color: #333;
    font-size: 15px;
    line-height: 21px;
  }
}
.h3-modal-button-group-v .h3-modal-button {
  -webkit-touch-callout: none;
  position: relative;
  // border-top: 1PX solid #ddd;
  .hairline('top',#ddd);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #1890ff;
  font-size: 17px;
  height: 50px;
  line-height: 50px;
  display: block;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.h3-modal-button-group-h {
  position: relative;
  // border-top: 1px solid #ddd;
  .hairline('top',#ddd);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.h3-modal-button-group-h .h3-modal-button {
    -webkit-touch-callout: none;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    outline: none;
    color: #1890ff;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    display: block;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.h3-modal-button-group-h .h3-modal-button:first-child {
  color: #000;
}
.h3-modal-button-group-h .h3-modal-button:last-child {
  position: relative;
  // border-left: 1PX solid #ddd;
  .hairline('left',#ddd);
}

.h3-modal-button-active {
  background-color: #ddd;
}

.h3-modal-input-container {
    margin-top: 9px;
    // border: 1PX solid #ddd;
    .hairline('all',#ddd);
    border-radius: 3px;
}

.h3-modal-input {
    height: 36px;
    line-height: 1;
}

.h3-modal-input input {
    position: relative;
    border: 0;
    width: 98%;
    height: 34px;
    top: 1PX;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding-left: 8px;
}
.h3-modal-input:nth-child(2) {
    position: relative;
    // border-top: 1PX solid #ddd;
    .hairline('top',#ddd);
}

.h3-modal {
  position: relative;
}
.h3-modal-wrap-popup {
  display: block;
}
.h3-modal-popup-slide-up {
  bottom: 0;
}

.h3-modal-popup-slide-down {
  top: 0;
}

.h3-modal-popup {
  position: absolute;
  left: 0;
  width: 100%;
}

.h3-modal-popup-slide-left {
  left: 0;
}
.h3-modal-popup-slide-right {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 80%;
  transform: translate3d(100%, 0, 0);
}


.h3-modal-slide-right-in {
  animation-name: slideInRight;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}


.h3-modal-operation .h3-modal-content {
    border-radius: 7px;
    height: auto;
    padding-top: 0 !important;
    .h3-modal-body {
      padding: 0!important;
    }
    .h3-modal-button {
      color: #000;
      text-align: left;
      padding-left: 15px;
    }
}


</style>
