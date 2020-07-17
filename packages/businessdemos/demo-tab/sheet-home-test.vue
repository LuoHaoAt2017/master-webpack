<template>
  <div class="h3-sheet-home-test">
   
    <div class="search-bar" v-show="true">
      <div class="searchBarWarpper" :class="{'h3-search-focus':isSearching,}">
        <SearchBar prefixCls="h3-search-opposite" ref="searchBar" v-model="searchKey"  placeholder="搜索数据标题" 
          :onChange="searchByKeyAsync"
          :onCancel="cancelSearch" 
          :showCancelButton="false" 
          :onFocus="onFocus"
          :onBlur="onBlur" />
      </div>
      <div class="filter" v-if="showFilter">          
          筛选
      </div>
    </div>

    <h3-scroll ref="scroll"  :loadMore="loadMore" :scroll="scrollFunction">
      <H3TimelineNode v-for="(group, index) in groupDates" :key="index">
        <div class="timeline-item-content" slot="timeHeader">
          <p class="item-group">{{group.key}}</p>
        </div>
        <H3TimelineNodeChild v-for="(Item, index) in group.value" :key="index">
          <h3-card-form @click.native="clickCardForm(Item)" :hasLine="false">
            <div> 
              <div style="display: flex"> 
                <div :class="mainTitleCls(Item)" v-html="getDataTitleName(Item.Title)">
                </div>
                <h3-Status-tip style="{margin-top: 0.04rem;}"  :type="Item.Status" v-if="Item.Status"></h3-Status-tip>
              </div>
              <div class="main-summary" 
                  v-for="(Summary,index) in Item.Summary" :key="index" 
                  v-if="Item.Summary && index < 5">
                {{Summary}}
              </div>
            </div>
          </h3-card-form>
          <div class="sheet-home-test-time">{{Item.time}}</div>
        </H3TimelineNodeChild>
      </H3TimelineNode>

    </h3-scroll>
   
    <h3-modal :show="popupModalShow" maskClosable type="popup" style="top: 44px;" popup-direction="down"  >
    </h3-modal>
  </div>
</template>
<script>
import cx from 'classnames';
import H3CardForm from '../../widgets/h3-card-data-list/index';
import H3StatusTip from '../../widgets/h3-tool-tip/h3-status-tip';
import H3TimelineNode from '../../widgets/h3-time-line/h3-timeline-node';
import H3TimelineNodeChild from '../../widgets/h3-time-line/h3-timeline-node-child';
import SearchBar from '../../components/h3-search-bar/index';
import H3Modal from '../../components/h3-modal/index';
import H3Scroll from '../../components/h3-scroll/mescroll';

export default {
  name: 'sheet-home-test',
  components: {
    H3Scroll,
    H3CardForm,
    H3StatusTip,
    SearchBar,
    H3Modal,
    H3TimelineNode,
    H3TimelineNodeChild,
  },
  data() {
    return {
      groupDates: [
        {
          key: '今天',
          value: [
            {
              ObjectId: '今天1111',
              axis: 'horizen',
              Status: 'draft',
              Title: '数据标题数据标数据标题数据标数数据标题数据标数据标题数据标',
              Summary: [
                '数据标题数据标控件摘要内容摘要内容摘要内容要内容摘要内容要内容摘要内容要',
                '数据标题数据标控件摘要内容摘要内容摘要内容',
                '数据标题数据标控件摘要内容摘要内容摘要内容',
                '数据标题数据标控件摘要内容摘要内容摘要内容',
              ],
              time: '15:23',
            },
            {
              ObjectId: '今天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222数据标题数据标数据标题数据标数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '昨天',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222数据标题数据标数据标题数据标数据标题数据标数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '5月26日',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '5月25日',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '5月24日',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '5月23日',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '5月22日',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
      ],
      timeLineAxisDisplayFormat: 'yyyy-mm-dd hh:ii',
      axis: null,
      isSearching: false,
      searchKey: '',
      highLightText: '',
      showFilter: true,
      filterItems: {},
      flowTitleTop: 0,
      flowTitleHeight: 0,
      flowTitleHeightArr: 0,
    };
  },
  mounted() {
    this.initScroll();
    this.flowTitleHeight = document.querySelectorAll('.staticTitle')[0].offsetHeight;
    const flowTitleHeightArr = [];
    const doms = document.querySelectorAll('.staticTitle');
    for (let i = 0; i < doms.length; i += 1) {
      const dom = doms[i];
      const top = dom.offsetTop;
      flowTitleHeightArr.push(top);
    }
    this.flowTitleHeightArr = flowTitleHeightArr;
  },
  methods: {
    initScroll() {
      if (this.isIos) {
        // 如果是IOS 那就加样式 上面预备框v-if false
      } else {
        // 如果不是那就监听滚动事件 动态赋值
      }
    },
    loadMore(page, done) {
      done(10, 10);
    },
    onScrollDocument(mescroll, y) {
      const self = this;
      const doms = document.querySelectorAll('.staticTitle');
      if (y > self.flowTitleHeight) {
        self.addCls(doms[0], 'fixed-top');
      } else {
        doms[0].classList.remove('fixed-top');
      }
      for (let i = 1; i < self.flowTitleHeightArr.length; i += 1) {
        if (y >= self.flowTitleHeightArr[i] - (self.flowTitleHeight * 2)) {
          if (y <= self.flowTitleHeightArr[i] - self.flowTitleHeight) {
            const diff = (self.flowTitleHeightArr[i] - (self.flowTitleHeight * 2)) - y;
            doms[i - 1].style.transform = `translateY(${diff}px)`;
          } else {
            self.addCls(doms[i], 'fixed-top');
          }
        }
      }
    },
    addCls(targetDom, clsName) {
      const doms = document.querySelectorAll('.staticTitle');
      for (let i = 0; i < doms.length; i += 1) {
        const dom = doms[i];
        dom.classList.remove(clsName);
        dom.style.transform = 'translateY(0px)';
      }
      targetDom.classList.add(clsName);
    },
    mainTitleCls(Item) {
      return cx('main-title', {
        'has-aside': Item.Status === undefined || Item.Status === '',
        'has-aside-status': Item.Status && Item.Status !== '',
        'without-summary': Item.Summary === undefined || Item.Summary.length < 1,
      });
    },
    getDataTitleName(dataTitle) {
      if (dataTitle) {
        return dataTitle.replace(this.highLightText, `<span style='color: #1890FF; font-size: 0.43rem'>${this.highLightText}</span>`);
      }
      return dataTitle;
    },
    searchByKeyAsync() {
      if (this.searchKey) {
        this.showFilter = false;
        this.highLightText = this.searchKey;
        const self = this;
        this.$nextTick(() => {
          self.searchByKey();
        });
      } else {
        this.total = -1;
      }
    },
    searchByKey() {
      if (!this.searchKey) {
        this.isSearching = false;
      } else {
        this.isSearching = true;
      }
      // TODO
      // this.$refs.scroll.mescroll.resetUpScroll();
    },
    cancelSearch() {
      this.searchKey = '';
      this.highLightText = '';
      this.isSearching = false;
      this.searchItems = [];
      this.showFilter = true;
      // TODO 还原数据
      // this.$refs.scroll.mescroll.resetUpScroll();
    },
    onFocus() {
      // TODO
      this.isSearching = true;
      this.isSearchingOnBlur = false;
      this.showFilter = false;
    },
    onBlur() {
      // TODO
      // this.total = -1;
      this.isSearchingOnBlur = true;
      this.showFilter = true;
      if (this.searchKey) {
        this.showFilter = false;
      } else {
        this.isSearching = false;
        this.showFilter = true;
      }
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    hideFilter() {
      this.showFilter = false;
    },
    resetFilter() { // 重置筛选条件
      this.filterItems = {};
      // this.$refs.scroll.mescroll.resetUpScroll();
    },
    filter() { // 执行筛选
    },
    clickCardForm(item) {
      // 点击进入表单
    },
    openListItem(item) {
    },
    iosScroll(mescroll, y) {
      const self = this;
      const dom = document.querySelectorAll('.staticTitle')[0];
      if (y > self.flowTitleHeight) {
        dom.classList.add('sticky');
      } else {
        dom.classList.remove('sticky');
      }
    },
  },
  computed: {
    popupModalShow() {
      if (this.isSearching && !this.searchKey) {
        return true;
      }
      return false;
    },
    isIos() {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
    curState() {
      // if (this.status === WorkItemStates.Unfinished) {
      //   return 4;
      // }
      return 2;
    },
    scrollFunction() {
      return this.isIos ? this.iosScroll : this.onScrollDocument;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

.overflow-ellipsis(){
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.top-line(){
  .hairline('bottom', #e4e4e4);
}

.temp{
  height: 5px;
  width: 100%;
}
.tempSticky{
  position: sticky;
  top: -5px;
  left: 0;
}

.h3-sheet-home-test{
  //搜索和筛选
  .search-bar {
    position: relative;
    z-index: 1000;
    display: flex;
    background: #fff;
    .px2rem(padding-left, 30);
    .top-line;
    .searchBarWarpper {
      flex: 1;
      .px2rem(margin-right,30);
      form {
        padding: 0;
      }
    }
    .search-bar-wrapper-copy{
      .px2rem(width, 502);
      form {
        padding: 0;
      }
    }
    .filter {
      color: #666;
      .px2rem(height, 88);
      .px2rem(line-height, 94);
      .px2rem(margin-right, 30);    
      .px2rem(font-size, 32);
      &:before {
        content: '';
      }
    }
  }

  .timeline-item-content{
    width: 100%;
    .item-group{
      width: 100%;
      .px2rem(height, 64);
      box-sizing: border-box;
      .px2rem(padding-left, 30);
      .px2rem(padding-top, 16);
      .px2rem(padding-bottom, 16);
      .px2rem(font-size, 26);
      .px2rem(line-height, 40);
      color: #999;
      background: #f8f8f8;
    }
  }
  .item-wrapper{
    background: #fff;
    .px2rem(padding-left, 36);
    position: relative;
    height: auto;
    .px2rem(border-bottom-width,1);
    border-bottom-style: solid;
    border-bottom-color: #EEEEEE;
    .timeline-item-border{
      .px2rem(width, 4);
      height: 100%;
      background: #f8f8f8;
    }
    .sheet-home-test-circle{
      width: 6px;
      height: 6px;
      background: #fff;
      border: 5px solid #eee;
      position: absolute;
      .px2rem(top, 32);
      .px2rem(left, 22);
      border-radius: 100%;
      z-index: 2;
    }
    .item-product{
      .px2rem(border-left-width, 4);
      border-left-style: solid;
      border-left-color: #f8f8f8;
    }
  }
  ul > .timeline-item:last-child{
    .item-product{
      .px2rem(border-bottom-width,1);
      border-bottom-style: solid;
      border-bottom-color: transparent;
    }
  }
  
  //列表卡片样式
  .h3-card-form{
    position: relative;
    .px2rem(padding, 0);
    border: none;
  }
  .h3-card-form-main{
    .title-status{
      display: flex;
      height: 25px;
      align-items: center;
    }
    .main-title{
      .px2rem(height,40);
      .px2rem(font-size,32);
      .px2rem(margin-bottom,8);
      color: #333333;
      .overflow-ellipsis;
      .high-light{
        color:#1890FF;
        .px2rem(font-size,26);
      }
    }
    .main-summary{
      .px2rem(width, 650);
      .px2rem(height,34);
      .px2rem(font-size,26);
      .px2rem(margin-top,8);
      color: #999999;
      .overflow-ellipsis;
    }
    .has-aside{
      .px2rem(width,570);
      .px2rem(max-width,570);
    }
    .has-aside-status{
      .px2rem(max-width,474);
      .px2rem(margin-right,16);
    }
    .without-summary{
      .px2rem(margin-bottom,0);
    }
    .h3-status-tip{
      .px2rem(margin-top,4);
    }
    
  }
}

.sheet-home-test-time{
  position: absolute;
  .px2rem(top, 22);
  // top: 0;
  .px2rem(right, 30);
  .px2rem(font-size, 24);
  .px2rem(line-height, 36);
  letter-spacing: 0;
  color: #999;
}
.staticTitle.sticky {  
  /*滚过初始位置时自动吸顶*/  
  position: -webkit-sticky;  
  position: sticky;  
  /*吸顶时的定位*/  
  top: 0;
  // .px2rem(top, 5);
  left: 0;  
  /*z比下方所有z高*/  
  z-index: 9999;
}
.staticTitle.fixed-top {  
  position: fixed;  
  width: 100%;  
  left: 0;  
  // top: 0;
  .px2rem(top, 88);
  z-index: 1000;
}  

.mescroll{
  position: fixed;
  // top: 1.17333333rem;
  .px2rem(top, 86);
  bottom: 0;
  height: auto;
}
.h3-timeline-node-wrapper > .h3-timeline-node-child-wrapper:not(:last-child){
  .hairline('bottom', #e4e4e4);
}
</style>

