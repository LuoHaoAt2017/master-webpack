<template>
  <layout
    title="统计分析"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <h3-report-mobile
      :schemaCode="schemaCode"
      :filter="getAnalysisParams()"
    />
    <div class="iponex-bottom"></div>
  </layout>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { MVisualization } from '@h3/report';
import options from '@h3/report/dist/options';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
import { instance } from '@/light-app/service/report-fetch';
import {
  TableFilterType,
  FormulaType,
} from '../../config/const';
import { FormControlType } from '@/light-app/config/form-control-type';
const lightAppModule = namespace('LightApp');
const lightListModule = namespace('LightList');
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

options.axios = instance;
options.message = {
  success: H3PluginDeveloper.IShowSuccess,
  error: H3PluginDeveloper.IShowError,
  info: H3PluginDeveloper.IShowSuccess,
  warning: H3PluginDeveloper.IShowWarn,
};

@Component({
  name: 'report',
  components: {
    H3ReportMobile: MVisualization,
  },
})
export default class report extends Vue {
  @lightListModule.State('viewData')
  viewData: any;

  get schemaCode () {
    return this.$route.query.schemaCode;
  }

  /**
   * 统计分析过滤参数转换
   * */
  getAnalysisParams () {
    // const filterSet: any[] = this.viewData && this.viewData.filter;
    const filterSet: any[] = this.$route.query.filters as any[];
    const matchControlType = {
      [FormControlType.FormCheckboxList]: true,
      [FormControlType.FormMultiUser]: true,
      [FormControlType.FormMultiDepartment]: true,
    };
    const filterParams: any[] = [];
    if (filterSet && filterSet.length > 0) {
      filterSet.forEach((filterItem) => {
        if (matchControlType[filterItem.ControlType] && filterItem.operator === 0) {
          filterItem.value.forEach((val) => {
            const value = [];
            value.push(val);
            filterParams.push({
              schemaCode: this.schemaCode,
              field: filterItem.columnId,
              formula: FormulaType.Match,
              value: value,
            });
          });
        } else {
          filterParams.push({
            schemaCode: this.schemaCode,
            field: filterItem.columnId,
            formula: this.getFormulaValue(filterItem).formula,
            value: this.getFormulaValue(filterItem).value,
          });
        }
      });
    }
    return filterParams;
  }

  /**
   * 获得过滤条件公式和值
   * */
  getFormulaValue (filterItem) {
    const formulaTypeValue: any = {
      formula: '',
      value: [],
    };
    switch (filterItem.operator) {
      // 等于
      case TableFilterType.equal:
        // if (typeof filterItem.value === 'string') {
        formulaTypeValue.formula = FormulaType.Equal;
        formulaTypeValue.value = filterItem.value;
        // }
        break;
      // 包含
      case TableFilterType.contains:
        if (typeof filterItem.value === 'string') {
          formulaTypeValue.formula = FormulaType.Match;
          formulaTypeValue.value.push(filterItem.value);
        } else {
          formulaTypeValue.formula = FormulaType.In;
          formulaTypeValue.value = filterItem.value;
        }
        break;
      // 为空
      case TableFilterType.empty:
        formulaTypeValue.formula = FormulaType.None;
        break;
      // 不为空
      case TableFilterType.filled:
        formulaTypeValue.formula = FormulaType.NotNone;
        break;
      // 数字区间
      case TableFilterType.range:
        if (filterItem.range.max && filterItem.range.min) {
          // 范围
          formulaTypeValue.formula = FormulaType.Range;
        } else if (filterItem.range.max) {
          // 小于等于
          formulaTypeValue.formula = FormulaType.NotAbove;
        } else if (filterItem.range.min) {
          // 大于等于
          formulaTypeValue.formula = FormulaType.NotBelow;
        }
        formulaTypeValue.value = Object.values(filterItem.range).filter(
          item => item,
        ).reverse();
        break;
      // 日期区间
      case TableFilterType.rangedate:
        formulaTypeValue.formula = FormulaType.Range;
        formulaTypeValue.value = [filterItem.range.min, filterItem.range.max];
        break;
      default:
        break;
    }
    return formulaTypeValue;
  }

  goBack () {
    // const appCode = this.$route.query.appCode;
    // const sheetCode = this.schemaCode;
    // const sheetName = this.$route.params.displayName;
    // this.$router.replace({
    //   name: 'lightListPage',
    //   query: {
    //     appCode,
    //     sheetCode
    //   },
    //   params: {
    //     sheetName
    //   }
    // });
    this.$router.go(-1);
  }

  /**
   * 响应式路由参数变化，处理路由参数变化，页面不刷新；
   */
  beforeRouteLeave (to, from, next) {
    this.$destroy();
    next();
  }
}
</script>
