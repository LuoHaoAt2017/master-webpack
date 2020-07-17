function FormCheckbox() {

}

FormCheckbox.prototype.$valueType = Boolean;

FormCheckbox.prototype.$clearValue = () => false;


FormCheckbox.prototype.$setValue = function setValue(value) {
  if (typeof value === 'boolean' && value) {
    return true;
  }
  return false;
};

FormCheckbox.prototype.$initValue = function initValue(value) {
  return value || false;
};

FormCheckbox.prototype.$queryAssign = function queryAssign(value) {
  return value === '是' || (value === '否' ? false : !!value);
};

export default FormCheckbox;
