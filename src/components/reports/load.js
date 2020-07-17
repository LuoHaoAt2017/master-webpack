
export default {
  inserted(el, binding) {
    // const oDiv = el;
    const value = binding.value;
    const loadReport = function bb() {
      if (el.children.length > 0) {
        return;
      }
      setTimeout(() => {
        value.handler(value.reportId, value.reportWidgetId, el);
      }, 500);
    };
    loadReport();
  },
  update() {

  },
  unbind() {

  },
};
