<script lang="ts">

/**
 * 获取附件不同类型icon
 */
const getAttachmentIcon = (fileName: string) => {
  let ext = fileName.substr(fileName.lastIndexOf('.') + 1);
  if (!ext) {
    return 'unkown-file unkown';
  }
  ext = ext.toLowerCase();
  if (['doc', 'docx'].indexOf(ext) > -1) {
    return 'word-file word';
  }
  if (['ppt', 'pptx'].indexOf(ext) > -1) {
    return 'ppt-file ppt';
  }
  if (['xls', 'xlsx'].indexOf(ext) > -1) {
    return 'excel-file excel';
  }
  if (['pdf'].indexOf(ext) > -1) {
    return 'pdf-file pdf';
  }
  if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'tif', 'exif', 'svg', 'webp', 'pcs'].indexOf(ext) > -1) {
    return 'picture-file picture';
  }
  if (['rar', 'zip', '7z', 'tar', 'gz', 'jar'].indexOf(ext) > -1) {
    return 'zip-file zip';
  }
  if (['txt', 'ttf'].indexOf(ext) > -1) {
    return 'text-file text';
  }
  if (['avi', 'wma', 'rmvb', 'rm', 'flash', 'mp4', 'mid', '3gp', 'webp'].indexOf(ext) > -1) {
    return 'video-file video';
  }
  if (['mp3', 'mov', 'flv', 'mkv', 'mpg'].indexOf(ext) > -1) {
    return 'music-file music';
  }
  return 'unkown-file unkown';
};

export default {
  functional: true,
  props: {
    value: {
      type: [Array, Object],
    },
    handler: Function,
  },
  render (h, { props }) {
    const childrens: any = [];
    const items = props.value;
    const formatItems = items.slice(0, 4);
    formatItems.forEach((item, index) => {
      const icon = getAttachmentIcon(item.name);
      const child:any = [];
      if (index === 3 && items.length > 4) {
        child.push(h('span', {
          class: 'more',
          on: {
            click: props.handler,
          },
          domProps: { innerHTML: `+${items.length - 3}` },
        }, []));
      }
      childrens.push(h('span', { class: [`icon h3yun_All ${icon}`] }, child));
    });
    return h('div', { class: ['board-card__field-attachment'] }, childrens);
  },
};
</script>
<style lang='less'>
@import '~@/styles/light-app.less';
.board-card__field-attachment {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  span.icon {
    display: inline-block;
    position: relative;
    .px2rem(width, 114);
    .px2rem(height, 114);
    .px2rem(line-height, 114);
    .px2rem(margin-right, 24);
    text-align: center;
    .px2rem(font-size, 100);
    &:last-child {
      margin-right: 0;
    }
    &.picture,
    &.excel {
      color: #52c41a;
    }
    &.ppt,
    &.pdf {
      color: #ff4d4f;
    }
    &.txt {
      color: #23b7ff;
    }
    &.zip {
      color: #ffaf06;
    }
    &.video {
      color: #0dd1a2;
    }
    &.word {
      color: #2565f1;
    }
    &.music {
      color: #f759ab;
    }
    &.unkown {
      color: #777f8d;
    }
    &:last-child{
      margin-right: 0;
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
  
}

</style>
