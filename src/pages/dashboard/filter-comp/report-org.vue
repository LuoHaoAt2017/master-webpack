<template>
  <h3-org-selector
    class="maxHeight"
    :value="currentValue"
    :data="orgs"
    :searchData="searchData"
    :realTimeSearch="true"
    :mulpitle="isMulpitle"
    :mode="mode"
    @change="onChange"
    @subordinate="onSubordinate"
    @breadcrumb="onSubordinate"
    @search="onSearch"
  />
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { H3Org } from '@h3/thinking-ui';
import { getFormUser, getFormUserDetail, searchUser } from
  '../../../service/get-data';

// const CompanyId = '18f923a7-5a5e-426d-94ae-a55ad1a4b240';

@Component({
  name: 'ReportOrg',
  components: {
    H3OrgSelector: H3Org.Selector,
  },
})

export default class ReportOrg extends Vue {
  @Prop({
    default () {
      return [];
    },
  }) value !: any[];

  @Prop({
    default: () => ({}),
  }) field !: any;

  @Prop({
    default: '',
  }) formula!: string;

  searchData: any[] = [];

  orgs: any[] = [];

  currentValue: any = [];

  // 是否可以多选
  get isMulpitle () {
    return ['In', 'NotIn'].includes(this.formula);
  }

  get mode () {
    const { dataType, field } = this.field;
    if (dataType === 260 || dataType === 270 ||
     field === 'OwnerId' || field === 'CreatedBy') {
      return 'user';
    }
    return 'org';
  }

  @Watch('formula')
  onValueChanged () {
    this.currentValue = [];
    this.searchData = [];
    const params = {
      ActionName: 'LoadUnit',
      ShowUnActive: false,
      UserVisible: this.userVisible,
    };
    this.getFormUserData(params);
  }

  async created () {
    const params = this.getDataParams();
    await this.getFormUserData(params);
    await this.getSelectedValue();
  }

  /**
   * type = 4 => user用户
   * type = 1 => company公司
   * type = 2 => org部门
   * type = 8 => 角色
  */

  // async mounted () {
  //   const selectRange = [];
  //   this.value.forEach(element => {
  //     selectRange.push(element.value);
  //   });
  //   const selectRangeStr = selectRange.join(';');
  //   if (selectRangeStr.length) {
  //     const res = await getFormUserDetail('', this.userVisible, selectRangeStr);
  //     if (res.Successful) {
  //       const componentData = res.ReturnData.Data.Nodes.map(item => {
  //         return {
  //           id: item.UnitID,
  //           name: item.DisplayName,
  //           type: item.Type === 1 || item.Type === 2 ? 'org' : 'user',
  //           avatar: item.Avatar,
  //         };
  //       });
  //       // 修改模式
  //       this.currentValue = componentData;
  //     }
  //   }
  // }

  async getSelectedValue () {
    const selectRange = [];
    this.value.forEach(element => {
      selectRange.push(element.value);
    });
    const selectRangeStr = selectRange.join(';');
    if (selectRangeStr.length) {
      const res = await getFormUserDetail('', this.userVisible, selectRangeStr);
      if (res.Successful) {
        const componentData = res.ReturnData.Data.Nodes.map(item => {
          return {
            id: item.UnitID,
            name: item.DisplayName,
            type: item.Type === 1 || item.Type === 2 ? 'org' : 'user',
            avatar: item.Avatar,
          };
        });
        // 修改模式
        this.currentValue = componentData;
      }
    }
  }

  onChange (fileList) {
    const temp = fileList.map(item => ({ value: item.id, label: item.name }));
    this.$emit('input', temp);
  }

  // 如果是true，代表人员或部门，如果是false，代表部门
  get userVisible () {
    // 如果是部门，返回false
    if (this.mode === 'org') {
      return false;
    }
    return true;
  }

  /**
   * filtertype: 0, 1
   * 0:  查看用户
   * 1:  查看部门
   * 后端默认值是0；
  */
  get filterType () {
    if (this.mode === 'org') {
      return 1;
    }
    return 0;
  }

  onSearch (keyword) {
    this.getSearchUserData(keyword);
  }

  async getSearchUserData (keyword) {
    const res = await searchUser(keyword, this.filterType, false);
    if (res.Successful) {
      const data = res.ReturnData.Data;
      const ret = [];
      if (this.filterType === 0) {
        for (const user of data.Users) {
          ret.push({
            id: user.ObjectId,
            name: user.Name,
            type: 'user',
            hasChild: false,
            avatar: user.ProfilePhotoUrl,
            orgli: '',
          });
        }
      } else {
        for (const dep of data.Deps) {
          ret.push({
            id: dep.ObjectId,
            name: dep.Name,
            type: 'org',
            hasChild: false,
            avatar: '',
            orgli: '',
          });
        }
      }
      this.searchData = ret;
    }
  }

  getDataParams () {
    const params = {
      ActionName: 'LoadUnit',
      ShowUnActive: false,
      UserVisible: this.userVisible,
    };
    return params;
  }

  // 刚进入页面时获取总数据
  async getFormUserData (params) {
    const res = await getFormUser(params);
    if (res.Successful) {
      const data = res.ReturnData.Data;
      this.orgs = this.getOrgNodes(data.Nodes);
    }
  }

  /**
     * type = 4 => user用户
     * type = 1 => company公司
     * type = 2 => org部门
     * type = 8 => 角色
    */
  getOrgNodes (nodes, isRoot = true) {
    const ret: any = [];
    for (const node of nodes) {
      if (!isRoot && node.Type !== 1) {
        ret.push(this.getOrgItem(node));
      }
      if (isRoot) {
        ret.push(this.getOrgItem(node));
        break;
      }
      if (node.ChildrenNodes && node.ChildrenNodes.length > 0) {
        for (const child of node.ChildrenNodes) {
          ret.push(this.getOrgItem(child));
        }
      }
    }
    return ret;
  }

  getOrgItem (unit: any) {
    return {
      id: unit.UnitID,
      name: unit.DisplayName,
      type: unit.Type === 1 || unit.Type === 2 ? 'org' : 'user',
      hasChild: unit.HasChild,
      avatar: unit.Avatar,
      orgli: '',
    };
  }

  getRootOrg (unit: any) {
    return {
      id: unit.UnitID,
      name: unit.DisplayName,
      type: 'org',
      hasChild: false,
      avatar: unit.Avatar,
      orgli: '',
    };
  }

  // 当点击下一级后回调
  onSubordinate (node) {
    this.getDetailUserData(node);
  }

  // 获取二级数据
  async getDetailUserData (unit) {
    if (unit.type === 'company') {
      unit.id = '';
    }
    const res = await getFormUserDetail(unit.id, this.userVisible);
    if (res.Successful) {
      const data = res.ReturnData.Data;
      this.orgs = this.getOrgNodes(data.Nodes, !unit.id);
    }
  }
}
</script>

<style lang="less" >

</style>
