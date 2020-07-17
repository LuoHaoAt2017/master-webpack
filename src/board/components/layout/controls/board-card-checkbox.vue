<script lang="ts">

const Colors = ['#C9E2FF', '#C7F4FF', '#D9F7BE', '#FFD8BF', '#FFD6E7',
  '#EFDBFF', '#D9F7BE', '#B3FFE3', '#FFEFA8', '#E3E6EC'];
const FontColors = ['#1448CC', '#1490D9', '#389E0D', '#D4380D',
  '#C41D7F', '#722ED1', '#D92332', '#00856E', '#D98D00', '#0F1C35'];

export default {
  functional: true,
  props: {
    type: {
      type: Number,
      required: true,
    },
    value: {
      type: [Array, String],
    },
  },
  render (h, { props }) {
    const cls = 'board-card__field-checkbox';
    const childrens: any = [];
    let items = props.value;
    if (typeof items !== 'string') {
      // items = items.split(';');
      items = items.join(';');
    }
    // items.forEach((item, index) => {
    //   const idx = index % 10;
    //   childrens.push(h('span', [`${item}`]));
    // });
    return h('div', { class: [cls] }, items);
  },
};
</script>

<style lang='less'>
@import '~@/styles/light-app.less';
.board-card__field-checkbox {
  .px2rem(line-height, 44);
   overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  display:-moz-box;
  word-break: break-all;
  /* autoprefixer: ignore next*/
  -moz-box-orient:vertical;
  -moz-line-clamp: 3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
