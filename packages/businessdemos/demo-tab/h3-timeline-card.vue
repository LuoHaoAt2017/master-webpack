<template>
  <div class="h3-timeline-card-wrapper">
      <li class="timeline-item" @click="openListitem(item)">
        <div class="timeline-item-content">
          <div class="item-wrapper">
            <div class="sheet-home-test-circle"></div>
            <div class="item-product" >
              <h3-card-form @click.native="clickCardForm(item)">
                <div> 
                  <div style="display: flex"> 
                    <div :class="maintitleCls(item)" v-html="item.title">
                    </div>
                    <h3-status-tip style="{margin-top: 0.04rem;}"  :type="item.status" v-if="item.status"></h3-status-tip>
                  </div>
                  <div class="main-summary" 
                      v-for="(summary,index) in item.summary" :key="index" 
                      v-if="item.summary && index < 5">
                    {{summary}}
                  </div>
                </div>
              </h3-card-form>
              <div class="sheet-home-test-time">{{item.time}}</div>
            </div>
          </div>
        </div>
      </li>
  </div>
</template>
<script>
import cx from 'classnames';
import H3CardForm from '../../widgets/h3-card-data-list/index';
import H3statusTip from '../../widgets/h3-tool-tip/h3-status-tip';

export default {
  name: 'h3-timeline-card',
  components: {
    H3CardForm,
    H3statusTip,
  },
  props: {
    item: {
      type: {},
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  methods: {
    getFormatDateStr(dateStr) {
      return new Date(dateStr.replace(/-/g, '/')).Format('hh:mm');
    },
    maintitleCls(item) {
      return cx('main-title', {
        'has-aside': item.status === undefined || item.status === '',
        'has-aside-status': item.status && item.status !== '',
        'without-summary': item.summary === undefined || item.summary.length < 1,
      });
    },
    clickCardForm(item) {
      // 点击进入表单
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
.bottom-line(){
  .hairline('bottom', #e4e4e4);
}

.h3-timeline-card-wrapper{
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

</style>



