// 阻止页面滚动
import dom from './dom';

const BODY_CLASS_NAME = 'vux-modal-open';
const CONTAINER_CLASS_NAME = 'vux-modal-open-for-container';
const VUX_VIEW_BOX_ELEMENT = '#vux_view_box_body';

export default {
  methods: {
    getLayout() {
      if (typeof window !== 'undefined') {
        if (window.VUX_CONFIG && window.VUX_CONFIG.$layout === 'VIEW_BOX') {
          return 'VIEW_BOX';
        }
      }
      return '';
    },
    addModalClassName() {
      if (typeof this.shouldPreventScroll === 'function' && this.shouldPreventScroll()) {
        return;
      }
      if (this.getLayout() === 'VIEW_BOX') {
        dom.addClass(document.body, BODY_CLASS_NAME);
        dom.addClass(document.querySelector(VUX_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
      }
    },
    removeModalClassName() {
      if (this.getLayout() === 'VIEW_BOX') {
        dom.removeClass(document.body, BODY_CLASS_NAME);
        dom.removeClass(document.querySelector(VUX_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
      }
    },
    // shouldPreventScroll() {
    //     const iOS = /iPad|iPhone|iPod/i.test(window.navigator.userAgent)
    // const hasInput = this.$el.querySelector('input') || this.$el.querySelector('textarea')
    //     if (iOS) {
    //         return true
    //     }
    // }
  },
  beforeDestroy() {
    this.removeModalClassName();
  },
  deactivated() {
    this.removeModalClassName();
  },
};
