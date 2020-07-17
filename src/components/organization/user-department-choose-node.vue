<template>
    <div id="user-department-choose">
      <!-- :class="[$store.state.corpId?'top-ding':'top-default']" -->
        <div class="content">
            <!-- <search v-model="value" ref="search" :autoFixed='isAutoFixed' @on-cancel="cancelSearch"> -->
              <!-- <span slot="left" class="search-pic icon-search2" :class="[searchPicBol?'search-pic-default':'search-pic-active']"></span> -->
              <!-- <span slot='right' class='h3yun_All close-circle' @click='cancelSearch' v-show='searchWrapShowBol'></span> -->
            <!-- </search> -->
            <H3SearchBar prefixCls="h3-search-opposite" ref="search" v-model="value" placeholder="搜索" :onCancel="cancelSearch" />
        </div>
        <div class="select-section bd-top">
          <div class="bread-crumbs-nav bd-bot">
            <li class="dp-font30" v-for='(item,index) in breadCrumbList' :key="index" @click='switchIdx(index)'>
            <span class="h3yun_All right-o" v-if='index!=0'></span>
              {{item}}</li>
          </div>
          <div class="select-section-content">
            <h3-swiper :min-moving-distance='100' :threshold='100' :show-dots="false" direction="horizontal" :duration='600' :interval='100' v-model='indexNum' v-show='!value' @on-index-change="onIndexChange">
              <h3-swiper-item  style="background:#fff;" v-for='(item,index) in Nodes' :key="index" v-if="item.length>0">
                <div class="swiper-wrapper" ref="swiperWrapper">
                  <ul class="select-list">
                    <li v-if='isMultiple>0&&(!userVisible||(orgUnitVisible&&userVisible))' @click='chooseAll(item,index)'>
                      <div class="check-zone">
                        <div class="icon-zone">
                          <i class="dp-font34" :class="isSelectAllClass(item)"></i>
                        </div>
                        <p class="list-name dp-font30">全选</p>
                      </div>
                    </li>
                    <li v-if='isMultiple&&(userVisible&&!orgUnitVisible)' @click='chooseAll(item,index)'>
                      <div class="user-check-zone">
                        <p class="list-name dp-font30">全选</p>
                        <i class="dp-font34" :class="isSelectAllClass(item)"></i>
                      </div>
                    </li>
                    <li class="bd-bot" v-for='key in item' :key="key.UnitID">
                      <div class="check-zone" @click.stop='chooseDep(key)'>
                        <div class="icon-zone" v-if='!userVisible||(orgUnitVisible&&userVisible)'>
                          <i class="icon-Path" v-if='!isMultiple&&key.IsSelected'></i>
                          <i class="dp-font34" :class="['h3yun_All', key.IsSelected?'check-circle':'circle-o']" v-if='isMultiple'></i>
                        </div>
                        <div class="list-pic dp-font24" v-if="key.Type==4||key.UnitType==4">
                          <img :src="key.Avatar||key.ProfilePhotoUrl" v-if='key.Avatar||key.ProfilePhotoUrl'>
                          <span v-text='setUserName(key)' v-else></span>
                        </div>
                        <p class="list-name dp-font30">{{key.DisplayName}}</p>
                      </div>
                      <div class="expand-zone" @click='expandDepOrChooseUser(key)'>
                        <i class="h3yun_All right-o" v-if='key.Type!=4&&!key.hasChildren'></i>
                        <i class="icon-Path" v-if='key.Type==4&&key.IsSelected&&!isMultiple&&!orgUnitVisible'></i>
                        <i class="dp-font34" :class="['h3yun_All', key.Type==4&&key.IsSelected?'check-circle':'circle-o']" v-if='key.Type==4&&isMultiple&&!orgUnitVisible'></i>
                      </div>
                    </li>
                  </ul>
                </div>
              </h3-swiper-item>
            </h3-swiper>
          </div>
          <div class="search-wrap" v-show='value&&searchWrapShowBol'>
              <div class="search-result-num dp-font30">搜索结果：共{{searchData.length}}条</div>
              <div class="no-result-wrap" v-show='searchData.length<1'>
                  <div class="no-result-content">
                      <span class="icon icon-wujieguo h3yun_All search-o"></span>

                      <p class="dp-font24">未找到"{{value}}"相关结果</p>
                  </div>
              </div>
              <div class="srl-scroll" ref="srlScroll">
              <ul class="search-result-list">
                  <li class="bd-bot" v-for='(item,index) in searchData' :key="index" @click='chooseSearchUser(item)'>
                      <div class="list-avator" v-if='item.ParentName'>
                        <img :src="item.Avatar||item.ProfilePhotoUrl" v-if='item.Avatar||item.ProfilePhotoUrl'>
                        <span v-else>{{item.Name.substr(0,1)}}</span>
                      </div>
                      <div class="list-name">
                          <h2 class="dp-font30">{{item.Name}}</h2>
                          <p class="dp-font24">{{item.ParentName}}</p>
                      </div>
                      <div class="check-mark">
                        <span class="dp-font34" :class="['h3yun_All', item.State==1?'check-circle':'circle-o']" v-if='isMultiple'></span>
                        <span :class="[item.State==0?'':'icon-Path']" v-else></span>
                      </div>
                  </li>
              </ul>
              </div>
              <div class="search-confirm-btn bd-top dp-font32" v-show='isMultiple&&searchData.length>0' @click='confirmSearchUser'>确定</div>
          </div>
        </div>
        <div v-show="!searchWrapShowBol" class="show-selected bd-top">
          <div class="selected-list-wrap">
          <ul>
            <li class="dp-font24" :class="[item.Type==4||item.UnitType==4||item.ParentName?'user':'department']" v-for='(item,index) in selectedItem' :key="item.UnitID||item.ObjectId">
                <div class="user-wrap" v-if="item.Type==4||item.UnitType==4||item.ParentName" @click='delUser(item,index)'>
                  <img :src="item.Avatar||item.ProfilePhotoUrl" v-if='item.Avatar||item.ProfilePhotoUrl'>
                  <span :style='"backgroundColor:"+Colors[index % ColorLength]' v-text='setUserName(item,index)' v-if="!item.Avatar&&!item.ProfilePhotoUrl"></span>
                  <i class="h3yun_All close-circle"></i>
                </div>
                <div class="dep-wrap" v-else @click='delUser(item,index)'>
                  <p class="name dp-font24">{{item.DisplayName||item.Name}}</p>
                  <i class="h3yun_All close-circle"></i>
                </div>
            </li>
          </ul>
          </div>
          <span class="button dp-font30" @click='confirm'>确认{{selectedItem.length==0?'':'('+selectedItem.length+')'}}</span>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import { H3Swiper, H3SearchBar } from 'h3-mobile-vue'
import { UserSelectEntryType } from '../../config/common';
import { getFormUser, getFormUserDetail, searchUser } from '../../service/get-data';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';

export default {
  name: 'userDepartmentChoose',
  components: {
    H3Swiper,
    H3SwiperItem: H3Swiper.Item,
    H3SearchBar,
    // breadcrumb
  },
  props: ['routeParams', 'fromRoute', 'entryType', 'eventMark'],
  data() {
    return {
      value: '',
      isAutoFixed: false,
      dataParams: {},
      companyNode: '',
      Nodes: [],
      eventHub: new Vue(),
      selectedItem: [],
      remarkedItem: [], // 点击选人控件时已经选好的人员
      showUnActive: '',
      unitSelectionRange: '',
      userVisible: '',
      // fromRoute: "",
      // routeParams: "",
      searchData: [],
      filterType: '',
      ObjectId: '',
      orgUnitVisible: '',
      isMultiple: '',
      selectedDep: '',
      breadCrumbList: [],
      indexNum: 0,
      Colors: ['#956FEA', '#FFAD69', '#00A2FF', ' #46CFB6', '#5CD5FC'],
      ColorLength: 5,
      isSelectedAllBol: false,
      allSelectedArr: [],
      selectedSearchArr: [], // 搜索时多选人员部门存储
      searchWrapShowBol: false,
      // forwardBol: false,
      // comments: "",
      // searchPicBol:true,
      swiperScroll: null,
      srlScroll: null,
      isSelectAll: false,
    };
  },
  created() {
    this.ObjectId = this.routeParams.ObjectId;
    this.getDataParams();
    this.getFormUserData(this.dataParams);
  },
  mounted() {
    $('.weui-icon-clear').addClass('close-circle');
    $('.weui-icon-search').addClass('icon-search2');
  },
  methods: {
    getDataParams() {
      // this.routeParams = this.routeParams;
      this.remarkedItem = this.routeParams.value ? this.routeParams.value : [];
      this.selectedItem = JSON.parse(JSON.stringify(this.remarkedItem));
      this.dataParams = { ActionName: 'LoadUnit' };
      // 判断是否是转发流程
      // this.forward = this.routeParams.forward;
      this.showUnActive = this.routeParams.showUnActive;
      this.unitSelectionRange = this.routeParams.unitSelectionRange;
      this.userVisible = this.routeParams.userVisible;
      this.orgUnitVisible = this.routeParams.orgUnitVisible === 'true' || false;
      this.isMultiple = this.routeParams.isMultiple === 'true' || false;
      if (this.userVisible) {
        if (this.unitSelectionRange || this.orgUnitVisible) {
          this.filterType = 2;
        } else {
          this.filterType = 0;
        }
      } else {
        this.filterType = 1;
      }
      // this.getFormUserData(this.showUnActive, this.unitSelectionRange, this.userVisible)
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
      let res = await getFormUser(params);
      if (res.Successful) {
        res = res.ReturnData.Data;
        this.companyNode = res.CompanyNode;
        if (!this.companyNode.DisplayName) {
          this.companyNode.DisplayName = this.$store.state.UserInfo.companyName;
        }
        this.breadCrumbList.push(String(this.companyNode.DisplayName ||
        this.$store.state.UserInfo.companyName));

        if (this.companyNode.UnitID) {
          this.Nodes.push(res.Nodes[0].ChildrenNodes);
          // 把公司信息加入到页面中变成可以选择
          if (
            this.orgUnitVisible &&
            (!this.unitSelectionRange ||
              (this.unitSelectionRange &&
              this.unitSelectionRange.indexOf(this.companyNode.UnitID) > -1))
          ) {
            this.Nodes[0].unshift(this.companyNode);
          }
          // this.remarkSelectedItem(res.Nodes[0].ChildrenNodes);
          this.remarkNodesForNewPage();
        } else {
          this.Nodes.push(res.Nodes);
          if (
            this.orgUnitVisible &&
            (!this.unitSelectionRange ||
              (this.unitSelectionRange &&
              this.unitSelectionRange.indexOf(this.companyNode.UnitID) > -1))
          ) {
            this.Nodes[0].unshift(this.companyNode);
          }
          // this.remarkSelectedItem(res.Nodes);
          this.remarkNodesForNewPage();
        }
        this.$nextTick(() => {
          if (!this.swiperScroll) {
            const wrapper = document.querySelectorAll('.swiper-wrapper')[this.indexNum];
            this.swiperScroll =
            new BScroll(wrapper, { probeType: 3, click: this.bScrollClick(), scrollbar: true });
          }
        });
      }
    },
    // 获取二级数据
    async getDetailUserData(item, callback) {
      let res = await getFormUserDetail(item.UnitID, this.userVisible);
      if (res.Successful) {
        res = res.ReturnData.Data;
        this.Nodes.push(res.Nodes);
        // this.remarkSelectedItem(res.Nodes);
        callback(res.Nodes);
      }
    },
    // 获取搜索数据
    async getSearchUserData(Keyword, FilterType, showUnActive, unitSelectionRange) {
      let res = await searchUser(Keyword, FilterType, showUnActive, unitSelectionRange);
      if (res.Successful) {
        res = res.ReturnData.Data;
        this.searchData = res.Deps.concat(res.Users);
        this.remarkSelectedItemForSearchData();
        this.remarkSelectedSearchArrData();
        this.$nextTick(() => {
          if (!this.srlScroll) {
            const wrapper = document.querySelector('.srl-scroll');
            this.srlScroll = new BScroll(wrapper, { probeType: 3, click: this.bScrollClick() });
          }
        });
      }
    },
    goBack () {
      this.$router.go(-1);
    },
    // 确认选项
    confirm () {
      let event;
      const prefix = 'Form/ViewModel/';
      if (this.eventMark) {
        event = `assignVal${this.eventMark}`;
      } else {
        event = 'assignVal';
      }
      if (this.entryType !== UserSelectEntryType.Other) {
        if (this.selectedItem.length > 9) {
          H3PluginDeveloper.IShowWarn('最多只能选择9个');
          this.selectedItem = this.selectedItem.splice(0, 9);
        } else if (!this.selectedItem.length) {
          H3PluginDeveloper.IShowWarn('至少选择一人');
          return;
        }
        if (this.$route.params.namespace) {
          this.$store.dispatch(prefix + Action.INPUT, {
            namespace: this.$route.params.namespace,
            value: this.selectedItem,
          });
        } else {
          this.$root.eventHub.$emit(
            event,
            this.selectedItem, this.$route.params.keyName, this.ObjectId,
          );
        }
      } else {
        if (this.$route.params.namespace) {
          this.$store.dispatch(prefix + Action.INPUT, {
            namespace: this.$route.params.namespace,
            value: this.selectedItem,
          });
        } else {
          this.$root.eventHub.$emit(
            event, this.selectedItem,
            this.$route.params.keyName, this.ObjectId,
          );
        }
        this.$router.go(-1);
      }
    },
    // 选择部门
    chooseDep (item) {
      if (!this.orgUnitVisible) {
        this.expandDepOrChooseUser(item);
      } else if (this.orgUnitVisible) {
        this.setUserOrDepValue(item);
      }
    },
    // 展开部门或者选择人员
    expandDepOrChooseUser(items) {
      const item = items;
      if (item.Type === 1) {
        item.hasChildren = true;
        this.$forceUpdate();
      } else if (item.Type === 4) {
        if (this.userVisible) {
          this.setUserOrDepValue(item);
        }
      } else {
        const self = this;
        this.getDetailUserData(item, (nodes) => {
          if (!nodes.length) {
            item.hasChildren = true;
          }
          if (self.Nodes[self.indexNum + 1].length > 0) {
            self.breadCrumbList.push(item.DisplayName);
            self.indexNum = self.breadCrumbList.length - 1;
            self.remarkNodesForNewPage();
            self.$nextTick(() => {
              const wrapper = document.querySelectorAll('.swiper-wrapper')[self.indexNum];
              self.swiperScroll =
              new BScroll(wrapper, { probeType: 3, click: self.bScrollClick(), scrollbar: true });
            });
          } else {
            self.Nodes.splice(self.indexNum + 1, 1);
          }
        });
      }
    },
    // 设置人员或者部门的选中与否
    setUserOrDepValue(item) {
      if (item.IsSelected) {
        for (let i = 0; i < this.selectedItem.length; i += 1) {
          if ((this.selectedItem[i].ObjectId || this.selectedItem[i].UnitID) === item.UnitID) {
            this.selectedItem.splice(i, 1);
            break;
          }
        }
      } else {
        if (!this.isMultiple) {
          for (const arr of this.Nodes) {
            for (const itemss of arr) {
              itemss.IsSelected = false;
            }
          }
          this.selectedItem.splice(0, this.selectedItem.length);
        }
        this.selectedItem.push(item);
      }
      this.$set(item, 'IsSelected', !item.IsSelected);
    },
    // 展示人名的方法
    setUserName(item) {
      let userName = item.Name || item.DisplayName;
      userName = userName && userName.substr(0, 1);
      return userName;
    },
    // 面包屑的index页面跳转
    switchIdx(index) {
      this.indexNum = index;
      this.breadCrumbList.splice(index + 1, this.breadCrumbList.length);
      this.Nodes.splice(index + 1, this.Nodes.length);
    },
    // 全选
    chooseAll(item) {
      const filterVal = this.chooseAllFilter(item);
      // 人员下面还有可能有部门，只能选人的时候部门不会勾选上，所有长度的判断需要看条件
      let length = 0;
      for (const obj of item) {
        if (this.userVisible && !this.orgUnitVisible && obj.Type === 4) {
          length += 1;
        } else if (!this.userVisible && this.orgUnitVisible && obj.Type !== 4) {
          length += 1;
        } else if (this.userVisible && this.orgUnitVisible) {
          length += 1;
        }
      }
      // 全选
      if (filterVal.repeatItems.length < length) {
        this.selectedItem.splice(0, this.selectedItem.length);
        for (const obj of item) {
          if (this.userVisible && !this.orgUnitVisible && obj.Type === 4) {
            this.selectedItem.push(obj);
            obj.IsSelected = true;
          } else if (!this.userVisible && this.orgUnitVisible && obj.Type !== 4) {
            this.selectedItem.push(obj);
            obj.IsSelected = true;
          } else if (this.userVisible && this.orgUnitVisible) {
            this.selectedItem.push(obj);
            obj.IsSelected = true;
          }
        }
        this.selectedItem = this.selectedItem.concat(filterVal.otherItems);
      } else {
        // 全取消
        for (const obj of item) {
          obj.IsSelected = false;
          for (let i = 0; i < this.selectedItem.length; i += 1) {
            if (obj.UnitID === this.selectedItem[i].UnitID) {
              this.selectedItem.splice(i, 1);
            }
          }
        }
      }
    },
    // 过滤当前页面重复的和其他页面选中的
    chooseAllFilter(items) {
      const repeatItems = [];
      const otherItems = [];
      let flag;
      this.selectedItem.some((selected) => {
        flag = false;
        items.some((item) => {
          if (item.UnitID === (selected.UnitID || selected.ObjectId)) {
            flag = true;
            return null;
          }
          return null;
        });
        if (flag) {
          repeatItems.push(selected);
        } else {
          otherItems.push(selected);
        }
        return null;
      });

      return { repeatItems, otherItems };
    },
    // 控制全选icon显示
    isSelectAllClass(item) {
      let flag = false;
      let length = 0;
      item.some((obj) => {
        if (this.userVisible && !this.orgUnitVisible && obj.Type === 4) {
          length += 1;
          if (!obj.IsSelected) {
            flag = true;
            return false;
          }
        } else if (!this.userVisible && this.orgUnitVisible && obj.Type !== 4) {
          length += 1;
          if (!obj.IsSelected) {
            flag = true;
            return false;
          }
        } else if (this.userVisible && this.orgUnitVisible) {
          length += 1;
          if (!obj.IsSelected) {
            flag = true;
            return false;
          }
        }
        return null;
      });
      flag = length > 0 ? flag : true;
      // this.isSelectAll=flag?false:true;
      return ['h3yun_All', !flag ? 'check-circle':'circle-o'];
    },
    // 选择搜索结果的用户
    chooseSearchUser(items) {
      const item = items;
      if (this.isMultiple) {
        if (item.State === 0) {
          this.selectedSearchArr.push(item);
        } else {
          for (let i = 0; i < this.selectedSearchArr.length; i += 1) {
            if (this.selectedSearchArr[i].ObjectId === item.ObjectId) {
              this.selectedSearchArr.splice(i, 1);
            }
          }
          this.clearSelectedItem(item);
        }
      } else {
        this.selectedItem.splice(0, this.selectedItem.length);
        if (item.State === 0) {
          this.selectedItem.push(item);
        }
        this.searchWrapShowBol = false;
        this.value = '';
        this.searchData.splice(0, this.searchData.length);
        this.remarkNodes(item);
      }
      item.State = item.State === 0 ? 1 : 0;
    },
    // 确认多个搜索结果选择的用户
    confirmSearchUser() {
      this.selectedItem.push.call(this.selectedItem, ...this.selectedSearchArr);
      this.value = '';
      this.searchWrapShowBol = false;
      this.remarkMultipleNodes(this.selectedSearchArr);
      this.selectedSearchArr.splice(0, this.selectedSearchArr.length);
      this.searchData.splice(0, this.searchData.length);
    },
    // 搜索结果出来的时候需要把已选择的标记上
    remarkSelectedItemForSearchData() {
      if (this.selectedItem.length > 0) {
        this.selectedItem.some((item) => {
          this.searchData.some((objs) => {
            const obj = objs;
            if ((item.UnitID || item.ObjectId) === obj.ObjectId) {
              obj.State = 1;
              if (!this.isMultiple) {
                this.selectedSearchArr.push(obj);
                return false;
              }
            }
            return null;
          });
          return null;
        });
      }
    },
    // 把之前搜索的并且已经选中的标记上
    remarkSelectedSearchArrData() {
      if (this.selectedSearchArr.length > 0) {
        this.selectedSearchArr.some((item) => {
          this.searchData.some((objs) => {
            const obj = objs;
            if (item.ObjectId === obj.ObjectId) {
              obj.State = 1;
            }
            return null;
          });
          return null;
        });
      }
    },
    // 把Nodes的所选中值重新标记 单个
    remarkNodes(item) {
      this.Nodes[this.indexNum].some((nodeItems) => {
        const nodeItem = nodeItems;
        nodeItem.IsSelected = false;
        if (nodeItem.UnitID === item.ObjectId) {
          nodeItem.IsSelected = !nodeItem.IsSelected;
          return false;
        }
        return null;
      });
    },
    // 确定搜索结果后把Nodes的所选中值重新标记 多个
    remarkMultipleNodes(itemArr) {
      this.Nodes[this.indexNum].some((nodeItems) => {
        const nodeItem = nodeItems;
        itemArr.some((item) => {
          if (nodeItem.UnitID === item.ObjectId) {
            nodeItem.IsSelected = true;
          }
          return null;
        });
        return null;
      });
    },
    // 页面跳转的时候需要把已选择的标记上
    remarkNodesForNewPage() {
      if (this.selectedItem.length > 0) {
        this.selectedItem.some((item) => {
          this.Nodes[this.indexNum].some((objs) => {
            const obj = objs;
            if ((item.ObjectId || item.UnitID) === obj.UnitID) {
              obj.IsSelected = !obj.IsSelected;
              if (!this.isMultiple) {
                return false;
              }
            }
            return null;
          });
          return null;
        });
      }
    },
    // 搜索时把已选中的在选中的数组里清除
    clearSelectedItem(item) {
      this.selectedItem.some((obj, idx) => {
        if ((obj.UnitID || obj.ObjectId) === item.ObjectId) {
          this.selectedItem.splice(idx, 1);
        }
        return null;
      });
    },
    onIndexChange(index) {
      console.log( 'onIndexChange ' + index )
      this.indexNum = index;
      this.breadCrumbList.splice(index + 1, this.breadCrumbList.length);
      this.Nodes.splice(index + 1, this.Nodes.length);
    },
    // 取消关键字过滤
    cancelSearch() {
      this.value = '';
      this.searchWrapShowBol = false;
      $(this.$el)
        .find('.weui-search-bar__cancel-btn')
        .click();
    },
    // 删除选中显示的人
    delUser(item, index) {
      this.selectedItem.splice(index, 1);
      this.changeSelectedState(item);
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
    bScrollClick() {
      if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
      if (/Chrome/i.test(navigator.userAgent)) return /Android/i.test(navigator.userAgent);
      if (/Silk/i.test(navigator.userAgent)) return false;
      if (/Android/i.test(navigator.userAgent)) {
        const s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
        return parseFloat(s[0] + s[3]) >= 44;
      }
      return null;
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.searchWrapShowBol = true;
        this.getSearchUserData(val, this.filterType, this.showUnActive, this.unitSelectionRange);
      } else {
        this.searchWrapShowBol = false;
      }
    },
    selectedItem(val) {
      if (val) {
        this.$nextTick(() => {
          const ulwidth = $('.show-selected')
            .find('ul')
            .width();
          const wrapwidth = $('.show-selected')
            .find('.selected-list-wrap')
            .width();
          if (ulwidth > wrapwidth) {
            $('.show-selected')
              .find('.selected-list-wrap')
              .scrollLeft(ulwidth - wrapwidth);
          }
        });
      }
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
#user-department-choose {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  .h3-slider{
    flex: 1;
    flex-grow: 1;
    height:100%;
    .h3-swiper{
      height:100% !important;
    }
  }
  .check-circle,
  .icon-Path {
    color: #108ee9;
  }
  .close-circle {
    color: #999999;
  }
  .top-ding {
    margin-top: 0;
  }
  .top-default {
    .px2rem(margin-top,98);
  }
  .check-circle {
    .px2rem(font-size, 34);
  }
  .weui-search-bar {
    .px2rem(padding-top,24);
    .px2rem(padding-bottom,24);
    .px2rem(padding-left,50);
    .px2rem(padding-right,50);
    background-color: white;
    .search-pic {
      color: #999999;
      position: absolute;
      .px2rem(top, 44);
      z-index: 9;
    }
    .search-pic-default {
      .px2rem(left, 312);
    }
    .search-pic-active {
      .px2rem(left, 76);
    }
  }
  .weui-search-bar__label {
    background-color: #f2f3f5;
    // line-height: 0.55rem;
    .px2rem(line-height,55);
  }
  .weui-search-bar__box {
    display: flex;
    align-items: center;
    // height: 0.66rem;
    .px2rem(height,66);
    background-color: #f2f3f5;
  }
  .weui-search-bar__cancel-btn {
    color: #108ee9;
  }
  .weui-icon-search {
    color: #999999;
    top: auto;
    // display: none;
  }
  // .content{
  //   .close-circle{
  //       position: absolute;
  //       .px2rem(right, 144);
  //       .px2rem(top, 42);
  //       z-index: 3;
  //   }
  // }
  .show-selected {
    .px2rem(height,98);
    .px2rem(width,714);
    // width: 100%;
    position: fixed;
    bottom: 0;
    // border-top: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    .px2rem(padding-right,12);
    .px2rem(padding-left,24);
    background-color: white;
    .button {
      display: inline-block;
      .px2rem(width,138);
      .px2rem(height,62);
      // background-color: #108ee9;
      background-color: #108ee9;
      color: white;
      .px2rem(border-radius,10);
      text-align: center;
      .px2rem(line-height,62);
    }
    .selected-list-wrap {
      .px2rem(width,575);
      .px2rem(margin-right,28);
      overflow-x: scroll;
      white-space: nowrap;
      height: 100%;
      display: flex;
      align-items: center;
      .user:before {
        display: none;
        content: "";
      }
      li {
        display: inline-block;
        position: relative;
        .close-circle {
          position: absolute;
          // right: -0.1rem;
          .px2rem(right,-10);
          // top: -0.1rem;
          .px2rem(top,-10);
        }
        .user-wrap {
          span {
            color: white;
          }
        }
      }
      .department {
        .px2rem(border-radius,6.4);
        .px2rem(margin-right,29);
        .name {
          display: inline-block;
          .px2rem(padding-top,10);
          .px2rem(padding-bottom,10);
          .px2rem(padding-left,22);
          .px2rem(padding-right,22);
          background-color: rgba(74, 144, 226, 0.1);
          color: rgba(16, 142, 233, 1);
        }
      }
      .user {
        .px2rem(margin-right,35.2);
        text-align: center;
        .px2rem(line-height,58.3);
        padding: 0;
        span,
        img {
          .px2rem(width,58.3);
          .px2rem(height,58.3);
        }
        span {
          display: inline-block;
          border-radius: 50%;
        }
        img {
          border-radius: 50%;
          vertical-align: bottom;
        }
      }
    }
  }
  .select-section {
    // padding-left: 0.24rem;
    .px2rem(padding-left,24);
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    // border-top: 1px solid #ebebeb;
    .bread-crumbs-nav {
      .px2rem(line-height,98);
      // border-bottom: 1px solid #ebebeb;
      li {
        display: inline-block;
        color: #108ee9;
        .px2rem(margin-left,8);
        &:last-child {
          color: #999999;
        }
      }
    }
    .select-section-content{
      flex:1;
      .h3-slider{
        width: calc(100% - 12px) !important;
        height: calc(100% - 98/75 * 1rem) !important;
        position: absolute;
      }
    }
    .select-list {
      .circle-o{
        color: #888;
      }
      .check-circle{
        color: #108ee9;
      }
      .px2rem(padding-bottom,98);
      li {
        .px2rem(min-height,98);
        display: flex;
        align-items: center;
        .px2rem(padding-right,24);
        // border-bottom: 1px solid #ebebeb;
        .check-zone {
          width: 70%;
          height: 100%;
          display: flex;
          align-items: center;
          .list-pic {
            .px2rem(margin-right,14.7);
            text-align: center;
            .px2rem(line-height,58.3);
            span,
            img {
              .px2rem(width,58.3);
              .px2rem(height,58.3);
            }
            span {
              display: inline-block;
              border-radius: 50%;
              background-color: rgb(149, 111, 234);
              color: white;
            }
            img {
              border-radius: 50%;
              vertical-align: bottom;
            }
          }
          .list-name {
            display: inline-block;
            color: #000000;
            white-space: pre-wrap;
            width: 90%;
          }
          .icon-zone {
            width: 10%;
            display: inline-block;
            // margin-right: 0.2rem;
            .px2rem(margin-right,20);
            height: auto;
          }
        }
        .expand-zone {
          width: 30%;
          height: 100%;
          text-align: right;
          .px2rem(line-height,98);
          .right-o {
            float: right;
            .px2rem(line-height,98);
            color: #999999;
          }
        }
      }
      .user-check-zone {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .search-wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: white;
      width: 100%;
      // height: 11.3rem;
      // .px2rem(height,1130);
      z-index: 3;
      overflow: scroll;
      .search-result-num {
        // height: 0.7rem;
        .px2rem(height,70);
        color: #999999;
        display: flex;
        align-items: flex-end;
        // padding-left: 0.24rem;
        .px2rem(padding-left,24);
      }
      .srl-scroll {
        position: absolute;
        bottom: 0;
        width: 100%;
        overflow: hidden;
        // top:0;
        .px2rem(top, 98);
      }
      .search-result-list {
        .px2rem(padding-bottom,98);
        .px2rem(padding-left,24);
        li {
          display: flex;
          align-items: center;
          // height: 0.98rem;
          .px2rem(height,98);
          // border-bottom: 1px solid #ebebeb;
          position: relative;
          .list-name {
            width: 78%;
            h2 {
              color: #000000;
            }
            p {
              color: #999999;
            }
          }
          .list-avator {
            width: 12%;
            span {
              .px2rem(width,58);
              .px2rem(height,58);
              background-color: #956fea;
              border-radius: 50%;
              text-align: center;
              // line-height: 0.58rem;
              .px2rem(line-height,58);
              display: inline-block;
              color: white;
            }
            img {
              .px2rem(width,58);
              .px2rem(height,58);
              border-radius: 50%;
            }
          }
          .check-mark {
            position: absolute;
            // right: 0.24rem;
            .px2rem(right,24);
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .no-result-wrap {
        height: 100%;
        display: flex;
        justify-content: center;
        .no-result-content {
          // margin-top: 1.6rem;
          .px2rem(margin-top,160);
          text-align: center;
          .icon {
            // font-size: 2rem;
            .px2rem(font-size,200);
            color: #999999;
          }
          .icon-wujieguo {
            border: 1px solid #b7b7b7;
            border-radius: 50%;
            color: #b7b7b7;
          }
          p {
            // margin-top: 0.45rem;
            .px2rem(margin-top,45);
            color: #999999;
          }
        }
      }
      .search-confirm-btn {
        bottom: 0;
        // height: 0.98rem;
        .px2rem(height,98);
        text-align: center;
        width: 100%;
        // line-height: 0.98rem;
        .px2rem(line-height,98);
        color: #108ee9;
        // border-top: 1px solid #ebebeb;
        background-color: white;
        position: absolute;
        z-index: 10;
      }
    }
    .swiper-wrapper {
      position: absolute;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      top: 0;
      overflow-y: auto;
      // .px2rem(top, 98);
    }
  }
}
</style>
