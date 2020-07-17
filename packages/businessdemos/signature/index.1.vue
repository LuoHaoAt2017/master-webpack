 <template>
    <div class="signature-container">
      <div class="sign-tip">请在下方区域手写签名</div>
      <h3-signature ref="signature" @saveAsJpg="saveAsJpg" @isEmpty="isEmpty"
      :on-end="onEnd" :on-begin="onBegin"></h3-signature>
      <h3-list-item :has-extra="true" >
        <span>是否设为默认签名</span>
        <h3-switch slot="extra" v-model="isDefault" color="#1890FF"></h3-switch>
      </h3-list-item>
      <div class=" footer">
        <h3-button-group :buttonGroup="footerButtons" border-type="center-border"></h3-button-group>
      </div>
    </div> 
</template>

<script>
import H3Signature from '../../widgets/h3-signature/index';
import H3ListItem from '../../components/h3-list/h3-list-item';
import H3Switch from '../../components/h3-switch/index';
import H3ButtonGroup from '../../widgets/h3-button/h3-button-group2';

export default {
  components: {
    // XHeader,
    H3Signature,
    H3ListItem,
    H3Switch,
    H3ButtonGroup,
  },
  data() {
    const self = this;
    return {
      tipShow: true,
      val: true,
      url: '',
      save: false,
      isDefault: false,
      footerButtons: [
        {
          action: 'cancel',
          type: 'disabled',
          title: '重置',
          size: 'lg',
          onClick() {
            self.clear();
          },
        },
        {
          action: 'ok',
          title: '确定',
          size: 'lg',
          type: 'disabled',
          onClick() {
            self.saveImg();
          },
        },
      ],
    };
  },
  mounted() {
  },
  methods: {
    saveImg() {
      this.$refs.signature.saveAsJpg();
    },
    saveAsJpg(data) {
      const res = {
        img: data,
        isDefault: this.isDefault,
      };
      this.$root.eventHub.$emit('signatureData', res);
      // this.goBack();
    },
    clear() {
      this.$refs.signature.clear();
      this.footerButtons[0].type = 'disabled';
      this.footerButtons[1].type = 'disabled';
    },
    isEmpty() {
      this.footerButtons[0].type = 'disabled';
      this.footerButtons[1].type = 'disabled';
    },
    onEnd() {
      this.footerButtons[0].type = 'default';
    },
    onBegin() {
      this.footerButtons[1].type = 'share';
    },
    goBack() {
      this.$destroy();
      this.$router.go(-1);
    },
  },
  computed: {
  },
};
</script> 
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.sign-tip{
  .px2rem(font-size,28);
  .px2rem(margin-left,30);
  .px2rem(margin-bottom,24);
  .px2rem(padding-top,24);
  color: #666666;
}
.signature-container {
  .px2rem(width,750);
  .px2rem(height,750);
  width: 100%;
  background: #eee;
}
.h3-list-item{
  .px2rem(margin-top,24);
}
#canvas {
  background: #fff;
  cursor: default;
  border: 0 !important;
}
#keyword-box {
  margin: 10px 0;
}
.footer{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
</style>