<template>
  <div>
    <div class="fixedTip" v-show="showTopTip">
      【控件名称】等5个必填内容未填写
    </div>
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
          v-for="(item,itemIndex) in data" :key="itemIndex" :multi="true" 
          :item-title-cls= "getTtemChildTitleCls(item, 'stay-top')"
          :item-title-wrapper-cls = "item.mistake && !isIos ? 'item-title-wrapper-mistake': ''"
          :class="[`outter-title-${itemIndex}`]">
          <template slot="title">
            <span class="form-title"><span style="color: #F5222D">*</span>{{ `${item.title}(${item.details.length})`}}</span>
            <span class="form-template" v-if="false" @click.stop="onChangeSchema(item)">
              {{item.formSchema === 0 ? '切换到矩阵模式' : '切换到平铺模式'}}
            </span>
          </template>
          
          <!-- <div v-if="false" class="form-simple">
            <div class="form-simple-title itemChildTitleStatic">
              <span v-for="title in summartSchema">{{title}}</span>
            </div>
            <div class="form-simple-details" v-for="content in item.details">
              <span v-for="title in summartSchema">{{content[title]}}</span>
            </div>
          </div> -->

          <h3-accordion-item-child position="left" iconClass="icon-base-right"
            v-for="(detail,index) in item.details" :key="index" 
            :item-child-title-cls= "getTtemChildTitleCls(detail, 'stay-top-second')"
            :accordion-content-cls="detail.mistake? 'accordion-content-mistake':'' ">
            <div slot="title" style="display: flex">
              <span class="form-details-index">{{ index +1 }}</span>
              <span class="form-details-title">{{Object.keys(detail)[0]}}</span>
              <span class="form-details-parmers-title">{{Object.values(detail)[0]}}</span>
            </div>
            <div class="form-details" v-for="(val,key,detailIndex) in detail" v-if="detailIndex >0">
              <span class="form-details-index" style="color: rgba(0,0,0,0)">{{index + 1}}</span>
              <span class="form-details-title">{{key}}</span>
              <div class="form-details-parmers">{{val}}</div>
            </div>
            <div class="form-tools">
              <div @click="copyForm(item,itemIndex,index)"><span class="aufont icon-base-copy"></span>复制</div>
              <div @click="delectForm(item,itemIndex,index)"><span class="aufont icon-base-delete"></span>删除</div>
              <div @click="editForm(item,itemIndex,index)"><span class="aufont icon-base-edit"></span>编辑</div>
            </div>
          </h3-accordion-item-child>
          <div class="add-new-child-form" @click="onClickAddForm(item)">
            <span class="aufont icon-base-plus"></span>
            <span>添加产品明细</span>
          </div>
        </h3-accordion-item>
      </h3-accordion>
    </h3-scroll>
    <div class="form-footer-btn">
      <h3-button-group :button-group="buttonGroup" borderType="center-border" ></h3-button-group>
    </div>
  </div>
</template>
<script>
import { H3Accordion, H3AccordionItem, H3AccordionItemChild } from '../../components/h3-accordion';
import H3Scroll from '../../components/h3-scroll/mescroll';
import { hasClass, addClass, removeClass } from '../../utils/class';
import H3ButtonGroup from '../../widgets/h3-button/h3-button-group2';

export default {
  components: {
    H3Accordion,
    H3AccordionItem,
    H3AccordionItemChild,
    H3Scroll,
    H3ButtonGroup,
  },
  data() {
    return {
      data: [
        {
          title: '子表明细',
          mistake: true,
          formSchema: 1,
          details: [
            {
              产品名称: 'CRM1',
              产品名称2: 'CRM2',
              产品名称3: 'CRM3',
              产品名称4: 'CRM4',
              产品名称5: 'CRM5',
              mistake: true,
            },
            {
              产品名称: 'CRM2',
              产品名称2: 'CRM2-2',
              产品名称3: 'CRM2-3',
              产品名称4: 'CRM2-4',
              产品名称5: 'CRM2-5',
              mistake: false,
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM3-2',
              产品名称3: 'CRM3-3',
              产品名称4: 'CRM3-4',
              产品名称5: 'CRM3-5',
              mistake: true,
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
          title: '子表明细',
          formSchema: 0,
          mistake: false,
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
          title: '子表明细',
          formSchema: 0,
          mistake: true,
          details: [
            {
              产品名称: 'CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1CRM1',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM测试换行最大宽度且有英文WJSDJAKJSK有符号，，和换行',
              产品名称5: 'CRM',
              mistake: true,
            },
            {
              产品名称: 'CRM2',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
              mistake: false,
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
              mistake: true,
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
              mistake: true,
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
              mistake: false,
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
              mistake: false,
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
              mistake: true,
            },
            {
              产品名称: 'CRM3',
              产品名称2: 'CRM',
              产品名称3: 'CRM',
              产品名称4: 'CRM',
              产品名称5: 'CRM',
              mistake: false,
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
      buttonGroup: [
        {
          title: '提交',
          type: 'share',
          size: 'lg',
          onClick: this.submitForm,
        },
        
      ],
      showTopTip: false,
    };
  },
  mounted() {
    // this.initScroll();
  },
  methods: {
    submitForm() {
      const hasNullContent = this.data.some(item => item.details.length < 1);
      console.log(hasNullContent);
      if (hasNullContent) {
        this.showTopTip = true;
        setTimeout(() => {
          this.showTopTip = false;
        }, 3000);
      }
    },
    copyForm(item, itemIndex, index) {
      // 复制该子表明细
      const copyItem = this.data[itemIndex].details[index];
      this.data[itemIndex].details.splice(index, 0, copyItem);
    },
    delectForm(item, itemIndex, index) {
      // 删除该子表明细
      this.data[itemIndex].details.splice(index, 1);
    },
    editForm(item, itemIndex, index) {
      this.$router.push({
        name: 'childrenFormtab',
        params: {
          apps: item,
          itemIndexs: itemIndex,
          indexs: index,
        },
      });
    },
    onClickAddForm(item) {
      this.$router.push({
        name: 'childrenFormtab',
        params: {
          apps: item,
        },
      });
    },
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
      const secondStickyDom = this.$refs.secondSticky; // 第二个吸顶的dom元素
      for (let i = 0; i < outerTopDistance.length - 1; i += 1) {
        if (y >= outerTopDistance[i] && y < outerTopDistance[i + 1] + firstDomHeight) {
          const innerDoms = document.querySelectorAll(`.outter-title-${i} .itemChildTitleStatic`); // 内层需要吸顶元素(数据标题)
          this.staticItemTitle = staticOuterDoms[i].children[0].innerHTML;
          let innerTopDistance = [];
          innerTopDistance = this.getTopDistanceArr(innerDoms); // 获取内层dom的top距离
          const diff = y - outerTopDistance[i];
          if (i === 0) {
            const isFirstInnerMistake = hasClass(innerDoms[0], 'item-title-mistake');
            if (isFirstInnerMistake) {
              addClass(secondStickyDom, 'item-title-mistake'); // andriod第二个吸顶元素添加错误校验类名
            }
            if (diff > 0 && diff < firstDomHeight * 2) {
              this.itemTitleOpacity = 0;
              this.zIndexStaticHeader = -1;
              this.childTitleOpacity = 0;
            }
            if (diff >= firstDomHeight * 2) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[0].innerHTML;
            }
          } else if (diff > firstDomHeight) {
            this.itemTitleOpacity = 1;
            this.zIndexStaticHeader = 9999;
            this.childTitleOpacity = 1;
            if (diff >= innerTopDistance[0] + firstDomHeight
              && diff < innerTopDistance[1] + firstDomHeight) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[0].innerHTML;
            }
          }
          for (let k = 1; k < innerTopDistance.length - 1; k += 1) {
            if (diff >= innerTopDistance[k] && diff < firstDomHeight + innerTopDistance[k + 1]) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[k].innerHTML;
              const isSecondStickyMistake = hasClass(secondStickyDom, 'item-title-mistake');
              if (isSecondStickyMistake) {
                removeClass(secondStickyDom, 'item-title-mistake'); // 之前如果加了错误验证的类名,先去除
              }
              const isInnerMistake = hasClass(innerDoms[k], 'item-title-mistake');
              if (isInnerMistake) {
                addClass(secondStickyDom, 'item-title-mistake'); // andriod第二个吸顶元素添加错误校验类名
              }
            }
          }
          const lastInnerIndex = innerTopDistance.length - 1;
          if (lastInnerIndex > 0) {
            if (diff > innerTopDistance[lastInnerIndex]) {
              this.zIndexStaticHeader = 9999;
              this.itemTitleOpacity = 1;
              this.childTitleOpacity = 1;
              this.staticItemChildTitle = innerDoms[lastInnerIndex].innerHTML;
              const isSecondStickyMistake = hasClass(secondStickyDom, 'item-title-mistake');
              if (isSecondStickyMistake) {
                removeClass(secondStickyDom, 'item-title-mistake'); // 之前如果加了错误验证的类名,先去除
              }
              const isLastInnerMistake = hasClass(innerDoms[lastInnerIndex], 'item-title-mistake');
              if (isLastInnerMistake) {
                addClass(secondStickyDom, 'item-title-mistake'); // andriod第二个吸顶元素添加错误校验类名
              }
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
          const isSecondStickyMistake = hasClass(secondStickyDom, 'item-title-mistake');
          if (isSecondStickyMistake) {
            removeClass(secondStickyDom, 'item-title-mistake'); // 之前如果加了错误验证的类名,先去除
          }
          const isInnerMistake = hasClass(lastInnerDoms[0], 'item-title-mistake');
          if (isInnerMistake) {
            addClass(secondStickyDom, 'item-title-mistake'); // andriod第二个吸顶元素添加错误校验类名
          }
        }
        for (let j = 1; j < lastInnerTopDistance.length - 1; j += 1) {
          if (lastDiff > lastInnerTopDistance[j]
          && lastDiff < firstDomHeight + lastInnerTopDistance[j + 1]) {
            this.zIndexStaticHeader = 9999;
            this.itemTitleOpacity = 1;
            this.childTitleOpacity = 1;
            this.staticItemChildTitle = lastInnerDoms[j].innerHTML;
            const isSecondStickyMistake = hasClass(secondStickyDom, 'item-title-mistake');
            if (isSecondStickyMistake) {
              removeClass(secondStickyDom, 'item-title-mistake'); // 之前如果加了错误验证的类名,先去除
            }
            const isInnerMistake = hasClass(lastInnerDoms[j], 'item-title-mistake');
            if (isInnerMistake) {
              addClass(secondStickyDom, 'item-title-mistake'); // andriod第二个吸顶元素添加错误校验类名
            }
          }
        }
        const lastInnerIndex = lastInnerTopDistance.length - 1;
        if (lastInnerIndex > 0) {
          if (lastDiff > lastInnerTopDistance[lastInnerIndex]) {
            this.zIndexStaticHeader = 9999;
            this.itemTitleOpacity = 1;
            this.childTitleOpacity = 1;
            this.staticItemChildTitle = lastInnerDoms[lastInnerIndex].innerHTML;
            const isSecondStickyMistake = hasClass(secondStickyDom, 'item-title-mistake');
            if (isSecondStickyMistake) {
              removeClass(secondStickyDom, 'item-title-mistake'); // 之前如果加了错误验证的类名,先去除
            }
            const isInnerMistake = hasClass(lastInnerDoms[lastInnerIndex], 'item-title-mistake');
            if (isInnerMistake) {
              addClass(secondStickyDom, 'item-title-mistake'); // andriod第二个吸顶元素添加错误校验类名
            }
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
      } else {
        item.formSchema = 0;
      }
    },
    getTtemChildTitleCls(item, cls) {
      if (this.isIos && item.mistake) {
        return `item-title-mistake ${cls}`;
      }
      if (this.isIos && !item.mistake) {
        return cls;
      }
      if (!this.isIos && item.mistake) {
        return 'item-title-mistake';
      }
      return '';
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
.fixedTip{
  position: absolute;
  width: 100%;
  z-index: 99;
  .px2rem(height, 72);
  .px2rem(top, 0);
  .px2rem(left, 0);
  background: #F5222D;
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  .px2rem(font-size, 28);
  .px2rem(line-height ,72);
  color:#fff;
}
.form-footer-btn{
  position: absolute;
  z-index: 99;
  right: 0px;
  bottom: 0px;
  .px2rem(height,88);
  width: 100%;
  }
//安卓外层吸顶(错误提示样式)依靠里面元素的阴影
.item-title-wrapper-mistake{
  background-color: #fff5f5 !important;
  box-shadow: -30px 0 0 45px #fff5f5 !important;
}
.item-title-mistake{
  box-shadow: -30px 0 0 0 #fff5f5 !important;
  background-color: #fff5f5 !important;
}
.add-new-child-form{
  height: 45px;
  width: 100%;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  span{
    font-size: 17px;
    color: #1890ff;
  }
  span:first-child{
    display: inline-block;
    width: 22px;
    height: 22px;
  }
}
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
  .form-tools{
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
    .px2rem(height, 90);
    div{
      color: #1890ff;
      line-height: 24px;
      font-size: 17px;
      span{
        color: #1890ff;
        font-size: 17px;
        height: 22px;
        width: 22px;
      }
    }


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
  background: #FFFFFF;
  display: flex;
  position: relative;
  align-items: center;
  padding-right: 15px;
  box-shadow: -15px 0 0 0 #fff;
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
  box-shadow: -15px 0 0 0 #fff;
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


