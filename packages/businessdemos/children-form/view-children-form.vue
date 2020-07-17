<template>
  <div>
    <h3-scroll ref="scroll" :enable-down="false" :loadMore="loadMore" :scroll="onScrollDocument">
      <div class="staticHeader h3-double-accordion" v-if="!isIos" :style="staticHeaderStyle">
        <div class="staticFlowTab" :style="itemTitleOpacityStyle" 
          ref="staticItemTitle" v-html="staticItemTitle"></div>
        <div class="comments-header form-simple-title static-item-child-title"  
          ref="secondSticky" :style="childTitleOpacityStyle"
          v-html="staticItemChildTitle">
        </div>
      </div>
      <h3-accordion class="h3-double-accordion" :multi="true">
        <h3-accordion-item  position="left" iconClass="icon-base-right"
          v-for="(item,index) in data" :key="index" :multi="true" :item-title-cls= "itemTitleCls"
          :class="[item.formSchema === 1 ? 'accordion-content-schema' :'', `outter-title-${index}`]">
          <template slot="title">
            <span class="form-title">{{ item.title}}</span>
            <span class="form-template" @click.stop="onChangeSchema(item)">
              {{item.formSchema === 0 ? '切换到矩阵模式' : '切换到平铺模式'}}
            </span>
          </template>
          <div v-if="item.formSchema === 1" class="form-simple">
            <div class="form-simple-title itemChildTitleStatic" :class="itemChildTitleCls">
              <span v-for="title in summartSchema">{{title}}</span>
            </div>
            <div class="form-simple-details" v-for="content in item.details">
              <span v-for="title in summartSchema">{{content[title]}}</span>
            </div>
          </div>
          <h3-accordion-item-child position="left" iconClass="icon-base-right"
            v-for="(detail,index) in item.details" :key="index" 
            :item-child-title-cls= "itemChildTitleCls"  v-if="item.formSchema === 0">
            <div slot="title" style="display: flex">
              <span class="form-details-index">{{ index +1 }}</span>
              <span class="form-details-title">{{Object.keys(detail)[0]}}</span>
              <span class="form-details-parmers-title">{{Object.values(detail)[0]}}</span>
            </div>
            <div class="form-details" v-for="(val,key,detailIndex) in detail" v-if="detailIndex >0">
              <span class="form-details-index" style="color: #FFFFFF">{{index + 1}}</span>
              <span class="form-details-title">{{key}}</span>
              <div class="form-details-parmers">{{val}}</div>
            </div>
          </h3-accordion-item-child>
        </h3-accordion-item>
      </h3-accordion>
    </h3-scroll>
  </div>
</template>
<script>
import { H3Accordion, H3AccordionItem, H3AccordionItemChild } from '../../components/h3-accordion';
import H3Scroll from '../../components/h3-scroll/mescroll';

export default {
  components: {
    H3Accordion,
    H3AccordionItem,
    H3AccordionItemChild,
    H3Scroll,
  },
  data() {
    return {
      data: [
        {
          title: '子表明细1',
          extra: '切换到矩阵模式',
          formSchema: 1,
          details: [
            {
              产品名称: 'CRM1',
              产品名称2: 'CRM2',
              产品名称3: 'CRM3',
              产品名称4: 'CRM4',
              产品名称5: 'CRM5',
            },
            {
              产品名称: 'CRM2',
              产品名称2: 'CRM2-2',
              产品名称3: 'CRM2-3',
              产品名称4: 'CRM2-4',
              产品名称5: 'CRM2-5',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM3-2',
              产品名称3: 'CRM3-3',
              产品名称4: 'CRM3-4',
              产品名称5: 'CRM3-5',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM3-2',
              产品名称3: 'CRM3-3',
              产品名称4: 'CRM3-4',
              产品名称5: 'CRM3-5',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM3-2',
              产品名称3: 'CRM3-3',
              产品名称4: 'CRM3-4',
              产品名称5: 'CRM3-5',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM3-2',
              产品名称3: 'CRM3-3',
              产品名称4: 'CRM3-4',
              产品名称5: 'CRM3-5',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM3-2',
              产品名称3: 'CRM3-3',
              产品名称4: 'CRM3-4',
              产品名称5: 'CRM3-5',
            },
          ],
        },
        {
          title: '子表明细2',
          extra: '切换到平铺模式',
          formSchema: 0,
          details: [
            {
              产品名称: 'CRM1',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
            {
              产品名称: 'CRM2',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
          ],
        },
        {
          title: '子表明细3',
          extra: '切换到平铺模式',
          formSchema: 0,
          details: [
            {
              产品名称: 'CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM测试换行最大宽度且有英文WJSDJAKJSK有符号，，和换行',
              产品名称5: 'CRM',
            },
            {
              产品名称: 'CRM2',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
            },
          ],
        },
      ],
      summartSchema: ['产品名称5', '产品名称4', '产品名称2'],
      itemTitleOpacity: 0,
      flowTabTop: 0,
      tabFlowCls: '',
      itemTitleCls: '',
      itemChildTitleCls: '',
      childTitleOpacity: 0,
      formSchema: 0, // 0是矩阵模式（默认） 1是平铺模式
      staticItemTitle: '',
      staticItemChildTitle: '',
      zIndexStaticHeader: -1,
    };
  },
  mounted() {
    this.initScroll();
  },
  methods: {
    initScroll() {
      if (this.isIos) {
        // 如果是IOS 那就加样式 上面预备框v-if false
        this.itemTitleCls = 'stay-top';
        this.itemChildTitleCls = 'stay-top-second';
      } else {
        // 如果不是那就监听滚动事件 动态赋值
      }
    },
    loadMore(page, done) {
      done(10, 10);
    },
    onScrollDocument(mescroll, y) {
      if (this.isIos) { return; }
      const staticOuterDoms = document.querySelectorAll('.staticTitle'); // 外层需要吸顶元素(子表标题)
      const firstDomHeight = staticOuterDoms[0].children[0].offsetHeight;
      const outerTopDistance = [];
      for (let i = 0; i < staticOuterDoms.length; i += 1) {
        const itemDom = staticOuterDoms[i];
        const top = itemDom.offsetTop;
        outerTopDistance.push(top);
      }

      for (let i = 0; i < outerTopDistance.length - 1; i += 1) {
        if (y >= outerTopDistance[i] && y < outerTopDistance[i + 1] + firstDomHeight * 2) {
          const innerDoms = document.querySelectorAll(`.outter-title-${i} .itemChildTitleStatic`); // 内层需要吸顶元素(数据标题)
          this.staticItemTitle = staticOuterDoms[i].children[0].innerHTML;
          let innerTopDistance = [];
          innerTopDistance = this.getTopDistanceArr(innerDoms); // 获取内层dom的top距离
          const diff = y - outerTopDistance[i];
          if (i === 0) {
            if (diff > 0 && diff < firstDomHeight * 2) {
              this.itemTitleOpacity = 0;
              this.zIndexStaticHeader = -1;
              this.childTitleOpacity = 0;
            }
            if (diff >= firstDomHeight * 2) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[i].innerHTML;
            }
          } else if (diff > firstDomHeight * 2) {
            this.itemTitleOpacity = 1;
            this.zIndexStaticHeader = 9999;
            this.childTitleOpacity = 1;
            if (diff >= innerTopDistance[0]
              && diff < innerTopDistance[1]) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[0].innerHTML;
            }
          }
          for (let k = 1; k < innerTopDistance.length - 1; k += 1) {
            if (diff >= innerTopDistance[k] && diff < innerTopDistance[k + 1]) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[k].innerHTML;
            }
          }
          const lastInnerIndex = innerTopDistance.length - 1;
          if (lastInnerIndex > 0) {
            if (diff > innerTopDistance[lastInnerIndex]) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[lastInnerIndex].innerHTML;
            }
          }
        }
      }

      const lastIndex = outerTopDistance.length - 1;
      if (y > outerTopDistance[lastIndex] + firstDomHeight * 2) {
        this.staticItemTitle = staticOuterDoms[lastIndex].children[0].innerHTML;
        const lastInnerDoms = document.querySelectorAll(`.outter-title-${lastIndex} .itemChildTitleStatic`); // 内层需要吸顶元素(数据标题)
        let lastInnerTopDistance = [];
        lastInnerTopDistance = this.getTopDistanceArr(lastInnerDoms); // 获取内层dom的top距离
        const lastDiff = y - outerTopDistance[lastIndex];
        if (lastDiff >= lastInnerTopDistance[0]
          && lastDiff < lastInnerTopDistance[1]) {
          this.zIndexStaticHeader = 9999;
          this.itemTitleOpacity = 1;
          this.childTitleOpacity = 1;
          this.staticItemChildTitle = lastInnerDoms[0].innerHTML;
        }
        for (let j = 1; j < lastInnerTopDistance.length - 1; j += 1) {
          if (lastDiff > lastInnerTopDistance[j] && lastDiff < firstDomHeight + lastInnerTopDistance[j + 1]) {
            this.zIndexStaticHeader = 9999;
            this.itemTitleOpacity = 1;
            this.childTitleOpacity = 1;
            this.staticItemChildTitle = lastInnerDoms[j].innerHTML;
          }
        }
        const lastInnerIndex = lastInnerTopDistance.length - 1;
        if (lastInnerIndex > 0) {
          if (lastDiff > lastInnerTopDistance[lastInnerIndex]) {
            this.zIndexStaticHeader = 9999;
            this.itemTitleOpacity = 1;
            this.childTitleOpacity = 1;
            this.staticItemChildTitle = lastInnerDoms[lastInnerIndex].innerHTML;
          }
        }
      }
    },
    getTopDistanceArr(domArr) {
      const topDistanceArr = [];
      for (let i = 0; i < domArr.length; i += 1) {
        const itemDom = domArr[i];
        if (itemDom.offsetParent) {
          const top = itemDom.offsetParent.offsetTop;
          topDistanceArr.push(top);
        }
      }
      return topDistanceArr;
    },
    onClickFun() {
      this.initScroll();
    },
    onChangeSchema(item) {
      if (item.formSchema === 0) {
        item.formSchema = 1;
        item.extra = '切换到矩阵模式';
      } else {
        item.formSchema = 0;
        item.extra = '切换到平铺模式';
      }
    },
  },
  computed: {
    isIos() {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
    staticHeaderStyle() {
      return {
        zIndex: this.zIndexStaticHeader,
      };
    },
    itemTitleOpacityStyle() {
      return {
        opacity: this.itemTitleOpacity,
        filter: `alpha(opacity=${this.itemTitleOpacity})`,
        MozOpacity: this.itemTitleOpacity,
        KhtmlOpacity: this.itemTitleOpacity,
      };
    },
    childTitleOpacityStyle() {
      return {
        opacity: this.childTitleOpacity,
        filter: `alpha(opacity=${this.childTitleOpacity})`,
        MozOpacity: this.childTitleOpacity,
        KhtmlOpacity: this.childTitleOpacity,
      };
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.accordion-content-schema{
  .accordion-content{
    padding-left: 0px !important;
  }
}
.accordion-content{
  font-size: 17px;
  line-height: 25px;
}

.h3-double-accordion .rotated{
  transform: rotate(90deg) !important;
  -webkit-transform: rotate(90deg)!important;
}
.h3-double-accordion{
  padding-left: 15px;
  .form-simple{
    padding-right: 15px;    
    &-title{
      display: flex;
      position: relative;
      flex-direction: row;
      height: 45px;
      line-height: 45px;
      background-color: #FFFFFF;
      .hairline('bottom',#eeeeee);
      span{
        display: inline-block;
        text-align: center;
        flex: 1;
        line-height: 45px;
        color: #999999;
      }
    }
    &-details{
      display: flex;
      position: relative;
      min-height: 45px;
      .hairline('bottom',#eeeeee);
      span{
        display: inline-block;
        text-align: center;    
        align-self: center;            
        flex: 1;
        color: #333333;
        word-wrap: break-word;
        width: 110px;
      }
    }

  }
  .form-title{
    color: #333333;
    font-size: 17px;
  }
  .form-template{
    color: #1890ff;
    font-size: 17px;
    float: right;
  }
  .form-details{
    margin-left: 4px;
    display: flex;
    min-height: 45px;
    line-height: 45px;
  }
  .form-details-index{
    color: #333333;
    font-size: 17px;
    max-width: 10px;
    margin-right: 12px;
  }
  .form-details-title{
    display: inline-block;
    width: 102px;
    color: #999999;
    font-size: 17px;
    margin-right: 24px;
  }
  .form-details-parmers-title{
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333333;
    font-size: 17px;
  }
  .form-details-parmers{
    display: inline-block;
    max-width: 150px;
    color: #333333;
    font-size: 17px;
    word-wrap: break-word;
    line-height: normal;
    align-self: center;
  }
  .h3-accordion{
    padding-left: 0;
  }
}

.h3-accordion{
  .item{
    position: relative;
    .hairline('bottom', #eee);
  }
}


.stay-top{
  position: -webkit-sticky !important;
  position: sticky !important;
  top: -1px;
  left: 0;
  z-index: 999;
  // pointer-events: none !important;
}
.stay-top-second{
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 45px;
  left: 0;
  z-index: 998;
  // pointer-events: none !important;
}
.staticHeader{
  position: fixed;
  // z-index: 99999;
  width: 100%;
}
.mescroll{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.staticFlowTab{
  height: 45px;
  font-size: 17px;
  line-height: 45px;
  background: #FFF;
  display: flex;
  position: relative;
  align-items: center;
  padding-right: 15px;
  .hairline('bottom', #eee);
  .icon{
    font-size: 12px;
    line-height: normal;
    margin-right: 8px;
  }
  .rotated{
    transform: rotate(90deg) !important;
    -webkit-transform: rotate(90deg) !important;
  }
  .list-accordion-title-wrapper{
    width: 100%;
  }
}
.static-item-child-title{
  height: 45px;
  font-size: 17px;
  line-height: 45px;
  background: #FFFFFF;
  padding-right: 15px;
  padding-left: 15px;
  .icon{
    font-size: 12px;
    line-break: inherit;
  }
  .rotated{
    transform: rotate(90deg) !important;
    -webkit-transform: rotate(90deg) !important;
  }
  .list-accordion-title-wrapper{
    display: flex;
    flex: 1;
    padding-left: 8px;
    span{
      text-align: initial;
      flex: initial;
      color: #333333;
    }
    .form-details-title{
      color: #999999;
    }
  }
}
.disable{
  pointer-events: none;
}
</style>


