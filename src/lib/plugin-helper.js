/* eslint-disable*/
// zyq;
const mergeOptions = function mergeOptions($vms, options) {
  const $vm = $vms;
  const defaults = {};
  for (const i in $vm.$options.props) {
    if (i !== 'value') {
      defaults[i] = $vm.$options.props[i].default;
    }
  }
  const _options = Object.assign({}, defaults, options);
  for (const i in _options) {
    if (Object.prototype.hasOwnProperty.call(_options, i)) {
      $vm[i] = _options[i];
    }
  }
};

export default mergeOptions;
