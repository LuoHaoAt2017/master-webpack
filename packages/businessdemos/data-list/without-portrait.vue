<template>
    <div>
      <div class="search-bar" v-show="true" >
        <div class="searchBarWarpper" :class="{'h3-search-focus':isSearching,}">
          <SearchBar prefixCls="h3-search-opposite" ref="searchBar" v-model="searchKey"  placeholder="搜索数据标题" 
            :onChange="searchByKeyAsync"
            :onCancel="cancelSearch" 
            :showCancelButton="false" 
            :onFocus="onFocus"
            :onBlur="onBlur" />
        </div>
        <div class="filter" v-if="!isEditing && !isSearching" @click="triggerEdit">          
            编辑
        </div>
        <div class="filter" v-if="showFilter && !isEditing">          
            筛选
        </div>
        <div class="filter" v-if="isEditing" @click="cancelEdit">取消</div>
      </div>
      <h3-batching-action-sheet
        v-show="isEditing" 
        :isAll="isSelectedAll" 
        :selectedNum="selectedCount" 
        :tip="tip" 
        @selectAll="selectAll"
        @cancelAll="cancelAll"
        @onCancel="onCancelSelect"
        :two-contents="false"
        :has-bottom-line="true"
        direction="top">
      </h3-batching-action-sheet>
      <h3-scroll ref="scroll"  :loadMore="loadMore" >
        <div>
          <h3-swipeout>
            <h3-swipeout-item v-for="(item, index) in itemLists" :key="index" :disabled="true" underlay-color="#F5222D;"  transition-mode="follow">
              <div slot="right-menu" >
                <h3-swipeout-button @click.native="clickButtom" :width="60" style="background:#F5222D;font-size:0.4rem;">删除</h3-swipeout-button>
              </div>
              <div slot="content" :class="item.selected ? 'datalist-item-selected' : ''">
                <h3-card-form @click.native="clickCardForm(item)">
                  <template slot="aside" v-if="item.iconUrl">
                    <img :src="item.iconUrl" />
                  </template>
                  <div> 
                    <div style="display: flex; align-items: center;"> 
                      <div :class="mainTitleCls(item)" v-html="getDataTitleName(item.title)">
                      </div>
                      <h3-status-tip style="{margin-top: 0.04rem;}"  :type="item.status" v-if="item.status"></h3-status-tip>
                    </div>
                    <div class="main-summary has-aside" 
                        v-for="(summary,index) in item.summary" :key="index" 
                        v-if="item.summary && index < 5">
                      {{summary}}
                    </div>
                  </div>
                  <template slot="extra">
                    <h3-multiple-check-item v-show="isEditing"  :is-editing="isEditing" :selected="item.selected"
                    @tigger-multiple-check = "triggerMultipleCheck"></h3-multiple-check-item>
                  </template>
                </h3-card-form>
              </div>
            </h3-swipeout-item>
          </h3-swipeout>
        </div>
      </h3-scroll>
      <div class="h3-data-list-footer mescroll-touch">
        <h3-action-group v-show="isEditing" 
          :showTitle="false"
          :showButton="false">
          <h3-action-group-item v-for="(item,index) in actionGroup" :key="index" :iconType="item.iconType" :actionName="item.actionName" :handler="item.handler"></h3-action-group-item>
        </h3-action-group>
      </div>
      
      <h3-modal :show="popupModalShow" maskClosable type="popup" style="top: 44px;" popup-direction="down"  >
      </h3-modal>
      
      <h3-action-sheet
        :menus="menus" 
        :message="`已选${selectedCount}条数据，删除后不可恢复`" 
        show-cancel 
        @on-click-menu="onClickMenu" 
        v-model="actionsheetShow">
      </h3-action-sheet>

      <h3-toast class="h3-remark-toast" :show="toastShow" iconType="check" text="删除成功"></h3-toast>
    </div>
</template>

<script>
import cx from 'classnames';
import H3Modal from '../../components/h3-modal/index';
import H3CardForm from '../../widgets/h3-card-data-list/index';
import H3Scroll from '../../components/h3-scroll/mescroll';
import SearchBar from '../../components/h3-search-bar/index';
import H3StatusTip from '../../widgets/h3-tool-tip/h3-status-tip';
import { H3Swipeout, H3SwipeoutItem, H3SwipeoutButton } from '../../components/h3-swipeout';
import H3MultipleCheckItem from '../../widgets/h3-multiple-check/h3-multiple-check-item';
import H3BatchingActionSheet from '../../widgets/h3-filter/h3-batch-action-sheet';
import H3ActionSheet from '../../components/h3-actionsheet/index';
import { H3ActionGroup, H3ActionGroupItem } from '../../widgets/h3-action-group/index';
import H3Toast from '../../components/h3-toast/index';

export default {
  components: {
    H3CardForm,
    H3StatusTip,
    H3Swipeout,
    H3SwipeoutItem,
    H3SwipeoutButton,
    H3Scroll,
    SearchBar,
    H3Modal,
    H3MultipleCheckItem,
    H3BatchingActionSheet,
    H3ActionGroup,
    H3ActionGroupItem,
    H3ActionSheet,
    H3Toast,
  },
  data() {
    return {
      itemLists: [
        {
          title: '数据标题数据标',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          status: 'approving',
          summary: [
            '摘要：摘要内容1',
            '摘要：摘要内容2',
            '摘要：摘要内容3',
          ],
        },
        {
          title: '数据标题数据标',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          status: 'draft',
          summary: [
            '摘要：摘要内容1',
          ],
        },
        {
          title: '数据标题数据',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          status: 'executed',
        },
        {
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          // status: 'cancellation',
          summary: [
            '摘要：摘要内容摘要内容摘要内容摘要内容摘要内容',
            '摘要：摘要内容1',
            '摘要：摘要内容2',
            '摘要：摘要内容3',
            '摘要：摘要内容4',
            '摘要：摘要内容5',
            '摘要：摘要内容6',
          ],
        },
        {
          title: '数据标题数据标',
          status: 'approving',
          summary: [
            '摘要：摘要内容1',
            '摘要：摘要内容2',
            '摘要：摘要内容3',
          ],
        },
        {
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          // status: 'cancellation',
          summary: [
            '摘要：摘要内容摘要内容摘要内容摘要内容摘要内容',
            '摘要：摘要内容1',
            '摘要：摘要内容2',
            '摘要：摘要内容3',
            '摘要：摘要内容4',
            '摘要：摘要内容5',
          ],
        },
        {
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          // status: 'cancellation',
          summary: [
            '摘要：摘要内容摘要内容摘要内容摘要内容摘要内容',
            '摘要：摘要内容1',
            '摘要：摘要内容2',
            '摘要：摘要内容3',
            '摘要：摘要内容4',
          ],
        },
        {
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          status: 'cancellation',
          summary: [
            '摘要：摘要内容摘要内容摘要内容摘要内容摘要内容',
            '摘要：摘要内容1',
            '摘要：摘要内容2',
            '摘要：摘要内容3',
          ],
        },
        {
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          // iconUrl: require('../../../src/assets/img/touxiang.jpeg'),
          status: 'cancellation',
          summary: [
            '摘要：摘要内容摘要内容摘要内容摘要内容摘要内容',
            '摘要：摘要内容1',
            '摘要：摘要内容2',
          ],
        },
      ],
      actionGroup: [
        { iconType: 'delete', actionName: 'tab1', handler: this.showActionSheet },
        { iconType: 'sharealt', actionName: 'tab3' },
        { iconType: 'sharealt', actionName: 'tab3' },
        { iconType: 'sharealt', actionName: 'tab3' },
        { iconType: 'sharealt', actionName: 'tab3' },
        { iconType: 'sharealt', actionName: 'tab3' },
        { iconType: 'sharealt', actionName: 'tab3' },
      ],
      menus: [
        {
          type: 'error',
          label: '删除',
        },
      ],
      actionsheetShow: false,
      isEditing: false,
      isSearching: false,
      searchKey: '',
      isSearchingOnBlur: false,
      highLightText: '',
      selectedCount: 0,
      showFilter: true,
      tip: '全选',
      selectAllFlag: false,
      toastShow: false,
    };
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    loadMore(page, done, err) {
      done(0, 0);
      console.log(err);
    },
    clickButtom() {
      console.log('delect');
    },
    triggerMultipleCheck() {
      this.isEditing = true;
    },
    clickCardForm(item) {
      if (this.isEditing) {
        if (item.selected === undefined || !item.selected) {
          this.selectedCount += 1;
        } else {
          this.selectedCount -= 1;
        }
        this.$set(item, 'selected', !item.selected);
      } else { // 点击card
      }
    },
    showActionSheet() {
      this.actionsheetShow = true;
    },
    onClickMenu(menu, item) {
      console.log(menu);
      console.log(item);
      if (!menu) {
        if (item.label==='删除') {
          //进行删除操作
          console.log('要删除选中的那条数据了');
          this.cancelEdit();
          this.toastShow = true;
          setTimeout(() => {
            this.toastShow = false;
          }, 1000);
        }
      } else if (menu === 'cancel') {
        this.cancelEdit();
      }
    },
    onCancelSelect() {
      const self = this;
      self.itemLists.forEach((item) => { self.$set(item, 'selected', false); });
      self.selectedCount = 0;
      self.isEditing = false;
      self.isSelectedAll = false;
      self.tip = '全选';
    },
    selectAll() {
      const self = this;
      self.itemLists.forEach((item) => { self.$set(item, 'selected', true); });
      self.selectedCount = self.itemLists.length;
      this.tip = '全不选';
      this.selectAllFlag = true;
    },
    cancelAll() {
      const self = this;
      self.itemLists.forEach((item) => { self.$set(item, 'selected', false); });
      this.selectedCount = 0;
      this.tip = '全选';
      this.isEditing = true;
      this.selectAllFlag = true;
    },
    getDataTitleName(dataTitle) {
      if (dataTitle) {
        return dataTitle.replace(this.highLightText, `<span style='color: #1890FF; font-size: 0.43rem'>${this.highLightText}</span>`);
      }
      return dataTitle;
    },
    mainTitleCls(item) {
      return cx('main-title', {
        'has-aside': item.status === undefined || item.status === '',
        'has-aside-status': item.status && item.status !== '',
        'without-summary': item.summary === undefined || item.summary.length < 1,
      });
    },
    searchByKeyAsync() {
      this.highLightText = this.searchKey;
      if (this.searchKey) {
        this.showFilter = false;
        const self = this;
        this.$nextTick(() => {
          self.searchByKey();
        });
      } else {
        this.total = -1;
      }
    },
    searchByKey() {
      if (!this.searchKey) {
        this.isSearching = false;
      } else {
        this.isSearching = true;
      }
      // TODO
      // this.$refs.scroll.mescroll.resetUpScroll();
    },
    cancelSearch() {
      this.searchKey = '';
      this.highLightText = '';
      this.isSearching = false;
      this.showFilter = true;
      this.searchItems = [];
      // TODO 还原数据
      // this.$refs.scroll.mescroll.resetUpScroll();
    },
    onFocus() {
      // TODO
      this.isSearching = true;
      this.isSearchingOnBlur = false;
      this.showFilter = false;
    },
    onBlur() {
      // TODO
      this.isSearchingOnBlur = true;
      this.showFilter = true;
      if (this.searchKey) {
        this.showFilter = false;
      } else {
        this.isSearching = false;
        this.showFilter = true;
      }
    },
    triggerEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.cancelAllSelected();
      this.selectedCount = 0;
    },
    cancelAllSelected() {
      for (let i = 0; i < this.itemLists.length; i += 1) {
        const eachItem = this.itemLists[i];
        this.$set(eachItem, 'selected', false);
      }
    },
  },
  computed: {
    popupModalShow() {
      if (this.isSearchingOnBlur) {
        return false;
      }
      if (this.isSearching && !this.searchKey) {
        return true;
      }
      return false;
    },
    isSelectedAll: {
      get() {
        if (this.selectedCount === this.itemLists.length) {
          return true;
        }
        return false;
      },
      set(val) {
        return val;
      },
    },
  },
  watch: {
    selectedCount(val) {
      if (val === 0 && !this.selectAllFlag) {
        this.isEditing = false;
        this.selectedCount = 0;
      }
    },
  },
};
</script> 
<style lang="less">
@import '../../styles/mixins';
@import './style/data-list.less';
</style>
