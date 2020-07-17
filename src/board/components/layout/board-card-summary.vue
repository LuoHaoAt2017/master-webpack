<script lang="ts">
import BoardCardImage from './controls/board-card-img.vue';
import BoardCardText from './controls/board-card-text.vue';
import BoardCardCheckbox from './controls/board-card-checkbox.vue';
import BoardCardUnit from './controls/board-card-unit.vue';
import BoardCardAttachment from './controls/board-card-attachment.vue';
import { FormControlType } from '../../typings/const';

export default {
  functional: true,
  props: {
    type: {
      type: Number,
      required: true,
    },
    value: {
      type: [String, Number, Array, Object],
      required: true,
    },
    handler: Function,
  },
  render (createElement, { props, children }) {
    let comp;
    const compProps = {
      value: props.value,
      type: props.type,
      handler: props.handler,
    };
    if (props.value === '--') {
      return createElement(BoardCardText, {
        props: compProps,
      }, children);
    }
    switch (props.type) {
      case FormControlType.FormPhoto:
        comp = BoardCardImage;
        break;
      case FormControlType.FormDropDownList:
      case FormControlType.FormCheckboxList:
        comp = BoardCardCheckbox;
        break;
      case FormControlType.FormCreater:
      case FormControlType.FormOwner:
      case FormControlType.FormOwnerDepartment:
      case FormControlType.FormUser:
      case FormControlType.FormMultiUser:
      case FormControlType.FormDepartment:
      case FormControlType.FormMultiDepartment:
        comp = BoardCardUnit;
        break;
      case FormControlType.FormAttachment:
        comp = BoardCardAttachment;
        break;
      case FormControlType.FormQuery:
        comp = BoardCardText;
        compProps.value = props.value[0].Name;
        break;
      case FormControlType.FormAreaSelect:
        comp = BoardCardText;
        const address = JSON.parse(props.value);
        const adname = `${address.adname} ${address.Detail}`;
        compProps.value = adname;
        break;
      case FormControlType.FormMap:
        comp = BoardCardText;
        compProps.value = JSON.parse(props.value).Address;
        break;
      default:
        comp = BoardCardText;
        break;
    }
    return createElement(comp, {
      props: compProps,
    }, children);
  },
};

</script>
<style lang='less' scoped>
</style>
