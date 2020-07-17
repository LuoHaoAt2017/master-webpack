<template>
  <div class="light-template-search">
    <template v-if="searchShow">
      <div
        class="mescroll-upwarp filter-loading"
        style="visibility: visible; display: block;"
      >
        <p class="upwarp-progress mescroll-rotate"></p>
        <p class="upwarp-tip">
          加载中...
        </p>
      </div>
    </template>
    <div v-if="isSearch && !searchShow" class="searchTotal">
      搜索结果：共{{ searchTotal }}条
    </div>
    <div v-if="isSearch && !searchShow" class="seach-content-scroll">
      <h3-scroll
        v-if="searchTotal > 0"
        ref="searchScroll"
        class="scroll-wrapper"
        :class="{'scroll-nodata': searchLists.length === 0}"
        :loadMore="searchloadMore"
        :refresh="searchRefresh"
        :pageSize="limit"
      >
        <div class="content-wrapper">
          <div
            v-for="(item,index) in searchLists"
            :key="item.Code + index"
            class="template-list"
            @click="goToDetail(item)"
          >
            <div class="list-content">
              <div class="list-content-left">
                <img :src="item.Logo" alt="" />
              </div>
              <div class="list-content-middle">
                <div class="top" v-html="item.displayName || '--'">
                </div>
                <div class="bottom" v-html="item.displaySummary || '--'">
                </div>
              </div>
              <div class="list-content-right">
                <div class="btn" :class="{'price': !item.IsFree}">
                  {{ item.IsFree ? '免费' : `￥${item.Price.toFixed(2)}` }}
                </div>
                <!-- <div class="load">
                  {{ `${item.InstalledCount}次安装` }}
                </div> -->
              </div>
            </div>
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
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { namespace, State } from 'vuex-class';
import {
  H3Input, H3Scroll, H3SearchBar, H3Modal,
} from 'h3-mobile-vue';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import { H3Popup, H3Button, H3Radio } from '@h3/thinking-ui';
import skeleton from '@/components/common/skeleton-loading.vue';
import { isDingtalk, isiOS } from '@/config/common';

@Component({
  name: 'lightTemplateSearch',
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

export default class lightTemplateSearch extends Vue {
  @Prop({
    type: Array,
    default: [],
  }) searchOptions!: any[];

  @Prop({
    type: Number,
    default: 0,
  }) searchTotal!: number; // 搜索模式总的条数

  @Prop({
    type: String,
    default: '',
  }) searchKey!: string; // 搜索关键字

  searchShow = false; // 是否显示搜索

  isSearch = false;

  isSearchRefresh= false; // 是否下拉

  // 年月日是否显示 日，当选择了 年月字段，则没有 日供选择
  // isShowDay = true;

  // isScrollLoad = false;

  // visible = false;

  // popupShowFilter = true;

  limit= 10;

  skeletonLoading = false;

  skeletons: number = 5; // 骨架图显示数量

  get isDingtalk () {
    return isDingtalk;
  }

  @Watch('searchKey')
  searchKeyChange (val) {
    if (val) {
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }
  }

  /**
   * 是否管理员(注：取管理员方式要更改)
  */
  // get isAdministrator () {
  //   return this.userInfo.isAdministrator || this.userInfo.isSubAdministrator;
  // }

  // @Watch('showModel')
  // showModelChange (val) {
  //   if (val) {
  //     this.visible = true;
  //     this.$nextTick(() => {
  //       this.focusListen();
  //     });
  //   } else {
  //     this.visible = false;
  //   }
  // }

  mounted () {
    this.searchloadMore = throttle(this.searchloadMore, 100);
  }

  /**
   * 选中
  */
  goToDetail (item) {
    this.$emit('select', item);
  }

  /**
   * 筛选结果项
  //  */
  get searchLists () {
    const res : any[] = [];
    for (const item of this.searchOptions) {
      item.displayName = item.Name.replace(this.searchKey, () => {
        return `<i class="light-template-search-color">${this.searchKey}</i>`;
      });
      item.displaySummary = item.Summary.replace(this.searchKey, () => {
        return `<i class="light-template-search-color">${this.searchKey}</i>`;
      });
      res.push(item);
    }
    return res;
  }

  // 搜索模式下的

  async searchloadMore (page, done) {
    console.log(page);
    if (page.num !== 1 || this.isSearchRefresh) {
      await this.$emit('updateData', page.num, this.searchKey);
    }
    done(this.limit, this.searchTotal);
  }

  searchRefresh () {
    console.log('refresh');
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

  // onBlur () {
  //   if (!this.searchKey) {
  //     this.searchShow = false;
  //   }
  // }

  // onClear () {
  //   this.isSearch = false;
  // }

  // onChange (val) { // 搜索数据
  //   this.searchKey = val.trim();
  //   if (val) {
  //     this.realSearch();
  //   } else {
  //     this.isSearch = false;
  //     this.searchDoRefresh();
  //   }
  // }

  // async realSearch () {
  //   this.isSearch = true;
  //   await this.$emit('search', this.searchKey);
  // }

  // onCancel () {
  //   this.searchShow = false;
  //   this.isSearch = false;
  // }

  // beforeDestroy () {
  //   const dom = this.$refs.searchPage as any;
  //   if (dom) {
  //     document.body.removeChild(dom);
  //   }
  // }
}

</script>
<style lang='less' scoped>
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}

.light-template-search{
  position: absolute;
  .px2rem(top, 88);
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
     height: calc(100% - 80 / @baseFontSize * 1rem) ;
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
      .content-wrapper {
        width: 100%;
      }
      .template-list{
        .px2rem(margin-top,40);
        .px2rem(padding-left,30);
        .px2rem(padding-right,30);
        &:last-child{
          .px2rem(margin-bottom,24);
        }
        &:first-child{
          .px2rem(margin-top,24);
        }
        color:#333;
        .list-header{
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-title{
            .px2rem(font-size,40);
            font-weight:400;
            color:#333333;
          }
          &-all{
            color:#333;
            span{
              .px2rem(font-size,28);
            }
            i{
              .px2rem(margin-left,20);
              .px2rem(font-size, 24);
            }
          }
        }

        .list-content{
          display: flex;
          justify-content: flex-start;
          align-content: center;
          .px2rem(margin-top,32);
          &-left{
            .px2rem(height,118);
            .px2rem(width,118);
            .px2rem(margin-right,16);
            background:#fff;
            img{
              .px2rem(height,118);
              .px2rem(width,118);
              .px2rem(border-radius, 20);
            }
          }
          &-middle{
          .top{
              .px2rem(margin-top,18);
              .px2rem(font-size,32);
              .px2rem(height,45);
              .px2rem(line-height,45);
              color:#333;
              .px2rem(width,346);
              font-weight:bold;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          .bottom{
              .px2rem(margin-top,8);
              .px2rem(height,32);
              .px2rem(line-height,32);
              .px2rem(margin-bottom,15);
              .px2rem(font-size,24);
              .px2rem(width,346);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          &-right{
            margin-left:auto;
            .btn{
              .px2rem(margin-top,12);
              // .px2rem(width,146);
              .px2rem(height, 54);
              .px2rem(line-height, 54);
              .px2rem(font-size, 28);
              .px2rem(border-radius,27);
              .px2rem(padding-left,24);
              .px2rem(padding-right,24);
              background:#DAF1DC;
              text-align: center;
              color: #0BCC1B;
            }
            .price{
              background:#FFEAE4;
              color: #F2340F;
            }
            .loading {
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 1;
              .px2rem(width,186);
              transition: opacity 150ms linear;
              span {
                .px2rem(margin-right, 16);
                animation: installLoading 1s linear infinite;
              }
            }
            .load{
              width:100%;
              .px2rem(margin-top,8);
              .px2rem(font-size, 20);
              text-align: right;
              color:#666666;
            }
          }
        }
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
<style lang='less' >
  @baseFontSize: 75;
  @baseThemeColor: #107fff;
  .px2rem(@name,@px) {
    @{name}: @px / @baseFontSize * 1rem;
  }
  .light-template-search-color{
    font-style:normal;
    .px2rem(font-size,32);
    color:#2565F1;
  }
</style>
