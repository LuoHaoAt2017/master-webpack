<template>
  <!--  :class='{"animated pulse":errorBol}' -->
  <div id="form-query" v-show="isVisible">
    <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
      <div class="left">
        <p class="dp-font30">{{formVal.DisplayName}}
          <span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
          <i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
        </p>
      </div>
      <div class="right">
        <input class="dp-font30" :class="[errorBol?'error':'']" type="text" @click="chooseItems()" :placeholder="placeholder" readonly
          v-model="currentVal" v-if="formVal.Editable">
        <div class="text dp-font30" v-if='!formVal.Editable'>{{currentVal}}</div>
        <span class="icon icon-next2" @click="chooseItems()" v-if='!inputByScan&&formVal.Editable'></span>
        <span class="icon icon-saoyisao" @click='scan' v-if='inputByScan && formVal.Editable'></span>
      </div>
    </div>
    <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
    <div class="error-wrap" v-if='errorBol'></div>
    <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    <input type="hidden" :title="value">
  </div>
</template>

<script>
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import {
  getFormatBizObject,
  confirmQueryFormData,
  getChildSheetData,
  GetMappingFilesData,
  GetQueryDataByScan,
  getOriginalUrl,
} from '../../../service/get-data';
import SmartForm from '../../../lib/smart-form';
import mixin from '../../../mixins/base-controler';

export default {
  name: 'FormQuery',
  props: ['formVal', 'keyName', 'schemaCode', 'ObjectId'],
  data() {
    return {
      currentVal: '',
      MappingProperties: null,
      ismultiple: false,
      placeholder: '请选择已有表单的数据',
      IsFirstQuery: true,
      inputByScan: false,
      isInGrid: false,
      gridDataField: '',
      scanParams: '',
      FilterFields: [],
      isFirstClick: 0,
      errorBol: false,
      isQuestionShowBol: false,
      sheetdata: '',
      isSetValueBol: false,
      value: '',
      isVisible: true,
      isInit: true,
      isSelected: false, // 判断是否从关联表单列表页选择过值
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
      this.ismultiple = true;
    }
    // 初始化placeholder
    this.initPlaceholder();

    if (this.formVal.inputbyscan === 'true') {
      this.inputByScan = true;
      this.placeholder = '';
    }

    // 接收来自关联列表页面传回的objectid
    this.$root.eventHub.$on(`QUERY_ASSIGN_VALUE${this.keyName}${this.ObjectId}`, this.QUERY_ASSIGN_VALUE);
  },
  beforeDestory() {
    this.$root.eventHub.$off(`QUERY_ASSIGN_VALUE${this.keyName}${this.ObjectId}`);
  },
  methods: {
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          this.placeholder = `${this.placeholder}(必填)`;
        }
      } else {
        this.placeholder = '';
      }
    },
    QUERY_ASSIGN_VALUE(obj) {
      if (Array.isArray(obj.item) && obj.item.length) {
        this.isSelected = true;
      }
      if (obj.ObjectId === undefined) {
        if (this.keyName === obj.datafield) {
          // this.SetValue(obj.item.ObjectId)
          this.SetValue(obj.item);
        }
      } else if (obj.ObjectId === this.ObjectId) {
        if (this.keyName === obj.datafield) {
          this.SetValue(obj.item);
        }
      }
    },
    async getBizObject(schemaCode, ObjectId, callback) {
      const data = await getFormatBizObject(schemaCode, ObjectId);
      if (data.Successful) {
        callback(data.ReturnData);
      }
    },
    async postBizObject(schemaCode, callback) {
      const data = await confirmQueryFormData(schemaCode);
      if (data.Successful) {
        callback(data);
      }
    },
    async getChildSheet(TargetChild, SchemaCode, BizObjectId, PropertyName, callback) {
      const data = await getChildSheetData(TargetChild, SchemaCode, BizObjectId, PropertyName);
      if (data.Successful) {
        callback(data);
      }
    },
    async GetMappingFiles(SchemaCode, BizObjectId, PropertyName, callback) {
      const data = await GetMappingFilesData(SchemaCode, BizObjectId, PropertyName);
      if (data.Successful) {
        callback(data);
      }
    },
    async getScanSheet(params) {
      const that = this;
      const data = await GetQueryDataByScan(params);
      if (data.Successful) {
        const result = data.ReturnData.Data;
        if (result.rows && result.rows.ReturnData) {
          const items = result.rows.ReturnData;
          if (items && items.length > 1) {
            // 跳转到关联表单页面
          } else if (items && items.length === 1) {
            const currentItem = items[0];
            that.SetValue({ ObjectId: currentItem.ObjectId, Name: currentItem.Name }, currentItem);
          } else {
            H3PluginDeveloper.IShowWarn('提示', '没有找到匹配的数据');
          }
        }
      } else {
        H3PluginDeveloper.IShowWarn('提示', '没有找到匹配的数据');
      }
    },
    SetValue(item, rowData, asy) {
      this.isInit = false;
      this.AddValue(item, rowData, asy);
    },
    InitValue(item, rowData, asy, isInit) {
      this.AddValue(item, rowData, asy, isInit);
    },
    AddValue(items, rowData, asy, isInit) {
      let item = items;
      this.isSetValueBol = true;
      this.IsFirstQuery = false; // 只要控件赋值过，再次打开就算是修改
      if (item == null || item === undefined
      || (Object.prototype.toString.call(item).indexOf('Array') > -1 && !item.length)) {
        return '';
      }
      const tempMappingcontrols = new Function(`return ${this.formVal.mappingcontrols}`)();
      const tempMappingproperties = new Function(`return ${this.formVal.mappingproperties}`)();
      if (item === '') {
        this.SetCurrentVal('', '', isInit);
        if (!$.isEmptyObject(tempMappingproperties) && !isInit) {
          this.ClearMappingValue();
        }
        return '';
      }
      // 判断关联的是否是子表,如果是子表，就要取子表的objectID
      let isAssociateChild = false;
      let keys = [];
      if (item.constructor === Object) {
        keys = Object.keys(item);
      } else if (item.constructor === Array) {
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

      let itemName = '';
      let itemObjectId = [];
      const that = this;
      if (Object.prototype.toString.call(item).indexOf('Array') > -1) {
        item.some((childItem) => {
          if (isAssociateChild) {
            let tempName = childItem[`${childDataField}.Name`];
            tempName = tempName ? tempName.trim() : '--';
            itemName += tempName ? `${tempName};` : '--;';
            itemObjectId.push(childItem[`${childDataField}.ObjectId`] || childItem[0][`${childDataField}.ObjectId`]);
          } else {
            if (childItem.Name === '') {
              itemName += '--;';
            } else {
              itemName += `${childItem.Name};`;
            }
            itemObjectId.push(childItem.ObjectId || childItem[0].ObjectId);
          }
          return null;
        });
        if (
          (!this.formVal.mappingcontrols && !this.formVal.mappingproperties) ||
          ($.isEmptyObject(tempMappingcontrols) && $.isEmptyObject(tempMappingproperties))
        ) {
          const nameArr = itemName.split(';');
          const gridComponent = SmartForm.controls[this.keyName.split('.')[0]];
          let selectIdx;
          // if (itemObjectId.length > 1) {
          //   for (let i = 0; i < itemObjectId.length - 1; i += 1) {
          //     gridComponent.addChildRow();
          //   }
          // }
          gridComponent.$children[0].$children.some((childComponent, idx) => {
            childComponent.$children.some((tempSecChildComponent) => {
              const secChildComponent = tempSecChildComponent;
              if (secChildComponent.ObjectId === this.ObjectId) {
                selectIdx = idx;
                if (secChildComponent.keyName === this.keyName) {
                  secChildComponent.value = itemObjectId[0];
                  secChildComponent.formVal.Value = itemObjectId[0];
                  secChildComponent.currentVal = nameArr[0];
                }
              }
              return null;
            });
            return null;
          });
          if (itemObjectId.length > gridComponent.$children[0].$children.length - selectIdx - 1) {
            for (let i = 0; i <
            (itemObjectId.length - gridComponent.$children[0].$children.length) +
            selectIdx; i += 1) {
              gridComponent.addChildRow();
            }
          }
          this.$nextTick(function c() {
            if (itemObjectId.length > 1) {
              for (let i = 1; i < itemObjectId.length; i += 1) {
                const $children = gridComponent.$children[0].$children[selectIdx + i].$children;
                for (const tempObj of $children) {
                  if (tempObj.keyName === this.keyName) {
                    tempObj.value = itemObjectId[i];
                    tempObj.formVal.Value = itemObjectId[i];
                    tempObj.currentVal = nameArr[i];
                    tempObj.OnChange();
                  }
                }
              }
            }
            if (!isInit) {
              that.OnChange();
            }
            return null;
          });
        }
      } else if (Object.prototype.toString.call(item).indexOf('Object') > -1) {
        if (isAssociateChild) {
          itemName = item[`${childDataField}.Name`];
          itemName = itemName ? itemName.trim() : '--';
          itemObjectId = item[`${childDataField}.ObjectId`] || item[0][`${childDataField}.ObjectId`];
        } else {
          if (item.Name === '') {
            itemName = '--';
          } else {
            itemName = item.Name;
          }
          if (Object.prototype.toString.call(item).indexOf('Object') > -1) {
            itemObjectId = item.ObjectId;
          } else {
            itemObjectId = item[0].ObjectId;
          }
        }
        if (
          (!this.formVal.mappingcontrols && !this.formVal.mappingproperties) ||
          ($.isEmptyObject(tempMappingcontrols) && $.isEmptyObject(tempMappingproperties))
        ) {
          this.currentVal = itemName;
          this.value = itemObjectId;
          this.formVal.Value = itemObjectId;
          if (!isInit) {
            this.OnChange();
          }
          return null;
        }
      }

      if (Object.prototype.toString.call(item).indexOf('Object') > -1) {
        if (isAssociateChild) {
          item = item[`${childDataField}.ObjectId`];
        } else {
          item = item.ObjectId;
        }
      }

      const self = this;
      let name = '';
      if (item.constructor === String) {
        // #Error:如果不是从后台加载的，需要支持开发者SetValue(ObjectId)
        if (SmartForm.ResponseContext && SmartForm.ResponseContext.AssociatedBoNames &&
          SmartForm.ResponseContext.AssociatedBoNames[item] && !this.isFirstClick) {
          name = SmartForm.ResponseContext.AssociatedBoNames[item].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        // ERROR这里有可能是空值
        if (name.trim() === '' || !$.isEmptyObject(tempMappingproperties)) {
          this.getBizObject(this.formVal.boschemacode, item, (data) => {
            if (data && data.ListViewData && data.ListViewData.length > 0) {
              if (isInit) {
                if (self.$store.state.formData.responseContext.IsCreateMode) {
                  self.SetMappingValue(data.ListViewData[0]);
                } else if (self.formVal.mappingproperties) {
                // 查看状态只携带关联属性
                  self.SetMappingValue(data.ListViewData[0], self.formVal.mappingproperties);
                }
              } else {
                self.SetMappingValue(data.ListViewData[0]);
              }
              let secKeys = [];
              secKeys = Object.keys(data.ListViewData[0]);
              let secChildDataField = '';
              for (const key of secKeys) {
                if (key.indexOf('.') > -1) {
                  isAssociateChild = true;
                  secChildDataField = key.split('.')[0];
                  break;
                }
              }
              if (isAssociateChild) {
                name = data.ListViewData[0][`${secChildDataField}.Name`];
              } else {
                name = data.ListViewData[0].Name.trim();
              }
            }
            if (name.trim() === '') {
              name = '--';
            }
            self.currentVal = name;
            self.value = item; // item就是objectId
            self.formVal.Value = item; // item就是objectId
            if (!isInit) {
              self.OnChange();
            }
          });
        } else {
          this.currentVal = name;
          this.value = item; // item就是objectId
          self.formVal.Value = item; // item就是objectId
          if (!isInit) {
            self.OnChange();
          }
        }
      } else if (item.constructor === Array) {
        // 传入多个值
        // [item,item,item]
        let objectIds = '';
        if (Object.prototype.toString.call(item[0]).indexOf('String') > -1) {
          objectIds = item.join(';');
        } else {
          for (let i = 0; i < item.length; i += 1) {
            if (item[i] === undefined) {
              continue;
            }
            if (isAssociateChild) {
              objectIds += `${item[i][`${childDataField}.ObjectId`]};`;
            } else {
              objectIds += `${item[i].ObjectId};`;
            }
          }
        }

        this.getBizObject(this.formVal.boschemacode, objectIds, (data) => {
          if (data && data.ListViewData && data.ListViewData.length > 0) {
            if (isInit) {
              if (self.$store.state.formData.responseContext.IsCreateMode) {
                self.SetMappingValue(data.ListViewData[0]);
              } else if (self.formVal.mappingproperties) {
                // 查看状态只携带关联属性
                self.SetMappingValue(data.ListViewData[0], self.formVal.mappingproperties);
              }
            } else {
              self.SetMappingValue(data.ListViewData[0]);
            }
            if (isAssociateChild) {
              name = data.ListViewData[0][`${childDataField}.Name`];
            } else {
              name = data.ListViewData[0].Name.trim();
            }
          }
          if (
            data &&
            data.ListViewData &&
            data.ListViewData.length > 1 &&
            (!isInit || self.$store.state.formData.responseContext.IsCreateMode)
          ) {
            const newListViewData = data.ListViewData.slice(1, data.ListViewData.length);
            self.SetMappingValue(newListViewData);
          }
          if (name.trim() === '') {
            name = '--';
          }
          self.currentVal = name;
          self.value = objectIds.split(';')[0]; // item就是objectId
          self.formVal.Value = self.value; // item就是objectId
          if (!isInit) {
            self.OnChange();
          }
        });
      }
      return null;
    },
    SetMappingValue(rowData, mapping) {
      const that = this;
      if (that.formVal.sourcetype) return;
      const tempMappingcontrols = new Function(`return ${this.formVal.mappingcontrols}`)();
      if (
        (!this.formVal.mappingcontrols && !that.formVal.mappingproperties) ||
        ($.isEmptyObject(tempMappingcontrols) && $.isEmptyObject(that.formVal.mappingproperties))
      ) {
        return;
      }
      let hasError = false;
      const thisCtrlInChild = that.formVal.dataField.indexOf('.') > -1;
      const boSchemaInfo = that.formVal.boschemainfo;
      let isAssociateChild = boSchemaInfo ? JSON.parse(boSchemaInfo).IsChildSchema : undefined;
      if (isAssociateChild === undefined) {
        const SchemaCode = that.formVal.boschemacode;
        that.postBizObject(SchemaCode, (data) => {
          if (data.Successful) {
            isAssociateChild = data.ReturnData.IsChildSchema;
          } else {
            hasError = true;
          }
          if (hasError) {
            // 出错了
            return;
          }
          let associationType; // 标记关联关系。是主表(子表)关联主表(子表)中的哪一种
          if (!thisCtrlInChild) {
            if (!isAssociateChild) {
              associationType = 1;
            } else {
              associationType = 2;
            }
          } else if (!isAssociateChild) {
            associationType = 3;
          } else {
            associationType = 4;
          }
          switch (associationType) {
            case 1:
              that.mainSchemaAssociateMainSchema(rowData, mapping);
              break;
            case 2:
              that.mainSchemaAssociateChildSchema(rowData, mapping);
              break;
            case 3:
              that.childSchemaAssociateMainSchema(rowData, mapping);
              break;
            case 4:
              that.childSchemaAssociateChildSchema(rowData, mapping);
              break;
            default:
              hasError = true;
              break;
          }
        });
      } else {
        let associationType; // 标记关联关系。是主表(子表)关联主表(子表)中的哪一种
        if (!thisCtrlInChild) {
          if (!isAssociateChild) {
            associationType = 1;
          } else {
            associationType = 2;
          }
        } else if (!isAssociateChild) {
          associationType = 3;
        } else {
          associationType = 4;
        }
        switch (associationType) {
          case 1:
            that.mainSchemaAssociateMainSchema(rowData, mapping);
            break;
          case 2:
            that.mainSchemaAssociateChildSchema(rowData, mapping);
            break;
          case 3:
            that.childSchemaAssociateMainSchema(rowData, mapping);
            break;
          case 4:
            that.childSchemaAssociateChildSchema(rowData, mapping);
            break;
          default:
            hasError = true;
            break;
        }
      }
    },
    setDestControlValue(destControls, sourceField, rowData) {
      const destControl = destControls;
      const that = this;
      let sourceType = '';
      if (destControl === undefined) return;
      switch (destControl.formVal.Type) {
        case 51:
          // 判断destControl是否关联属性控件
          sourceType = destControl.formVal.sourcetype;
          if (sourceType) {
            destControl.formVal.boschemacode = rowData[`${sourceField}_SchemaCode`];
          }
          if (rowData[sourceField] === undefined) {
            destControl.ClearValue();
          } else {
            destControl.SetValue(rowData[sourceField]);
          }
          break;
        case 50:
          {
            const destSchemaCode = rowData[`${sourceField}_SchemaCode`];
            sourceType = destControl.formVal.sourcetype;
            if (sourceType) {
              destControl.formVal.boschemacode = destSchemaCode;
            }
            if (destSchemaCode !== undefined &&
            destSchemaCode !== destControl.formVal.boschemacode) {
              // 关联配置与返回的数据不一致，清空数据
              destControl.ClearValue();
              return;
            }
            const tempMappingcontrols = new Function(`return ${destControl.formVal.mappingcontrols}`)();
            if (destControl.formVal.mappingcontrols && !$.isEmptyObject(tempMappingcontrols)) {
              if (rowData[sourceField] === undefined) {
                destControl.ClearValue();
                destControl.ClearMappingValue();
                return;
              }
              // 有关联配置
              (function a(secDestControl, SchemaCode, ObjectId) {
                that.getBizObject(SchemaCode, ObjectId, (data) => {
                  const returnData = data.ListViewData;
                  if (returnData && returnData.length > 0) {
                    secDestControl.SetValue(returnData[0]);
                  }
                });
              }(destControl, destControl.formVal.boschemacode, rowData[sourceField]));
            } else {
              // 无关联配置
              const ObjectId = rowData[sourceField];
              let name = rowData[`${sourceField}_Name`];
              if (sourceField.indexOf('.') > -1) {
                if (sourceField.toLowerCase().indexOf('.objectid') > -1) {
                // 将ObjectId携带到关联表单
                  name = rowData[`${sourceField.split('.')[0]}.Name`];
                } else {
                  name = rowData[`${sourceField}_Name`];
                }
              }
              if (ObjectId !== undefined && name) {
                destControl.SetValue({
                  ObjectId,
                  Name: name,
                });
              } else if (ObjectId && !name) {
                destControl.SetValue(ObjectId);
              } else destControl.ClearValue();
            }
          }
          break;
        case 24: // 附件
          {
            let ObjectId = 'ObjectId';
            if (sourceField.indexOf('.') > -1) {
              ObjectId = `${sourceField.split('.')[0]}.ObjectId`;
            }

            (function b(thirdDestControl, SchemaCode, BizObjectId, PropertyName) {
              that.GetMappingFiles(SchemaCode, BizObjectId, PropertyName, (data) => {
                if (data.Successful) {
                  // 清空控件上的附件
                  thirdDestControl.ClearFiles();
                  const returnData = data.ReturnData.HandlerResult;
                  if (returnData && returnData.length > 0) {
                    for (let i = 0, len = returnData.length; i < len; i += 1) {
                      const result = returnData[i];
                      thirdDestControl.AppendFile(
                        result.FileId,
                        result.AttachmentId,
                        result.FileName,
                        result.Size,
                        result.Thumb,
                      );
                    }
                  }
                }
              });
            }(destControl, that.formVal.boschemacode, rowData[ObjectId], sourceField));
          }
          break;
        default:
          {
            let val = rowData[sourceField];
            if (destControl.formVal.Type === 1) {
              val = val === '是' || false;
            }
            // 多选人控件时，先清空再赋值
            if (destControl.formVal.Type === 27) {
              destControl.ClearValue();
            }
            // 地址关联要用PropertyName+“_Name”，否则关联值不对
            if (/^\{"adcode":/.test(val) && destControl.Type === 14) {
              val = rowData[`${sourceField}_Name`];
            }
            destControl.SetValue(val);
          }
          break;
      }
    },
    // 主表关联主表
    // 主->主/主->子/子->子
    mainSchemaAssociateMainSchema(rowData, mapping) {
      const that = this;
      // 要把关联配置分成两类。一类是主->主(子),另一类是子->子
      const mainSchemaMapping = {}; // 主->主(子)
      const childSchemaMapping = {}; // 子->子
      const mappings = {};
      if (mapping === undefined) {
        $.extend(mappings, JSON.parse(that.formVal.mappingcontrols)); // 关联配置
        if (that.formVal.mappingproperties !== undefined) {
          $.extend(mappings, JSON.parse(that.formVal.mappingproperties)); // 关联属性
        }
      } else {
        $.extend(mappings, JSON.parse(mapping));
      }
      for (const destField in mappings) {
        if (Object.prototype.hasOwnProperty.call(mappings, destField)) {
          const sourceField = mappings[destField];
          if (destField.indexOf('.') > -1 && sourceField.indexOf('.') > -1) {
            // 子->子
            childSchemaMapping[destField] = sourceField;
          } else {
            mainSchemaMapping[destField] = sourceField;
          }
        }
      }
      // 1.主->主(子)
      for (const destField in mainSchemaMapping) {
        if (Object.prototype.hasOwnProperty.call(mainSchemaMapping, destField)) {
          const sourceField = mainSchemaMapping[destField];
          if (sourceField.indexOf('.') === -1) {
            if (destField.indexOf('.') === -1) {
              // 主->主
              // 判断目标字段类型
              const destControl = SmartForm.controls[destField];
              that.setDestControlValue(destControl, sourceField, rowData);
            } else {
              // 主->子
              const childSchemaField = destField.split('.')[0];
              if (!SmartForm.controls[childSchemaField].$children[0].$children.length) continue;
              const dests =
              SmartForm.controls[childSchemaField].$children[0].$children[0].$children;
              for (let i = 0; i < dests.length; i += 1) {
                const destControl = dests[i];
                if (destControl.formVal.dataField === destField) {
                  that.setDestControlValue(destControl, sourceField, rowData);
                }
              }
            }
          } else {
            // 主表关联主表情况不支持将子表值携带到主表
            // 此场景不支持
          }
        }
      }
      // 2.子->子
      if (!$.isEmptyObject(childSchemaMapping)) {
        // 获取关联配置中源子表和目标子表
        const childSchemas = {}; // {destChildSchema:sourceChildSchema}
        for (const destField in childSchemaMapping) {
          if (Object.prototype.hasOwnProperty.call(childSchemaMapping, destField)) {
            let existInChildSchemas = false;
            const sourceField = childSchemaMapping[destField];
            const sourceChildSchema = sourceField.split('.')[0];
            const destChildSchema = destField.split('.')[0];
            for (const key in childSchemas) {
              if (key === destChildSchema) {
                existInChildSchemas = true;
                break;
              }
            }
            if (!existInChildSchemas) {
              childSchemas[destChildSchema] = sourceChildSchema;
            }
          }
        }
        for (const destChildSchema in childSchemas) {
          if (Object.prototype.hasOwnProperty.call(childSchemas, destChildSchema)) {
            const sourceChildSchema = childSchemas[destChildSchema];
            if (!SmartForm.controls[destChildSchema]) continue;
            // 将源子表的数据添加到目标子表
            this.getChildSheet(
              destChildSchema,
              that.formVal.boschemacode,
              rowData.ObjectId,
              sourceChildSchema,
              (data) => {
                const returnData = data.ReturnData;
                const targetChild = returnData.TargetChild;
                if (returnData.ListViewData && returnData.ListViewData.length > 0) {
                  const ChildSchemaObjectId = returnData.TargetChild;
                  const oldValues = SmartForm.controls[targetChild].GetValue();
                  SmartForm.controls[targetChild].ClearRows();
                  const listViewData = returnData.ListViewData;
                  let len = 0;
                  if (this.isInit) {
                    len = oldValues.length > listViewData.length ?
                      oldValues.length : listViewData.length;
                  } else {
                    len = listViewData.length;
                  }
                  for (let i = 0; i < len; i += 1) {
                    const newRowData = {};
                    newRowData.ObjectId = H3PluginDeveloper.IGuid();
                    const propertySchemaCode = {};
                    if (this.isInit) {
                      for (const row in oldValues[i]) {
                        if (row !== 'ObjectId') {
                          const rowField = `${ChildSchemaObjectId}.${row}`;
                          const dataValue = oldValues[i][row];
                          if (!dataValue) {
                            continue;
                          } else {
                            newRowData[rowField] = dataValue;
                          }
                        }
                      }
                    }
                    for (const destField in childSchemaMapping) {
                      if (Object.prototype.hasOwnProperty.call(childSchemaMapping, destField)) {
                        const sourceField = childSchemaMapping[destField];
                        const sourceValue = listViewData[i][sourceField];
                        if (!sourceValue && sourceValue !== 0) {
                          continue;
                        } else {
                          newRowData[destField] = sourceValue;
                        }
                        // 获取关联属性的BOSchemaCode
                        if (that.formVal.MappingProperties !== undefined) {
                          // 有关联配置
                          let isMappingProperty = false;
                          for (const key in that.formVal.MappingProperties) {
                            if (key === destField) {
                              isMappingProperty = true;
                              break;
                            }
                          }
                          if (isMappingProperty) {
                            propertySchemaCode[destField] = listViewData[i][`${sourceField}_SchemaCode`];
                          }
                        }
                      }
                    }
                    SmartForm.controls[targetChild].AddRow(
                      newRowData.ObjectId,
                      newRowData,
                      null,
                      null,
                      propertySchemaCode,
                    );
                  }
                }
              },
            );
          }
        }
      }
    },
    // 主表关联子表
    // 子->主/子->子
    mainSchemaAssociateChildSchema(rowData, mapping) {
      const that = this;
      const mappings = {};
      if (mapping === undefined) {
        $.extend(mappings, JSON.parse(that.formVal.mappingcontrols)); // 关联配置
        if (that.formVal.mappingproperties !== undefined) {
          $.extend(mappings, JSON.parse(that.formVal.mappingproperties)); // 关联属性
        }
      } else {
        $.extend(mappings, JSON.parse(mapping));
      }
      for (const destField in mappings) {
        if (Object.prototype.hasOwnProperty.call(mappings, destField)) {
          const sourceField = mappings[destField];
          if (destField.indexOf('.') === -1) {
            // 子->主
            const destControl = SmartForm.controls[destField];
            that.setDestControlValue(destControl, sourceField, rowData);
          } else {
            // 子->子
            const childSchemaField = destField.split('.')[0];
            const dests = SmartForm.controls[childSchemaField].$children[0].$children;
            for (let i = 0; i < dests.length; i += 1) {
              const tempChildren = dests[i].$children;
              for (let j = 0; j < tempChildren.length; j += 1) {
                const destControl = tempChildren[j];
                if (destControl.formVal.dataField === destField) {
                  that.setDestControlValue(destControl, sourceField, rowData);
                }
              }
            }
          }
        }
      }
    },
    // 子表关联主表
    // 主->主/主->子
    childSchemaAssociateMainSchema(rowData, mapping) {
      const that = this;
      const mappings = {};
      if (mapping === undefined) {
        $.extend(mappings, JSON.parse(that.formVal.mappingcontrols)); // 关联配置
        if (that.formVal.mappingproperties !== undefined) {
          $.extend(mappings, JSON.parse(that.formVal.mappingproperties)); // 关联属性
        }
      } else {
        $.extend(mappings, JSON.parse(mapping));
      }
      if (!(rowData instanceof Array)) {
        for (const destField in mappings) {
          if (Object.prototype.hasOwnProperty.call(mappings, destField)) {
            const sourceField = mappings[destField];
            if (destField.indexOf('.') === -1) {
              // 主->主
              const destControl = SmartForm.controls[destField];
              that.setDestControlValue(destControl, sourceField, rowData);
            } else {
              // 主->子 可以多选
              // 取当前控件所在行的目标控件
              // 取当前控件所在行的目标控件
              const childSchemaField = destField.split('.')[0];
              let dests = '';
              const gridControlsArr = SmartForm.controls[childSchemaField].$children;
              for (const obj of gridControlsArr[0].$children) {
                if (this.ObjectId === obj.ObjectId) {
                  dests = obj.$children;
                  break;
                }
              }
              for (let i = 0; i < dests.length; i += 1) {
                const destControl = dests[i];
                if (destControl.formVal.dataField === destField) {
                  that.setDestControlValue(destControl, sourceField, rowData);
                }
              }
            }
          }
        }
      } else {
        for (let i = 0; i < rowData.length; i += 1) {
          const setRowData = rowData[i];
          const keysArr = Object.keys(mappings);
          let destChildField = '';
          for (const tempKey of keysArr) {
            if (tempKey && tempKey.indexOf('.') > 1) {
              destChildField = tempKey.split('.')[0];
              break;
            }
          }
          SmartForm.controls[destChildField].addChildRow();
          that.$nextTick(() => {
            for (const destField in mappings) {
              if (Object.prototype.hasOwnProperty.call(mappings, destField)) {
                const sourceField = mappings[destField];
                // 主->子 可以多选
                // 取当前控件所在行的目标控件
                const childSchemaField = destField.split('.')[0];
                let dests = '';
                const gridControlsArr = SmartForm.controls[childSchemaField].$children;
                if (!gridControlsArr.length) continue;
                gridControlsArr[0].$children.some((obj, idx) => {
                  if (that.ObjectId === obj.ObjectId) {
                    dests = gridControlsArr[0].$children[idx + i + 1].$children;
                  }
                  return null;
                });
                for (let j = 0; j < dests.length; j += 1) {
                  const destControl = dests[j];
                  if (that.keyName === destControl.keyName) {
                    destControl.SetCurrentVal(setRowData.Name, setRowData.ObjectId);
                  }
                  if (destControl.formVal.dataField === destField) {
                    that.setDestControlValue(destControl, sourceField, setRowData);
                  }
                }
              }
            }
          });
        }
      }
    },
    // 子表关联子表
    // 子->主/子->子
    childSchemaAssociateChildSchema(rowData, mapping) {
      const that = this;
      const mappings = {};
      if (mapping === undefined) {
        $.extend(mappings, JSON.parse(that.formVal.mappingcontrols)); // 关联配置
        if (that.formVal.mappingproperties !== undefined) {
          $.extend(mappings, JSON.parse(that.formVal.mappingproperties)); // 关联属性
        }
      } else {
        $.extend(mappings, JSON.parse(mapping));
      }
      if (!(rowData instanceof Array)) {
        for (const destField in mappings) {
          if (Object.prototype.hasOwnProperty.call(mappings, destField)) {
            const sourceField = mappings[destField];
            if (destField.indexOf('.') === -1) {
              // 子->主
              const destControl = SmartForm.controls[destField];
              that.setDestControlValue(destControl, sourceField, rowData);
            } else {
              // 子->子
              const childSchemaField = destField.split('.')[0];
              let dests = '';
              const gridControlsArr = SmartForm.controls[childSchemaField].$children;
              for (const obj of gridControlsArr[0].$children) {
                if (this.ObjectId === obj.ObjectId) {
                  dests = obj.$children;
                }
              }
              for (let i = 0; i < dests.length; i += 1) {
                const destControl = dests[i];
                if (destControl.formVal.dataField === destField) {
                  that.setDestControlValue(destControl, sourceField, rowData);
                }
              }
            }
          }
        }
      } else {
        for (let i = 0; i < rowData.length; i += 1) {
          const keysArr = Object.keys(mappings);
          const destChildField = keysArr[0].split('.')[0];
          SmartForm.controls[destChildField].addChildRow();
          that.$nextTick(() => {
            for (const destField in mappings) {
              if (Object.prototype.hasOwnProperty.call(mappings, destField)) {
                const sourceField = mappings[destField];
                const sourceChildField = sourceField.split('.')[0];
                // 主->子 可以多选
                // 取当前控件所在行的目标控件
                let dests = '';
                const gridControlsArr = SmartForm.controls[destChildField].$children;
                gridControlsArr[0].$children.some((obj, idx) => {
                  if (that.ObjectId === obj.ObjectId) {
                    dests = gridControlsArr[0].$children[idx + i + 1].$children;
                  }
                  return null;
                });
                for (let j = 0; j < dests.length; j += 1) {
                  const destControl = dests[j];
                  if (that.keyName === destControl.keyName) {
                    let name = rowData[i][`${sourceChildField}.Name`];
                    if (!name) {
                      name = '--';
                    }
                    destControl.SetCurrentVal(name, rowData[i][`${sourceChildField}.ObjectId`]);
                  }
                  if (destControl.formVal.dataField === destField) {
                    that.setDestControlValue(destControl, sourceField, rowData[i]);
                  }
                }
              }
            }
            return true;
          });
        }
      }
    },
    GetValue() {
      if (this.formVal.Value && this.formVal.Value.ObjectId) {
        return this.formVal.Value.ObjectId;
      }
      if (this.isInit) {
        return this.formVal.Value;
      }
      return this.formVal.Value ? this.formVal.Value : '';
    },
    GetText() {
      return this.formVal.DisplayName;
    },
    chooseItems() {
      this.$store.state.isHtmlChangedBol = true;
      if (
        (this.formVal.Editable && !this.inputByScan) ||
        (this.inputByScan && this.formVal.scanupdateenable === 'true')
      ) {
        this.isFirstClick += 1;
        this.sheetdata = JSON.stringify(this.GetAssociationFilterData());
        if ((this.isFirstClick > 1 || !this.isInit) && this.isSelected) {
          this.ismultiple = false;
        }
        if (this.formVal.Editable) {
          this.$store.state.excludeComp = [];
          this.$router.push({
            name: 'formquery',
            params: {
              boschemacode: this.formVal.boschemacode,
              curcode: this.schemaCode,
              datafield: this.keyName,
              rowid: '',
              ismultiple: this.ismultiple,
              isSingleQuery: true,
              sheetdata: this.sheetdata,
              ObjectId: this.ObjectId,
            },
          });
        }
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
          const controls = SmartForm.controls;
          let hasCreatedByCtrl = false; // 是否有创建者控件
          let hasOwnerCtrl = false; // 是否有拥有者控件
          let hasOwnerDeptCtrl = false; // 是否有所属部门控件
          const returnData = that.$store.state.formData.responseContext.ReturnData;
          for (const control in controls) {
            if (Object.prototype.hasOwnProperty.call(controls, control)) {
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
                let controlValue = '';
                if (controlDataField === 'CreatedBy') {
                  controlValue = returnData.CreatedBy.Value[0].UnitId;
                } else {
                  if (ctrl.keyName === undefined || controlDataField === 'Comments') continue;
                  controlValue = ctrl.GetValue() == null ? '' : ctrl.GetValue();
                }
                sheetData[controlDataField] = controlValue;
              } else {
                for (const item of ctrl.$children[0].$children) {
                  if (item.ObjectId === this.ObjectId) {
                    for (const childItem of item.$children) {
                      controlDataField = childItem.keyName;
                      if (rule.indexOf(`${controlDataField}}`) < 0 || controlDataField === that.keyName) continue;
                      const ctrlFieldIndex = rule.indexOf(`${controlDataField}}`);
                      const prefix = rule.slice(ctrlFieldIndex - 1, ctrlFieldIndex);
                      if (prefix !== '{' && prefix !== '.') {
                        continue;
                      }
                      let controlValue = '';
                      if (childItem.keyName === undefined || controlDataField === 'Comments') continue;
                      if (that.keyName.indexOf('.') > 0) {
                        controlValue = childItem.GetValue() == null ? '' : childItem.GetValue();
                        sheetData[controlDataField] = controlValue;
                      } else {
                        controlValue = [];
                        for (let i = 0; i < childItem.$children[0].$children.length; i += 1) {
                          controlValue.push(childItem.$children[0].$children[i].GetValue());
                        }
                        sheetData[controlDataField] = controlValue;
                      }
                    }
                  }
                }
              }
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
              ? returnData.OwnerDeptId.Value[0].UnitId
              : null;
          }
          sheetData.CreatedTime = returnData.CreatedTime.Value;
        }
      }
      return sheetData;
    },
    // 清除关联配置携带数据
    ClearMappingValue() {
      let mappings = {};
      $.extend(mappings, JSON.parse(this.formVal.mappingcontrols));
      $.extend(mappings, JSON.parse(this.formVal.mappingproperties));
      // 如果是主表关联主表，并且携带子表到子表，则清空整个子表
      let childSchemas = []; 
      let leftMappings = {}; // 要排除的字段
      for (const property in mappings) {
        if (Object.prototype.hasOwnProperty.call(mappings, property)) {
          if (property.indexOf('.') > -1 && mappings[property].indexOf('.') > -1) {
            const childSchema = property.split('.')[0];
            !childSchemas.includes(childSchema) && childSchemas.push(childSchema);
          } else {
            leftMappings[property] = mappings[property];
          }
        }
      }
      // 清空childSchemas中子表行
      if (this.formVal.dataField.indexOf('.') == -1 && this.formVal.boschemacode.indexOf('.') == -1) {
        for (const childSchema of childSchemas) {
          SmartForm.controls[childSchema] && SmartForm.controls[childSchema].ClearRows();
        }
        mappings = leftMappings;
      }
      // 清除剩下mapping控件值
      for (let targetProperty in mappings) {
        if (Object.prototype.hasOwnProperty.call(mappings, targetProperty)) {
          if (targetProperty.indexOf('.') > -1) {
            const gridDataField = targetProperty.split('.')[0];
            let childRows = SmartForm.controls[gridDataField].$children[0].$children;
            for (let childRow of childRows) {
              for (let childControl of childRow.$children) {
                if (childControl.formVal.dataField === targetProperty) {
                  childControl.ClearValue();
                }
              }
            }
          } else {
            SmartForm.controls[targetProperty].ClearValue();
          }
        }
      }
    },
    SaveDataField() {
      const result = {};
      // if (!this.formVal.Visible&&!this.formVal.Editable) return result;
      // 如果值在页面加载后没有改变，那在最终提交表单时，不传递该字段的值
      if (this.oldValue !== this.GetValue()) {
        result[this.formVal.dataField] = this.GetValue() == null ? '' : this.GetValue();
      }

      return result;
    },
    // 校验
    Validate() {
      // 不可编辑
      if (!this.formVal.Editable) return true;
      const val = this.GetValue();
      if (this.formVal.Required && $.isEmptyObject(val)) {
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      return true;
    },
    SetCurrentVal(name, val, isInit) {
      this.currentVal = name;
      this.value = val;
      this.formVal.Value = val;
      if (!isInit) {
        this.OnChange(this);
      }
    },
    scan() {
      H3PluginDeveloper.IScanBarCode(this.scanCallback);
    },
    scanCallback(text) {
      // let scanResult = "https://beta.h3yun.com/mobile/?CorpId=dingdf00f32aeca82bac&sc=s0kv0v2b0744fdtrshg1vadf2l&bo=f8940476-e8e4-4604-b1b8-6b757a099d42&mt=Task&ai=&ao=1";//需要判断是否为二维码接口返回数据转换成对象取ObjectId
      if (text.indexOf('/su/re') === -1) {
        this.handleScanText(text);
        this.getScanSheet(this.scanParams);
        return;
      }

      const me = this;
      me.getOriginalUrlAsync(text, (originalUrl) => {
        me.handleScanText(originalUrl);
        me.getScanSheet(me.scanParams);
      }, () => {
        me.handleScanText(text);
        me.getScanSheet(me.scanParams);
      });
    },
    handleScanText(scanResult) {
      // 是否关联表单
      let isQrcode = false;
      if (
        scanResult.indexOf('mobile/?') > -1 ||
        scanResult.indexOf('mobile/') > -1 ||
        scanResult.indexOf('Mobile/') > -1
      ) {
        isQrcode = true;
      }
      // 设置生效数据、可读权限范围查询
      let SheetData = {};
      if (this.FilterFields.length > 0) {
        for (const val of this.FilterFields) {
          SheetData[val] = this.$store.state.formData.data[val].Value || '';
        }
      }
      SheetData = JSON.stringify(SheetData);
      // const SchemaCode = this.$store.state.formData.responseContext.SchemaCode;
      const params = {
        ActionName: 'GetAppDatas',
        DataField: this.formVal.dataField,
        ID: this.formVal.boschemacode,
        SchemaCode: this.formVal.boschemacode,
        Status: 1,
        scopeType: 3,
        searchParamsJson: {},
        SheetData,
        SheetQuery: 'SheetQuery',
      };
      if (isQrcode) {
        // 二维码
        // 此时已经登陆，分析字符串获取bizobjectid 和schemaCode
        const reg = new RegExp('(^|&)bo=([^&]*)(&|$)');
        const urlSearch = scanResult.split('?')[1];

        const r = urlSearch.match(reg);
        let bizObjectId = '';
        if (r != null) bizObjectId = r[2];
        params.searchParamsJson = JSON.stringify({ ObjectId: [bizObjectId] });
      } else {
        // 条形码 匹配ObjectID
        // 查询关联表单数据
        params.searchParamsJson = JSON.stringify({ ObjectId: [scanResult] });
      }
      this.scanParams = params;
    },
    // 获取关联数据
    LoadAssciationFilter() {
      const that = this;
      const rule = that.formVal.associationfilter
        ? JSON.parse(that.formVal.associationfilter)
        : that.formVal.associationfilter;

      if (that.formVal.associationfilter && rule.Rule) {
        this.filterRule = rule.Rule;
        let startIndex = 0;
        while (startIndex >= this.filterRule.length || startIndex < 0) {
          const index2 = this.filterRule.indexOf('{', startIndex + 1);
          const index3 = this.filterRule.indexOf('}', startIndex + 1);
          if (index3 < index2 || index2 < 0) {
            const field = this.filterRule.substring(startIndex + 1, index3);
            if (that.$store.state.formData.data[field]) {
              that.FilterFields.push(field);
            }
          }
          startIndex = this.filterRule.indexOf('{', index3);
          // 已经到结束位置或找不到 {
          if (startIndex >= this.filterRule.length || startIndex < 0) {
            break;
          }
        }
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
    async getOriginalUrlAsync(shortUrl, success, error) {
      const result = await getOriginalUrl(shortUrl);
      if (result.Successful) {
        success(result.ReturnData.OriginalUrl);
      } else {
        error();
      }
    },
  },
  watch: {
    value() {
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
    },
    '$store.state.isFormInitFinish': function d(val) {
      if (val) {
        this.InitValue(this.formVal.Value, '', '', true);
      }
    },
  },
};
</script>

<style lang="less">
@import '../../../assets/css/form-base.less';
#form-query {
  background-color: white;
  .controlLayout;
  .content {
    .icon-saoyisao {
      .px2rem(font-size, 44);
      color: #108ee9;
      .px2rem(top, 10);
    }
    .right {
      .icon {
        .px2rem(top, -12) !important;
      }
      input {
        max-width: 210px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>
