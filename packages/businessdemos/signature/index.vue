<template>
  <transition :duration='300' enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
        <div class="signature-container">
            <x-header :left-options="{preventGoBack:true}" @on-click-back="goBack()" v-if="!$store.state.corpId" >
                    签名
                </x-header>
            <div class="board" :class="{hasPaddingTop:!$store.state.corpId}">
                <div class="wrapper" id="wrapper">
                    <div class="signature-tip" v-show="tipShow">请手写签名</div>
                    <canvas id="canvas" width="100%" height="100%" style="border:1px solid black">Canvas画板</canvas>              
                    
                </div>
                <div class="bottom-buttons">
                    <div @click="clear">重置</div>
                    <div class="divider">
                        <div></div>
                    </div>
                    <div @click="save">确定</div>
                </div>
            </div>
            
        </div>      
    </transition>              
</template>

<script>
import { XHeader } from 'vux';
import { setTitle, setLeft } from '../../config/dingtalk-interface';
import { isiOS } from '../../config/common';

let draw;
const preHandler = function preHandler(e) {
  e.preventDefault();
};
class Draw {
  constructor(el, widths, height) {
    let width = widths;
    this.temp = 1;
    this.el = el;
    this.width = width || 300;
    this.height = height || 600;
    this.canvas = document.getElementById(this.el);
    this.resizeCanvas(this.canvas);
    this.cxt = this.canvas.getContext('2d');
    this.vm = null;
    // 因为过渡动画的存在导致计算错误需要重新获取
    const range = canvas.getBoundingClientRect();
    width = document.documentElement.getBoundingClientRect().width;
    this.stage_info = {
      left: Math.abs(range.left - width),
      top: range.top,
    };
    this.path = {
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0,
    };
  }
  init(vm) {
    const that = this;
    this.vm = vm;
    this.canvas.addEventListener('touchstart', (event) => {
      document.addEventListener('touchstart', preHandler, false);
      that.drawBegin(event);
      that.vm.tipShow = false;
    });
    this.canvas.addEventListener('touchend', () => {
      document.addEventListener('touchend', preHandler, false);
      that.drawEnd();
    });
    this.clear();
  }
  resizeCanvas(canvass) {
    const canvas = canvass;
    canvas.width = this.width;
    canvas.height = this.height;
  }
  drawBegin(e) {
    const that = this;
    if (window.getSelection()) {
      window.getSelection().removeAllRanges();
    } else {
      document.selection.empty();
    }
    this.cxt.strokeStyle = '#000';
    this.cxt.lineWidth = 3;
    this.cxt.beginPath();
    this.cxt.moveTo(
      e.changedTouches[0].clientX - this.stage_info.left,
      e.changedTouches[0].clientY - this.stage_info.top,
    );
    this.path.beginX = e.changedTouches[0].clientX - this.stage_info.left;
    this.path.beginY = e.changedTouches[0].clientY - this.stage_info.top;
    canvas.addEventListener('touchmove', (event) => {
      that.drawing(event);
    });
  }
  drawing(e) {
    this.cxt.lineTo(
      e.changedTouches[0].clientX - this.stage_info.left,
      e.changedTouches[0].clientY - this.stage_info.top,
    );
    this.path.endX = e.changedTouches[0].clientX - this.stage_info.left;
    this.path.endY = e.changedTouches[0].clientY - this.stage_info.top;
    this.cxt.stroke();
  }
  drawEnd() {
    this.temp = 2;
    document.removeEventListener('touchstart', preHandler, false);
    document.removeEventListener('touchend', preHandler, false);
    document.removeEventListener('touchmove', preHandler, false);
  }
  clear() {
    this.cxt.clearRect(0, 0, this.width, this.height);
  }
  save() {
    this.temp = 3;
    const url = canvas.toDataURL('image/png');
    return url;
  }
}

export default {
  components: {
    XHeader,
  },
  data() {
    return {
      tipShow: true,
      val: true,
      url: '',
    };
  },
  mounted() {
    // 获取包裹canvas的宽高
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;
      draw = new Draw('canvas', width, height);
      draw.init(this);
    } else {
      draw = new Draw('canvas');
      draw.init(this);
    }
  },
  activated() {
    setTitle('签名');

    const self = this;
    window.backFn = function backFn() {
      self.goBack();
    };
    if (isiOS) {
      setLeft(window.backFn);
    }
  },
  methods: {
    clear() {
      this.tipShow = true;
      draw.clear();
    },
    save() {
      const data = draw.save();
      this.url = data;
      this.$root.eventHub.$emit('setsignature', this.url);
      this.$router.go(-1);
    },
    mutate(word) {
      this.$emit('input', word);
    },
    goBack() {
      this.$destroy();
      this.$router.go(-1);
    },
  },
};
</script> 
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.vux-header {
  position: fixed !important;
  top: 0;
  width: 100%;
}
.signature-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #eee;
}
.hasPaddingTop {
  .px2rem(margin-top,98);
}
.board {
  position: absolute;
  .px2rem(top,24);
  .px2rem(left,24);
  .px2rem(right,24);
  .px2rem(bottom,31);
  background: #fff;
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    .px2rem(bottom,106);
    border-radius: 8px;
    .signature-tip {
      position: absolute;
      .px2rem(top,20);
      .px2rem(left,32);
      .px2rem(font-size,32);
      color: #999;
    }
  }
  .bottom-buttons {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    // .px2rem(height,106);
    .px2rem(padding-top,33);
    .px2rem(padding-bottom,33);
    border-top: 1px solid #d9d9d9;
    div {
      .px2rem(font-size,36);

      &:first-child {
        flex-basis: 49%;
        color: #999;
      }
      &:last-child {
        flex-basis: 49%;
        color: #108ee9;
      }
      &.divider {
        flex: 2%;
        div {
          border: none;
          width: 0;
          height: 25px;
          border-left: 1px solid #d9d9d9;
        }
      }
    }
  }
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#canvas {
  background: #fff;
  cursor: default;
  border: 0 !important;
}
#keyword-box {
  margin: 10px 0;
}
</style>