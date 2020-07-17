<template>

  <l-label
    :title="data.Options.DisplayName"
    :required="data.Options.Permission === 2"
    :expand="controlFormatValue[data.Type].expand"
    @handleExpand="handleExpand($event, data)"
  >
    <l-text
      v-if="controlFormatValue[data.Type].expand && !expandStatus"
      :data="setCloseContext(data.Type, data.Options, data.ChildControls.length)"
      class="grid-view-simple"
    ></l-text>
    <component
      :is="controlFormatValue[data.Type].component"
      :data="controlFormatValue[data.Type]"
      :attrs="data.Options"
      v-else
    >
      <template v-if="data.Type === formControlType.FormGridView">
        <List
          v-for="(item,index) in data.ChildControls"
          :key="index"
          :data="item"
        ></List>
      </template>
    </component>

  </l-label>

</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { ControlFormatValue } from './control-format-value';
import { FormControlType } from '@/light-app/config/form-control-type';
import {
  LLabel,
  LText,
  LButton,
  LSmButton,
  LPhoto,
  LGridView,
  LDrag,
  LAddress,
  LCheckbox
} from '@/light-app/components';
const LightApp = namespace('LightApp');
@Component({
  name: 'List',
  components: {
    LLabel,
    LText,
    LButton,
    LSmButton,
    LPhoto,
    LGridView,
    LDrag,
    LAddress,
    LCheckbox
  }
})
export default class List extends Vue {
  @Prop()
  data!: any;
  controlFormatValue: any = ControlFormatValue;
  formControlType: any = FormControlType;
  expandStatus: boolean = false; // 正在展开或收起的字段
  @LightApp.State('isWorkflow') isWorkflow;

  /**
   * 字段收起的缩略内容
   */
  setCloseContext(type, options, controlLen) {
    const attrs: any = {
      type: 'text',
      placeholder: ''
    };
    if (type === FormControlType.FormCheckboxList) {
      const len = options.DefaultItems.length;
      attrs.placeholder = `已设置${len}个选项`;
    }
    if (type === FormControlType.FormGridView) {
      attrs.placeholder = `已设置${controlLen}个字段`;
    }
    return attrs;
  }
  
  /**
   * 字段收起的传值
   */
  handleExpand(value, e) {
    this.expandStatus = value;
  }
}
</script>

<style lang='less' scoped>
</style>
