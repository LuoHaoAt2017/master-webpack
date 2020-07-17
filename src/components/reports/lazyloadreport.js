
export default {
  inserted(el, binding) {
    // const oDiv = el;
    const value = binding.value;
    const loadReport = function a() {
      if (el.children.length > 0) {
        return;
      }
      const top = el.getBoundingClientRect().top;

      if (top < document.documentElement.clientHeight) {
        // 进入视野
        setTimeout(() => {
          value.handler(value.reportId, value.reportWidgetId, el);
        }, 500);
      }
    };
    // 一开始就在视野范围之内
    loadReport();
    window.onscroll = function a() {
      loadReport();
    };
  },
  update() {

  },
  unbind() {

  },
};
