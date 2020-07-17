<template>
  <h3-list :className="wrapCls">
    <!--提示语-->
    <div class="h3-field-tip" v-if="showTip">
      <div class="h3-field-tip-wrapper">
        <div v-html="tip"></div>
      </div>
      <div class="h3-field-tip-arrow" ></div>
    </div> 
    <!--标题-->
    <h3-list-item 
    :touchFeedback="false" :has-content-line="false" :hasExtra="true">
       <h3-label
        :label="title"
        :labelCls="readonly ? 'label-view' : 'label-edit'"
        :required="required"
        :layout="layout"
        :tip="tip"
        @onToggleTip="toggleTip"
        />
        <div slot="extra" class="selected-number" v-if="selectedUserItem.length > 0 || selectedOrgItem.length > 0 && !readonly">
          已选择
          <span class="selected-number-user" v-if="selectedUserItem.length > 0">{{selectedUserItem.length}}</span>
          <template v-if="selectedUserItem.length > 0">人</template>
          <template v-if="selectedUserItem.length > 0 && selectedOrgItem.length > 0">,</template>
          <span class="selected-number-user" v-if="selectedOrgItem.length > 0">{{selectedOrgItem.length}}</span>
          <template v-if="selectedOrgItem.length > 0">个部门</template>
        </div>
      <span v-html="notes" class="h3-multiuser-notes"></span>
    </h3-list-item>
    <h3-list-item :touchFeedback="false">
      <div ref="department" id="department" :class="departmentCls">
        <!--人员-->
        <ul class="h3-multiuser-user-list" v-if= "selectedUserItem.length > 0" >
          <li class="h3-multiuser-user-list-li" 
            v-for="(item,index) in selectedUserItem" :key="index"
            @click="delecteUser(item)">
            <span class="h3-multiuser-user-select-item" 
              :style='"backgroundColor:"+Colors[index % ColorLength]'>
              <img v-if="item.Avator" :src="item.Avator"></img>
              <span v-else>{{getUserName(item)}}</span>
              <span class="department-close" style="top:0px; right: -0.21rem"
                v-if="!disabled && !readonly" @click="removeSelectItem(item)">
                <i class="icon aufont icon-base-close" ></i>
              </span>
            </span>
            <p class="h3-multiuser-user-font">{{item.Name || item.DisplayName }}</p>
          </li>
          <li class="h3-multiuser-user-list-li" v-if="showUserAdd">
            <span class="h3-multiuser-user-select-item" @click="toSelectPage">
              <i class="icon aufont icon-base-plus-circle"></i>
            </span>
            <p class="h3-multiuser-user-font">添加</p>
          </li>
        </ul>
        <!--部门-->
        <ul class="h3-multiuser-user-list" v-if= "selectedOrgItem.length > 0">
          <div v-for="(item,index) in selectedOrgItem" :key="index" class="department-item" @click="delecteOrg(item)">
            <li is="h3-org-tag" prefixCls="h3-multiuser" :selectedItem="item" >
            </li>
            <span class="department-close" v-if="!readonly">
              <i class="icon aufont icon-base-close"></i>
            </span>
          </div>
          <li class="h3-multiuser-user-list-li" v-if="showOrgAdd">
            <span class="h3-multiuser-user-select-item" @click="toSelectPage">
              <i class="icon aufont icon-base-plus-circle" ></i>
            </span>
            <p class="h3-multiuser-user-font">添加</p>
          </li>
        </ul>
      </div>
      <!--初始添加按钮-->
      <ul class="h3-multiuser-user-list" v-if="selectedUserItem.length < 1 && selectedOrgItem.length < 1 && !readonly">
        <li class="h3-multiuser-user-list-li">
          <span class="h3-multiuser-user-select-item" @click="toSelectPage">
            <i class="icon aufont icon-base-plus-circle" ></i>
          </span>
          <p class="h3-multiuser-user-font">添加</p>
        </li>
      </ul>
      <!--更多-->
      <ul class="h3-multiuser-user-list" 
        style="justify-content: flex-end;" 
        @click="onClickMore" v-if="readonly && departmentHeight > 163 ">
        <li class="h3-multiuser-user-list-more">{{packMessage}}</li>
        <li class="h3-multiuser-user-list-more" :class="[isRotate ? 'h3-rotate': 'h3-re-rotate']">
          <i class="icon aufont icon-base-down" ></i>
        </li>
      </ul>
    </h3-list-item>
  </h3-list>
</template>
<script>
import cx from 'classnames';
import h3List from '../h3-list/h3-list';
import h3ListItem from '../h3-list/h3-list-item';
import h3OrgTag from './h3-org-tag';
import { H3Label } from 'h3-mobile-vue';

const prefixCls = 'h3-multiuser';
export default {
  name: 'h3-user',
  components: {
    h3List,
    h3ListItem,
    h3OrgTag,
    H3Label,
  },
  props: {
    required: Boolean,
    readonly: {
      type: Boolean,
      default: true,
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    title: String,
    notes: String,
    showUnActive: Boolean,
    unitSelectionRange: String,
    userVisible: Boolean,
    orgUnitVisible: Boolean,
    isEidting: {
      type: Boolean,
      default: false,
    },
    dataField: {
      type: String,
      required: true,
    },
    objectId: {
      type: String,
      required: true,
      default: '1234567890',
    },
    layout: {
      type: String,
      default: 'h',
      validator: val => ['h', 'v'].indexOf(val) > -1,
    },
    tip: {
      type: String,
      default: '',
    },
    errMsg: {
      type: String,
      default: '',
    },
    initSelectedItem: {
      type: Array,
      default: () => ([]),
    },
    initSelectedOrgItem: {
      type: Array,
      default: () => ([]),
    },
    initSelectedUserItem: {
      type: Array,
      default: () => ([]),
    },
    // selectedItem: Array,
    // selectedOrgItem: Array,
    // selectedUserItem: Array,
  },
  data() {
    return {
      Colors: ['#17C295', '#4DA9EB', '#F7B55E', '#F2725E', '#568AAD', '#B38979', '#8A8A8A'],
      ColorLength: 7,
      selectedItem: this.initSelectedItem,
      selectedOrgItem: this.initSelectedOrgItem,
      selectedUserItem: this.initSelectedUserItem,
      showTip: false,
      isPackUp: true,
      packMessage: '更多',
      isRotate: false,
      departmentHeight: 0,
    };
  },
  // beforeRouterEnter(to, from, next) {

  // },
  activated() {
    if (this.selectedOrgItem.length > 0 || this.selectedUserItem.length > 0) {
      this.departmentHeight = this.$refs.department.offsetHeight;
    }
  },
  created() {
    this.$root.eventHub.$on('assignVal', this.assignVal);
  },
  mounted() {
    if (this.selectedOrgItem.length > 0 || this.selectedUserItem.length > 0) {
      this.departmentHeight = this.$refs.department.offsetHeight;
    }
  },
  updated() {
  },
  methods: {
    onClickMore() {
      this.isPackUp = !this.isPackUp;
      this.isRotate = !this.isRotate;
      if (!this.isPackUp) {
        this.packMessage = '收起';
      } else {
        this.packMessage = '更多';
      }
    },
    toSelectPage() {
      // readonly
      if (this.disabled) {
        return;
      }
      this.$router.push({
        name: 'userselect',
        params: {
          showUnActive: this.showUnActive,
          unitSelectionRange: this.unitSelectionRange,
          userVisible: this.userVisible,
          orgUnitVisible: this.orgUnitVisible,
          isMultiple: this.isMultiple,
          keyName: this.dataField,
          ObjectId: this.objectId,
          value: this.selectedItem,
          // showSelectedPanel: true,
        },
      });
    },
    // 把选中的部门或人赋值给该控件
    assignVal(itemArr, keyName, objectId) {
      if (objectId !== this.objectId || keyName !== this.dataField) {
        return;
      }
      this.selectedItem = itemArr || [];
      this.selectedUserItem = this.selectedItem.filter(item => item.Type === 4);
      this.selectedOrgItem = this.selectedItem.filter(item => item.Type !== 4);
    },
    removeSelectItem(item) {
      let index = 0;
      let i = 0;
      for (const it of this.selectedItem) {
        if (it.ObjectId === item.ObjectId) {
          index = i;
          break;
        }
        i += 1;
      }
      this.selectedItem.splice(index, 1);
      // this.selectedItem = this.selectedItem.filter(s => s.ObjectId !== item.ObjectId);
    },
    getUserName(item) {
      let userName = item.Name || item.DisplayName;
      userName = userName.substr(userName.length - 2);
      return userName;
    },
    toggleTip() {
      this.showTip = !this.showTip;
    },
    delecteUser(item) {
      if (this.readonly) {
        return;
      }
      const index = this.selectedUserItem.findIndex(user => user.UnitID === item.UnitID);
      this.selectedUserItem.splice(index, 1);
    },
    delecteOrg(item) {
      if (this.readonly) {
        return;
      }
      const index = this.selectedOrgItem.findIndex(user => user.UnitID === item.UnitID);
      this.selectedOrgItem.splice(index, 1);
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, {
        [`${prefixCls}-disabled`]: this.disabled,
      });
    },
    departmentCls() {
      return cx({
        'select-area-edit-beyond': !this.readonly,
        'select-area-view-beyond': this.readonly,
        'select-area-view-pickdown': this.readonly && this.isPackUp,
      });
    },
    showUserAdd() {
      if (this.readonly) { return false; }
      if (this.isMultiple) {
        return this.selectedOrgItem.length < 1;
      }
      return this.selectedUserItem.length < 1;
    },
    showOrgAdd() {
      if (this.readonly) { return false; }
      if (this.isMultiple) {
        return this.selectedUserItem.length > 0 || this.selectedOrgItem.length > 0;
      }
      return this.selectedOrgItem.length < 1;
    },
  },
  watch: {
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

@userPrefixCls: h3-multiuser;
@field-label-color: #333333;
@field-text-color: #333333;
@field-label-color-view: #999999;

.@{userPrefixCls} {
  &-disabled {
    opacity: 0.5;
  }
  .h3-list-item{
    .h3-list-line{
      border-color: #fff;
    }
    .h3-list-content{
      display: inline-block;
      padding: 0 !important;
      .h3-field-layout-h-label {
        .px2rem(padding-right,30);
        .px2rem(width,280);
        // width: auto;
        box-sizing: content-box;
        display: flex;
        .label-view{
          color: #999999;
        }
        .label-edit{
          color: #333333;
        }
        span{
          display: inline-block;
          .px2rem(max-width,216);
          .px2rem(font-size,34);
        }
        .h3-field-layout-label-required{
          .px2rem(padding-top,20);
          
        }
        .h3-field-label-tip{
          position: relative;
          margin-left: auto;
          top: 0;
        }
        word-break: break-all;
        white-space: normal;
      }
    }
    .h3-list-extra{
      display: inline-block;
      .selected-number{
        color: #999999;
        .px2rem(font-size,34);
        display: flex;
        align-items: center;
        flex-direction: row;
        &-user{
          display: inline-block;
          .px2rem(max-width,64);
          // .px2rem(line-height,24);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    
  }
  
  .department-close{
    display: inline-block;
    position: absolute;
    .px2rem(top,16);
    .px2rem(right,0);
    .px2rem(height,32);
    .px2rem(line-height,32);
    .px2rem(width,32);
    background-color: #999999;
    border-radius: 50%;
    text-align: center;
    .icon-base-close {
      color:#fff;
      .px2rem(font-size,20);
    }
    .icon-base-plus-circle {
      .px2rem(font-size,72);
      color: #ddd;
    }
  }
  .select-area-edit-beyond{
    .px2rem(max-height,438);
    overflow-y: scroll;
  }
  .select-area-view-beyond{
    .px2rem(padding-top,8);
    overflow-y: hidden;
  }
  .select-area-view-pickdown{
    .px2rem(max-height,384);
  }
  &-user-list {
    font-size:14px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .department-item{
      position: relative;
      .px2rem(height,112);
      display: flex;
      align-items: center;
      .px2rem(padding-left,10);
      .px2rem(padding-right,10);
      .px2rem(margin-bottom,16);
    }
    &::after {
      content:"";
      display: block;
      clear: both;
    }
    .@{userPrefixCls}-placeholder {
      color: @field-label-color-view;
    }
    .@{userPrefixCls}-select-selection__choice {
      border-radius: 4px;
      cursor: default;
      float: left;
      .px2rem(padding-left,16);
      .px2rem(padding-right,16);
      // max-width: 99%;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      background-color: #EAF5F5;
      box-sizing: border-box;
      .px2rem(height,56);
    }
    .@{userPrefixCls}-select-selection__choice-active {
        background-color: rgba(56,173,255,0.1) !important;
    }
    .@{userPrefixCls}-select-selection__choice__content{
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .px2rem(max-width,610);
      // max-width: 100%;
      -webkit-transition: margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      color:#1890FF;
      .px2rem(font-size,24);
      .px2rem(height,56);
      .px2rem(line-height,56);
    }
    .@{userPrefixCls}-user-list-more{
      .px2rem(margin-right,16);
      list-style: none;
      .px2rem(font-size,30);
      color: #1890FF;
    }
    .@{userPrefixCls}-user-list-li {
      .px2rem(margin-bottom,16);
      display: flex;
      flex-direction: column;
      align-items: center;
      list-style:none;
      flex-basis: 20%;
      p {
        text-align:center;
        .px2rem(margin-top,4);
        .px2rem(width,120);
        .px2rem(height,36);
        .px2rem(line-height,36);
        .px2rem(font-size,24);
        color:#666666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      
    }
    .@{userPrefixCls}-user-select-item {
      position: relative;
      display: inline-block;
      .px2rem(width,72);
      .px2rem(height,72);
      .px2rem(line-height,72);
      .px2rem(font-size,24);
      border-radius: 50%;
      text-align: center;
      right: 0;
      color:#FFFFFF;
      img{
        border-radius: 50%;
        .px2rem(width,72);
        .px2rem(height,72);
      }
      .icon-base-plus-circle {
        .px2rem(font-size,72);
        color: #cccccc;
      }
    }
  }
  &-notes {
    font-size:11px;
    color:#999999;
  }
}
.h3-required {
  color: red;
}
.h3-rotate {
  transform: rotate(0deg);
  // animation: rotate 1s forwards;
}
.h3-re-rotate {
  transform: rotate(180deg);
  // animation: re-rotate 1s forwards;
}
@keyframes rotate{
  from {
    transform: rotate(0deg);
  }
  to{
    transform: rotate(180deg);
  }
}
@keyframes re-rotate{
  from {
    transform: rotate(180deg);
  }
  to{
    transform: rotate(0deg);
  }
}
</style>


