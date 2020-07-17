<template>
  <section class="h3-calendar">
    <section class="h3_container">
      <div class="h3_content_all">
        <div class="h3_top_changge" v-show="!isCollapse">
          <li>{{dateTop}}
            <span class="h3_today" v-show="!isToday" @click="toggleToToday">今天</span>
          </li>
          <li @click="changeDate">
            <i class="aufont icon-base-calendar"></i>
          </li>
        </div>
        <div class="h3_content">
          <div class="h3_content_item" v-for="tag in textTop">
            <div class="h3_top_tag">
              {{tag}}
            </div>
          </div>
        </div>
        <div class="h3_content h3-calendar-body" :class="wrapCls">
          <div class="h3_content_row" :class="[{'h3_content_row_selected': index == selectedRowIndex }, {'h3_content_row_collapse': index !== selectedRowIndex && isCollapse }]" v-for="(items, index) in list" :key="index">
            <div class="h3_content_item" v-for="item in items" :key="item.date" @click="clickDay(item)">
              <div class="h3_item_date" v-bind:class="[{h3_other_dayhide:item.otherMonth!=='nowMonth'},{h3_want_dayhide:item.dayHide},{h3_isToday:item.isToday},{h3_chose_day:item.chooseDay},setClass(item)]">
                {{item.id}}
                <span class="h3_item_date_mark" v-if="item.isMark"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="h3-calendar-toggle" @click="toggleCollapse" :class="[{'h3-calendar-toggle-expand': !isCollapse}]">
          <h3-icon type="down" ></h3-icon>
        </div>
      </div>
    </section>
    
  </section>
  
</template>

<script>
import timeUtil from './calendar';
import H3Icon from '../h3-icon';
import H3WhiteSpace from '../h3-white-space';
// import env from '../../utils/env';

export default {
  data() {
    return {
      textTop: ['日', '一', '二', '三', '四', '五', '六'],
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: '',
      chooseDay: null,
      selectedRowIndex: -1,
      isUp: false, // 正在上拉
      isCollapse: false, // 日历是否折叠
    };
  },
  components: {
    H3Icon,
    H3WhiteSpace,
  },
  props: {
    markDate: {
      type: Array,
      default: () => [],
    },
    markDateMore: {
      type: Array,
      default: () => [],
    },
    agoDayHide: { type: String, default: '0' },
    futureDayHide: { type: String, default: '2554387200' },
    choseDay: Function,
    changeMonth: Function,
    collapse: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.myDate = new Date();
    this.chooseDay = this.myDate;
    this.isCollapse = this.collapse;
  },
  methods: {
    setClass(data) {
      const obj = {};
      obj[data.markClassName] = data.markClassName;
      return obj;
    },
    clickDay(item) {
      this.chooseDay = new Date(item.date);
      if (item.otherMonth === 'nowMonth' && !item.dayHide) {
        this.getList(this.chooseDay);
      }
      if (item.otherMonth !== 'nowMonth') {
        if (item.otherMonth === 'preMonth') {
          this.PreMonth(this.chooseDay);
        } else {
          this.NextMonth(this.chooseDay);
        }
      }
      if (this.choseDay) {
        this.choseDay(this.chooseDay);
      }
    },
    toggleToToday() {
      this.chooseDay = this.myDate;
      this.getList(this.chooseDay);
      if (this.choseDay) {
        this.choseDay(this.chooseDay);
      }
    },
    ChoseMonth(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = new Date(date);
      if (this.changeMonth) {
        this.changeMonth(timeUtil.dateFormat(this.myDate));
      }
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    changeDate() {
      const year = `${this.chooseDay.getFullYear()}`;
      let month = this.chooseDay.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      const value = `${year}-${month}`;
      const format = 'YYYY-MM';
      const self = this;
      this.$h3.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        currentText: '本月',
        format,
        value,
        minYear: 1753,
        maxYear: 2200,
        onConfirm(val) {
          // console.log(val);
          self.SelectMonth(val);
        },
        onShow() {
        },
        onHide() {
        },
      });
    },
    PreMonth() {
      if (this.changeMonth) {
        this.changeMonth(timeUtil.dateFormat(this.chooseDay));
      }
      this.getList(this.chooseDay);
    },
    NextMonth() {
      if (this.changeMonth) {
        this.changeMonth(timeUtil.dateFormat(this.chooseDay));
      }
      this.getList(this.chooseDay);
    },
    SelectMonth(date) {
      const timeArray = date.split('-');
      const year = parseInt(timeArray[0], 10);
      const month = parseInt(timeArray[1], 10);
      const day = this.chooseDay.getDate();
      this.chooseDay = timeUtil.getSpecialMonth(year, month, day);
      if (this.changeMonth) {
        this.changeMonth(timeUtil.dateFormat(this.chooseDay));
      }
      this.getList(this.chooseDay);
    },
    forMatArgs() {
      const markDate = this.markDate;
      for (let i = 0; i < markDate.length; i += 1) {
        markDate[i] = timeUtil.dateFormat(markDate[i]);
      }
      const markDateMore = this.markDateMore;
      for (let i = 0; i < markDateMore.length; i += 1) {
        markDateMore[i].date = timeUtil.dateFormat(markDateMore[i].date);
      }
      return [markDate, markDateMore];
    },
    getList(date) {
      const [markDate, markDateMore] = this.forMatArgs();
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      const arr = timeUtil.getMonthList(date);
      for (let i = 0; i < arr.length; i += 1) {
        let markClassName = '';
        const k = arr[i];
        k.chooseDay = false;
        const nowTime = k.date;
        const t = new Date(nowTime).getTime() / 1000;
        // 看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || '';
          }
        }
        // 标记选中某些天 设置class
        k.markClassName = markClassName;
        k.isMark = markDate.indexOf(nowTime) > -1;
        // 无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
        if (k.isToday) {
          this.$emit('isToday', nowTime);
        }
        const flag = !k.dayHide && k.otherMonth === 'nowMonth';
        if (this.chooseDay && this.chooseDay.getDate() === new Date(nowTime).getDate() && flag) {
          this.$emit('choseDay', nowTime);
          this.historyChose.push(nowTime);
          k.chooseDay = true;
          this.selectedRowIndex = Math.ceil((i + 1) / 7) - 1;
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime && !this.chooseDay && flag
        ) {
          k.chooseDay = true;
          this.selectedRowIndex = Math.ceil((i + 1) / 7) - 1;
        }
      }
      // 需要分组，每周一个分组
      const res = [];
      const rows = arr.length / 7;
      for (let i = 0; i < rows; i += 1) {
        const tmp = [];
        for (let j = 0; j < 7; j += 1) {
          tmp.push(arr[i * 7 + j]);
        }
        res.push(tmp);
      }
      this.list = res;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    isYesterday(date) {
      const day = new Date();
      day.setTime(day.getTime() - 24 * 60 * 60 * 1000);
      return day.getFullYear() === date.getFullYear() &&
        day.getMonth() === date.getMonth() &&
        day.getDate() === date.getDate();
    },
    // loadMore(page, done) {
    //   done(10, 10);
    // },
    // onScrollDocument(mescroll, y, isUp) {
    //   if (env.isIos) {
    //     return;
    //   }
    //   if (isUp) {
    //     this.isUp = true;
    //   } else {
    //     this.isup = false;
    //   }
    //   console.log(y);
    // },
    // touchEnd() {
    //   // console.log('touchend');
    //   if (this.isUp && !this.isCollapse) {
    //     this.isCollapse = true;
    //   }
    // },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit('update:collapse', this.isCollapse);
    },
  },
  mounted() {
    this.getList(this.chooseDay);
  },
  computed: {
    isToday() {
      return this.formatDate(this.myDate) === this.formatDate(this.chooseDay);
    },
    title() {
      if (this.isToday) {
        return '今天';
      } else if (this.isYesterday(this.chooseDay)) {
        return '昨天';
      }
      return `${this.chooseDay.getMonth() + 1}月${this.chooseDay.getDate()}日`;
    },
    wrapCls() {
      if (this.isCollapse) {
        return 'h3-calendar-collapse';
      }
      return 'h3-calendar-expand';
    },
  },
  watch: {
    markDate() {
      this.getList(this.chooseDay);
    },
    markDateMore() {
      this.getList(this.chooseDay);
    },
    agoDayHide(val) {
      this.agoDayHide = parseInt(val, 10);
      this.getList(this.chooseDay);
    },
    futureDayHide(val) {
      this.futureDayHide = parseInt(val, 10);
      this.getList(this.chooseDay);
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';

.h3_container {
  max-width: 410px;
  margin: auto;
  .h3-calendar-body {
    background: #fff;
  }
}
.mescroll{
  position: fixed;
  top: 88px;
  bottom: 0;
  height: auto;
  z-index: 2;
  width: 100%;
}

.h3_content_row_collapse {
  opacity: 0;
  height: 0;
}

li {
  list-style-type: none;
}
.h3_top_changge {
  display: flex;
}

.h3_top_changge li {
  cursor: pointer;
  display: flex;
  color: #000;
  font-size: 14px;
  flex: 1;
  align-items: center;
  height: 47px;
  &:first-child {
    justify-content: flex-start;
    padding-left: 5%;
  }
  &:last-child {
    justify-content: flex-end;
    padding-right: 5%;
  }
}

.h3_top_changge .h3_content_li {
  cursor: auto;
  flex: 2.5;
}
.h3_content_all {
  position: relative;
  background-color: #fff;
  width: 100%;
  // overflow: hidden;
  padding-bottom: 8px;
  // border-bottom: 1px solid silver;
  .hairline('bottom',#eeeeee);
}

.h3-calendar-toggle {
  position: absolute;
  right: 10%;
  bottom: -15px;
  z-index: 99;
  border-radius: 100%;
  background: #fff;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-shadow: 0 0 8px silver;
  i {
    color: silver;
  }
  transform: rotate(0deg);
  transition: transform 300ms;
}
.h3-calendar-toggle-expand {
  transform: rotate(180deg);
  transition: transform 300ms;
}


.h3_wrapper{
  height: auto;
  width: 100%; 
  overflow:hidden;
}

.h3_content,
.h3_content_row {
  display: flex;
  flex-wrap: wrap;
  padding: 0 1% 0 1%;
  width: 100%;
}

.h3_content:first-child .h3_content_item_tag,
.h3_content:first-child .h3_content_item {
  color: #ddd;
  font-size: 16px;
}

.h3_content_item,
.h3_content_item_tag {
  font-size: 15px;
  width: 14%;
  text-align: center;
  color: #000;
  position: relative;
}
.h3_today {
    display: inline-block;
    margin-left: 4px;
    width: 30px;
    border-radius: 100%;
    height: 30px;
    line-height: 30px;
    border: 1px solid #108ee9;
    text-align: center;
    font-size: 10px;
    color: #108ee9;
}
.h3_content_item {
  height: 40px;
}

.h3_top_tag {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.h3_item_date {
  width: 34px;
  height: 34px;
  line-height: 34px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.h3_item_date_mark {
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background: @brand-primary;
    position: absolute;
    bottom: 10px;
}

.h3_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  transform: rotate(-45deg);
}

.h3_jiantou1:active,
.h3_jiantou2:active {
  border-color: #ddd;
}

.h3_jiantou2 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  transform: rotate(45deg);
}
.h3_content_item > .h3_isMark {
  margin: auto;
  border-radius: 100px;
  background: blue;
  z-index: 2;
}
.h3_content_item .h3_other_dayhide {
  color: #bfbfbf;
}
.h3_content_item .h3_want_dayhide {
  color: #bfbfbf;
}
.h3_content_item .h3_isToday {
  border: 1px solid #108ee9;
  border-radius: 100px;
  color: #108ee9;
}
.h3_content_item .h3_chose_day {
  background: @brand-primary;
  border-radius: 100px;
  color: #fff;
}

.h3_container_data_wrapper {
  background: #fff;
  .h3_container_data_wrapper_title {
    height: 44px;
    line-height: 44px;
    text-align: left;
    padding-left: 20px;
    font-size: 14px;
    font-weight: bold;
  }
}

</style>


