<template>
  <div class="filters-form-query bd-bot">
    <div class="param-title">
      <div>{{ formVal.DisplayName }}</div>
    </div>
    <div class="param-value" @click="query">
      <span v-if="selected.length == 0">{{ placeHolder }}</span>
      <div v-if="selected.length > 0" class="chk-wrapper">
        <div v-for="(item,index) in selected" :key="index" class="chk-item">
          {{ getItemName(item) }}
        </div>
      </div>
      <div class="icon h3yun_All right-o"></div>
    </div>
  </div>
</template>

<script>
// zyq;
import { getFormatBizObject } from '../../../service/get-data';

export default {
  name: 'FormQuery',
  props: ['formVal'],
  data () {
    return {
      currentVal: '',
      ismultiple: true,
      placeHolder: '请选择',
      selected: [],
      selectedObjectIds: [], // 选中对象objectId
      backUpValue: null,
      isChild: false,
    };
  },
  created () {
    this.init();
    const that = this;
    // 接收来自关联列表页面传回的objectid
    this.$root.eventHub.$on(`QUERY_ASSIGN_VALUE${this.formVal.PageId}`, (val) => {
      let res = [];
      if (that.formVal.DataField === val.datafield) {
        res = [];
        if (val.item && val.item.length > 0) {
          // 判斷主表還是子表
          that.isChild = false;
          if (val.item[0][`${that.formVal.BOSchemaCode}.ObjectId`]) {
            // 子表
            that.isChild = true;
          }
          for (const item of val.item) {
            if (that.isChild) {
              res.push(item[`${that.formVal.BOSchemaCode}.ObjectId`]);
            } else {
              res.push(item.ObjectId || item);
            }
          }
        }
        that.setValue(res);
      }
    });
  },
  mounted () {
    // this.$store.state.readyFiltersCount++;
  },
  methods: {
    init () {
      this.setValue(this.formVal.DefaultValue);
    },
    getValue () {
      this.backUpValue = null;
      return this.selectedObjectIds;
    },
    getItemName (item) {
      return item.Name || item[`${this.formVal.BOSchemaCode}.Name`];
    },
    setValue (val) {
      this.selected = [];
      this.selectedObjectIds = [];
      if (!val) {
        return;
      }
      let objectIds = '';
      if (val.constructor === Array) {
        for (const item of val) {
          objectIds += `${item};`;
        }
      } else {
        objectIds = val;
      }
      this.requestFormatBizObject(this.formVal.BOSchemaCode, objectIds);
    },
    async requestFormatBizObject (schemaCode, objectIds) {
      const res = await getFormatBizObject(schemaCode, objectIds);
      if (res.Successful) {
        const retData = res.ReturnData.ListViewData;
        for (const item of retData) {
          if (this.isChild) {
            this.selectedObjectIds.push(item[`${this.formVal.BOSchemaCode}.ObjectId`]);
          } else {
            this.selectedObjectIds.push(item.ObjectId);
          }
          this.selected.push(item);
        }
        const that = this;
        setTimeout(() => {
          that.$root.eventHub.$emit('refreshScroll', 'query');
        }, 300);
      }
    },
    reset () {
      this.backUpValue = {
        ids: this.selectedObjectIds,
        items: this.selected,
      };
      this.selectedObjectIds = [];
      this.selected = [];
    },
    rollBack () {
      if (this.backUpValue) {
        this.selectedObjectIds = this.backUpValue.ids;
        this.selected = this.backUpValue.items;
      }
    },
    query () {
      // 记录位置
      const filterBox = document.getElementsByClassName('listfilter-box');
      if (filterBox && filterBox.length > 0) {
        this.$store.state.lastFilterBoxPosition = filterBox[0].scrollTop;
      }
      const params = {
        boschemacode: this.formVal.BOSchemaCode,
        datafield: this.formVal.DataField,
        ismultiple: true,
        isQuery: true,
        curcode: this.formVal.CurCode,
        value: this.selectedObjectIds,
        pageId: this.formVal.PageId,
      };
      const history = this.$router.history;
      if (history && history.current && history.current.name === 'filterquery') {
        this.$router.push({
          name: 'filterQueryCopy',
          params: params,
        });
      } else {
        this.$router.push({
          name: 'filterquery',
          params: params,
        });
      }
    },
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.filters-form-query {
  position: relative;
  .px2rem(padding,24);
  display: flex;
  align-items: flex-start;
  .icon {
    position: absolute;
  }
}
.chk-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  div.chk-item {
    .px2rem(margin-right,14);
    .px2rem(margin-bottom,20);
    .px2rem(padding-left,20);
    .px2rem(padding-right,20);
    .px2rem(height,42);
    .px2rem(line-height,42);
    .px2rem(border-radius,10);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid #467db9;
    .px2rem(font-size,24);
    color: #467db9;
  }
}
</style>
