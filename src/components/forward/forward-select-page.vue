<template>
    <layout
    :title="title"
    :left-options="{preventGoBack:true}"
    @on-click-back="goBack"
    class="forward-org-select"
    >
      <H3OrgSelect
        ref="selectedPage"
        :show="isSelectPage"
        :org="treeNodes"
        :searchData="searchList"
        :isMulpitle="false"
        :selectUser="true"
        :selectOrg="false"
        :realTimeSearch="true"
        @ok="ok"
        @onClickNextHierarchy="onClickNextHierarchy"
        @onClickBreadcrumb="onClickBreadcrumb"
        @onSearch="onSearch"
        @onClickTrunBack="onClickTrunBack"
    >
      <input slot="footer" :readonly="readonly" class="simulate-input" type="text">
    </H3OrgSelect>
    <transfer-modal
      v-if="forwardInputBol"
      :user="selectedUser"
      @confirmForward="confirmForward"
      @cancel="cancel"
    ></transfer-modal>
    </layout>
</template>
<script>
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { closeApp } from '../../config/dingtalk-interface';
import preventBodyScrollMixin from '../../mixins/prevent-body-scroll';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import * as FormLogic from '@/lib/form-logic/index';
import { H3Org } from 'h3-mobile-vue';
import transferModal from './transfer-modal.vue';
import { getFormUser, searchUser } from '../../service/get-data';
import { isiOS } from '../../config/common';


export default {
  name: 'forwardselect',
  components: {
    H3OrgSelect: H3Org.select,
    transferModal
  },
  data() {
    return {
      isOk: false,
      comments: null,
      title: '选择人员',
      userVisible: true,
      orgUnitVisible: false,
      selectedItem: [],
      searchList: [],
      treeNodes: [],
      forwardInputBol: false,
      isSelectPage: false,
      currentDept: '',
      userIds: '',
      readonly: false,
      isIOS: false
    };
  },
  mixins: [preventBodyScrollMixin],
  created() {
    this.isIOS = isiOS;
    this.actionControl = this.$route.params.actionControl;
    this.bizObjectId = this.$route.params.bizObjectId;
    this.getOrgsAndUsers('');
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  methods: {
    async onSearch(name) {
      name = name.replace(/^\s+|\s+$/gm,'');
      if (!name) {
        return;
      }
      let res = await searchUser(name, this.filterType, this.showUnActive, this.unitSelectionRange)
      if (res.Successful) {
        res = res.ReturnData.Data
        const Deps = res.Deps
        const Users = res.Users
        if(this.userVisible){
          Users.forEach(item => item.Type = 4)
          this.searchList = this.resetTree([...Users], [])
        }else if(this.orgUnitVisible){
          Deps.forEach(item => item.Type = 2)
          this.searchList = this.resetTree([...Deps], [])
        }
      }
    },
    /**
     * 获取该级的树和用户
     * @param id 当id有值时表示查询下一级数据
     */
    async getOrgsAndUsers(id) {
      let params = {
        UserVisible: true,
        ActionName: 'LoadUnit',
        IsMobile: true
      }
      if (id) {
        params.UnitID = id;
      }
      let res = await getFormUser(params);
      if(res.Successful) {
        res = res.ReturnData.Data;
        const companyNode = res.CompanyNode
        let nodes = []
        if (!companyNode.DisplayName) {
          companyNode.DisplayName = this.$store.state.UserInfo.companyName
        }
        res.Nodes = res.Nodes || []
        if (companyNode.UnitID) {

          if(res.Nodes.length === 0){
            nodes = []
          }else if(res.Nodes[0].UnitID !== companyNode.UnitID){
            nodes = res.Nodes
          }else{
            nodes = res.Nodes[0].ChildrenNodes
          }

          // 把公司信息加入到页面中变成可以选择
          if (!id) {
            nodes.unshift(companyNode)
          }
        } else {
          nodes = res.Nodes
          if (!id) {
            nodes.unshift(companyNode);
          }
        }
        this.treeNodes = this.resetTree(nodes, []);
        this.isSelectPage = true;
      }
    },
    // 组装接口异步数据
    resetTree(nodes, orgTree) {

      const nodeTypes = {
        1: 'company',  //公司
        2: 'org',      //部门
        4: 'user',     //用户
        8: 'org',      //角色
      }
      nodes.forEach((node) => {
        const name = node.DisplayName || node.Name
        if(!name){
          return
        }
        node.UnitID = node.UnitID || node.ObjectId
        orgTree.push({
          id: node.UnitID || node.ObjectId,
          key: node.UnitID || node.ObjectId,
          name: node.DisplayName || node.Name,
          avatar: node.ProfilePhotoUrl || node.Avatar,
          type: nodeTypes[node.Type] || 'org',
          hasChild: node.HasChild,
          orglist: node.DisplayName || node.Name,
          title: node.DisplayName || node.Name,
          isLeaf: node.leaf,
          ParentId: node.ParentId,
          children: [],
          source: node
        });
      });
      return orgTree;
    },
    // 树-下一级
    onClickNextHierarchy(val) {
      this.currentDept = val;
      if (val && val.id) {
        this.getOrgsAndUsers(val.id);
      }
    },

    onClickBreadcrumb(val) {
      this.currentDept = val;
      const id = (val && val.type !== 'company') ? val.id : null;
      this.getOrgsAndUsers(id);
    },
    // 树-返回
    onClickTrunBack(val) {
      const id = this.currentDept ? this.currentDept.parentId : "";
      this.getOrgsAndUsers(id);
    },
    ok(items) {
      const that = this;
      if (!items.length) {
        H3PluginDeveloper.IShowWarn('提示', '请选择转交人');
        return;
      }
      console.log(items)
      this.selectedUser = items[0];
      this.userId = items[0].id;
      this.forwardInputBol = true;
      $(document).bind('touchmove', that.forbiddenScroll);
      this.readonly = true;
    },
    forbiddenScroll(ev) {
      if (ev.target.tagName === 'TEXTAREA') {
        return true;
      }
      ev.preventDefault();
      return false;
    },
    confirmForward(comments) {
      this.forwardInputBol = false;
      this.readonly = false;
      this.dispatchDoAction(this.actionControl, comments, this.userId);
    },
    // 分发提交
    dispatchDoAction(item, inputCommnets, attachments) {
      const self = this;
      const namespace = 'Form/ViewModel/';
      const actionResult = this.$store.dispatch(namespace + ViewModelAction.DOACTION, {
        bizObjectId: this.bizObjectId,
        actionControl: item,
        inputCommnets,
        attachments, // 这里代表要转交给的人
      });
      actionResult.then((response) => {
        if (response && response.Successful && response.ReturnData.StartFormResponse.Successful) {
          H3PluginDeveloper.IHidePreLoader();
          // resultHandler(item, response.ReturnData.StartFormResponse, self, self.bizObjectId);
          H3PluginDeveloper.IShowSuccess('提示', '转交成功', () => {
          // 提醒列表界面更新
            FormLogic.destroy({
              store: this.$store,
              bizObjectId: this.bizObjectId
            })
            if (window.GlobalConfig.schemaCode) {
              closeApp();
            } else {
              self.$root.eventHub.$emit('forward-updated');
              self.$router.go(-2);
              self.$store.state.excludeComp = ['formPage'];
              $(document).unbind('touchmove', this.forbiddenScroll);
            }
          });
        } else {
          self.showError(response.ReturnData.StartFormResponse);
        }
      }).catch((data) => {
        self.showError(data);
      });
    },
    showError(data) {
      const self = this;
      if (data.Errors) {
        for (let i = 0; i < data.Errors.length; i += 1) {
          H3PluginDeveloper.IShowWarn('提示', data.Errors[i], () => {
            self.isOk = false;
            self.comments = '';
            return false;
          });
        }
      }
    },
    cancel() {
      this.forwardInputBol = false;
      this.readonly = false;
    },
    goBack() {
      const that = this;
      $(document).unbind('touchmove', that.forbiddenScroll);
      if (this.forwardInputBol) {
        this.forwardInputBol = false;
        this.readonly = false;
        return;
      }
      this.$router.go(-1);
    },
    // 展示人名的方法
    setUserName(item) {
      let userName = item.Name || item.DisplayName;
      userName = userName && userName.substr(0, 1);
      return userName;
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.forward-org-select {
  .simulate-input {
    position: absolute;
    width: 56px;
    height: 30px;
    right: 30px;
    top: 15px;
  }
}

</style>


