<template>
  <div class="h3-timeline-with-scroll">
    <h3-scroll ref="scroll"  :loadMore="loadMore" :scroll="scrollFunction">
      <div id="timeline-scroll-wrapper">
        <slot></slot>
      </div>
    </h3-scroll>
  </div>
</template>
<script>
import H3Scroll from '../../components/h3-scroll/mescroll';

export default {
  name: 'h3-timeline-with-scroll',
  components: {
    H3Scroll,
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
              // Status: 'draft',
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
      showFilter: true,
      filterItems: {},
      flowTitleTop: 0,
      flowTitleHeight: 0,
      flowTitleHeightArr: 0,
    };
  },
  mounted() {
    this.initScroll();
    const timelinewrapper = document.querySelector('#timeline-scroll-wrapper');
    const children = timelinewrapper.children;
    if (children.length > 0) {
      this.flowTitleHeight = document.querySelectorAll('.staticTitle')[0].offsetHeight;
      const flowTitleHeightArr = [];
      const doms = document.querySelectorAll('.staticTitle');
      for (let i = 0; i < doms.length; i += 1) {
        const dom = doms[i];
        const top = dom.offsetTop;
        flowTitleHeightArr.push(top);
      }
      this.flowTitleHeightArr = flowTitleHeightArr;
    }
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
    isIos() {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
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

// .h3-search-focus{
//   width: 100%;
// }

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
    .px2rem(border-bottom-width,1);
    border-bottom-style: solid;
    border-bottom-color: transparent;
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
  border: 1px solid transparent;
}
.staticTitle.fixed-top {  
  position: fixed;  
  width: 100%;  
  left: 0;  
  // top: 0;
  .px2rem(top, 88);
  z-index: 1000;
}  

.h3-timeline-with-scroll{
  .mescroll{
    position: fixed;
    top: 0;
    bottom: 0;
    height: auto;
  }
}
</style>

