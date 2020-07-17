 <template>
 <h3-field 
    :class="wrapCls"
    :tip="tip"
    :errMsg="errMsg" 
    :label="title" 
    :showIcon="showIcon"
    :required="required"
    :activeCls="activeCls"
    :readOnly="!editable || readonly"
    @iconClick="toSelect"
    @contentClick="toSelect">
      <div :class="prefixCls+'-placeholder'" v-text="placeholder" v-if="!selectedItem.ObjectId && !readonly"></div>
      <ul class="h3-association-selected-wrapper clearfix" v-else>
        <li is="h3-association-tag" 
        :selectedItem="selectedItem"
        @itemClick="itemClick"
        v-touch="{'activeClass': 'h3-association-select-selection__choice-active'}"
        v-if="selectedItem.ObjectId"/>
      </ul>
  </h3-field>
</template>
<script>
import cx from 'classnames';
import { H3Field, H3Label } from 'h3-mobile-vue';
import h3AssociationTag from './h3-association-tag';
import h3Icon from '../h3-icon/index';
import touch from '../../directives/touch';

// const prefixListCls = 'h3-list';
// 流水号，关联属性，公式型控件等显示型的控件
export default {
  name: 'h3-association',
  components: {
    H3Label,
    h3AssociationTag,
    h3Icon,
    H3Field,
  },
  directives: {
    touch,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'h3-association',
    },
    title: String,
    value: Object,
    disabled: Boolean,
    required: Boolean,
    editable: {
      type: Boolean,
      default: true,
    },
    readonly: Boolean,
    placeholder: String,
    onChange: Function,
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
    showScan: Boolean,
    labelWidth: String,
    showIcon: Boolean,
  },
  data() {
    return {
      selectedItem: this.value || {},
      showTip: false,
    };
  },
  created() {
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    // 扫码事件
    scanClick() {
      this.$emit('scanClick', this);
    },
    // 单个关联表单点击，跳转到对应的表单
    itemClick(val) {
      this.$emit('itemClick', val);
    },
    toSelect() {
      if (this.disabled || this.readonly || !this.editable) {
        return;
      }
      this.$emit('toSelect');
    },
  },
  computed: {
    geterrMsg() {
      if (this.editable && !this.readonly) {
        return this.errMsg;
      }
      return '';
    },
    wrapCls() {
      return cx(
        this.prefixCls,
        `${this.prefixCls}-item`,
        this.className,
        {
          [`${this.prefixCls}-view`]: this.readonly || !this.editable,
          [`${this.prefixCls}-disabled`]: this.disabled,
          [`${this.prefixCls}-error`]: this.error || this.errMsg || !this.innerValue,
          [`${this.prefixCls}-focus`]: this.innerFocus,
          [`${this.prefixCls}-android`]: this.innerFocus,
          [`${this.prefixCls}-view`]: this.readonly || !this.editable,
        },
      );
    },
    activeCls() {
      if (this.editable && !this.readonly) {
        return 'h3-common';
      }
      return;
    },
  },
  watch: {
    selectedItem(val) {
      this.$emit('input', val);
      this.$emit('onChange', val);
      if (this.onChange) {
        this.onChange(val);
      }
    },
    value(val) {
      this.innerValue = val;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@prefixCls: h3-association;
@listPrefixCls: h3-list;
@field-label-color: #333333;
@field-text-color: #333333;
@field-label-color-view: #999999;

.clearfix::after {
  content: '';
  width: 0;
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}
.clearfix {
  zoom: 1;
}

.@{prefixCls} {
  .@{prefixCls}-label {
    color:@field-label-color;
  }
  .h3-field-box .h3-PR {
    padding-bottom:11px;
  }
}

.@{prefixCls}-view {
  .@{prefixCls}-label {
    color: @field-label-color-view !important;
    .h3-field-layout-h-label,.h3-field-layout-h-label {
      color: @field-label-color-view !important;
    }
  }
}
  .@{prefixCls}-item {
    min-height: @list-item-height;
  }
  &:not(:last-child) {
    .@{listPrefixCls}-line {
      .hairline('bottom');
    }
  }
  .@{prefixCls}-label {
    color:@field-label-color;
    font-size: @font-size-heading;
    margin-left: 0;
    margin-right: 8px;
    text-align: left;
    padding: 2 * @hd 0;
    margin-top: 2px;
    position: relative;

    .h3-field-layout-h-label {
      position: relative;
      padding: 11px 0;
      padding-right: 20px;
      width: 118px;
      line-height: 22px;
    }
  }

    .@{prefixCls}-placeholder {
      color: @field-label-color-view;
      margin-top: 10px;
    }
    .@{prefixCls}-selected-wrapper {
      list-style: none;
      li {
        list-style: none;
      }
    }
    .@{prefixCls}-select-selection__choice {
      border-radius: 4px;
      cursor: default;
      float: left;
      margin-right: 4px;
      margin-bottom:2px;
      max-width: 99%;
      position: relative;
      overflow: hidden;
      -webkit-transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      padding: 0px 10px 0 10px;
      background-color: #fff;
      box-sizing: border-box;
      border:1px solid #1890FF;
      // .hairline('all',#1890ff);
      height:29px;
      margin-top: 8px;
    }
    .@{prefixCls}-select-selection__choice-active {
       background-color: rgba(56,173,255,0.1) !important;
    } 
    .@{prefixCls}-select-selection__choice__content {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      -webkit-transition: margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      color:#1890FF;
      font-size: 12px;
      line-height:29px;
      height:29px;
    }

  .@{prefixCls}-clear {
    display: none;
    width: @icon-size-sm;
    height: @icon-size-sm;
    border-radius: @radius-circle;
    overflow: hidden;
    font-style: normal;
    color: @fill-base;
    background-color: @input-color-icon;
    background-repeat: no-repeat;
    .encoded-svg-background('input_item_delete');

    background-size: @icon-size-sm auto;
    background-position: 2 * @hd 2 * @hd;

    &-active {
      background-color: @input-color-icon-tap;
    }
  }
  &.@{prefixCls}-disabled {
    .@{prefixCls}-label {
      color: @color-text-disabled;
    }
  }

  .h3-association .h3-field-box .h3-PR{
    padding-top: 0;
  }
  
</style>

