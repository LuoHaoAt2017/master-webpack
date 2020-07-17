<template>
  <canvas id="canvas" :width="width" :height="height">
  </canvas>              
</template>

<script>
import SignaturePad from '../../libs/signature_pad/signature_pad';

export default {
  name: 'h3-signsture',
  props: {
    penColor: {
      type: String,
      default: 'rgb(0, 0, 0)',
    },
    backgroundColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0)',
    },
    width: {
      type: [String, Number],
      default: '375',
    },
    height: {
      type: [String, Number],
      default: '375',
    },
    minWidth: {
      type: Number,
      default: 0.5,
    },
    maxWidth: {
      type: Number,
      default: 2,
    },
    onBegin: Function,
    onEnd: Function,
    clip: { // 是否需要裁切
      type: Boolean,
      default: false,
    },
    clipH: { // 水平方向上裁切距离
      type: Number,
      default: 0,
    },
    clipV: { // 垂直方向上裁切距离
      type: Number,
      default: 20,
    },
  },
  components: {
  },
  data() {
    return {
      signaturePad: null,
    };
  },
  created() {
  },
  mounted() {
    const canvas = document.getElementById('canvas');
    this.signaturePad = new SignaturePad(canvas, {
      penColor: this.penColor,
      backgroundColor: this.backgroundColor,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      onEnd: this.onEnd,
      onBegin: this.onBegin,
      needClip: this.clip,
      clipV: this.clipV,
      clipH: this.clipH,
    });
  },
  computed: {
  },
  methods: {
    initResizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      this.canvas.width = this.canvas.offsetWidth * ratio;
      this.canvas.height = this.canvas.offsetHeight * ratio;
      this.canvas.getContext('2d').scale(ratio, ratio);
    },
    clear() {
      this.signaturePad.clear();
    },
    saveAsJpg() {
      if (this.signaturePad.isEmpty()) {
        console.log('没有内容请签名');
        this.$emit('isEmpty');
      } else {
        const data = this.signaturePad.toDataURL();
        this.$emit('saveAsJpg', data);
      }
    },
    saveAsPng() {
      if (this.signaturePad.isEmpty()) {
        console.log('没有内容请签名');
        this.$emit('isEmpty');
      } else {
        const data = this.signaturePad.toDataURL();
        this.$emit('saveAsPng', data);
      }
    },
    saveAsSvg() {
      if (this.signaturePad.isEmpty()) {
        console.log('没有内容请签名');
        this.$emit('isEmpty');
      } else {
        const data = this.signaturePad.toDataURL();
        this.$emit('saveAsSvg', data);
      }
    },
  },
  watch: {
  },
};
</script>

<style lang="less" >
@import '../../styles/mixins.less';

</style>


