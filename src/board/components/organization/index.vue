<template>
  <h3-org
    v-model="visible"
    :data="orgs"
    :searchData="searchData"
    :selectedData="selectedData"
    :realTimeSearch="true"
    :mulpitle="false"
    :mode="mode"
    :control="true"
    @cancel="cancel"
    @confirm="handleConfirm"
    @search="onSearch"
    @subordinate="onSubordinate"
    @breadcrumb="onSubordinate"
  />
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { H3Org } from '@h3/thinking-ui';
import { getFormUser, getFormUserDetail, searchUser } from '../../../service/get-data';
@Component({
  name: 'board-org',
  components: {
    H3Org,
  },
})
export default class BoardOrg extends Vue {
  @Prop() mode: string;

  @Prop() value: boolean;

  @Prop() unitSelectionRange: string;

  @Prop({
    type: Array,
    default: () => [],
  }) excludes: string[];

  orgs: any[] = [];

  selectedData: any[] = [];

  searchData: any[] = [];

  get visible () {
    return this.value;
  }

  set visible (val) {
    this.$emit('input', val);
  }

  get userVisible () {
    return this.mode !== 'org';
  }

  get filterType () {
    if (this.userVisible) {
      if (this.unitSelectionRange) {
        return 2;
      } else {
        return 0;
      }
    }
    return 1;
  }

  @Watch('value')
  onValueChangedHandler (newVal) {
    if (newVal) {
      this.initData();
    }
  }

  initData () {
    const params = this.getDataParams();
    this.getFormUserData(params);
  }

  getDataParams () {
    const params = {
      ActionName: 'LoadUnit',
      ShowUnActive: false,
      UnitSelectionRange: this.unitSelectionRange,
      UserVisible: this.userVisible,
    };
    return params;
  }

  getOrgItem (unit: any) {
    return {
      id: unit.UnitID,
      name: unit.DisplayName,
      type: unit.Type === 1 ? 'company' : unit.Type === 2 ? 'org' : 'user',
      hasChild: unit.HasChild,
      avatar: unit.Avatar,
      orgli: '',
    };
  }

  getRootOrg (unit: any) {
    return {
      id: unit.UnitID,
      name: unit.DisplayName,
      type:  'org',
      hasChild: false,
      avatar: unit.Avatar,
      orgli: '',
    };
  }

  getOrgNodes (nodes) {
    const ret: any = [];
    for (const node of nodes) {
      if (this.userVisible && node.Type === 4 && this.excludes.indexOf(node.UnitID) > -1) {
        continue;
      }
      ret.push(this.getOrgItem(node));
      if (node.Type === 1) {
        ret.push(this.getRootOrg(node));
      }
      if (node.ChildrenNodes && node.ChildrenNodes.length > 0) {
        for (const child of node.ChildrenNodes) {
          if (this.userVisible && child.Type === 4 && this.excludes.indexOf(child.UnitID) > -1) {
            continue;
          }
          ret.push(this.getOrgItem(child));
        }
      }
    }
    console.log(ret);
    return ret;
  }

  // 刚进入页面时获取总数据
  async getFormUserData (params) {
    const res = await getFormUser(params);
    if (res.Successful) {
      const data = res.ReturnData.Data;
      this.orgs = this.getOrgNodes(data.Nodes);
    }
  }

  // 获取二级数据
  async getDetailUserData (unit) {
    const res = await getFormUserDetail(unit.id, this.userVisible);
    if (res.Successful) {
      const data = res.ReturnData.Data;
      this.orgs = this.getOrgNodes(data.Nodes);
    }
  }

  // 获取搜索数据
  async getSearchUserData (keyword) {
    const res = await searchUser(keyword, this.filterType, false, this.unitSelectionRange);
    if (res.Successful) {
      const data = res.ReturnData.Data;
      const ret = [];
      for (const user of data.Users) {
        if (this.excludes.indexOf(user.ObjectId) > -1) {
          continue;
        }
        ret.push({
          id: user.ObjectId,
          name: user.Name,
          type: user.Type === 1 ? 'company' : user.Type === 2 ? 'org' : 'user',
          hasChild: false,
          avatar: user.ProfilePhotoUrl,
          orgli: '',
        });
      }
      this.searchData = ret;
    }
  }

  cancel () {
    this.$emit('cancel');
  }

  handleConfirm (nodes) {
    if (nodes.length > 0) {
      // 如果是部门，不允许重复选择
      const node = nodes[0];
      if (!this.userVisible && this.excludes.indexOf(node.id) > -1) {
        this.$toast.show({
          text: '您选择的看板列部门值已存在，请确认',
        });
        return;
      }
      this.$emit('confirm', node);
      this.visible = false;
    } else {
      this.$toast.show({
        text: `请先选择一个${this.mode === 'org' ? '部门' : '人员'}`,
      });
      return false;
    }
  }

  onSearch (keyword) {
    this.getSearchUserData(keyword);
  }

  onSubordinate (node) {
    this.getDetailUserData(node);
  }
}

</script>
<style lang='less' scoped>
</style>
