<template>
  <div class="group-field-search">
    <h3-modal
      v-model="visible"
      class="group-field-search-model"
      :class="{'group-field-search-top': !isDingtalk}"
      maskClosable
      type="popup"
      popupDirection="right"
      popupScale="78.4"
      @on-hide="toggle"
    >
      <div v-if="visible" class="search">
        <div class="search-header">
          <div class="info-name">
            分组{{ `${fieldItem ? '·' + fieldItem.DisplayName : ''}` }}
          </div>
          <i ref="search-btn" class="icon h3yun_All search-o " @click="showSearch"></i>
          <!-- <i v-show="isAdministrator" class="icon h3yun_All edit-o first" @click="showEditor"></i> -->
        </div>
        <div class="seach-content" :class="{'show-date': fieldItem && fieldItem.Type === formControlType.FormDateTime && !searchKey}">
          <div v-if="fieldItem && fieldItem.Type === formControlType.FormDateTime && !searchKey " class="deta-select" :class="{'no-show-day': !isShowDay}">
            <div
              v-if="isShowDay"
              :class="{'active': board.groupConfig && board.groupConfig.DateTimeFormat === format.Day}"
              @click="selectDateFormat(format.Day)"
            >
              日
            </div>
            <div :class="{'active': board.groupConfig && board.groupConfig.DateTimeFormat === format.Month}" @click="selectDateFormat(format.Month)">
              月
            </div>
            <div :class="{'active': board.groupConfig && board.groupConfig.DateTimeFormat === format.Year}" @click="selectDateFormat(format.Year)">
              年
            </div>
          </div>
          <!-- ,'page-index':pageIndex===0 -->
          <div class="seach-content-scroll">
            <h3-scroll
              ref="scroll"
              class="scroll-wrapper"
              :class="{'scroll-nodata': lists.length === 0}"
              :loadMore="loadMore"
              :refresh="refresh"
              :pageSize="limit"
            >
              <div class="content-wrapper">
                <template v-if="skeletonLoading">
                  <div
                    v-for="(skeleton, index) in skeletons"
                    :key="index"
                    class="skeleton-loading"
                  >
                    <skeleton class="middle" />
                  </div>
                </template>
                <template v-if="!skeletonLoading">
                  <div
                    v-for="(item,index) in lists"
                    ref="listItem"
                    :key="item.value + index"
                    class="search-item"
                  >
                    <h3-radio :control="true" :checked="item.active" @change="select(item)">
                      <div class="title">
                        {{ item.name || '--' }}
                      </div>
                    </h3-radio>
                  </div>
                </template>
              </div>
            </h3-scroll>
          </div>
        </div>
      </div>
    </h3-modal>
    <div
      v-if="searchShow"
      ref="searchPage"
      class="group-field-search-page"
      :class="{'group-field-search-top': !isDingtalk}"
    >
      <h3-search-bar
        ref="searchBar"
        class="searching"
        placeholder="搜索"
        :onBlur="onBlur"
        :onClear="onClear"
        :value="searchKey"
        :onChange="onChange"
        :onCancel="onCancel"
      />
      <div v-if="isSearch && searchKey" class="searchTotal">
        搜索结果：共{{ searchTotal }}条
      </div>
      <div v-if="isSearch && searchKey" class="seach-content-scroll">
        <h3-scroll
          v-if="searchTotal > 0"
          ref="searchScroll"
          class="scroll-wrapper"
          :class="{'scroll-nodata': lists.length === 0}"
          :loadMore="searchloadMore"
          :refresh="searchRefresh"
          :pageSize="limit"
        >
          <div class="content-wrapper">
            <div
              v-for="(item,index) in searchLists"
              ref="list"
              :key="item.value + index"
              class="search-item"
            >
              <h3-radio :control="true" :checked="item.active" @change="select(item,'search')">
                <div class="title" v-html="item.name || '--'">
                </div>
              </h3-radio>
            </div>
          </div>
        </h3-scroll>
        <div v-else>
          <div class="rows-container">
            <i class="icon-empty empty-search"></i>
            <span class="empty-text">没有搜索结果</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { namespace, State } from 'vuex-class';
import { GroupColumnItem } from '../../typings';
import {
  H3Input, H3Scroll, H3SearchBar, H3Modal,
} from 'h3-mobile-vue';

import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import { FormControlType, BoardGroupDateFormat } from '../../typings/const';
import { H3Popup, H3Button, H3Radio } from '@h3/thinking-ui';
import skeleton from '@/components/common/skeleton-loading.vue';
import { isDingtalk, isiOS } from '@/config/common';
import { Board } from '../../typings/board';

const LightBoardModule = namespace('LightBoard');
const YearMonth = 'yyyy-mm'; // 日期控件 年月

@Component({
  name: 'group-field-search',
  components: {
    AInput: H3Input,
    H3Scroll,
    H3Button,
    H3Popup,
    H3Radio,
    H3SearchBar,
    skeleton,
    H3Modal,
  },
})

export default class GroupFieldSearch extends Vue {
  @LightBoardModule.State('board') board!: Board;

  @State('UserInfo') userInfo ;

  @Prop({
    type: Boolean,
    default: false,
  })showModel!:boolean;

  @Prop({
    type: Array,
    default: [],
  })
  options!: GroupColumnItem[];

  @Prop({
    type: Array,
    default: [],
  })
  searchOptions!: GroupColumnItem[];

  @Prop({
    default: '搜索',
  }) searchPlaceHolder!: string;

  @Prop({
    type: Number,
    default: 0,
  }) pageIndex!: number;

  @Prop({
    type: Number,
    default: 0,
  }) total!: number; // 总的条数

  @Prop({
    type: Number,
    default: 0,
  }) searchTotal!: number; // 搜索模式的条数

  @Prop({
    type: Object,
  }) fieldItem!: Object; // 选中的字段项

  format = BoardGroupDateFormat;// 分别对应选择 日 月 年

  searchKey = ''; // 搜索关键字

  searchShow = false; // 是否显示搜索

  isSearch = false;

  isRefresh= false; // 是否下拉

  isSearchRefresh= false; // 是否下拉

  formControlType = FormControlType;

  // 年月日是否显示 日，当选择了 年月字段，则没有 日供选择
  isShowDay = true;

  isScrollLoad = false;

  visible = false;

  popupShowFilter = true;

  limit= 50;

  skeletonLoading = false;

  skeletons: number = 5; // 骨架图显示数量

  get isDingtalk () {
    return isDingtalk;
  }

  /**
   * 是否管理员(注：取管理员方式要更改)
  */
  // get isAdministrator () {
  //   return this.userInfo.isAdministrator || this.userInfo.isSubAdministrator;
  // }

  @Watch('showModel')
  showModelChange (val) {
    if (val) {
      this.visible = true;
      this.$nextTick(() => {
        this.focusListen();
      });
    } else {
      this.visible = false;
    }
  }

  @Watch('fieldItem')
  fieldItemChange (newItem) {
    if (newItem && newItem.Type === this.formControlType.FormDateTime) {
      if (newItem.Options.DateTimeMode === YearMonth) {
        this.isShowDay = false;
      } else {
        this.isShowDay = true;
      }
    }
  }

  mounted () {
    this.fieldItemChange(this.fieldItem);
    this.loadMore = throttle(this.loadMore, 100);
    this.searchloadMore = throttle(this.searchloadMore, 100);
    this.realSearch = debounce(this.realSearch, 300);
  }

  focusListen () { // 聚焦
    (this.$refs['search-btn'] as any).addEventListener('click', () => {
      this.searchShow = true;
      this.$nextTick(() => {
        // IOS兼容判断
        if (isiOS) {
          (this.$refs.searchBar as any).focus();
        } else {
          setTimeout(() => {
            (this.$refs.searchBar as any).focus();
          }, 0);
        }
      });
    });
  }

  /**
   * 上拉加载更多
  */
  async loadMore (page, done) {
    if (page.num !== 1 || this.isRefresh) {
      await this.$emit('updateData', page.num);
    }
    done(this.limit, this.total);
  }

  /**
   * 列表刷新
   */
  doRefresh () {
    const scroll: any = this.$refs.scroll;
    if (scroll && scroll.mescroll) {
      scroll.mescroll.resetUpScroll();
    }
    this.skeletonLoading = false;
  }

  refresh (page, done) {
    this.isRefresh = true;
    this.doRefresh();
    setTimeout(() => {
      this.isRefresh = false;
    }, 1000);
    console.log('refresh');
  }

  select (item, model) {
    this.$emit('select', item, model);
    if (model) {
      this.searchShow = false;
    }
  }

  /**
   *滚动重置顶部
  */
  groupScrollReset () {
    if (this.$refs.scroll && (this.$refs.scroll as any).mescroll) {
      (this.$refs.scroll as any).mescroll.scrollTo(0, 10);
    }
  }

  /**
   * 滚动到选中数据
  */
  scrollToTarget () {
    const panel = this.$refs.scroll as any;
    let panelChild = this.$refs.listItem as any;
    const index = this.options.findIndex(it => it.value === this.board.groupConfig.DefaultValue);
    if (index > -1) {
      panelChild = (panelChild as any)[index];
      this.$nextTick(() => {
        const height = index * ((panelChild as any).scrollHeight);
        if (panel && panel.mescroll) {
          (this.$refs.scroll as any).mescroll.scrollTo(height, 0);
        }
      });
    }
  }

  /**
   * 数据源
   */
  get lists () {
    // this.filterOptions = this.options;
    for (const option of this.options) {
      if (option.value === this.board.groupConfig.DefaultValue) { // 没有选中就默认选中所有记录
        this.$set(option, 'active', true);
      } else {
        this.$set(option, 'active', false);
      }
    }
    return this.options;
  }

  /**
   * 筛选结果项
  //  */
  get searchLists () {
    const res : any[] = [];
    for (const item of this.searchOptions) {
      if (item.value === this.board.groupConfig.DefaultValue) { // 没有选中就默认选中所有记录
        this.$set(item, 'active', true);
      } else {
        this.$set(item, 'active', false);
      }
      item.name = item.name.replace(this.searchKey, () => {
        return `<i class="group-search-color">${this.searchKey}</i>`;
      });
      res.push(item);
    }
    return res;
  }

  showEditor () {
    this.$emit('showEditor');
  }

  showSearch () {
    this.searchShow = true;
    this.$nextTick(() => {
      const dom = this.$refs.searchPage as any;
      if (dom) {
        document.body.appendChild(dom);
      }
    });
  }

  /**
   * 日期格式选择
  */
  selectDateFormat (val) {
    this.$emit('formatChange', val);
    this.skeletonLoading = true;
  }

  /**
   * 切换数据
  */
  toggle (val) {
    if (!val) {
      this.$emit('closeModel');
    }
  }

  // 搜索模式下的

  async searchloadMore (page, done) {
    if (page.num !== 1 || this.isSearchRefresh) {
      await this.$emit('updateData', page.num, this.searchKey);
    }
    done(this.limit, this.searchTotal);
  }

  searchRefresh () {
    this.isSearchRefresh = true;
    this.searchDoRefresh();
    setTimeout(() => {
      this.isSearchRefresh = false;
    }, 1000);
  }

  searchDoRefresh () {
    const scroll: any = this.$refs.searchScroll;
    if (scroll && scroll.mescroll) {
      scroll.mescroll.resetUpScroll();
    }
  }

  onBlur () {
    if (!this.searchKey) {
      this.searchShow = false;
      this.scrollToTarget();
    }
  }

  onClear () {
    this.isSearch = false;
  }

  onChange (val) {
    this.searchKey = val.trim();
    if (val) {
      this.realSearch();
    } else {
      this.isSearch = false;
      this.searchDoRefresh();
    }
  }

  async realSearch () {
    this.isSearch = true;
    // this.searchDoRefresh();
    await this.$emit('search', this.searchKey);
  }

  onCancel () {
    this.searchShow = false;
    this.isSearch = false;
    this.scrollToTarget();
  }

  beforeDestroy () {
    const dom = this.$refs.searchPage as any;
    if (dom) {
      document.body.removeChild(dom);
    }
  }
}

</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.group-field-search-top {
  top: 1.30666667rem !important;
}
.group-field-search-model {
  // top: 1.30666667rem !important;
  /deep/ .h3think-popup-wrap{
    .px2rem(border-top-left-radius, 24);
    .px2rem(border-bottom-left-radius, 24);
    overflow: hidden;
  }
  .search{
    height:100%;
    .search-header{
      .px2rem(height,86);
      .px2rem(line-height, 86);
      .px2rem(padding-left,30);
      .px2rem(padding-right,30);
      display:flex;
      flex-flow:row nowrap;
      justify-content:flex-end;
      box-sizing: border-box;
      .px2rem(border-bottom-width, 1);
      border-bottom-style: solid;
      border-bottom-color: #EBEDF2;
      .info-name{
        margin-right:auto;
        text-align: left;
        color:#999;
        .px2rem(font-size, 24);
        width: calc(100% - 180 / @baseFontSize * 1rem) ;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i{
        color:#999;
        .px2rem(font-size,35);
        &:first-child{
         .px2rem(margin-right, 50);
        }
      }
      .first{
        .px2rem( margin-left,50);
      }
    }
    .seach-content{
      height: calc(100% - 86 / @baseFontSize * 1rem) ;
      &::before{
        display: table;
        content: '';
      }
      .deta-select{
        display: flex;
        justify-content: space-between;
        flex-flow:row nowrap;
        .px2rem(margin-left,30);
        .px2rem(margin-right,30);
        // align-items: center;
        box-sizing: border-box;
        // width:100%;
        .px2rem(height, 62);
        .px2rem(margin-top, 24);
        .px2rem(margin-bottom, 24);
        &:after{
          display: block;
          content: '';
        }
        >div{
          flex: 1;
          height: 100%;
          .px2rem(height, 60);
          .px2rem(line-height, 60);
          box-sizing: border-box;
          .px2rem(font-size, 26);
          color:#999;
          background: #fff;
          text-align: center;
          .px2rem(border-width, 1.2);
          border-style: solid;
          border-color: #999;

         &.active {
           color:#fff;
           background: #107FFF;
           border-color: #107FFF;
         }
          &:first-child{
            .px2rem(border-top-left-radius, 31);
            .px2rem(border-bottom-left-radius, 31);
          }
          &:last-child{
            .px2rem(border-top-right-radius, 31);
            .px2rem(border-bottom-right-radius, 31);
          }
          &:nth-child(2):not(:last-child){
            .px2rem(border-left-width, 0);
            .px2rem(border-right-width, 0);
            border-left: none;
            border-right:none;
          }
        }
      }
      &-scroll{
        height: 100%;
        // height: calc(100% - 110 / @baseFontSize * 1rem);
        // overflow-y: auto;
        // -webkit-overflow-scrolling: touch;
        .scroll-wrapper {
          position: relative;
          top: 0;
          width: 100%;
          height:100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          &.scroll-nodata,
          &.page-index {
            /deep/.mescroll-hardware{
              display: none !important;
            }
          }
          .content-wrapper {
            width: 100%;
            z-index: 499;
            // overflow-y: auto;
            // overflow-x: hidden;
          }
          .search-item{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
            color: #333;
            .px2rem(margin-left,30);
            // .px2rem(padding-right,30);
            box-sizing: border-box;
            .px2rem(height, 86);
            .px2rem(line-height, 86);
            .px2rem(border-bottom-width, 1);
            border-bottom-style: solid;
            border-bottom-color: #EBEDF2;
            .h3think-radio {
              width:100%;
            //   .px2rem(width, 30);
            //   .px2rem(height, 30);
            //   .px2rem(margin-right, 30);
            }
            .title{
              // .px2rem(margin-left, 24);
              .px2rem(font-size, 30);
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .scroll-wrapper-hidden{
          overflow-y: hidden;
        }
      }
      .no-show-day{
        >div{
          &:last-child{
            border-left: none;
          }
        }
      }
    }
    .show-date{
      .seach-content-scroll{
        height: calc(100% - 110 / @baseFontSize * 1rem);
      }
    }

  }
}

.group-field-search-page{
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index: 3000;
  background: rgba(255,255,255,1);
  .searchTotal{
    .px2rem(height, 80);
    .px2rem(line-height, 80);
    .px2rem(font-size, 26);
    .px2rem(padding-left, 30);
    background: #F5F7F9;
    color:#999;
  }
  .seach-content-scroll{
    // height:100%;
     height: calc(100% - 168 / @baseFontSize * 1rem) ;
    .scroll-wrapper{
      position: relative;
      top: 0;
      width: 100%;
      height:100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &.scroll-nodata,
      &.page-index {
        /deep/.mescroll-hardware{
          display: none !important;
        }
      }
    }
    .search-item{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      color: #333;
      .px2rem(margin-left,30);
      // .px2rem(padding-right,30);
      box-sizing: border-box;
      .px2rem(height, 86);
      .px2rem(line-height, 86);
      .px2rem(border-bottom-width, 1);
      border-bottom-style: solid;
      border-bottom-color: #EBEDF2;
      .h3think-radio {
        width:100%;
      }
      .title{
        // .px2rem(margin-left, 24);
        .px2rem(font-size, 30);
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.rows-container {
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
}
.rows-container .empty-text {
  .px2rem(font-size, 24);
  color: #999;
  display: inherit;
  text-align: center;
}
.rows-container .icon-empty {
  display: block;
  margin: 0 auto;
  margin-top: 4rem;
  background-size: 100% 100%;
}
.rows-container .icon-empty.empty-search {
    width: 3.06666667rem;
    height: 2.85333333rem;
    background-image: url(/static/img/icon-list-search-empty.19b9a4ff.png);
}
.skeleton-loading {
  display: flex;
  align-items: center;
  width: 100%;
  .middle {
    flex: 1;
    .px2rem(height, 88);
    .px2rem(margin-left, 30);
    .px2rem(margin-right, 30);
    .px2rem(margin-top, 24);
    .px2rem(border-radius, 16);
  }
}
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>
<style>
  .group-search-color{
    font-style:normal;
    color:#2565F1;
    font-size: 0.4rem;
  }
</style>
