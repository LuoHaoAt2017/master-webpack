<template>
  <div class="board-card" :data-id="id" @click="openFormDetail">
    <!-- 用于拖拽时旋转 -->
    <div class="board-card__wrapper">
      <div
        v-if="coverPhoto"
        :style="coverStyle"
        class="board-card__cover"
      >
      </div>
      <div class="board-card__body">
        <!-- 数据标题 -->
        <div class="board-card__title" :class="{'board-card__title-middle': renderFields.length === 0}">
          <span class="board-card__summary">{{ summary }}</span>
          <span class="board-card__status" :class="wfClass">
          </span>
        </div>
        <div
          v-for="field in renderFields"
          :key="field.FieldCode"
          class="board-card__field-container"
        >
          <div v-if="showTitle" class="board-card__field-title">
            <i :class="fieldIcon(field.FieldCode)" class="icon h3yun_All"></i>
            <span>{{ fieldName(field.FieldCode) }}</span>
          </div>
          <div class="board-card__field-value">
            <board-card-summary :type="fieldType(field.FieldCode)" :handler="clickHandler" :value="fieldVal(field.FieldCode)" />
          </div>
        </div>
      </div>
      <div
        v-if="color.value"
        :style="{background: color.value}"
        :title="color.title"
        class="board-card__color"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Board } from '../../typings/board';
import { FormControlType, IconMap } from '../../typings/const';
import { getControlValue, getDateRange, isRuleShouleBeRemoved } from '../../utils/board-utils';
import BoardCardSummary from './board-card-summary.vue';
import {
  containsArray, rangeNumber, rangeDate, equals,
} from '../../utils/rule';
import {
  IBoardDisplayColumn, IFormData, BizObjectStatus, IBoardColorSettingRule, FilterType,
} from '../../typings';
import { deepCopy } from '../../../lib/form-logic/utils';
const LightBoardModule = namespace('LightBoard');
@Component({
  name: 'board-card',
  components: {
    BoardCardSummary,
  },
})
export default class BoardCard extends Vue {
  @Prop({
    type: String,
    default: '',
  }) id!: string; // 表单详情id

  @Prop({
    type: Object,
  }) record!: IFormData; // 绑定的表单详情

  @Prop({
    type: Array,
    default: '',
  }) displayFields!: IBoardDisplayColumn[]; // 显示字段集合,至少一个

  @Prop({
    type: Boolean,
    default: true,
  }) showTitle!: boolean; // 是否显示标题

  @Prop({
    type: String,
  }) cover!: string; // 封面字段

  @Prop({
    type: String,
  }) stackValue!: string; // 看班列值

  @Prop({
    type: Object,
    default: {},
  }) controlOptions!: any; // 控件属性对象

  @LightBoardModule.State('board') board!: Board;

  @LightBoardModule.Mutation('SetFormEditingInfo') setFormEditingInfo;

  dateValMap = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'year', 'lastYear'];

  /**
   * 颜色规则匹配
  */
  matches = [
    {
      match: (rule: IBoardColorSettingRule) => rule.operator === FilterType.empty,
      action: (rule: IBoardColorSettingRule) => {
        if (!this.controlOptions[rule.columnId]) {
          return false;
        }
        return !this.isNoneEmpty(rule.columnId);
      },
    },
    {
      match: (rule: IBoardColorSettingRule) => rule.operator === FilterType.filled,
      action: (rule: IBoardColorSettingRule) => {
        return this.isNoneEmpty(rule.columnId);
      },
    },
    {
      match: (rule: IBoardColorSettingRule) => rule.operator === FilterType.contains,
      action: (rule: IBoardColorSettingRule) => {
        const type = this.fieldType(rule.columnId);
        let value;
        if (this.isNoneEmpty(rule.columnId)) {
          value = this.fieldVal(rule.columnId);
          value = this.getFormatValue(value, type);
        }
        if (!value) {
          return false;
        }
        if (this.isOrgType(type)) {
          return containsArray(value || [], rule.value);
        } else if (this.isTextType(type)) {
          return value.toLowerCase().indexOf((rule.value as string).toLowerCase()) > -1;
        } else {
          return (rule.value as string[]).indexOf(value) > -1;
        }
      },
    },
    {
      match: (rule: IBoardColorSettingRule) => rule.operator === FilterType.equal,
      action: (rule: IBoardColorSettingRule) => {
        const value = this.fieldVal(rule.columnId);
        const type = this.fieldType(rule.columnId);
        if (type === FormControlType.FormDateTime ||
          type === FormControlType.FormCreatedTime ||
          type === FormControlType.FormModifiedTime) {
          return rangeDate(value, this.dateRange[this.dateValMap[parseInt(rule.value as string)]]);
        }
        return equals(value, rule.value);
      },
    },
    {
      match: (rule: IBoardColorSettingRule) => rule.operator === FilterType.range,
      action: (rule: IBoardColorSettingRule) => {
        const value = this.fieldVal(rule.columnId);
        return rangeNumber(value, rule.range as any);
      },
    },
    {
      match: (rule: IBoardColorSettingRule) => rule.operator === FilterType.rangedate,
      action: (rule: IBoardColorSettingRule) => {
        const value = this.fieldVal(rule.columnId);
        return rangeDate(value, rule.range as any);
      },
    },
  ];

  get colorSetting () {
    return this.board.colors;
  }

  /**
   * 获取数据的标识颜色
  */
  get color () {
    if (this.colorSetting.length > 0) {
      const cloneSettings = deepCopy(this.colorSetting);
      const result = [];
      for (const setting of cloneSettings) {
        const ret = [];
        for (const rule of setting.Items) {
          if (!isRuleShouleBeRemoved(rule, this.controlOptions)) {
            ret.push(rule);
          }
        }
        if (ret.length > 0) {
          setting.Items = ret;
          result.push(setting);
        }
      }
      for (const setting of result) {
        const rules = setting.Items;
        let status = true;
        for (const rule of rules) {
          if (!this.isRuleFit(rule)) {
            status = false;
            break;
          }
        }
        if (status) {
          return {
            value: setting.Value,
            title: setting.Message,
          };
        }
      }
    }
    return {};
  }

  /**
   * 获取字段值
   */
  get fieldVal () {
    return (code) => {
      // if (!this.isNoneEmpty(code)) {
      //   return '--';
      // }
      // 数值和日期特殊处理
      const type = this.fieldType(code);
      return getControlValue(code, type, this.record, this.controlOptions);
    };
  }

  /**
   * 获取数据状态
   */
  get status () {
    return this.record.cellValues.Status;
  }

  /**
   * 获取字段icon
   */
  get fieldIcon () {
    return (code) => {
      return IconMap[FormControlType[this.fieldType(code)]];
    };
  }

  /**
   * 获取控件类型
   */
  get fieldType () {
    return (code) => {
      return this.controlOptions[code] ? this.controlOptions[code].Type : FormControlType.FormTextBox;
    };
  }

  /**
   * 获取控件标题
   */
  get fieldName () {
    return (code) => {
      return this.controlOptions[code].DisplayName;
    };
  }

  /**
   * 获取数据标题
  */
  get summary () {
    return this.record.cellValues.Name || '未命名的数据';
  }

  /**
   * 获取实际可以渲染的控件字段
   */
  get renderFields () {
    const ret: any[] = [];
    for (const field of this.displayFields) {
      if (field.Checked && this.isNoneEmpty(field.FieldCode)) {
        ret.push(field);
      }
    }
    return ret;
  }

  /**
   * 获取封面图片
   */
  get coverPhoto () {
    const photos = this.record.cellValues[this.cover];
    return (photos && photos.length > 0) ? photos[0] : null;
  }

  /**
   * 卡片封面样式
   */
  get coverStyle () {
    if (!this.coverPhoto) {
      return {};
    }
    return {
      backgroundImage: `url(${this.coverPhoto.thumbnail})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  /**
   * 获取数据状态标识
   */
  get wfClass () {
    let cls = '';
    if (this.status === BizObjectStatus.Draft) {
      cls = 'board-card_draft';
    } else if (this.status === BizObjectStatus.Running) {
      cls = 'board-card_processing';
    } else if (this.status === BizObjectStatus.Canceled) {
      cls = 'board-card_canceled';
    }
    return [cls];
  }

  /**
   * 获取日期范围时间值， 计算属性复用
  */
  get dateRange () {
    return getDateRange();
  }

  /**
   * 判断字段值是否为空
   */
  isNoneEmpty (fieldCode) {
    if (!this.controlOptions[fieldCode]) {
      return false;
    }
    const val = this.record.cellValues[fieldCode];
    const type = this.fieldType(fieldCode);
    switch (type) {
      case FormControlType.FormUser:
      case FormControlType.FormDepartment:
        return val && val[0] && val[0].Name;
      case FormControlType.FormMultiUser:
      case FormControlType.FormMultiDepartment:
      case FormControlType.FormPhoto:
      case FormControlType.FormAttachment:
        return val && val.length > 0;
      case FormControlType.FormQuery:
        return val && val[0] && val[0].BizObjectId;
      case FormControlType.FormAreaSelect:
        return val && !!JSON.parse(val).adcode;
      case FormControlType.FormMap:
        return val && !!JSON.parse(val).Address;
      case FormControlType.FormNumber:
        return val || val === 0;
      default:
        if (!val) {
          return false;
        }
        if (val.length && val.length === 0) {
          return false;
        }
        return true;
    }
  }

  /**
   * 字段渲染点击事件
   */
  clickHandler () {
    this.gotoForm();
  }

  /**
   * 打开表单
   */
  openFormDetail (e) {
    if (e && e.target && (e.target.tagName === 'IMG' || e.target.className.match(/more/))) { // 点击图片显示预览框
      return;
    }
    this.gotoForm();
  }

  gotoForm () {
    const { schemaCode } = this.board;
    this.setFormEditingInfo(this.stackValue);
    this.$router.push({
      name: 'formPage',
      params: {
        schemaCode: schemaCode,
        bizObjectId: this.id,
        linkSource: 'boardEntry',
        fromBoard: 'true',
      },
      query: {
        schemaCode: schemaCode,
        bizObjectId: this.id,
      },
    });
  }

  /**
   * 是否组织机构类型
  */
  isOrgType (type) {
    switch (type) {
      case FormControlType.FormUser:
      case FormControlType.FormMultiUser:
      case FormControlType.FormDepartment:
      case FormControlType.FormMultiDepartment:
      case FormControlType.FormOwner:
      case FormControlType.FormOwnerDepartment:
      case FormControlType.FormCreater:
        return true;
      default:
        return false;
    }
  }

  isTextType (type: FormControlType) {
    switch (type) {
      case FormControlType.FormTextBox:
      case FormControlType.FormTextArea:
      case FormControlType.FormMap:
      case FormControlType.FormAreaSelect:
      case FormControlType.FormSeqNo:
      case FormControlType.FormFormula:
        return true;
      default:
        return false;
    }
  }

  /**
   * 是否日期控件类型
  */
  isDateType (type: FormControlType) {
    return type === FormControlType.FormDateTime ||
        type === FormControlType.FormCreatedTime ||
        type === FormControlType.FormModifiedTime;
  }

  /**
   * 获取格式化值
  */
  getFormatValue (value: any, type: FormControlType) {
    switch (type) {
      case FormControlType.FormQuery:
        return value[0].BizObjectId;
      case FormControlType.FormAreaSelect:
        const address = JSON.parse(value);
        const adname = `${address.adname}${address.Detail}`;
        return adname;
      case FormControlType.FormMap:
        return JSON.parse(value).Address;
      case FormControlType.FormUser:
      case FormControlType.FormMultiUser:
      case FormControlType.FormDepartment:
      case FormControlType.FormMultiDepartment:
      case FormControlType.FormOwner:
      case FormControlType.FormOwnerDepartment:
      case FormControlType.FormCreater:
        return value.isArray ? value.map(val => val.UnitId) : value;
      default:
        return value;
    }
  }

  /**
   * 条件是否满足
  */
  isRuleFit (rule: IBoardColorSettingRule) {
    let ret = true;
    for (const match of this.matches) {
      if (match.match(rule)) {
        ret = match.action(rule);
        break;
      }
    }
    return ret;
  }
}
</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.board-card {
  // .px2rem(padding, 20);
  .px2rem(margin-bottom, 20);
  &__wrapper {
    position: relative;
    .px2rem(padding, 20);
    background: #fff;
    .px2rem(border-radius, 24);
    // &:active {
    //   &::before {
    //     content: '';
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     bottom: 0;
    //     right: 1px;
    //     border: 1px solid #107fff;
    //     .px2rem(border-radius, 24);
    //     z-index: 999;
    //   }
    // }
  }
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .px2rem(height, 48);
    .px2rem(line-height, 48);
    .px2rem(margin-bottom, 8);
    &-middle {
      margin-bottom: 0;
    }
  }

  &__summary {
    .px2rem(font-size, 32);
    font-weight: 600;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__cover {
    position: relative;
    .px2rem(height, 140);
    border-radius: 3px 3px 0 0;
    overflow: hidden;
  }
  &__body {
    .board-card__field-container {
      .px2rem(margin-bottom, 8);
    }
    .board-card__field-container:last-child {
      margin-bottom: 0;
    }
  }
  &__field-title {
    display: flex;
    align-items: center;
    .px2rem(margin-bottom, 4);
    .px2rem(line-height, 40);
    span {
      overflow: hidden;
      .px2rem(font-size, 24);
      color:#999;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    i {
      .px2rem(margin-right, 12);
      color: #999;
    }
  }
  &__field-value {
    .px2rem(line-height, 44);
    color: #333;
    .px2rem(font-size, 28);
  }
  &__status {
    flex-shrink: 0;
    .px2rem(width, 22);
    .px2rem(height, 22);
    border-radius: 50%;
  }
  &__drag {
    z-index: 9999;
  }
  &__color {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    .px2rem(width, 10);
    border-radius: 12px 0 0 12px;
    transform: scale(1, 0.95);
  }
  &_draft {
    background: #FFCA00;
  }
  &_processing {
    background: #107fff;
  }
  &_canceled {
    background: #8B9096;
  }
}
.board-card__chosen {
  .board-card__wrapper {
    transform: rotate(5deg);
  }
}
.sortable-ghost {
  .board-card__wrapper {
    background: #DEE0E0;
    transform: rotate(0deg);
  }
}
.board-card__drag {
  .board-card__wrapper {
    transform: rotate(5deg);
  }
}
</style>
