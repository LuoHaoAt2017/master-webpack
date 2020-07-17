<template>
  <div class="h3-apps">
    <div ref="header" style="background-color: #fff;">
      <div class="fixedTip" v-show="isTipShow">
      最多只能添加8个常用表单
      </div>
      <h3-card-draggable style="background: #fff;" :items.sync="commonAppItems" ref="commonItems" @remove="removeSelectedAppItem">
        <span slot="title" style="font-size: 14px;">
          常用表单（按住拖动可排序，最多添加8个）
        </span>
      </h3-card-draggable>
      <h3-white-space></h3-white-space>
      <div class="nav">
        <tab  :active="activeCode"  ref="tabs"  assoKey="AppCode" :toggle="onToggleAppGroupsShow" :apps="tabApps" :onChange="scrollToAppPosition" v-if="tabApps.length>1"></tab>    
      </div>
    </div>
    
    <div class="h3-apps-tab-content main"  ref="wrapper" >
      <div>
        <div v-for="(group, index) in allItems" :key="index" :ref="group.AppCode">
          <h3-card :title="`<span style='color:#666'>${group.DisplayName}${group.GroupDisplayName?'-'+group.GroupDisplayName:''}</span>`" 
            :hasLine="false"
            :headerStyle="cardHeaderStyle"
            :bodyStyle="cardBodyStyle"
            :cardStyle="cardStyle"
            >

              <h3-grid  :hasLine="false" >
                <h3-grid-item v-for="(item, index) in group.Childrens" 
                :key="item.SchemaCode" 
                :style="gridItemStyle" 
                activeCls="h3-grid-item"
                >
                  <div class="h3-grid-item-content" 
                    v-touch="{activeClass: 'h3-grid-item'}"
                    :style="gridItemContentStyle"
                    :class="[item.restore ? 'restore' :'', item.Active ?'active':'' ]"
                    >
                    <div class="h3-grid-item-inner-content" @click.stop="addToRecent(item, index)">
                      <span class="iconwrap icon-back2" @click.stop="addToRecent(item, index)">
                        <i :class="getAppIconClass(item,index)" @click.stop="addToRecent(item, index)"></i>
                      </span>
                      <div class="h3-grid-text" v-html="getName(item && item.DisplayName)" @click.stop="addToRecent(item,index)"></div>
                      <span class="h3-grid-appstate-icon" v-if="!item.Active" @click.stop="addToRecent(item,index)">
                        <svg id="icon-base-plus-circle" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M955.5 255q68.5 118 68.5 257t-68.5 257Q887 887 769 955.5T512 1024q-139 0-257-68.5T68.5 769Q0 651 0 512t68.5-257Q137 137 255 68.5T512 0q139 0 257 68.5T955.5 255zM768 512q0-14-10.5-25a34 34 0 0 0-25.5-11H548V293a35.85 35.85 0 0 0-36-36q-14 0-25 10.5a33.91 33.91 0 0 0-11 25.5v183H292a34 34 0 0 0-25.5 11Q256 498 256 512a35.85 35.85 0 0 0 36 36h184v183a33.91 33.91 0 0 0 11 25.5q11 10.5 25 10.5a35.85 35.85 0 0 0 36-36V548h184a35.85 35.85 0 0 0 36-36z" fill="#1890ff"></path></svg>
                      </span>
                      <span class="h3-grid-appstate-icon" v-else >
                        <i class="icon aufont icon-base-check-circle" style="color:#d3d3d3"></i>
                      </span>
                    </div>
                  </div>
                </h3-grid-item>
              </h3-grid>
            </h3-card>
        </div>
        
        
      </div>
    </div>
    <h3-modal :show.sync="showAppGroups" maskClosable type="popup" popup-direction="right" >
      <h3-list :hasHeader="false">
        <h3-list-item @click.native="gotoApp(item.SchemaCode)" v-for="item in tabApps" :key="item.SchemaCode">
          <div class="h3-apps-manager-modal-content">
            {{item.DisplayName}} 
          </div>
        </h3-list-item>

      </h3-list>
    </h3-modal>
  </div>
</template>
<script>
  
import IScroll from 'iscroll/build/iscroll-probe';
import h3Card from '../../../packages/components/h3-card/h3-card.vue';
import h3CardGrid from '../../../packages/widgets/h3-card/h3-card-grid.vue';
import h3Grid from '../../../packages/components/h3-grid/h3-grid.vue';
import h3GridItem from '../../../packages/components/h3-grid/h3-grid-item.vue';
import h3SearchHistory from '../../../packages/widgets/h3-search-history/index.vue';
import tab from '../../widgets/h3-tab/index.vue';
import H3Modal from '../../../packages/components/h3-modal/index.vue';
import { h3List, h3ListItem } from '../../../packages/components/h3-list';
import H3Button from '../../../packages/components/h3-button/index.vue';
import H3WhiteSpace from '../../../packages/components/h3-white-space/index.vue';
import h3Toast from '../../components/h3-toast/index.vue';
import H3CardDraggable from '../h3-card-new/h3-card-draggable';
import { getAppDatas } from 'src/service/get-data'; // ERROR
import H3PluginDeveloper from 'src/lib/h3-plugins-developer'; // ERROR
import touch from '../../directives/touch';
// import { setTimeout } from 'timers';
const recentAppCode = 'SYS_RecentModule';
const appIconColorArray = ['app-icon-color-1', 'app-icon-color-2', 'app-icon-color-3', 'app-icon-color-4'];


export default {
    name: 'h3-apps-manager',
    components: {
      h3Card,
      h3CardGrid,
      h3Grid,
      h3GridItem,
      // h3BlankPage,
      tab,
      H3Modal,
      h3List,
      h3ListItem,
      H3Button,
      h3SearchHistory,
      H3WhiteSpace,
      h3Toast,
      H3CardDraggable,
      // h3RadioItem,
    },
    props: {
      exists: {
        type: Array,
        default: () => [],
      },
    },
    directives: {
      touch,
    },
    data() {
      return {
        iscroll: null,
        loadingTitle: '数据加载中...',
        commonAppItems: [],
        recentAppItems: {},
        showAppGroups: false,
        allApps: [],
        allItems: [],
        tabApps: [],
        isTipShow: false,
        activeCode: '',
        appsOffsetTop: {},
        isToggleingTab: false,
        selectedApp: '',
        tabShow: true,
        isEdited: false,
        itemHeight: 0,
        gutter: 0,
        cardStyle: {
          margin: 0,
          boxShadow: '0 0 0 0 #fff',
          border: 'none',
        },
        cardHeaderStyle: {
          height: '44px',
          lineHeight: '44px',
          padding: 0,
          paddingLeft: '15px',
          color: '#666',
        },
        cardBodyStyle: {
          overflow: 'hidden',
          padding: 0,
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingBottom: '4px',
        },
        gridItemStyle: {
          padding: '0 4px 8px 4px',
          top: '-4px',
          height: '80px',
        },
        gridItemContentStyle: {
          background: '#f2f3f5',
          // marginTop: '-4px',
        },
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.setAppsPosition();
        this.setLastAppMargin();
        this.initScroller();
        const child = this.$refs.commonItems.$el.querySelector('div.h3-card-draggable-item');
        if (child) {
          this.itemHeight = child.offsetHeight;
        }
      });
    },
    created() {
      if (this.exists && this.exists.length > 0) {
        this.commonAppItems = [].concat(this.exists);
      }
      // this.datas = [this.recentAppItems].concat(this.testData1);
      const appCode = this.$store.state.appCode || '';
      // const appCode = 'A0d91a9b3f20746b6997cda684b6b4127';
      let solutionCode = this.$store.state.solutionCode;
      let appType = this.$store.state.appType || '0';
      if (!appCode && !solutionCode) {
        solutionCode = 'home';
        appType = '1';
      }
      this.requestHomeData(appCode, solutionCode, appType); // 获取常用表单数据
    },
    methods: {
      async requestHomeData(appCode, solutionCode, appType) {
        // H3PluginDeveloper.IShowPreLoader(this.loadingTitle);
        // window.toast.show({
        //   title: this.loadingTitle,
        // });
        H3PluginDeveloper.IShowToast(this.loadingTitle, 'loading', false);
        const res = await getAppDatas(appCode, solutionCode, appType);
        if (res.Successful) {
          // H3PluginDeveloper.IHidePreLoader();
          H3PluginDeveloper.IHideToast();
          this.recentAppItems = {};
          this.recentAppItems.SchemaCode = recentAppCode;
          this.recentAppItems.AppCode = recentAppCode;
          this.recentAppItems.DisplayName = '最近使用';
          this.recentAppItems.Childrens = res.ReturnData.RecentModules;

          for (const app of res.ReturnData.Apps) {
            app.AppCode = app.SchemaCode;
          }
          this.allApps = res.ReturnData.Apps;
          if (res.ReturnData.RecentModules.length > 0) {
            this.allItems.push(this.recentAppItems);
            this.tabApps = [].concat(this.recentAppItems);
          }
          this.allItems = this.allItems.concat(res.ReturnData.AppGroups);
          this.tabApps = this.tabApps.concat(this.allApps);

          this.$nextTick(() => {
            // 调整main部门top定位
            if (this.allApps.length > 0 && this.tabShow) {
              this.$refs.wrapper.style.top = `${this.$refs.header.offsetHeight}px`;
            }
            this.setAppsPosition();
            this.setLastAppMargin();
            this.refreshScroll();
            if (this.commonAppItems.length > 0) {
              for (const item of this.commonAppItems) {
                this.setRecentItemState(item, true);
                this.setAppGroupItemState(item, true);
              }
            }
          });
        }
      },
      onScroll(scroll) {
        const y = Math.abs(scroll.y);
        this.toggleActiveTabByTouch(y);
      },
      onScrollEnd(scroll) {
        const y = Math.abs(scroll.y);
        this.toggleActiveTabByTouch(y);
      },
      refreshScroll() {
        if (this.scroll) {
          this.scroll.refresh();
        } else {
          this.initScroller();
        }
      },
      toggleActiveTabByTouch(y) {
        if (this.isToggleingTab) return;
        let curIndex = -1;
        const apps = this.appsOffsetTop;
        for (let i = this.tabApps.length - 1; i >= 1; i -= 1) {
          if (apps[this.tabApps[i].AppCode] > y &&
            apps[this.tabApps[i - 1].AppCode] <= y) {
            curIndex = i - 1;
            break;
          } else if (apps[this.tabApps[i].AppCode] === y) {
            curIndex = i;
            break;
          }
        }
        if (curIndex !== -1) {
          this.activeCode = this.tabApps[curIndex].AppCode;
        }
      },
      initScroller() {
        this.iscroll = new IScroll(
          this.$refs.wrapper,
          {
            scrollX: false,
            scrollY: true,
            probeType: 2,
            bounce: false,
          },
        );
        // new IScrollSticky(this.iscroll, '.h3-apps-tab'); // eslint-disable-line
        this.iscroll.on('scroll', () => this.onScroll(this.iscroll));
        this.iscroll.on('scrollEnd', () => this.onScrollEnd(this.iscroll));
      },
      onToggleAppGroupsShow() {
        this.showAppGroups = !this.showAppGroups;
      },
      setAppsPosition() { // 设置每个应用的偏移量
        const appsOffsetTop = {};
        let groupApps = [];
        groupApps = groupApps.concat(this.allItems);
        for (let i = 0, len = groupApps.length; i < len; i += 1) {
          const app = groupApps[i];
          if (!appsOffsetTop[app.AppCode]) {
            let ele;
            if (this.$refs[app.AppCode] instanceof Array) {
              ele = this.$refs[app.AppCode] && this.$refs[app.AppCode][0];
            } else {
              ele = this.$refs[app.AppCode];
            }
            appsOffsetTop[app.AppCode] = ele.offsetTop;
            app.offsetTop = appsOffsetTop[app.AppCode];
          }
        }
        this.appsOffsetTop = appsOffsetTop;
      },
      setLastAppMargin() {
        if (this.allItems.length <= 0) {
          return;
        }
        const appCode = this.allItems[this.allItems.length - 1].AppCode;
        const doms = this.$refs[appCode];
        let totalHeight = 0;
        if (doms instanceof Array) {
          doms.forEach((dom) => {
            totalHeight += dom.offsetHeight;
          });
        } else {
          totalHeight += doms.offsetHeight;
        }
        const wrapperHeight = this.$refs.wrapper.offsetHeight;
        if (totalHeight < wrapperHeight) {
          // this.$refs.wrapper.style.paddingBottom = `${(wrapperHeight - totalHeight)}px`;
          const div = document.createElement('div');
          div.style.height = `${(wrapperHeight - totalHeight)}px`;
          this.$refs.wrapper.children[0].appendChild(div);
        }
      },
      scrollToAppPosition(appCode) {
        this.isToggleingTab = true;
        const y = this.appsOffsetTop[appCode];
        this.iscroll.scrollTo(0, -y, 300);
        setTimeout(() => {
          this.isToggleingTab = false;
        }, 300);
      },
      gotoApp(schemaCode) {
        const appCode = schemaCode || recentAppCode;
        this.selectedApp = appCode;
        window.setTimeout(() => {
          this.showAppGroups = false;
          const y = this.appsOffsetTop[appCode];
          this.iscroll.scrollTo(0, -y, 300);
          this.activeCode = appCode;
        }, 100);
      },
      addToRecent(item) {
        if (item.Active) {
          return;
        }
        this.isEdited = true;
        if (this.commonAppItems.length >= 8) {
          this.isTipShow = true;
          setTimeout(() => {
            this.isTipShow = false;
          }, 1000);
        } else {
          const newObj = {};
          for (const key of Object.keys(item)) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
              newObj[key] = item[key];
            }
          }
          newObj.newAdded = true;
          this.commonAppItems.push(newObj);
          if (this.commonAppItems.length === 4) {
            this.$refs.wrapper.style.top = `${this.$refs.header.offsetHeight + this.itemHeight + 8}px`;
          }
          this.setRecentItemState(item, true);
          this.setAppGroupItemState(item, true);
        }
      },
      setRecentItemState(item, active) {
        for (const children of this.recentAppItems.Childrens) {
          if (children.SchemaCode === item.SchemaCode) {
            if (!active) {
              this.$set(children, 'restore', true);
            } else {
              this.$set(children, 'restore', false);
            }
            children.Active = active; // eslint-disable-line
            break;
          }
        }
      },
      setAppGroupItemState(item, active) {
        const appGroups = this.allItems.filter(group =>
          group.AppCode === item.AppCode && group.GroupCode === item.ParentCode);
        if (appGroups && appGroups.length > 0) {
          const group = appGroups[0];
          for (const child of group.Childrens) {
            if (item.SchemaCode === child.SchemaCode) {
              if (!active) {
                this.$set(child, 'restore', true);
              } else {
                this.$set(child, 'restore', false);
              }
              child.Active = active; // eslint-disable-line
              break;
            }
          }
        }
      },
      removeSelectedAppItem(item) {
        this.isEdited = true;
        this.setRecentItemState(item, false);
        this.setAppGroupItemState(item, false);
        if (this.commonAppItems.length === 3) {
          this.$refs.wrapper.style.top = `${this.$refs.header.offsetHeight - this.itemHeight - 8}px`;
        }
      },
      randomFrom(lowerValue, upperValue) {
        let random = upperValue - lowerValue;
        random += 1;
        random *= Math.random();
        random += lowerValue;
        return Math.floor(random);
      },
      getAppIconClass(item, index) {
        let classStr = `font-icon ${item.IconCss}`;
        classStr = `${classStr} ${appIconColorArray[this.randomFrom(index, index + 3) % 4]}`;
        return classStr;
      },
      getName(val) {
        if (val.length > 6) {
          return `${val.substr(0, 5)}...`;
        }
        return val;
      },
      getValue() {
        return this.commonAppItems;
      },
    },
    computed: {
      tabContentCls() {
        if (this.commonAppItems.length > 3) {
          return 'h3-apps-tab-content-twoRow';
        }
        return '';
      },
    },
    watch: {
      exists(val) {
        if (val && val.length > 0) {
          this.commonAppItems = [].concat(val);
        }
      },
    },
    destroyed() {
      document.removeEventListener('touchmove', this.onTouchMove, false);
    },
};
</script>
<style lang="less">
@import '../../styles/mixins';

.h3-apps {
  position: absolute;
  top: 0;
  bottom: 44px;
  left: 0;
  width: 100%;
  overflow:hidden;
  -webkit-overflow-scrolling:touch;
}
.h3-apps-tab-content{
  position: absolute;
  top: 145px;
  left: 0;
  width: 100%;
  bottom: 0;
}
// .h3-apps-tab-content-twoRow{
//   top: 225px;
// }
.main {
  touch-action: none;
  position: absolute;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}

.demoTitle {
    padding: 15px 0 9px 15px;
    color: #000;
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    font-weight: bolder;
    position: relative;
}

.h3-card .h3-list-body {
  background-color: #f5f5f9 !important;
}

.sub-title {
  color: #888;
  font-size: 14px;
  padding: 15px 0 9px 15px;
}
.not-square-grid .h3-grid-icon {
  width: 40px;
  height: 60px;
}
.h3-grid-item-active {
  background: red;
}
.not-square-grid .h3-grid-icon {
    width: 40px;
    height: 60px;
}

.fixedTip{
  position: fixed;
  width: 100%;
  z-index: 99;
  .px2rem(height, 72);
  .px2rem(top, 0);
  .px2rem(left, 0);
  background: #000;
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  .px2rem(font-size, 28);
  .px2rem(line-height ,72);
  color:#fff;
}

//过渡效果相关
.app-sort-enter,
.app-sort-leave-active {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
  color: red;
}
.app-sort-sortable-chosen,
.app-sort-sortable-ghost {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}

.h3-apps-manager-modal-content{
  width: 100px;
  height: 100%;
  position: relative;
  .h3-apps-manager-modal-icon{
    color: #1890FF;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);
  }
}
.add {
  animation: appear 300ms;
}

@keyframes appear {
  from {
    transform: scale(0, 0);
  }
  to {
    transform: scale(1, 1);
  }
}

.restore {
  animation: restore 300ms;
}
@keyframes restore {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 0.8;
  }
}
.h3-grid-appstate-icon{
  .px2rem(width,32);
  .px2rem(height,32);
  position: absolute;
  .px2rem(top,16);
  .px2rem(right,16);
  .icon {
    position: absolute;
    .px2rem(width, 32);
    .px2rem(height, 32);
    left: 0;
    height: 0;
  }
}
.iconwrap {
  .font-icon {
    // color: #fff;
    // font-size:27px;
    .px2rem(font-size,56);
  }
}
.h3-grid-item-content.active{
  opacity: 0.8;
}
</style>


