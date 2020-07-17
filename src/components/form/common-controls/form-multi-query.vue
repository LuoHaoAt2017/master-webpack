<template>
  <ControlWrapper
    class="form-multi-query"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-field
      :class="wrapCls"
      :label="options.DisplayName"
      :tip="options.description"
      :required="editable && options.Required"
      :showIcon="editable"
      :layout="controlLayout"
      @iconClick="chooseItems"
      @contentClick="chooseItems"
    >
      <p class="h3-field-placeholder" v-text="placeholder"></p>
      <i
        slot="extra"
        class="h3yun_All form-related-manycho"
        style="color: #999;"
        @click.stop="chooseItems"
      ></i>
      <div v-show="value.length" class="form-query-content">
        <div class="content" :style="contentStyle">
          <span
            v-for="(item,index) in tempValue"
            :key="index"
            class="content-text"
            :class="{clickable: !editable}"
            @click="selectTagItem(item)"
          >{{ item.name }}</span>
        </div>
        <div
          v-if="!editable && value && value.length > 3"
          class="more"
          @click="toggleMore"
        >
          <span class="aufont" :class="[expanded ? 'icon-base-up' : 'icon-base-down']"></span>
          {{ toggleText }}
        </div>
      </div>
      <div v-if="valid.empty" class="error-wrap"></div>
    </h3-field>
  </ControlWrapper>
</template>
<script lang="ts">
import { H3Field } from 'h3-mobile-vue';
import { Component, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';
import { FormQueryOptions } from '@/lib/form-logic/types/control-options-map';

@Component({
  components: {
    H3Field,
    ControlWrapper,
  },
})
export default class FormMultiQuery extends Mixins(baseControler) {
  ismultiple:boolean = true;

  // bizObjectId:string = '';

  ObjectId: string = '';

  contentHeight:number|string = 0;

  contentMaxHeight:number|string = 0;

  toggleText: string = '更多';

  expanded: boolean = false;

  options!: FormQueryOptions;

  get wrapCls () {
    return {
      error: this.valid.empty,
    };
  }

  get contentStyle () {
    return {
      height: (!this.editable && !this.expanded && this.contentHeight > this.contentMaxHeight) ? this.contentMaxHeight + 'px' : 'auto',
    };
  }

  get tempValue () {
    if (this.value === undefined || this.value == null || this.value === '') {
      return [];
    }
    return (!this.editable && this.value.length > 3 && !this.expanded) ? this.value.slice(0, 3) : this.value;
  }

  get placeholder () {
    const value = this.value;
    if (!this.editable) {
      return '';
    }
    return value.length > 0 ? `已选择: ${value.length}个` : '请选择';
  }
  get bizObjectId () {
    const parent = this.$parent as any;
    return parent.bizObjectId;
  }
  created () {
    // this.bizObjectId = this.namespace.split('/')[0];
  }

  async chooseItems () {
    this.clearValid();
    if (!this.editable) return;
    setTimeout(async () => {
      const schemaCode = this.$parent.form.$responseContext.SchemaCode;
      const filterDataResult = await this.getAssociationFilterData();
      const sheetdata = filterDataResult ? JSON.stringify(filterDataResult) : '';
      this.$router.push({
        name: 'formquery',
        params: {
          boschemacode: this.options.boschemacode,
          curcode: schemaCode,
          datafield: this.dataField,
          rowid: '',
          ismultiple: this.ismultiple.toString(),
          isSingleQuery: 'false',
          sheetdata,
          ObjectId: this.ObjectId,
          value: this.value,
          namespace: this.namespace,
          bizObjectId: this.bizObjectId,
          isSecondaryForm: this.isSecondaryForm,
        },
      });
    });
  }

  getAssociationFilterData () {
    // const [bizObjectId,, rowId] = this.namespace.split('/');
    return this.queryFilterData({
      bizObjectId: this.bizObjectId, 
      dataField: this.dataField, 
      rowId: (this.$parent as any).rowId,
    });
  }

  selectTagItem (item) {
    if (this.editable) {
      return;
    }
    this.$router.push({
      name: 'formPage',
      params: {
        schemaCode: this.options.boschemacode,
        bizObjectId: item.objectId,
      },
      query: {
        refleshRoute: '1',
        schemaCode: this.options.boschemacode,
        bizObjectId: item.ObjectId || item.objectId,
        reScroll: '1',
      },
    });
  }

  toggleMore () {
    this.expanded = !this.expanded;
    if (!this.expanded) {
      this.toggleText = '更多';
    } else {
      this.toggleText = '收起';
    }
  }
}
</script>

<style lang="less">
@import '~@/styles/form-base.less';
.form-multi-query {
  .form-query-content{

    .content{
      overflow: hidden;
      .content-text{
        box-sizing: border-box;
        font-size: 15px;
        display: inline-block;
        .px2rem(line-height, 42);
        .px2rem(margin-right, 32);
        .px2rem(margin-bottom, 29);
        .px2rem(padding-left, 16);
        .px2rem(padding-right, 16);
        background-color: #F5F5F5;
        &.clickable{
          color: #1890FF;
        }
      }
    }
    .more{
      .px2rem(padding-bottom, 24);
      text-align: right;
      color: #2970ff;
      font-size: 15px;
    }
  }
}
</style>
