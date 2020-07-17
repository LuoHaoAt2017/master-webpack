<template>
  <div>
    <div class="search-bar" ref="topBar" >
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
      <div class="filter" v-if="showFilter && !isEditing && !isSearching">          
          筛选
      </div>
      <div class="cancel" v-if="isEditing && !isSearching" @click="cancelEdit">取消</div>
    </div>
    <h3-calendar ref="calendar" :changeMonth="changeMonth" :markDate="arr" :choseDay="choseDay" :collapse.sync="isCalendarCollapse" v-if="isCalendarMode">
    </h3-calendar>
    <h3-scroll ref="scroll" :style="wrapStyle" :class="[{'has-calendar': isCalendarMode}, {'has-calendar-expand':isCalendarMode && !isCalendarCollapse }]"  :loadMore="loadMore" >
      <div style="z-index: 3">
        <h3-swipeout>
          <h3-swipeout-item v-for="(item, index) in itemLists" :key="index"  underlay-color="#F5222D"  transition-mode="follow">
            <div slot="right-menu" >
              <h3-swipeout-button @click.native="clickButtom(item)" :width="60" style="background:#F5222D;font-size:0.4rem;">删除</h3-swipeout-button>
            </div>
            <div slot="content" :class="item.selected ? 'datalist-item-selected' : ''">
              <h3-card-form @click.native="clickCardForm(item)">
                <template slot="aside">
                  <img :src="item.iconUrl" />
                </template>
                <div> 
                  <div class="title-status">  
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
                  <!-- <h3-multiple-check-item  :is-editing="isEditing" v-show="isEditing" :selected="item.selected" :is-single-check="true"
                  @triggerSingleCheck="triggerSingleCheck(item)"></h3-multiple-check-item> -->
                  <h3-multiple-check-item  :is-editing="isEditing" v-show="isEditing" :selected="item.selected" :is-single-check="true"
                  ></h3-multiple-check-item>
                </template>
              </h3-card-form>
            </div>
          </h3-swipeout-item>
        </h3-swipeout>
      </div>
    </h3-scroll>
    
    <h3-modal :show="popupModalShowSearch" maskClosable  type="popup" :style="maskStyle"  popup-direction="down"  @on-hide="hideActionGroup">
    </h3-modal>
    
    <div class="h3-data-list-footer mescroll-touch">
      <h3-action-group v-show="isEditing"
        :showTitle="false"
        @onCancel = "onCancel"
        :showButton="true">
        <h3-action-group-item class="h3-modal-scroll-exception" v-for="(item,index) in actionGroup" :key="index" :iconType="item.iconType" :actionName="item.actionName" :handler="item.handler"></h3-action-group-item>
      </h3-action-group>
    </div>
    <h3-action-sheet
      :menus="menus"
      :message="'此条数据删除后不可恢复'" 
      show-cancel 
      @on-click-menu="onClickMenu" 
      v-model="actionsheetShow">
    </h3-action-sheet>
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
import H3Button from '../../components/h3-button/index';
import H3Calendar from '../../components/h3-calendar';

export default {
  name: 'list-single-check',
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
    H3ActionSheet,
    H3ActionGroup,
    H3ActionGroupItem,
    H3Button,
    H3Calendar,
  },
  data() {
    return {
      isCalendarCollapse: true,
      isCalendarMode: true,
      arr: ['2018-6-1', '2018-6-11', '2018-6-16', '2018-6-23', '2018-6-28'],
      scrollTop: -1,
      itemLists: [
        {
          title: '数据标题数据标',
          iconUrl: require('../../assets/img/touxiang.jpeg'),
          status: 'approving',
          summary: [
            '摘要：摘要内容1',
            '摘要：摘要内容2',
            '摘要：摘要内容3',
          ],
        },
        {
          title: '数据标题数据标',
          iconUrl: require('../../assets/img/touxiang.jpeg'),
          status: 'draft',
          summary: [
            '摘要：摘要内容1',
          ],
        },
        {
          title: '数据标题数据',
          iconUrl: require('../../assets/img/touxiang.jpeg'),
          status: 'executed',
        },
        {
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          iconUrl: require('../../assets/img/touxiang.jpeg'),
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
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          iconUrl: require('../../assets/img/touxiang.jpeg'),
          status: 'executed',
          summary: [
            '摘要：摘要内容摘要内容摘要内容摘要内容摘要内容',
            '摘要：摘要内容1',
            '摘要：摘要内容2',
          ],
        },
        {
          title: '数据标题数据标数据数2据数据标题数据标数据数2据',
          iconUrl: require('../../assets/img/touxiang.jpeg'),
          status: 'executed',
          summary: [
            '摘要：摘要内容摘要内容摘要内容摘要内容摘要内容',
            '摘要：摘要内容1',
            '摘要：摘要内容2',
          ],
        },
      ],
      isEditing: false,
      isSearching: false,
      searchKey: '',
      isSearchingOnBlur: false,
      highLightText: '',
      selectedCount: 0,
      actionGroup: [
        { iconType: 'delete', actionName: 'tab1', handler: this.showActionSheet },
        { iconType: 'delete', actionName: 'tab2' },
        { iconType: 'sharealt', actionName: 'tab3' },
        { iconType: 'delete', actionName: 'tab4' },
        { iconType: 'delete', actionName: 'tab5' },
        { iconType: 'delete', actionName: 'tab6' },
        { iconType: 'delete', actionName: 'tab7' },
        { iconType: 'delete', actionName: 'tab8' },
      ],
      itemTitle: '',
      statusType: '',
      menus: [
        {
          type: 'error',
          label: '删除',
        },
      ],
      actionsheetShow: false,
      showFilter: true,
      showActionButton: false,
    };
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    choseDay(date) {
      console.log(date);
    },
    changeMonth() {
      this.$nextTick(() => {
        const top = this.$refs.topBar.offsetHeight + this.$refs.calendar.$el.offsetHeight;
        this.scrollTop = top;
      });
    },
    loadMore(page, done, err) {
      done(0, 0);
    },
    clickButtom(item) {
      // Todo 删除该条数据
      this.actionsheetShow = true;
    },
    triggerMultipleCheck() {
      this.isEditing = true;
      this.showActionButton = true;
    },
    hideActionGroup() {
      this.isEditing = false;
      this.showActionButton = false;
    },
    clickCardForm(item) {
      if (this.isEditing) {
        this.toogleSingleItemSelected(item);
      } else { // 点击card
      }
    },
    cancelAllSelected() {
      for (let i = 0; i < this.itemLists.length; i += 1) {
        const item = this.itemLists[i];
        this.$set(item, 'selected', false);
      }
    },
    toogleSingleItemSelected(item) {
      if (!item.selected) {
        this.cancelAllSelected();
        this.$set(item, 'selected', true);
      } else {
        this.$set(item, 'selected', false);
      }
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
        // this.showFilter = false;
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
      if (this.searchKey) {
        this.showFilter = false;
      } else {
        this.isSearching = false;
        this.showFilter = true;
      }
    },
    triggerSingleCheck(item) {
      // alert('单选');
      // this.isEditing = true;
      // this.itemTitle = item.title;
      // this.statusType = item.status;
      this.$set(item, 'selected', !item.selected);
    },
    showActionSheet() {
      this.actionsheetShow = true;
    },
    onClickMenu() {

    },
    onCancel() {
      this.isEditing = false;
      this.showActionButton = false;
    },
    triggerEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.cancelAllSelected();
    },
  },
  computed: {
    popupModalShowSearch() {
      if (this.showActionButton) {
        return true;
      }
      if (this.isSearching && !this.searchKey) {
        return true;
      }
      if (this.isSearchingOnBlur) {
        return false;
      }
      return false;
    },
    maskStyle() {
      return {
        top: `${88 / 75}rem`,
        bottom: '0',
      };
    },
    wrapStyle() {
      if (this.isCalendarMode && this.scrollTop > 0) {
        return {
          top: `${this.scrollTop}px`,
        };
      }
      return {};
    },
  },
  watch: {
    isCalendarCollapse(val) {
      if (!val) {
        if (this.isCalendarMode) {
          this.$nextTick(() => {
            const top = this.$refs.topBar.offsetHeight + this.$refs.calendar.$el.offsetHeight;
            this.scrollTop = top;
          });
        }
      } else {
        this.scrollTop = -1;
      }
    },
  },
};
</script> 
<style lang="less" scoped>
@import '../../styles/mixins';
@import './style/data-list.less';

</style>
