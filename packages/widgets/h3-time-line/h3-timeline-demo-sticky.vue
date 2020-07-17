<template>
  <div class="h3-timeline-with-scroll">
    <H3TimelineWithScroll>
      <h3-timeline-node v-for="(group, index) in groupDates" :key="index">
        <p slot="timeHeader" style="background:#f8f8f8;">{{group.key}}</p>
        <h3-timeline-node-child v-for="(item, index) in group.value" :key="index">
          <p>{{item.Title}}</p>
          <p>{{item.Summary[0]}}</p>
          <p>{{item.Summary[1]}}</p>
        </h3-timeline-node-child>
      </h3-timeline-node>
    </H3TimelineWithScroll>
  </div>
</template>
<script>
import H3TimelineNode from './h3-timeline-node';
import H3TimelineNodeChild from './h3-timeline-node-child';
import H3TimelineWithScroll from './h3-timeline-with-scroll';

export default {
  name: 'h3-timeline-demo-sticky',
  components: {
    H3TimelineNode,
    H3TimelineNodeChild,
    H3TimelineWithScroll,
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
    // this.flowTitleHeight = document.querySelectorAll('.staticTitle')[0].offsetHeight;
    // const flowTitleHeightArr = [];
    // const doms = document.querySelectorAll('.staticTitle');
    // for (let i = 0; i < doms.length; i += 1) {
    //   const dom = doms[i];
    //   const top = dom.offsetTop;
    //   flowTitleHeightArr.push(top);
    // }
    // this.flowTitleHeightArr = flowTitleHeightArr;
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
      // const self = this;
      // const doms = document.querySelectorAll('.staticTitle');
      // if (y > self.flowTitleHeight) {
      //   self.addCls(doms[0], 'fixed-top');
      // } else {
      //   doms[0].classList.remove('fixed-top');
      // }
      // for (let i = 1; i < self.flowTitleHeightArr.length; i += 1) {
      //   if (y >= self.flowTitleHeightArr[i] - (self.flowTitleHeight * 2)) {
      //     if (y <= self.flowTitleHeightArr[i] - self.flowTitleHeight) {
      //       const diff = (self.flowTitleHeightArr[i] - (self.flowTitleHeight * 2)) - y;
      //       doms[i - 1].style.transform = `translateY(${diff}px)`;
      //     } else {
      //       self.addCls(doms[i], 'fixed-top');
      //     }
      //   }
      // }
    },
    addCls(targetDom, clsName) {
      // const doms = document.querySelectorAll('.staticTitle');
      // for (let i = 0; i < doms.length; i += 1) {
      //   const dom = doms[i];
      //   dom.classList.remove(clsName);
      //   dom.style.transform = 'translateY(0px)';
      // }
      // targetDom.classList.add(clsName);
    },
    iosScroll(mescroll, y) {
      // const self = this;
      // const dom = document.querySelectorAll('.staticTitle')[0];
      // if (y > self.flowTitleHeight) {
      //   dom.classList.add('sticky');
      // } else {
      //   dom.classList.remove('sticky');
      // }
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
  ul,li {
    list-style: none;
  }
  .mescroll{
    position: fixed;
    top: 0;
    bottom: 0;
    height: auto;
  }
}

</style>

