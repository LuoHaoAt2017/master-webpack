import dom from '../utils/dom';

const BODY_CLASS_NAME = 'h3-modal-open';
const CONTAINER_CLASS_NAME = 'h3-modal-open-for-container';
const H3_VIEW_BOX_ELEMENT = '#h3_view_box_body';
let scrollTop = 0;

export default {
  methods: {
    // some plugin may be imported before configPlugin,
    // so we cannot get gloal config when component is created
    getLayout() {
      if (typeof window !== 'undefined') {
        if ((window.H3_CONFIG && window.H3_CONFIG.$layout === 'VIEW_BOX') || this.layout === 'VIEW_BOX') {
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
        scrollTop = document.documentElement.scrollTop;
        document.body.style.top = `${-scrollTop}px`;
        dom.addClass(document.body, BODY_CLASS_NAME);
        // dom.addClass(this.$el.parentElement, BODY_CLASS_NAME);
        dom.addClass(document.querySelector(H3_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
      }
    },
    removeModalClassName() {
      if (this.getLayout() === 'VIEW_BOX') {
        dom.removeClass(document.body, BODY_CLASS_NAME);
        // dom.removeClass(this.$el.parentElement, BODY_CLASS_NAME);
        document.documentElement.scrollTop = scrollTop;
        dom.removeClass(document.querySelector(H3_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
      }
    },
  },
  beforeDestroy() {
    this.removeModalClassName();
  },
  deactivated() {
    this.removeModalClassName();
  },
};
