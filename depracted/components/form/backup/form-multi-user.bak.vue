<template>
    <!--  :class='{"animated pulse":errorBol}' -->
    <div id="form-multi-user" v-show="isVisible">
        <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
            <div class="left">
                <p class="dp-font30">{{this.formVal.DisplayName}}
                    <span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
                    <i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                </p>
                <span class="dp-font24" v-if='formVal.Editable&&!orgUnitVisible&&userVisible&&usersArr.length>0'>已选择{{usersArr.length}}人</span>
            </div>
            <div class="right" :class="[value.length>0&&value[0].Type==4?'no-padding-bottom':'']">
                <input class="dp-font30" type="text" :class="[errorBol?'error':'']" :placeholder="placeholder" v-if='value.length<1' readonly="readonly"
                    @click="chooseUser">
                <ul class="user-list" v-if='usersArr.length>0' @click="chooseUser($event)">
                    <li v-for="(item,index) in usersArr" :key='index' @click.stop='delUser($event,item)'>
                        <!--  @click='showNodeUserId($event,item)' -->
                        <span class="icon-color">
                            <img :src="item.Avatar||item.ProfilePhotoUrl" v-if='item.Avatar||item.ProfilePhotoUrl'>
                            <span class="user-name" :style='"backgroundColor:"+Colors[index % ColorLength]' v-text='setUserName(item)' v-else></span>
                            <i class="icon-mistake" v-if='formVal.Editable'></i>
                        </span>
                        <p class="user-font dp-font18">{{item.Name||item.DisplayName}}</p>
                    </li>
                    <!-- <li @click="chooseUser" v-if="formVal.Editable&&!orgUnitVisible&&userVisible">
                        <span class="icon-add2 check"></span>
                        <p class="user-font">添加</p>
                    </li> -->
                </ul>
                <ul class="dep-list" v-if='depsArr.length>0' @click="chooseUser">
                    <li class="dp-font24" v-for='(item,index) in depsArr' :key="index">
                        <p>{{item.DisplayName||item.Name}}</p>
                        <!-- <span class="icon-mistake" @click='delDep($event,index)'></span> -->
                    </li>
                </ul>
                <div class="icon icon-next2" @click="chooseUser" v-if="formVal.Editable&&orgUnitVisible"></div>
                <div class="icon icon-user2" @click="chooseUser" v-if="formVal.Editable&&userVisible&&!orgUnitVisible&&value.length<1"></div>
            </div>
        </div>
        <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
        <!-- <div class="fix-content dp-font30" :class="[$store.state.corpId?'ding-top':'']" v-if='fixHeadBol'>{{formVal.DisplayName}}</div> -->
        <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
        <input type="hidden" :value="value">
    </div>
</template>

<script>
import { baseUrl } from '../../../config/env';
import mixin from '../../../mixins/base-controler';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { getMultiFormUser } from '../../../service/get-data';

export default {
  name: 'FormMultiUser',
  // 从父组件传递过来的数据
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      Colors: ['#17C295', '#4DA9EB', '#F7B55E', '#F2725E', '#568AAD', '#B38979', '#8A8A8A'],
      ColorLength: 7,
      users: [],
      isInGrid: false,
      gridDataField: '',
      orgUnitVisible: '',
      userVisible: '',
      placeholder: '请选择',
      errorBol: false,
      fixHeadBol: false,
      initialHeight: 0,
      depsArr: [],
      hasSetValue: false,
      isQuestionShowBol: false,
      isSetValueBol: false,
      value: '',
      MultiUserData: {
        // 部门
        OrgUnitItems: {},
        // 标签
        OrgTagItems: [],
        // 部门用户:{部门ID:[]}
        DepUserItems: {},
        // 用户
        UserItems: {},
      },
      unitSelectionRange: '',
      units: {},
      isVisible: true,
      AjaxUrl: '/Form/OnAction',
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    this.formVal.uservisible = this.formVal.uservisible === 'true' || (this.formVal.uservisible === true || false);
    this.formVal.showunactive =
    this.formVal.showunactive == null ? false : this.formVal.showunactive;
    this.userVisible = this.formVal.uservisible;
    this.orgUnitVisible = this.formVal.orgunitvisible === 'true' || false;
    this.initPlaceholder();
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    this.$root.eventHub.$on('assignVal', this.assignVal);
  },
  mounted() {
    // this.ControlFixHead();
    this.$nextTick(() => {
      this.InitValue(this.formVal.Value, true);
    });
  },
  methods: {
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          this.placeholder = `请选择${this.formVal.DisplayName.trim()}(必填)`;
          this.requiredVal = '*';
        } else {
          this.placeholder = `请选择${this.formVal.DisplayName.trim()}`;
        }
      } else {
        this.placeholder = '';
      }
    },
    delUser(e, item) {
      if (this.formVal.Editable) {
        for (let idx = 0; idx < this.value.length; idx += 1) {
          const obj = this.value[idx];
          if (obj.UnitID === (item.UnitID || item.ObjectId) ||
            obj.ObjectId === (item.UnitID || item.ObjectId)) {
            this.value.splice(idx, 1);
            break;
          }
        }
        for (let idx = 0; idx < this.formVal.Value.length; idx += 1) {
          const obj = this.formVal.Value[idx];
          if (obj.UnitID === (item.UnitID || item.ObjectId) ||
            obj.ObjectId === (item.UnitID || item.ObjectId)) {
            this.formVal.Value.splice(idx, 1);
            break;
          }
        }
        for (let idx = 0; idx < this.users.length; idx += 1) {
          const obj = this.users[idx];
          if (obj.UnitID === (item.UnitID || item.ObjectId) ||
            obj.ObjectId === (item.UnitID || item.ObjectId)) {
            this.users.splice(idx, 1);
            break;
          }
        }
      } else {
        this.showNodeUserId(e, item);
      }
      this.OnChange();
    },
    delDep(e, index) {
      this.depsArr.splice(index, 1);
      this.OnChange();
    },
    showNodeUserId(e, item) {
      const account = item.DingTalkAccount.substr(0, item.DingTalkAccount.indexOf('.'));
      if (account) {
        H3PluginDeveloper.IShowUserInfo(account, this.$store.state.corpId);
      }
    },
    getUnitType(item) {
      if (item.Type) {
        return item.Type !== 4;
      }
      return item.UnitType !== 4;
    },
    setUserName(item) {
      let userName = item.Name || item.DisplayName;
      userName = userName.substr(userName.length - 2);
      return userName;
    },
    setUserNameColor() {
      return this.Colors[this.UserIndex % this.ColorLength];
    },
    // 设置值
    SetValue(Obj) {
      this.isSetValueBol = true;
      if (Obj === undefined || Obj == null || Obj === '' || Obj.length === 0) {
        this.value = [];
        this.formVal.Value = [];
        this.users = [];
        this.OnChange();
        return;
      }
      this.AddValue(Obj);
    },
    InitValue(Obj, isInit) {
      this.isSetValueBol = true;
      if (Obj === undefined || Obj == null || Obj === '' || Obj.length === 0) {
        this.value = [];
        this.formVal.Value = [];
        this.users = [];
        return;
      }
      this.AddValue(Obj, isInit);
    },
    async getMultiFormUserData(UnitId, callback) {
      const data = await getMultiFormUser(UnitId);
      if (data.Successful) {
        callback(data.ReturnData.UnitItems);
      }
    },
    AddValue(obj, isInit) {
      const that = this;
      if (obj === undefined) {
        this.value = [];
        this.formVal.Value = [];
        if (!isInit) {
          this.OnChange();
        }
        return;
      }
      const tempData = this.$store.state.FormMultiUserData;
      // 获取已经存在的用户，不用重新去服务端请求
      const getExistsUnit = function getExistsUnit(unitId) {
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
      let res = [];
      const news = [];
      // 判断对象类型
      let exist = null;
      if (Object.prototype.toString.call(obj).indexOf('Array') > -1) {
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
      } else if (Object.prototype.toString.call(obj).indexOf('Object') > -1) {
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
      } else if (Object.prototype.toString.call(obj).indexOf('String') > -1) {
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
        const paramData = {
          ActionName: 'SheetUserAction',
          Command: 'GetUserProperty',
          UnitID,
        };
        const params = {
          PostData: JSON.stringify(paramData),
        };
        // that.getMultiFormUserData(UnitID, function (data) {
        //     // that.users = data
        //     //直接添加到缓存和结果中
        //     let tempusers = [];
        //     let tempdeps = [];
        //     for (let i = 0, len = data.length; i < len; i++) {
        //         // if(!that.units[data[i].UnitID]){
        //         //     that.units[data[i].UnitID] = data[i];
        //             res.push(data[i]);
        //         // }
        //         if (data[i].UnitType == 4 || data[i].Type == 4) {
        //             //用户
        //             tempData.UserItems.push(data[i]);
        //         } else {
        //             //部门
        //             tempData.OrgUnitItems.push(data[i]);
        //         }
        //     }
        //     res = new Set(res);
        //     res = [...res];
        //     that.users = res;
        //     that.value = res;
        //     that.formVal.Value=res;
        //     if(!isInit){
        //         that.OnChange();
        //     }
        //     //Render
        //     // that.RenderAsDing(res);
        // })
        $.ajax({
          url: baseUrl + that.AjaxUrl,
          method: 'post',
          data: params,
          dataType: 'json',
          async: false,
          success(response) {
            if (response.Successful) {
              // that.users = data
              // 直接添加到缓存和结果中
              const data = response.ReturnData.UnitItems;
              for (let i = 0, len = data.length; i < len; i += 1) {
                res.push(data[i]);
                if (data[i].UnitType === 4 || data[i].Type === 4) {
                  // 用户
                  tempData.UserItems.push(data[i]);
                } else {
                  // 部门
                  tempData.OrgUnitItems.push(data[i]);
                }
              }
              res = new Set(res);
              res = [...res];
              that.users = res;
              that.value = res;
              that.formVal.Value = res;
              if (!isInit) {
                that.OnChange();
              }
            }
          },
          error() {
            // reject(err);
          },
        });
      } else {
        // Render
        // that.RenderAsDing(res);
        res = new Set(res);
        res = [...res];
        that.users = res;
        that.value = res;
        that.formVal.Value = res;
        if (!isInit) {
          that.OnChange();
        }
      }
    },
    // 渲染成钉钉样式
    RenderAsDing(units) {
      if (!this.Visible) {
        return;
      } // 不可见时不执行
      if (units) {
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
              (counts.D += 1);
            } else {
              (counts.C += 1);
            }
          }
        }
        if (dataUser.Departs.length > 0 && dataUser.Users.length > 0) {
          dataUser.ShowDepTitle = true;
          dataUser.ShowUserTitle = true;
        }
      }
    },
    GetValue() {
      const tempValArr = [];
      for (const obj of this.value) {
        if (Object.prototype.toString.call(obj).indexOf('String') > -1) {
          tempValArr.push(obj);
        } else {
          tempValArr.push(obj.UnitID || obj.ObjectId);
        }
      }
      return tempValArr;
    },
    GetUnitIDs() {
      return this.GetValue();
    },
    GetUnitIds() {
      return this.GetValue();
    },
    GetText() {
      const userNames = [];
      for (const obj of this.value) {
        if (Object.prototype.toString.call(obj).indexOf('String') < 0) {
          userNames.push(obj.DisplayName || obj.Name);
        }
      }
      return userNames.length ? userNames.toString() : '';
    },
    // 校验
    Validate() {
      // 不可编辑
      if (!this.formVal.Editable) return true;
      const val = this.GetValue();
      if (this.formVal.Required && (this.isEmptyObject(val) || val.length === 0)) {
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      return true;
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
            const controlManager = control;
            // 列表筛选时取不到值
            if (!controlManager) {
              continue;
            }
            SelectionRange = SelectionRange.replace(`${selects[i]};`, '');

            const items = controlManager.GetValue();
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
    // 跳转到选择页面
    chooseUser() {
      // 判断是否设置选人规则//更新选人范围
      if (this.formVal.unitselectionrange && this.formVal.unitselectionrange.length > 0) {
        this.UpdateUnitSelectionRange();
        this.$store.state.isHtmlChangedBol = true;
      }
      if (this.formVal.Editable) {
        this.$router.push({
          name: 'userDepartmentChoosePage',
          params: {
            value: this.users, // 之前版本的，再考虑
            showUnActive: this.formVal.showunactive || false,
            unitSelectionRange: this.unitSelectionRange,
            userVisible: this.formVal.uservisible,
            orgUnitVisible: this.formVal.orgunitvisible,
            isMultiple: this.formVal.ismultiple,
            keyName: this.keyName,
            ObjectId: this.ObjectId,
          },
        });
      }
    },
    // 把从选人页面获取的值赋值给当前控件
    assignVal(items, keyName, ObjectId) {
      if (this.ObjectId === ObjectId) {
        if (keyName === this.keyName) {
          this.usersArr.splice(0, this.usersArr.length);
          this.depsArr.splice(0, this.depsArr.length);
          this.users.splice(0, this.users.length);
          this.value = JSON.parse(JSON.stringify(items));
          this.formVal.Value = JSON.parse(JSON.stringify(items));
          this.users = JSON.parse(JSON.stringify(items));
          this.OnChange();
        }
      }
    },
    // 判断unit对象是否只有ObjectId值
    IsOnlyObjectIdObj(obj) {
      return Object.prototype.hasOwnProperty.call(obj, 'ObjectId') && Object.prototype.hasOwnProperty.call(obj, 'ParentId');
    },
    // 保存数据
    SaveDataField() {
      const result = {};
      result[this.formVal.dataField] = this.GetValue();
      return result;
    },
    // hideQuestion() {
    //   this.isQuestionShowBol = !this.isQuestionShowBol;
    // },
  },
  computed: {
    usersArr() {
      const arr = [];
      this.depsArr.splice(0, this.depsArr.length);
      for (const obj of this.users) {
        if (obj.Type === 4 || obj.UnitType === 4 || obj.ParentName) {
          arr.push(obj);
        } else {
          this.depsArr.push(obj);
        }
      }
      return arr;
    },
  },
  watch: {
    usersArr() {
      // this.$store.state.isHtmlChangedBol = true;
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
#form-multi-user {
  background-color: white;
  .controlLayout;
  .content {
    .left {
      span {
        // margin-top: .1rem;
        .px2rem(margin-top, 10);
        display: inline-block;
      }
    }
    .right {
      .icon-user2 {
        .px2rem(font-size, 44);
        .px2rem(top, -12);
      }
      .icon-user2:before {
        color: @font-color9;
      }
      .user-list {
        .px2rem(margin-top, 16);
        font-size: 0;
        li {
          // margin:0 .14rem .14rem 0;
          .px2rem(margin-left, 14);
          .px2rem(margin-bottom, 14);
          display: inline-block;
          text-align: center;
          vertical-align: top;
          span {
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              vertical-align: top;
            }
          }
          .icon-color,
          .icon-add2 {
            position: relative;
            display: inline-block;
            .px2rem(width, 63);
            .px2rem(height, 63);
            border-radius: 50%;
            text-align: center;
            .px2rem(line-height, 63);
            right: 0;
            color: @font-color9;
            .user-name {
              width: 100%;
              height: 100%;
              display: inline-block;
              vertical-align: top;
              border-radius: 50%;
              color: white;
            }
          }
          .icon-add2 {
            border: 1px solid #999999;
          }
          .icon-mistake {
            position: absolute;
            right: 0;
            top: 0;
            transform: translateX(50%);
            color: @font-color9;
            background-color: white;
            border-radius: 50%;
          }
          p {
            text-align: center; // margin-top: .1rem;
            // width: 1rem;
            // height: .38rem;
            // line-height: .38rem;
            .px2rem(margin-top, 10);
            .px2rem(width, 100);
            .px2rem(height, 38);
            .px2rem(line-height, 38);
            color: @font-color9;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &:nth-child(4n + 1) {
            margin-left: 0;
          }
        }
      }
      .dep-list {
        font-size: 0;
        .px2rem(margin-top, 16);
        .px2rem(max-width, 464);
        li {
          color: @font-color-blue; // padding: .04rem .2rem;
          .px2rem(padding-top, 4);
          .px2rem(padding-bottom, 4);
          .px2rem(padding-left, 20);
          .px2rem(padding-right, 20);
          border: 1px solid #108ee9;
          display: inline-block; // border-radius: .1rem;
          // margin:0 .14rem .14rem 0;
          .px2rem(border-radius, 10);
          .px2rem(margin-right, 14);
          .px2rem(margin-bottom, 14);
          max-width: 90%;
          position: relative;
          p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 100%;
            height: 100%;
          }
          .icon-mistake {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
            background-color: white;
            border-radius: 50%;
          }
        }
      }
      .icon-next2 {
        .px2rem(top, -12);
      }
    }
  }
}
</style>