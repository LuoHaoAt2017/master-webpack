<template>
  <layout
    title="视频预览"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div class="video-preview">
      <video
        v-if="isIOS"
        autoplay="autoplay"
        controls="controls"
      >
        <source :src="videoSrc" type="video/mp4" />
        <source :src="videoSrc" type="video/ogg" />
        <source :src="videoSrc" type="video/mov" />
        您的浏览器不支持 video 标签。
      </video>
      <video
        v-else-if="isAndroid"
        autoplay="autoplay"
        controls="controls"
        :src="videoSrc"
      >
        您的浏览器不支持 video 标签。
      </video>
      <p v-else>
        不支持的操作系统类型
      </p>
    </div>
  </layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { baseUrl } from '../../config/env';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { isAndroid, isiOS } from '../../utils/index';
@Component({
  name: 'video-preview',
})
export default class VideoPreview extends Vue {
  getVideoUrl = `${baseUrl}/Form/GetDownloadFileUrls?AttachmentIdStr=`;

  attachmentId = '';

  videoSrc = '';

  get isAndroid () {
    return isAndroid;
  }

  get isIOS () {
    return isiOS;
  }

  created () {
    this.attachmentId = this.$route.params.attachmentId;
  }

  mounted () {
    this.getPreviewUrl(this.attachmentId);
  }

  getPreviewUrl (attachmentId) {
    const url = this.getVideoUrl + attachmentId;
    const self = this;
    $.ajax({
      type: 'POST',
      url,
      success (data) {
        if (data) {
          self.videoSrc = data[attachmentId];
        }
      },
      complete () {
        H3PluginDeveloper.IHidePreLoader();
      },
    });
  }

  goBack () {
    if (this.$store.state.excludeComp) {
      this.$store.state.excludeComp = this.$store.state.excludeComp.concat(['video-preview']);
    }
    this.$router.go(-1);
  }
}
</script>

<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.video-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  video {
    width: 100%;
    height: 400px;
  }
}

</style>