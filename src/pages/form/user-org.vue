<template>
  <div class="user-org-unit">
    <h3-org
      v-model="pickerShow"
      :data="treeNodes"
      :searchData="searchList"
      :selectedData="selectedData"
      :realTimeSearch="true"
      @search="onSearch"
      @subordinate="onClickNextHierarchy"
      @breadcrumb="onClickBreadcrumb"
      @outLimit="onOutLimit"
      :limit="maxPersonNum"
      @confirm="onOk"
      mode="user"
    />
    <h3-field
      :showIcon="false"
      :required="!readonly"
      :label="title"
      labelCls="labelCls"
      layout="vertical"
    >
      <span slot="label-extra">{{ extraMessage }}</span>
      <div class="selected-list">
        <div v-for="(item,index) in selectValue" :key="item.id" @click="delPerson(index)">
          <h3-avatar
            :avatar="item.avatar"
            :name="item.name"
            :size="36"
            specifiedColor="#107fff"
          />
          <div class="text-center base-color select-person">
            {{ item.name }}
          </div>
        </div>
        <div @click="treeFocus" v-if="selectValue.length !== maxPersonNum">
          <div class="user-add">
            <i class="add-btn h3yun_All plus-o"></i>
          </div>
          <div class="text-center base-color">
            添加人员
          </div>
        </div>
      </div>
    </h3-field>
  </div>
  <!-- <UserLabel
    :title="title"
    :required="!readonly"
    :extraMessage="extraMessage"
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
        :readonly="readonly"
        @add="treeFocus"
        @delect="delect"
        @clickTag="showUserDingInfo"
        @onClickBreadcrumb="onClickBreadcrumb"
        @onSearch="onSearch"
        @onClickTrunBack="onClickTrunBack"
        @onClickNextHierarchy="onClickNextHierarchy"
        @ok="onOk"
        @cancle="onCancle"
      />
    </div>
  </UserLabel> -->
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getFormUser, searchUser } from '@/service/get-data';
import UserLabel from './user-label.vue';
// import { H3Org } from 'h3-mobile-vue';
import { H3Org, H3Field, H3Avatar } from '@h3/thinking-ui';

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
    UserLabel,
    H3Org,
    H3Field,
    H3Avatar,
  },
})

export default class UserOrg extends Vue {
  @Prop()
  title!: string;

  @Prop()
  value!: any[];

  @Prop()
  users!: any[];

  @Prop({
    default: false,
  })
  readonly !:boolean;

  @Prop({
    default: 10,
  })
  maxPersonNum !:number;

  selectValue: any[] = [];

  treeNodes: any[] = [];

  searchList: any[] = [];

  currentDept?: any;

  placeholder: string = '请选择';

  pickerShow: boolean = false;

  orgUnitVisible: boolean = false;

  userVisible: boolean = true;

  unitSelectionRange: string = '';

  showUnActive: boolean = false;

  filterType: number = 0;

  userDeptParams: UserDeptParams = {
    ActionName: '',
    IsMobile: true,
  };

  created () {
    // this.selectValue = this.userOrgFormat(this.value);
    this.selectValue = [...this.users];
  }

  // 格式化选中值
  userOrgFormat (value) {
    const userOrgArray = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        userOrgArray.push({
          UnitID: key,
          DisplayName: value[key],
          id: key,
        });
      }
    }
    return userOrgArray;
  }

  get extraMessage () {
    // 只读模式下不要message
    if (this.readonly) {
      return '';
    }
    if (this.selectValue.length === 0) {
      return '不超过10人';
    }
    return `已选择${this.selectValue.length}人`;
  }

  // 获取选中值
  get selectedData () {
    if (this.selectValue.length === 0) {
      return [];
    }
    return this.selectValue.map((x: any) => ({
      id: x.UnitID || x.id,
      key: x.UnitID || x.key,
      name: x.DisplayName || x.name,
      type: 'user',
      source: '',
      avatar: x.ProfilePhotoUrl || x.avatar || '',
    }));
  }

  /**
   * 点开选人弹窗
   */
  treeFocus () {
    this.pickerShow = true;
    this.backStack.push(() => {
      this.pickerShow = false;
    });
    this.getOrgsAndUsers('');
  }

  /**
   * 获取该级的树和用户
   * @param id 当id有值时表示查询下一级数据
   */
  async getOrgsAndUsers (id?: string) {
    if (!id) {
      this.initParams();
    }
    const params = {
      UnitID: id,
      UserVisible: this.userVisible,
      ActionName: 'LoadUnit',
    };
    let res = await getFormUser(id ? params : this.userDeptParams);
    if (res.Successful) {
      res = res.ReturnData.Data;
      const companyNode = res.CompanyNode;
      let nodes: any = [];
      if (!companyNode.DisplayName) {
        companyNode.DisplayName = this.$store.state.UserInfo.companyName;
      }
      res.Nodes = res.Nodes || [];
      if (companyNode.UnitID) {
        if (res.Nodes.length === 0) {
          nodes = [];
        } else if (res.Nodes[0].UnitID !== companyNode.UnitID) {
          nodes = res.Nodes;
        } else {
          nodes = res.Nodes[0].ChildrenNodes;
        }

        // 把公司信息加入到页面中变成可以选择
        if (!id) {
          nodes.unshift(companyNode);
        }
      } else {
        nodes = res.Nodes;
        if (!id) {
          nodes.unshift(companyNode);
        }
      }
      this.treeNodes = this.resetTree(nodes, []);
    }
  }

  /**
  * 初始化参数
  */
  initParams () {
    this.userDeptParams = { ActionName: 'LoadUnit', UserVisible: true, ShowUnActive: false, UnitSelectionRange: '' };
  }

  // 组装接口异步数据
  resetTree (nodes: any, orgTree: any[]) {
    const nodeTypes = {
      1: 'company', // 公司
      2: 'org', // 部门
      4: 'user', // 用户
      8: 'org', // 角色
    };
    nodes.forEach((node: any) => {
      const name = node.DisplayName || node.Name;
      if (!name) {
        return;
      }
      node.UnitID = node.UnitID || node.ObjectId;
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
        source: node,
      });
    });
    return orgTree;
  }

  // 删除选中节点
  delect (item: any) {
    for (let i = 0, len = this.selectValue.length; i < len; i++) {
      if (this.selectValue[i].UnitID === item.id || this.selectValue[i].id === item.id) {
        this.selectValue.splice(i, 1);
        break;
      }
    }
    this.$emit('update:users', this.selectValue);
  }

  showUserDingInfo (item: any) {

  }

  // 树-返回
  onClickTrunBack (val: any) {
    const id = this.currentDept ? this.currentDept.parentId : '';
    this.getOrgsAndUsers(id);
  }

  // 树-下一级
  onClickNextHierarchy (val: any) {
    this.currentDept = val;
    if (val && val.id) {
      this.getOrgsAndUsers(val.id);
    }
  }

  onClickBreadcrumb (val: any) {
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
  async onSearch (name: string) {
    name = name.replace(/^\s+|\s+$/gm, '');
    if (!name) {
      return;
    }
    let res = await searchUser(name, this.filterType, this.showUnActive, this.unitSelectionRange);
    if (res.Successful) {
      res = res.ReturnData.Data;
      const Deps = res.Deps;
      const Users = res.Users;
      if (this.userVisible) {
        Users.forEach(item => item.Type = 4);
        this.searchList = this.resetTree([...Users], []);
      } else if (this.orgUnitVisible) {
        Deps.forEach(item => item.Type = 2);
        this.searchList = this.resetTree([...Deps], []);
      }
    }
  }

  onOutLimit () {
    this.$toast.show({ text: '审批人数最多选择10人' });
  }

  delPerson (index) {
    this.selectValue.splice(index, 1);
    this.$emit('update:users', this.selectValue);
  }

  // 选择确定
  onOk (items: any[]) {
    // const list = items.map(x => x.source)

    this.selectValue = items;
    this.$emit('update:users', this.selectValue);
    this.backStack.pop();
  }

  onCancle () {
    this.$emit('cancel');
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
@base-color:#333333;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.text-center{
  text-align: center;
}
.base-color{
  color: @base-color;
}
.user-org-unit {
  /deep/ .labelCls{
    color: @base-color;
    font-weight: 700;
    font-size: 15px;
  }
  /deep/ .h3think-field__content-wrapper{
    .px2rem(padding-left, 7);
    .px2rem(padding-right, 7);
  }
  .selected-list{
    display: flex;
    // padding-left: 30px;
    // padding-right: 30px;
    flex-wrap: wrap;
    &>div{
      .px2rem(width, 138);
      .px2rem(height, 112);
      flex-wrap: wrap;
      display: flex;
      justify-content: center;
      .px2rem(margin-bottom, 8);
    }
    .user-add{
      .px2rem(width, 72);
      .px2rem(height, 72);
      text-align: center;
      margin: 0 auto;
      border-radius: 50%;
      border:1px dashed #D3D6DC;
      display: flex;
      justify-content: center;
      align-items: center;
      .add-btn{
        .px2rem(line-height, 35);
      }
    }
    .select-person{
      max-width: 4em;
      margin: 0 auto;
      width: 4em;
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 0 auto;
      white-space: nowrap;
    }
  }
  // /deep/.h3-field-line-not{
  //   display: none;
  // }
  // /deep/.h3-org-content{
  //   padding-left: 0;
  //   padding-bottom: 0;
  // }
  // /deep/.h3-org{
  //   &:after{
  //     height: 0;
  //   }
  // }
  // /deep/ .h3-org-content.h3-org-content-edit{
  //   padding-right: 0;
  // }
  // /deep/ .h3-org-content .h3-org-tag{
  //   flex-direction: column;
  //   background-color: #fff;
  //   width: 69px;
  //   height: 56px;
  //   margin-right: 0;
  // }
}
</style>
