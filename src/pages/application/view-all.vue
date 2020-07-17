<template>
  <layout
    :title="title"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div
      id="view-template-page"
      class="view-template-main"
    >
      <!-- <div class="seach-content-scroll">
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
            <template v-if="!skeletonLoading"> -->
      <template v-if="skeletonLoading">
        <div
          v-for="(skeleton, index) in skeletons"
          :key="index"
          class="skeleton-loading"
        >
          <skeleton class="middle" />
        </div>
      </template>
      <div
        v-for="(item,index) in lists"
        :key="item.Code + index"
        class="template-list"
        @click="goToDetail(item)"
      >
        <div class="list-content">
          <div class="list-content-left">
            <img :src="item.Logo" alt="" />
          </div>
          <div class="list-content-middle">
            <div class="top">
              {{ item.Name }}
            </div>
            <div class="bottom">
              {{ item.Summary }}
            </div>
          </div>
          <div class="list-content-right">
            <div class="btn" :class="{'price': !item.IsFree}">
              {{ item.IsFree ? '免费' : `￥${item.Price.toFixed(2)}` }}
            </div>
            <!-- <div class="load">
              {{ `${item.InstallCount}次安装` }}
            </div> -->
          </div>
        </div>
      </div>
      <!-- </template>
          </div>
        </h3-scroll>
      </div> -->
    </div>
  </layout>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { H3Scroll } from 'h3-mobile-vue';
// import { setTitle, closeApp, openLink } from '@/config/dingtalk-interface';
// import { isDingtalk } from '@/config/common';
import { getAppTemplates, getTemplateCategories, installTemplate } from '@/service/app.light.common.api';
import skeleton from '@/components/common/skeleton-loading.vue';
// vuex-class module命名空间
const appModule = namespace('App');

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'viewAllTemplate',
  components: {
    H3Scroll,
    skeleton,
  },
})
export default class viewAllTemplate extends Vue {
  @appModule.State('appList') appList; // 应用列表

  title:any = '热门推荐';

  skeletons: number = 5; // 骨架图显示数量

  skeletonLoading = false;

  limit = 10;

  total= 0; // 总的条数

  isRefresh= false; // 是否下拉

  pageIndex = 0;

  lists = [];

  created () {
    this.title = this.$route.query.title;
    // this.lists = JSON.parse((this.$route.query.data as any));
    if (this.$route.params.data) {
      this.lists = JSON.parse((this.$route.params.data));
    } else { // 刷新页面
      this.skeletonLoading = true;
      this.getTemplateList();
    }
  }

  async getTemplateList () {
    const ret = await getTemplateCategories();
    if (ret && ret.success) {
      this.skeletonLoading = false;
      const arr = ret.returnData.Categories;
      const list = arr.find(it => it.Code === this.$route.query.code);
      if (list) {
        this.lists = list.TemplateList;
      } else {
        this.lists = [];
      }
    }
  }

  activated () {

  }

  /**
   * 跳转到详情页
  */
  goToDetail (item) {
    this.$router.push({
      name: 'lightTemplateDetail',
      query: { code: item.Code },
    });
  }

  async installedOrOpen (item) {
    if (item.IsInstalled) { // 跳转
      this.$router.replace({
        name: 'schemas',
        params: {
          appCode: item.AppCode,
        },
        query: {
          appCode: item.AppCode,
        },
      });
    } else { // 执行安装
      this.$set(item, 'Installation', true);
      const ret = await installTemplate(item.Code, true);
      if (ret.Successful) {
        this.$set(item, 'IsInstalled', true);
        this.$set(item, 'Installation', false);
      } else {
        this.$toast.show({ text: ret.ErrorMessage || '安装失败' });
        this.$set(item, 'IsInstalled', false);
        this.$set(item, 'Installation', false);
      }
    }
  }

  /**
   * 上拉加载更多
  */
  async loadMore (page, done) {
    if (page.num !== 1 || this.isRefresh) {
      // await this.$emit('updateData', page.num);
      this.pageIndex = page.num - 1;
      await this.getMore(this.pageIndex);
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
  }

  getMore (index) {
    console.log(index);
  }

  beforeRouteLeave (to, from, next) {
    // this.$store.state.excludeComp = ['viewAllTemplate'];
    // if (to.path === '/schemas') {
    //   this.$store.state.excludeComp = ['viewAllTemplate', 'lightTemplate'];
    // }
    if (to.path === '/lightTemplate') {
      this.$store.state.excludeComp = ['viewAllTemplate'];
    }
    next();
  }

  goBack () {
    this.$router.replace({
      name: 'lightTemplate',
    });
  }
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
#view-template-page {
  position: absolute;
  top: 0;
  right: 0;
  // .px2rem(bottom, 60);
  left: 0;
  bottom:0;
  width: 100%;
  height: 100%;
  z-index: 998;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
  -webkit-overflow-scrolling: touch;
 .seach-content-scroll{
    // height:100%;
     height: 100% ;
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

@keyframes installLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform:rotate(360deg);
  }
}

.skeleton-loading {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
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
