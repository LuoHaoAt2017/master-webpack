export default function formControlFactory(controlKey) {
  /* eslint-disable */
  switch (controlKey) {
    case 'FormNumber':
      return require('./form-number.js').default;
    case 'FormCheckbox':
      return require('./form-checkbox.js').default;
    case 'FormDateTime': 
      return require('./form-date-time.js').default;
    case 'FormRadioButtonList':
      return require('./form-radio-button-list').default;
    case 'FormDropDownList':
      return require('./form-drop-down-list.js').default;
    case 'FormCheckboxList':
      return require('./form-checkbox-list.js').default;
    case 'FormMap':
      return require('./form-map.js').default;
    case 'FormAttachment':
      return require('./form-attachment.js').default;
    case 'FormPhoto':
      return require('./form-photo.js').default;
    case 'FormMultiQuery':
      return require('./form-multi-query.js').default;
    case 'FormUser':
      return require('./form-user.js').default;
    case 'FormMultiUser':
      return require('./form-multi-user.js').default;
    case 'FormAreaSelect':
      return require('./form-area-select.js').default;
    case 'FormTextBox':
      return require('./form-text-box.js').default;
    case 'FormQuery':
      return require('./form-query.js').default;
    case 'FormTextArea':
      return require('./form-text-area.js').default;
    case 'FormGridView':
      return require('../form-grid-control/index.js').default;
    case 'FormFormula':
      return require('./form-formula.js').default;
    case 'FormLabel':
      return require('./form-label.js').default;
    case 'FormSeqNo':
      return require('./form-seq-no.js').default;
    default:
      return require('./form-common-control.js').default;
  }
}