<script>
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
// import transition from 'transition';
import animUtil from './util';

const transitionMap = {
  enter: 'transitionEnter',
  appear: 'transitionAppear',
  leave: 'transitionLeave',
};
// const refDomName = 'animateItem';
export default {
  name: 'h3-animateChild',
  props: {
    transitionName: {
      type: [String, Object],
    },
    transitionAppear: {
      type: Boolean,
      default: true,
    },
    transitionEnter: {
      type: Boolean,
      default: true,
    },
    transitionLeave: {
      type: Boolean,
      default: true,
    },
    animation: {
      type: Object,
    },
  },
  beforeDestroy() {
    if (this.$props.afterLeave) {
      this.$props.afterLeave();
    }
    this.componentWillUnmount();
  },
  components: {
    // transition,
  },
  methods: {
    componentWillUnmount() {
      this.stop();
    },
    componentWillEnter(el, done) {
      if (animUtil.isEnterSupported(this.$props)) {
        this.transition('enter', el, done);
      } else {
        done();
      }
    },
    // 在transition中没有对应的
    componentWillAppear(el, done) {
      if (animUtil.isAppearSupported(this.$props)) {
        this.transition('appear', el, done);
      } else {
        done();
      }
    },
    componentWillLeave(el, done) {
      if (animUtil.isLeaveSupported(this.$props)) {
        this.transition('leave', el, done);
      } else {
        // always sync, do not interupt with react component life cycle
        // update hidden -> animate hidden ->
        // didUpdate -> animate leave -> unmount (if animate is none)
        done();
      }
    },
    transition(animationType, el, finishCallback) {
      const node = el;
      const props = this.$props;
      const transitionName = props.transitionName;
      const nameIsObj = typeof transitionName === 'object';
      this.stop();
      const end = () => {
        this.stopper = null;
        finishCallback();
      };
      if (
        (isCssAnimationSupported || !props.animation[animationType]) &&
        transitionName &&
        props[transitionMap[animationType]]
      ) {
        const name = nameIsObj ? transitionName[animationType] : `${transitionName}-${animationType}`;
        let activeName = `${name}-active`;
        if (nameIsObj && transitionName[`${animationType}Active`]) {
          activeName = transitionName[`${animationType}Active`];
        }
        this.stopper = cssAnimate(
          node,
          {
            name,
            active: activeName,
          },
          end,
        );
      } else {
        this.stopper = props.animation[animationType](node, end);
      }
    },
    stop() {
      const stopper = this.stopper;
      if (stopper) {
        this.stopper = null;
        stopper.stop();
      }
    },
  },
  render(h) {
    const self = this;
    const props = self.$props;
    const result = h(
      'transition',
      {
        // ref: refDomName,
        props: {
          name: props.name,
          'enter-class': props.enterClass,
          'enter-active-class': props.enterActiveClass,
          'enter-to-class': props.enterToClass,
          'leave-class': props.leaveClass,
          'leave-active-class': props.leaveActiveClass,
          'leave-to-class': props.leaveToClass,
          duration: props.duration,
          'before-enter': props.beforeEnter,
          enter: self.componentWillEnter,
          'after-enter': props.afterEnter,
          'enter-cancelled': props.enterCancelled,
          'before-leave': props.beforeLeave,
          leave: self.componentWillLeave,
          'after-leave': self.componentWillUnmount,
          'leave-cancelled': props.leaveCancelled,
          css: props.css,
        },
      },
      self.$slots.default,
    );
    return result;
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/index';
@import '../../styles/mixins';
@import '../../styles/themes/default';
</style>
