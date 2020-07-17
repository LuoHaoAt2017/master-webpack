<template>
  <div :class="wrapCls" :style="h3Style" >
    <h3-card-form @click.native="" 
      v-for="(item, index) in commentsLists" :key="index" v-if="index < 10">
      <template slot="aside">
        <img class="comment-circle-profile" v-if="item.profileUrl" :src="item.profileUrl" />
        <div v-else class="handler-name">{{item.name.substr(-2,2)}}</div>
      </template>
      <div>
        <div class="comment-title">
          <p>{{item.name}}</p>
          <p>{{item.time}}</p>
        </div>
        <div class="comment-details">
          <div class="comment-content">{{item.content}}</div>
          <div class="comment-img" v-if="item.img" >
            <img :src="photo.ThumbnailUrl" v-for="(photo,index) in item.img" :key="index" @click="onClickImg(photo)">  
          </div>
          <div class="comment-file" v-if="item.Files" v-for="(file,index) in item.Files" :key="index">
            <img :src="file.ThumbnailUrl" @click="onClickFile(file)">
            <span class="file-name">{{file.FileName}}</span>
            <span class="aufont icon-base-eye-o" @click="onClickEye(file)"></span>
            <span class="aufont icon-base-download" @click="onClickDownload(file)"></span>
          </div>
        </div>
      </div>
    </h3-card-form>
    <slot></slot>
  </div>
</template>
<script>
import cx from 'classnames';
import H3CardForm from '../../widgets/h3-card-data-list/index';

const prefixCls = 'h3-card-comment';
export default {
  name: 'h3-card-comment',
  components: {
    H3CardForm,
  },
  props: {
    className: String,
    h3Style: Object,
    commentsLists: Array,
  },
  data() {
    return {
    };
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
  },
  methods: {
    onClickImg(item) {
      this.$emit('onClickImg', item);
    },
    onClickFile(item) {
      this.$emit('onClickFile', item);
    },
    onClickEye(item) {
      this.$emit('onClickEye', item);
    },
    onClickDownload(item) {
      this.$emit('onClickDownload', item);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import './style/data-detail.less';

</style>