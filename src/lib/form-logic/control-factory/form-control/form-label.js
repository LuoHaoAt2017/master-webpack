function FormLabel() {
}

FormLabel.prototype.$clearValue = function clearValue() {
  this.options.tempValue = this.value
  return ''
};

FormLabel.prototype.$validate = () => true;

export default FormLabel;
