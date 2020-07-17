<template>
  <l-label
  :title="title"
  :required="false"
  >
    <div class="user-org-unit">
      <h3-org
        :org="treeNodes"
        :title="title"
        :selectedData="selectedData"
        :searchData="searchList"
        :selectUser="userVisible"
        :selectOrg="orgUnitVisible"
        :isMulpitle="true"
        :showModal="pickerShow"
        :showReturn="false"
        :realTimeSearch="true"
        @add="treeFocus"
        @delect="delect"
        @clickTag="showUserDingInfo"
        @onClickBreadcrumb="onClickBreadcrumb"
        @onSearch="onSearch"
        @onClickTrunBack="onClickTrunBack"
        @onClickNextHierarchy="onClickNextHierarchy"
        @ok="onOk"
        @cancle="onCancle"
      >
      </h3-org>
    </div>
  </l-label>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch, Mixins } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { getFormUser, searchUser } from '@/service/get-data';
import { LLabel } from '@/light-app/components';
import { H3Org } from 'h3-mobile-vue';

interface UserDeptParams {
  ActionName: string;
  UnitID?: string;
  UserVisible?: boolean;
  ShowUnActive?: boolean;
  UnitSelectionRange?: string;
  IsMobile?: boolean;
}

@Component({
  name: 'UserOrg',
  components: {
    LLabel,
    H3Org
  }
})

export default class UserOrg extends Vue {
  @Prop()
  title!: string;

  @Prop()
  value!: any[];

  selectValue: any[] = [];

  treeNodes: any[] = [];

  searchList: any[] = [];

  currentDept?: any;

  placeholder: string = '请选择'

  pickerShow: boolean = false;

  orgUnitVisible: boolean = true;

  userVisible: boolean = false;

  unitSelectionRange: string = '';

  showUnActive: boolean = false;

  filterType: number = 1;

  userDeptParams: UserDeptParams = {
    ActionName: '',
    IsMobile: true
  }

  created() {
    this.selectValue = this.userOrgFormat(this.value);
  }

  // 格式化选中值
  userOrgFormat(value) {
    let userOrgArray = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        userOrgArray.push({
          UnitID: key,
          DisplayName: value[key]
        })
      }
    }
    return userOrgArray;
  }
  // 获取选中值
  get selectedData() {
    if (this.selectValue.length === 0) {
      return []
    }
    return this.selectValue.map((x: any) => ({
      id: x.UnitID || x.id,
      key: x.UnitID || x.key,
      name: x.DisplayName || x.name,
      type: 'org',
      source : '',
      avatar: '',
    }))
  }

   /**
   * 点开选人弹窗
   */
  treeFocus() {
    this.pickerShow = true
    this.backStack.push(() => {
      this.pickerShow = false
    })
    this.getOrgsAndUsers('')
  }

   /**
   * 获取该级的树和用户
   * @param id 当id有值时表示查询下一级数据
   */
  async getOrgsAndUsers(id?: string) {
    if(!id){
      this.initParams()
    }
    const params = {
      UnitID: id,
      UserVisible: this.userVisible,
      ActionName: 'LoadUnit'
    }
    let res = await getFormUser(id ? params : this.userDeptParams)
    if(res.Successful) {
      res = res.ReturnData.Data;
      const companyNode = res.CompanyNode
      let nodes: any = []
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
      this.treeNodes = this.resetTree(nodes, [])
    }
  }
  /**
  * 初始化参数
  */
  initParams() {
    this.userDeptParams = { ActionName: 'LoadUnit' };
  }

   // 组装接口异步数据
  resetTree(nodes: any, orgTree: Array<any>) {

    const nodeTypes = {
      1: 'company',  //公司
      2: 'org',      //部门
      4: 'user',     //用户
      8: 'org',      //角色
    }
    nodes.forEach((node: any) => {
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
  }

  //删除选中节点
  delect(item: any) {
    for(let i=0, len = this.selectValue.length; i<len; i++){
      if(this.selectValue[i].UnitID === item.id || this.selectValue[i].id === item.id){
        this.selectValue.splice(i, 1)
        break
      }
    }
    this.$emit("change", this.selectValue);
  }
  showUserDingInfo(item: any) {

  }
  // 树-返回
  onClickTrunBack(val: any) {
    const id = this.currentDept ? this.currentDept.parentId : "";
    this.getOrgsAndUsers(id);
  }

  // 树-下一级
  onClickNextHierarchy(val: any) {
    this.currentDept = val;
    if (val && val.id) {
      this.getOrgsAndUsers(val.id);
    }
  }
  onClickBreadcrumb(val: any) {
    this.currentDept = val;
    const id = (val && val.type !== 'company') ? val.id : null;
    this.getOrgsAndUsers(id);
  }
  // onChange(items: any[]) {
  //   let selecteds: any[] = [];
  //   if (items && items.length > 0) {
  //     const ids: string[] = items.map(x => x.key);
  //     // selecteds = this.value.filter((item: any) => ids.indexOf(item.id) > -1);
  //   }
  //   const list = selecteds.map(x => x.source);
  //   this.$emit("change", list);
  // }
  async onSearch(name: string) {
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
  }
  // 选择确定
  onOk(items: any[]) {
    // const list = items.map(x => x.source)  
    this.selectValue = items;
    this.$emit('change', this.selectValue);
    this.backStack.pop()
  }
  onCancle() {
    this.$emit('cancel');
  }
}
</script>

<style lang='less' scoped>
.user-org-unit {
  /deep/.h3-field-line-not{
    display: none;
  }
  /deep/.h3-org-content{
    padding-left: 0;
    padding-bottom: 0;
  }
  /deep/.h3-org{
    &:after{
      height: 0;
    }
  }
}
</style>
