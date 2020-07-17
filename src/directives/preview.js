export default {
  inserted (el, binding) {
    const oDiv = el;
    const value = binding.value;
    if (value) {
      const type = value.type;
      const isPreview = value.isPreview;
      const corpId = value.corpId;
      if (isPreview) {
        if (type) {
          $(oDiv).FlyZommImg(corpId, { type });
        } else {
          $(oDiv).FlyZommImg(corpId);
        }
      } else if (type) {
        $(oDiv).FlyZommImg(corpId, { type });
      }
    } else {
      $(oDiv).FlyZommImg();
    }
  },
  update () {

  },
  unbind () {

  },
};
