<script>
// import classNames from 'classnames';
// import deepAssign from 'deep-assign';

// const touchSupported = typeof window !== 'undefined' && 'ontouchstart' in window;
function noop() {}
export default {
  name: 'h3-touch',
  data() {
    return {
      state: {
        active: false,
      },
      child: null,
    };
  },
  beforeMount() {
    if (this.$slots.default.length > 1) {
      throw new Error('must one child');
    }
    this.child = Object.create(this.$slots.default[0]);
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    activeClassName: {
      type: String,
    },
    activeStyle: {
      type: String,
    },
    onTouchStart: {
      type: Function,
      default: noop,
    },
    onTouchMove: {
      type: Function,
      default: noop,
    },
    onTouchEnd: {
      type: Function,
      default: noop,
    },
    onTouchCancel: {
      type: Function,
      default: noop,
    },
    onMouseDown: {
      type: Function,
      default: noop,
    },
    onMouseUp: {
      type: Function,
      default: noop,
    },
    onMouseLeave: {
      type: Function,
      default: noop,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  updated() {
    if (this.$props.disabled) {
      this.state.active = false;
    }
  },
  methods: {
    triggerEvent(type, isActive, ev) {
      const eventType = `on${type}`;
      if (this.$props[eventType] && this.$props[eventType] !== noop) {
        this.$props[eventType](ev);
      }
      this.state.active = isActive;
    },
    selfonTouchStart(e) {
      this.triggerEvent('TouchStart', true, e);
    },
    selfonTouchMove(e) {
      this.triggerEvent('TouchMove', false, e);
    },
    selfonTouchEnd(e) {
      this.triggerEvent('TouchEnd', false, e);
    },
    selfonTouchCancel(e) {
      this.triggerEvent('TouchCancel', false, e);
    },
    selfonMouseDown(e) {
      if (this.$props.onTouchStart) {
        this.triggerEvent('TouchStart', true, e);
      }
      this.triggerEvent('MouseDown', true, e);
    },
    selfonMouseUp(e) {
      if (this.$props.onTouchEnd) {
        this.triggerEvent('TouchEnd', false, e);
      }
      this.triggerEvent('MouseUp', false, e);
    },
    selfonMouseLeave(e) {
      this.triggerEvent('MouseLeave', false, e);
    },
  },
  render() {
    const self = this;
    // const { disabled, activeClassName, activeStyle } = this.$props;
    const { disabled } = this.$props;
    const events = disabled ? undefined : {
      touchstart($event) {
        self.selfonTouchStart($event);
      },
      touchmove($event) {
        self.selfonTouchMove($event);
      },
      touchend($event) {
        self.selfonTouchEnd($event);
      },
      touchcancel($event) {
        self.selfonTouchCancel($event);
      },
      mousedown($event) {
        self.selfonMouseDown($event);
      },
      mouseup($event) {
        self.selfonMouseUp($event);
      },
      mouseleave($event) {
        self.selfonMouseLeave($event);
      },
    };
    // const node = new VNode();
    // const tempchild = deepAssign({}, this.$slots.default[0]);
    // if (!disabled && this.state.active) {
    //   let style = tempchild.data.style;
    //   let className = tempchild.data.class;
    //   if (activeStyle !== false) {
    //     if (activeStyle) {
    //       style = { ...style, ...activeStyle };
    //     }
    //     className = classNames(className, activeClassName);
    //   }
    //   tempchild.data.class = className;
    //   tempchild.data.style = style;
    // }
    // else{
    //   let style = tempchild.data.style;
    //   let className = tempchild.data.class;
    // }
    this.$slots.default[0].data.on = Object.assign(events, this.$slots.default[0].data.on);
    // tempchild.data.on = Object.assign(events, tempchild.data.on);
    return this.$slots.default[0];
  },
};
</script>
