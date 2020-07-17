<template>
<!--  :class='{"animated pulse":errorBol}' -->
    <div id="form-multi-query" v-show="isVisible">
        <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
            <div class="left">
                <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                </p>
            </div>
            <div class="right" :class="{'value-height':currentVal.length>0}" @click="chooseItems()">
                <input class="d-font30" type="text" :class="[errorBol?'error':'']" :placeholder="placeholder" readonly v-model="value" v-if='currentVal.length<1'>
                <ul class="queryItems">
                    <li v-for='(item,index) in currentVal' :key='index'>{{item}}</li>
                </ul>
                <i class="icon icon-next2" v-if="formVal.Editable"></i>
            </div>
        </div>
        <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
        <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
        <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    </div>
</template>

<script>
import { getFormatBizObject } from '../../../service/get-data';
import mixin from '../../../mixins/base-controler';
import smartForm from '../../../lib/smart-form';

export default {
  name: 'FormMultiQuery',
  props: ['formVal', 'keyName', 'schemaCode', 'ObjectId'],
  data() {
    return {
      placeholder: '请选择已有表单的数据',
      ismultiple: true,
      isInit: true,
      selectTime: 0, // 选择次数
      currentVal: [],
      isInGrid: false,
      gridDataField: '',
      errorBol: false,
      isQuestionShowBol: false,
      sheetdata: '',
      isSetValueBol: false,
      value: [],
      isVisible: true,
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    // 初始化placeholder
    this.initPlaceholder();
    // 接收来自关联列表页面传回的objectid
    this.$root.eventHub.$on(`QUERY_ASSIGN_VALUE${this.keyName}${this.ObjectId}`, this.QUERY_ASSIGN_VALUE);
  },
  mounted() {
    this.$nextTick(() => {
      this.InitValue(this.formVal.Value, '', true);
    });
  },
  beforeDestory() {
    this.$root.eventHub.$off(`QUERY_ASSIGN_VALUE${this.keyName}${this.ObjectId}`);
  },
  methods: {
    initPlaceholder() {
      if (!this.formVal.Editable) {
        this.placeholder = '';
      }
    },
    QUERY_ASSIGN_VALUE(obj) {
      if (this.selectTime > 0) {
        this.isInit = false;
      }
      // 用objectid识别是哪个控件
      if (obj.ObjectId === undefined) {
        if (obj.datafield === this.keyName) {
          this.SetValue(obj.item, undefined, this.isInit);
        }
      } else if (obj.ObjectId === this.ObjectId) {
        if (this.keyName === obj.datafield) {
          this.SetValue(obj.item, undefined, this.isInit);
        }
      }
    },
    async getBizObject(schemaCode, ObjectId, callback) {
      const data = await getFormatBizObject(schemaCode, ObjectId);
      if (data.Successful) {
        callback(data.ReturnData);
      }
    },
    SetValue(item, rowData, isInit) {
      this.AddValue(item, rowData, isInit);
    },
    InitValue(item, rowData, isInit) {
      this.AddValue(item, rowData, isInit);
    },
    AddValue(items, rowData, isInit) {
      let item = items;
      this.value = [];
      this.isSetValueBol = true;
      if (!item || item.length === 0) {
        this.currentVal = [];
        return '';
      }
      // 判断关联的是否是子表,如果是子表，就要取子表的objectID
      let isAssociateChild = false;
      let keys = [];
      if (Object.prototype.toString.call(item).indexOf('Object') > -1) {
        keys = Object.keys(item);
      } else {
        keys = Object.keys(item[0]);
      }
      let childDataField = '';
      for (const key of keys) {
        if (key.indexOf('.') > -1) {
          isAssociateChild = true;
          childDataField = key.split('.')[0];
          break;
        }
      }
      if (Object.prototype.toString.call(item).indexOf('Object') > -1) {
        if (isAssociateChild) {
          item = item[`${childDataField}.ObjectId`];
        } else {
          item = item.ObjectId;
        }
      }
      if (Object.prototype.toString.call(item).indexOf('String') > -1) {
        // #Error:如果不是从后台加载的，需要支持开发者SetValue(ObjectId)
        let name = '';
        const self = this;
        // ERROR这里有可能是空值
        if (name.trim() === '') {
          this.getBizObject(this.formVal.boschemacode, item, (data) => {
            if (data && data.ListViewData && data.ListViewData.length > 0) {
              name = data.ListViewData[0].Name.trim();
            }
            if (name.trim() === '') {
              name = '--';
            }
            if (isInit) {
              self.currentVal = [name];
              self.value = [item];
            } else {
              self.currentVal.push(name);
              self.value.push(item); // item就是objectId
            }
          });
        } else {
          this.currentVal.push(name);
          this.value.push(item); // item就是objectId
          this.formVal.Value = item;
        }
        if (!isInit) {
          this.OnChange();
        }
      } else if (Object.prototype.toString.call(item).indexOf('Array') > -1) {
        // 传入多个值
        // [item,item,item]
        const that = this;
        let objectIds = '';
        for (let i = 0; i < item.length; i += 1) {
          if (item[i] === undefined) {
            continue;
          }
          if (isAssociateChild) {
            objectIds += `${item[i][`${childDataField}.ObjectId`]};`;
          } else if (item[i].ObjectId) {
            objectIds += `${item[i].ObjectId};`;
          } else {
            objectIds += `${item[i]};`;
          }
        }
        this.getBizObject(this.formVal.boschemacode, objectIds, (data) => {
          const retData = data.ListViewData;
          const objectIdArr = [];
          const names = [];
          // 判断关联的是子表还是主表
          let isAssociateChildSec = false;
          for (const key in retData[0]) {
            if (key.toLowerCase().indexOf('.objectid') > -1) {
              isAssociateChildSec = true;
              break;
            }
          }
          for (let i = 0; i < retData.length; i += 1) {
            const ObjectId = isAssociateChildSec
              ? retData[i][`${that.formVal.boschemacode}.ObjectId`]
              : retData[i].ObjectId;
            objectIdArr.push(ObjectId);
            const name =
              (isAssociateChildSec ? retData[i][`${that.formVal.boschemacode}.Name`].trim() || '--' : retData[i].Name) ||
              '--';
            names.push(name.trim());
          }
          that.currentVal = names;
          if ((that.value && !that.value.length) || !that.value) {
            that.value = objectIdArr;
            that.formVal.Value = objectIdArr;
          }
          if (!isInit) {
            that.OnChange();
          }
        });
      }
      return true;
    },
    GetValue() {
      if (this.value == null) {
        return [];
      }
      return this.value;
    },
    GetText() {
      return this.formVal.DisplayName;
    },
    chooseItems() {
      this.$store.state.isHtmlChangedBol = true;
      this.sheetdata = JSON.stringify(this.GetAssociationFilterData());
      this.selectTime += 1;
      if (this.formVal.Editable) {
        this.$router.push({
          name: 'formquery',
          params: {
            boschemacode: this.formVal.boschemacode,
            curcode: this.schemaCode,
            datafield: this.keyName,
            rowid: '',
            ismultiple: this.ismultiple,
            isSingleQuery: false,
            sheetdata: this.sheetdata,
            ObjectId: this.ObjectId,
            value: this.value,
          },
        });
      }
    },
    GetAssociationFilterData() {
      const that = this;
      const sheetData = {};
      if (that.formVal.associationfilter || that.formVal.bofilter) {
        const tempRule = JSON.parse(that.formVal.associationfilter) ||
        JSON.parse(that.formVal.bofilter);
        const rule = tempRule.Rule;
        if (rule && rule.length > 0) {
          const controls = smartForm.controls;
          const returnData = that.$store.state.formData.responseContext.ReturnData;
          let hasCreatedByCtrl = false; // 是否有创建者控件
          let hasOwnerCtrl = false; // 是否有拥有者控件
          let hasOwnerDeptCtrl = false; // 是否有所属部门控件
          for (const control in controls) {
            if (Object.prototype.hasOwnProperty.call(controls, control)) {
              let controlValue = '';
              const ctrl = controls[control];
              let controlDataField = ctrl.keyName;
              if (controlDataField === 'CreatedBy.FullName') {
                controlDataField = controlDataField.split('.')[0];
                hasCreatedByCtrl = true;
              }
              if (controlDataField === 'OwnerId') {
                hasOwnerCtrl = true;
              }
              if (controlDataField === 'OwnerDeptId') {
                hasOwnerDeptCtrl = true;
              }
              if (ctrl.formVal.controlkey !== 'FormGridView') {
                if (rule.indexOf(`${controlDataField}}`) < 0 || controlDataField === that.keyName) continue;
                const ctrlFieldIndex = rule.indexOf(`${controlDataField}}`);
                const prefix = rule.slice(ctrlFieldIndex - 1, ctrlFieldIndex);
                if (prefix !== '{' && prefix !== '.') {
                  continue;
                }
                if (controlDataField === 'CreatedBy') {
                  controlValue =
                  that.$store.state.formData.responseContext.ReturnData.CreatedBy.Value[0].UnitId;
                } else {
                  if (ctrl.keyName === undefined || controlDataField === 'Comments') continue;
                  controlValue = ctrl.GetValue() == null ? '' : ctrl.GetValue();
                }
              } else {
                for (const item of ctrl.$children[0].$children) {
                  let breakLoop = false;
                  for (const childItem of item.$children) {
                    controlDataField = childItem.keyName;
                    const tempObjectId = childItem.ObjectId;
                    if (rule.indexOf(`${controlDataField}}`) < 0 || controlDataField === that.keyName) continue;
                    const ctrlFieldIndex = rule.indexOf(`${controlDataField}}`);
                    const prefix = rule.slice(ctrlFieldIndex - 1, ctrlFieldIndex);
                    if (prefix !== '{' && prefix !== '.') {
                      continue;
                    }
                    if (controlDataField === 'CreatedBy') {
                      controlValue = returnData.CreatedBy.Value[0].UnitId;
                    } else {
                      if (childItem.keyName === undefined || controlDataField === 'Comments') continue;
                      if (that.keyName.indexOf('.') > 0) {
                        if (that.ObjectId === tempObjectId) {
                          controlValue = childItem.GetValue() == null ? '' : childItem.GetValue();
                          breakLoop = true;
                          break;
                        }
                      } else {
                        controlValue = [];
                        for (let i = 0; i < childItem.$children[0].$children.length; i += 1) {
                          controlValue.push(childItem.$children[0].$children[i].GetValue());
                        }
                      }
                    }
                  }
                  if (breakLoop) break;
                }
              }
              sheetData[controlDataField] = controlValue;
            }
          }
          if (!hasCreatedByCtrl) {
            sheetData.CreatedBy = returnData.CreatedBy.Value[0].UnitId;
          }
          if (!hasOwnerCtrl) {
            sheetData.OwnerId = returnData.OwnerId.Value[0].UnitId;
          }
          if (!hasOwnerDeptCtrl) {
            sheetData.OwnerDeptId = returnData.OwnerDeptId
              ? that.$store.state.formData.responseContext.ReturnData.OwnerDeptId.Value[0].UnitId
              : null;
          }
          sheetData.CreatedTime = returnData.CreatedTime.Value;
        }
      }
      return sheetData;
    },
    SaveDataField() {
      const result = {};
      // if (!this.formVal.Visible&&!this.formVal.Editable) return result;
      result[this.formVal.dataField] = this.GetValue();
      return result;
    },
    // 校验
    Validate() {
      // 不可编辑
      if (!this.formVal.Editable) return true;
      const val = this.GetValue();
      if (this.formVal.Required && ($.isEmptyObject(val) || val.length === 0)) {
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      return true;
    },
    // hideQuestion() {
    //   this.isQuestionShowBol = !this.isQuestionShowBol;
    // },
  },
  computed: {},
  watch: {
    currentVal() {
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
#form-multi-query {
  .controlLayout;
  background-color: white;
  .content {
    .right {
      .queryItems {
        .px2rem(max-width,440);
        .px2rem(padding-top,16);
        li {
          color: @font-color-blue;
          .px2rem(padding-top,4);
          .px2rem(padding-bottom,4);
          .px2rem(padding-left,20);
          .px2rem(padding-right,20);
          border: 1px solid #108ee9;
          display: inline-block;
          .px2rem(border-radius,5);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .px2rem(margin-right,14);
          .px2rem(margin-bottom,14);
          .px2rem(max-width,400);
        }
      }
      .icon {
        .px2rem(top,-12) !important;
      }
    }
  }
}
</style>
