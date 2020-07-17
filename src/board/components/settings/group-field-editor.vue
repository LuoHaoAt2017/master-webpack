<template>
  <h3-popup-modal
    v-model="visible"
    class="group-field-editor"
    maskClosable
    @toggle="toggle"
  >
    <template #header>
      <div class="editor-header">
        <div class="cancel" @click="hideSetModal">
          取消
        </div>
        <div class="name">
          {{ title }}
        </div>
        <div></div>
      </div>
    </template>
    <div ref="editorContent" class="editor-content">
      <div
        v-for="(item,index) in formatCtrols"
        ref="list"
        :key="item.FieldCode + index"
        class="group-item"
      >
        <!-- @click="select(item,index)" -->
        <h3-radio :control="true" :checked="item.checked" @change="select(item,index)">
          <div class="title">
            {{ item.DisplayName || '--' }}
          </div>
        </h3-radio>
      </div>
    </div>
  </h3-popup-modal>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import {
  H3Button, H3Scroll, H3SearchBar, H3Modal,
} from 'h3-mobile-vue';
import { H3Radio, H3PopupModal } from '@h3/thinking-ui';
import { IBoardControl } from '../../typings';
import { isDingtalk, isiOS } from '@/config/common';

@Component({
  name: 'group-field-editor',
  components: {
    H3Button,
    H3Scroll,
    H3SearchBar,
    H3Modal,
    H3Radio,
    H3PopupModal,
  },

})
export default class GroupFieldEditor extends Vue {
  @Prop({
    type: String,
    default: '请选择一个字段进行分组',
  })title!:string;

  @Prop({
    type: Boolean,
    default: false,
  })showModel!:boolean;

  @Prop({
    type: Array,
    default: () => [],
  })
  controls!: IBoardControl[];

  @Prop({
    type: String,
    default: '',
  })
  value!: string; // 已经选中的字段

  visible = false;

  get isDingtalk () {
    return isDingtalk;
  }

  /**
   * 格式化数据源
   */
  get formatCtrols () {
    return this.controls.map(opt => {
      if (this.value && this.value === opt.FieldCode) {
        this.$set(opt, 'checked', true);
      } else {
        this.$set(opt, 'checked', false);
      }
      return opt;
    });
  }

  /**
   * 获取选中的字段项
  */
  get selectField () {
    const item = (this.formatCtrols as any).find(it => it.checked === true);
    if (item) {
      return item;
    }
    return '';
  }

  @Watch('showModel')
  showModelChange (val) {
    if (val) {
      this.visible = true;
      this.scrollTo(); // 显示选中的字段
    } else {
      this.visible = false;
    }
  }

  created () {
  }

  mounted () {

  }

  hideSetModal () {
    this.$emit('closeModel');
  }

  toggle (val) {
    if (!val) {
      this.$emit('closeModel');
    }
  }

  /**
   * 滚动到选中的字段
  */
  scrollTo () {
    const panel = this.$refs.editorContent as any;
    let panelChild = this.$refs.list as any;
    const index = this.controls.findIndex(it => it.FieldCode === this.value);
    if (index > -1) {
      panelChild = (panelChild as any)[index];
      this.$nextTick(() => {
        const height = index * (panelChild as any).scrollHeight;
        (panel as any).scrollTop = height;
      });
    }
  }

  /**
   * 选择事件
  */
  select (item) {
    this.formatCtrols.forEach(it => {
      this.$set(it, 'checked', it.FieldCode === item.FieldCode);
    });
    if (this.selectField) {
      this.$emit('editorOk', this.selectField);
    }
    // this.$emit('showGroupList', item);
    this.$emit('closeModel');
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/light-app.less';
  .group-field-editor {
    touch-action: none;
    .editor-header{
      position:relative;
      .px2rem(height,112);
      .px2rem(line-height,112);
      .px2rem(padding-left,30);
      .px2rem(padding-right,30);
      // .px2rem(border-bottom-width, 1);
      // border-bottom-style: solid;
      // border-bottom-color: #EBEDF2;
      .cancel{
       position:absolute;
        color:#666;
        .px2rem(font-size, 30);
      }
      .name{
        color:@lightAppTextColor;
        font-weight: bold;
        .px2rem(font-size, 36);
        text-align: center;
      }
    }
    .editor-content{
      .px2rem(max-height, 668);
      overflow-x: hidden;
      overflow-y:auto;
       -webkit-overflow-scrolling: touch;
      >div {
        display: flex;
        align-items: flex-start;
        justify-content:flex-start;
        box-sizing: border-box;
        .px2rem(margin-left, 30);
        .px2rem(padding-right, 30);
        .px2rem(min-height, 90);
        .px2rem(line-height, 46);
        .px2rem(border-bottom-width, 1);
        border-bottom-style: solid;
        border-bottom-color: #EBEDF2;
        color: @lightAppTextColor;
        .h3think-radio {
          width:100%;
          height:100%;
          color:#777;
          align-items: flex-start;
          /deep/ .h3think-radio__wrap{
            .px2rem(padding-top,23);
            .px2rem(padding-bottom,23);
          }
         /deep/ .h3think-radio__label{
            width:100%;
            margin-right:0;
            height:100%;
            overflow: visible;
            white-space:normal;
          }
        }
        .title{
          // .px2rem(margin-left, 24);
          .px2rem(padding-top,20);
          .px2rem(padding-bottom,20);
          .px2rem(line-height, 46);
          .px2rem(font-size, 30);
          text-align: left;
        }
      }
    }
  }
</style>
