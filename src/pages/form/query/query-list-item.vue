<template>
  <div
    v-if="row"
    :class="{cancel: row.Status === 3}"
    class="row-item"
    @click="openListItem(row)"
  >
    <div class="item-top">
      <span
        :class="{draft: row.Status === 0}"
      >
      </span>
      <span
        class="name"
      >{{ name }}</span>
      <!-- 流程状态暂隐藏 -->
      <span
        v-if="row.Status > 0 && isWorkflow"
        class="status"
        :class="`${handleStatus(row.Status).tag}`"
      >{{ handleStatus(row.Status).name }}</span>
    </div>
    <!-- 内容摘要 -->
    <div
      class="summary-wrapper"
    >
      <div
        v-for="(item, index) in summary"
        :key="index"
        class="summary-item"
      >
        <span class="summary-title summary-span">{{ item.label }}</span>
        <span class="summary-text summary-span">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
} from 'vue-property-decorator';
import { workflowData } from '@/light-app/config/list-const';
import { FormControlType } from '@/light-app/config/form-control-type';
@Component({
  name: 'query-lists-item',
})
export default class QueryListsItem extends Vue {
  @Prop()
  row: any;

  @Prop()
  schemaCode!: string;

  @Prop()
  controlMap!: any;

  get showColumns () {
    const ret = [];
    const keys = Object.keys(this.row.cellValues);
    keys.forEach(key => {
      const type = this.controlMap[key].type;
      if (type !== FormControlType.FormPhoto &&
        type !== FormControlType.FormAttachment &&
        type !== FormControlType.FormGridView
      ) {
        ret.push(key);
      }
    });
    return ret;
  }

  get summary () {
    const ret = [];
    for (let i = 0, len = this.showColumns.length; i < len; i++) {
      if (i <= 2) {
        const key = this.showColumns[i];
        const ctrl = this.controlMap[key];
        let value;
        const cellValue = this.row.cellValues[key];
        if (ctrl.type === FormControlType.FormAreaSelect) {
          value = cellValue ? JSON.parse(cellValue).adname || '--' : '--';
        } else if (ctrl.type === FormControlType.FormDateTime) {
          if (!cellValue) {
            value = '--';
          } else {
            value = this.getFormDateValue(cellValue, ctrl);
          }
        } else if (ctrl.type === FormControlType.FormMap) {
          value = cellValue ? JSON.parse(cellValue).Address || '--' : '--';
        } else if (ctrl.type === FormControlType.FormQuery) {
          value = (cellValue && cellValue.length > 0) ? cellValue[0].Name || '--' : '--';
        } else {
          value = cellValue || '--';
        }
        ret.push({
          key: key,
          label: ctrl.label,
          value,
        });
      } else {
        break;
      }
    }
    return ret;
  }

  getFormDateValue (val, ctrl) {
    let value;
    const mode = ctrl.options.DateTimeMode;
    if (mode === 'yyyy-mm-dd') {
      value = val.substr(0, 10);
    } else if (mode === 'yyyy-mm-dd hh:mm') {
      value = val.replace('T', ' ');
    } else if (mode === 'yyyy-mm') {
      value = val.substr(0, 7);
    } else if (mode === 'hh:mm') {
      value = val.substr(11, 5);
    }
    return value;
  }

  get isWorkflow () {
    if (this.row.WorkflowInstanceId || this.row.Status === 0) {
      return true;
    }
    return false;
  }

  get name () {
    return this.row.Name || '未命名的数据';
  }

  /**
   * 表单数据状态处理
   */
  handleStatus (status) {
    return workflowData[status];
  }

  /**
   *
   * 查看数据项
   */
  openListItem ({ Code }) {
    window.GlobalConfig.isOpenQuery = true;
    this.$router.push({
      name: 'formPage',
      params: {
        schemaCode: this.schemaCode,
        bizObjectId: Code,
        isOpenQuery: 'true',
      },
      query: {
        schemaCode: this.schemaCode,
        bizObjectId: Code,
        isOpenQuery: 'true',
      },
    });
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/light-app.less';
.row-item {
  .px2rem(min-height, 149);
  .px2rem(border-radius, 24);
  .px2rem(padding-left, 28);
  .px2rem(padding-right, 24);
  .px2rem(padding-top, 24);
  .px2rem(padding-bottom, 25);
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0.18667rem 0 rgba(42, 104, 209, 0.1);
  margin: 0 auto;
  position: relative;
  // 流程已取消
  &.cancel {
    .item-top {
      .name {
        color: #CCCCCC;
      }
    }
    .participant-activityName {
      p {
        color: #CCCCCC;
      }
    }
    .summary-wrapper {
      .summary-span {
        color: #CCCCCC;
      }
    }
  }
  &.draft:before {
    content: "";
    width: 0;
    height: 0;
    display: block;
    border-bottom: 8px solid #ffaf06;
    border-left: 8px solid rgba(0,0,0,0);
    border-right: 8px solid rgba(0,0,0,0);
    position: absolute;
    top: -2px;
    z-index: 100;
    left: -5px;
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .px2rem(margin-bottom, 20);
  &:first-child {
    .px2rem(margin-top, 24);
  }
  .item-top {
    display: flex;
    .px2rem(height, 45);
    .px2rem(line-height, 45);
    .draft {
      .px2rem(width, 22);
      .px2rem(height, 22);
      background: #FFCA00;
      border-radius: 50%;
      display: inline-block;
      .px2rem(margin-top, 13);
      .px2rem(margin-right, 16);
    }
    .status {
      // float: right;
      // .px2rem(width, 24);
      // .px2rem(height, 24);
      // border-radius: 50%;
      // .px2rem(margin-top, 6);
      float: right;
      .px2rem(width, 88);
      .px2rem(height, 40);
      .px2rem(border-radius, 20);
      .px2rem(font-size, 22);
      .px2rem(line-height, 40);
      text-align: center;
      &_0 {
        color: #ff870f;
        background: #ffefe6;
      }
      &_1 {
        color: #00D495;
        background: #E6FFF5;
      }
      &_2 {
        color: #107fff;
        background:rgba(16,127,255,0.1);
      }
      &_3 {
        color: #666;
        background: #EBEDF2;
      }
    }
  }
  .name {
    flex: 1;
    .px2rem(font-size, 32);
    display: inline-block;
    .px2rem(line-height, 45);
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.summary-wrapper {
  .px2rem(margin-top, 14);
  .summary-item {
    font-size: 0;
    .summary-title {
      width: 25%;
      .px2rem(padding-right, 8);
    }
    .summary-text {
      width: 75%;
    }
    .summary-span {
      .px2rem(font-size, 24);
      .px2rem(line-height, 36);
      color: #666;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }
  }
}
</style>
