<template>
  <div class="modal-section">
    <h3-accordion
      ref="accordion"
      class="light-list-accordion"
    >
      <h3-accordion-item
        v-for="(col) in getCols"
        :key="col.code"
        ref="accordionItem"
        position="right"
        content-height="108"
        :title="col.displayName"
        class="list-item"
      >
        <span
          slot="title"
          class="select-val"
        >{{ statisticsText[col.code] }}</span>

        <div
          class="list-wrapper"
          @click.stop="handleClickRadio(col.code)"
        >
          <l-radio
            ref="listRadio"
            :list="handleStatisticsList(col)"
            :defaultValue="statisticsType[col.code]"
            @click="handleRadioValue"
          />
        </div>
      </h3-accordion-item>
    </h3-accordion>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { Column, ViewData } from '@/light-app/typings/list';
import {
  FormControlType,
  ContorlTypeObject,
} from '@/light-app/config/form-control-type';
import {
  LightListActionType,
  LightListMutationType,
} from '@/light-app/store/modules/list/types';
import { SummaryType, SummaryTitleMap } from '@/light-app/config/list-const';
import { splitThousands } from '@/light-app/config/common';
import {
  getDataListfilter,
  getStatistics,
} from '@/light-app/service/list.service';
import { H3Button, H3Accordion, H3Radio } from 'h3-mobile-vue';
import LRadio from '../l-radio.vue';
const lightListModule = namespace('LightList');
// 暂不支持统计控件类型
const unsupportedStatisticsControl = {
  [FormControlType.FormAttachment]: true, // 附件
  [FormControlType.FormPhoto]: true, // 图片
  [FormControlType.FormOwner]: true, // 拥有者
  [FormControlType.FormCreater]: true, // 创建人
  [FormControlType.FormGridView]: true, // 子表
  [FormControlType.FormCreatedTime]: true, // 创建时间
  [FormControlType.FormModifiedTime]: true, // 修改时间
  [FormControlType.FormOwnerDepartment]: true, // 所属部门
  // [FormControlType.Participant]: true, //当前处理人
  // [FormControlType.ActivityName]: true //当前节点
};
@Component({
  name: 'statistics-panel',
  components: {
    H3Button,
    H3Accordion,
    H3AccordionItem: H3Accordion.Item,
    LRadio,
    H3Radio,
  },
})
export default class StatisticsPanel extends Vue {
  @lightListModule.State('formCols')
  formCols: Column[]; // 数据列表

  @lightListModule.State('viewData')
  viewData: any; // 数据列表

  statisticsText: any = {};

  statisticsType: any = {};

  selectedCode: string = '';

  selectedType: number = -1;

  summaries: any = {};

  doubleClick: boolean = false; // 防止重复点击请求

  /**
   * 过滤不支持统计控件
   **/
  get getCols () {
    const cols = this.formCols.filter(item => {
      return !unsupportedStatisticsControl[item.colType];
    });
    return cols;
  }

  // 取小数的位数
  get colDecimalPlaces () {
    const temp: any = {};
    this.getCols.forEach((col) => {
      if (col.controlOptions) {
        this.$set(temp, col.code, col.controlOptions.DecimalPlaces);
      }
    });
    return temp;
  }

  get sheetCode () {
    const { sheetCode } = this.$route.query;
    return sheetCode;
  }

  mounted () {
    this.handleLabel();
  }

  /**
   * 处理统计选择数据
   */
  handleStatisticsList (code) {
    const statisticsList: object[] = [];
    const summaryItems = ContorlTypeObject[code.colType].summaryItems;
    summaryItems.forEach((item) => {
      const temp = {};
      temp['value'] = SummaryType[item.id];
      temp['label'] = item.name;
      statisticsList.push(temp);
    });
    return statisticsList;
  }

  /**
   * 发起控件统计
   */
  async statisticsFetch () {
    const data = {
      sheetCode: this.sheetCode,
      params: {
        summaries: this.statistics()
      },
    };
    await getDataListfilter(data);
    this.handleLabel();
  }

  /**
   * 处理label数据
   */
  async handleLabel () {
    const info = await getStatistics(this.sheetCode as string);
    if (info.success) {
      this.summaries = info.returnData.summaries;
      this.statisticsText = {};
      Object.keys(this.summaries).forEach(key => {
        this.$set(
          this.statisticsText,
          key,
          `${SummaryTitleMap[this.summaries[key].type]}:${splitThousands(
            this.summaries[key].value,
            this.colDecimalPlaces[key],
          )}`,
        );
        this.$set(this.statisticsType, key, this.summaries[key].type);
      });
    }
  }

  /**
   * 取统计参数
   */
  statistics () {
    const temp: any = {};
    temp[this.selectedCode] = {
      text: this.selectedCode,
      type: this.selectedType,
    };
    return temp;
  }

  /**
   * 取控件code
   */
  handleClickRadio (code) {
    this.selectedCode = code;
    // if (!this.doubleClick) {
    this.statisticsFetch();
    // }
  }

  /**
   * 取统计type
   */
  handleRadioValue (type) {
    // this.doubleClick = false;
    // // 防止重复点击
    // if (this.selectedType === type) {
    //   this.doubleClick = true;
    // }
    this.selectedType = type;
  }
}
</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.light-list-accordion {
  .px2rem(padding-bottom, 96);
   .list-item {
    &::before {
      content: '';
    }
  }
}
</style>
