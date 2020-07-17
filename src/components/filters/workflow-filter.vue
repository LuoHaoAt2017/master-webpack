<template>
  <div id="filters"  :style="{top: $store.state.corpId?0:'46px'}" style="z-index:112;" ref="filters" >  
    <div class="mask" @click="cancel"></div>
    <div class="filter-box" ref="filtersBox">      
      <div class="filter-wrapper" ref="wrapper">        
        <div class="main-content" >
            <filters  ref="childs"   :filterListsData = "filterListsData"  >
            </filters>
        </div>  
      </div>      
    </div> 
    <div class="footer bd-top">
      <div @click="cancel">取消</div>
      <div @click="ok">完成</div>
    </div>
  </div>
</template>
<script>
// zyq;
import BScroll from 'better-scroll';
import FormInstanceState from './sub-filters/form-instance-state.vue';
import FormSheets from './sub-filters/form-sheets.vue';
import FormUrgency from './sub-filters/form-urgency.vue';
import { getItemSheets } from '../../service/get-data';

export default {
  name: 'filterpage',
  components: {
    filters: {
      props: ['filterListsData'],
      render(h) {
        const subs = [];
        for (const paramObj of this.filterListsData) {
          switch (paramObj.ControlKey) {
            case 'FormInstanceState':
              subs.push(h(
                FormInstanceState,
                { props: { formVal: paramObj }, ref: paramObj.DataField },
              ));
              break;
            case 'FormUrgency':
              subs.push(h(FormUrgency, { props: { formVal: paramObj }, ref: paramObj.DataField }));
              break;
            case 'FormSheets':
              subs.push(h(FormSheets, {
                props: { formVal: paramObj },
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
    'isShow',
    'pageId',
    'type', // 待审批、已审批 2、待办、已办 0、抄送全部、抄送待阅 3 我申请的 -1
    'status', // 状态 4 未完成 2 已办
  ],
  data() {
    return {
      filterParams: [], // 过滤参数
      filterListsData: [],
      scroll: null,
    };
  },
  created() {},
  methods: {
    // 初始化
    init() {
      let actionName = null;
      if (this.type === -1) {
        actionName = 'GetInstanceSheetNameFilters';
      } else {
        actionName = 'GetWorkItemSheetNameFilters';
      }
      const appCode = this.$store.state.appCode;
      const solutionCode = this.$store.state.solutionCode;
      // if (!appCode && !solutionCode) {
      //   appCode = 'home';
      //   solutionCode = 'home';
      // }
      this.querySheets(actionName, this.type, this.status, solutionCode, appCode);
    },

    async querySheets(ActionName, WorkItemType, WorkItemState, solutionCode, appCode) {
      const res =
      await getItemSheets(ActionName, WorkItemType, WorkItemState, solutionCode, appCode);
      if (res.Successful) {
        this.filterParams = [].concat(res.ReturnData.Data.rows);
        this.formatQueryParams(this.filterParams);
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.wrapper, {
            probeType: 3,
            click: true,
            scrollY: true,
            bounce: true,
          });
        });
      }
    },
    formatQueryParams(params) {
      const tmp = [];
      if (this.type !== -1) {
        if (this.status === 2) {
          // 已结束的状态有流程状态过滤参数
          tmp.push({
            DataField: 'InstanceState',
            ControlKey: 'FormInstanceState',
          });
        } else if (this.type === 3) {
          tmp.push({
            DataField: 'InstanceState',
            ControlKey: 'FormInstanceState',
          });
        }
      } else {
        tmp.push({
          DataField: 'InstanceState',
          ControlKey: 'FormInstanceState',
        });
      }
      if (this.type !== 3 && this.type !== -1) {
        tmp.push({
          DataField: 'WorkCriticalLevel',
          ControlKey: 'FormUrgency',
        });
      }
      // 加上全部
      const defaultItems = [
        {
          SheetName: '全部',
          SchemaCode: '',
        },
      ];
      tmp.push({
        DataField: 'SchemaCode',
        ControlKey: 'FormSheets',
        Status: this.status,
        Type: this.type,
        DefaultItems: defaultItems.concat(params),
      });
      this.filterListsData = tmp;
    },

    getValue() {
      const res = {};
      const refs = this.$refs.childs.$refs;
      for (const ref in refs) {
        if (refs[ref] !== undefined) {
          res[ref] = refs[ref].getValue();
        }
      }
      // 触发事件
      this.$root.eventHub.$emit(`executeFilter-${this.pageId}`, res);
    },
    ok() {
      this.getValue();
    },
    reset() {
      // 重置
      const refs = this.$refs.childs.$refs;
      for (const ref in refs) {
        if (Object.prototype.hasOwnProperty.call(refs, ref)) {
          refs[ref].reset();
        }
      }
    },
    cancel() {
      this.$root.eventHub.$emit('cancel-filter');
    },
  },
  watch: {
    isShow() {
      if (this.isShow) {
        if (this.filterListsData.length === 0) {
          this.init();
        }
      }
    },
    status() {
      this.filterListsData = [];
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
@-webkit-keyframes filter-modal {
  0% {
    width: 0%;
  }

  100% {
    .px2rem(width,658);
  }
}

@keyframes filter-modal {
  0% {
    width: 0%;
  }

  100% {
    .px2rem(width,658);
  }
}
.bd-top {
  border: 0 !important;
  background-image: -webkit-linear-gradient(180deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-image: linear-gradient(180deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: top;
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
  .filter-box {
    z-index: 116;
    .px2rem(width,658);
    animation: filter-modal 0.3 ease-in;
    position: absolute;
    top: 0;
    right: 0;
    .px2rem(bottom,88);
    // .px2rem(padding,24);
    overflow-y: auto;
    background-color: #fff;
    div.filter-wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
    .wf-filter {
      .px2rem(padding,24);
      .wf-filter-title {
        text-align: left;
        color: #2c3038;
        .px2rem(font-size,30);
      }
      .wf-filter-value {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        div {
          // .px2rem(width,174);
          .px2rem(height,72);
          .px2rem(line-height,72);
          .px2rem(margin-right,20);
          .px2rem(margin-top,20);
          .px2rem(border-radius,10);
          color: #797f89;
          background-color: #f9f9f9;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &.urgency,
          &.instance-state {
            .px2rem(width,190);
          }
          &.urgency:nth-child(3),
          &.instance-state:nth-child(3) {
            margin-right: 0;
          }
          &.sheet {
            .px2rem(width,295);
          }
          &.sheet:nth-child(2n) {
            margin-right: 0;
          }

          &.active {
            color: #467db9;
            background-color: #e9f3fe;
            .px2rem(border-radius,8);
          }
        }
      }
    }

    .main {
      width: 100%;
      height: 100%;
      .main-content {
        overflow-x: hidden;
        width: 100%;
        padding: 0.18rem 0.25rem;
      }
    }
  }
  .footer {
    z-index: 117;
    position: absolute;
    bottom: 0;
    right: 0;
    .px2rem(height,88);
    .px2rem(width,658);
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      flex-basis: 50%;
      .px2rem(height,88);
      .px2rem(line-height,88);
      .px2rem(font-size,32);
      text-align: center;
      &:first-child {
        border-right: 0;
        color: #2c3038;
        background-color: #fff;
      }
      &:last-child {
        border-right: 0;
        color: #fff;
        background-color: #4a90e2;
      }
    }
  }
}
</style>


