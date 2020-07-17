import { getFormatBizObject } from '../../utils/http';
import { jsonParse } from '../../utils';

function FormMultiQuery() {
}

const $setCheckedRows = function setCheckedRows(checkedRows) {
  // 控件在主表中
  let associateChildSchema = false;
  for (const key in checkedRows[0]) {
    if (key.toLowerCase().indexOf('.objectid') > -1) {
      associateChildSchema = true;
      break;
    }
  }
  let objectIdStr = 'ObjectId';
  let nameStr = 'Name';
  if (associateChildSchema) {
    objectIdStr = `${this.options.boschemacode}.ObjectId`;
    nameStr = `${this.options.boschemacode}.Name`;
  }
  const tempVal = [];
  checkedRows.forEach((item) => {
    const tempObj = {};
    tempObj.objectId = item[objectIdStr];
    tempObj.name = item[nameStr] ? (item[nameStr].trim() ? item[nameStr].trim() : '--') : '--';
    tempVal.push(tempObj);
  });
  return tempVal;
};

function handleQueryResult(that, retData) {
  // 判断关联的是子表还是主表
  let isAssociateChildSec = false;
  for (const key in retData[0]) {
    if (key.toLowerCase().indexOf('.objectid') > -1) {
      isAssociateChildSec = true;
      break;
    }
  }
  const tempVal = [];
  for (let i = 0; i < retData.length; i += 1) {
    const tempObj = {};
    if (isAssociateChildSec) {
      tempObj.objectId = retData[i][`${that.options.boschemacode}.ObjectId`];
      tempObj.name = retData[i][`${that.options.boschemacode}.Name`];
    } else {
      tempObj.objectId = retData[i].ObjectId;
      tempObj.name = retData[i].Name;
    }
    tempObj.name = tempObj.name ? tempObj.name.trim() : '--';
    if (tempObj.objectId) {
      tempVal.push(tempObj);
      that.$form.$setQueryCache(tempObj.objectId, retData[i]);
    }
  }
  return tempVal;
}

const $comSetValue = function comSetValue(item) {
  const context = this.$form.$responseContext;
  if (!item || item.length === 0) {
    return [];
  }
  // 手动选择关联表单赋值
  if (Object.prototype.toString.call(item).indexOf('Array') > -1 &&
      Object.prototype.toString.call(item[0]).indexOf('Object') > -1) {
    return $setCheckedRows.call(this, item);
  }
  // 把item转成数组
  if (item.constructor === String) {
    item = item.replace(/,/g, ';').split(';');
  }
  if (item.constructor === Object && item.ObjectId !== undefined) {
    item = [item];
  }
  // 缓存的数据
  const getExistsQuery = objectId => this.$form.$getQueryCache(objectId);
  const that = this;
  const res = [];
  if (Object.prototype.toString.call(item).indexOf('String') > -1) {
    // #Error:如果不是从后台加载的，需要支持开发者SetValue(ObjectId)
    let name = '';
    if (context && context.AssociatedBoNames &&
      context.AssociatedBoNames[item]) {
      name = context.AssociatedBoNames[item].replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    // ERROR这里有可能是空值
    const result = getExistsQuery(item);
    if (name.trim() === '' && !result) {
      return getFormatBizObject(this.options.boschemacode, item).then((response) => {
        if (response.Successful) {
          const data = response.ReturnData;
          if (data && data.ListViewData && data.ListViewData.length > 0) {
            name = data.ListViewData[0].Name.trim();
            that.$form.$setQueryCache(item, data.ListViewData[0]);
          }
          const tempVal = [];
          tempVal.push({
            objectId: item,
            name: name.trim() || '--',
          });
          return tempVal;
        }
        return [];
      });
    }
    name = result ? result.Name.trim() : name;
    item.push({
      objectId: item,
      name: name || '--',
    });
    return item;
  } else if (Object.prototype.toString.call(item).indexOf('Array') > -1) {
    // 传入多个值
    // [item,item,item]
    let objectIds = '';
    const that = this;
    item.forEach((i) => {
      // const result = getExistsQuery(i);
      // if (result) {
      //   res.push(result);
      // } else {
      objectIds += `${i};`;
      // }
    });
    if (objectIds) {
      return getFormatBizObject(this.options.boschemacode, objectIds).then((response) => {
        if (response.Successful) {
          let retData = response.ReturnData.ListViewData;
          retData = retData.concat(res);
          console.log(that.options.DisplayName);
          return handleQueryResult(that, retData);
        }
        return [];
      });
    }
    return handleQueryResult(that, res);
  }
  return [];
};

FormMultiQuery.prototype.$valueType = Array;

FormMultiQuery.prototype.$clearValue = () => [];

FormMultiQuery.prototype.$setValue = function setValue(value) {
  return $comSetValue.call(this, value);
};

FormMultiQuery.prototype.$initValue = function initValue(value) {
  return $comSetValue.call(this, value, false);
};

FormMultiQuery.prototype.$getRuleValue = function getRuleValue(value) {
  // const val = value.map(item => item.objectId);
  // return val.length ? val : '';
  return value instanceof Array && value.length > 0 ? value : '';
};

FormMultiQuery.prototype.$getValue = function getValue(value) {
  const arr = [];
  value.forEach((item) => {
    arr.push(item.objectId);
  });
  return arr;
};

FormMultiQuery.prototype.$queryAssign = function queryAssign(value, { queryResult, sourceField }) {
  if (this.options.sourcetype) {
    this.options.boschemacode = queryResult[`${sourceField}_SchemaCode`];
  }
  return value || [];
};

FormMultiQuery.prototype.$queryFilterData = function queryFilterData(rowId) {
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

export default FormMultiQuery;
