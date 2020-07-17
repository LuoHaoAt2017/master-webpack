<template>
  <div :class="prefixCls">
    <transition :name="`${prefixCls}-mask`">
      <H3ImageViewerMask :class="`${prefixCls}-mask`" :visible="visible" />
    </transition>
    <transition :name="`${prefixCls}-view`">
      <div :class="`${prefixCls}-view`" ref="imageBox"  >
        <Slide
          :height="`${windowHeight - 40}px`"
          :active="current"
          :auto="false"
          :showNav="false"
          :loop="false"
          :onSlideEnd="updateActive"
          ref="slider"
          v-if="visible"
        >
          <SlideItem v-for="(photo, index) in photos" :key="index">
            <div v-if="index===curIndex || photo.loaded">
              <img rolw="presentation" :loaded="photo.loaded"  v-show="photo.loaded "  :src="photo.src || photo.url" @:error="handleError($event)" @load="imgOnload(photo)"/>
            </div>
            <div class="h3-photo-upload-item-box h3-photo-upload-item-box__progress" v-show="!photo.loaded && index===curIndex">
              <span  aria-label="loading" class="h3-photo-progress-icon" ></span>
            </div>
          </SlideItem>
        </Slide>
      </div>
    </transition>
    <transition :name="`${prefixCls}-nav`" >
      <div>
        <div :class="`${prefixCls}-num-nav`" v-if="photos.length>0"> {{curIndex+1}}/{{photos.length}}</div>
      </div>
    </transition>
  </div>
</template>


<script>
import Hammer from 'hammerjs';
import H3ImageViewerMask from './mask';
import { Slide, SlideItem } from '../h3-slider';

const pinch = new Hammer.Pinch();
const pan = new Hammer.Pan();

export default {
  name: 'PopupView',
  props: {
    prefixCls: {
      type: String,
      default: 'h3-image-viewer-popup',
    },
    photos: {
      type: Array,
      default: () => [],
    },
    current: {
      type: Number,
      default: 0,
    },
    onClick: Function,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    H3ImageViewerMask,
    Slide,
    SlideItem,
  },
  data() {
    return {
      mc: null,
      // curIndex: this.current,
      index: this.current,
      windowHeight: window.innerHeight,
      picIcon: require('../../assets/img/icon-pic.png'),
    };
  },
  mounted() {
    this.bindHammer();
  },
  methods: {
    handleError($event) {
      $event.currentTarget.src = this.picIcon;
    },
    bindHammer() {
      this.$nextTick(() => {
        this.mc = new Hammer.Manager(this.$refs.imageBox);
        /* eslint-disable  react/no-find-dom-node */
        // const sliderNode = ReactDOM.findDOMNode(this.slider);
        const sliderNode = this.$refs.slider;
        /* eslint-enable  react/no-find-dom-node */
        let currentScale = 1;
        let scale = 1;
        // let deltaX = 0;
        // let deltaY = 0;
        this.mc.add([pinch]);
        this.mc.add([pan]);
        this.mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
        this.mc.add(new Hammer.Tap({ event: 'singletap' }));

        this.mc.get('doubletap').recognizeWith('singletap');
        this.mc.get('singletap').requireFailure('doubletap');

        this.mc.on('doubletap', () => {
          if (currentScale === 1) {
            currentScale = 1.5;
          } else {
            currentScale = 1;
          }
          scale = currentScale;
          sliderNode.$el.style.webkitTransition = 'none';
          sliderNode.$el.style.webkitTransform = `scale(${currentScale},${currentScale})`;
        }).on('singletap', () => {
          this.onClick();
        });

        this.mc.on('pinchmove', (ev) => {
          // in zoom-in mode, make sure scale can be inherited from last zoom-in
          currentScale = (ev.scale - 1) + scale;
          if (currentScale < 0) {
            currentScale = ev.scale;
          }
          sliderNode.$el.style.webkitTransition = 'none';
          sliderNode.$el.style.webkitTransform = `scale(${currentScale},${currentScale})`;
        });

        this.mc.on('pinchend', () => {
          scale = currentScale;
          if (scale < 1) {
            scale = 1;
            sliderNode.$el.style.webkitTransition = 'transform 0.5s ease-out';
            sliderNode.$el.style.webkitTransform = 'scale(1,1)';
          }
        });

        // slider与hammer pan冲突
        // this.mc.on('panstart panmove', (ev) => {
        //   if (currentScale <= 1) {
        //     return;
        //   }
        //   const el = sliderNode.$el;
        //   deltaX += ev.deltaX;
        //   deltaY += ev.deltaY;
        //   el.style.webkitTransition = 'none';
        //   if (scale !== 1) {
        //     el.style.webkitTransform = `scale(${scale}, ${scale}) translate(${deltaX}px, ${deltaY}px)`;
        //   } else {
        //     el.style.webkitTransform = `translate(${deltaX}px, ${deltaY}px)`;
        //   }
        // });
      });
    },
    removeHammer() {
      if (!this.mc) return;
      this.mc.off('pinchmove');
      this.mc.off('pinchend');
      this.mc = null;
    },
    // handleClick() {
    //   this.onClick();
    // },
    updateActive(active) {
      this.curIndex = active.index;
    },
    imgOnload(photo) {
      this.$set(photo, 'loaded', true);
    },
  },
  computed: {
    // photosArr: {
    //   get() {
    //     return this.photos;
    //   },
    //   set(val) {
    //     return val;
    //   },
    // },
    curIndex: {
      get() {
        return this.index;
      },
      set(val) {
        this.index = val;
      },
    },
  },
  watch: {
    current(val) {
      this.index = val;
    },
    visible(val) {
      if (val) {
        console.log(val);
        this.bindHammer();
      } else {
        this.removeHammer();
      }
    }
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';

@prefixCls: h3-image-viewer;

.@{prefixCls}-popup-view {
  z-index: 1010;
  position: fixed;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  // padding constant(safe-area-inset-top) constant(safe-area-inset-right) constant(safe-area-inset-bottom) constant(safe-area-inset-left);
  // padding env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  .t-slide-item {
    img {
      width: 100%;
    }
  }
  .h3-photo-upload-item-box{
    width: 100%;
    height: 100%;
    border: 1px solid rgba(31,56,88,.2);
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    border-radius: 4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    .h3-photo-progress-icon {
      display: inline-block;
      width: 22px;
      height: 22px;
      vertical-align: middle;
      .encoded-svg-background('loading');

      background-position: 50%;
      background-size: 100%;
      background-repeat: no-repeat;
      animation: spinner-anime 1s linear infinite;
    }
  }
}  
.@{prefixCls}-popup-mask {
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
}
.@{prefixCls}-popup-nav {
  position: fixed;
  bottom: 20px;
  // fix-safe-area: bottom 20px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1010;
}
    

.@{prefixCls}-popup-nav-item {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.2;
  display: inline-block;
  margin-right: 10px;
  &.last {
    margin-right: 0;
  }
  &.active {
    opacity: 1;
  }    
}

.@{prefixCls}-popup-num-nav {
  position: fixed;
  bottom: 45px;
  left: 50%;
  transform: translate(-50%,0);
  z-index: 1010;
  font-size: 18px;
  color: #fff;
}
    
    

@keyframes imageViewerMaskFadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes imageViewerMaskFadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.@{prefixCls}-popup-mask-appear,
.@{prefixCls}-popup-mask-enter {
  opacity: 0;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: ease-out;
}
    

.@{prefixCls}-popup-mask-appear-active,
.@{prefixCls}-popup-mask-enter-active {
  animation-name: imageViewerMaskFadeIn;
}   

.@{prefixCls}-popup-mask-leave {
  opacity: 1;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: ease-out;
} 

.@{prefixCls}-popup-mask-leave-active {
  animation-name: imageViewerMaskFadeOut;
}
    


@keyframes imageViewerViewFadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes imageViewerViewFadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.@{prefixCls}-popup-view-appear,
.@{prefixCls}-popup-view-enter {
  opacity: 0;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: ease-out;
}
    

.@{prefixCls}-popup-view-appear-active,
.@{prefixCls}-popup-view-enter-active {
  animation-name: imageViewerViewFadeIn;
}
    

.@{prefixCls}-popup-view-leave {
  opacity: 1;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: ease-out;
}
    
.@{prefixCls}-popup-view-leave-active {
  animation-name: imageViewerViewFadeOut;
}

@keyframes spinner-anime {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes circleRotation {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>

