<template>
  <div id="applySearch" :class="{'has-tp':!$store.state.corpId && !isFullStatu,'full-statu':isFullStatu}"
            style="position:relative !important;display:webkit-box;">
      <div :class="{'full-search':isFullStatu}" >
          <input class="search dp-font26 search-input"
                :class="{'full-input':isFullStatu,'t-c':!isFocus,'t-l':isFocus,'search-focus':isFocus}"
                type="text" :placeholder="placeHolder" @focus="focus" @blur="blur"
                v-model="value" @input="inputVal" @click="triggerFocus($event)">
          <div class="clears-box  p-a" v-if="value.length>0" :class="{'full-clears':!isFullStatu}" @click="clearValue">
              <span class="clear icon-reset"></span>
          </div>
      </div>
      <div v-if="isFullStatu" class="fulll-statu" @click="cancel">取消</div>
      <span class="icon search-o h3yun_All" :class="{'icon-full':isFullStatu,'icon-focus':isFocus && !isFullStatu}"></span>
  </div>
</template>
<script>
// zyq;
export default {
  name: 'applySearch',
  props: ['isFullStatu', 'placeHolder', 'events', 'pageId'],
  data() {
    return {
      //   placeHoleder: "搜索",
      isFocus: false,
      value: '',
      // isFullStatu: true
    };
  },
  created() {
    const searchType = this.$route.params.searchType;
    switch (searchType) {
      case 'flows':
        this.placeHoleder = '搜索标题';
        break;
      default:
        break;
    }
    // 初始化搜索框
    this.$root.eventHub.$on('clear-init', () => {
      this.value = '';
    });
  },
  methods: {
    focus() {
      this.isFocus = true;
      if (this.value.length === 0) {
        // 当聚焦值为空时显示搜索tips
        this.$root.eventHub.$emit(`show-tips${this.events}`);
      }
    },
    triggerFocus(e) {
      if (!this.isFocus) {
        $(e.target).focus();
      }
    },
    blur() {
      if (this.value.length === 0) {
        this.isFocus = false;
      }
    },
    cancel() {
      this.$root.eventHub.$emit('hide-search'); // 隐藏搜索界面
    },
    inputVal() {
      this.$root.eventHub.$emit(
        `search-flows-lists${this.events}${(this.pageId ? `-${this.pageId}` : '')}`,
        this.value,
      );
    },
    clearValue() {
      this.value = '';
      this.$root.eventHub.$emit('clear-search', this.value);
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../styles/common.less';
// .has-tp {
//   top: 40px !important;
// }
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
#applySearch {
  padding: 6px 0.3rem;
  background-color: #fff;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  border-bottom: 1px solid #d7d5d5;
  border-right: 1px solid #d7d5d5;
  .search {
    display: inline-block;
    width: 100%;
    .px2rem(height,60);
    .px2rem(line-height,40);
    outline: none;
    color: #999;
    background-color: #f0efef;
    -webkit-appearance: none;
    font-weight: normal;
  }
  .clears-box {
    right: 5px;
    top: 50%;
    margin-top: -8px;
    .clear::before {
      font-size: 0.4rem;
      color: #d8d8d8;
      color: #8e8e93 !important;
    }
  }
  .full-clears {
    right: 4%;
    transform: none;
    margin-top: -7px;
    line-height: 0;
  }

  .full-input {
    text-align: left !important;
    color: #666;
    padding: 3px 9%;
    width: 91%;
    box-sizing: border-box;
  }
  .search-focus {
    padding-left: 9%;
    width: 91%;
  }
  -webkit-input-placeholder {
    text-align: center;
    color: #999;
  }
  .fulll-statu {
    .px2rem(height,60);
    .px2rem(line-height,60);
    padding-left: 0.35rem;
    padding-right: 0.1rem;
    color: #108ee9;
    border: 1px solid transparent;
  }
  .icon {
    position: absolute;
    left: 41%;
    // left: 33%;
    top: 50%;
    transform: translateY(-48%);
    .px2rem(font-size,28);
  }
  .icon-full {
    left: 5%;
  }
  .icon-focus {
    left: 5%;
  }
  .icon::before {
    color: #999;
  }
  .full-search {
    -webkit-box-flex: 1;
    position: relative;
    .px2rem(height,60);
    width: 100%;
    outline: none;
    color: #999;
    background-color: #f0efef;
    border: 1px solid #d7dade;
    border-radius: 0.04rem;
  }
}
.search::-webkit-input {
  color: #999;
  font-size: 13px;
}
.full-statu {
  display: -webkit-box;
  position: relative !important;
}
</style>


