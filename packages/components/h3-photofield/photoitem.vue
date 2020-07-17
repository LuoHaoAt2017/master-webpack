<template>
  <div class="h3-PR h3-FL h3-photo-item" :style="wrapStyle">
    <div class="h3-photo-item-wrapper">
      <div
        class="h3-photo-item-img"
        :style="imgStyle"
        @click="handlePreview"
      />
    </div>
    
      <DelIcon v-if="!readOnly" class="h3-photo-delete-icon" @onClick="handleDelete" />
  </div>
</template>

<script>
import DelIcon from './delicon1';

export default {
  name: 'h3-photo-item',
  props: {
    name: {
      type: String,
    },
    width: {
      type: String,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
    },
    url: {
      type: String,
    },
    hGutter: {
      type: Number,
      default: 12,
    },
    vGutter: {
      type: Number,
      default: 14,
    },
  },
  components: {
    DelIcon,
  },
  methods: {
    handlePreview() {
      // this.onPreviewImage(this.index);
      this.$emit('onPreviewImage', this.index);
    },
    handleDelete() {
      // this.onDeleteImage(this.index);
      this.$emit('onDeleteImage', this.index);
    },
  },
  computed: {
    imgStyle() {
      return {
        backgroundImage: `url(${this.url})`,
      };
    },
    wrapStyle() {
      return {
        width: this.width,
        // height: this.width,
        paddingTop: this.width,
        height: 0,
        marginBottom: `${this.vGutter}px`,
        marginRight: `${this.hGutter}px`,
      };
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/icon/iconfont.css';
</style>



