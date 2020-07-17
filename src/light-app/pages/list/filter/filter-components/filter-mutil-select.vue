<template>
  <div class="filter-mutil-select">
    <div class="attribute-rows attribute-rows-search" @click="searchClick">
      <h3-search-bar
        ref="searchBar"
        v-model.trim="searchText"
        placeholder="搜索"
        :onChange="onChange"
        :onBlur="onBlur"
      />
    </div>
    <div class="attribute-rows items-row">
      <ul class="radio-list">
        <li
          v-for="item in baseCondition"
          :key="item.id"
          class="filter-item item"
          :class="{'radio-item-active': filterValue.includes(`${item.id}`)}"
          @click="checkboxChange(item.id, item.name)"
        >
          <span
            class="icon h3yun_All"
            :class="[filterValue.includes(`${item.id}`) ? 'check-circle selected' : 'circle-o']"
          ></span>

          <template v-if="item.ext && isUserSelect">
            <img
              v-if="item.ext.Avatar"
              class="user-header"
              :src="item.ext.Avatar"
            />
            <div
              v-else
              class="user-header-name"
            >
              {{ item.ext.Name.substr(item.ext.Name.length - 1,1) }}
            </div>
          </template>
          <span
            class="label"
            :class="[isUserSelect ? '' : 'no-header']"
          >{{ item.name || '--' }}</span>
        </li>
      </ul>
      <div v-if="showNoData && hasSearched" class="no-data">
        搜索不到相关数据
      </div>
    </div>
    <equal-mate
      v-if="isMateEqual"
      :metaOperator="chooseMateOperator"
      @change="mateChange"
    />
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Emit, Watch, Inject,
} from 'vue-property-decorator';
import { FilterAttributeType, TableFilterType } from '@/light-app/config/list-const';
import { Column } from '@/light-app/typings/list';
import { H3SearchBar } from 'h3-mobile-vue';
import { FormControlType } from '@/light-app/config/form-control-type';
import { getColFilterById } from '@/light-app/service';
import debounce from 'lodash/debounce';
import EqualMate from './equal-mate.vue';

@Component({
  name: 'filterMultiSelect',
  components: {
    H3SearchBar,
    EqualMate,
  },
})
export default class filterMultiSelect extends Vue {
  @Prop()
  colId: string;

  @Prop()
  formCode: string;

  @Prop()
  colIndex: number;

  @Prop()
  colfilter: any;

  @Prop()
  colData: any;

  @Prop()
  defaultAttr: any;

  filterValue: string[] = [];

  filterName: string[] = [];

  searchText: string = '';

  baseCondition: any[] = [];

  showNoData: boolean = false;

  hasSearched:boolean = false;

  chooseMateOperator: number = 0;

  get userInfo () {
    return this.$store.state.UserInfo || {};
  }

  created () {
    this.getSearchItems = debounce(this.getSearchItems, 500);

    this.chooseMateOperator = this.colfilter.operator || 0;

    // hookData为true则从接口拿过滤项
    if (this.defaultAttr.options.hookData) {
      this.getSearchItems(this.formCode, this.colId);
    } else {
      this.baseCondition = this.defaultAttr.options.list;
    }
    // 还原值
    if (this.colfilter.operator === TableFilterType.contains ||
      this.colfilter.operator === TableFilterType.equal) {
      this.filterValue = this.colfilter.value;
    }
    this.baseCondition.filter((item) => {
      if (this.filterValue.includes(item.id)) {
        this.filterName.push(item.name);
      }
    });
  }

  /**
   * 匹配修改
   */
  mateChange (operator) {
    this.chooseMateOperator = operator;
  }

  /**
   * 从接口中获取过滤选项列表
   * **/
  async getSearchItems (sheetCode: string, code: string, keyword?: string) {
    const pageSize = 100; const pageIndex = 0;
    const res = await getColFilterById(sheetCode, code, pageSize, pageIndex, keyword || '');
    if (res.success) {
      if (res.returnData.items && res.returnData.items.length > 0) {
        this.showNoData = false;
        let stickyItem;
        let stickyIndex;
        this.baseCondition = res.returnData.items.map((item, index) => {
          // 当前用户处理
          if (item.value === this.userInfo.userId) {
            item.name = '当前用户';
            item.id = item.value;
            stickyIndex = index;
            stickyItem = item;
          }
          // 根据filterValue初始化  filterName
          if (this.filterValue.length > 0 && this.filterValue.indexOf(item.value) > -1 && !this.filterName.includes(item.name)) {
            this.filterName.push(item.name);
          }
          return {
            id: item.value,
            name: item.name,
            ext: item.ext,
          };
        });
        if (stickyItem) {
          this.baseCondition.splice(stickyIndex, 1);
          this.baseCondition.unshift(stickyItem);
        }
        this.baseCondition = this.baseCondition.filter((item) => {
          return item.id;
        });
      } else {
        this.showNoData = true;
        this.baseCondition = [];
      }
    }
  }

  getfixSearchItems (val) {
    this.baseCondition = this.baseCondition.filter((item) => {
      return item.name.indexOf(val) > -1;
    });
  }

  onChange (val) {
    if (this.searchText) {
      this.hasSearched = true;
      if (this.defaultAttr.options.list && this.defaultAttr.options.list.length > 0) {
        this.getfixSearchItems(this.searchText);
        return;
      }
      this.getSearchItems(this.formCode, this.colId, val);
    } else if (this.searchText === '' && this.hasSearched) {
      this.hasSearched = false;
      if (this.defaultAttr.options.list && this.defaultAttr.options.list.length > 0) {
        this.baseCondition = this.defaultAttr.options.list;
        return;
      }
      this.getSearchItems(this.formCode, this.colId);
    } else {
      if (this.defaultAttr.options.list) {
        this.baseCondition = this.defaultAttr.options.list;
      } else {
        this.getSearchItems(this.formCode, this.colId, val);
      }
    }
  }

  // 多选切换
  checkboxChange (id, name) {
    if (this.chooseMateOperator === -1 ||
      this.chooseMateOperator === 2 ||
      this.chooseMateOperator === 3) {
      this.chooseMateOperator = 0;
    }
    if (this.filterValue.includes(id)) {
      this.filterValue = this.filterValue.filter((item) => {
        return item !== id;
      });
      this.filterName = this.filterName.filter((item) => {
        return item !== name;
      });
    } else {
      this.filterValue.push(id);
      this.filterName.push(name);
    }
    this.change();
  }

  searchClick () {
    if (this.$refs.searchBar) {
      (this.$refs.searchBar as any).focus();
    }
  }

  // 判断是人员过滤
  get isUserSelect () {
    return (
      this.colData.colType === FormControlType.FormUser ||
      this.colData.colType === FormControlType.FormCreater ||
      this.colData.colType === FormControlType.FormOwner ||
      this.colData.colType === FormControlType.FormMultiUser
    );
  }

  // 判断是否区分模糊和精确匹配
  get isMateEqual () {
    return (
      this.colData.colType === FormControlType.FormCheckboxList ||
      this.colData.colType === FormControlType.FormMultiDepartment ||
      this.colData.colType === FormControlType.FormMultiUser
    );
  }

  change () {
    this.$emit('change', {
      filterType: FilterAttributeType.MultiSelect,
      value: this.filterValue,
      colIndex: this.colIndex,
      name: this.filterName,
      operator: this.chooseMateOperator,
    });
  }

  onBlur () {
    this.searchText = '';
  }

  @Watch('colfilter', { deep: true })
  handleColFilter (nVal) {
    if (this.colfilter.operator !== TableFilterType.contains &&
      this.colfilter.operator !== TableFilterType.equal) {
      this.filterValue = [];
      this.filterName = [];
    }
    if (nVal.value === 'empty' || nVal.value === 'filled') {
      this.chooseMateOperator = -1;
    }
  }

  @Watch('chooseMateOperator', { deep: true })
  handleUpdataMate (nVal) {
    console.log('chooseMateOperator', nVal);
    if (nVal > -1) {
      if (nVal === 2) {
        this.filterValue.push('empty');
        this.change();
      } else if (nVal === 3) {
        this.filterValue.push('filled');
        this.change();
      } else if (nVal === 6 || nVal === 0) {
        console.log('this.filterValue', this.filterValue, this.filterName);
        this.change();
      }
    }
  }
}
</script>
