<template>
  <div>
    <div class="filter-main">
      <h3-filter-item 
        :title="item.title" 
        :items="item.children" 
        :cols="item.cols"
        :ref="item.group"
        v-for="(item,index) in itemGroups" :key="index">
      </h3-filter-item>
    </div>  
    <div class="footer">
      <h3-button-group :buttonGroup="buttons">
      </h3-button-group>
    </div>
  </div>
</template>
<script>
import H3FilterItem from './h3-filter-item.vue';
import H3ButtonGroup from '../h3-button/h3-button-group2.vue';
import { getItemSheets } from '../../../src/service/get-data';

export default {
  name: 'h3-filter',
  components: {
    H3FilterItem,
    H3ButtonGroup,
  },
  props: {
    type: {
      type: Number, // -1 我申请的 0 经办 2 审批 3 抄送
      required: true,
      validator: val => [-1, 0, 2, 3].indexOf(val) > -1,
    },
    reset: {
      type: Function,
    },
    state: { // 节点状态，2 已完成 4 进行中
      type: Number,
      required: true,
      validator: val => [2, 4].indexOf(val) > -1,
    },
  },
  data() {
    const self = this;
    return {
      actionName: '',
      buttons: [
        {
          action: 'cancel',
          type: 'default',
          size: 'lg',
          title: '重置',
          onClick() {
            self.handleReset();
          },
        },
        {
          action: 'ok',
          title: '确定',
          size: 'lg',
          type: 'primary',
          onClick() {
            self.ok();
          },
        },
      ],
      itemGroups: [],
      appCode: null,
      solutionCode: null,
      result: {},
    };
  },
  created() {
    if (this.type !== -1) {
      this.actionName = 'GetWorkItemSheetNameFilters';
    } else {
      this.actionName = 'GetInstanceSheetNameFilters';
    }
    this.appCode = this.$store.state.appCode;
    this.solutionCode = this.$store.state.solutionCode;
    if (!this.appCode && !this.solutionCode) {
      this.appCode = 'home';
      this.solutionCode = 'home';
    }
    this.querySheets(this.actionName, this.type, this.state, this.solutionCode, this.appCode);
  },
  mounted() {
  },
  methods: {
    handleReset() {
      for (const key of Object.keys(this.$refs)) {
        this.$refs[key][0].reset();
      }
      // this.$emit('reset');
      if (this.reset) {
        this.reset();
      }
    },
    ok() {
      for (const key of Object.keys(this.$refs)) {
        if (Object.prototype.hasOwnProperty.call(this.$refs, key)) {
          if (this.$refs[key].length > 0) {
            this.result[key] = this.$refs[key][0].getValue();
          }
        }
      }
      this.$emit('ok', this.result);
    },
    callBackRes() {
      for (const key of Object.keys(this.$refs)) {
        if (Object.prototype.hasOwnProperty.call(this.$refs, key)) {
          if (this.$refs[key].length > 0) {
            this.result[key] = this.$refs[key][0].getValue();
          }
        }
      }
      return this.result;
    },
    async querySheets(ActionName, WorkItemType, WorkItemState, solutionCode, appCode) {
      const res = await getItemSheets(
        ActionName,
        WorkItemType,
        WorkItemState,
        solutionCode, appCode,
      );
      if (res.Successful) {
        this.filterParams = [].concat(res.ReturnData.Data.rows);
        this.formatQueryParams(this.filterParams);
      }
    },
    formatQueryParams(params) {
      const res = [];
      if (this.type === 0 || this.type === 2) {
        if (this.state === 2) {
          res.push({
            cols: 3,
            group: 'InstanceState',
            title: '流程状态',
            children: [
              {
                Code: 'All',
                DisplayName: '全部',
                Active: true,
                Value: 8,
              },
              {
                Code: 'Draft',
                DisplayName: '草稿',
                Active: false,
                Value: 0,
              },
              {
                Code: 'Working',
                DisplayName: '进行中',
                Active: false,
                Value: 1,
              },
              {
                Code: 'Effected',
                DisplayName: '生效',
                Active: false,
                Value: 2,
              },
              {
                Code: 'Canceled',
                DisplayName: '作废',
                Active: false,
                Value: 3,
              },
            ],
          });
        }
        res.push({
          cols: 3,
          group: 'Critical',
          title: '紧要程度',
          children: [
            {
              Code: 'All',
              DisplayName: '全部',
              Active: true,
              Value: -1,
            },
            {
              Code: 'Limit',
              DisplayName: '限时',
              Active: false,
              Value: 0,
            },
            {
              Code: 'Urge',
              DisplayName: '催办',
              Active: false,
              Value: 1,
            },
          ],
        });
      } else {
        res.push({
          cols: 3,
          group: 'InstanceState',
          title: '流程状态',
          children: [
            {
              Code: 'All',
              DisplayName: '全部',
              Active: true,
              Value: -1,
            },
            {
              Code: 'Working',
              DisplayName: '审批中',
              Active: false,
              Value: 1,
            },
            {
              Code: 'Effected',
              DisplayName: '生效',
              Active: false,
              Value: 2,
            },
            {
              Code: 'Draft',
              DisplayName: '草稿',
              Active: false,
              Value: 0,
            },
            {
              Code: 'Canceled',
              DisplayName: '作废',
              Active: false,
              Value: 3,
            },
          ],
        });
      }
      // 表单名称
      const defaultItems = [
        {
          Code: 'All',
          DisplayName: '全部',
          Active: true,
          Value: null,
        },
      ];
      for (let i = 0, len = params.length; i < len; i += 1) {
        const param = params[i];
        defaultItems.push({
          Code: param.SchemaCode,
          DisplayName: param.SheetName,
          Active: false,
          Value: param.SchemaCode,
          Count: param.Count,
        });
      }
      res.push({
        cols: 2,
        group: 'Sheet',
        title: '单据名称',
        children: defaultItems,
      });
      this.itemGroups = res;
    },
  },
  watch: {
    state(val) {
      this.state = val;
      this.querySheets(this.actionName, this.type, this.state, this.solutionCode, this.appCode);
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../styles/mixins';
.footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>


