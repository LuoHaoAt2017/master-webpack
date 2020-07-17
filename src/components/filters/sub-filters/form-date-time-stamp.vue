<template>
    <div class="bd-bot scope">
        <div class="scope-title">{{formVal.DisplayName}}</div>
        <div class="number-value">
          <div class="">
            <input type="button" :value="dateArea.startDate" :style="{color:dateArea.startDate=='开始日期'?'#999':'#333' }" @click="pickStart">
          </div>
          <div > 一 </div>
          <div class="">
            <input  type="button" :value="dateArea.endDate" :style="{color:dateArea.endDate=='结束日期'?'#999':'#333' }" @click="pickEnd">
          </div>
      </div>
      <div class="scope-value">
        <div v-for="(item,index) in dateList" :key="index" :class="[item.Active?'active':'']" @click="pickDate(item,index)" >{{item.Text}}</div>
      </div>
      <!-- <group >
            <datetime @on-hide='popDateHide' @on-show='popDateShow' v-model="chooseDateVal"  format="YYYY-MM-DD" style="z-index:500000" v-if="false"></datetime>
      </group>  -->
    </div>
</template>
<script>
// zyq;
import { getFirstAndLastdayweek } from '../../../config/common';

export default {
  name: 'FormDateTimeStamp',
  components: {
    // Group,
    // Datetime
  },
  props: ['formVal'],
  data() {
    return {
      curIndex: -1, // 选中按钮
      dateArea: {
        startDate: '开始日期',
        endDate: '结束日期',
      },
      defaultDate: null, // 默认日期
      dateList: [{ Text: '今天', Active: false }, { Text: '本周', Active: false }, { Text: '本月', Active: false }],
      backUpValue: null,
      scopeValue: null,
    };
  },
  created() {
    this.init();
  },
  mounted() {
    // this.$store.state.readyFiltersCount++;
  },
  methods: {
    init() {
      // 页面初始化
      this.defaultDate = this.getDateArea(0).st;
      this.infoName = this.formVal.DisplayName;
      // 日期初始化
      const initDateStr = this.formVal.DefaultValue;
      if (initDateStr) {
        const initDateArr = initDateStr.split(';');
        this.dateArea.startDate = initDateArr[0];
        this.dateArea.endDate = initDateArr[1];
      }
    },

    getValue() {
      this.backUpValue = null;
      let v1;
      let v2;
      if (this.dateArea.startDate && this.dateArea.startDate !== '开始日期') {
        v1 = this.dateArea.startDate;
      } else {
        v1 = null;
      }
      if (this.dateArea.endDate && this.dateArea.endDate !== '结束日期') {
        v2 = this.dateArea.endDate;
      } else {
        v2 = null;
      }
      return [v1, v2];
    },
    setValue(v) {
      if (typeof v === 'undefined') {
        this.reset();
        return;
      }
      let formatDateTime1 = '';
      let formatDateTime2 = '';
      if (!$.isEmptyObject(v)) {
        let values = null;
        if (v.constructor === Array) {
          values = v;
        } else {
          values = v.split(';');
        }
        if (!$.isEmptyObject(values[0]) && values[0].indexOf('1753-01-01') === values[0].indexOf('9999-01-01')) {
          formatDateTime1 = new Date(values[0].replace(/-/g, '/')).Format('yyyy-MM-dd');
        } else {
          formatDateTime1 = '';
        }
        if (!$.isEmptyObject(values[1]) && values[1].indexOf('1753-01-01') === values[1].indexOf('9999-01-01')) {
          formatDateTime2 = new Date(values[1].replace(/-/g, '/')).Format('yyyy-MM-dd');
        } else {
          formatDateTime2 = '';
        }
        this.dateArea.startDate = formatDateTime1;
        this.dateArea.endDate = formatDateTime2;
      } else {
        this.reset();
      }
    },
    reset() {
      this.backUpValue = {
        startDate: this.dateArea.startDate,
        endDate: this.dateArea.endDate,
        item: this.scopeValue,
      };
      this.dateArea.startDate = '开始日期';
      this.dateArea.endDate = '结束日期';
      for (const item of this.dateList) {
        this.$set(item, 'Active', false);
      }
    },
    rollBack() {
      if (this.backUpValue) {
        this.dateArea.startDate = this.backUpValue.startDate;
        this.dateArea.endDate = this.backUpValue.endDate;
        if (this.backUpValue.item) {
          for (const item of this.dateList) {
            if (item.Text === this.backUpValue.item.Text) {
              this.$set(item, 'Active', true);
              break;
            }
          }
        }
        // this.dateArea=this.backUpValue.dateArea;
        // this.dateList=this.backUpValue.dateList;
      }
    },
    // hideDatetime() {
    //   const dateTimeInfo = document.getElementById('vux-datetime-instance');
    //   const dateMask = document.getElementsByClassName('dp-mask')[0];
    //   if (dateTimeInfo) {
    //     dateTimeInfo.style.display = 'none';
    //   }
    //   if (dateMask) {
    //     dateMask.style.display = 'none';
    //   }
    // },
    getDateArea(type) {
      // 点击获取日期范围
      const d = new Date();
      const todayDate = d.Format('yyyy-MM-dd');
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      let dateAreaObj = {};
      const months = month >= 10 ? `${month}` : `0${month}`;
      const D = new Date(year, month, 0);
      const monthDays = D.getDate();
      const MfirstDay = `${year}-${months}-01`;
      const MlastDay = `${year}-${months}-${monthDays}`;
      if (type === 0) {
        // 今天
        dateAreaObj = {
          st: d.Format('yyyy-MM-dd 00:00'),
          ed: d.Format('yyyy-MM-dd 23:59'),
          // ed: d.AddDays(1).Format('yyyy-MM-dd'),
        };
      } else if (type === 1) {
        // 本周
        const thisweek = getFirstAndLastdayweek();
        dateAreaObj = {
          st: thisweek[0] + ' 00:00', // weekFisrt,
          ed: thisweek[1] + ' 23:59', // weekLast
        };
      } else {
        // 本月
        dateAreaObj = {
          st: MfirstDay + ' 00:00',
          ed: MlastDay + ' 23:59',
        };
      }
      return dateAreaObj;
    },
    pickDate(item, index) {
      // 修改日期选择
      for (const tempitem of this.dateList) {
        this.$set(tempitem, 'Active', false);
      }
      this.scopeValue = item;
      this.$set(item, 'Active', true);
      const dateAreaObj = this.getDateArea(index); // 设置开始、结束时间
      this.dateArea.startDate = dateAreaObj.st;
      this.dateArea.endDate = dateAreaObj.ed;
    },
    // 点击日期控件选择开始
    pickStart() {
      const that = this;
      for (const item of this.dateList) {
        this.$set(item, 'Active', false);
      }
      this.$store.state.DateTimePluginShow = true;
      this.$h3.datetime.show({
        cancelText: '取消',
        clearText: '清除',
        confirmText: '确定',
        currentText: '此刻',
        minYear: 1753,
        maxYear: 2100,
        format: 'YYYY-MM-DD HH:mm',
        value: this.defaultDate,
        onConfirm(val) {
          that.dateArea.startDate = val;
          that.$store.state.DateTimePluginShow = false;
        },
        onHide() {
          that.$store.state.DateTimePluginShow = false;
        },
        onClear() {
          that.dateArea.startDate = '开始日期';
        },
        onShow() {
          const mask = document.querySelector('.dp-mask');
          if (mask) {
            mask.addEventListener(
              'touchmove',
              (e) => {
                e.preventDefault();
              },
              false,
            );
          }
        },
      });
    },
    pickEnd() {
      const that = this;
      for (const item of this.dateList) {
        this.$set(item, 'Active', false);
      }
      this.$store.state.DateTimePluginShow = true;
      this.$h3.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        clearText: '清除',
        currentText: '此刻',
        format: 'YYYY-MM-DD HH:mm',
        minYear: 1753,
        maxYear: 2100,
        value: this.defaultDate,
        onConfirm(val) {
          that.dateArea.endDate = val;
          that.$store.state.DateTimePluginShow = false;
        },
        onClear() {
          that.dateArea.endDate = '结束日期';
        },
        onHide() {
          that.$store.state.DateTimePluginShow = false;
        },
      });
    },
  },
};
</script>
<style lang = "less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.number-value {
  display: flex;
  justify-content: space-between;
  background-color: #f2f3f5;
  .px2rem(height,66);
  .px2rem(margin-top,20);
  .px2rem(border-radius,10);
  align-items: center;
  div {
    color: #999;
    .px2rem(width,240);
    text-align: center;
    &:first-child {
      .px2rem(padding-left,8);
    }
    &:last-child {
      .px2rem(padding-right,8);
    }
    &:nth-child(2) {
      .px2rem(width,74);
    }
    input {
      .px2rem(width,240);
      .px2rem(height,50);
      .px2rem(font-size,24);
      text-align: center;
      color: #999;
      background-color: #fff;
    }
    input::-webkit-input-placeholder {
      .px2rem(font-size,28);
      color: #999;
    }
  }
}
</style>
