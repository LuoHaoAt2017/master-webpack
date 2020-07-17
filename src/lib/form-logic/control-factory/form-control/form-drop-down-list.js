import { isFalsy, isNumeric } from '../../utils';
// import { ContainSchemaPropertyValues } from '../../http';
// 获取关联数据
function LoadAssciationFilter () {

  const filter = this.options.associationfilter;

  if (filter.Rule) {
    this.options.filterRule = filter.Rule;
    let startIndex = 0;
    const formData = this.$form;
    while (true) {
      const index2 = this.options.filterRule.indexOf('{', startIndex + 1);
      const index3 = this.options.filterRule.indexOf('}', startIndex + 1);
      if (index3 < index2 || index2 < 0) {
        const field = this.options.filterRule.substring(startIndex + 1, index3);
        if (field.indexOf('.') < 0) {
          if (formData[field]) {
            this.options.filterFields.push(field);
          }
        } else {
          const childField = field.split('.')[0];
          if (formData[childField]) {
            this.options.filterFields.push(field);
          }
        }
      }
      startIndex = this.options.filterRule.indexOf('{', index3);
      // 已经到结束位置或找不到 {
      if (startIndex >= this.options.filterRule.length || startIndex < 0) {
        break;
      }
    }
  }
}

function getDefaultItems () {
  if (
    this.options.datadictitemname != null &&
    this.options.DataDictItemValue != null &&
    this.options.DataDictItemValue
  ) {
    this.options.defaultItems = this.options.DataDictItemValue;
  } else if (this.options.boschemacode && this.options.mappingfield) {
    LoadAssciationFilter.call(this);
  } else {
    this.options.defaultItems = this.options.defaultitems;
    if (this.options.defaultItems !== '' && this.options.defaultItems) {
      this.options.defaultItems = eval(this.options.defaultItems);
    }
  }
  const tmp = [];
  this.options.defaultItems = this.options.defaultItems ? this.options.defaultItems : [];
  for (let i = 0; i < this.options.defaultItems.length; i += 1) {
    if (!this.options.defaultItems[i].Value) {
      const val = this.options.defaultItems[i];
      tmp.push({
        Value: val,
        Text: val,
      });
    } else {
      tmp.push(this.options.defaultItems[i]);
    }
  }
  this.options.defaultItems = tmp;
}

function FormDropDownList () {
  this.scopeType = 4;
}

FormDropDownList.prototype.$getSheetData = function getSheetData () {
  getDefaultItems.call(this);
  let sheetData = {};
  const formData = this.$form;
  if (this.options.filterFields.length > 0) {
    for (const val of this.options.filterFields) {
      if (val.indexOf('.') < 0) {
        if (typeof this.sheetData === 'string') {
          sheetData = JSON.parse(sheetData);
        }
        const data = formData[val];
        if (data && (data.controlkey === 'FormUser' || data.controlkey === 'FormMultiUser' ||
        val === 'CreatedBy' || val === 'OwnerDeptId' || val === 'OwnerId')) {
          if (data.value) {
            if (data.value.constructor === Array) {
              const tmp = [];
              for (const value of data.value) {
                if (typeof value === 'string') {
                  tmp.push(value);
                } else {
                  tmp.push(value.UnitId || value.UnitID);
                }
              }
              sheetData[val] = tmp;
            } else {
              sheetData[val] = data.value;
            }
          } else {
            sheetData[val] = '';
          }
        } else {
          sheetData[val] = formData[val].value || '';
        }
      } else {
        const [childField, gridField] = val.split('.');
        const gridVal = formData[childField].value;
        for (const obj of gridVal) {
          if (obj.ObjectId === this.rowId) {
            if (typeof sheetData === 'string') {
              sheetData = JSON.parse(sheetData);
            }
            sheetData[val] = obj[gridField] || '';
          }
        }
      }
    }
  }
  return sheetData;
};

FormDropDownList.prototype.$initValue = function getValue (value) {
  this.options.filterFields = [];
  getDefaultItems.call(this);
  return this.$setValue(value);
};

FormDropDownList.prototype.$getValue = function getValue (value) {
  return value.Value || '';
};

FormDropDownList.prototype.$valueType = String;

FormDropDownList.prototype.$clearValue = () => ({});

FormDropDownList.prototype.$setValue = function setValue (val) {
  let result = {};
  // const defaultItems = this.options.defaultItems;
  if (isFalsy(val) || val.constructor === Array) return result;
  if (val.constructor === Object) {
    val = val.Value ? val.Value : '';
  }
  // if (this.options.datasource !== 'Association') {
  //   for (const item of defaultItems) {
  //     if (item.Value === val) {
  //       result = item;
  //       break;
  //     }
  //   }
  // } else {
    result = { Value: val, Text: val };
  // }
  return result;
};
FormDropDownList.prototype.$addItem = function addItem(value, text) {
  if ((text || value) && this.options.Editable) {
    const txt = text || value;
    this.options.defaultItems.push({ Value: value, Text: txt });
  }
};
FormDropDownList.prototype.$clearItems = function clearItems() {
  this.options.defaultItems = []; // 清空
};

FormDropDownList.prototype.$getRuleValue = function getRuleValue(value) {
  // 参与计算时，如果为数字格式 需要按数字计算
  return isNumeric(value) ? Number(value) : value;
};

export default FormDropDownList;
