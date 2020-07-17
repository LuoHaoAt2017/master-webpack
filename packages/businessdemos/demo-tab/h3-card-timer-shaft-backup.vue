<template>
  <div class="h3-sheet-home-test">
    <template v-for="(group, index) in groupDates" >
      <ul class="list-content list-content-hook">
        <li class="timeline-item"  :class="[index==0 ? 'staticTitle': '']">
          <div class="timeline-item-content">
            <p class="item-group">{{group.key}}</p>
          </div>
        </li>
        <li class="timeline-item" v-for="Item in group.value" :key="Item.ObjectId">
          <div class="timeline-item-color timeline-item-head">
            
          </div>
          <div class="timeline-item-tail" style="display:block;"></div>
          <div class="timeline-item-content">
            <div class="item-wrapper">
              <div class="item-product" >
                <h3-card-form @click.native="clickCardForm(Item)">
                  <div> 
                    <div style="display: flex"> 
                      <div :class="mainTitleCls(Item)" v-html="Item.Name.Value">
                      </div>
                      <h3-Status-tip style="{margin-top: 0.04rem;}"  :type="Item.Status" v-if="Item.Status"></h3-Status-tip>
                    </div>
                    <div class="main-summary" 
                        v-for="(Summary,index) in Item.Summary" :key="index" 
                        v-if="Item.Summary && index < 5">
                      {{Summary}}
                    </div>
                    <div class="sheet-home-test-circle"></div>
                  </div>
                </h3-card-form>
                <div class="sheet-home-test-time">{{Item.time}}</div>
              </div>
            </div>
            
          </div>
          
        </li>
      </ul>
    </template>
  </div>
</template>
<script>
import cx from 'classnames';
import H3CardForm from '../../widgets/h3-card-data-list/index';
import H3StatusTip from '../../widgets/h3-tool-tip/h3-status-tip';

export default {
  name: 'sheet-home-test',
  components: {
    H3CardForm,
    H3StatusTip,
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
              Name: {
                IsCustom: true,
                Value: '数据标题数据标数据标题数据标数数据标题数据标数据标题数据标',
              },
              Summary: [
                '数据标题数据标控件摘要内容摘要内容摘要内容要',
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
              Name: {
                IsCustom: true,
                Value: '数据标题数据标2222',
              },
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
              Name: {
                IsCustom: true,
                Value: '数据标题数据标',
              },
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
              Name: {
                IsCustom: true,
                Value: '数据标题数据标2222',
              },
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
          key: '5.26',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Name: {
                IsCustom: true,
                Value: '数据标题数据标',
              },
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
              Name: {
                IsCustom: true,
                Value: '数据标题数据标2222',
              },
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
          key: '5.25',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Name: {
                IsCustom: true,
                Value: '数据标题数据标',
              },
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
              Name: {
                IsCustom: true,
                Value: '数据标题数据标2222',
              },
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
      showFilter: false,
      filterItems: {},
      flowTitleTop: 0,
    };
  },
  mounted() {
    this.initScroll();
    console.log(document.querySelectorAll('.staticTitle')[0].offsetHeight);
    this.flowTitleHeight = document.querySelectorAll('.staticTitle')[0].offsetHeight;
    // this.flowTabTop = this.$refs.flowTab.$el.offsetTop;
    // this.staticFlowTabHeight = this.$refs.flowTab.$el.offsetHeight;
    // this.commentsHeaderTop = this.$refs.commentsHeader.offsetTop || 0;
  },
  methods: {
    
    mainTitleCls(Item) {
      return cx('main-title', {
        'has-aside': Item.Status === undefined || Item.Status === '',
        'has-aside-status': Item.Status && Item.Status !== '',
        'without-summary': Item.Summary === undefined || Item.Summary.length < 1,
      });
    },
  },
  computed: {
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

// 时间轴测试页面样式
.h3-sheet-home-test{
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
    .item-product{
      position: relative;
      .px2rem(padding-left, 30);
      .px2rem(border-bottom,1);
      border-style: solid;
      border-color: #EEEEEE;
    }
  }
  // .timeline-item:last-child{
  //   .item-product{
  //     .px2rem(border-bottom,1);
  //     border-style: solid;
  //     border-color: transparent;
  //   }
  // }
  
  //列表卡片样式
  .h3-card-form{
    position: relative;
    .px2rem(border-bottom,1);
    border-style: solid;
    border-color: transparent;
    border-left: 2px solid #f8f8f8;
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
      .px2rem(width, 660);
      .px2rem(height,34);
      .px2rem(font-size,26);
      .px2rem(margin-top,8);
      color: #999999;
      .overflow-ellipsis;
    }
    .has-aside{
      .px2rem(width,506);
    }
    .has-aside-status{
      // .px2rem(max-width,564);
      // .px2rem(max-width,506);
      .px2rem(max-width,484);
      .px2rem(margin-right,16);
    }
    .without-summary{
      .px2rem(margin-bottom,0);
    }
    .h3-status-tip{
      .px2rem(margin-top,4);
    }
    .sheet-home-test-circle{
      width: 6px;
      height: 6px;
      background: #fff;
      border: 5px solid #eee;
      position: absolute;
      .px2rem(top, 32);
      .px2rem(left, -20);
      border-radius: 100%;
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
  line-spacing: 0;
  color: #999;
}
.staticTitle.sticky {  
  /*滚过初始位置时自动吸顶*/  
  position: -webkit-sticky;  
  position: sticky;  
  /*吸顶时的定位*/  
  // top: 0;
  .px2rem(top, 88);
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
  top: 1.17333333rem;
  bottom: 0;
  height: auto;
}
</style>

