<template>
  <h3-field 
    :class="wrapCls"
    :tip="tip"
    :errMsg="geterrMsg" 
    :label="title" 
    :showIcon="editable && !readonly"
    :required="required"
    :readOnly="!editable || readonly"
    @iconClick="toSelectPage"
    @contentClick="toSelectPage">
      <div :class="prefixCls+'-content-wraper'" v-text="selectUserDisplayName" v-if="selectUserDisplayName"/>
      <div :class="prefixCls+'-placeholder'" v-text="placeholder" v-else/>
  </h3-field>
</template>
<script>
import cx from 'classnames';
import h3List from '../h3-list/h3-list';
import h3ListItem from '../h3-list/h3-list-item';
import { H3Field, H3Label } from 'h3-mobile-vue';

export default {
  name: 'h3-user',
  components: {
    h3List,
    h3ListItem,
    H3Field,
    H3Label,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'h3-user',
    },
    title: String,
    disabled: Boolean,
    required: Boolean,
    editable: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: String,
    objectId: {
      type: String,
      default: '1234567890',
    }, // BizObjectID
    unitSelectionRange: String, // 选人范围
    showUnActive: Boolean,
    userVisible: Boolean,
    orgUnitVisible: Boolean,
    dataField: {
      type: String,
      required: true,
    },
    defaultSelectItem: [],
    layout: {
      type: String,
      default: 'h',
      validator: val => ['h', 'v'].indexOf(val) > -1,
    },
    tip: {
      type: String,
      default: '',
    },
    errMsg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedItem: this.defaultSelectItem || [],
    };
  },
  created() {
    this.$root.eventHub.$on('assignVal', this.assignVal);
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    toSelectPage() {
      if (this.disabled || this.readonly) {
        return;
      }
      this.$router.push({
        name: 'userselect',
        params: {
          showUnActive: this.showUnActive,
          unitSelectionRange: this.unitSelectionRange,
          userVisible: this.userVisible,
          orgUnitVisible: this.orgUnitVisible,
          isMultiple: false,
          keyName: this.dataField,
          ObjectId: this.objectId,
          value: this.selectedItem,
        },
      });
    },
    // 把选中的部门或人赋值给该控件
    assignVal(itemArr, keyName, objectId) {
      if (objectId !== this.objectId || keyName !== this.dataField) {
        return;
      }
      this.selectedItem = itemArr || [];
    },
    removeSelectItem(item) {
      this.selectedItem = this.selectedItem.filter(s => s.ObjectId !== item.ObjectId);
    },
    toggleTip() {
      alert('tip toggle');
    },
  },
  computed: {
    selectUserDisplayName() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        return this.selectedItem[0].Name || this.selectedItem[0].DisplayName;
      }
      return '';
    },
    arrowStr() {
      let arrow = 'horizontal';
      if (this.disabled || this.readonly) {
        arrow = '';
      }
      return arrow;
    },
    wrapCls() {
      return cx(this.prefixCls, {
        [`${this.prefixCls}-disabled`]: this.disabled,
        [`${this.prefixCls}-view`]: this.readonly || !this.editable,
      });
    },
    geterrMsg() {
      if (this.editable && !this.readonly) {
        return this.errMsg;
      }
      return '';
    },
  },
  watch: {
  },
};
</script>
<style lang="less">

  @userPrefixCls: h3-user;
  @font-size-field-text: 16px;
  @field-label-color: #333333;
  @field-text-color: #333333;
  @field-label-color-view: #999999;

  .@{userPrefixCls} {
    background-color: #fff;
    font-size: @font-size-field-text;
    .h3-field-layout-h-label {
      color: @field-label-color;
    }
    .@{userPrefixCls}-content-wraper {
      padding-left:16px;
      color: @field-text-color;
    }
    &-disabled {
      opacity: 0.5;
    }
    &-required {
      color: red;
    }
    &-placeholder {
      color: @field-label-color-view;
      padding-left:16px;
    }
    .h3-field-layout-h-label {
      position: relative;
      padding: 11px 0;
      padding-right: 20px;
      width: 118px;
      line-height: 22px;
    }
  }
</style>


