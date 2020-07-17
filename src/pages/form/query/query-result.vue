<template>
  <div class="open-query-result">
    <div class="open-query-result__num">
      共{{ total }}条数据
    </div>
    <div class="open-query-result__content">
      <h3-scroll
        ref="scroll"
        class="scroll-wrapper"
        :class="{
          'scroll-nodata': rows.length === 0,
          'page-index': pageIndex === 0,
        }"
        :loadMore="loadMore"
        :pageSize="limit"
        :noMoreMessage="noMoreMessage"
        :refresh="refresh"
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
          <div v-else>
            <div
              v-if="rows.length > 0 && !skeletonLoading"
              class="rows-container"
            >
              <query-list-item
                v-for="(row, index) in rows"
                :key="index"
                :row="row"
                :schemaCode="schemaCode"
                :controlMap="controlMap"
              />
            </div>
            <div
              v-else
              class="rows-container"
            >
              <div class="no-data">
                <img src="../../../assets/img/no-data.png" />
                <span class="empty-text">暂无查询结果</span>
              </div>
            </div>
          </div>
        </div>
      </h3-scroll>
    </div>
    <!-- <div class="open-query-result__bottom">
      <div class="open-query-result__button" @click="back">
        修改查询条件
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { H3Scroll } from 'h3-mobile-vue';
import skeleton from '@/components/common/skeleton-loading.vue';
import { getQueryData } from '@/light-app/service/external';
import QueryListItem from './query-list-item.vue';
@Component({
  name: 'open-query-result',
  components: {
    H3Scroll,
    skeleton,
    QueryListItem,
  },
})
export default class OpenQueryResult extends Vue {
  @Prop() schemaCode!: string;

  @Prop() searchParams!: any;

  @Prop() columns!: any[];

  total = 0;

  noMoreMessage = '';

  limit = 10;

  skeletons = 5; // 骨架图显示数量

  skeletonLoading = true;

  pageIndex = 0;

  rows = [];

  get controlMap () {
    const ret = {};
    this.columns.forEach(col => {
      ret[col.code] = {
        label: col.displayName,
        type: col.colType,
        options: col.controlOptions,
      };
    });
    return ret;
  }

  activated () {
    this.refresh();
  }

  /**
   * @description 下拉加载操作
   * @page page.num第一页为1
   * @done
   */
  loadMore (page, done) {
    const self = this;
    // if (page.num === 1) {
    //   this.resetParams();
    // } else {
    //   this.pageIndex = page.num - 1;
    // }
    this.pageIndex = page.num - 1;
    getQueryData(this.schemaCode, this.pageIndex, this.limit, this.searchParams).then((data) => {
      if (data.success) {
        const { total, rows } = data.returnData;
        this.total = total;
        if (this.pageIndex === 0) {
          this.rows = rows;
        } else {
          this.rows = this.rows.concat(rows);
        }
        this.skeletonLoading = false;
        self.$nextTick(() => {
          // 实时搜索词高亮处理
          done(this.limit, this.total);
        });
      } else {
        this.$toast.show({ icon: 'close-circle-o', text: data.errorMsg });
        this.$emit('invalid');
      }
    });
  }

  /**
   * 列表刷新
   */
  refresh () {
    // this.resetParams();
    const scroll: any = this.$refs.scroll;
    if (scroll && scroll.mescroll) {
      scroll.mescroll.resetUpScroll();
    }
  }

  back () {
    this.$emit('back');
  }
}

</script>
<style lang='less' scoped>
@import '../../../styles/common';
.open-query-result {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  .px2rem(padding-top, 24);
  &__num {
    .px2rem(padding-left, 30);
    .px2rem(height, 33);
    .px2rem(line-height, 33);
    .px2rem(font-size, 24);
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(153,153,153,1);
  }
  &__content {
    // flex: 1;
    position: absolute;
    .px2rem(top, 60);
    .px2rem(bottom, 0);
    left: 0;
    right: 0;
    .px2rem(padding-left, 24);
    .px2rem(padding-right, 24);
  }
  // &__bottom {
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   .px2rem(height, 148);
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   .px2rem(padding-left, 30);
  //   .px2rem(padding-right, 30);
  //   background:#fff;
  // }
  // &__button {
  //   width: 100%;
  //   .px2rem(height, 88);
  //   .px2rem(line-height, 88);
  //   background:rgba(16,127,255,1);
  //   .px2rem(border-radius, 44);
  //   color: #fff;
  //   text-align: center;
  //   .px2rem(font-size, 30);
  // }
  .content-wrapper {
    .px2rem(top, 88);
    width: 100%;
    z-index: 499;
    overflow-y: auto;
    overflow-x: hidden;
    .searchTotal {
      .px2rem(height, 60);
      .px2rem(line-height, 80);
      .px2rem(font-size, 26);
      .px2rem(padding-left, 30);
      color: #999;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      box-sizing: border-box;
    }
  }
  .rows-container {
    .px2rem(padding-left, 24);
    .px2rem(padding-right, 24);
    .px2rem(padding-bottom, 24);
    .empty-text {
      .px2rem(margin-top, 12);
      .px2rem(font-size, 28);
      color: #999;
      display: inherit;
      text-align: center;
    }
    .no-data {
      text-align: center;
      .px2rem(margin-top, 155);
    }
    img {
      .px2rem(width, 210);
      .px2rem(height, 210);
    }
    .data-add {
      .px2rem(width, 270);
      .px2rem(height, 72);
      .px2rem(line-height, 72);
      background:rgba(16,127,255,1);
      border-radius:44px;
      margin: 0 auto;
      .px2rem(margin-top, 48);
      text-align: center;
      color: #fff;
      .px2rem(font-size, 30);
    }
    .icon-empty {
      display: block;
      margin: 0 auto;
      .px2rem(margin-top, 300);
      background-size: 100% 100%;
      &.empty-list {
        background-image: url('~@/assets/img/icon-list-empty.png');
        .px2rem(width, 210);
        .px2rem(height, 212);
      }
      &.empty-search {
        .px2rem(width, 230);
        .px2rem(height, 214);
        background-image: url('~@/assets/img/icon-list-search-empty.png');
      }
      @media screen and (-webkit-min-device-pixel-ratio: 2),
        screen and (min--moz-device-pixel-ratio: 2) {
        &.empty-list {
          background-image: url('~@/assets/img/icon-list-empty-2x.png');
        }
        &.empty-search {
          background-image: url('~@/assets/img/icon-list-search-empty-2x.png');
        }
      }
      @media screen and (-webkit-min-device-pixel-ratio: 3),
        screen and (min--moz-device-pixel-ratio: 3) {
        &.empty-list {
          background-image: url('~@/assets/img/icon-list-empty-2x.png');
        }
        &.empty-search {
          background-image: url('~@/assets/img/icon-list-search-empty-2x.png');
        }
      }
    }
  }
  .skeleton-loading {
    display: flex;
    align-items: center;
    width: 100%;
    .middle {
      flex: 1;
      .px2rem(height, 149);
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
  .v-enter,.v-leave-to{
    opacity: 0;
  }
  .v-enter-active,.v-leave-active{
    transition: opacity .5s;
  }
}
</style>
