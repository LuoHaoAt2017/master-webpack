<template>
    <div id="group-asso">
       <div class="sortMenu clearfix" ref="hwrapper">
        <ul class="sortMenu-ul" ref="hwrapperGroup" >
          <li class="cell" @click="toggleItem(item)" v-for="item in sortMenu" :key="item.schemaCode" :class="{active:item.selected}">
            <a href="javascript:;" >{{item.displayName}}</a>
            <a class="item-count" v-if="item.schemaCode!=='Function'">{{item.count}}</a>
          </li>
        </ul>

      </div>
      <div class="lists" v-show="!isFunction" :class="[$store.state.corpId?'isDing':'']">
        <div class="list-wrapper list-wrapper-hook" >
          <div :class="[displayMode==2?'timeline':'' ]" class="list-container" v-if="ItemDatas.length!=0">
            <!-- 顶部提示信息 -->
            <div class="top-tip refresh-hook" style="display:none;">
              <div style="display:flex;justify-content: center;">
                  <span class="brash-icon icon-arrow-down-thin"></span>
                  <span class="refresh-text">下拉可以刷新</span>
              </div>
            </div>
            <div class="brash-more is-browsered t-c dp-font22" ref="pullUpShow" style="display:none;">加载了10</div>
            <!-- 列表 -->
            <template v-if="displayMode!==2">
              <ul class="list-content list-content-hook">
                <li v-for="(Item,index) in ItemDatas" :key="Item.ObjectId" class="common-box selectitem list-item" :class="[ItemDatas && ItemDatas.length>0 && ItemDatas.length-1==index?'item-bottom bd-db':'bd-top']" @click="openListItem(Item)" >
                  <div class="item-container">
                    <div class="item-content" style="flex-grow:2;">
                        <div class="item-product" >
                            <div>
                              <h2 >
                                <span v-if="!Item.Name.IsCustom" class="item-title-top">
                                    {{Item.Name}}
                                </span>
                                <span v-if="Item.Name.IsCustom" class="item-title-top">
                                    {{Item.Name.Value}}
                                </span>
                                <div class="item-status" v-if="Item.Status>-1" :class="[statuArr[Item.Status] && statuArr[Item.Status].bg]">{{statuArr[Item.Status] && statuArr[Item.Status].text}}</div>
                              </h2>

                              <pre>{{Item.Summary}}</pre>
                            </div>

                        </div>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
            <template v-else>
              <ul class="list-content list-content-hook">
                <template v-for="group in groupDates" >
                    <li class="timeline-item">
                      <div class="timeline-item-head-group">
                        <i class="icon-xuanzhong"></i>
                      </div>
                      <div class="timeline-item-tail"></div>
                      <div class="timeline-item-content">
                        <p class="item-group">{{group.key}}</p>
                      </div>
                    </li>
                    <li class="timeline-item" v-for="Item in group.value" :key="Item.ObjectId" @click="openListItem(Item)">
                      <div class="timeline-item-color timeline-item-head">

                      </div>
                      <div class="timeline-item-tail" style="display:block;"></div>
                      <div class="timeline-item-content">
                        <div class="item-wrapper">
                          <div class="time">
                            <p class="item-time" v-if="axis && Item[axis] && timeLineAxisDisplayFormat==='yyyy-mm-dd hh:ii'">{{getFormatDateStr(Item[axis])}}</p>
                            <div class="item-status" v-if="Item.Status>-1" :class="[statuArr[Item.Status] && statuArr[Item.Status].bg]">{{statuArr[Item.Status] && statuArr[Item.Status].text}}</div>
                          </div>
                          <div class="item-product" >
                              <div>
                                <h2 >
                                  <span v-if="!Item.Name.IsCustom" class="item-title-top">
                                      {{Item.Name}}
                                  </span>
                                  <span v-if="Item.Name.IsCustom" class="item-title-top">
                                      {{Item.Name.Value}}
                                  </span>
                                </h2>
                                <pre>{{Item.Summary}}</pre>
                              </div>
                          </div>
                        </div>

                      </div>

                    </li>
                  </template>
              </ul>
            </template>
            <div class="bottom-tip  loading-hook" style="display:none;">
              <div style="display:flex;justify-content: center;">
                  <div class="loading" >
                    <span class="icon-loading"></span>
                  </div>
                  <span class="loading-text">上拉加载更多</span>
              </div>
            </div>
            <div class="no-moredata" v-show="!HasMore && ItemDatas.length>0">没有更多数据了</div>
          </div>
          <div class="empty-sheet-container" v-if="ItemDatas.length==0 && ready">
              <img :src="emptyImgUrl" />
              <div class="message">
                  暂无数据
              </div>
          </div>
        </div>
      </div>
      <div  v-show="isFunction">
        <card v-if="associations && associations.length>0">
            <div slot="content">
                <div class="row">
                    <div class="app"  v-for="(app,index) in associationAdds" v-if="app.EnableAdd"  :key="app.SchemaCode" @click="addForm(app)">
                        <div class="app-icon" :style="{background:colors[index%5]}">
                            <span :class="app.IconCss"></span>
                        </div>
                        <div class="app-name">
                            {{app.DisplayName}}
                        </div>
                    </div>
                </div>

            </div>
        </card>
        <div class="bottom-buttons">
            <div v-if="enableSns" @click="goSnsList()"><span class="icon-xinxi"></span>评论{{snsCount}}</div>
            <div :class="[enableSns?'':'full-width']" @click="share()"><span class="icon-zhuanfa"></span>二维码</div>
        </div>
      </div>
      <div class='sheet-plus' @click="fastAdd()" v-if="enableFastAdd">
          <i class="h3yun_All close"></i>
      </div>
    </div>

</template>
<script>
// import Vue from 'vue';
import BScroll from 'better-scroll';
import { ListViewDisplayMode } from '../../../src/config/common';
// import { ListViewDisplayMode, getDeviceRatio } from '../../../src/config/common';
import card from '../../../src/components/home/card.vue';
import { imgBaseUrl } from '../../../src/config/env';
import { loadAssoBos, countSNSPostByBizObjectId } from '../../service/get-data';

/* 获取当前缩放比 */
// const DEVICE_RATIO = getDeviceRatio();

/* 下拉配置 */
// const DOWN_CONFIG = {
//   threshold: 80 * DEVICE_RATIO,
//   stop: 40 * DEVICE_RATIO,
// };
/* 上拉配置 */
// const UP_CONFIG = {
//   threshold: -80 * DEVICE_RATIO,
// };
export default {
  components: {
    card,
  },
  props: [
    'enableSns',
    'schemacode',
    'bizobjectId',
    'associations',
    'associationAdds',
    'appcode',
    'displayName',
    'name',
    'summary',
  ],
  data() {
    return {
      isFunction: false,
      snsCount: 0,
      pageIndex: 0,
      sortMenu: [],
      ItemDatas: [],
      HasMore: false,
      CurAsso: null,
      CachedItems: {}, // 缓存已经获取过的数据，切换时判断是否已经存在缓存数据
      isMask: false,
      SchemaCode: '',
      MappingProperty: '',
      colors: ['#00A2FF', '#956FEA', '#5CD5FC', '#50A6FF', '#4da9eb'],
      displayMode: ListViewDisplayMode.List,
      groupDates: [], // 时间轴模式分组
      timeLineAxisDisplayFormat: 'yyyy-mm-dd hh:ii',
      axis: null,
      statuArr: [
        {
          text: '草稿',
          bg: 'bg-org',
        },
        {
          text: '生效',
          bg: 'bg-grr',
        },
        {
          text: '进行中',
          bg: 'bg-blue',
        },
        {
          text: '作废',
          bg: 'bg-greay',
        },
      ],
      listWrapper: null,
      listContent: null,
      topTip: null,
      bottomTip: null,
      loading: null,
      scroll: null,
      hScroll: null,
      emptyImgUrl: '',
      ready: false,
      emptyKey: '',
      isRefreshing: false,
      isLoadingMore: false,
      isDataUpdated: false,
      isFormUpdated: false,
    };
  },
  created() {
    this.sortMenu.push({
      schemaCode: 'Function',
      displayName: '功能',
      selected: true,
      count: 0,
    });

    if (this.enableSns) {
      this.countSNSByBizObjectId(this.bizobjectId);
    }
    if (this.associations && this.associations.length > 0) {
      for (const association of this.associations) {
        this.sortMenu.push({
          displayName: association.DisplayName,
          selected: false,
          count: association.Count,
          schemaCode: association.SchemaCode,
          mappingProperty: association.MappingProperty,
        });
      }
    }
    this.sortMenu[0].selected = true;
    this.CurAsso = this.sortMenu[0];
    this.isFunction = true;
    const that = this;
    this.$root.eventHub.$on('updateDataCount', (data) => {
      that.updateDataCount(data);
    });
    this.$root.eventHub.$on('sns-updated', (data) => {
      that.snsCount = data;
    });
    this.$root.eventHub.$on('form-updated', () => {
      if (this.isFormUpdated) {
        return;
      }
      this.isFormUpdated = true;
      if (that.isFunction) {
        if (this.isDataUpdated) {
          return;
        }
        this.isDataUpdated = true;
        that.$root.eventHub.$emit('data-updated');
      } else {
        that.doRefresh();
      }
    });
  },
  mounted() {
    this.setHWrapperWidth();
    this.$nextTick(() => {
      this.hScroll = new BScroll(this.$refs.hwrapper, {
        scrollY: false,
        scrollX: true,
        click: true,
        probeType: 3,
      });
    });
    this.emptyImgUrl = `${imgBaseUrl}/img/empty.png`;
  },
  deactivated() {
    this.isDataUpdated = false;
    this.isFormUpdated = false;
  },
  methods: {
    setHWrapperWidth() {
      const children = this.$refs.hwrapperGroup.children;
      let width = 0;
      // slider 可见宽度
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        // 设置每个子元素的样式及高度
        const a = window.getComputedStyle(child, null);
        const marginLeft = parseInt(a.marginLeft, 10);
        const marginRight = parseInt(a.marginRight, 10);
        width += child.clientWidth + marginLeft + marginRight;
      }
      this.$refs.hwrapperGroup.style.width = `${width}px`;
    },
    justifyHeight() {},
    initScroll() {
      const that = this;
      // 高度修正-如果内容的高度小于等于外面容器的高度，则设置最小高度

      this.scroll = new BScroll(this.listWrapper, {
        probeType: 3,
        click: true,
        scrollbar: true,
      });

      this.scroll.on('scroll', function scroll(position) {
        if (!$('.brash-more').is(':hidden')) {
          return;
        }
        if (that.isRefreshing) {
          this.ready = false;
          return;
        }
        if (position.y >= 10 && position.y < 30) {
          $(that.topTip).fadeIn(300);
          $(that.topTip)
            .find('.brash-icon')
            .css({ transform: 'rotate(0)' });
        } else if (position.y >= 30) {
          $(that.topTip)
            .find('.refresh-text')
            .html('松开立即刷新');
          $(that.topTip)
            .find('.brash-icon')
            .css({ transform: 'rotate(180deg)' });
        }
      });
      this.scroll.on('touchEnd', function touchEnd(position) {
        // console.log(position.y)
        if (position.y > 30) {
          setTimeout(() => {
            /*
            * 这里发送ajax刷新数据
            * 刷新后,后台只返回第1页的数据,无论用户是否已经上拉加载了更多
            */
            that.isRefreshing = true;
            $(that.topTip)
              .find('.refresh-text')
              .html('刷新中...');
            that.doRefresh();
          }, 300);
        } else if (position.y < this.maxScrollY - 30) {
          if (!that.HasMore) {
            return;
          }
          $(that.bottomTip).fadeIn(300);

          $(that.bottomTip)
            .find('.loading-text')
            .html('加载中...');
          setTimeout(() => {
            $(that.bottomTip)
              .find('.loading-text')
              .html('查看更多'); // 恢复文本值
            // 向列表添加数据
            that.isLoadingMore = true;
            that.loadMoreData();
          }, 300);
        }
      });
      this.scroll.on('scrollEnd', (position) => {
        // console.log('滚动停止时y坐标' + position.y);
        if (position.y < 30 && position.y >= 0) {
          $(that.topTip).hide();
          that.scroll.scrollTo(0, 0, 300);
          $(that.topTip)
            .find('.refresh-text')
            .html('下拉可以刷新');
        }
      });
    },
    getFormatTime(val) {
      const seconds = Number(val.match(/\d+/g)[0]);
      return new Date(seconds).Format('yyyy/MM/dd hh:mm:ss');
    },
    async countSNSByBizObjectId(bizobjectId) {
      const data = await countSNSPostByBizObjectId(bizobjectId);
      if (data.Successful) {
        this.snsCount = data.ReturnData.Count;
      }
    },
    async getAssoData(assos, bizObjectId, pageIndex) {
      const asso = assos;
      let data = await loadAssoBos(asso.schemaCode, bizObjectId, asso.mappingProperty, pageIndex);
      if (data.Successful) {
        data = data.ReturnData.Data;
        if (this.isRefreshing) {
          this.isRefreshing = false;

          $('.top-tip').fadeOut(300);
          $('.brash-more')
            .show()
            .text(`更新了${data.Results.length}条数据`);
          $('.brash-more').slideUp(1300);
        }
        if (this.isLoadingMore) {
          this.isLoadingMore = false;
          $(this.bottomTip).fadeOut(300);
        }
        this.displayMode = data.DisplayMode;
        this.axis = data.Axis;
        this.timeLineAxisDisplayFormat = data.TimeLineAxisDisplayFormat
          ? data.TimeLineAxisDisplayFormat
          : 'yyyy-mm-dd hh:ii';

        this.ItemDatas = this.ItemDatas.concat(data.Results);
        this.ready = true;
        asso.count = data.TotalCount;
        if (this.ItemDatas.length < asso.count) {
          this.HasMore = true;
        } else {
          this.HasMore = false;
        }
        if (this.displayMode === 2) {
          this.formatItems(data.Results);
        }
        this.$nextTick(() => {
          this.listWrapper = document.querySelector('.list-wrapper-hook');
          this.listContent = document.querySelector('.list-content-hook');
          this.topTip = document.querySelector('.top-tip');
          this.bottomTip = document.querySelector('.bottom-tip');
          this.loading = document.querySelector('.loading-hook .loading');
          // 计算高度
          const height = $(this.listWrapper).height();
          if (document.querySelector('.list-container')) {
            document.querySelector('.list-container').style.minHeight = `${height + 50}px`;
          }
          if (!this.scroll) {
            this.initScroll();
          } else {
            // this.scroll.refresh();
            this.scroll.destroy();
            this.initScroll();
          }
        });
      }
    },
    loadAssoData(asso) {
      if (this.CachedItems[asso.schemaCode]) {
        this.ItemDatas = this.CachedItems[asso.schemaCode];
      } else {
        this.getAssoData(asso, this.bizobjectId, this.pageIndex);
      }
    },
    formatItems(items) {
      if (items && items.length > 0) {
        for (const item of items) {
          // 在列表模式后台直接返回
          // 在关联列表时间轴模式，后台返回数据项中没有直接返回Axis的值，统一用AxisValue返回
          const axisValue = item.AxisValue;

          if (!axisValue) {
            let emptyObj = this.getKeyObject(this.groupDates, this.emptyKey);
            if (!emptyObj) {
              emptyObj = { key: this.emptyKey, value: [] };
              this.groupDates.push(emptyObj);
            }
            emptyObj.value.push(item);
          } else {
            const dateStr = new Date(axisValue.replace(/-/g, '/')).Format('yyyy-MM-dd');
            let dateObj = this.getKeyObject(this.groupDates, dateStr);
            if (!dateObj) {
              dateObj = { key: dateStr, value: [] };
              this.groupDates.push(dateObj);
            }
            dateObj.value.push(item);
          }
        }
      }
    },
    containsKey(arr, key) {
      for (const tmp of arr) {
        if (tmp.key === key) {
          return true;
        }
      }
      return false;
    },
    getKeyObject(arr, key) {
      for (const tmp of arr) {
        if (tmp.key === key) {
          return tmp;
        }
      }
      return null;
    },
    getFormatDateStr(dateStr) {
      return new Date(dateStr.replace(/-/g, '/')).Format('hh:mm');
    },
    // 下拉刷新任务/动态
    refreshAssoDatas(asso) {
      this.HasMore = false;
      this.pageIndex = 0;
      this.ItemDatas = [];
      this.groupDates = [];
      // this.CachedItems[asso.schemaCode]=[];
      this.getAssoData(asso, this.bizobjectId, this.pageIndex);
    },
    toggleItem(items) {
      const item = items;
      this.ready = false;
      if (item.selected) {
        return;
      }
      this.HasMore = false;
      for (const it of this.sortMenu) {
        it.selected = false;
      }
      item.selected = true;
      this.CurAsso = item;
      if (item.schemaCode === 'Function') {
        this.isFunction = true;
      } else {
        this.isFunction = false;
        if ((this.CurAsso && item.schemaCode) !== this.schemaCode) {
          this.doRefresh();
        }
      }
    },
    // 打开关联表单
    openListItem(item) {
      // 判断是否存在表单首页
      let asso = null;
      for (const sheet of this.associations) {
        if (sheet.SchemaCode === item.SchemaCode) {
          asso = sheet;
          break;
        }
      }
      if (asso && asso.EnableSheetHome && item.Status === 1) {
        this.$router.push({
          path: `/sheet-home/${item.ObjectId}/${item.SchemaCode}`,
          // name: "sheethome",
          params: {
            schemaCode: item.SchemaCode,
            bizObjectId: item.ObjectId,
            displayName: asso.DisplayName,
          },
        });
      } else {
        this.$router.push({
          name: 'formPage',
          params: { schemaCode: item.SchemaCode, bizObjectId: item.ObjectId },
          query: { schemaCode: item.SchemaCode, bizObjectId: item.ObjectId },
        });
      }
    },
    addForm(app) {
      this.$router.push({
        name: 'formPage',
        params: {
          schemaCode: app.SchemaCode,
          LinkBizObjectId: this.bizobjectId,
          MappingDataField: app.MappingProperty,
          showList: false,
          BOName: this.name,
        },
      });
    },
    fastAdd() {
      if (this.CurAsso) {
        this.$router.push({
          name: 'formPage',
          params: {
            schemaCode: this.CurAsso.schemaCode,
            LinkBizObjectId: this.bizobjectId,
            MappingDataField: this.CurAsso.mappingProperty,
            showList: false,
            BOName: this.name,
          },
        });
      }
    },
    // 进入评论列表
    goSnsList() {
      this.$router.push({
        name: 'snslist',
        params: {
          bizObjectId: this.bizobjectId,
          schemaCode: this.schemacode,
        },
      });
    },
    // 进入分享页面
    share() {
      this.$router.push({
        name: 'share',
        params: {
          displayName: this.name,
          summary: this.summary,
          bizObjectId: this.bizobjectId,
          schemaCode: this.schemacode,
          appCode: this.appcode,
          action: 'QrCode',
        },
      });
    },

    doRefresh() {
      this.refreshAssoDatas(this.CurAsso);
    },
    loadMoreData() {
      this.HasMore = false;
      if (this.ItemDatas.length > 0 && this.ItemDatas.length < this.CurAsso.count) {
        this.pageIndex = Math.ceil(this.ItemDatas.length / 10);
        this.getAssoData(this.CurAsso, this.bizobjectId, this.pageIndex);
      }
    },
    updateDataCount(data) {
      for (const asso of data) {
        for (const menu of this.sortMenu) {
          if (menu.schemaCode === asso.SchemaCode) {
            this.$set(menu, 'count', asso.Count);
          }
        }
      }
    },
  },
  computed: {
    enableFastAdd() {
      if (this.CurAsso) {
        if (this.CurAsso.schemaCode === 'Function') {
          return false;
        }
        for (const item of this.associationAdds) {
          if (item.SchemaCode === this.CurAsso.schemaCode) {
            return true;
          }
        }
      }
      return false;
    },
  },
  watch: {
    ItemDatas() {
      this.$nextTick(() => {
        if (this.scroll) {
          this.scroll.refresh();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

@-webkit-keyframes loading {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
.loading {
  transform: rotate(360deg);
  animation: loading 1s linear infinite;
}
@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.lists {
  position: absolute;
  .px2rem(top,338); //338
  bottom: 0;
  width: 100%;
  .list-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    div.top-tip,
    div.bottom-tip {
      text-align: center;
      height: 35px;
      line-height: 35px;
    }
  }
}
.isDing {
  .px2rem(top,338);
}
.card {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-top: 0;
  border-radius: 0;
}
.bg-blue {
  background-color: #37abfd;
}
.bg-grr {
  background-color: #00ce98;
}
.bg-org {
  background-color: #f5a623;
}
.bg-greay {
  background-color: #d6d6d6;
}
.item-status {
  display: inline-block;
  .px2rem(width, 82);
  .px2rem(height, 30);
  .px2rem(line-height, 24);
  .px2rem(margin-left, 12);
  text-align: center;
  color: #fff;
  .px2rem(font-size, 20);
  .px2rem(border-radius, 6);
}
div.bottom-buttons {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  div {
    flex-basis: 50%;
    text-align: center;
    .px2rem(height,76);
    .px2rem(line-height,76);
    color: #6f6f6f;
    .px2rem(font-size,28);
    background: #fdfdfd;
    opacity: 0.8;
    span {
      .px2rem(margin-right,14);
    }
  }
  div.full-width {
    flex-basis: 100%;
  }
}
.row {
  display: flex;
  .col.align-center {
    text-align: center;
  }
  .col.align-left {
    text-align: left;
  }
}
/* 分类菜单*/
.sortMenu {
  width: 100%;
  background-color: #fff;
  overflow-x: scroll;
  -webkit-overflow-x: scroll;
  border-bottom: 1px solid #EEEEEE;
}
.sortMenu::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: #fff;
}
.sortMenu-ul {
  white-space: nowrap;
  z-index: 200;
  li {
    display: inline-block;
    &.active {
      border-bottom: 3px solid #108ee9;
    }
  }
}

.sortMenu .cell {
  // display: inline-block;
  // display: flex;
  // flex-direction: column;
  font-size: 12px;
  .px2rem(margin-left,37);
  .px2rem(margin-right,37);
  .px2rem(height,92);
  .px2rem(line-height,92);
  text-align: center;
  position: relative;
  text-overflow: ellipsis;
  // .px2rem(padding-top,12);
  // .px2rem(padding-bottom,12);
  // word-break: keep-all;
  // &:first-child {
  //   line-height: 40px;
  // }

  a {
    text-decoration: none;
    color: #333;
    font-size: 14px;
  }
  .item-count {
    color: skyblue;
    // margin-left: .2rem;
  }
}
.sortMenu .cell.special a {
  color: #333;
  font-size: 14px;
}
.sortMenu .cell.special:before {
  content: '';
  height: 2px;
  width: 100%;
  background: #ff474c;
  position: absolute;
  bottom: 0px;
}
.sortMenu .all {
  right: 0;
  top: 0;
  height: 35px;
  width: 35px;
  position: absolute;
  background: #fff;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sortMenu .all:before {
  content: '';
  height: 25px;
  width: 1px;
  position: absolute;
  box-shadow: 1px 0px 1px #e0e0e0;
  left: 0px;
}
.sortMenu .all img {
  display: block;
  width: 16px;
}
.sortMenu .pull-down {
  position: absolute;
  top: 40px;
  height: auto;
  width: 100%;
  background: #fff;
  z-index: 1;
  border-top: 1px solid #f2f2f2;
}

.module-container {
  position: absolute;
  bottom: 80px;
  flex-wrap: wrap;
  display: flex;
  width: 100%;
}
.module {
  width: 33.333333333333333%;
  list-style: none;
  text-align: center;
}
.sheet-icon {
  width: 38px;
  height: 38px;
  background: #ef3eda;
  margin: 0 auto;
  border-radius: 10px;
}
// 解决无法上拉
// .lists{
//   width: 100%;
//   height: 100%;
//   position: absolute;
// }
div.approve-contanier {
  // min-height: 40px;
  // margin: 0 12px;
  padding: 5px;
  word-wrap: break-word;
  width: auto;
}
.sheetsnsitem {
  background-color: #fff;
  margin-top: 12px;
  padding: 12px;
  border-radius: 5px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  .snsitem-title {
    display: flex;
    .snsitem-avatar {
      flex-basis: 15%;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
    }
  }
  .sns-text {
    padding: 5px 15px;
  }

  .col-50 {
    flex-basis: 50%;
  }
  .col-10 {
    flex-basis: 10%;
  }
  .col-90 {
    flex-basis: 90%;
  }
  .like-user {
    color: #108ee9;
  }
  .com-content {
    width: 100%;
    position: relative;
    // padding: 12px 12px 2px 12px;
    border-radius: 4px;
    background-color: #f5f5f5;
    .comment-row {
      display: flex;
      padding: 5px 0;
      .comment-avatar {
        flex-basis: 15%;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
      }
      .comment-title,
      .comment-date {
        height: 19px;
        line-height: 19px;
        font-size: 14px;
      }
      .comment-date {
        font-size: 12px;
      }
    }
  }
}
.new-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #108ee9;
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 38px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
}

.list-item {
  padding: 16px;
  background: #fff;
  h2 {
    display: flex;
    align-items: center;
    margin: 0 0 2px 0;
    font-size: 16px;
    min-height: 20px;
    line-height: 25px;
    span {
      .px2rem(font-size,32);
      color: #333;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 80%;
    }
  }
  pre {
    font-size: 14px;
    color: #929292;
  }
}

.sheet-plus {
  // position: fixed;
  // .px2rem(width,96);
  // .px2rem(height,96);
  // .px2rem(bottom,126);
  // .px2rem(right,44);
  // background: #108ee9;
  // z-index: 99;
  // border-radius: 50%;
  // box-shadow: 0px 5px 10px rgba(56, 173, 255, 0.5);
  // .px2rem(line-height,96);
  // color: #fff;
  // text-align: center;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  .px2rem(width, 96);
  .px2rem(height, 96);
  background-color: #108ee9;
  position: fixed;
  .px2rem(right, 44);
  .px2rem(bottom, 146);
  border-radius: 50%;
  z-index: 2;
  transition: all 1s;
  box-shadow: 0 0 0.8rem rgba(16, 142, 233, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
  i {
    // .px2rem(font-size,38);

    color: white;
    font-weight: 800;
  }
}

div.timeline {
  .px2rem(padding-left,49);
  .px2rem(padding-right,24);
  li.timeline-item {
    position: relative;
    div.timeline-item-head,
    div.timeline-item-head-first {
      position: absolute;
      content: '';
      z-index: 99;
      border-radius: 99px;
    }
    div.timeline-item-head-group {
      position: absolute;
      top: 17px;
    }
    div.timeline-item-head {
      width: 10px;
      height: 10px;
      left: 1px;
      top: 20px;
    }
    div.timeline-item-tail {
      position: absolute;
      content: '';
      height: 100%;
      width: 1px;
      left: 6px;
      top: 5px;
    }
    div.timeline-item-tail,
    div.timeline-item-color {
      background-color: #108ee9 !important;
    }
    div.timeline-item-content {
      .px2rem(padding-top,15);
      .px2rem(margin-left,60);
      .px2rem(padding-right,34);
      .px2rem(padding-bottom,15);
      .px2rem(border-radius,8);
      p.item-group {
        .px2rem(height,70);
        .px2rem(line-height,70);
      }
      div.item-wrapper {
        position: relative;
        .px2rem(padding-left,28);
        .px2rem(padding-bottom,54);
        .px2rem(padding-right,20);
        .px2rem(padding-top,22);
        box-shadow: 0 0 5px #d9d9d9;
        &:before {
          position: absolute;
          left: -11px;
          top: 10px;
          z-index: 8888;
          content: '';
          border-style: solid;
          border-width: 6px;
          border-color: transparent #fff transparent transparent;
        }
        &:after {
          position: absolute;
          left: -12px;
          top: 10px;
          z-index: 8887;
          content: '';
          border-style: solid;
          border-width: 6px;
          border-color: transparent #d9d9d9 transparent transparent;
        }
        p.item-time {
          .px2rem(font-size,28);
          color: #797979;
        }
        .item-title-top {
          .px2rem(font-size,32);
          color: #333;
        }
        pre {
          .px2rem(font-size,28);
          color: #717171;
          .px2rem(margin-top,8);
          overflow: hidden;
        }
      }
    }
  }
}
div.list-container {
  .px2rem(padding-bottom,160);
}
.empty-sheet-container {
  width: 100%;
  text-align: center;
  .px2rem(padding-top,160);
  img {
    .px2rem(width,270);
    .px2rem(height,280);
  }
  div.message {
    .px2rem(margin-top,50);
    .px2rem(font-size,28);
    color: #999;
  }
}
.refresh-hook {
  height: 30px;
  line-height: 15px;
  color: #5e5e5e;
  .brash-icon {
    margin-right: 6px;
    transform-origin: center center;
    transition: all 0.3s;
    height: 16px;
    line-height: 16px;
    top: 10px;
    position: relative;
  }
}
.displayNone {
  display: none;
}
.brash-more {
  height: 40px;
  line-height: 40px;
  z-index: 1000;
  background-color: #32b0ff;
  top: 0;
  width: 100%;
  color: #fff;
  .brash-icon {
    left: 36%;
    top: 35%; /* transform: translateY(-50%); */
    transform-origin: center center;
    transition: all 0.3s;
    color: #9baabd;
    font-size: 0.4rem;
  }
  .icon-loading {
    left: 36%; // top: 50%;
    top: 35%;
    transform: translateY(-50%);
    transform-origin: center;
    color: #9baabd;
    animation: brashing 0.5s infinite;
  }
  @keyframes brashing {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
.no-moredata {
  position: absolute;
  left: 0;
  .px2rem(bottom,80);
  width: 100%;
  text-align: center;
  color: #999;
}
</style>
