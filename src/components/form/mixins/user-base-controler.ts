// 所有控件的公用方法，计算规则，隐藏规则
import { mapActions } from 'vuex';
import {
  Component, Watch, Prop, Emit, Mixins,
} from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import baseControler from './base-controler';
import { getFormUser, searchUser } from '../../../service/get-data';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { UserSelectEntryType } from '@/config/common';
import FormUserOptions from '@/lib/form-logic/types/form-user.opts';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
const watch = arg => arg;
const FormVM = namespace('Form/ViewModel');

interface UserDeptParams {
  ActionName: string;
  UnitID?: string;
  UserVisible?: boolean;
  ShowUnActive?: boolean;
  UnitSelectionRange?: string;
  IsMobile?: boolean;
}

@Component
export default class UserBaseControlMixin extends Mixins(baseControler) {
  @FormVM.Action(ViewModelAction.SETDEFAULTITEMS) setDefaultItems: any;

  treeNodes: any[] = [];

  searchList: any[] = [];

  currentDept?: any;

  placeholder: string = '请选择';

  pickerShow: boolean = false;

  orgUnitVisible: boolean = false;

  userVisible: boolean = false;

  unitSelectionRange: string = '';

  showUnActive: boolean = false;

  filterType: number = 1;

  entryType: number = UserSelectEntryType.Other;

  userDeptParams: UserDeptParams = {
    ActionName: '',
    IsMobile: true,
  };

  options!: FormUserOptions;

  topNavigation:string = '通讯录';

  get wrapCls () {
    return {
      error: this.valid.empty,
    };
  }

  created () {
    this.userVisible = this.options.uservisible;
    this.orgUnitVisible = this.options.orgunitvisible;
  }

  /**
      des: 移动端与pc端不同，pc端有全部部门与我的部门左右两部分概念，移动端只有一列
      authine: linxh@authine.com
      time: 2020/4/15
        case1:如果人员控件限定范围是人员控件，取的是人员uid，接口获取人员信息
        case2:如果人员控件限定范围是部门控件，取的是部门id， 接口获取部门信息
        case3:如果人员控件限定范围是部门控件+人员控件，取的是部门id+人员id，接口获取部门+人员信息
        case4:如果部门控件限定范围部门控件，  取的是部门id，接口获取部门信息
        case5:如果部门控件限定范围人员控件，  取的是人员对应的部门id，接口返回部门信息
        case6:如果部门控件限定范围部门控件 + 人员控件，取的是部门ID + 人员部门id，接口获取部门信息
   */
  UpdateUnitSelectionRange () {
    const namespaces = this.namespace.split('/');
    this.unitSelectionRange = this.options.unitselectionrange;
    const rangeGroup = this.unitSelectionRange.split(';');
    const tempRange :string[] = [];
    // 遍历限定范围规则
    rangeGroup.forEach(i => {
      const form = this.$parent.form;
      let control: any = {};
      if (i.indexOf('.') !== -1 && form[namespaces[1]]) {
        const gridId = i.split('.')[0];
        // 子表详情配置
        const getGridDes = form[gridId];
        // 获取每行对应的控件真实value值
        const value = getGridDes.value;
        // 遍历获取每个子表中控件
        const res = value.map(item => {
          // 每行配置
          const itemOpt = getGridDes[item];
          // 控件配置
          const controlOpt = itemOpt[i];
          // 获取真实value
          const realValue = controlOpt.value || [];
          return realValue;
        }).flat();
        control.value = res;
      } else {
        control = form[i];
      }
      // 如果存在控件
      if (control) {
        const v = control.value;
        if (v.length < 1) return false;
        v.forEach(f => {
          // 如果是人员控件
          if (this.options.uservisible && !this.options.orgunitvisible) {
            const id = f.ObjectId || f.UnitId || f.UnitID;
            tempRange.push(id);
          } else {
            // 如果是部门控件
            if (f.Type === 2) {
              const id = f.ObjectId || f.UnitId || f.UnitID;
              tempRange.push(id);
            } else if (f.Type === 4) {
              const id = f.ParentId;
              tempRange.push(id);
            } else {
              tempRange.push(f.UnitId || f.UnitID);
            }
          }
        });
      } else if (i.indexOf('.') < 0) {
        tempRange.push(i);
      }
    });
    this.unitSelectionRange = tempRange.join(';');
  }

  /**
   * 点开选人弹窗
   */
  treeFocus () {
    this.clearValid();
    // 判断是否设置选人规则//更新选人范围
    if (this.options.unitselectionrange && this.options.unitselectionrange.length > 0) {
      this.UpdateUnitSelectionRange();
    }
    this.pickerShow = true;
    this.backStack.push(() => {
      this.pickerShow = false;
    });

    this.getOrgsAndUsers('');
  }

  // 删除选中节点
  delect (item: any) {
    for (let i = 0, len = this.value.length; i < len; i++) {
      if (this.value[i].UnitID === item.id || this.value[i].UnitId === item.id) {
        this.value.splice(i, 1);
        break;
      }
    }
    this.$updateValue();
  }

  showUserDingInfo (item: any) {
    const type = item.source.Type === 4 || item.source.UnitType === 4 || !!item.source.ParentName;
    if (type) {
      const account = item.source.DingTalkAccount.substr(0, item.source.DingTalkAccount.indexOf('.'));
      if (account) {
        H3PluginDeveloper.IShowUserInfo(account, this.$store.state.corpId);
      }
    }
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

  onChange (items: any[]) {
    let selecteds: any[] = [];
    if (items && items.length > 0) {
      const ids: string[] = items.map(x => x.key);
      selecteds = this.value.filter((item: any) => ids.indexOf(item.id) > -1);
    }
    const list = selecteds.map(x => x.source);
    this.$emit('change', list);
  }

  onCancle () {
    this.$emit('cancel');
  }

  onOk (items: any[]) {
    const list = items.map(x => x.source);
    if (this.userVisible && list.length === 1) {
      this.value = list[0];
    } else {
      this.value = list;
    }
    // 触发执行前端事件
    if (this.value) {
      this.getFrontEventsValue({
        value: this.value,
        namespace: this.namespace,
      });
    }
    this.backStack.pop();
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
        // 把公司信息加入到页面中变成可以选择，加这个的目的为了显示bread
        // 配置公司可以选择
        if (!id) {
          // companyNode.Type = 2;
          // this.treeNodes = this.resetTree([companyNode], [])
          nodes.unshift(companyNode);
        }
      } else {
        nodes = res.Nodes;
        if (!id) {
          nodes.unshift(companyNode);
        }
      }
      this.treeNodes = this.resetTree(nodes, [], id);
    }
  }

  // 组装接口异步数据
  resetTree (nodes: any, orgTree: any[], id?:string) {
    const nodeTypes = {
      1: 'company', // '' 公司
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
    if (this.orgUnitVisible && !id) { // 选部门的 部门 首次 只传入 公司信息
      const filterOrg = orgTree.filter(it => it.type === 'company');
      filterOrg.forEach(it => { it.type = 'org'; });
      return filterOrg;
    }
    return orgTree;
  }

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
        Users.forEach(item => { item.Type = 4; });
        this.searchList = this.resetTree([...Users], [], 'true'); // 此处的true 只是为了配合传进去id 不为空
      } else if (this.orgUnitVisible) {
        Deps.forEach(item => { item.Type = 2; });
        this.searchList = this.resetTree([...Deps], [], 'true');
      }
    }
  }

  /**
   * 初始化参数
   */
  initParams () {
    this.userDeptParams = { ActionName: 'LoadUnit' };
    this.showUnActive = this.options.showunactive;
    // this.unitSelectionRange = this.options.unitselectionrange
    if (this.userVisible) {
      if (this.unitSelectionRange || this.orgUnitVisible) {
        this.filterType = 2;
      } else {
        this.filterType = 0;
      }
    } else {
      this.filterType = 1;
    }
    if (this.entryType !== 0) {
      this.showUnActive = this.options.showunactive;
      // this.unitSelectionRange = this.options.unitselectionrange
    }
    this.userDeptParams.UserVisible = this.userVisible;
    if (this.entryType !== 0) {
      this.userDeptParams.ShowUnActive = this.showUnActive;
      this.userDeptParams.UnitSelectionRange = this.unitSelectionRange;
    }
  }
}
