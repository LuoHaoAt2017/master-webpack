 <template>
    <layout class="signature" :title="displayName" :leftOptions="{ preventGoBack: true }" @on-click-back="goBack">
    <div ref="signatureContainer" class="signature-container" id="signature-container">
      <div class="signature__title dp-font28">请在下方区域手写签名</div>
        <h3-signature ref="signature" @saveAsPng="saveAsPng" @isEmpty="isEmpty"
        :on-end="onEnd" :on-begin="onBegin" :height="canvasHeight" :width="canvasWidth"
        :clip="true" :clip-h="10" :clip-v="10" :min-width="1" :max-width="2.5">
        </h3-signature>
      <img class="rotate__btn" :class="{ 'rotate__btn-rotate' : isScreenRotate}" src="../../assets/img/signature-rotate.svg" @click="rotate">
      <div ref="footer" class="footer" :class="{'footer__more-padding' : deviceRatio > 1.9 && isIOS && !isScreenRotate}">
        <h3-button-group :buttonGroup="footerButtons" border-type="center-border"></h3-button-group>
      </div>
    </div>
    </layout>
</template>

<script>
import H3Signature from '../../../packages/widgets/h3-signature/index.vue';
// import H3ButtonGroup from '../../../packages/widgets/h3-button/h3-button-group2.vue';
import H3ButtonGroup from './button-group.vue';
import { isiOS } from '../../config/common';
import { closeApp } from '../../config/dingtalk-interface';
import { SaveTemporarySignature } from '../../service/form.service';
import { parseUrlParams } from '@/utils/url';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
// import VConsole from 'vconsole'
// let vConsole = new VConsole();

export default {
  name: 'signatureImg',
  components: {
    H3Signature,
    H3ButtonGroup,
  },
  data() {
    const self = this;
    return {
      clipH: 20,
      displayName: '添加签名',
      isDefault: false,
      footerButtons: [
        {
          action: 'cancel',
          type: 'disabled',
          title: '重置',
          size: 'lger',
          onClick() {
            self.clear();
          },
        },
        {
          action: 'ok',
          title: '确定',
          size: 'lger',
          type: 'disabled',
          onClick() {
            self.saveImg();
          },
        },
      ],
      routerFrom: '',
      canvasWidth: 414,
      canvasHeight: 375,
      isScreenRotate: false,
      deviceRatio: 1,
      isIOS: false
    };
  },
  created() {
    this.isIOS = isiOS;
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    this.deviceRatio = height / width;
    this.$root.eventHub.$on('clearSignature', () => {
      this.clear();
    });
  },
  mounted() {
    const canvasWidth = this.$route.params.screenWidth;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = 375;
  },
  activated() {
    this.clear();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.excludeComp = ['signatureImg'];
    next();
  },
  methods: {
    goBack () {
      const isPcSignature = this.isPcSignature();
      if (isPcSignature) {
        closeApp();
      } else {
        this.$router.go(-1);
      }
    },
    saveImg () {
      this.$refs.signature.saveAsPng();
    },
    saveAsPng (url) {
      const isPcSignature = this.isPcSignature();
      if (this.isScreenRotate) {
        this.rotateBase64Img(url, -90, (saveUrl) => {
          if (isPcSignature) {
            this.saveSignature(saveUrl);
          } else {
            this.$root.eventHub.$emit('setSignature', saveUrl);
            this.$router.go(-1);
          }
        });
      } else {
        if (isPcSignature) {
          this.saveSignature(url);
        } else {
          this.$root.eventHub.$emit('setSignature', url);
          this.$router.go(-1);
        }
      }
    },

    // 保存临时手写签名
    async saveSignature (url) {
      const params = parseUrlParams(window.location.href);
      const { AppId, BizObjectId, ActivityCode, SignatureFileKey } = params;
      const urls = encodeURIComponent(url);
      const content = urls.replace('%20', '+');
      const requestParams = {
        SchemaCode: AppId,
        Content: content,
        BizObjectId,
        ActivityCode,
        ContentType: 'image/png',
        SignatureFileKey,
      };
      const res = await SaveTemporarySignature(requestParams);
      if (res.Successful) {
        closeApp();
      } else {
        H3PluginDeveloper.IShowTip(
          '提示',
          res.ErrorMessage,
          () => {
            closeApp();
          },
          '3000',
        );
      }
    },

    // 是否PC手写签名扫码
    isPcSignature () {
      const val = false;
      const href = window.location.href;
      if (href.indexOf('IsPcSignature') !== -1) {
        return window.GlobalConfig.isPcSignature;
      }
      return val;
    },

    clear() {
      if (this.$refs.signature) {
        this.$refs.signature.clear();
      }
      this.footerButtons[0].type = 'disabled';
      this.footerButtons[1].type = 'disabled';
    },
    isEmpty() {
      this.footerButtons[0].type = 'disabled';
      this.footerButtons[1].type = 'disabled';
    },
    onEnd() {
      this.footerButtons[0].type = 'default';
      this.footerButtons[1].type = 'highLight';
    },
    onBegin() {
      // this.footerButtons[1].type = 'share';
    },
    rotate() {
      this.clear();
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      const ratio = height / width;
      // alert(ratio)
      const contentDOM = document.getElementById('signature-container');
      const canvasDOM = document.getElementById('canvas');
      if (!this.isScreenRotate) {
        contentDOM.style.width = height + 'px';
        contentDOM.style.height = width + 'px';
        contentDOM.style.transform = 'rotate(90deg)';
        contentDOM.style.top = (height - width) / 2 + 'px';
        contentDOM.style.left = 0 - (height - width) / 2 + 'px';
        canvasDOM.style.transform = 'rotate(-90deg)';
        this.canvasWidth = width - 2 * this.$refs.footer.offsetHeight;
        this.canvasHeight = height;
        this.isScreenRotate = true;
        if (ratio > 1.9 && isiOS) {
          canvasDOM.style.transformOrigin = "44% 20%";
        }
      } else {
        contentDOM.style.width = width + 'px';
        contentDOM.style.height = height + 'px';
        contentDOM.style.transform = 'none';
        contentDOM.style.top = 0 + 'px';
        contentDOM.style.left = 0 + 'px';
        canvasDOM.style.transform = 'none';
        this.canvasWidth = width;
        this.canvasHeight = 375;
        this.isScreenRotate = false;
        canvasDOM.style.transformOrigin = "44% 24%";
      }
    },
    rotateBase64Img(src, edg, callback) {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      var imgW;//图片宽度
      var imgH;//图片高度
      var size;//canvas初始大小

      if (edg % 90 != 0) {
          console.error("旋转角度必须是90的倍数!");
          throw '旋转角度必须是90的倍数!';
      }
      (edg < 0) && (edg = (edg % 360) + 360)
      const quadrant = (edg / 90) % 4; //旋转象限
      const cutCoor = {sx: 0, sy: 0, ex: 0, ey: 0}; //裁剪坐标

      var image = new Image();
      image.crossOrigin = "anonymous"
      image.src = src;

      image.onload = function () {

          imgW = image.width;
          imgH = image.height;
          size = imgW > imgH ? imgW : imgH;

          canvas.width = size * 2;
          canvas.height = size * 2;
          switch (quadrant) {
              case 0:
                  cutCoor.sx = size;
                  cutCoor.sy = size;
                  cutCoor.ex = size + imgW;
                  cutCoor.ey = size + imgH;
                  break;
              case 1:
                  cutCoor.sx = size - imgH;
                  cutCoor.sy = size;
                  cutCoor.ex = size;
                  cutCoor.ey = size + imgW;
                  break;
              case 2:
                  cutCoor.sx = size - imgW;
                  cutCoor.sy = size - imgH;
                  cutCoor.ex = size;
                  cutCoor.ey = size;
                  break;
              case 3:
                  cutCoor.sx = size;
                  cutCoor.sy = size - imgW;
                  cutCoor.ex = size + imgH;
                  cutCoor.ey = size + imgW;
                  break;
          }
          ctx.translate(size, size);
          ctx.rotate(edg * Math.PI / 180);
          ctx.drawImage(image, 0, 0);

          var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
          if (quadrant % 2 == 0) {
              canvas.width = imgW;
              canvas.height = imgH;
          } else {
              canvas.width = imgH;
              canvas.height = imgW;
          }
          ctx.putImageData(imgData, 0, 0);
          callback(canvas.toDataURL());
      };
    }
  },
  computed: {
  },
};
</script>
<style lang="less">
@import '../../styles/mixins.less';

.h3-list-line{
  border: none !important;
}
.sign-tip{
  .px2rem(font-size,28);
  .px2rem(margin-left,30);
  .px2rem(margin-bottom,24);
  .px2rem(padding-top,24);
  color: #666666;
}
.signature {
  position: relative;
}
.signature-container {
  .px2rem(width,750);
  .px2rem(height,750);
  width: 100%;
  height: 100%;
  background: #F5F5F5;
  position: absolute;
  top: 0;
  left: 0;
  transition: all .3s;
  .signature__title {
    color: #666666;
    .px2rem(height,92);
    .px2rem(line-height,92);
    .px2rem(padding-left,30);
  }
  .rotate__btn {
    .px2rem(width, 162);
    .px2rem(bottom,133);
    .px2rem(right,14);
    position: fixed;
    z-index: 999;
  }
  .rotate__btn-rotate {
    .px2rem(right,62);
  }
}
.h3-list-item{
  .px2rem(margin-top,24);
  border: none !important;
}
#canvas {
  background: #fff;
  cursor: default;
  border: 0 !important;
  background-image: url('../../assets/img/background.png');
  background-size: 100% 100%;
  transform-origin: 44% 24%;
}
#keyword-box {
  margin: 10px 0;
}
.footer{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  @supports (bottom: env(safe-area-inset-bottom)) {
    .signature-container .footer__more-padding{
      padding-bottom: env(safe-area-inset-bottom) !important;
    }
  }
</style>
