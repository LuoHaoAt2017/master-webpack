import { Mutation } from '../../modal/types';

function BaseControlApi (control) {
  this.DataField = control.dataField;
  if (control.isIngrid) {
    this.ObjectId = control.rowId;
  }
  Object.defineProperties(this, {
    Value: {
      get: () => control.value,
    },
    Visible: {
      get: () => control.visible,
    },
    Editable: {
      get: () => control.options.Editable,
    },
    Required: {
      get: () => control.options.Required,
    },
  });
  this.GetValue = function GetValue () {
    return control.value;
  };

  this.SetValue = function SetValue (value) {
    control.value = value;
  };

  this.SetVisible = function SetVisible (visible) {
    control.visible = visible;
  };

  this.SetReadonly = function SetReadonly (bol) {
    control.options.Editable = !bol;
  };

  this.SetEditable = function SetEditable (bol) {
    control.options.Editable = bol;
  };

  this.SetRequired = function SetRequired (bol) {
    control.options.Required = bol;
  };

  this.ClearValue = function ClearValue () {
    control.value = control.$clearValue(this.Value);
  };

  this.BindChange = function BindChange (eventName, callback) {
    callback = callback || (() => {});
    if (control.$$customEvts) {
      control.$$customEvts[eventName] = callback.bind(this);
    } else {
      control.$$customEvts = {
        [eventName]: callback.bind(this),
      };
    }
    control.$$hasBinding = true;
    if (control.controlKey === 'FormGridView') {
      control.controlFields.forEach((field) => {
        control.$form[field].$$hasBinding = true;
      });
    }
  };

  this.UnbindChange = function UnbindChange (eventName) {
    delete control.$customEvts[eventName];
  };
}

function ControlApiProxy (control) {
  BaseControlApi.call(this, control);
  switch (control.options.controlkey) {
    case 'FormTextBox':
    case 'FormNumber':
      this.BindClickEvent = function BindClickEvent (callback) {
        control.$customClickEvt = callback.bind(this);
        control.$updateView(Mutation.BINDCLICKEVT, {
          dataField: control.dataField, rowId: control.rowId,
        });
      };
      break;
    case 'FormRadioButtonList':
    case 'FormDropDownList':
    case 'FormCheckboxList':
      this.AddItem = function AddItem (...arg) {
        return control.$addItem(...arg);
      };
      this.ClearItems = function ClearItems (...arg) {
        return control.$clearItems(...arg);
      };
      break;
    case 'FormUser':
    case 'FormMultiUser':
      this.GetUnitIDs = function GetUnitIDs () {
        return control.value;
      };
      this.GetUnitIds = function GetUnitIds () {
        return control.value;
      };
      this.GetText = function GetText (...arg) {
        return control.$getText(...arg);
      };
      break;
    case 'FormQuery':
      this.GetText = function GetText (...arg) {
        return control.$getText(...arg);
      };
      break;
    case 'FormGridView': {
      const controlCache = {};
      this.AddRow = function AddRow (...arg) {
        return control.$addRow(...arg);
      };
      this.ClearRows = function ClearRows () {
        return control.$clearRows();
      };
      this.UpdateRow = function UpdateRow (...arg) {
        return control.$updateRow(...arg);
      };
      this.GetCellManager = function GetCellManager (rowId, dataField) {
        if (controlCache[rowId] && controlCache[rowId][dataField]) {
          return controlCache[rowId][dataField];
        }
        const childControl = control.$getCellManager(rowId, dataField);
        if (childControl) {
          const childApiControl = new ControlApiProxy(childControl);
          controlCache[rowId] = controlCache[rowId] || {};
          controlCache[rowId][dataField] = childApiControl;
          return childApiControl;
        }
        return null;
      };
      this.BindClickEvent = function BindClickEvent (callback) {
        // 这里是临时解决方案，遍历子表所有tmpl控件，绑定事件
        // callback立刻执行
        // 这里太他妈恶心了 希望以后改版
        const controlApiContext = this;
        control.$customClickEvt = (gridControl, rowId) => {
          const rowData = gridControl[rowId];
          if (rowData) {
            gridControl.controlFields.forEach((gridDatafield) => {
              const childControl = rowData[gridDatafield];
              if (childControl.controlKey === 'FormTextBox' || childControl.controlKey === 'FormNumber') {
                callback.call(controlApiContext, new ControlApiProxy(childControl));
              }
            });
          }
        };
        control.rows.forEach((rowId) => {
          control.$customClickEvt(control, rowId);
        });
      };
      break;
    }
    default:
      break;
  }
}

export default ControlApiProxy;
