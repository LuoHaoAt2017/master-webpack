<template>
    <div class="select-panel" v-if="show" :style="{top:!isDing?'46px':'0'}">
        <div class="select-mask" v-show="show" @click.stop.prevent="cancel"></div>
        <div class="select-wrapper">
            <div class="select-title bd-bot">
                <div >{{display}}</div>
                <div v-if="!radio" class="select-search">
                    <input type="text" v-model="searchKey" @input="search"/>
                    <span class="icon-search2 h3yun_All search-o"></span>
                    <span class="icon-reset h3yun_All close-circle" @click="cancelSearch" v-show="searchKey.length>0"></span>
                </div>
            </div>
            <div ref="wrapper" class="list-wrapper select-content" :class="[radio?'no-search':'']">
                <div>
                    <ul v-show="searchKey.length==0">
                        <li class="select-item bd-bot" @click="selectAll">
                            <div class="item-wrapper ">
                                <div>全选</div>
                                <span class="h3yun_All check-circle" v-if="chkAll"></span>
                                <span class="h3yun_All circle-o" v-if="!chkAll"></span>
                            </div>
                        </li>
                        <li v-for="(item,index) in items" class="select-item" :class="[index==items.length-1?'':'bd-bot']" @click="toggle(item)">
                            <div class="item-wrapper ">
                                <div>{{item.Text}}</div>
                                <span class="h3yun_All check-circle" v-if="item.Active"></span>
                                <span class="h3yun_All circle-o" v-if="!item.Active"></span>
                            </div>
                        </li>
                    </ul>
                    <ul v-show="searchKey.length>0">
                        <li v-for="(item,index) in selectedItems" class="select-item" :class="[index==items.length-1?'':'bd-bot']" @click="toggle(item)">
                            <div class="item-wrapper ">
                                <div>{{item.Text}}</div>
                                <span class="h3yun_All check-circle" v-if="item.Active"></span>
                                <span class="h3yun_All circle-o" v-if="!item.Active"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
         <div class="footer bd-top">
            <div @click="reset">清空</div>
            <div @click="cancel">取消</div>
            <div @click="ok">确定</div>
        </div>
    </div>
</template>
<script>
// zyq;
import BScroll from 'better-scroll';
import { isDingtalk, getDeviceRatio } from '../../config/common';
import { GetSchemaPropertyValues } from '../../service/get-data';
// 获取当前缩放比
const DEVICE_RATIO = getDeviceRatio();

// 下拉配置
const DOWN_CONFIG = {
  threshold: 80 * DEVICE_RATIO,
  stop: 40 * DEVICE_RATIO,
};
// 上拉配置
const UP_CONFIG = {
  threshold: -80 * DEVICE_RATIO,
};

export default {
  name: 'selectpanel',
  props: ['display', 'items', 'value', 'radio', 'schemaCode', 'field', 'filter', 'datafield'],
  data() {
    return {
      show: false,
      isDing: false,
      chkAll: false,
      searchKey: '',
      selectedItems: [], // 过滤筛选
      pageIndex: 0,
      pageSize: 20,
      scopeType: 4,
      sheetData: null,
      scroller: null,
      hasMore: false,
      isRefreshing: false,
      isLoadingMore: false,
    };
  },
  created() {
    this.isDing = isDingtalk;
    if (this.value) {
      this.show = true;
      this.init();
    }
  },
  mounted() {},
  methods: {
    init() {
      this.searchKey = '';
      this.selectedItems = [];
      // 如果是关联单选，先获取关联数据
      if (this.schemaCode) {
        this.requireSchemaPropertyValues(
          this.schemaCode,
          this.searchKey,
          this.datafield,
          0,
          20,
          this.filter,
          this.scopeType,
          this.schemaCode,
          this.sheetData,
        );
      } else if (this.value) {
        this.setValue(this.value);
      }
      this.initIsCheckAll();
    },
    initScroll() {
      this.scroller = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: 3,
        pullDownRefresh: DOWN_CONFIG,
        pullUpLoad: UP_CONFIG,
      });
      // 下拉事件
      this.scroller.on('pullingDown', () => {
        this.refresh();
      });

      // 上拉事件
      this.scroller.on('pullingUp', () => {
        this.loadMore();
      });
    },
    toggle(item) {
      if (item.Active) {
        this.chkAll = false;
        this.$set(item, 'Active', false);
      } else {
        this.$set(item, 'Active', true);
      }
      if (this.searchKey) {
        for (const it of this.items) {
          if (it.Value === item.Value) {
            this.$set(it, 'Active', item.Active);
            break;
          }
        }
      }
      this.initIsCheckAll();
      
    },
    //初始化全选checkbox的状态
    initIsCheckAll(){
        // 判断是否已经全部勾选上了
      let hasUnChk = false;
      for (const it of this.items) {
        if (!it.Active) {
          hasUnChk = true;
        }
      }
      if (!hasUnChk) {
        this.chkAll = true;
      } else {
        this.chkAll = false;
      }
    },
    selectAll() {
      if (this.chkAll) {
        this.chkAll = false;
        for (const item of this.items) {
          this.$set(item, 'Active', false);
        }
      } else {
        this.chkAll = true;
        for (const item of this.items) {
          this.$set(item, 'Active', true);
        }
      }
    },
    ok() {
      const res = [];
      for (const item of this.items) {
        if (item.Active) {
          res.push(item);
        }
      }
      // 判断筛选结果
      if (this.selectedItems.length > 0) {
        for (const item of this.selectedItems) {
          if (item.Active) {
            // 判断是否已经选择过
            let flag = false;
            for (const tmp of res) {
              if (tmp.Value === item.Value) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              res.push(item);
            }
          }
        }
      }
      this.show = false;
      this.$emit('on-confirm', res);
    },
    cancel() {
      this.show = false;
      this.$emit('on-cancel');
    },
    reset() {
      this.chkAll = false;
      for (const item of this.items) {
        this.$set(item, 'Active', false);
      }
    },
    search() {
      this.selectedItems = [];
      if (this.searchKey) {
        if (!this.schemaCode) {
          for (const item of this.items) {
            if (item.Text.indexOf(this.searchKey) > -1) {
              this.selectedItems.push(item);
            }
          }
        } else {
          this.requireSchemaPropertyValues(
            this.schemaCode,
            this.searchKey,
            this.datafield,
            0,
            20,
            this.filter,
            this.scopeType,
            this.schemaCode,
            this.sheetData,
          );
        }
      }
    },
    cancelSearch() {
      this.searchKey = '';
      this.selectedItems = [];
    },
    setValue(val) {
      // 还原默认值
      for (const select of val) {
        for (const item of this.items) {
          if (item.Value === select.Value || item.Value === select) {
            this.$set(item, 'Active', true);
            break;
          }
        }
      }
    },
    async requireSchemaPropertyValues(
      SchemaCode,
      SearchKey,
      PropertyName,
      FromRowNum,
      ToRowNum,
      AssociationFilter,
      scopeType,
      SheetCode,
      SheetData,
    ) {
      const res = await GetSchemaPropertyValues(
        SchemaCode,
        SearchKey,
        PropertyName,
        FromRowNum,
        ToRowNum,
        AssociationFilter,
        scopeType,
        SheetCode,
        SheetData,
      );
      if (res.Successful) {
        if (this.isRefreshing) {
          this.isRefreshing = false;
          this.scroller.finishPullDown();
        } else if (this.isLoadingMore) {
          this.isLoadingMore = false;
          this.scroller.finishPullUp();
        }
        const tmp = [];
        for (const item of res.ReturnData.list) {
          tmp.push({ Text: item, Value: item });
        }

        if (this.pageIndex === 0) {
          if (this.searchKey) {
            this.selectedItems = [].concat(tmp);
          } else {
            this.items = [].concat(tmp);
            this.setValue(this.value);
          }
        } else if (this.searchKey) {
          this.selectedItems = this.selectedItems.concat(tmp);
        } else {
          this.items = this.items.concat(tmp);
          this.setValue(this.value);
        }
        if (res.ReturnData.list.length > this.pageSize) {
          this.hasMore = true;
        }
      }
    },
    refresh() {
      if (this.schemaCode) {
        this.isRefreshing = true;
        this.requireSchemaPropertyValues(
          this.schemaCode,
          this.searchKey,
          this.datafield,
          0,
          20,
          this.filter,
          this.scopeType,
          this.schemaCode,
          this.sheetData,
        );
      }
    },
    loadMore() {
      if (this.schemaCode) {
        if (this.hasMore) {
          this.isLoadingMore = true;
          this.hasMore = false;
          this.requireSchemaPropertyValues(
            this.schemaCode,
            this.searchKey,
            this.datafield,
            this.pageIndex * this.pageSize,
            (this.pageIndex + 1) * this.pageSize,
            this.filter,
            this.scopeType,
            this.schemaCode,
            this.sheetData,
          );
        }
      }
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.init();
      }
    },
    items() {
      this.$nextTick(() => {
        if (this.scroller) {
          this.scroller.refresh();
        } else {
          this.initScroll();
        }
      });
    },
  },
};
</script>
<style lang="less" >
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.select-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 123;
  .select-mask {
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background-color: #181818;
    z-index: 124;
  }
  .select-wrapper {
    z-index: 126;
    .px2rem(width,618);
    animation: filter-modal 0.3 ease-in;
    position: absolute;
    top: 0;
    right: 0;
    .px2rem(bottom,98);
    // .px2rem(padding,24);
    overflow-y: auto;
    background-color: #fff;
    .select-title {
      .px2rem(padding,24);
      div:first-child {
        .px2rem(height,40);
        .px2rem(font-size,28);
        color: #333;
      }
      div.select-search {
        position: relative;
        width: 100%;
        .px2rem(height,66);
        background-color: #f2f3f5;
        .px2rem(margin-top,24);
        .px2rem(border-radius,2);
        input {
          background: transparent;
          .px2rem(width,570);
          .px2rem(height,66);
          .px2rem(padding-left,76);
          color: #000;
        }
        span {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          &.icon-search2 {
            .px2rem(left,24);
            .px2rem(font-size,28);
          }
          &.icon-reset {
            .px2rem(right,24);
            .px2rem(font-size,24);
          }
        }
      }
    }
    .select-content {
      position: absolute;
      .px2rem(top,178);
      bottom: 0;
      width: 100%;
      overflow-x: hidden;

      ul {
        .px2rem(padding-left,24);
        .px2rem(padding-right,24);
        li.select-item {
          .px2rem(padding-top,24);
          .px2rem(padding-bottom,24);
          div.item-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .px2rem(height,40);
            .check-circle{
              color: #5685bb;
            }
            .circle-o{
              color: #888;
            }
            div {
              flex-basis: 90%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: #333;
              .px2rem(font-size,28);
            }
            span {
              flex-shrink: 0;
              flex-basis: 10%;
              .px2rem(font-size,34);
            }
          }
        }
      }
    }
    .no-search {
      .px2rem(top,84);
    }
  }
  .footer {
    z-index: 127;
    position: absolute;
    bottom: 0;
    right: 0;
    .px2rem(height,98);
    .px2rem(width,618);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    div {
      flex-basis: 33%;
      .px2rem(height,44);
      .px2rem(line-height,44);
      .px2rem(font-size,32);
      color: #467db9;
      border-right: 1px solid #d9d9d9;
      text-align: center;
      &:last-child {
        border-right: 0;
      }
    }
  }
}
</style>
