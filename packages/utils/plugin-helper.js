import objectAssign from 'object-assign';

export const mergeOptions = ($vm, options) => {
  const defaults = {};
  for (const i in $vm.$options.props) {
    if (i !== 'value') {
      defaults[i] = $vm.$options.props[i].default;
    }
  }
  const $options = objectAssign({}, defaults, options);
  for (const i of Object.keys($options)) {
    $vm[i] = $options[i];
  }
};

export default {
};

