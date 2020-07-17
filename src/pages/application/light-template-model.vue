<template>
  <div class="light-template-model">
    <h3-popup
      v-model="visible"
      class="light-template-model-model"
      :class="{'light-template-model-top': !isDingtalk}"
      maskClosable
      :autoUp="false"
      popupDirection="right"
      popupWidth="78.4%"
      @toggle="toggle"
    >
      <div class="contianer">
        <div class="order-header">
          <div class="text">
            全部分类
          </div>
          <div class="content-scroll">
            <div
              v-for="(item,index) in toolbarList"
              ref="sortList"
              :key="item.Code + index"
              class="order-list"
              @click="selectItem(index)"
            >
              <div class="order-item">
                <div class="title">
                  {{ item.CategoryName || '--' }}
                </div>
                <!-- <h3-radio :control="true" :checked="item.checked" @change="select(item)">
                  <div class="title">
                    {{ item.DisplayName || '--' }}
                  </div>
                </h3-radio> -->
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="order-footer">
          <h3-button size="small" @click="cancelSort">
            取消
          </h3-button>
          <h3-button type="primary" size="small" @click="saveSort">
            完成
          </h3-button>
        </div> -->
      </div>
    </h3-popup>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { H3Popup, H3Button, H3Radio } from '@h3/thinking-ui';
import { H3Scroll } from 'h3-mobile-vue';
import { isDingtalk, isiOS } from '@/config/common';
import cloneDeep from 'lodash/cloneDeep';

// vuex-class module命名空间
const appModule = namespace('App');

interface ToolbarList {
  CategoryName:string;
  CategoryType: number;
  Code:string;
  TemplateList:any;
}

@Component({
  name: 'light-template-model',
  components: {
    H3Scroll,
    H3Button,
    H3Popup,
    H3Radio,
  },
})

export default class GroupFieldSearch extends Vue {
  @Prop({
    default: () => [],
  })toolbarList!: ToolbarList[];

  visible = false;

  showModel = false;

  get isDingtalk () {
    return isDingtalk;
  }

  @Watch('showModel')
  sortModelChange (val) {
    if (val) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  created () {
    this.showModel = true;
  }

  selectItem (index) {
    this.$emit('select', index);
  }

  /**
   * 取消排序
  */
  cancelSort () {
    this.$emit('closeModel');
  }

  /**
   * 保存排序
  */
  async saveSort () {
    this.$emit('closeModel');
  }

  toggle (val) {
    if (!val) {
      this.$emit('closeModel');
    }
  }
}

</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.light-template-model-top {
  top: 1.30666667rem !important;
}
.light-template-model-model {
  // top: 1.30666667rem !important;
  /deep/ .h3think-popup__wrap{
    .px2rem(border-top-left-radius, 24);
    .px2rem(border-bottom-left-radius, 24);
    overflow: hidden;
  }
  .contianer{
    height: 100%;
  }
  .order-header {
    //  height:calc(100% - 110/ @baseFontSize * 1rem);
    height:100%;
    .text{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .px2rem(height, 86);
      .px2rem(line-height, 86);
      .px2rem(padding-left, 30);
      .px2rem(padding-right, 30);
      .px2rem(font-size, 24);
      color:#999;
      background: #fff;
      box-sizing: border-box;
      .px2rem(border-bottom-width, 1);
      border-bottom-style: solid;
      border-bottom-color: #EBEDF2;
    }
  }
  .order-header-list{
    // height:calc(100% - 86/ @baseFontSize * 1rem);
  }
  .content-scroll{
    height:calc(100% - 86/ @baseFontSize * 1rem);
    .px2rem(padding-bottom,26);
    overflow-x: hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
    background:#fff;
    .h3think-radio{
      width:calc(100% - 60/ @baseFontSize * 1rem);
    }
    .title{
      .px2rem(font-size, 30);
      color:#333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .drag-icon {
       margin-left: auto;
      .px2rem(width, 50);
      text-align: center;
      cursor: grabbing;
      i {
        color: #999;
        .px2rem(font-size,30);
      }
    }
    .mode{
      color:#999;
      .px2rem(font-size, 26)
    }
  }

  .order-list{
    width:100%;
    background: #fff;
    opacity: 1;
  }

  .order-item{
    box-sizing: border-box;
    width: calc(100% - 30/ @baseFontSize * 1rem);
    .px2rem(height, 86);
    .px2rem(line-height, 86);
    .px2rem(margin-left, 30);
    .px2rem(padding-right, 30);

    display: flex;
    flex-flow:row nowrap;
    justify-content:flex-start;
    align-items: center;
    .px2rem(border-bottom-width, 1);
    border-bottom-style: solid;
    border-bottom-color: #EBEDF2;
  }
  .order-footer {
    .px2rem(padding-left,30);
    .px2rem(padding-right,30);
    .px2rem(height, 110);
    .px2rem(line-height, 110);
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    button{
      .px2rem(border-radius, 30);
      .px2rem(font-size, 24);
      &:first-child{
        .px2rem(margin-right, 8);
        .px2rem(border-width, 1);
        border-style: solid;
        border-color: #999;
        font-weight: 500;
      }
      &:last-child{
        .px2rem(margin-left, 8);
        font-weight: 500;
      }
    }
  }
  .content-scroll{
    position: relative;
    background: #fff;
    max-height : calc(100% - 86/ @baseFontSize * 1rem);
    overflow-x: hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
  }

  .content-bottom{
    .px2rem(margin-bottom, 20);
    // background: #F5F7F9;
  }

  .sort-list-ghost {
    opacity: 1;
    width: 100%;
    .px2rem(height,86);
    // background: #F0F7FF;
    background: #F7F7F7;
    .h3think-radio, .drag-icon {
      visibility: hidden;
    }
  }
  .sort-list-drag{
    box-shadow:0px 1px 4px 0px rgba(56,56,56,0.5);
  }
}
</style>
