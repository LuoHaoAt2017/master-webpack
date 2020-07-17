<template>
  <!--  :class='{"animated pulse":errorBol}' -->
  <div id="form-user" v-show="isVisible">
    <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
      <!--  :class="{'no-border':(value&&value.length>0&&(value[0].Type==4||value[0].UnitType==4))||isInGrid}" -->
      <div class="left">
        <!--  :class="{'no-padding-bottom':value&&value.length>0&&(value[0].Type==4||value[0].UnitType==4)}" -->
        <p class="dp-font30">{{this.formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
        </p>
      </div>
      <!--  :class="{'no-padding-bottom':value&&value.length>0&&(value[0].Type==4||value[0].UnitType==4)}" v-if='!value||(value.DisplayName)||value.length<1||(value.length>0&&((value[0].Type&&value[0].Type!=4)||(value[0].UnitType&&value[0].UnitType!=4)))' -->
      <div class="right">
        <input class="dp-font30" :class="[errorBol?'error':'']" type="text" :placeholder="placeholder" @click="chooseUser" readonly="readonly" v-model="currentVal" v-if='!value||value.length<1'>
        <div class="text dp-font30" @click="chooseUser" v-if='(value.DisplayName)||(value.length>0&&((value[0].Type&&value[0].Type!=4)||(value[0].UnitType&&value[0].UnitType!=4)))'>{{currentVal}}</div>
        <div class="select-user" @click.self="chooseUser" :class="{'no-border':isInGrid}" v-for='(item,index) in value' :key="index" v-if='value&&value.length>0&&(value[0].Type==4||value[0].UnitType==4)'>
          <div class='user-wrap'>
            <span class="icon-color" @click='showNodeUserId(item)'>
              <img :src="item.Avatar||item.ProfilePhotoUrl" v-if='item.Avatar||item.ProfilePhotoUrl'>
              <span class="user-name" v-text='setUserName(item)' v-else></span>
              <i class='icon-mistake' @click='delUser' v-if='formVal.Editable'></i>
            </span>
            <p class="user-font dp-font18">{{item.Name||item.DisplayName}}</p>
          </div>
        </div>
        <div class="icon icon-next2" @click="chooseUser" v-if="formVal.Editable&&orgUnitVisible"></div>
        <div class="icon icon-user2" @click="chooseUser" v-if="formVal.Editable&&userVisible&&!orgUnitVisible&&((value&&value.length<1)||!value)"></div>
      </div>
    </div>
    <!-- <div class="select-user" @click.self="chooseUser" :class="{'no-border':isInGrid}" v-for='(item,index) in value' :key="index" v-if='value&&value.length>0&&(value[0].Type==4||value[0].UnitType==4)'>
      <div class='user-wrap'>
        <span class="icon icon-color" @click='showNodeUserId(item)'>
          <img :src="item.Avatar||item.ProfilePhotoUrl" v-if='item.Avatar||item.ProfilePhotoUrl'>
          <span class="user-name" v-text='setUserName(item)' v-else></span>
          <i class='icon-mistake' @click='delUser' v-if='formVal.Editable'></i>
        </span>
        <p class="user-font dp-font18">{{item.Name||item.DisplayName}}</p>
      </div>
    </div> -->
    <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
    <div class="error-wrap" @click="hideErrorWrap" v-show='errorBol'></div>
    <input type="hidden" v-model="value">
  </div>
</template>

<script>
import mixin from '../../../mixins/base-controler';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import SmartForm from '../../../lib/smart-form';
import { getMultiFormUser } from '../../../service/get-data';

export default {
  name: 'FormUser',
  // 从父组件传递过来的数据
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      isInGrid: false,
      gridDataField: '',
      placeholder: '',
      selectedItem: [],
      orgUnitVisible: '',
      userVisible: '',
      errorBol: false,
      isQuestionShowBol: false,
      unitSelectionRange: '',
      isSetValueBol: false,
      value: [],
      isVisible: true,
      AjaxUrl: '/Form/OnAction',
      isInit: true,
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    this.formVal.uservisible =
    this.formVal.uservisible === 'true' || this.formVal.uservisible === null || (this.formVal.uservisible === true || false);
    this.userVisible = this.formVal.uservisible;
    this.orgUnitVisible = this.formVal.orgunitvisible === 'true' || false;
    this.placeholder = this.placeholder + this.formVal.DisplayName;
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    // 判断控件是否为拥有者和创建人
    if (this.formVal.dataField === 'OwnerId' || this.formVal.dataField === 'OwnerDeptId') {
      this.formVal.Required = true;
    }
    // 初始化placeholder
    this.initPlaceholder();
    this.$root.eventHub.$on('assignVal', this.assignVal);
  },
  mounted() {
    this.$nextTick(() => {
      this.InitValue(this.formVal.Value, true);
      // 初始值时需要执行关联配置
      this.initOriginVal();
    });
  },
  methods: {
    initOriginVal() {
      let val = [];
      // 执行关联配置
      if (Object.prototype.toString.call(this.formVal.Value).indexOf('Object') > -1) {
        val.push(this.formVal.Value);
      } else {
        val = this.formVal.Value;
      }
      if (val !== null) {
        if (val instanceof Array) {
          const unitObject = val[0];
          if (Object.prototype.toString.call(unitObject).indexOf('String') < 0 && unitObject) {
            this.MappingControlsHandler(unitObject);
          }
        } else {
          this.MappingControlsHandler(val);
        }
      }
    },
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          if (this.userVisible && !this.orgUnitVisible) {
            this.placeholder = '请选择人员(必填)';
          } else if (!this.userVisible && this.orgUnitVisible) {
            this.placeholder = '请选择部门(必填)';
          } else {
            this.placeholder = '请选择人员部门(必填)';
          }
          this.requiredVal = '*';
        } else if (this.userVisible && !this.orgUnitVisible) {
          this.placeholder = '请选择人员';
        } else if (!this.userVisible && this.orgUnitVisible) {
          this.placeholder = '请选择部门';
        } else {
          this.placeholder = '请选择人员部门';
        }
      } else {
        this.placeholder = '';
      }
    },
    // 处理映射关系
    MappingControlsHandler(UnitObject) {
      if ($.isEmptyObject(this.formVal.mappingcontrols) || this.formVal.mappingcontrols === '') return;
      const mappingcontrols = JSON.parse(this.formVal.mappingcontrols);
      // 清空之前的mappingcontrolsval
      for (const ele in SmartForm.mappingControlsVal) {
        if (Object.prototype.hasOwnProperty.call(SmartForm.mappingControlsVal, ele)) {
          delete SmartForm.mappingControlsVal[ele];
        }
      }
      // 如果是在子表中要传入当前行的objectId
      SmartForm.mappingControlsVal.ObjectId = this.ObjectId;
      for (const property in mappingcontrols) {
        if (Object.prototype.hasOwnProperty.call(mappingcontrols, property)) {
          const targetFiled = mappingcontrols[property]; // ownerDetId
          let propertyVal = UnitObject[property] === undefined ? '' : UnitObject[property]; // parentId
          if (property.toLowerCase() === 'gender' && propertyVal === '未知') {
            propertyVal = '';
          }
          SmartForm.mappingControlsVal[targetFiled] = propertyVal;
        }
      }
    },
    async getMultiFormUserData(UnitID, callback) {
      const data = await getMultiFormUser(UnitID);
      if (data.Successful) {
        callback(data);
      }
    },
    // 设置值
    SetValue(Obj) {
      this.isSetValueBol = true;
      if (Obj === undefined || Obj == null || Obj === '') {
        this.value = [];
        this.formVal.Value = [];
        this.OnChange();
        return;
      }
      if (Obj === undefined || Obj.length === 0) {
        this.value = [];
        this.formVal.Value = [];
        this.OnChange();
        return;
      }
      this.AddValue(Obj);
    },
    // 设置值
    InitValue(Obj, isInit) {
      this.isSetValueBol = true;
      if (Obj === undefined || Obj == null || Obj === '') {
        this.value = [];
        this.formVal.Value = [];
        return;
      }
      if (Obj === undefined || Obj.length === 0) {
        this.value = [];
        this.formVal.Value = [];
        return;
      }
      this.AddValue(Obj, isInit);
    },
    // 更新选人范围
    UpdateUnitSelectionRange() {
      this.unitSelectionRange = this.formVal.unitselectionrange;
      // 计算控件中的选人范围
      const that = this;
      let SelectionRange = `${that.unitSelectionRange};`;
      const selects = that.unitSelectionRange.split(';');
      if (selects.length > 0) {
        for (let i = 0; i < selects.length; i += 1) {
          const control = SmartForm.controls[selects[i]];
          if (control) {
            // let controlManager = control;
            // 列表筛选时取不到值
            // if (!controlManager) { continue; }
            SelectionRange = SelectionRange.replace(`${selects[i]};`, '');

            const items = control.GetValue();
            if (items) {
              for (const id of items) {
                SelectionRange += `${id};`;
              }
            }
          }
        }
        that.unitSelectionRange = SelectionRange;
      }
    },
    AddValue(obj, isInit) {
      const that = this;
      if (obj === undefined) {
        return;
      }
      if (isInit && obj && obj.length) {
        that.value = obj[0];
        that.initOriginVal();
      } else if (isInit && obj && obj.constructor === Object) {
        that.value = obj;
        that.initOriginVal();
      }
      const tempData = that.$store.state.FormMultiUserData;
      // 获取已经存在的用户，不用重新去服务端请求
      const getExistsUnit = function a(unitId) {
        for (let i = 0, len = tempData.OrgUnitItems.length; i < len; i += 1) {
          const unit = tempData.OrgUnitItems[i];
          const tmpId = unit.ObjectId || unit.UnitID;
          if (tmpId === unitId) {
            return unit;
          }
        }
        for (let i = 0, len = tempData.UserItems.length; i < len; i += 1) {
          const unit = tempData.UserItems[i];
          const tmpId = unit.ObjectId || unit.UnitID;
          if (tmpId === unitId) {
            return unit;
          }
        }
        return null;
      };
      const res = [];
      const news = [];
      let exist = null;
      // 判断对象类型
      if (obj.constructor === Array) {
        for (let i = 0, len = obj.length; i < len; i += 1) {
          if (obj[i].constructor === Object) {
            if (that.IsOnlyObjectIdObj(obj[i])) {
              exist = getExistsUnit(obj[i].ObjectId);
              if (exist) {
                res.push(exist);
              } else {
                news.push(obj[i].ObjectId);
              }
            } else {
              res.push(obj[i]);
              // 判断是否已经存在缓存中了，如果存在，则不用处理，不存在，则请求
              if (obj[i].UnitType === 4 || obj[i].Type === 4) {
                tempData.UserItems.push(obj[i]);
              } else {
                tempData.OrgUnitItems.push(obj[i]);
              }
            }
          } else if (obj[i].constructor === String) {
            exist = getExistsUnit(obj[i]);
            if (exist) {
              res.push(exist);
            } else {
              news.push(obj[i]);
            }
          }
        }
      } else if (obj.constructor === Object) {
        if (that.IsOnlyObjectIdObj(obj)) {
          exist = getExistsUnit(obj.ObjectId);
          if (exist) {
            res.push(exist);
          } else {
            news.push(obj.ObjectId);
          }
        } else {
          res.push(obj);
          // 判断是否已经存在缓存中了，如果存在，则不用处理，不存在，则请求
          if (obj.UnitType === 4 || obj.Type === 4) {
            tempData.UserItems.push(obj);
          } else {
            tempData.OrgUnitItems.push(obj);
          }
        }
      } else if (obj.constructor === String) {
        exist = getExistsUnit(obj);
        if (exist) {
          res.push(exist);
        } else {
          news.push(obj);
        }
      }

      if (news.length > 0) {
        // 先请求，后合并
        const UnitID = JSON.stringify(news);
        that.getMultiFormUserData(UnitID, (datas) => {
          let data = datas;
          data = data.ReturnData.UnitItems;
          // 直接添加到缓存和结果中
          for (let i = 0, len = data.length; i < len; i += 1) {
            that.value = data[i];
            res.push(data[i]);
          }
          // Render
          if (!isInit) {
            that.isInit = false;
          }
          that.value = res;
          that.formVal.Value = res;
          that.initOriginVal();
          if (!isInit) {
            that.OnChange();
          }
        });
      } else {
        // Render
        this.value = res;
        this.formVal.Value = res;
        this.initOriginVal();
        if (!isInit) {
          this.OnChange();
        }
      }
    },
    // 渲染成钉钉样式
    RenderAsDing(units) {
      if (!this.formVal.Visible) {
        return;
      }
      const dataUser = {
        Users: [],
        Departs: [],
        ShowUserTitle: false,
        ShowDepTitle: false,
      };
      const counts = {
        U: 0,
        D: 0,
        C: 0,
      };
      for (let i = 0, len = units.length; i < len; i += 1) {
        const d = units[i];
        if (d.UnitType === 4 || d.Type === 4) {
          dataUser.Users.push(d);
          counts.U += 1;
        } else {
          dataUser.Departs.push(d);
          if (d.UnitType === 2 || d.Type === 2) {
            counts.D += 1;
          } else {
            counts.C += 1;
          }
        }
      }
    },
    // 判断unit对象是否只有ObjectId值
    IsOnlyObjectIdObj(obj) {
      return Object.prototype.hasOwnProperty.call(obj, 'ObjectId') && Object.prototype.hasOwnProperty.call(obj, 'ParentId');
    },
    GetValue() {
      let tempArr = [];
      if (this.value && this.value.UnitId) {
        tempArr.push(this.value.UnitId);
      } else if (this.value && this.value.UnitID) {
        tempArr.push(this.value.UnitID);
      } else if (this.value && this.value.length > 0 && this.value[0].UnitId) {
        tempArr.push(this.value[0].UnitId);
      } else if (this.value && this.value.length > 0 && this.value[0].UnitID) {
        tempArr.push(this.value[0].UnitID);
      } else {
        tempArr = this.value;
      }
      return tempArr;
    },
    // 校验
    Validate() {
      // 不可编辑
      if (!this.formVal.Editable) return true;

      const val = this.GetValue();

      if (this.formVal.Required && val.length === 0) {
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      return true;
    },
    // 跳转到选人页面
    chooseUser() {
      // 判断是否设置选人规则//更新选人范围
      this.$store.state.isHtmlChangedBol = true;
      if (this.formVal.unitselectionrange && this.formVal.unitselectionrange.length > 0) {
        this.UpdateUnitSelectionRange();
      }
      if (this.formVal.Editable) {
        this.$router.push({
          name: 'userDepartmentChoosePage',
          params: {
            showUnActive: this.formVal.showunactive || false,
            unitSelectionRange: this.unitSelectionRange,
            userVisible: this.formVal.uservisible,
            orgUnitVisible: this.formVal.orgunitvisible,
            isMultiple: this.formVal.ismultiple,
            keyName: this.keyName,
            ObjectId: this.ObjectId,
            value: this.value,
          },
        });
      }
    },
    // 把选中的部门或人赋值给该控件
    assignVal(itemArr, keyName, ObjectId) {
      this.selectedItem = itemArr;
      if (this.ObjectId === ObjectId) {
        if (keyName === this.keyName) {
          const userarr = [];
          if (itemArr.length) {
            userarr.push(itemArr[0].UnitID || itemArr[0].ObjectId);
          }
          this.SetValue(userarr);
        }
      }
    },
    // 保存数据
    SaveDataField() {
      const result = {};
      // if (!this.formVal.Visible&&!this.formVal.Editable) return result;
      result[this.formVal.dataField] = this.GetValue();
      return result;
    },
    showNodeUserId(item) {
      if (!this.formVal.Editable) {
        const account = item.DingTalkAccount.substr(0, item.DingTalkAccount.indexOf('.'));
        if (account) {
          H3PluginDeveloper.IShowUserInfo(account, this.$store.state.corpId);
        }
      } else {
        this.delUser();
      }
    },
    setUserName(item) {
      let userName = item.Name || item.DisplayName;
      userName = userName.substr(userName.length - 2);
      return userName;
    },
    delUser() {
      // 查看数据点击编辑按钮后需要确保smartform里面的mappingcontol时当前控件携带的
      this.MappingControlsHandler(this.value);
      // this.value = [];
      this.SetValue([]);
      if (this.formVal.mappingcontrols) {
        SmartForm.ClearFormUserMapping();
      }
    },
    getMatrixValue() {
      const val = {};
      val.showVal = this.currentVal;
      val.submitVal = this.GetValue();
      return val;
    },
    // hideQuestion() {
    //   this.isQuestionShowBol = !this.isQuestionShowBol;
    // },
    GetUnitIDs() {
      return this.GetValue();
    },
    // 兼容处理
    GetUnitIds() {
      return this.GetValue();
    },
    GetText() {
      let name = '';
      if (this.value && this.value.UnitId) {
        name = this.value.DisplayName || this.value.Name;
      } else if (this.value && this.value.length > 0) {
        name = this.value[0].DisplayName || this.value.Name;
      }
      return name;
    },
  },
  computed: {
    currentVal() {
      if (Object.prototype.toString.call(this.value).indexOf('Object') > -1) {
        return this.value.Name || this.value.DisplayName;
      } else if (Object.prototype.toString.call(this.value).indexOf('Array') > -1) {
        if (Object.prototype.toString.call(this.value[0]).indexOf('Object') > -1) {
          return this.value[0].Name || this.value[0].DisplayName;
        } else if (this.value.length < 1) {
          return '';
        }
        this.SetValue(this.value);
      } else if (Object.prototype.toString.call(this.value).indexOf('String') > -1) {
        this.SetValue(this.value);
      } else {
        return this.value;
      }
      return false;
    },
  },
  watch: {
    currentVal(val) {
      if (val && val.length > 0 && this.formVal.mappingcontrols &&
      (!this.isInit || this.$store.state.formData.responseContext.IsCreateMode)) {
        SmartForm.InitFormUserMapping();
      }
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
    },
  },
};
</script>

<style lang="less">
@import '../../../assets/css/form-base.less';
#form-user {
  background-color: white;
  .controlLayout;
  .content {
    .no-padding-bottom {
      padding-bottom: 0;
    }
    .right {
      .icon-user2:before {
        color: @font-color9;
        .px2rem(font-size,44);
      }
      .icon-next2,
      .icon-user2 {
        .px2rem(top,-12);
      }
    }
  }
  .select-user {
    .user-wrap {
      width: 50px;
      text-align: center;
      .px2rem(padding-top,16);
      .px2rem(padding-bottom,16);
      // .px2rem(width,138);
      .icon-color {
        .px2rem(width,66);
        .px2rem(height,66);
        display: inline-block;
        border-radius: 50%;
        position: relative;
        color: @font-color9;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .icon-mistake {
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(50%);
          background-color: white;
          border-radius: 50%;
        }
      }
      .user-font {
        color: @font-color9;
        .px2rem(margin-top,5);
      }
      .user-name {
        background-color: #956fea;
        width: 100%;
        height: 100%;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        .px2rem(line-height,66);
        color: white;
      }
    }
  }
  .no-border {
    border: none;
  }
}
</style>
