<template>
  <div class="app-manager" :style="{top:wrapperTop+'px'}">
    <div class="nav-tabs-container mescroll-touch" v-if="tabApps.length>1">
      <h3-tab :active="activeCode" assoKey="SchemaCode" :toggle="openModal" ref="tabs" :apps="tabApps" :onChange="scrollToAppPosition"></h3-tab>
    </div>
    <div class="apps-tab-content" :style="{top:tabHeight+'px'}">
      <div id='apps-scroll' ref="container" :style="{overflow:showAppGroups?'hidden':''}">
        <div class="app-card-group" :class="cardClass" v-for="(group, groupIndex) in appGroups" :key="group.GroupCode" :ref="group.AppCode">
          <div class="app-card-head" v-once>
            <span class='app-card-title'>
              <span>{{group.DisplayName}}</span>
              <span v-if="group.GroupDisplayName">-{{group.GroupDisplayName}}</span>
            </span>
          </div>
          <div class="app-card-body">
            <h3-grid :hasLine="false">
              <h3-grid-item v-for="(item, index) in group.Childrens"
                :key="item.SchemaCode" class="app-grid-item">
                <div class="h3-grid-item-content app-grid-content" :class="[appClass, item.Active ?'active':'restore']">
                  <div @click.stop="onAppClick(item, groupIndex)"  v-longtouch="{app:item,handler:onLongTouch}" v-once>
                    <span class="iconwrap icon-back2 h3yun_All left-o">
                      <i :class="item.appIconClass"></i>
                    </span>
                    <div class="app-grid-text">{{item.DisplayName}}</div>
                  </div>
                  <div class="h3-grid-appstate-icon" v-if="page=='setting'" @click.stop="onAppClick(item, groupIndex)">
                    <i class="icon aufont icon-base-plus-circle" v-if="!item.Active" style="color:#1890ff"></i>
                    <i class="icon aufont icon-base-check-circle" v-else style="color:#d3d3d3"></i>
                  </div>
                </div>
                </h3-grid-item>
              </h3-grid>
          </div>
        </div>
        <div :style="{height:lastAppMargin}"></div>
        <slot name="content"></slot>
      </div>
    </div>
    <h3-modal :show.sync="showAppGroups" maskClosable type="popup" popup-direction="right" @on-hide="onHideModal">
      <slot name="modal" :goto-app="gotoApp" :close-modal="closeModal" :selected-app="selectedApp"></slot>
    </h3-modal>
  </div>
</template>
<script>

import { throttle } from '../../config/common';
// h3 widgets
import longtouch from '../../directives/long-touch';
import H3Modal from '../../../packages/components/h3-modal';
import h3Tab from '../../../packages/widgets/h3-tab';
import { H3Grid, H3GridItem } from '../../../packages/components/h3-grid/';

export default {
  name: 'app-manager',
  components: {
    h3Tab,
    H3Grid,
    H3GridItem,
    H3Modal,
  },
  directives: {
    longtouch,
  },
  props: {
    tabApps: {
      type: Array,
      default: [],
      required: true,
    },
    appGroups: {
      type: Array,
      default: [],
      required: true,
    },
    wrapperTop: Number,
    cardClass: String,
    appClass: String,
    page: String,
  },
  data() {
    return {
      showAppGroups: false,
      activeCode: '',
      appsOffsetTop: null,
      selectedApp: '',
      tabHeight: 0,
      lastAppHeight: 0,
      lastAppMargin: '',
      //  不进行声明式赋值 数据不更新视图
      // isModalHiding: false,
      // isScrollTo: false,
      // scrollTimer: null,
      // lastScrollTop: 0,
    };
  },
  created() {
    this.toggleActiveTabByTouch = throttle(this.toggleActiveTabByTouch, 200, {
      trailing: true,
    });
  },
  mounted() {
    this.initView();
    this.initWatcher();
    this.initScroller();
  },
  activated() {
    this.initScroller();
  },
  methods: {
    initView() {
      if (this.tabApps.length > 1) {
        this.$nextTick(() => {
          this.tabHeight = this.$refs.tabs ? this.$refs.tabs.$el.offsetHeight : 0;
          this.setAppsPosition();
          this.activeCode = this.tabApps.length > 0 ? this.tabApps[0].SchemaCode : 0;
          this.$nextTick(() => {
            this.setLastAppMargin(true);
          });
        });
      }
    },
    initScroller() {
      const container = this.$refs.container;
      if (container && this.tabApps.length > 1) {
        container.scrollTop = this.lastScrollTop;
        container.addEventListener('scroll', this.onScroll);
      }
    },
    initWatcher() {
      if (this.page === 'setting') {
        this.$watch('wrapperTop', () => {
          window.setTimeout(() => {
            this.setLastAppMargin(false);
          }, 300);
        });
      } else {
        this.$watch('tabApps', (val) => {
          if (val.length > 0) {
            this.initView();
          }
        });
      }
    },
    onAppClick(item, groupIndex) {
      this.$emit('onAppClick', item, groupIndex);
    },
    onLongTouch(item) {
      this.$emit('onLongTouch', item);
    },
    onScroll() {
      if (this.isScrollTo) {
        return;
      }
      const container = this.$refs.container;
      const y = container.scrollTop;
      if (y === 0 || container.scrollHeight === y + container.offsetHeight) {
        this.toggleActiveTabByTouch.flush(y);
      } else {
        this.toggleActiveTabByTouch(y);
      }
    },
    onHideModal() {
      if (this.page === 'application' && !this.isModalHiding) {
        this.$emit('onHideModal', true);
      }
    },
    openModal() {
      this.showAppGroups = true;
      this.selectedApp = this.activeCode;
      this.isModalHiding = false;
      this.toggleActiveTabByTouch.flush();
      if (this.page === 'application') {
        this.$emit('onShowModal');
      }
    },
    closeModal(willSaveData) {
      this.isModalHiding = true;
      this.showAppGroups = false;
      if (this.page === 'application') {
        this.$emit('onHideModal', willSaveData);
      }
    },
    toggleActiveTabByTouch(y) {
      let activeCode = '';
      const positionMap = this.appsOffsetTop;
      this.lastScrollTop = y;
      for (const code in positionMap) {
        if (Object.prototype.hasOwnProperty.call(positionMap, code)) {
          const top = positionMap[code];
          if (y + 5 >= top) { // 允许5px的误差
            activeCode = code;
          }
        }
      }
      if (activeCode !== this.activeCode) {
        this.activeCode = activeCode;
        this.$forceUpdate();
      }
    },
    // 设置每个应用的偏移量
    setAppsPosition() {
      const appsOffsetTop = {};
      for (let i = 0, len = this.appGroups.length; i < len; i += 1) {
        const app = this.appGroups[i];
        if (appsOffsetTop[app.AppCode] === undefined) {
          let ele;
          if (this.$refs[app.AppCode] instanceof Array) {
            ele = this.$refs[app.AppCode] && this.$refs[app.AppCode][0];
          } else {
            ele = this.$refs[app.AppCode];
          }
          appsOffsetTop[app.AppCode] = ele.offsetTop;
          // app.offsetTop = appsOffsetTop[app.AppCode];
        }
      }
      this.appsOffsetTop = appsOffsetTop;
    },
    setLastAppMargin(dataLoad) {
      if (this.appGroups.length === 0) {
        return;
      }
      if (dataLoad || this.lastAppHeight === 0) {
        const appCode = this.appGroups[this.appGroups.length - 1].AppCode;
        const doms = this.$refs[appCode];
        let totalHeight = 0;
        if (doms instanceof Array) {
          doms.forEach((dom) => {
            totalHeight += dom.offsetHeight;
          });
        } else {
          totalHeight += doms.offsetHeight;
        }
        this.lastAppHeight = totalHeight;
      }
      const wrapperHeight = this.$refs.container.offsetHeight;
      if (this.lastAppHeight < wrapperHeight) {
        this.lastAppMargin = `${(wrapperHeight - this.lastAppHeight)}px`;
      } else {
        this.lastAppMargin = '';
      }
    },
    scrollToAppPosition(appCode) {
      this.activeCode = appCode;
      const y = this.appsOffsetTop[appCode];
      this.scrollByStep(y, 300, 30);
    },
    gotoApp(appCode) {
      this.selectedApp = appCode;
      window.setTimeout(() => {
        this.isModalHiding = true;
        this.showAppGroups = false;
        const y = this.appsOffsetTop[appCode];
        this.scrollByStep(y);
        this.activeCode = appCode;
      }, 100);
    },
    scrollByStep(y) {
      if (y === undefined) {
        return;
      }
      this.isScrollTo = true;
      const self = this;
      if ($('#apps-scroll').is(':animated')) {
        $('#apps-scroll').stop(true, true);
      }
      $('#apps-scroll').animate({
        scrollTop: `${y}px`,
      }, 500, () => {
        self.isScrollTo = false;
        self.lastScrollTop = y;
      });
    },
  },
  deactivated() {
    this.scrollTimer = null;
    this.isModalHiding = false;
    this.isScrollTo = false;
    this.showAppGroups = false;
    const container = this.$refs.container;
    if (container) {
      container.removeEventListener('scroll', this.onScroll);
    }
  },
};
</script>
<style lang="less">
@import '../../styles/mescroll.min.css';
@import './style/app-manager.less';
</style>
