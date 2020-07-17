import { getFormatBizObject } from '../../utils/http';
import { isString, isObject, isEmptyObject, jsonParse } from '../../utils';
import { initMappingRule } from '../base-control/rule';

function FormQuery(options) {
  const mappingcontrols = jsonParse(options.mappingcontrols);
  const mappingproperties = jsonParse(options.mappingproperties);
  this.$$hasMapping = !options.sourcetype
    && !!(!isEmptyObject(mappingcontrols) || !isEmptyObject(mappingproperties));
  if (this.$$hasMapping) {
    const mapping = {};
    mapping.mappingcontrols = mappingcontrols;
    mapping.mappingproperties = mappingproperties;
    // const mapping = Object.assign({}, mappingcontrols, mappingproperties);
    initMappingRule(this, mapping);
  }
}
// 等后端确认列表的数据值问题再确认如何缓存
// function isOnlyObjectIdAndName(item) {
//   return 'Name' in item && 'ObjectId' in item && Object.keys(item).length === 2;
// }
function getAssociateType(obj) {
  const boschemainfo = this.options.boschemainfo ? JSON.parse(this.options.boschemainfo) : {}
  let isAssociateChild = !!boschemainfo.IsChildSchema
  let gridDataField = '';
  if (obj) {
    for (const key of Object.keys(obj)) {
      if (key.indexOf('.') > -1) {
        isAssociateChild = true;
        gridDataField = key.split('.')[0];
        break;
      }
    }
  }
  return { isAssociateChild, gridDataField };
}

function getChildInfo (obj) {
  let isChildSchema = false;
  let gridField = '';
  const { isAssociateChild, gridDataField } = getAssociateType.call(this, obj);
  isChildSchema = isAssociateChild;
  gridField = gridDataField;
  if (Object.prototype.hasOwnProperty.call(obj, 'IsChildSchema')) {
    isChildSchema = obj.IsChildSchema;
  }
  return {
    isChildSchema,
    gridField,
  };
}

function handleQueryResult (result) {
  let name = '';
  let objectId = '';
  // const { isAssociateChild, gridDataField } = getAssociateType.call(this, result);
  const { isChildSchema, gridField } = getChildInfo.call(this, result);
  if (isChildSchema && gridField) {
    name = result[`${gridField}.Name`] || result.name;
    objectId = result[`${gridField}.ObjectId`];
  } else {
    name = result.Name || result.name;
    objectId = result.ObjectId || result.objectId;
  }
  if (Array.isArray(name)) {
    name = name[0].trim() ? name[0].trim() : '--';
  } else {
    name = name && name.trim() ? name.trim() : '--';
  }
  if (objectId && name) {
    return { ObjectId: objectId, Name: name };
  }
  return {};
}

function handleValue (value) {
  const $form = this.$form;
  let result = {};
  if (!value || isEmptyObject(value)) {
    return result;
  }
  let objectId = '';
  let name = '';
  if (isString(value)) { // 处理被赋值字符串的情况（自定义代码）
    objectId = value;
  } else if (isObject(value)) { // 处理被赋值对象的情况（用户操作）
    if (value.ObjectId && value.Name) {
      // if (!isOnlyObjectIdAndName(value)) {
      //   this.$form.$setQueryCache(value.ObjectId, value);
      // }
      return handleQueryResult.call(this, value);
    } else if (value.ObjectId) {
      if (value.isChild) {
        objectId = value[`${this.options.boschemacode}.ObjectId`];
      }else{
        objectId = value.ObjectId;
      }
    } else {
      return this.$clearValue();
    }
  }
  const context = $form.$responseContext;
  const associatedBoNames = context.AssociatedBoNames;
  // todo:判断子表
  if (associatedBoNames[objectId]) {
    name = associatedBoNames[objectId]/* .replace(/</g, '&lt;').replace(/>/g, '&gt;') */;
    name = name.trim() ? name.trim() : '--';
    result = {
      ObjectId: objectId,
      Name: name,
    };
  } else {
    const queryCache = this.$form.$getQueryCache(objectId);
    if (queryCache) {
      result = handleQueryResult.call(this, queryCache);
    } else {
      result = getFormatBizObject(this.options.boschemacode, objectId)
        .then((response) => {
          if (response && response.ReturnData.ListViewData &&
            response.ReturnData.ListViewData.length > 0) {
            // todo:判断子表
            const queryResult = response.ReturnData.ListViewData[0];
            this.$form.$setQueryCache(queryResult.ObjectId, queryResult);
            return handleQueryResult.call(this, queryResult);
          }
          return {};
        });
    }
  }
  return result;
}

FormQuery.prototype.$clearValue = () => ({});

FormQuery.prototype.$valueType = Object;

FormQuery.prototype.$getValue = function getValue(value) {
  return value.ObjectId || '';
};

FormQuery.prototype.$setValue = function setValue(value) {
  if (value instanceof Array && this.isIngrid) {
    // 在子表中，关联表单选择多个，需要填充多行
    const { isChildSchema, gridField } = getChildInfo.call(this, value[0]);
    const queryResults = value.map((item) => {
      const valObj = {};
      if (isChildSchema) {
        const tempName = item[`${gridField}.Name`];
        valObj.Name = tempName ? tempName.trim() : '--';
        valObj.ObjectId = item[`${gridField}.ObjectId`] || item[0][`${gridField}.ObjectId`];
      } else {
        const name = item.Name ? item.Name : '';
        valObj.Name = name.trim() ? name.trim() : '--';
        valObj.ObjectId = item.ObjectId || item[0].ObjectId;
      }
      // if (!isOnlyObjectIdAndName(item)) {
      //   this.$form.$setQueryCache(valObj.ObjectId, item);
      // }
      return valObj;
    });
    const topResult = queryResults.shift();
    const gridControl = this.$form[this.parentDataField];
    for (const queryRes of queryResults) {
      const rowData = {};
      rowData[this.dataField] = queryRes;
      gridControl.$addRow(null, rowData);
    }
    // formatValueArr长度大于1的时候需要addrow todo
    return topResult;
  }
  return handleValue.call(this, value);
};

FormQuery.prototype.$initValue = function initValue(value) {
  // 初始化时 关联表单从请求中获得的值是字符串（表单Id）
  // 如果在子表中，关联表单选择多个，会触发初始化生成多行这时获得的值是对象
  // ============
  const carryoverMapping = this.$form.$carryOverMapping;
  // 无关联列表携带的值，且控件有初始值
  // 则把当前初始值保存起来
  if (isString(value) && value) {
    this.originalValue = value;
  } else if (isObject(value) && value.ObjectId){
    this.originalValue = value.ObjectId;
  }
  // 初始化时，carryOverMapping表示从关联列表携带过来的值
  // 如果携带了当前的关联表单的这个值，初始值赋为这个值
  else if (carryoverMapping && carryoverMapping[this.dataField]) {
      value = carryoverMapping[this.dataField];
  }
  // 初始化时，ObjectId保存起来作为初始值
  return handleValue.call(this, value);
};

FormQuery.prototype.$saveDataField = function saveDataField(value) {
  // 如果在表单提交时，（排除从关联列表携带过来的值）关联表单的值没有修改，则不重新执行保存
  const isCreateMode = this.$form.$responseContext.IsCreateMode;
  if (isCreateMode || value !== this.originalValue) {
    return { [this.dataField]: value };
  }
  return {};
};


FormQuery.prototype.$getText = function getText() {
  return this.viewData & (this.viewData.Name || this.viewData.name);
};

FormQuery.prototype.$getText = function getText() {
  return this.viewData & (this.viewData.Name || this.viewData.name);
};

FormQuery.prototype.$queryAssign = function queryAssign(value, {
  queryResult, sourceField,
}) {
  const targetSchemaCode = queryResult[`${sourceField}_SchemaCode`];
  if (this.options.sourcetype) {
    this.options.boschemacode = targetSchemaCode;
  }
  if (targetSchemaCode && targetSchemaCode !== this.options.boschemacode) {
    // 关联配置与返回的数据不一致，清空数据
    return this.$clearValue();
  }
  if (!this.$$hasMapping) {
    // 无关联配置
    const objectId = queryResult[sourceField];
    let name = queryResult[`${sourceField}_Name`];
    if (sourceField.indexOf('.') > -1) {
      if (sourceField.toLowerCase().indexOf('.objectid') > -1) {
        // 将ObjectId携带到关联表单
        name = queryResult[`${sourceField.split('.')[0]}.Name`];
      }
    }
    if (objectId !== undefined && name) {
      return {
        ObjectId: objectId,
        Name: name,
      };
    } else if (objectId && !name) {
      return objectId;
    }
    return this.$clearValue();
  }
  return value || {};
};

FormQuery.prototype.$queryFilterData = function queryFilterData(rowId) {
  const filter = this.options.associationfilter.Rule ? this.options.associationfilter : this.options.bofilter;
  const self = this
  const rule = filter.Rule;
  if (rule && rule.length > 0) {
    const sheetData = {};
    this.$form.$batchAllField((controlDataField, control) => {
      let controlValue = null;
      const ctrlFieldIndex = rule.lastIndexOf(`${controlDataField}}`);
      if (ctrlFieldIndex < 0 || controlDataField === self.dataField || controlDataField === 'Comments') return;
      const prefix = rule.slice(ctrlFieldIndex - 1, ctrlFieldIndex);
      if (prefix !== '{' && prefix !== '.') {
        return;
      }
      if (control.isIngrid) {
        const gridControl = control.$form[control.parentDataField];
        if (self.isIngrid && rowId && self.parentDataField === control.parentDataField) {
          // 当前关联表单和规则中的控件在同一个子表中，取同一行内的数据
          controlValue = gridControl[rowId][controlDataField].value;
        } else {
          // 不在同一个子表中
          controlValue = [];
          gridControl.rows.forEach((targetRowId) => {
            controlValue.push(gridControl[targetRowId][controlDataField].value);
          });
        }
      } else {
        controlValue = control.value;
      }
      sheetData[controlDataField] = controlValue;
    });
    const CreatedBy = this.$form.CreatedBy;
    const OwnerId = this.$form.OwnerId;
    const OwnerDeptId = this.$form.OwnerDeptId;

    //CreatedBy
    if(CreatedBy){
      if(CreatedBy.viewData && CreatedBy.viewData.length > 0){
        sheetData.CreatedBy = CreatedBy.viewData[0].UnitId || CreatedBy.viewData[0].UnitID
      }else if(CreatedBy.value && CreatedBy.value.length > 0){
        sheetData.CreatedBy = CreatedBy.value[0].UnitId || CreatedBy.value[0].UnitID;
      }
    }else{
      sheetData.CreatedBy = null
    }
    //OwnerId
    if(OwnerId){
      if(OwnerId.viewData && OwnerId.viewData.length){
        sheetData.OwnerId = OwnerId.viewData[0].UnitId || OwnerId.viewData[0].UnitID
      }else if(OwnerId.value && OwnerId.value.length > 0){
        sheetData.OwnerId = OwnerId.value[0].UnitId || OwnerId.value[0].UnitID
      }else if(OwnerId.originalValue){
        //当前表单填充、更改值为空时回填原值
        sheetData.OwnerId = OwnerId.originalValue[0].UnitId || OwnerId.originalValue[0].UnitID
      }
    }else{
      sheetData.OwnerId = null
    }

    //OwnerDeptId
    if(OwnerDeptId){
      if(OwnerDeptId.viewData && OwnerDeptId.viewData.length > 0){
        sheetData.OwnerDeptId = OwnerDeptId.viewData[0].UnitId || OwnerDeptId.viewData[0].UnitID
      }else if(OwnerDeptId.value && OwnerDeptId.value.length > 0) {
        sheetData.OwnerDeptId = OwnerDeptId.value[0].UnitId || OwnerDeptId.value[0].UnitID;
      }else if(OwnerDeptId.originalValue){
        //当前表单填充、更改值为空时回填原值
        sheetData.OwnerDeptId = OwnerDeptId.originalValue[0].UnitId || OwnerDeptId.originalValue[0].UnitID
      }
    }else{
      sheetData.OwnerDeptId = null;
    }

    sheetData.CreatedTime = this.$form.CreatedTime.value;
    return sheetData;
  }
  return false;
};

export default FormQuery;
