import {
  pairsForIn,
  IGuid,
  parseDom,
  dataset,
  hasClass,
  BizObjectStatus,
  getSourceControlKey,
  jsonParse,
  filterControls,
  fmtExternalDescription,
} from '.';
// import { commonProp, controlMap } from './control-map';
import { ControlType } from './constants';
import * as ControlOptionsMap from '../types/control-options-map';

function getOptions (returnOpts) {
  const excludeProp = [
    'Value',
    'Visible',
    'DisplayRule',
    'DisplayRuleFields',
    'ComputationRule',
    'ComputationRuleFields',
    'controlKey',
    'dataField',
  ];
  const options = {};
  for (const prop in returnOpts) {
    if (!excludeProp.includes(prop)) {
      options[prop] = returnOpts[prop];
    }
  }
  return options;
}

function deleteActions (context) {
  for (const action in context.Actions) {
    if (
      action === 'Close' ||
      action === 'Print' ||
      action === 'ViewQrCode' ||
      action === 'ViewInstance' ||
      (context.BizObjectStatus === BizObjectStatus.Draft && action === 'LinkToSns')
    ) {
      delete context.Actions[action];
    }
  }
}

export default {
  convertReturnData (formData, returnData) {
    pairsForIn(returnData, (dataField, returnOpts) => {
      if (returnOpts.controlKey) {
        const options = getOptions(returnOpts);
        const controlData = {
          value: [],
          valid: {},
          visible: returnOpts.Visible,
          options,
        };
        // 默认修改时间不可更改
        if (dataField === 'ModifiedTime') {
          controlData.options.Editable = false;
          controlData.options.Required = false;
        }
        formData[dataField] = controlData;
        if (returnOpts.controlKey === 'FormGridView') {
          let isRowEditable = false;
          controlData.notice = false;
          const {
            R,
            T,
          } = returnOpts.Value;
          const controls = [];
          const noticeMap = {};
          pairsForIn(T, (fullpathDataField, tmplOptions) => {
            if (tmplOptions.controlKey && tmplOptions.Visible) {
              noticeMap[fullpathDataField] = false;
              controls.push({
                dataField: fullpathDataField,
                controlKey: tmplOptions.controlKey,
              });
              if (tmplOptions.Editable) {
                isRowEditable = true;
              }
            }
          });
          controlData.noticeMap = noticeMap;
          controlData.controls = controls;
          controlData.visible = controls.length > 0; // 若整个子表的控件都不可见，则子表不可见
          // controlData.titleControl = controls.length ? controls[0].dataField : '';
          if (formData.$responseContext.IsCreateMode && R.length === 0 && returnOpts.Editable) {
            const objectId = IGuid();
            controlData.value.push(objectId);
            controlData[objectId] = {};
            pairsForIn(T, (fullpathDataField, tmplOptions) => {
              controlData[objectId][fullpathDataField] = {
                value: tmplOptions.Value,
                valid: {},
                visible: tmplOptions.Visible,
                options: getOptions(tmplOptions),
              };
            });
          } else {
            isRowEditable = false;
            for (const row of R) {
              const objectId = (row[`${dataField}.ObjectId`] || {}).Value;
              controlData.value.push(objectId);
              controlData[objectId] = {};
              for (const fullpathDataField in row) {
                if (Object.prototype.hasOwnProperty.call(row, fullpathDataField)) {
                  const controlOptions = row[fullpathDataField];
                  controlData[objectId][fullpathDataField] = {
                    value: controlOptions.Value,
                    valid: {},
                    visible: controlOptions.Visible,
                    options: getOptions(controlOptions),
                    notice: false,
                  };
                  if (
                    controlOptions.Visible &&
                    controlOptions.controlKey &&
                    controlOptions.Editable
                  ) {
                    isRowEditable = true;
                  }
                }
              }
            }
          }
          controlData.isRowEditable = isRowEditable;
          controlData.rowValidEmptyMap = {};
        } else {
          if (returnOpts.controlKey === 'FormLabel' && (returnOpts.dataField === 'ModifiedTime' || returnOpts.dataField === 'CreatedTime')) { // eslint-disable-line
            // 默认修改时间\创建时间不可更改
            controlData.options.Required = false;
            controlData.options.Editable = false;
          } else if (returnOpts.controlKey === 'FormTextBox' ||
            returnOpts.controlKey === 'FormNumber'
          ) {
            controlData.hasBindClick = false;
          }
          controlData.value = returnOpts.Value;
        }
      } else {
        const readonlyControl = {
          value: returnOpts.Value,
        };
        Object.freeze(readonlyControl);
        formData[dataField] = readonlyControl;
      }
    });
    return formData;
  },
  convertState (context, runtimeContent) {
    deleteActions(context);
    const formData = {};
    const returnData = context.ReturnData;
    const delFields = ['PrintConfig', 'QrCodeUrl', 'ReviewQrCodeUrl'];
    delFields.forEach((field) => {
      delete context[field];
    });
    Object.freeze(context);
    formData.$responseContext = context;
    let cid = 0;
    let convertedData;
    const renderControls = [];
    const parsedControlsContent = jsonParse(runtimeContent, false);
    // 如果当前字符串可被JSON解析，则作为JSON解析
    if (parsedControlsContent) {
      // 解析JSON格式的表单数据
      convertedData = this.convertRuntimeJson(filterControls(parsedControlsContent));
    } else {
      // 无法被JSON解析
      const nodes = parseDom(runtimeContent);
      convertedData = this.convertProps(nodes, false);
    }

    // todo: this.convertProps的循环放在一起处理
    for (const controlNode of convertedData) {
      // 处理FormButton和创建人
      let dataField = controlNode.dataField;
      const controlKey = controlNode.controlKey;
      const returnOpts = returnData[dataField];
      if (controlKey === 'FormButton') {
        returnData[dataField] = controlNode;
      }
      if (controlKey === 'FormLabel' && dataField === 'CreatedBy.FullName') {
        const createdByData = returnData.CreatedBy;
        if (createdByData && createdByData.DisplayName) {
          returnData[dataField].DisplayName = createdByData.DisplayName;
        } else {
          returnData[dataField].DisplayName = '创建人';
        }
      }
      if (dataField && returnOpts) {
        returnOpts.DisplayName = returnOpts.DisplayName.trim();
        Object.assign(returnOpts, controlNode);
        if (controlKey === 'FormGridView') {
          const {
            R,
            T,
          } = returnOpts.Value;
          for (const childHtmlData of returnOpts.children) {
            const childDataFiled = childHtmlData.dataField;
            const childOptions = T[childDataFiled];
            if (childOptions) {
              childOptions.DisplayName = childOptions.DisplayName.trim();
              Object.assign(childOptions, childHtmlData);
            }
            for (const row of R) {
              const childRowOptions = row[childDataFiled];
              childRowOptions.DisplayName = childRowOptions.DisplayName.trim();
              Object.assign(childRowOptions, childHtmlData);
            }
          }
          delete returnOpts.children;
        }
        renderControls.push({
          dataField,
          controlKey,
        });
      } else if (controlKey === 'FormButton') {
        controlNode.visible = true;
        formData[dataField] = controlNode;
        renderControls.push({
          dataField,
          controlKey,
        });
      } else if (controlKey === 'FormTitle') {
        // controlKey === "FormGroupTitle" 为json格式数据新controlKey命名
        dataField = `FormTitle_${cid}`;
        controlNode.visible = true;
        controlNode.expanded = true;
        formData[dataField] = controlNode;
        cid += 1;
        renderControls.push({
          controlKey: controlNode.isDescription ? 'FormDescription' : 'FormTitle',
          dataField,
        });
      }
    }
    formData.$renderControls = renderControls;
    return this.convertReturnData(formData, returnData);
  },
  parseNamespace(namespace, context, bizObjectId) {
    let paths = [];
    if (namespace.constructor === String) {
      // 兼容 bizObjectId 含有斜杆的字符串
      paths.push(bizObjectId);
      namespace = namespace.slice(bizObjectId.length + 1);
      const dataField = findObjectId(namespace, context[bizObjectId]);
      paths.push(dataField);
      namespace = namespace.slice(dataField.length + 1);
      const control = context[bizObjectId][dataField] || {};
      // 兼容 ParentObjectId 含有斜杆的情形
      if(namespace.length && control.controlKey === "FormGridView"){
        // 查询 parentObjectId,子表的 rowId
        const row = control.value.find((row)=>{
          if(namespace.indexOf(row.ObjectId) === 0){
            namespace = namespace.slice(row.ObjectId.length + 1);
            return true;
          }
        });
        paths.push(row.ObjectId, namespace);
      }
      // paths.push(...namespace.split(/\/(?!\/)/g));
    } else if (namespace instanceof Array) {
      paths = namespace.slice();
    } else {
      return {};
    }
    const top = paths.shift();
    let target = context[top];
    for (const path of paths) {
      target = target[path];
    }
    return target;
  },
  convertProps (nodes, isChildren = false) {
    const ret = [];
    for (const node of nodes) {
      const hasPageHeaderClass = hasClass(node, 'page-header');
      if (hasPageHeaderClass) {
        const align = node.style.textAlign;
        const strong = node.children[0];
        if (strong) {
          const isDescription = hasClass(node, 'page-describle');
          const pageHeader = {
            controlKey: 'FormTitle',
            displayname: isDescription ? fmtExternalDescription(strong.innerHTML) : strong.innerHTML,
            isDescription: isDescription,
            alignment: align,
          };
          ret.push(pageHeader);
        }
      } else {
        const controlDataSet = dataset(node);
        let controlKey = controlDataSet.controlkey;
        const dataField = controlDataSet.datafield;
        if (!controlKey) {
          continue;
        }
        controlKey = controlKey.replace(/Sheet/g, 'Form'); // 兼容Sheet的controlKey
        if (
          !dataField ||
          (!isChildren && dataField.includes('.') && controlKey !== 'FormLabel')
        ) {
          continue;
        }

        const ControlOptionsClass = ControlOptionsMap[`${controlKey}Options`];
        if (ControlOptionsClass) {
          const controlOptions = new ControlOptionsClass(); // 获取map映射后的对象
          if (controlOptions) {
            const controlProps = Object.keys(controlOptions); // flat并延展common数组
            const temp = {};
            // properties遍历处理
            controlProps.forEach((propKey) => {
              const htmlAttrKey = propKey.toLowerCase();
              // 处理子表的特殊情况
              const attrValue = controlDataSet[htmlAttrKey]; // 处理dataField的特殊情况（稳定处理）
              temp[propKey] = attrValue || null;
            });
            Object.assign(controlOptions, temp);
            controlOptions.merge(controlDataSet);
            if (controlKey === 'FormGridView') {
              const fgvNodes = node.getElementsByClassName('sheet-control'); // 获取所有子节点
              controlOptions.children = this.convertProps(fgvNodes, true); // 递归
            }
            ret.push(controlOptions);
          }
        } else {
          console.error(`cannot find options for controlKey:${controlKey}`); // eslint-disable-line
        }
      }
    }
    return ret;
  },
  convertRuntimeJson (jsonContent) {
    const ret = [];
    for (const control of jsonContent) {
      let controlOptions = {};
      for (const prop in control.Options) {
        const lowerPropName = prop.toLowerCase();
        controlOptions[lowerPropName] = control.Options[prop];
      }
      let controlKey = ControlType[control.Type];
      if (controlKey === 'FormModifiedTime' || controlKey === 'FormCreatedTime') {
        controlKey = controlOptions.controlkey = controlOptions.controlKey = 'FormLabel';
      } else if (controlKey === 'FormAssociateProperty') {
        // 关联属性controlkey是根据源关联来决定
        controlOptions.controlkey = controlOptions.controlKey = getSourceControlKey(controlOptions.sourcetype);
      } else {
        controlOptions.controlkey = controlOptions.controlKey = controlKey;
      }
      controlOptions.dataField = control.Options.DataField || control.Key;
      const ControlOptionsClass = ControlOptionsMap[`${controlOptions.controlkey}Options`];
      if (ControlOptionsClass) {
        // 混合默认值
        const defaultControlOptions = new ControlOptionsClass();
        controlOptions = Object.assign(defaultControlOptions, controlOptions);
        controlOptions.mergeJson(controlOptions);
        // 判断是否在关联表单条件中
      }
      controlOptions.asfilter = controlOptions.asfilter === 'true';
      if (controlOptions.controlkey === 'FormGridView') {
        const childControls = control.ChildControls;
        controlOptions.children = this.convertRuntimeJson(childControls);
      } else if (controlOptions.controlkey === 'FormGroupTitle') {
        // TODO 分组标题与旧有controlKey不一致
        controlOptions.displayname = controlOptions.title;
        controlOptions.controlkey = controlOptions.controlKey = 'FormTitle';
      } else if (controlOptions.controlkey === 'FormDescription') {
        // TODO 描述控件与分组控件太耦合了，需要改
        controlOptions.isDescription = true;
        controlOptions.displayname = fmtExternalDescription(controlOptions.content);
        controlOptions.controlkey = controlOptions.controlKey = 'FormTitle';
      }
      ret.push(controlOptions);
    }

    return ret;
  },
};

export function findObjectId (nameSpace, instance){
  while (true){
    let lastDiagonalIdx;
    if (instance[nameSpace]){
      return nameSpace;
    }
    lastDiagonalIdx = nameSpace.lastIndexOf('/')
    if (lastDiagonalIdx === -1){
      break;
    }
    nameSpace = nameSpace.slice(0, lastDiagonalIdx);
  }
  return '';
}
