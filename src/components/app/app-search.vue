<template>
  <div class="app-search">
    <div class="app-search-bar">
      <h3-search-bar prefixCls="h3-search-opposite" v-model="searchKey"  placeholder="搜索表单名称"
        :onChange="searchKeyChanged" :onCancel="cancelSearch"
        :showCancelButton="false" :onFocus="onFocus" :onBlur="onBlur" />
    </div>
    <div class="app-search-result" v-if="isSearch">
      <div class="app-search-count" v-if="searchResultCount">
        搜索结果：共{{searchResultCount}}条;
      </div>
      <div class="app-search-scroll" @touchmove="touchmoveEvent">
        <h3-card-form class-name="app-search-item" v-for="result in searchResults"
          :key="result.SchemaCode" @click.native="onItemClick(result)">
          <div slot="aside" class="app-search-item-icon">
            <i :class="result.appIconClass"></i>
          </div>
          <div class="app-search-item-main">
            <div class="app-search-item-title" v-html="result.DisplayName"></div>
            <div class="app-search-item-subtitle">{{result.groupTitle}}</div>
          </div>
        </h3-card-form>
      </div>
    </div>
    <!-- 搜索无结果空白页 -->
    <h3-blank-page prefixCls="h3-search-blank-page" imageUrl='' @touchmove.native.prevent v-show="isSearch&& searchResults.length === 0"
      :tipText="searchBlankText" :showButton="false" style="top:45px"></h3-blank-page>
    <h3-modal :show="searchModalShow" type="popup" maskTop='44px' popup-direction="down" style="position: absolute">
    </h3-modal>
  </div>
</template>
<script>

import { throttle } from '../../config/common';
// h3 widgets
import h3SearchBar from '../../../packages/components/h3-search-bar';
import h3CardForm from '../../../packages/widgets/h3-card-data-list';
import h3BlankPage from '../../../packages/widgets/h3-blank-page';
import H3Modal from '../../../packages/components/h3-modal';

const recentAppCode = 'SYS_RecentModule';

export default {
  name: 'app-search',
  components: {
    h3SearchBar,
    h3CardForm,
    h3BlankPage,
    H3Modal,
  },
  props: {
    source: Array,
  },
  data() {
    return {
      searchResults: [],
      searchKey: '', // 搜索关键字
      isSearch: false,
      isFocus: false,
    };
  },
  created() {
    // 对搜索进行节流
    this.searchByKeyAsync = throttle(this.searchByKeyAsync, 300, { leading: true, trailing: true });
  },
  activated() {
    this.isFocus = false;
    this.searchKey = '';
    this.isSearch = false;
    this.searchResults = [];
    this.$emit('onToggleSearch', {
      active: false,
      isSearch: false,
    });
  },
  methods: {
    onItemClick(item) {
      this.$emit('onItemClick', item);
    },
    cancelSearch() {
      this.isFocus = false;
      this.isSearch = false;
      this.searchKey = '';
      this.searchResults = [];
      this.$emit('onToggleSearch', {
        active: true,
        isSearch: false,
      });
      // this.$forceUpdate();
    },
    searchKeyChanged() {
      const keyword = this.searchKey.trim();
      const isSearch = !!keyword;
      if (isSearch !== this.isSearch) {
        this.$emit('onToggleSearch', {
          active: true,
          isSearch: isSearch,
        });
        this.isSearch = isSearch;
      }
      if (isSearch) {
        this.searchByKeyAsync(keyword);
      } else {
        this.searchResults = [];
      }
    },
    searchByKeyAsync(keyword) {
      this.doSearch(keyword);
    },
    // 搜索功能
    doSearch(keyword) {
      const tempArr = [];
      for (let i = 0; i < this.source.length; i += 1) {
        const group = this.source[i];
        if (i === 0 && group.AppCode === recentAppCode) continue;
        const childrens = group.Childrens;
        const groupName = group.GroupDisplayName ? `-${group.GroupDisplayName}` : '';
        const groupTitle = `${group.DisplayName}${groupName}`;
        for (let j = 0; j < childrens.length; j += 1) {
          const form = childrens[j];
          if (form.DisplayName.includes(keyword)) {
            const searchItem = Object.assign({}, form);
            searchItem.groupTitle = groupTitle;
            // searchItem.DisplayName = searchItem.DisplayName.replace(keyword, `<span class='search-key'>${keyword}</span>`);
            tempArr.push(searchItem);
          }
        }
      }
      this.searchResults = tempArr;
    },
    onFocus() {
      this.isFocus = true;
      this.$emit('onToggleSearch', {
        active: true,
        isSearch: this.isSearch,
      });
    },
    onBlur() {
      this.isFocus = false;
      this.$emit('onToggleSearch', {
        active: this.isSearch,
        isSearch: this.isSearch,
      });
    },
    touchmoveEvent() {
      if (!this.isFocus) {
        return;
      }
      const searchInput = this.$el.querySelector('input[type="search"]');
      if (searchInput) {
        searchInput.blur();
      }
    },
  },
  computed: {
    searchBlankText() {
      const text = `没有找到与"${this.searchKey}"相关的表单。请更换其他关键字试试`;
      return text;
    },
    searchModalShow() {
      const keyword = this.searchKey.trim();
      return !keyword && this.isFocus;
    },
    searchResultCount() {
      return this.searchResults.length;
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.app-search-bar{
  position: absolute;
  top: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
  &::after{
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #e4e4e4;
    display: block;
    width: 100%;
    height: 1PX;
    z-index: 999;
    transform: scaleY(0.5);
  }
}
.app-search-result{
  position: absolute;
  .px2rem(top,88);
  bottom: 0;
  .px2rem(padding-top,88);
  left: 0;
  background-color: #f8f8f8;
  width: 100%;
  -webkit-overflow-scrolling:touch;
  transform:translated3d(0,0,0);
  .app-search-count{
    background: #F8F8F8;
    .px2rem(padding-left, 30);
    .px2rem(padding-top, 22);
    .px2rem(padding-bottom, 22);
    .px2rem(margin-top,-80);
    .px2rem(font-size, 26);
    .px2rem(line-height, 36);
    color: #999;
  }
  .app-search-scroll{
    width:100%;
    height:100%;
    overflow-y: auto;
  }
  .app-search-item{
    .px2rem(padding-top,24);
    .px2rem(padding-bottom,24);
    .h3-card-form-aside{
      .px2rem(width,60);
      .px2rem(margin-right,24);
    }
  }
  .app-search-item-icon{
    .px2rem(width,60);
    .px2rem(height,80);
    i{
      .px2rem(line-height,80);
      .px2rem(font-size,60);
    }
  }
  .app-search-item-title{
    .px2rem(font-size,32);
    .px2rem(line-height,45);
    .px2rem(max-width,606);
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .app-search-item-subtitle{
    .px2rem(font-size,26);
    .px2rem(margin-top,8);
    .px2rem(line-height,37);
    .px2rem(max-width,606);
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .search-key{
    .px2rem(font-size,32);
    color: #1890ff;
  }
}
</style>
