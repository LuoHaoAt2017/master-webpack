import { getMultiFormUser } from '../../utils/http';
// import { Message } from '../../instance/message';

function FormMultiUser () {
}

function formUserValue (val) {
  // isInit是备用初始化标识
  if (!val || val.length === 0 || val === '' || Object.keys(val).length === 0) {
    return [];
  }
  const tempValArr = [];
  for (const obj of val) {
    if (Object.prototype.toString.call(obj).indexOf('String') > -1) {
      tempValArr.push(obj);
    } else {
      tempValArr.push(obj.UnitID || obj.ObjectId);
    }
  }
  return tempValArr;
}

function isOnlyObjectIdObj (obj) {
  // 改进 这里可以写成ObjectId in obj更简洁
  return Object.prototype.hasOwnProperty.call(obj, 'ObjectId') &&
        Object.prototype.hasOwnProperty.call(obj, 'ParentId');
}

const $addValue = function addValue (obj) {
  if (!obj || obj.length === 0) {
    obj = [];
    return obj;
  }
  // 缓存的数据
  const getExistsUnit = unitId => this.$form.$getQueryCache(unitId);
  const res = [];
  const news = [];
  // 判断对象类型
  let exist = [];
  if (Object.prototype.toString.call(obj).indexOf('Array') > -1) {
    for (let i = 0, len = obj.length; i < len; i += 1) {
      if (obj[i].constructor === Object) {
        if (isOnlyObjectIdObj(obj[i])) {
          exist = getExistsUnit(obj[i].ObjectId);
          if (exist) {
            res.push(exist);
          } else {
            news.push(obj[i].ObjectId);
          }
        } else if (obj[i].UnitID || obj[i].UnitId) {
          res.push(obj[i]);
          // 存入缓存
          this.$form.$setQueryCache(obj[i].UnitID || obj[i].UnitId, obj[i]);
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
    if (isOnlyObjectIdObj(obj)) {
      exist = getExistsUnit(obj.ObjectId);
      if (exist) {
        res.push(exist);
      } else if (obj.ObjectId) {
        news.push(obj.ObjectId);
      }
    } else if (obj.UnitID || obj.UnitId) {
      res.push(obj);
      this.$form.$setQueryCache(obj.UnitID || obj.UnitId, obj);
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
    // 如果有新增的数据先请求，后合并
    const UnitID = JSON.stringify(news);
    // const oldValue = this.value;
    return getMultiFormUser(UnitID).then((response) => {
      if (response.Successful) {
        // that.users = data
        // 直接添加到缓存和结果中
        if (response && response.ReturnData && response.ReturnData.UnitItems) {
          const data = response.ReturnData.UnitItems;
          for (let i = 0, len = data.length; i < len; i += 1) {
            res.push(data[i]);
            // 把新的数据添加到缓存中
            this.$form.$setQueryCache(data[i].UnitID, data[i]);
          }
        }

        return res;
        // let result = [];
        // 需要根据原先的值进行排序
        // if (oldValue && oldValue.length) {
        //   for (let j = 0, len = oldValue.length; j < len; j += 1) {
        //     const foundUnit = res.find(item => item.UnitID === oldValue[j].UnitId);
        //     if (foundUnit) {
        //       result.push(foundUnit);
        //     }
        //   }
        // } else {
        //   result = res;
        // }
        // return result;
      }
      return [];
    });
  }
  return res;
};

FormMultiUser.prototype.$clearValue = () => []; // 控件参与计算时，取的空值

FormMultiUser.prototype.$valueType = Array;

FormMultiUser.prototype.$setValue = function setValue (value) {
  return $addValue.call(this, value);
};

FormMultiUser.prototype.$getRuleValue = function getRuleValue (value) {
  return value instanceof Array && value.length > 0 ? value : '';
};

FormMultiUser.prototype.$getValue = function getValue (value) {
  return formUserValue(value);
};

FormMultiUser.prototype.$getText = function getText () {
  const userNames = [];
  for (const obj of this.viewData) {
    if (Object.prototype.toString.call(obj).indexOf('String') < 0) {
      userNames.push(obj.DisplayName || obj.Name);
    }
  }
  return userNames.length ? userNames.toString() : '';
};

FormMultiUser.prototype.$initValue = function initValue (value) {
  return $addValue.call(this, value);
};

export default FormMultiUser;
