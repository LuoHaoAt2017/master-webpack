<template>
  <div class="board-card__field-photo">
    <template v-for="(photo, index) in formatValue">
      <div
        :key="index"
        @click="previewImg(index)"
        class="board-card__img"
      >
        <img v-lazy="photo.thumbnail" />
        <div
          v-if="index === 3 && value.length > 4"
          class="more"
        >+{{ value.length - 3 }}张</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { IBoardCardImage } from '../../../typings';
import { baseUrl } from '@/config/env';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
import { GetDownloadFileUUIDs } from '@/service/get-data';

@Component
export default class BoardCardImg extends Vue {
  @Prop({
    type: Array,
    default: () => [],
  }) value!: IBoardCardImage[]; // 图片

  @State('corpId') corpId ;

  get formatValue() {
    return this.value.slice(0,4);
  }

  get imgPreviewUrlHandler() {
    const paramStr = this.corpId ? `corpid=${this.corpId}&uid=` : 'uid=';
    return `${baseUrl}/Form/DownloadFileByUUID?${paramStr}`;
  }

  /**
   * 预览图片
   */
  async previewImg (index) {
    const res = await this.getUUId();
    if (res) {
      H3PluginDeveloper.IHidePreLoader();
      const photos = this.value.map(image => ({
        title: image.name,
        url: `${this.imgPreviewUrlHandler}${res[image.code]}`,
      }));
      const options = {
        images: photos,
        index,
      };
      this.$imageviewer.show(options);
    }
    
  }

  async getUUId() {
    const attachmentIds = this.value.map(item => item.code);
    const attachmentId = attachmentIds.join(';');
    H3PluginDeveloper.IShowPreLoader('正在生成预览图片...');
    let res = await GetDownloadFileUUIDs(attachmentId);
    return res;
  }

}

</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.board-card__field-photo {
  display: flex;
  .board-card__img:last-child {
    margin-right: 0;
  }
}
.board-card__img {
  position: relative;
  .px2rem(width, 118);
  .px2rem(height, 118);
  .px2rem(margin-right, 24);
  img {
    width: 100%;
    height: 100%;
    .px2rem(border-radius, 6);
  }
  .more{
    position: absolute;
    background: #333;
    left: 0;
    right: 0;
    bottom: 0;
    .px2rem(height, 42);
    .px2rem(line-height, 42);
    color: #333;
    background: #fff;
    text-align: center;
    .px2rem(font-size, 20);
    opacity: 0.8;
  }
}
</style>
