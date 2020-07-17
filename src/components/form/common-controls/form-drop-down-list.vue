<template>
  <ControlWrapper
    class="form-drop-down-list"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-radio-list
      ref="dropdown"
      :title="options.DisplayName"
      :options="items"
      :showMode="options.selectshowmode"
      :value="displayValue"
      confirmText=""
      :editable="editable"
      :placeholder="editable ? placeholder : ''"
      :tip="options.description"
      :required="editable && options.Required"
      :show="pickerShow"
      :showSearch="showSearch"
      :showEmptyOptions="showEmptyOptions"
      :layout="controlLayout"
      @onClear="onClear"
      @onScroll="onScroll"
      @onChange="onChange"
      @searchChange="onSearch"
      @onShow="onShow"
      @onHide="onHide"
    >
      <p v-show="hasMore && loading" class="dropdown-text">
        正在加载...
      </p>
    </h3-radio-list>
  </ControlWrapper>
</template>

<script lang="ts">
import { H3Radio } from 'h3-mobile-vue';
import { Component, Watch, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import mixin from '../mixins/base-controler';
import { GetSchemaPropertyValues } from '../../../service/get-data';
import { setLeft } from '../../../config/dingtalk-interface';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { FormDropDownListOptions } from '@/lib/form-logic/types/control-options-map';
import ControlWrapper from '../shared/control-wrapper.vue';
import debounce from 'lodash/debounce';

const FormVM = namespace('Form/ViewModel');

  @Component({
    components: {
      H3RadioList: H3Radio.List,
      ControlWrapper,
    },
  })
export default class FormDropDownList extends Mixins(mixin) {
    @FormVM.Action(ViewModelAction.SETDEFAULTITEMS) setDefaultItems: any;

    placeholder: string = '请选择';

    skip: number = 0;

    // 关联表单数据 - 分页参数
    limit: number = 20;

    // 关联表单数据 - 分页参数
    searchKey: string = '';

    scopeType: number = 4;

    sheetData: string = '';

    hasMore: boolean = false;

    // 是否加载更多
    defaultItems: any[] = [];

    // 数据源
    pickerShow: boolean = false;

    showSearch: boolean = false;

    onSearch: any;

    loading: boolean = false;

    options!: FormDropDownListOptions;

    get isMappingfield () {
      return this.options.boschemacode && this.options.mappingfield;
    }

    get items () {
      let defaultItems = this.defaultItems;
      if (!this.isMappingfield) {
        defaultItems = this.defaultItems.filter(({ Text }) => {
          return Text.indexOf(this.searchKey) !== -1;
        });
        this.showSearch = this.searchKey !== '' || defaultItems.length > 10;
      }
      return defaultItems.map((item: any) => {
        return { value: item.Value, label: item.Text };
      });
    }

    get displayValue () {
      return this.value.Text || this.value.Value;
    }

    get showEmptyOptions () {
      return !this.options.Required;
    }

    created () {
      this.defaultItems = this.options.defaultItems;

      this.onSearch = debounce((val) => {
        this.searchKey = val.replace(/^\s+|\s+$/gm, '');
        this.skip = 0;
        this.limit = 20;
        this.getDropdownDefaultItems(true);
      }, 300);
    }

    async getDropdownDefaultItems (isSearch?: boolean) {
      this.loading = true;
      const schemaCode = this.$parent.form.$responseContext.SchemaCode;
      const data = await GetSchemaPropertyValues(
        this.options.boschemacode,
        this.searchKey,
        this.options.mappingfield,
        this.skip,
        this.limit,
        this.options.filterRule,
        this.scopeType,
        schemaCode,
        this.sheetData,
      );

      if (data.Successful) {
        const { list, hasMore } = data.ReturnData;
        const newData = list;
        const defaultItems: object[] = [];
        this.hasMore = hasMore;
        for (const val of newData) {
          const tempVal = val || '--';
          const valObj = { Value: tempVal, Text: tempVal };
          defaultItems.push(valObj);
        }
        if (isSearch) {
          this.defaultItems = [...defaultItems];
        } else {
          this.defaultItems = [...this.defaultItems, ...defaultItems];
        }
        this.showSearch = this.searchKey !== '' || this.defaultItems.length > 10;
        this.$nextTick(() => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }

    // 选中处理
    onChange (item: H3.Control.ItemValue) {
      this.clearValid();
      if (typeof item === 'object') {
        this.value = { Value: item.value, Text: item.label };
      } else {
        this.value = {};
      }
    }

    onScroll (event: Event) {
      if (this.isMappingfield && this.hasMore && !this.loading) {
        const target = event.target as any;
        const scrollTop = target.scrollTop;
        const contentHeight = target.offsetHeight;
        const scrollHeight = target.scrollHeight;
        // 滚到底部
        if (scrollHeight - scrollTop - contentHeight <= 10) {
          this.skip += 20;
          this.limit += 20;
          this.getDropdownDefaultItems();
        }
      }
    }

    onClear () {
      this.value = {};
    }

    onShow () {
      this.clearValid();
      if (this.isMappingfield) {
        this.hasMore = !!this.options.boschemacode; // 如果数据源是关联表单则默认有更多数据
        this.defaultItems = [];
        this.sheetData = '';
        const result = this.setDefaultItems({
          namespace: this.namespace,
        });
        result.then((response: object) => {
          this.sheetData = JSON.stringify(response);
          this.searchKey = '';
          this.skip = 0;
          this.limit = 20;
          this.getDropdownDefaultItems();
        });
      } else {
        this.defaultItems = this.options.defaultItems;
      }
      this.pickerShow = true;
      this.backStack.push(() => {
        this.pickerShow = false;
      });
    }

    onHide () {
      this.backStack.pop();
    }
}
</script>

<style lang="less">
  .dropdown-text{
    text-align: center;
    color: #ddd;
  }
</style>
