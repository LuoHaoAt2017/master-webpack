import formLogicService from '../instance/service';

const noop = () => {};

// const isDebugMode = formLogicService.getConfig('debugMode');
const isDebugMode = process.env.NODE_ENV !== 'production';

export const watching = {
  state: false,
  msg: false,
  action: false,
  mutation: false,
};

const debugWhen = (execFunc) => {
  if (isDebugMode) {
    return function debugFunc(...arg) {
      execFunc(...arg);
    };
  }
  return noop;
};

export const debugState = debugWhen((state) => {
  if (watching.state) {
    console.log( // eslint-disable-line
      `%c State Transition:%c ${state}`,
      'background: #d83a62;color:#fff;padding: 3px 6px;border-radius: 3px',
      'color: #d83a62',
    );
  }
});

export const debugMsg = debugWhen((messageQueue) => {
  if (watching.msg && !messageQueue.isEmptyQueue) {
    console.log(messageQueue.queue.slice()); // eslint-disable-line
  }
});

export const debugAction = debugWhen((action) => {
  if (watching.action && action.type.startsWith('Form/ViewModel/')) {
    console.log(action); // eslint-disable-line
  }
});

export const debugMutation = debugWhen((mutation) => {
  if (watching.mutation && mutation.type.startsWith('Form/ViewModel/')) {
    console.log(mutation); // eslint-disable-line
  }
});

function getForm() {
  return formLogicService.getCurrentForm();
}
function searchControl(word) {
  const form = getForm();
  const result = [];
  form.$batchAllField((dataField, control) => {
    if (dataField.includes(word) || control.options.DisplayName.includes(word)) {
      if (control.isIngrid) {
        const gridControl = form[control.parentDataField];
        for (const rowId of gridControl.rows) {
          const childControl = gridControl[rowId][dataField];
          if (childControl) {
            result.push(childControl);
          }
        }
      } else {
        result.push(control);
      }
    }
  });
  return result;
}

function watchTarget(name) {
  return function watch(toggle) {
    watching[name] = !!toggle;
    return toggle ? `开启${name}追踪` : `关闭${name}追踪`;
  };
}

let isRuleLogging = false;

let isRuleLogingAll = false;

let ruleCondition = [];

const formDebugger = isDebugMode ? {
  getForm,
  searchControl,
  watchState: watchTarget('state'),
  watchMsg: watchTarget('msg'),
  watchAction: watchTarget('action'),
  watchMutation: watchTarget('mutation'),
  logRule: (toggle, where) => {
    isRuleLogging = !!toggle;
    if (toggle) {
      if (typeof where === 'function') {
        ruleCondition.push(where);
      }
    } else {
      this.clearCondition();
    }
    console.clear(); //eslint-disable-line
    return isRuleLogging ? '开启规则日志' : '关闭规则日志';
  },
  logRuleAll: (toggle, where) => {
    isRuleLogging = !!toggle;
    isRuleLogingAll = !!toggle;
    if (toggle) {
      if (typeof where === 'function') {
        ruleCondition.push(where);
      }
    } else {
      this.clearCondition();
    }
    console.clear(); //eslint-disable-line
    return isRuleLogingAll ? '开启详细规则日志' : '关闭规则日志关闭';
  },
  clearCondition() {
    ruleCondition = [];
  },
} : null;

if (isDebugMode) {
  window.$formDebugger = formDebugger;
}

const ruleLog = (control, typeColor, type, text, ...arg) => {
  if (ruleCondition.every(where => where(control, type))) {
    console.log( // eslint-disable-line
      `%c${type}%c${control.options.DisplayName || ''}%c${control.dataField}%c ${text}`,
      `background:${typeColor};color:#fff;padding: 0 5px;border-radius:5px;line-height: 20px;margin-right: 5px;`,
      'background:#37abfd;color:#fff;border-radius:5px 0 0 5px;padding:0 5px;line-height:20px;',
      'background:#37abfd;color:#eee;border-radius:0 5px 5px 0;padding:0 5px;line-height:20px;',
      '',
      ...arg,
    );
  }
};

export const debugComputationRule = debugWhen((control, rule, result) => {
  if (isRuleLogging) {
    const ruleText = isRuleLogingAll ? `%c ${rule} %c结果: %c ${result}` : '';
    const ruleStyle = isRuleLogingAll ? ['color:green', '', 'color: red'] : [];
    ruleLog(control, '#41b883', 'C', `执行计算规则${ruleText}`, ...ruleStyle);
  }
});

export const debugDisplayRule = debugWhen((control, rule, result) => {
  if (isRuleLogging) {
    const ruleText = isRuleLogingAll ? `%c ${rule} %c结果: %c ${result}` : '';
    const ruleStyle = isRuleLogingAll ? ['color:green', '', 'color: red'] : [];
    ruleLog(control, '#41b883', 'D', `执行隐藏规则${ruleText}`, ...ruleStyle);
  }
});

export const debugMappingRule = debugWhen((control) => {
  if (isRuleLogging) {
    ruleLog(control, '#41b883', 'M', `执行${control.controlKey === 'FormQuery' ? '关联' : '人员'}填充`);
  }
});

export const debugQueryAssign = debugWhen((control, assignVal) => {
  if (isRuleLogging) {
    const assignText = isRuleLogingAll ? `: %c${assignVal}` : '';
    const ruleStyle = isRuleLogingAll ? ['color: red'] : [];
    ruleLog(control, '#75e2b1', 'Q', `接到填充值${assignText}`, ...ruleStyle);
  }
});

export const debugCustomEvt = debugWhen((control, evtName) => {
  if (isRuleLogging) {
    ruleLog(control, '#f19328', 'B', `执行自定义代码事件：${evtName}%c`, 'color:green');
  }
});

export const debugCode = isDebugMode ? 'console.info("To debug custom code, click here.")' : '';
