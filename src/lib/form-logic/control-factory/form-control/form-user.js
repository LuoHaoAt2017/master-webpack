import { getMultiFormUser } from '../../utils/http';
import { jsonParse } from '../../utils';
import { initMappingRule } from '../base-control/rule';

function FormUser (options) {
  this.$$hasMapping = !options.sourcetype && !!options.mappingcontrols;
  if (this.$$hasMapping) {
    const mappingcontrols = jsonParse(options.mappingcontrols);
    const reversedMapping = {};
    for (const key in mappingcontrols) {
      if (Object.prototype.hasOwnProperty.call(mappingcontrols, key)) {
        reversedMapping[mappingcontrols[key]] = key;
      }
    }
    initMappingRule(this, { mappingcontrols: reversedMapping });
  }
}

function formUserValue (val) {
  if (!val || val.length === 0 || val === '' || Object.keys(val).length === 0) {
    return [];
  }
  let tempArr = [];
  if (val.constructor === Array) {
    const id = val[0].UnitID || val[0].UnitId;
    tempArr.push(id);
  } else if (val.constructor === Object) {
    const id = val.UnitID || val.UnitId;
    tempArr.push(id);
  } else if (val.constructor === String) {
    tempArr = tempArr.push(val);
  }
  return tempArr;
}

function notOnlyObjectIdObj (obj) {
  return (Object.prototype.hasOwnProperty.call(obj, 'ObjectId') ||
    Object.prototype.hasOwnProperty.call(obj, 'UnitID')) &&
    (Object.prototype.hasOwnProperty.call(obj, 'ParentId') ||
      Object.prototype.hasOwnProperty.call(obj, 'CompanyId')) &&
    (Object.prototype.hasOwnProperty.call(obj, 'UnitType') ||
      Object.prototype.hasOwnProperty.call(obj, 'Type'));
}

const $addValue = function AddValue (obj) {
  if (!obj || obj.length === 0 || obj === '') {
    return [];
  }
  // 检测关联填充部分
  // 获取已经存在的用户，不用重新去服务端请求
  // 先获取当前缓存，如果缓存中没有则设置后存入缓存中
  // const cacheData = this.$form.getQueryCache();
  // const getExistsUnit = unitId => this.$form.$getQueryCache(unitId);
  // 缓存的数据 暂时不做，会印象人员填充
  const getExistsUnit = function getExistsUnit () {
    return false;
  };

  const res = [];
  const news = [];
  let exist = null;
  // 判断对象类型
  if (obj.constructor === Array) {
    for (let i = 0, len = obj.length; i < len; i += 1) {
      if (obj[i].constructor === Object) {
        if (!notOnlyObjectIdObj(obj[i])) {
          const id = obj[i].ObjectId || obj[i].UnitID;
          exist = getExistsUnit(obj[i].ObjectId);
          if (exist) {
            res.push(exist);
          } else {
            news.push(id);
          }
        } else {
          res.push(obj[i]);
          // 存入缓存
          // this.$form.$setQueryCache(obj[i].UnitID, obj[i]);
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
    if (!notOnlyObjectIdObj(obj)) {
      const id = obj.ObjectId || obj.UnitID;
      if (exist) {
        res.push(exist);
      } else {
        news.push(id);
      }
    } else {
      res.push(obj);
      // 存入缓存
      // this.$form.$setQueryCache(obj.UnitID, obj);
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
    const UnitID = [...news];
    return getMultiFormUser(UnitID).then((response) => {
      // response.ReturnData.UnitItems 如果传入的是objectidid，后端居然是success，但是返回的又是null，导致前端报错
      if (response && response.ReturnData && response.ReturnData.UnitItems) {
        const data = response.ReturnData.UnitItems;
        for (let i = 0, len = data.length; i < len; i += 1) {
          res.push(data[i]);
          // this.$form.$setQueryCache(data[i].UnitID, data[i]);
        }
        return res;
      }
      // 直接添加到缓存和结果中
    });
  }
  return res;
  // 关联携带填充
};

FormUser.prototype.$clearValue = () => []; // 控件参与计算时，取的空值

FormUser.prototype.$valueType = Array;

FormUser.prototype.$setValue = function setValue (value) {
  return $addValue.call(this, value);
};

FormUser.prototype.$getRuleValue = function getRuleValue (value) {
  return value instanceof Array && value.length > 0 ? value : '';
};

FormUser.prototype.$getValue = function getValue (value) {
  if (this.dataField === 'OwnerId' && !value) {
    value = this.originalValue;
  }
  return formUserValue(value);
};

FormUser.prototype.$getText = function getText () {
  const userNames = [];
  for (const obj of this.viewData) {
    if (Object.prototype.toString.call(obj).indexOf('String') < 0) {
      userNames.push(obj.DisplayName || obj.Name);
    }
  }
  return userNames.length ? userNames.toString() : '';
};

FormUser.prototype.$getUnitIDs = function getUnitIDs () {
  return this.$getUnitIds();
};

FormUser.prototype.$getUnitIds = function getUnitIds () {
  return this.$getValue();
};

// 初始化value，为控件的value字段定义存取器。一般的控件不需要重载
// 如果控件的逻辑十分复杂可以重新定义这个方法
FormUser.prototype.$initValue = function initValue (value) {
  if (Array.isArray(value) && value.length > 0) {
    this.originalValue = value;
  }
  // 迭代25新增功能 人员单选默认值 先注释等新版表单上线
  let realValue = value;
  const isCreateMode = this.$form.$responseContext.IsCreateMode;
  if (this.options.showcuruser && !this.options.orgunitvisible && value.length < 1 && isCreateMode) {
    const returnData = this.$form.$responseContext.ReturnData;
    // 取拥有者值
    if (returnData && returnData.OwnerId && returnData.OwnerId.Value && returnData.OwnerId.Value.length > 0) {
      realValue = returnData.OwnerId.Value[0].ObjectId;
    }
  }
  return $addValue.call(this, realValue, false);
};

export default FormUser;
