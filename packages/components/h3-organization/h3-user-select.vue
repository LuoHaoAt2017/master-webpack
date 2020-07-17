<template>
  <div class="h3-user-select">
    <div class="main" >
      <!--顶部搜索栏-->
      <h3-list>
        <h3-search-bar
          defaultValue=""
          placeholder="搜索"
          v-model="searchValue"
          :onChange="searchChange"
          :onClear="searchClear"
          :onFocus="onFocus"
          :onBlur="onBlur"
        />
      </h3-list>
      <!--面包屑导航和搜索时显示条数-->
      <h3-list v-if="searchValue === ''" >
        <h3-list-item className="breadcrumb-list" ref="breadCrumblist" :touchFeedback="false">
          <span v-for="(item,index) in breadCrumbList" :key="index" @click="switchIndex(index)">
              {{item}}
            <i class="icon aufont icon-base-right" v-if="index != breadCrumbList.length-1"></i>
          </span>
        </h3-list-item>
      </h3-list>
      <h3-list v-else>
        <h3-list-item style="background-color: #f8f8f8; margin-left:0px;" :touchFeedback="false">
          <span class="search-number">
            搜索结果：共{{searchResultList.length}}条
          </span>
        </h3-list-item>
      </h3-list>
      <!--选择区域-->
      <div class="scroll-view-list-content" v-if="searchValue === ''">
        <h3-list v-if="isMultiple">
          <h3-white-space style="background-color: #f4f4f4;"/>
          <h3-checkbox-item value="all" :returnValue="isSelectedAll"  @onClick="toggleSelectAll">
            全选
          </h3-checkbox-item>
        </h3-list>
        <h3-list>
          <h3-white-space style="background-color: #efeff4;"/>
          <h3-list-item 
            :hasThumb="showListThumb" 
            :hasContent="true" 
            :hasExtra="showListExtra" 
            v-for="item in orgList" 
            :key="item.UnitID" 
            :eventArgs="item" 
            @onClick= "setSelectedItem(item)"
            :class="{selectedBgc : isMultiple && item.IsSelected, 'bottom-line' : true}"
            :content-class-name= "{ 'h3-list-content-extra' : hasChildrenDepartment}"
            :touchFeedback = "isMultiple || !item.IsSelected"
            activeClass= "item-active-cls"
            >{{item.DisplayName}}
            <!-- <span v-if="isMultiple && orgUnitVisible">({{item.UserCount}}人)</span> -->
            <template slot="thumb">
              <label class="h3-user-select-checkbox-wrapper" v-if="isMultiple && orgUnitVisible">
                <span class="h3-user-select-checkbox" :class="{'h3-user-select-checkbox-checked':item.IsSelected}">
                  <span class="h3-user-select-checkbox-inner">
                  </span>
                </span>
              </label>
              <span class="aufont icon-base-check " 
                v-if="!isMultiple && hasChildrenDepartment && orgUnitVisible" 
                :class="{'select-blue': item.IsSelected}"
                style="color: #FFF;font-size: 17px;font-weight: bold;">
              </span>
            </template>
            <template slot="extra">
              <a disabled="true"  v-if="item.ChildrenNodes && showSubordinate" :class="getSubordinateClass(item.IsSelected)" @click.stop="getChildren(item)">
                <i class="icon aufont icon-base-organization"/>
                下级
              </a>
              <span class="aufont icon-base-check" v-if="!isMultiple && orgUnitVisible && !hasChildrenDepartment"
                :class="{'select-blue': item.IsSelected}" 
                style="color: #FFF;font-size: 17px;font-weight: bold;">
              </span>
            </template>
          </h3-list-item>
        </h3-list>
        <h3-white-space style="background-color: #f4f4f4;"/>
        <h3-list>
          <h3-list-item 
            :hasThumb="!showUserExtra" 
            :hasContent="true" 
            :hasExtra="showUserExtra" 
            :brief="true" 
            v-for="item in userList" 
            :key="item.UnitID" 
            :eventArgs="item" 
            @onClick="setSelectedItem(item)" 
            :class="{selectedBgc : isMultiple && item.IsSelected, 'bottom-line' : true}"
            :touchFeedback = "isMultiple || !item.IsSelected"
            activeClass= "item-active-cls">
            <template slot="thumb">
              <span class="h3-user-select-checkbox" 
                :class="{'h3-user-select-checkbox-checked':item.IsSelected,'h3-user-select-checkbox-multiple': isMultiple}" 
                v-if="isMultiple">
                <span class="h3-user-select-checkbox-inner">
                </span>
              </span>
              <span class="aufont icon-base-check " 
                v-if="!isMultiple" 
                :class="{'select-blue': item.IsSelected}"
                style="color: #FFF;font-size: 17px;font-weight: bold;">
              </span>
            </template>
            <div class="list-avator">
              <img style="height:33px;width:32px;border-radius: 50%;" :src="item.Avator" v-if="item.Avator" ></img>
              <span v-else>{{item.DisplayName.substr(item.DisplayName.length - 2)}}</span>
            </div>
            {{item.DisplayName}}
            <template slot="extra">
              <span class="aufont icon-base-check" :class="{'select-blue': item.IsSelected}" 
                style="color: #FFF;font-size: 17px;font-weight: bold;">
              </span>
            </template>
          </h3-list-item>
        </h3-list>
      </div>
      <!--搜索结果显示-->
      <div class="scroll-view-list-content scroll-view-list-content-search" v-else>
        <h3-list v-if="false">
          <h3-checkbox-item value="all" :returnValue="isSelectedSearchAll"  @onClick="toggleSearchSelectAll">
            全选
          </h3-checkbox-item>
        </h3-list>
        <h3-list>
          <h3-list-item 
            :hasThumb="isMultiple || item.Type === 4" 
            :hasExtra="!isMultiple" 
            :hasContent="true" :brief="true" 
            v-for="item in searchResultList" :key="item.UnitID" 
            :eventArgs="item" @onClick="setSelectedItem(item)" >
            
            <template slot="thumb">
              <span class="h3-user-select-checkbox" 
                :class="{'h3-user-select-checkbox-checked':item.IsSelected,'h3-user-select-checkbox-multiple': isMultiple}" 
                v-if="isMultiple">
                <span class="h3-user-select-checkbox-inner">
                </span>
              </span>
              <div class="list-avator" 
                v-if="item.Type === 4 || item.UnitType === 4"
                :class="{'muli-margin' :isMultiple}">
                <img style="height:33px;width:32px;border-radius: 50%;" :src="item.Avator" v-if="item.Avator" ></img>
                <span v-else class="user-without-avator">{{item.DisplayName.substr(item.DisplayName.length - 2)}}</span>
              </div>
            </template>
            {{item.DisplayName}}
            <template slot="brief">
              <span class="parent-node">{{item.ParentName}}</span>
            </template>
            <template slot="extra">
              <span class="aufont icon-base-check" :class="{'select-blue': item.IsSelected}" 
                style="color: #FFF;font-size: 17px;font-weight: bold;">
              </span>
            </template>
          </h3-list-item>
        </h3-list>
      </div>
      <!-- <div class="scroll-view-list-content scroll-view-list-content-selected-panel"  v-show="showSelectedPanel">
        <h3-list>
          <h3-list-item :touchFeedback = "false">
             <div class="scroll-view-list-content-selected-panel-header" 
              style="overflow: auto;overflow-y:none;width:100%;text-align:center;">
                <span style="line-height:37px;height:37px;" v-show="multipleSelectedResult.userCount > 0">已经选择:{{multipleSelectedResult.userCount}}人</span>
                <div style="float:right;">
                  <h3-button type="primary" @click.native="hideSelectedItemPanel" inline size="small" style="width:100px">确定</h3-button>
                </div>
              </div>
          </h3-list-item>
          <h3-list-item 
            :hasThumb="isMultiple" 
            :arrow="arrowStr" 
            :hasContent="true" 
            :hasExtra="true" 
            v-for="item in selectedItem.filter(s=>s.Type !==4)" 
            :key="item.UnitID" 
            :touchFeedback = "false"
            >{{item.DisplayName}}
            <span v-if="item.UserCount">({{item.UserCount}}人)</span>
            <template slot="extra">
               <h3-icon type="close-circle-o" @onClick="removeSelectItem(item)"/>
            </template>
          </h3-list-item>
        </h3-list>
        <h3-white-space style="background-color: #efeff4;"/>
        <h3-list>
          <h3-list-item :hasThumb="true" 
            :hasExtra="true" 
            :brief="true" 
            v-for="item in selectedItem.filter(s=>s.Type ===4)" 
            :key="item.UnitID" 
            :eventArgs="item" 
            :touchFeedback = "false">{{item.DisplayName}}
            <template slot="thumb">
              <div class="list-avator">
                <img style="height:33px;width:32px;border-radius: 50%;" :src="item.Avator" v-if="item.Avator" ></img>
                <span v-else>{{item.DisplayName.substr(0,1)}}</span>
              </div>
            </template>
            <template slot="extra">
              <h3-icon type="close-circle-o" @onClick="removeSelectItem(item)"/>
            </template>
          </h3-list-item>
        </h3-list>
      </div> -->
      <!--搜索时遮罩层-->
      <h3-modal :show.sync="popupModalShow" maskClosable type="popup" style="top: 44px;" popup-direction="down"  >
      </h3-modal>
    </div>
    <!--底部显示选中的人和部门区域-->
    <div class="h3-user-select-footer" :class="{'abs-foorer' : pickupFoot}" >
      <!--选择数目模式 目前已改版为头像滑动模式-->
      <div class="h3-user-select-footer-content" v-if="false"
        style="float:left; max-width:70%;overflow: auto;"
        @click="showSelectedItemPanel">
          已经选择:
        <span v-show="multipleSelectedResult.userCount > 0">{{multipleSelectedResult.userCount}}人</span>
        <span v-show="multipleSelectedResult.deptCount > 0">其中有{{multipleSelectedResult.deptCount}}个部门</span>
      </div>
      <!--头像滑动模式-->
      <div class="selected-list-wrap" ref="scrollFooter">
        <ul class="selected-list-content" >
        <!-- <transition-group tag="ul" name="footer-group"> -->
          <li class="dp-font24" :class="[item.Type === 4 ?'user':'department']" 
            v-for='(item,index) in selectedItem' :key="item.UnitID||item.ObjectId" >
            <div class="user-wrap" v-if="item.Type === 4" @click='delUser(item,index)'>
              <img :src="item.Avator||item.ProfilePhotoUrl" v-if='item.Avator||item.ProfilePhotoUrl'>
              <span :style='"backgroundColor:"+Colors[index % ColorLength]' 
                v-if="!item.Avator&&!item.ProfilePhotoUrl">
                {{item.DisplayName.substr(item.DisplayName.length - 2)}}
                </span>
              <span class="item-close-icon"><i class="aufont icon-base-close"></i></span>
            </div>
            <div class="dep-wrap" v-else  @click='delUser(item,index)'>
              <p class="name dp-font24">{{item.DisplayName||item.Name}}</p>
              <span class="item-close-icon"><i class=" aufont icon-base-close"></i></span>
            </div>
          </li>
        </transition-group>
        </ul>
      </div>
      <h3-button type="primary" style="margin: auto;" :disabled="multipleSelectedResult.userCount === 0" :onClick="ok" inline size="small">确定({{selectedItem.length}})</h3-button>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue';
// import IScroll from 'iscroll';
import cx from 'classnames';
import fetch from '../../utils/fetch';
import h3List from '../h3-list/h3-list';
import h3ListItem from '../h3-list/h3-list-item';
import h3Input from '../h3-input/h3-input';
import h3SearchBar from '../h3-search-bar/';
import h3Button from '../h3-button/';
import h3WhiteSpace from '../h3-white-space/';
import { H3CheckboxItem } from 'h3-mobile-vue';
import h3Icon from '../h3-icon/index';
import H3Modal from '../h3-modal';

// Vue.use(IScrollView, IScroll);


const prefixCls = 'h3-user-select';
export default {
  name: 'h3-user-select',
  components: {
    h3List,
    h3ListItem,
    h3Input,
    h3SearchBar,
    h3Button,
    h3WhiteSpace,
    H3CheckboxItem,
    h3Icon,
    H3Modal,
  },
  props: {
    routeParams: {
      type: Object,
      default() {
        return {};
      },
    },
    fromRoute: String,
    entryType: String,
    eventMark: String,
  },
  data() {
    return {
      unitList: Array, // 所有成员，后续可能改成URL动态请求
      totalUserCount: 0, // 组织总人数
      isMultiple: Boolean, // 是否多选
      userVisible: Boolean, // 用户是否可见
      userEnable: Boolean, // 可选择用户
      orgUnitVisible: Boolean, // 可选择部门
      unitSelectionRange: [], // 选人范围
      showUnActive: Boolean, // 是否显示禁用用户
      searchValue: this.defaultSearchValue || '',
      isSearching: false,
      isSearchingOnBlur: false,
      selectedUserCount: 0, // 已选择人数
      selectedDeptCount: 0, // 已选择部门数量
      remarkedItem: String,
      selectedItem: [],
      breadCrumbList: [],
      indexNum: 0,
      dataList: [],
      isSelectedAll: [''],
      showBreadCrumblist: true,
      showSelectAll: true,
      searchResultList: [],
      isSelectedSearchAll: [''],
      objectId: '',
      showSelectedPanel: false, // 显示已选择明细
      Colors: ['#956FEA', '#FFAD69', '#00A2FF', ' #46CFB6', '#5CD5FC'],
      ColorLength: 5,
      pickupFoot: false,
      lastScrollLeft: 0,
    };
  },
  created() {
    this.userVisible = this.routeParams.userVisible;
    this.orgUnitVisible = this.routeParams.orgUnitVisible;
    this.getDataParams();
    this.getFormUserData(this.dataParams);
  },
  activated() {
    // setTitle('选择');

    const self = this;
    window.backFn = function backFn() {
      self.goBack();
    };
    this.setSelectedValue();
    // if (isiOS) {
    //   setLeft(window.backFn);
    // }
  },
  mounted() {
    this.setSelectedValue();
    // this.resetContentHeight();
    // this.$refs.scrollView.refresh();
    // this.$nextTick(() => {
    //   this.$refs.scrollView.refresh();
    // });
  },
  updated() {
  },
  methods: {
    getDataParams() {
      this.remarkedItem = this.routeParams.value ? this.routeParams.value : [];
      this.selectedItem = JSON.parse(JSON.stringify(this.remarkedItem));
      this.dataParams = { ActionName: 'LoadUnit' };
      // 判断是否是转发流程
      // this.forward = this.routeParams.forward;
      this.showUnActive = this.routeParams.showUnActive;
      this.unitSelectionRange = this.routeParams.unitSelectionRange;
      this.userVisible = this.routeParams.userVisible;
      this.orgUnitVisible = this.routeParams.orgUnitVisible;
      this.isMultiple = this.routeParams.isMultiple === 'true' || this.routeParams.isMultiple === true;
      this.objectId = this.routeParams.ObjectId;
      // this.showSelectedPanel = this.routeParams.showSelectedPanel;
      if (this.userVisible) {
        if (this.unitSelectionRange) {
          this.filterType = 2;
        } else {
          this.filterType = 0;
        }
      } else {
        this.filterType = 1;
      }

      if (this.entryType !== 0) {
        this.dataParams.ShowUnActive = this.showUnActive;
        this.dataParams.UnitSelectionRange = this.unitSelectionRange;
        this.dataParams.UserVisible = this.userVisible;
      } else {
        this.dataParams.UserVisible = this.userVisible;
      }
    },
    // 刚进入页面时获取总数据
    async getFormUserData(params) {
      console.log(params);
      // let res1 = await this.getFormUser(params); //使用URL请求数据
      let res = this.getTestData(params); // await getFormUser(params); TODO 使用ajax请求数据
      if (res.Successful) {
        res = res.ReturnData.Data;
        this.companyNode = res.CompanyNode;
        if (!this.companyNode.DisplayName) {
          this.companyNode.DisplayName = this.$store.state.UserInfo.companyName;
        }
        this.breadCrumbList.push(String(this.companyNode.DisplayName ||
        this.$store.state.UserInfo.companyName));
        if (this.companyNode.UnitID) {
          this.dataList.push(res.Nodes[0].ChildrenNodes);
          // 把公司信息加入到页面中变成可以选择
          if (this.orgUnitVisible && (!this.unitSelectionRange ||
          (this.unitSelectionRange && this.unitSelectionRange.indexOf(
            this.companyNode.UnitID) > -1))) {
            this.dataList[0].unshift(this.companyNode);
          }
        } else {
          this.dataList.push(res.Nodes);
          if (this.orgUnitVisible && (!this.unitSelectionRange
          || (this.unitSelectionRange
          && this.unitSelectionRange.indexOf(this.companyNode.UnitID) > -1))) {
            this.dataList[0].unshift(this.companyNode);
          }
        }
        // this.$nextTick(() => {
        //   this.$refs.scrollView.refresh();
        // });
      }
    },
    // 获取二级数据
    async getDetailUserData(item, callback) {
      let res = await this.getFormUserDetail(item.UnitID, this.userVisible);
      if (res.Successful) {
        res = res.ReturnData.Data;
        this.dataList.push(res.Nodes);
        callback(res.Nodes);
      }
    },
    // 获取搜索数据
    async getSearchUserData(Keyword, FilterType, showUnActive, unitSelectionRange) {
      let res = await this.searchUser(
        Keyword,
        FilterType,
        showUnActive,
        unitSelectionRange,
      );
      if (res.Successful) {
        // 搜索结果
        res = res.ReturnData.Data;
        // this.searchData = res.Deps.concat(res.Users);
        // this.remarkSelectedItemForSearchData();
        // this.remarkSelectedSearchArrData();
        this.searchResultList = res.Deps.concat(res.Users);
      }
    },
    getFormUser(params) {
      const params2 = {
        PostData: JSON.stringify(params),
      };
      return fetch('/Mobile/MobileService/OnAction/', params2, 'post');
      // TODO URL使用参数传递
    },
    getFormUserDetail(UnitID, UserVisible) {
      const paramData = {
        UnitID,
        UserVisible,
        ActionName: 'LoadUnit',
      };
      return fetch('/Mobile/MobileService/OnAction', {
        PostData: JSON.stringify(paramData),
      }, 'post');
    },
    searchUser(Keyword, FilterType, ShowUnActive, UnitSelectionRange) {
      const params = {
        PostData: JSON.stringify({
          ActionName: 'FilterUnit',
          Keyword,
          FilterType,
          ShowUnActive,
          UnitSelectionRange,
          FromRow: 0,
          EndRow: 1000,
        }),
      };
      return fetch('/Mobile/MobileService/OnAction/', params);
    },
    // 获取初始数据
    getTestData() {
      // 4为用户，2为组织
      const items = {
        CompanyNode: { ObjectId: 'C1', UnitID: 'C1', DisplayName: '奥哲科技', Type: 2, UserCount: 100, IsSelected: false },
        Nodes: [{
          UnitID: 'C1',
          DisplayName: '奥哲科技',
          Type: 2,
          UserCount: 10,
          IsSelected: false,
          ChildrenNodes: [{
            ObjectId: 'O1',
            UnitID: 'O1',
            DisplayName: 'ORG1',
            Type: 2,
            UserCount: 10,
            IsSelected: false,
            ChildrenNodes: [
              {
                ObjectId: 'O1O1',
                UnitID: 'O1O1',
                DisplayName: '很长的部门名字为了滑动测试',
                Type: 2,
                UserCount: 10,
                IsSelected: false,
                Avator: '',
                ChildrenNodes: [
                  { ObjectId: 'O1O1O1', UnitID: 'O1O1O1', DisplayName: '111', Type: 2, UserCount: 10, IsSelected: false, Avator: '' },
                  { ObjectId: 'O1O1O2', UnitID: 'O1O1O2', DisplayName: '112', Type: 2, UserCount: 10, IsSelected: false },
                ],
              },
              { ObjectId: 'O1O2', UnitID: 'O1O2', DisplayName: 'O12', Type: 2, UserCount: 10, IsSelected: false, Avator: '' },
              { ObjectId: 'O1O3', UnitID: 'O1O3', DisplayName: 'O13', Type: 2, UserCount: 10, IsSelected: false },
              { ObjectId: 'O1O4', UnitID: 'O1O4', DisplayName: 'O14', Type: 2, UserCount: 10, IsSelected: false },
              { ObjectId: 'U19', UnitID: 'U19', DisplayName: 'U19', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
              { ObjectId: 'U20', UnitID: 'U20', DisplayName: 'U20', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
              { ObjectId: 'U21', UnitID: 'U21', DisplayName: 'U21', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
              { ObjectId: 'U22', UnitID: 'U22', DisplayName: 'U22', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
              { ObjectId: 'U23', UnitID: 'U23', DisplayName: 'U23', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
              { ObjectId: 'U24', UnitID: 'U24', DisplayName: 'U24', Type: 4, UserCount: 1, IsSelected: false },
            ],
          },
          { ObjectId: 'O2', UnitID: 'O2', DisplayName: '非常长得一个部门名字哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', Type: 2, UserCount: 0, IsSelected: false },
          { ObjectId: 'O3', UnitID: 'O3', DisplayName: 'ORG3', Type: 2, UserCount: 0, IsSelected: false, Avator: '' },
          { ObjectId: 'O4', UnitID: 'O4', DisplayName: 'ORG4', Type: 2, UserCount: 10, IsSelected: false, Avator: '' },
          { ObjectId: 'O5', UnitID: 'O5', DisplayName: 'ORG5', Type: 2, UserCount: 10, IsSelected: false },
          { ObjectId: 'O6', UnitID: 'O6', DisplayName: '非常长得一个部门名字哈哈哈哈哈哈哈', Type: 2, UserCount: 10, IsSelected: false },
          { ObjectId: 'O7', UnitID: 'O7', DisplayName: 'ORG7', Type: 2, UserCount: 10, IsSelected: false, Avator: '' },
          { ObjectId: 'O8', UnitID: 'O8', DisplayName: 'ORG8', Type: 2, UserCount: 10, IsSelected: false },
          { ObjectId: 'O9', UnitID: 'O9', DisplayName: '非常长得一个部门名字哈哈哈哈哈哈哈', Type: 2, UserCount: 10, IsSelected: false },
          { ObjectId: 'O10', UnitID: 'O10', DisplayName: 'ORG10', Type: 2, UserCount: 10, IsSelected: false, Avator: '' },
          { ObjectId: 'O11', UnitID: 'O11', DisplayName: 'ORG11', Type: 2, UserCount: 10, IsSelected: false },
          { ObjectId: 'O12', UnitID: 'O12', DisplayName: 'ORG12', Type: 2, UserCount: 10, IsSelected: false },
          { ObjectId: 'U1', UnitID: 'U1', DisplayName: 'User1', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U2', UnitID: 'U2', DisplayName: 'User2', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U3', UnitID: 'U3', DisplayName: 'User3', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U4', UnitID: 'U4', DisplayName: 'User4', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U5', UnitID: 'U5', DisplayName: 'User5', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U6', UnitID: 'U6', DisplayName: 'User6', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U7', UnitID: 'U7', DisplayName: 'User7', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U8', UnitID: 'U8', DisplayName: 'User8', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U9', UnitID: 'U9', DisplayName: 'User9', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U10', UnitID: 'U10', DisplayName: 'User10', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U11', UnitID: 'U11', DisplayName: 'User11', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U12', UnitID: 'U12', DisplayName: 'User12', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U13', UnitID: 'U13', DisplayName: 'User13', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U14', UnitID: 'U14', DisplayName: 'User14', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U15', UnitID: 'U15', DisplayName: 'User15', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U16', UnitID: 'U16', DisplayName: 'User16', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U17', UnitID: 'U17', DisplayName: 'User17', Type: 4, UserCount: 1, IsSelected: false, Avator: '' },
          { ObjectId: 'U18', UnitID: 'U18', DisplayName: 'User18', Type: 4, UserCount: 1, IsSelected: false, Avator: 'https://cn.vuejs.org/images/bit.png' },
          ],
        },
        ],
      };
      const data = {
        Successful: true,
        ReturnData: {
          Data: items,
        },
      };
      return data;
    },
    switchIndex(index) {
      if (index === this.breadCrumbList.length - 1) {
        return;
      }
      this.breadCrumbList.splice(index + 1, this.breadCrumbList.length);
      this.dataList.splice(index + 1, this.dataList.length);
      this.indexNum = this.dataList.length - 1;
    },
    getChildren(item) {
      // if (item.IsSelected) {
      //   return;
      // }
      if (item.ChildrenNodes) {
        this.breadCrumbList.push(item.DisplayName);
        this.dataList.push(item.ChildrenNodes);
        this.indexNum = this.dataList.length - 1;
        this.setSelectedValue();
      }
      // this.$refs.scrollView.refresh();
      this.expandDep(item);
    },
    // 展开部门
    expandDep(item) {
      if (item.Type === 1) {
        item.hasChildren = true;
        // this.$forceUpdate();
      } else {
        const self = this;
        this.getDetailUserData(item, (nodes) => {
          if (nodes && nodes.length > 0) {
            item.hasChildren = true;
          }
          if (self.dataList[self.indexNum + 1].length > 0) {
            self.breadCrumbList.push(item.DisplayName);
            self.indexNum = self.breadCrumbList.length - 1;
          } else {
            self.dataList.splice(self.indexNum + 1, 1);
          }
        });
      }
      // this.$refs.scrollView.refresh();
    },
    setSelectedItem1(item) {
      // 单选,选人,点击直接返回结果
      if (!this.isMultiple || !this.orgUnitVisible) {
        if (item.IsSelected) {
          return;
        }
        if (item.Type === 2) {
          this.getChildren(item);
          return;
        }
        this.selectedItem.splice(0, this.selectedItem.length);
        this.selectedItem.push(item);
        // this.ok(); // 直接跳转到表单控件
      } else {
        // 多选
        if (item.IsSelected) {
          this.selectedItem = this.selectedItem.filter(i => i.ObjectId !== item.ObjectId);
          // 反选全选
          this.isSelectedAll = [''];
          this.isSelectedSearchAll = [''];
        } else {
          this.selectedItem.push(item);
        }
        item.IsSelected = !item.IsSelected;
      }
    },
    setSelectedItem(item) {
      // 如果不能是人且不能选人 返回
      if (item.Type === 4 && !this.userVisible) {
        return;
      }
      // 如果不能是部门且不能选部门 返回
      if (item.Type === 2 && !this.orgUnitVisible) {
        return;
      }
      if (this.isMultiple) {
        // 多选时 如果时选中 那就 selectedItem.push(item) 且 item.
        if (item.IsSelected) {
          item.IsSelected = !item.IsSelected;
          this.selectedItem = this.selectedItem.filter(i => i.ObjectId !== item.ObjectId);
        } else {
          item.IsSelected = true;
          this.selectedItem.push(item);
        }
        this.setSelectedValue();
      } else {
        if (item.IsSelected) {
          item.IsSelected = !item.IsSelected;
          this.selectedItem = [];
        } else {
          // 选中的其他参数的IsSelected 变为false 并删除 在插入
          this.selectedItem.forEach((i) => { i.IsSelected = false; });
          item.IsSelected = true;
          this.selectedItem.splice(0, this.selectedItem.length);
          this.selectedItem.push(item);
        }
      }
    },
    removeSelectItem(item) {
      if (item) {
        this.selectedItem = this.selectedItem.filter(i => i.ObjectId !== item.ObjectId);
      }
    },
    isReadySelectAll() {
      const readyOrgList = this.selectedItem.filter(item => item.Type === 2);
      const readyUserList = this.selectedItem.filter(item => item.Type === 4);
      const isOrgListSelectedAll =
        this.orgList.every(item => readyOrgList.some(i => i.ObjectId === item.ObjectId));
      const isUserListSelectedAll =
        this.userList.every(item => readyUserList.some(i => i.ObjectId === item.ObjectId));
      // s

      if (this.orgUnitVisible && !this.userVisible) {
        return isOrgListSelectedAll;
      }
      if (!this.orgUnitVisible && this.userVisible) {
        return isUserListSelectedAll;
      }
      if (this.orgUnitVisible && this.userVisible) {
        return isUserListSelectedAll && isOrgListSelectedAll;
      }
      return false;
    },
    setSelectedValue() {
      if (this.isReadySelectAll()) {
        this.isSelectedAll = ['all'];
      } else {
        this.isSelectedAll = [''];
      }
    },
    // 常规全选 要与一进页面选中的一致
    toggleSelectAll1() {
      let selectedAll = this.isSelectedAll[0];
      selectedAll = selectedAll === 'all' ? 'all' : '';
      this.isSelectedAll[0] = selectedAll;
      if (selectedAll) {
        for (const obj of this.dataList[this.indexNum]) {
          if (!obj.IsSelected) {
            if (this.companyNode && obj.ObjectId === this.companyNode.ObjectId) {
              this.companyNode.IsSelected = true;
            }
            obj.IsSelected = true;
            this.selectedItem.push(obj);
          }
        }
      } else {
        for (const obj of this.dataList[this.indexNum]) {
          if (this.companyNode && obj.ObjectId === this.companyNode.ObjectId) {
            this.companyNode.IsSelected = false;
          }
          obj.IsSelected = false;
          for (let i = 0; i < this.selectedItem.length; i += 1) {
            if (obj.UnitID === this.selectedItem[i].UnitID) {
              this.selectedItem.splice(i, 1);
            }
          }
        }
      }
    },
    toggleSelectAll() {
      let selectedAll = this.isSelectedAll[0];
      console.log(selectedAll);
      selectedAll = selectedAll === 'all' ? '' : 'all';
      this.isSelectedAll.splice(0, 1, selectedAll);

      if (selectedAll) {
        if (this.orgUnitVisible) {
          if (this.userVisible) {
            this.selectedItem = [];
            this.orgList.forEach((item) => {
              this.$set(item, 'IsSelected', true);
              this.selectedItem.push(item);
            });
            this.userList.forEach((item) => {
              this.$set(item, 'IsSelected', true);
              this.selectedItem.push(item);
            });
          } else {
            this.selectedItem = [];
            this.orgList.forEach((item) => { this.selectedItem.push(item); });
            // this.selectedItem = this.orgList;
            this.selectedItem.forEach((item) => { item.IsSelected = true; });
          }
        } else {
          this.selectedItem = [];
          this.userList.forEach((item) => { this.selectedItem.push(item); });
          // this.selectedItem = this.userList;
          this.selectedItem.forEach((item) => { item.IsSelected = true; });
        }
      } else if (selectedAll === '') {
        this.selectedItem.forEach((item) => { item.IsSelected = false; });
        this.selectedItem = [];
      }
    },
    // 搜索全选
    toggleSearchSelectAll() {
      let selectedAll = this.isSelectedSearchAll[0];
      selectedAll = selectedAll === 'all' ? '' : 'all';
      this.isSelectedSearchAll[0] = selectedAll;
      if (selectedAll) {
        for (const obj of this.searchResultList) {
          if (!obj.IsSelected) {
            obj.IsSelected = true;
            this.selectedItem.push(obj);
          }
        }
      } else {
        for (const obj of this.searchResultList) {
          obj.IsSelected = false;
          for (let i = 0; i < this.selectedItem.length; i += 1) {
            if (obj.UnitID === this.selectedItem[i].UnitID) {
              this.selectedItem.splice(i, 1);
            }
          }
        }
      }
    },
    resetContentHeight() {
      // let reduceHeight = 135; // 搜索 + 面包屑 + 底部高度
      // if (this.showBreadCrumblist) {
      //   reduceHeight += 45;
      // }
      // const screenHeight = window.screen.height;
      // const contentHeight = screenHeight - reduceHeight;
      const height = parseInt(this.$refs.scrollView.$el.parentNode.offsetHeight, 10) - 90;
      this.$refs.scrollView.$el.style.height = `${height}px`;
      // this.$el.querySelector('div.scroll-view-list').style.height = `${contentHeight}px`;
    },
    getSubordinateClass(isSelected) {
      return cx(`${prefixCls}-sbuordinate`, {
        // [`${prefixCls}-sbuordinate-disabled`]: isSelected && this.isMultiple,
      });
    },
    ok() {
      this.$root.eventHub.$emit(
        'assignVal',
        this.selectedItem,
        this.$route.params.keyName,
        this.objectId,
      );
      //
      this.goBack();
    },
    // 删除选中显示的人
    delUser(item, index) {
      this.selectedItem.splice(index, 1);
      this.$set(item, 'IsSelected', false);
      this.setSelectedValue();
      // this.changeSelectedState(item);
    },
    // 删除已选人时把界面上的标记去除
    changeSelectedState(item) {
      const Nodes = this.Nodes[this.indexNum];
      for (const obj of Nodes) {
        if (obj.UnitID === (item.UnitID || item.ObjectId)) {
          obj.IsSelected = !obj.IsSelected;
        }
      }
    },
    goBack() {
      // this.$router.back();
      this.$destroy();
      this.$router.go(-1);
    },
    searchChange(val) {
      this.searchValue = val;
      // 使用URL请求搜索
      // this.getSearchUserData(val, this.filterType, this.showUnActive, this.unitSelectionRange);
      if (val === '') {
        this.searchResultList = [];
      } else {
        this.searchResultList = [
          { ObjectId: 'O8', UnitID: 'O8', DisplayName: 'ORG8', Type: 2, UserCount: 10, IsSelected: false, Avator: '', ParentName: '奥哲网络/研发中心/Paas架构组/测试长的二级描述' },
          { ObjectId: '2', UnitID: '2', DisplayName: 'Test', Type: 4, UserCount: 1, IsSelected: false, Avator: '', ParentName: '奥哲网络/研发中心/Paas研发一部' }];
      }
    },
    searchClear() {
      this.searchValue = '';
    },
    onFocus() {
      // TODO
      this.isSearching = true;
      this.isSearchingOnBlur = false;
      this.searchValue = this.searchValue === '' ? '' : this.searchValue;
    },
    onBlur() {
      // TODO
      // this.total = -1;
      this.isSearchingOnBlur = true;
      if (!this.searchValue) {
        this.isSearching = false;
        this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
      }
    },
    searchFocus() {
      // this.scrollContent();
      this.pickupFoot = true;
    },
    searchBlur() {
      // this.clearSrcoll();
      this.pickupFoot = false;
    },
    scrollContent() {
      this.interval = setInterval(() => {
        this.scrollToEnd();
      }, 500);
    },
    scrollToEnd() {
      document.body.scrollTop = document.body.scrollHeight;
    },
    scrollToTop() {
      document.body.scrollTop = 0;
    },
    scrollFooter(nowLeft) {
      // let scroll = nowLeft - this.lastScrollLeft;
      // let timer = null;
      // clearInterval(timer);
      // timer = setInterval(() => {
      //   if (scroll > 0) {
      //     // 新增 left+
      //     this.$refs.scrollFooter.scrollLeft = this.lastScrollLeft + 1;
      //     scroll = scroll - 1;
      //   }
      //   this.$refs.scrollFooter.scrollLeft = this.lastScrollLeft - 1;
      //   scroll += 1;
      // }, 100);
      // sif (scroll === 0) { clearInterval(timer); }
    },
    clearSrcoll() {
      clearInterval(this.interval);
    },
    getSelectedItemClass(item) {
      if (!this.isMultiple && item.IsSelected) {
        return `${prefixCls}-disabled`;
      }
      return '';
    },
    showSelectedItemPanel() {
      this.showSelectedPanel = true;
    },
    hideSelectedItemPanel() {
      this.showSelectedPanel = false;
    },
  },
  computed: {
    // 部门列表
    orgList() {
      let orgList = [];
      if (this.dataList && this.dataList.length > 0) {
        orgList = this.dataList[this.indexNum].filter(u => u.Type !== 4);
        if (orgList.length > 0) {
          for (const org of orgList) {
            if (org && org.ObjectId
              && this.selectedItem.some(o => o.ObjectId === org.ObjectId)) {
              org.IsSelected = true;
            } else {
              org.IsSelected = false;
            }
          }
        }
      }
      return orgList;
    },
    // 用户列表
    userList() {
      let userList = [];
      if (!this.userVisible) {
        return userList;
      }
      if (this.searchResultList && this.searchResultList.length > 0) {
        userList = this.searchResultList;
      } else if (this.dataList && this.dataList.length > 0) {
        userList = this.dataList[this.indexNum].filter(u => u.Type === 4);
      }
      if (userList.length > 0) {
        for (let i = 0; i < userList.length; i += 1) {
          const user = userList[i];
          if (user && user.ObjectId && this.selectedItem.some(s => s.ObjectId === user.ObjectId)) {
            user.IsSelected = true;
          } else {
            user.IsSelected = false;
          }
        }
      }
      return userList;
    },
    // arrowStr() {
    //   if (this.isMultiple || this.orgUnitVisible) {
    //     return '';
    //   }
    //   return 'horizontal';
    // },
    showSubordinate() {
      // 是否显示下级
      // if (this.isMultiple || this.orgUnitVisible) {
      //   return true;
      // }
      return true;
    },

    // 组织机构是否有一个含有下级
    hasChildrenDepartment() {
      return this.orgList.some(item => item.ChildrenNodes);
    },
    // 多选选择结果
    multipleSelectedResult() {
      const result = {
        userCount: 0,
        deptCount: 0,
        childDeptCount: 0,
      };
      if (this.selectedItem && this.selectedItem.length > 0) {
        for (const sItem of this.selectedItem) {
          if (sItem.Type === 4) {
            result.userCount += 1;
          } else {
            result.userCount += sItem.UserCount;
            if (sItem.Type === 2) {
              result.deptCount += 1;
            }
          }
        }
      }
      return result;
    },
    // 企业人数
    companyUserCount() {
      return this.companyNode.UserCount;
    },
    popupModalShow() {
      if (this.isSearchingOnBlur) {
        return false;
      }
      if (this.isSearching && !this.searchValue) {
        return true;
      }
      return false;
    },
    showListThumb() {
      if (this.isMultiple) {
        return this.orgUnitVisible;
      }
      if (this.orgUnitVisible) {
        return this.hasChildrenDepartment;
      }
      return false;
    },
    showListExtra() {
      if (this.hasChildrenDepartment) {
        return true;
      }
      return !this.isMultiple;
    },
    showUserExtra() {
      if (this.isMultiple) {
        return false;
      }
      return !(this.orgUnitVisible && this.hasChildrenDepartment);
    },
  },
  watch: {
    selectedItem(val) {
      if (val) {
        this.$nextTick(() => {
          const ulwidth = this.$refs.scrollFooter.scrollWidth;
          const divwidth = this.$refs.scrollFooter.clientWidth;
          const left = (ulwidth - divwidth);
          // this.scrollFooter(left);
          this.$refs.scrollFooter.scrollLeft = left;
          this.lastScrollLeft = left;
        });
      }
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/icon/iconfont.css';

@listPrefixCls: h3-list;
@userSelectPrefixCls: h3-user-select;
@checkboxWarpPrefixCls: h3-user-select-checkbox;
@checkboxInnerPrefixCls: ~"@{checkboxWarpPrefixCls}-inner";

.@{checkboxWarpPrefixCls} {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: @icon-size-sm;
  height: @icon-size-sm;

  &-inner {
    position: absolute;
    right: 0;
    width: @icon-size-sm;
    height: @icon-size-sm;
    border: 1 * @hd solid #ccc;
    border-radius: @radius-circle;
    transform: rotate(0deg);
    box-sizing: border-box;

    &:after {
      position: absolute;
      display: none;
      top: 1.5 * @hd;
      right: 6 * @hd;
      z-index: 999;
      width: 5 * @hd;
      height: 11 * @hd;
      border-style: solid;
      border-width: 0 1 * @hd 1 * @hd 0;
      content: '\0020';
      transform: rotate(45deg);
    }
  }

  &-input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    border: 0 none;
    appearance: none;
  }

  &.@{checkboxWarpPrefixCls}-checked {
    .@{checkboxInnerPrefixCls} {
      border-color: @brand-primary;
      background: @brand-primary;

      &:after {
        display: block;
        border-color: #fff;
      }
    }
  }

  &.@{checkboxWarpPrefixCls}-disabled {
    opacity: @opacity-disabled;

    &.@{checkboxWarpPrefixCls}-checked {
      .@{checkboxInnerPrefixCls} {
        border-color: @color-text-caption;
        background: none;

        &:after {
          border-color: @color-text-caption;
        }
      }
    }
  }
}

.@{listPrefixCls} {
  .bottom-line{
    .hairline('bottom', #eee);
  }
  .item-active-cls-active{
    // background: #ddd;
    // box-shadow: -15px 0 0 0 #ddd;
    // margin-left: 0;
    // padding-left: 15px;
  }
  & &-item {
    padding-left: 0 !important;
    margin-left: 15px;
    position: relative; 
    &.@{checkboxWarpPrefixCls}-item {
      .@{listPrefixCls}-thumb {
        width: @icon-size-sm;
        height: @icon-size-sm;

        .@{checkboxWarpPrefixCls} {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: @list-item-height;

          &-inner {
            left: @h-spacing-lg;
            top: 10 * @hd;
          }
        }
      }

      &.@{checkboxWarpPrefixCls}-item-disabled {
        .@{listPrefixCls}-content {
          color: @color-text-disabled;
        }
      }
    }
  }
}

.@{checkboxWarpPrefixCls}-agree {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-left: @h-spacing-lg;
  padding-top: @v-spacing-md;
  padding-bottom: @v-spacing-md;

  .@{checkboxWarpPrefixCls} {
    position: absolute;
    left: 0;
    top: 0;
    width: 2 * @h-spacing-lg;
    height: 100%;

    &-inner {
      left: 0;
      top: 9 * @hd; // @v-spacing-xs + @v-spacing-md;
    }
  }

  .@{checkboxWarpPrefixCls}-agree-label {
    display: inline-block;
    font-size: @font-size-subhead;
    color: @color-text-base;
    line-height: @line-height-paragraph;
    margin-left: 2 * @h-spacing-lg;
    margin-top: 1PX;
  }
}

.@{userSelectPrefixCls} {
  background-color: #f8f8f8;
  .main {
    padding-bottom: 45px;
    .h3-list-thumb{
      .h3-user-select-checkbox-multiple{
        margin-right: 0 !important;
      }
    }
    .h3-list-content-extra{
      .px2rem(width,466) !important;
    }
    .h3-search{
      background-color: #ffffff;
      .h3-search-input{
        background-color: #f4f4f4;
      }
    }
  }
  .breadcrumb-list {
    span {
      color:#999999;
    }
    span:not(:last-child) {
      color:#1890FF;
    }
    .h3-list-content{
      overflow-x: scroll !important;
      white-space: nowrap !important;
      text-overflow: inherit !important;
    }
  } 
  
  .search-number{
    color: #999999;
    display: inline-block;
    .px2rem(margin-left,30);
    .px2rem(font-size,26);
  }

  &-checkbox-multiple {
    margin-right:15px;
  }
  &-disabled {
    opacity: 0.5;
  }
  .select-blue{
    color: #108ee9 !important;
  }
  .selectedBgc{
    background-color: #E6F7FF;
    box-shadow: -15px 0 0 0 #E6F7FF;
  }
  .h3-search-bar {
    background-color: #fff !important;
  }
  .h3-search-bar-input {
    .h3-search-bar-synthetic-ph {
      background-color: #efeff4 !important;
    }
    input[type='search'] {
      background-color: #efeff4 !important;
    }
  }
  .scroll-view-list-content {
    .h3-list-item {
      .h3-list-extra{
        .px2rem(padding-left,30);
        overflow: initial;
        flex: auto;
      }
    }
    .muli-margin{
      .px2rem(margin-left,30);
    }
    .list-avator {
      display:inline-block;
      .px2rem(width,64);
      .px2rem(height,64);
      .px2rem(margin-right,30);
      img{
        .px2rem(width,64);
        .px2rem(height,64);
      }
      span {
          width: 100%;
          height: 100%;
          background-color: #956fea;
          border-radius: 50%;
          text-align: center;
          .px2rem(line-height,64);
          .px2rem(font-size,30);
          display: inline-block;
          color: white;
      }
    }
    .@{userSelectPrefixCls}-sbuordinate {
      color: #108ee9;
      .px2rem(font-size,34);
      .px2rem(padding-left,34);
      // border:none;
      // border-left:1px solid #108ee9;
    }
    .@{userSelectPrefixCls}-sbuordinate-disabled {
      color: #CCCCCC;
      .px2rem(font-size,34);
      .px2rem(padding-left,30);
      // border:none;
      // border-left:1px solid #108ee9;
      // opacity:0.5;
    }
    &-search {
      .h3-list-item {
        position: relative;
        .hairline('bottom',#eee);
        .list-avator{
          margin-right: 0;
        }
      }
    }
  }

  .abs-foorer{
    position: absolute !important;
  }
  &-footer {
    position: fixed;
    display: flex;
    align-items: center;
    bottom: 0;
    .hairline('top',#E4E4E4);
    // border-top: 1PX solid #ddd;
    left: 0;
    right: 0;
    width: 100%;
    .px2rem(height,112);
    z-index: 10000;
    /*font-family: 'PingFang SC';*/
     background-color: #fff; 
    -webkit-transition-duration: 0.2s;
    transition-duration: 0.2s;
    -webkit-transition-property: -webkit-transform display;
    transition-property: -webkit-transform display;
    transition-property: transform display;
    transition-property: transform display, -webkit-transform display;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    // font-size: 16px;
    box-sizing: content-box;
    // text-align: left;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // vertical-align: middle;

    .selected-list-wrap {
      .px2rem(width,544);
      overflow-x: scroll;
      white-space: nowrap;
      height: 100%;
      display: flex;
      align-items: center;
      li {
        display: inline-block;
        position: relative;
        .item-close-icon{
          position: absolute;
          transform: translateX(-50%);
          .px2rem(width,32) !important;
          .px2rem(height,32) !important;
          .px2rem(line-height,32) !important;
          background-color: #999999;
          border-radius: 50%;
          text-align: center;
          .icon-base-close {
            .px2rem(font-size,20);
            color:#fff;
          }
        }
      }
      li:first-child{
        .px2rem(margin-left,30);
      }
      
      .department {
        .px2rem(border-radius,6);
        .px2rem(margin-right,32);
        vertical-align: text-top;
        .name {
          display: inline-block;
          .px2rem(height,56);
          .px2rem(font-size,24);
          .px2rem(line-height,56);
          .px2rem(padding-left,22);
          .px2rem(padding-right,22);
          background-color: rgba(74, 144, 226, 0.1);
          color: rgba(16, 142, 233, 1);
        }
        .item-close-icon{
          transform: translate(-50%,-50%);
          
        }
      }
      .user {
        .px2rem(margin-right,32);
        text-align: center;
        .px2rem(line-height,64);
        padding: 0;
        .user-wrap {
          span {
            color: white;
          }
        }
        span,
        img {
          border-radius: 50%;
          display: inline-block;
          .px2rem(width,64);
          .px2rem(height,64);
        }
        .user-without-avator {
          .px2rem(font-size,24);
        }
        img {
          vertical-align: bottom;
        }
      }
    }

    .@{userSelectPrefixCls}-footer-content {
      padding-left:16px;
      color:#1890FF;
    }

    .footer-group-enter-actice,.footer-group-leave-active{
      transition: all 1s;
    }
    .footer-group-enter,.footer-group-leave-to{
      scrollLeft: 100%;
      // transform:translateX(30px);
    }
  }
}

</style>



