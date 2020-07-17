<template>
  <div class="header-search-wrapper">
    <div class="header-search">
      <i class="magnifier h3yun_All search-o fa box-icon"></i>
      <input
        class="search-input"
        type="search"
        v-model.trim="searchContent"
        ref="headerSearch"
        @click="onFocus"
        @blur="onBlur"
        @keyup.enter="doSearch"
        @keyup.esc="searchContent = ''"
        placeholder="搜索表单/报表"
      >
      <i
        :class="{active: searchContent.length > 0}"
        @click="searchContent = ''"
        class="clear h3yun_All close fa box-icon"
      ></i>
    </div>
    <span
      class="search-cancel"
      v-if="searchLayerShow && searchInputFocus"
      @click="doSearch"
    >搜索</span>
    <span
      class="search-cancel"
      v-if="searchLayerShow && !searchInputFocus"
      @click="closeSeachLayer"
    >取消</span>
    <transition
      name="search-layer"
      mode="out-in"
    >
      <div
        class="search-layer"
        :style="{top: correctLayerTop}"
        v-show="searchLayerShow"
      >
        <div
          v-if="searched"
          class="search-result"
        >
          <div class="search-result-wrapper">
            <span class="search-count">搜索结果：共{{ searchList.length }}条</span>
            <transition
              name="search-result"
              mode="out-in"
            >
              <ul
                class="search-schema-list"
                v-if="!searchLoading && searched"
              >
                <li
                  class="list-item"
                  v-for="schema in searchList"
                  :key="schema.code"
                  @click="select(schema)"
                >
                  <span
                    class="schema-name"
                    v-html="schema.name"
                  ></span>
                </li>
              </ul>
            </transition>
          </div>
        </div>
        <div
          v-else
          class="mask"
          @click="closeSeachLayer"
          @touchmove.prevent.stop
        ></div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { searchAssociation } from '@/light-app/service';
import { MutationType } from '@/store/types';
import { AppActionType, AppMutationType } from '@/store/modules/app/types';
import { LightAppMutationType } from '@/light-app/store/types';
import { H3Actionsheet } from 'h3-mobile-vue';
import App = H3.App;

// vuex-class module命名空间
const appModule = namespace('App');
const lightAppModule = namespace('LightApp');

@Component({
  components: {
    H3Actionsheet
  }
})
export default class AssociationSearchLayer extends Vue {
  @Mutation(MutationType.ToggleTabbarShow) toggleTabbarShow;

  @Mutation('excludeComp') excludeComp;

  searchList: any = [];

  searchLocalList: any = [];

  searchLayerShow: boolean = false;

  searchContent: string = ''; // 搜索文字

  searchInputFocus: boolean = false; // 搜索浮层显示状态

  searchLoading: boolean = true; // 搜索加载状态

  searchNoResult: boolean = true; // 是否无数据

  searched: boolean = false;

  get correctLayerTop(): string {
    if (process.env.NODE_ENV === 'development') {
      return '2.76667rem';
    }
    return '';
  }

  get correctInputTop(): string {
    if (process.env.NODE_ENV === 'development') {
      return '1.34667rem';
    }
    return '';
  }

  // mounted() {
  //   this.$nextTick(() => {
  //     this.onFocus();
  //   });
  // }

  onFocus() {
    (this.$refs.headerSearch as any).focus();
    this.searchInputFocus = true;
    this.searchLayerShow = true;
    this.toggleTabbarShow(false);
    // this.backStack.push(() => {
    //   this.closeSeachLayer();
    // });
  }

  onBlur() {
    const timer = window.setTimeout(() => {
      this.searchInputFocus = false;
      window.clearTimeout(timer);
    }, 0);
  }

  closeSeachLayer() {
    // this.backStack.pop();
    this.toggleTabbarShow(true);
    this.searchLayerShow = false;
    this.searchContent = '';
    this.searchLoading = false;
    this.searchNoResult = true;
    this.searchList = [];
    this.searchLocalList = [];
    (this.$refs.headerSearch as any).blur();
    const timer = window.setTimeout(() => {
      this.searched = false;
      window.clearTimeout(timer);
    }, 300);
  }

  /**
   * @description 搜索方法
   */
  async doSearch() {
    const content = this.searchContent;
    if (content === '') {
      return;
    }
    this.searchLoading = true;
    this.searched = true;
    const solutionCode = this.$store.state.solutionCode;
    const appCode = this.$store.state.appCode;
    const res = await searchAssociation(content);
    if (res.success) {
      let data = res.returnData.nodes;
      const reg = new RegExp(content, 'g');
      data.forEach(item => {
        if (item.name.includes(content)) {
          item.DisplayTitle = item.name;
          item.nameCopy = item.name;
          item.name = item.name.replace(
            reg,
            `<span style="color: #107FFF">${content}</span>`
          );
        }
      });
      console.log(data);
      this.searchList = data;
      this.searchLoading = false;
      if (this.searchList.length > 0) {
        this.searchNoResult = false;
      } else {
        this.searchNoResult = true;
      }
    } else {
      this.searchLoading = false;
      this.searchNoResult = false;
    }
  }

  select(schema: H3.App.SchemaListItem) {
    this.$emit('selected', schema);
  }
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}

.header-search-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  .px2rem(height, 108);
  background: #fff;
  border-bottom: 1px solid #ebedf2;
}

.header-search {
  display: flex;
  align-items: center;
  width: 100%;
  .px2rem(height, 72);
  .px2rem(margin-left, 20);
  .px2rem(margin-right, 20);
  .px2rem(padding-left, 24);
  .px2rem(padding-right, 24);
  background: #f5f7f9;
  .px2rem(border-radius, 10);
  transition: all 0.3s ease-in-out;
  .magnifier {
    .px2rem(margin-right, 10);
    font-size: 13px;
    color: #8893a7;
  }
  .search-input {
    flex: 1;
    .px2rem(height, 40);
    .px2rem(line-height, 40);
    border: none;
    font-size: 14px;
    outline: none;
    background: transparent;
    transition: all 0.2s ease 0.1s;
    &::-webkit-input-placeholder {
      color: #999;
    }
  }
  .clear {
    .px2rem(margin-left, 8);
    .px2rem(font-size, 24);
    color: #c9ccd8;
    cursor: pointer;
    transform: scale(0);
    transition: all 0.15s ease;
    &.active {
      transform: scale(1);
    }
  }
}

.search-cancel {
  .px2rem(width, 100);
  .px2rem(font-size, 30);
  color: @baseThemeColor;
}

.search-layer {
  position: fixed;
  .px2rem(top, 108);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  &-wrapper {
    min-height: 40%;
  }
  .mask {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.25);
  }
  .search-result {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: #f5f7f9;
    &-wrapper {
      min-height: 40%;
    }
    .search-count {
      display: block;
      font-size: 12px;
      color: #666;
      .px2rem(padding-left, 34);
      .px2rem(padding-top, 20);
    }
    .search-app-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      .px2rem(margin-top, 20);
      background: #fff;
      .list-item {
        display: flex;
        justify-content: center;
        width: 33%;
        .px2rem(padding-top, 20);
      }
    }
    .search-schema-list {
      .px2rem(margin-top, 20);
      background: #fff;
      .list-item {
        display: flex;
        align-items: center;
        .px2rem(height, 108);
        .px2rem(padding-left, 30);
        .px2rem(padding-right, 30);
        border-bottom: 1px solid #ebedf2;
        &:last-of-type {
          border-bottom: none;
        }
        .schema-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          .px2rem(width, 50);
          .px2rem(margin-left, 34);
          .px2rem(margin-right, 34);
          .px2rem(font-size, 45);
        }
        .schema-type {
          display: flex;
          justify-content: center;
          align-items: center;
          .px2rem(width, 88);
          .px2rem(height, 40);
          background: #e0ecfa;
          border-radius: 20px;
          color: @baseThemeColor;
          font-size: 11px;
          &.workflow {
            background: rgba(32, 207, 48, 0.1);
            color: #069913;
          }
        }
        .schema-name {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.search-layer-enter-active {
  transition: all 0.3s ease-in;
}
.search-layer-leave-active {
  transition: all 0.3s ease-out;
}
.search-layer-enter {
  opacity: 0;
}
.search-layer-leave-active {
  opacity: 0;
}

.search-result-enter-active {
  transition: all 0.2s ease 0.1s;
}
.search-result-leave-active {
  transition: all 0.2s ease 0.1s;
}
.search-result-enter {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}
.search-result-leave-active {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}
// 轻应用
.light-list-item {
  display: flex;
  align-items: center;
  .px2rem(height, 112);
  .px2rem(padding-left, 32);
  padding-right: 0;
  background: linear-gradient(
      to top,
      transparent,
      transparent 99%,
      #eee 99%,
      #eee 100%
    )
    content-box;
  background-size: 100% 100%;
  border-bottom: none;
  align-items: center;
  .schema-name {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .px2rem(margin-right, 20);
    .px2rem(font-size, 30);
    color: #333;
    margin-left: 0.45333333rem;
  }
  .ellipsis-o {
    transform: rotateZ(90deg);
    padding: 0.6rem 0.4rem;
    margin-left: auto;
    &::before {
      color: #b4b7bc;
      .px2rem(font-size, 48);
    }
  }
}
.form-op-box {
  .form-op {
    &__item {
      .px2rem(height, 112);
      .px2rem(font-size, 30);
      .px2rem(line-height, 112);
      text-align: center;
      background: #fff;
      &:first-child {
        box-shadow: 0 0.12rem 0.9866666rem 0 rgba(0, 115, 233, 0.03);
        border-radius: 0.213333rem 0.213333rem 0 0;
      }
    }
    &__item-delete {
      color: #ef503e;
    }
    &__item-cancel {
      .px2rem(margin-top, 21);
      border-bottom: none !important;
    }
  }
}
// 轻应用
.setting-dropdown-menu {
  position: relative;
  z-index: 10001;
}
.setting-dropdown-menu {
  .h3ui-actionsheet__cell {
    .px2rem(height, 112);
    .px2rem(font-size, 30);
    .px2rem(line-height, 112);
    background: #fff;
  }
  .h3ui-actionsheet {
    border-radius: 0.213333rem 0.213333rem 0 0 !important;
    .h3ui-actionsheet__menu {
      border-radius: 0.213333rem 0.213333rem 0 0 !important;
      overflow: hidden;
    }
  }
  .h3-actionsheet-menu-default {
    &:first-child {
      box-shadow: 0 0.12rem 0.9866666rem 0 rgba(0, 115, 233, 0.03);
    }
  }
  .h3ui-actionsheet__action {
    .px2rem(margin-top, 21);

    .h3ui-actionsheet__cell {
      &::before {
        background: none !important;
      }
    }
  }
  .h3ui-actionsheet-cancel-button-mask {
    background-color: #f5f7f9;
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

