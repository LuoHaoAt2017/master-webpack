<script lang="ts">
import { FormControlType } from '../../../typings/const';

export default {
  functional: true,
  props: {
    type: {
      type: Number,
      required: true,
    },
    value: {
      type: [String, Number],
    },
  },
  render (createElement, { props }) {
    let cls = '';
    switch (props.type) {
      case FormControlType.FormTextBox:
      case FormControlType.FormTextArea:
        cls = 'board-card__field-text';
        break;
      case FormControlType.FormQuery:
        cls = 'board-card__field-query';
        break;
      case FormControlType.FormAreaSelect:
      case FormControlType.FormMap:
        break;
      default:
        break;
    }

    return createElement('div', { class: [cls] }, [`${props.value || '--'}`]);
  },
};
</script>

<style lang='less'>
.board-card__field-text {
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
.board-card__field-query {
  color: #107fff;
  line-height: 22px;
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
