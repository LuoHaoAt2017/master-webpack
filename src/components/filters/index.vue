<template>
  <!-- :style="{top: $store.state.corpId?0:'46px'}" -->
  <div id="filters" ref="filters" style="z-index:1112;">
    <div ref="mask" class="mask" @click="cancel"></div>
    <div ref="filtersBox" class="listfilter-box">
      <div ref="maincontent" class="main-content">
        <filters ref="childs"   :filterListsData="filterListsData" />
      </div>
    </div>
    <div class="listfilter-footer bd-top">
      <div @click="reset">
        清空
      </div>
      <!-- <div @click="cancel">取消</div> -->
      <div @click="ok">
        确定
      </div>
    </div>
  </div>
</template>
<script>
// zyq;
import {
  OrganiztionType,
  getFirstAndLastMonthDay,
  getFirstAndLastdayweek,
  GetFirstAndLastDayQuarter,
} from '../../config/common';
import FormScope from './sub-filters/form-scope.vue';
import FormTextBox from './sub-filters/form-text-box.vue';
import FormMultiUser from './sub-filters/form-multi-user.vue';
import FormDateTimeStamp from './sub-filters/form-date-time-stamp.vue';
import FormNumberStamp from './sub-filters/form-number-stamp.vue';
import FormCheckboxList from './sub-filters/form-checkbox-list.vue';
import FormQuery from './sub-filters/form-query.vue';
import FormAreaSelect from './sub-filters/form-area-select.vue';

export default {
  name: 'Filterpage',
  components: {
    filters: {
      props: ['filterListsData'],
      render (h) {
        const subs = [];
        for (const paramObj of this.filterListsData) {
          switch (paramObj.ControlKey) {
            case 'FormScope':
              subs.push(h(FormScope, {
                props: { formVal: paramObj },
                ref: paramObj.DataField,
              }));
              break;
            case 'FormTextBox':
              subs.push(h(FormTextBox, {
                props: { formVal: paramObj },
                ref: paramObj.DataField,
              }));
              break;
            case 'FormMultiUser':
              subs.push(h(FormMultiUser, {
                props: { formVal: paramObj },
                ref: paramObj.DataField,
              }));
              break;
            case 'FormDateTimeStamp':
              subs.push(h(FormDateTimeStamp, {
                props: { formVal: paramObj },
                ref: paramObj.DataField,
              }));
              break;
            case 'FormNumberStamp':
              subs.push(h(FormNumberStamp, {
                props: { formVal: paramObj },
                ref: paramObj.DataField,
              }));
              break;
            case 'FormCheckboxList':
              subs.push(h(FormCheckboxList, {
                props: { formVal: paramObj },
                ref: paramObj.DataField,
              }));
              break;
            case 'FormQuery':
              subs.push(h(FormQuery, {
                props: { formVal: paramObj },
                ref: paramObj.DataField,
              }));
              break;
            case 'FormAreaSelect':
              subs.push(h(FormAreaSelect, {
                props: { formVal: paramObj, keyName: paramObj.DataField },
                ref: paramObj.DataField,
              }));
              break;
            default:
              break;
          }
        }
        return h('div', {}, subs);
      },
    },
  },
  props: [
    'menuCode',
    'scopes',
    'isShow',
    'pageId',
    'queryItems', // 筛选项
    'effectOnly', // 是否只筛选生效项，关联表单筛选页面设置
  ],
  data () {
    return {
      filterParams: [], // 过滤参数
      filterListsData: [],
      scroll: null,
      lastPosition: 0,
    };
  },
  watch: {
    isShow () {
      if (this.isShow) {
        if (this.filterListsData.length === 0) {
          this.init();
        } else {
          const refs = this.$refs.childs.$refs;
          for (const ref in refs) {
            if (typeof refs[ref].rollBack !== 'undefined') {
              refs[ref].rollBack();
            }
          }
        }
      }
    },
  },
  created () {},
  mounted () {
    const footer = document.querySelector('.listfilter-footer');
    if (footer) {
      footer.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();
        },
        false,
      );
    }
  },
  activated () {
    // console.log(this.lastPosition);
    this.$refs.mask.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
      },
      false,
    );
    // $(this.$refs.maincontent).scrollTop(this.lastPosition);
    this.$refs.filtersBox.scrollTop = this.$store.state.lastFilterBoxPosition;
  },
  deactivated () {
    // this.lastPosition=this.$refs.filtersBox.scrollTop;
    // if(this.scroll){
    //   this.lastPosition=this.scroll.y;
    // }
  },
  methods: {
    // 获取列表过滤数据
    init () {
      this.formatQueryParams(this.queryItems);
    },
    // initScroll() {
    //   this.scroll = new BScroll(this.$refs.wrapper, {
    //     probeType: 3,
    //     click: true,
    //     scrollY: true,
    //     bounce: true
    //   });
    // },

    formatQueryParams (params) {
      const tmp = [];
      if (this.scopes) {
        // 先添加数据范围过滤
        const scope = {
          DefaultValue: 4,
          DefaultItems: this.scopes,
          DataField: 'FormScope',
          ControlKey: 'FormScope',
        };
        tmp.push(scope);
      }
      for (const field of params) {
        // if (!field.Visible) continue;
        const propertyName = field.PropertyName;
        const displayName = field.DisplayName;
        let associationSchemaCode = field.AssociationSchemaCode;
        let associationField = field.AssociationField;
        const dataType = field.DataType;
        if (dataType === 14 && associationSchemaCode) {
          associationSchemaCode = this.menuCode;
          associationField = propertyName;
        }
        const organizationType = field.OrganizationType;
        const allowNotNull = field.AllowNull;
        const filterValue = field.FilterValue;
        const defaultValue = field.DefaultValue;
        const associationFilter = field.AssociationFilter;
        const paramObj = {
          DataField: propertyName,
          DisplayName: displayName,
          BOSchemaCode: associationSchemaCode,
          AssociationField: associationField,
          AssociationFilter: associationFilter,
          OrganizationType: organizationType,
          AllowNotNull: allowNotNull,
          FilterValue: filterValue,
          DefaultValue: defaultValue,
          CurCode: this.menuCode,
          PageId: this.pageId,
          IsDisplay: field.Visible,
          DataType: dataType,
          // 控制渲染filter时Vislable导致无法读取数据，改为style：none[暂时只修改了form-text-box.vue]
        };
        switch (dataType) {
          case 1:
            {
              const selectedValues = [{ Text: '是', Value: true }, { Text: '否', Value: false }];
              paramObj.IsRadio = true;
              paramObj.DefaultItems = selectedValues;
              paramObj.ControlKey = 'FormCheckboxList';
            }
            break;
          case 7:
          case 9:
          case 11:
          case 35:
            if (propertyName === 'Status') {
              if (!this.effectOnly) {
                const defaultItems = [
                  { Text: '草稿', Value: 0 },
                  { Text: '生效', Value: 1 },
                  { Text: '进行中', Value: 2 },
                  { Text: '作废', Value: 3 },
                ];
                const defaultValueArr = defaultValue.split(';');
                paramObj.DefaultValue = [];
                for (let i = 0; i < defaultValueArr.length; i += 1) {
                  switch (defaultValueArr[i]) {
                    case 'Draft':
                      paramObj.DefaultValue.push({ Text: '草稿', Value: 0 });
                      break;
                    case 'Effective':
                      paramObj.DefaultValue.push({ Text: '生效', Value: 1 });
                      break;
                    case 'Running':
                      paramObj.DefaultValue.push({ Text: '进行中', Value: 2 });
                      break;
                    case 'Canceled':
                      paramObj.DefaultValue.push({ Text: '作废', Value: 3 });
                      break;
                    default:
                      break;
                  }
                }
                paramObj.DisplayName = '数据状态';
                paramObj.IsRadio = false;
                paramObj.DefaultItems = defaultItems;
                paramObj.ControlKey = 'FormCheckboxList';
              }
            } else {
              paramObj.ControlKey = 'FormNumberStamp';
            }

            break;
          case 10:
            paramObj.ControlKey = 'FormCheckboxList';
            break;
          case 13:
          case 14:
            if (field.SelectedValues) {
              const selectedValuess = field.SelectedValues.split(';');
              paramObj.DefaultItems = selectedValuess;
              paramObj.ControlKey = 'FormCheckboxList';
            } else {
              paramObj.ControlKey = 'FormTextBox';
            }
            break;
          case 5:
            paramObj.ControlKey = 'FormDateTimeStamp';
            if (paramObj.FilterValue) {
              paramObj.DefaultValue = this.getDefaultValueOfDate(paramObj.FilterValue);
            }
            break;
          case 26:
            paramObj.ControlKey = 'FormMultiUser';
            paramObj.OrgUnitVisible = true;
            paramObj.UserVisible = true;
            paramObj.IsFilter = true;
            paramObj.UnitSelectRange = field.UnitSelectRange;
            switch (field.PropertyName) {
              case 'CreatedBy':
              case 'OwnerId':
                paramObj.OrgUnitVisible = false;
                break;
              case 'OwnerDeptId':
                paramObj.UserVisible = false;
                break;
              default:
                break;
            }
            if (typeof field.OrganizationType !== 'undefined') {
              switch (field.OrganizationType) {
                case OrganiztionType.User:
                  paramObj.OrgUnitVisible = false;
                  break;
                case OrganiztionType.Dept:
                  paramObj.UserVisible = false;
                  break;
                default:
                  break;
              }
            }
            if (paramObj.FilterValue) {
              paramObj.DefaultValue = this.getDefaultValueOfUnit(paramObj.FilterValue);
            }
            break;
          case 50:
            paramObj.ControlKey = 'FormQuery';
            break;
          case 51:
            paramObj.ControlKey = 'FormQuery';
            paramObj.IsMultiple = true;
            if (paramObj.DefaultValue) {
              paramObj.DefaultValue = paramObj.DefaultValue.replace(/,/g, ';');
            }
            break;
          case 56:
            paramObj.ControlKey = 'FormAreaSelect';
            paramObj.AreaMode = field.DisplayFormat || 'P-C-T';
            paramObj.ShowDetailAddr = true;
            break;
          default:
            break;
        }
        tmp.push(paramObj);
      }
      console.log(this.filterListsData);
      this.filterListsData = tmp;
    },
    getDefaultValueOfDate (type) {
      // 获取日期默认值
      let myDate = new Date();
      let beginvalue = null;
      let endvalue = null;
      switch (`${type}`) { // 1=当天；2=本周；3=本月；4=本季度；5=本年度；6=昨天；7=上月
        case '1':
          beginvalue = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
          endvalue = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
          break;
        case '2':
          beginvalue = getFirstAndLastdayweek()[0];
          endvalue = getFirstAndLastdayweek()[1];
          break;
        case '3':
          beginvalue = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-01`;
          endvalue = getFirstAndLastMonthDay(myDate.getFullYear(), myDate.getMonth() + 1);
          break;
        case '4':
          beginvalue = GetFirstAndLastDayQuarter()[0];
          endvalue = GetFirstAndLastDayQuarter()[1];
          break;
        case '5':
          beginvalue = `${myDate.getFullYear()}-01-01`;
          endvalue = `${myDate.getFullYear()}-12-31`;
          break;
        case '6':
          myDate = myDate.AddDays(-1);
          beginvalue = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
          endvalue = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
          break;
        case '7':
          myDate = myDate.AddMonths(-1);
          beginvalue = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-01`;
          endvalue = getFirstAndLastMonthDay(myDate.getFullYear(), myDate.getMonth() + 1);
          break;
        default:
          break;
      }
      return `${beginvalue};${endvalue}`;
    },
    getDefaultValueOfUnit (type) {
      // 获取参与者默认值
      let res = null;
      switch (`${type}`) {
        case '1':
          res = this.$store.state.UserInfo.userId;
          break;
        case '2':
          res = this.$store.state.UserInfo.userParent;
          break;
        case '3':
          break;
        default:
          break;
      }
      return res;
    },
    setActive (scope) {
      this.$set(scope, 'Active', true);
    },
    getValue () {
      const res = {};
      const params = {};
      const refs = this.$refs.childs.$refs;
      for (const ref in refs) {
        if (ref === 'FormScope') {
          params.scopeType = refs[ref].getValue();
        } else {
          res[ref] = refs[ref].getValue();
        }
      }
      if (this.effectOnly) {
        res.Status = [1]; // 在关联表单的筛选中，仅读取有效数据
      }
      params.searchParamsJson = res;
      // 触发事件
      this.$root.eventHub.$emit(`executeFilter-${this.pageId}`, params);
      this.$store.state.lastFilterBoxPosition = 0;
    },
    ok () {
      this.getValue();
    },
    reset () {
      // 重置
      const refs = this.$refs.childs.$refs;
      for (const ref in refs) {
        if (Object.prototype.hasOwnProperty.call(refs, ref)) {
          refs[ref].reset();
        }
      }
    },
    cancel () {
      this.$root.eventHub.$emit('cancel-filter', this.pageId);
      this.$store.state.lastFilterBoxPosition = 0;
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.has-filter-top {
  top: 46px !important;
}
.has-filter-margin {
  margin-top: 46px !important;
}
.bd-top {
  border: 0 !important;
  background-image: -webkit-linear-gradient(180deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-image: linear-gradient(180deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: top;
}
.bd-bot {
  border: 0 !important;
  background-image: -webkit-linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-image: linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
}
@-webkit-keyframes filter-modal {
  0% {
    width: 0%;
  }
  100% {
    .px2rem(width,618);
  }
}
@keyframes filter-modal {
  0% {
    width: 0%;
  }
  100% {
    .px2rem(width,618);
  }
}
#filters {
  width: 100%;
  z-index: 115;
  position: absolute;
  top: 0;
  bottom: 0;
  div.mask {
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background-color: #181818;
    z-index: 114;
  }
  .listfilter-box {
    z-index: 116;
    .px2rem(width,618);
    animation: filter-modal 0.3 ease-in;
    position: absolute;
    top: 0;
    right: 0;
    .px2rem(bottom,98); // .px2rem(padding,24);
    overflow-y: auto;
    background-color: #fff;
    div.filter-wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
    .scope {
      .px2rem(padding,24);
    }
    .h3-popup-picker-value,
    .param-title,
    .param-value {
      color: #333;
      .px2rem(font-size,28);
      input {
        .px2rem(height,40);
      }
    }
    .param-title {
      flex-shrink: 0;
      .px2rem(width,168);
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      div {
        .px2rem(font-size,28);
      }
    }
    .h3-field-box .h3-PR .h3-field-placeholder{
      color: #999;
      .px2rem(font-size,28);
    }
    .param-value {
      overflow: hidden;
      .px2rem(width,450);
      .px2rem(padding-left,70);
      span,
      input {
        color: #999;
        .px2rem(font-size,28);
      }
    }
    .icon {
      color: #999;
      text-align: center;
      top: 0;
      right: 0;
      font-size: .4rem;
      .px2rem(padding-top,29);
      .px2rem(padding-bottom,29);
      .px2rem(padding-right,24);
      .px2rem(padding-left, 24);
      // transform: translateY(-50%);
    }
    // 选日期样式
    .update-tm {
      .date-show {
        height: 0.88rem;
        line-height: 0.88rem;
        padding: 0.04rem;
        background-color: #f2f3f5;
        border-radius: 0.1rem;
        padding: 0.15rem;
        .btn-show {
          border-radius: 0.08rem;
          input {
            border-radius: 0.08rem;
            background-color: #fff;
            display: inline-block;
            width: 100%;
            height: 100%;
            color: #999;
            outline: none;
            text-align: center;
          }
        }
        .date-link {
          height: 100%;
          line-height: 90%;
          width: 14%;
          font-weight: normal;
          font-size: 36px;
          text-align: center;
          color: #999;
        }
      }
      .date-pick {
        margin-top: 0.2rem;
        .pick-box {
          height: 0.88rem;
          line-height: 0.88rem;
          background-color: #fff;
          input {
            display: inline-block;
            width: 100%;
            height: 100%;
            border-radius: 0.1rem;
            color: #333;
            text-align: center;
            background-color: #f2f3f5;
          }
        }
        .pl {
          padding-left: 0.15rem;
        }
        .pr {
          padding-right: 0.15rem;
        }
      }
    }
    .color-g {
      color: #797f89;
    }
    .bc-l {
      background-color: #f9f9f9 !important;
    }
    .main {
      width: 100%;
      height: 100%;
      .main-content {
        overflow-x: hidden;
        width: 100%;
        // position: absolute;
        // top: 0;
        // bottom: 0;
        padding: 0.18rem 0.25rem;
      }
    }

    .main-unlist {
      width: 100%;
      height: 100%;
      .main-content {
        width: 100%;
        .sq {
          .sq-info {
            width: 40%;
            height: 1.2rem;
            line-height: 1.2rem;
            padding-left: 0.25rem;
            font-weight: normal; // color:#;
          }
          .sq-ct {
            // min-width: 60%;
            height: 1.2rem;
            line-height: 1.2rem;
            font-size: 14px;
            padding-right: 1rem;
            color: #999;
            font-size: 14px;
            input {
              display: inline-block;
              width: 100%;
              height: 1.2rem;
              line-height: 1.2rem;
              color: #999;
              font-size: 14px;
            }
            input::-webkit-input-placeholder {
              color: #999;
              font-size: 14px;
            }
          }
          .icon {
            top: 50%;
            right: 0;
            color: #999;
            width: 1rem;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            transform: translateY(-50%);
          }
        }
        .param-title {
          color: #333;
        }
      }
      .ac {
        color: #108ee9 !important;
        background-color: #e4f1ff !important;
      }
    }
  }
  .listfilter-footer {
    z-index: 117;
    position: absolute;
    bottom: 0;
    right: 0;
    .px2rem(height,98);
    .px2rem(width,618);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    div {
      flex-basis: 50%;
      .px2rem(height,44);
      .px2rem(line-height,44);
      .px2rem(font-size,32);
      color: #467db9;
      border-right: 1px solid #d9d9d9;
      text-align: center;
      &:last-child {
        border-right: 0;
      }
    }
  }
}
</style>
