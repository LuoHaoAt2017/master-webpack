<template>
  <layout
    :title="title"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div class="template-search">
      <h3-search-bar
        v-model="searchValue"
        @clear="onClear"
        @focus="onFocus"
        @blur="onBlur"
        @extra="onCancel"
        @change="onSubmit"
      />
    </div>
    <light-template-search
      v-show="isShowSerach"
      ref="templateSearch"
      :searchOptions="serachData"
      :searchTotal="searchTotal"
      :searchKey="searchValue"
      @updateData="updateData"
      @select="searchGoTodetail"
    />
    <div
      id="light-template-page"
      v-show="!isShowSerach"
      ref="templateContent"
      class="light-template-main"
      @scroll.passive="fnScroll"
    >
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
        v-show="!skeletonLoading"
        class="classify"
        :class="{'reset-fixed': toolbarRelocation && !isDingtalk,'reset-mobile': toolbarRelocation && isDingtalk}"
      >
        <h3-tab :index="toolbarIndex">
          <h3-tab-item v-for="(item,index) in list" :key="item.Code + index" :class="{'last-tab-item': index === list.length - 1}">
            <div class="class-label" @click="selectToolbar(index)">
              {{ item.CategoryName }}
            </div>
          </h3-tab-item>
        </h3-tab>
        <div class="open-classify-icon" @click="showToolbar">
          <div class="shadow-left"></div>
          <div class="all-port">
            <i class="icon h3yun_All same-size"></i>
          </div>
        </div>
      </div>
      <light-template-model
        v-if="toolbarShow"
        :toolbarList="list"
        @select="selectToolbarModel"
        @closeModel="closeToolbarModel"
      />

      <div
        v-for="(item,index) in list"
        v-show="!skeletonLoading"
        ref="templateList"
        :key="index"
        class="template-list"
      >
        <div class="list-header">
          <div class="list-header-title">
            {{ item.CategoryName }}
          </div>
          <div class="list-header-all" @click="goAll(item)">
            <span>{{ `查看全部(${item.TemplateList.length})` }}</span>
            <!-- <i class="icon h3yun_All right-o"></i> -->
          </div>
        </div>
        <h3-swiper :itemWidth="itemWidth">
          <h3-swiper-item v-for="(sitem, tindex) in Math.ceil(item.TemplateList.length / 3)" :key="tindex" class="h3-swiper-demo-img">
            <div
              v-for="(it,sIndex) in item.TemplateList.slice(tindex * 3,tindex * 3 + 3)"
              :key="it.Code + index + sIndex"
              class="list-content"
              :class="{'list-col-first': sIndex === 0}"
              @click="goToDetail(it)"
            >
              <div class="list-content-left">
                <img :src="it.Logo" alt="" />
              </div>
              <div class="list-content-middle">
                <div class="top">
                  {{ it.Name }}
                </div>
                <div class="bottom">
                  {{ it.Summary }}
                </div>
              </div>
              <div class="list-content-right">
                <div class="btn" :class="{'price': !it.IsFree}">
                  {{ it.IsFree ? '免费' : `￥${it.Price.toFixed(2)}` }}
                </div>
                <!-- <div class="load">
                  {{ `${it.InstallCount}次安装` }}
                </div> -->
              </div>
            </div>
          </h3-swiper-item>
        </h3-swiper>
      </div>
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
// import { isDingtalk } from '@/config/common';
import { getTemplateCategories, installTemplate, getSearchTemplates } from '@/service/app.light.common.api';
import skeleton from '@/components/common/skeleton-loading.vue';
import { H3Swiper, H3SearchBar, H3Tab } from '@h3/thinking-ui';
import lightTemplateSearch from './light-template-search.vue';
import lightTemplateModel from './light-template-model.vue';
import cloneDeep from 'lodash/cloneDeep';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import { isDingtalk, isiOS } from '@/config/common';

// vuex-class module命名空间
const appModule = namespace('App');

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'lightTemplate',
  components: {
    skeleton,
    H3Swiper,
    H3SwiperItem: H3Swiper.Item,
    H3SearchBar,
    lightTemplateSearch,
    H3Tab,
    H3TabItem: H3Tab.Item,
    lightTemplateModel,
  },
})
export default class lightTemplate extends Vue {
  @appModule.State('appList') appList; // 应用列表

  @appModule.State('canCreateLightApp') canCreateLightApp;

  @appModule.Getter('isShowAddApp') isShowAddApp; // 是否显示添加按钮

  @appModule.Getter('isShowEmptyAddApp') isShowEmptyAddApp; // 是否显示空应用状态下的添加按钮

  @appModule.Mutation('handleAppTitle') handleAppTitle;

  title: string = '应用模板';

  // 模板分类数据

  // templateList= [];

  skeletonLoading = false;

  list= [];

  skeletons: number = 5; // 骨架图显示数量

  lastPosition: number = 0;

  toolbarShow= false; // 顶部的toolbar展开显示

  toolbarRelocation = false;

  // shrinkData= []; // 收缩时的数据

  scrollBody: HTMLElement | null = null;

  isTopscroll = false;

  startY = 0;

  itemWidth = 100;

  searchValue = '';

  serachData = [];

  searchTotal = 0; // 搜索的数据总数

  searchIndex: number = 0; // 分页，默认是0

  isShowSerach = false;

  limit = 10; // 每页10条

  toolbarIndex = 0;

  offsetTops= [];

  get isDingtalk () {
    return isDingtalk;
  }

  async created () {
    this.skeletonLoading = true;
    await this.getTemplateList();
    this.init();
    this.fnScroll = throttle(this.fnScroll, 300);
  }

  mounted () {
    this.itemWidth = window.innerWidth - 30;
    this.scrollBody = document.querySelector('#light-template-page');
    this.scrollDivEvent();
    this.onSubmit = debounce(this.onSubmit, 500);
  }

  scrollDivEvent () {
    this.scrollBody.addEventListener('touchstart', this.touchStart, false);
    this.scrollBody.addEventListener('touchmove', this.touchMove, false);
    // this.scrollBody.addEventListener('touchend', this.touchEnd, false);
  }

  touchStart (evt) {
    try {
      // if (this.isTopscroll) {
      //   evt.preventDefault();
      // }
      const touch = evt.touches[0]; // 获取第一个触点
      const y = Number(touch.pageY); // 页面触点Y坐标
      // 记录触点初始位置
      this.startY = y;
    } catch (e) {
      console.log(e.message);
    }
  }

  touchMove (evt) {
    try {
      // this.isTopscroll = true;
      const touch = evt.touches[0]; // 获取第一个触点
      const y = Number(touch.pageY); // 页面触点Y坐标
      // 判断滑动方向
      if (y - this.startY > 10) { // 阈值 50
        // console.log('上滑了！');
        this.toolbarRelocation = true;
      }
      if (this.startY - y > 0) { // 阈值 10
        // console.log('下滑了！');
        this.toolbarRelocation = false;
      }
      if (this.scrollBody.scrollTop < 50) { // 滚动到顶部的距离
        // console.log('距顶部距离小于！');
        this.toolbarRelocation = false;
      }
      // 处理高亮显示toolbar
      // this.fnScroll(this.scrollBody.scrollTop);
    } catch (e) {
      console.log(e.message);
    }
  }

  touchEnd (evt) {
    try {
      // this.isTopscroll = false;
      // const touch = evt.touches[0]; // 获取第一个触点
      // const y = Number(touch.pageY); // 页面触点Y坐标
      // 判断滑动方向
    } catch (e) {
      console.log(e.message);
    }
  }

  init () {
    this.$nextTick(() => {
      const listTop = (document.getElementsByClassName('template-list')[0] as any);
      listTop.style.marginTop = (document.getElementsByClassName('classify')[0] as any).clientHeight + 12 + 44 + 'px';
    });
  }

  fnScroll (event: any) {
    if (this.list.length > 1) {
      if (this.offsetTops.length === 0) {
        this.getAllGroupOffsetRange();
      }
      const scrollTop = event.target.scrollTop + (document.getElementsByClassName('classify')[0] as any).clientHeight + 12 + 44;
      let index = -1;
      for (const group of this.offsetTops) {
        if (group.min <= scrollTop && group.max > scrollTop) {
          index = group.index;
          break;
        }
      }
      if (index !== -1) {
        this.toolbarIndex = index;
      }
    }
  }

  getAllGroupOffsetRange () {
    const groups = this.$refs.templateList as any;
    const groupOffsets = [];
    groups.forEach((group) => {
      groupOffsets.push((group as any).offsetTop);
    });
    const len = groupOffsets.length;
    if (len > 1) {
      for (let i = 0; i < len - 2; i++) {
        this.offsetTops.push({
          index: i,
          min: groupOffsets[i],
          max: groupOffsets[i + 1],
        });
      }
    }
  }

  activated () {

  }

  async getTemplateList () {
    const ret = await getTemplateCategories();
    if (ret && ret.success) {
      this.list = ret.returnData.Categories;// .concat(ret.returnData.Categories);
      this.skeletonLoading = false;
    }
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

  scrollTo (height) {
    const panel = this.$refs.templateContent as any;
    (panel as any).scrollTop = height;
  }

  getScrollHeight () {
    const panel = this.$refs.templateContent as any;
    return panel.scrollTop;
  }

  // async getTemplateUrl() {
  //   const res = await getStoreUrl();
  //   if (res.Successful) {
  //     this.$store.state.autoLoginToStoreUrl = res.ReturnData.StoreUrl;
  //   }
  // }

  goBack () {
    this.$router.replace({
      name: 'apps',
    });
  }

  goAll (item) {
    const arr = cloneDeep(item.TemplateList);
    arr.forEach(it => {
      if (it.Installation) {
        it.Installation = false;
      }
    });
    this.$router.push({
      name: 'viewAllTemplate',
      query: { title: item.CategoryName, code: item.Code },
      params: { data: JSON.stringify(arr) },
    });
  }

  /***
   *选择toolbar
  */
  selectToolbar (index) {
    this.toolbarIndex = index;
    this.toolbarRelocation = false;
    this.scrollBody.scrollTop = this.$refs.templateList[index].offsetTop - 44;
  }

  selectToolbarModel (index) {
    this.toolbarShow = false;
    this.selectToolbar(index);
  }

  /**
   * 展开toolbar
  */
  showToolbar () {
    this.toolbarShow = true;
  }

  /**
   * 关闭toolbar弹窗
  */
  closeToolbarModel () {
    this.toolbarShow = false;
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

  /**
   * 搜索页面的 选择，跳转到详情页
  */
  searchGoTodetail (item) {
    this.$router.push({
      name: 'lightTemplateDetail',
      query: { code: item.Code },
    });
  }

  beforeRouteEnter (to, from, next) {
    if (from.path === '/viewAllTemplate' || from.path === '/lightTemplateDetail') {
      next(vm => {
        // vm.getTemplateList();
        vm.searchValue = '';
        vm.isShowSerach = false;
        vm.scrollTo(vm.lastPosition);
      });
    } else {
      next(vm => {
        vm.lastPosition = 0;
      });
    };
    next();
  }

  beforeRouteLeave (to, from, next) {
    if (to.path === '/apps' || to.path === '/schemas') {
      this.$store.state.excludeComp = ['lightTemplate'];
    }
    this.lastPosition = this.getScrollHeight();
    next();
  }

  /**
   * 分页数据加载
  */
  updateData (num, searchKey) {
    if (searchKey) {
      this.searchIndex = num - 1;
      this.getSearchData(this.searchIndex);
    }
  }

  /**
   * 搜索
  */
  async onSubmit () {
    if (this.searchValue.trim()) {
      this.searchIndex = 0;
      this.searchTotal = 0;
      this.serachData = [];
      this.isShowSerach = true; // 显示搜索页面
      (this.$refs.templateSearch as any).searchShow = true;
      await this.getSearchData();
      (this.$refs.templateSearch as any).searchShow = false;
    } else {
      this.isShowSerach = false;
      (this.$refs.templateSearch as any).searchDoRefresh();
    }
  }

  /**
   * 请求搜索数据
  */
  async getSearchData (searchIndex = 0) {
    const ret = await getSearchTemplates(this.searchValue, searchIndex, this.limit);
    if (ret && ret.success) {
      if (searchIndex === 0) {
        this.serachData = ret.returnData.Result.Templates;
      } else {
        this.serachData = this.serachData.concat(ret.returnData.Result.Templates);
      }
      this.searchTotal = ret.returnData.Result.Total;
    }
  }

  onClear () {
    // (this.$refs.templateSearch as any).searchShow = false;
  }

  onFocus () {

  }

  onBlur () {
    if (!this.searchValue.trim()) {
      this.isShowSerach = false; // 不显示显示搜索页面
    }
  }

  onCancel () {
    // (this.$refs.templateSearch as any).searchShow = false;
    this.isShowSerach = false;
  }

  beforeDestroy () {
    this.scrollBody.removeEventListener('touchstart', this.touchStart, false);
    this.scrollBody.removeEventListener('touchmove', this.touchMove, false);
    // this.scrollBody.removeEventListener('touchend', this.touchEnd, false);
  }
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
#light-template-page {
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
  // .px2rem(padding-left,30);
  // .px2rem(padding-right,30);

  .mask{
    position: fixed;
    top: 0;
    right: 0;
    // .px2rem(bottom, 60);
    left: 0;
    bottom:0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background:rgba(0,0,0,0.4);
    opacity:1;
    overflow: hidden;
  }

  .classify{
    position: absolute;
    // top: 0;
    .px2rem(top, 87);
    width:100%;
    z-index:1000;
    // overflow: hidden;
    /deep/ .h3think-tab.h3think-tab--border{
      border-bottom:none;
    }
    /deep/ .h3think-tab{
      .px2rem(height, 98);
      .h3think-tab__wrap{
        //  width: calc(100% - 30/@baseFontSize * 1rem);
        .h3think-tab-item{
          min-width:inherit;
          overflow: visible;
          .px2rem(height,56);
          .px2rem(line-height,56);
          .px2rem(margin-right, 12);
          .px2rem(padding, 0);
          .class-label{
            .px2rem(padding-left,30);
            .px2rem(padding-right,30);
              background:rgba(245,247,249,1);
            .px2rem(border-radius,30);
            .px2rem(font-size, 26);
            color:#333;
          }
          &:first-child{
            .px2rem(margin-left, 30);
          }
          // &:last-child{
          //   .px2rem(padding-right,110);
          // }
        }
        .h3think-tab__line{
          display: none;
        }
      }
    }
    .last-tab-item{
      .px2rem(padding-right,110)!important;
    }
    .open-classify-icon{
      position:absolute;
      right:0;
      top:0;
      .px2rem(width ,82);
      .px2rem(height,98);
      display:flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      .shadow-left{
        .px2rem(width, 20);
        .px2rem(height, 79);
        position:absolute;
        .px2rem(top,9);
        left:0;
        box-shadow: -6px 2px 6px rgba(0,0,0,0.06);
        z-index:101;
      }
      .all-port{
        position:absolute;
        right:0;
        top:0;
        .px2rem(width ,82);
        .px2rem(height,98);
        display:flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        z-index:110;
      }
      i{
        color:#666;
        .px2rem(font-size,30);
      }
    }
  }

  .reset-fixed{
    position:fixed!important;
    .px2rem(top, 184)!important; // 97+88
  }

  .reset-mobile{
     position:fixed!important;
    .px2rem(top, 87)!important; // 97+88
  }

  .classify-content{
    background: #fff;
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .px2rem(line-height, 80);
    .px2rem(padding-top, 14);
    .px2rem(padding-bottom,20);
    box-sizing: border-box;
    // transition: height 0.3s;
    overflow: hidden;
    span{
      display: inline-block;
      // box-sizing: border-box;
      .px2rem(height,56);
      .px2rem(line-height,56);
      .px2rem(padding-left, 30);
      .px2rem(padding-right, 30);
      background: #F5F7F9;
      .px2rem(border-radius,30);
      color:#333;
      .px2rem(font-size, 26);
      // .px2rem(margin-left,12);
      .px2rem(margin-right,12);
    }
    .classify-info{
      display: inline-block;
      color:#333;
      background: #fff;
      .px2rem(padding-left, 0);
      .px2rem(padding-right, 0);
    }
  }

  .template-list{
    .px2rem(margin-top,72);
    // .px2rem(padding-left,30);
    // .px2rem(padding-right,30);
    color:#333;
    &:last-child{
      .px2rem(margin-bottom,24);
    }
    &:first-child{
      .px2rem(margin-top,24);
    }
    .list-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .px2rem(padding-left,30);
      .px2rem(padding-right,30);
      &-title{
        // flex:1;
        .px2rem(max-width, 440);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
      .px2rem(margin-top,40);
      .px2rem(padding-right,30);
      &-left{
        .px2rem(height,118);
        .px2rem(width,118);
        .px2rem(margin-right,16);
         background:#fff;
        //  .px2rem(border-radius, 20);
        img{
          .px2rem(border-radius, 20);
          .px2rem(height,118);
          .px2rem(width,118);
        }
      }
      &-middle{
       .top{
          .px2rem(margin-top,18);
          .px2rem(font-size,32);
          .px2rem(height,45);
          .px2rem(line-height,45);
          color:#333;
          font-weight:bold;
          .px2rem(width,346);
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
          font-weight: 500;
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
          transition: opacity 150ms linear;
          .px2rem(width,186);
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
    /deep/ .h3think-swiper .h3think-swiper__container{
      align-items: flex-start;
    }
    .list-col-first{
       .px2rem(margin-top,28);
    }
  }

  .skeleton-loading {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    .px2rem(top, 30);
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
}
.template-search{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  /deep/ .h3think-search-bar .h3think-search-bar__form{
    .px2rem(margin-left,30);
    .px2rem(margin-right,30);
  }
  // /deep/ .h3think-search-bar__btn{
  //   .px2rem(margin-right,30);
  // }
}
@keyframes installLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform:rotate(360deg);
  }
}
</style>
