<script>
import AnimateChild from './AnimateChild';
import animUtil from './util';
import {
  toArrayChildren,
  mergeChildren,
  findShownChildInChildrenByKey,
  findChildInChildrenByKey,
  isSameChildren,
} from './ChildrenUtils';

const defaultKey = `rc_animate_${Date.now()}`;
function getChildrenFromProps(props) {
  const children = props.$slots.default;
  const result = [];
  // 如果是vue插件，并且没有key加一个时间戳key；暂时没有方法判断是否vue插件
  children.forEach((child, index) => {
    let tempChild = child;
    if (!tempChild.key) {
      tempChild = Object.assign(child, { key: defaultKey + index });
    }
    result.push(tempChild);
  });
  return result;
}

function noop() {}
// const transitionMap = {
//   enter: 'transitionEnter',
//   appear: 'transitionAppear',
//   leave: 'transitionLeave',
// };

export default {
  name: 'h3-Animate',
  props: {
    // ERROR这里只接收String类型参数，vue控件类型暂时不接收
    component: {
      type: String,
      // default() {
      //   return this.$createElement('span');
      // },
      default: 'span',
    },
    componentProps: {
      type: Object,
      default() {
        return {};
      },
    },
    // 自定义的动画函数,要有 leave,appear,enter 三个key
    animation: {
      type: Object,
      default() {
        return {};
      },
    },
    transitionName: {
      type: [String, Object],
    },
    transitionEnter: {
      type: Boolean,
      default: true,
    },
    transitionLeave: {
      type: Boolean,
      default: true,
    },
    exclusive: {
      type: Boolean,
    },
    transitionAppear: {
      type: Boolean,
      default: false,
    },
    onEnd: {
      type: Function,
      default() {
        return noop;
      },
    },
    onEnter: {
      type: Function,
      default() {
        return noop;
      },
    },
    onLeave: {
      type: Function,
      default() {
        return noop;
      },
    },
    onAppear: {
      type: Function,
      default() {
        return noop;
      },
    },
    showProp: {
      type: String,
    },
    name: {
      type: String,
      default: 'v',
    },
    enterClass: {
      type: String,
    },
    enterActiveClass: {
      type: String,
    },
    enterToClass: {
      type: String,
    },
    leaveClass: {
      type: String,
    },
    leaveActiveClass: {
      type: String,
    },
    leaveToClass: {
      type: String,
    },
    duration: {
      type: Object,
    },
    beforeEnter: {
      type: Function,
      default: noop,
    },
    enter: {
      type: Function,
      default: noop,
    },
    afterEnter: {
      type: Function,
      default: noop,
    },
    enterCancelled: {
      type: Function,
      default: noop,
    },
    beforeLeave: {
      type: Function,
      default: noop,
    },
    leave: {
      type: Function,
      default: noop,
    },
    afterLeave: {
      type: Function,
      default: noop,
    },
    leaveCancelled: {
      type: Function,
      default: noop,
    },
    // 当只用 JavaScript 过渡的时候， 在 enter 和 leave 中，回调函数 done 是必须的 。否则，它们会被同步调用，过渡会立即完成。
    // 推荐对于仅使用 JavaScript 过渡的元素添加 v-bind:css="false"，Vue 会跳过 CSS 的检测。这也可以避免过渡过程中 CSS 的影响
    css: {
      type: Boolean,
    },
  },
  data() {
    return {
      currentlyAnimatingKeys: [],
      keysToEnter: [],
      keysToLeave: [],
      childrenRefs: null,
      state: {
        children: null,
        end: noop,
      },
    };
  },
  beforeDestroy() {
    this.componentWillUnmount();
  },
  mounted() {
    this.componentDidMount();
  },
  updated() {
    this.componentDidUpdate();
  },
  components: {
    AnimateChild,
  },
  beforeCreate() {
  },
  created() {
    this.state.children = toArrayChildren(getChildrenFromProps(this));
    this.state.childrenRefs = this.$refs;
  },
  methods: {
    componentDidMount() {
      const showProp = this.$props.showProp;
      let children = this.state.children;
      if (showProp) {
        children = children.filter(child => (
          !!child.data.props[showProp]
        ));
      }
      children.forEach((child) => {
        if (child) {
          this.performAppear(child.data.props.key);
        }
      });
    },
    componentWillReceiveProps(nextProps) {
      this.nextProps = nextProps;
      const nextChildren = toArrayChildren(getChildrenFromProps(nextProps));
      const props = this.$props;
      // exclusive needs immediate response
      if (props.exclusive) {
        Object.keys(this.currentlyAnimatingKeys).forEach((key) => {
          this.stop(key);
        });
      }
      const showProp = props.showProp;
      const currentlyAnimatingKeys = this.currentlyAnimatingKeys;
      // last props children if exclusive
      const currentChildren = props.exclusive ?
        toArrayChildren(getChildrenFromProps(props)) : this.state.children;
      // in case destroy in showProp mode
      let newChildren = [];
      if (showProp) {
        currentChildren.forEach((currentChild) => {
          const nextChild = currentChild &&
           findChildInChildrenByKey(nextChildren, currentChild.key);
          let newChild;
          if ((!nextChild || !nextChild.$props[showProp]) && currentChild.$props[showProp]) {
            newChild = Object.cloneElement(nextChild || currentChild, {
              [showProp]: true,
            });
          } else {
            newChild = nextChild;
          }
          if (newChild) {
            newChildren.push(newChild);
          }
        });
        nextChildren.forEach((nextChild) => {
          if (!nextChild || !findChildInChildrenByKey(currentChildren, nextChild.key)) {
            newChildren.push(nextChild);
          }
        });
      } else {
        newChildren = mergeChildren(currentChildren, nextChildren);
      }

      // need render to avoid update
      this.state.children = newChildren;
      nextChildren.forEach((child) => {
        const key = child && child.key;
        if (child && currentlyAnimatingKeys[key]) {
          return;
        }
        const hasPrev = child && findChildInChildrenByKey(currentChildren, key);
        if (showProp) {
          const showInNext = child.$props[showProp];
          if (hasPrev) {
            const showInNow = findShownChildInChildrenByKey(currentChildren, key, showProp);
            if (!showInNow && showInNext) {
              this.keysToEnter.push(key);
            }
          } else if (showInNext) {
            this.keysToEnter.push(key);
          }
        } else if (!hasPrev) {
          this.keysToEnter.push(key);
        }
      });

      currentChildren.forEach((child) => {
        const key = child && child.key;
        if (child && currentlyAnimatingKeys[key]) {
          return;
        }
        const hasNext = child && findChildInChildrenByKey(nextChildren, key);
        if (showProp) {
          const showInNow = child.$props[showProp];
          if (hasNext) {
            const showInNext = findShownChildInChildrenByKey(nextChildren, key, showProp);
            if (!showInNext && showInNow) {
              this.keysToLeave.push(key);
            }
          } else if (showInNow) {
            this.keysToLeave.push(key);
          }
        } else if (!hasNext) {
          this.keysToLeave.push(key);
        }
      });
    },
    componentDidUpdate() {
      const keysToEnter = this.keysToEnter;
      this.keysToEnter = [];
      keysToEnter.forEach(this.performEnter);
      const keysToLeave = this.keysToLeave;
      this.keysToLeave = [];
      keysToLeave.forEach(this.performLeave);
    },
    performEnter(key) {
      // may already remove by exclusive
      if (this.state.childrenRefs[key]) {
        this.currentlyAnimatingKeys[key] = true;
        this.state.childrenRefs[key].componentWillEnter(this.handleDoneAdding.bind(this, key, 'enter'));
      }
    },
    performAppear(key) {
      if (this.state.childrenRefs[key]) {
        this.currentlyAnimatingKeys[key] = true;
        this.state.childrenRefs[key].componentWillAppear(this.handleDoneAdding.bind(this, key, 'appear'));
      }
    },
    handleDoneAdding(key, type) {
      const props = this.$props;
      delete this.currentlyAnimatingKeys[key];
      // if update on exclusive mode, skip check
      if (props.exclusive && props !== this.nextProps) {
        return;
      }
      const currentChildren = toArrayChildren(getChildrenFromProps(props));
      if (!this.isValidChildByKey(currentChildren, key)) {
        // exclusive will not need this
        this.performLeave(key);
        return;
      }
      if (type === 'appear') {
        if (animUtil.allowAppearCallback(props)) {
          props.onAppear(key);
          props.onEnd(key, true);
        }
        return;
      }
      if (animUtil.allowEnterCallback(props)) {
        props.onEnter(key);
        props.onEnd(key, true);
      }
    },
    performLeave(key) {
      // may already remove by exclusive
      if (this.state.childrenRefs[key]) {
        this.currentlyAnimatingKeys[key] = true;
        this.state.childrenRefs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key));
      }
    },
    handleDoneLeaving(key) {
      const props = this.$props;
      delete this.currentlyAnimatingKeys[key];
      // if update on exclusive mode, skip check
      if (props.exclusive && props !== this.nextProps) {
        return;
      }
      const currentChildren = toArrayChildren(getChildrenFromProps(props));
      // in case state change is too fast
      if (this.isValidChildByKey(currentChildren, key)) {
        this.performEnter(key);
      } else {
        const end = () => {
          if (animUtil.allowLeaveCallback(props)) {
            props.onLeave(key);
            props.onEnd(key, false);
          }
        };
        if (!isSameChildren(this.state.children, currentChildren, props.showProp)) {
          this.state.children = currentChildren;
          this.satte.end = end;
        } else {
          end();
        }
      }
    },
    isValidChildByKey(currentChildren, key) {
      const showProp = this.$props.showProp;
      if (showProp) {
        return findShownChildInChildrenByKey(currentChildren, key, showProp);
      }
      return findChildInChildrenByKey(currentChildren, key);
    },
    stop(key) {
      delete this.currentlyAnimatingKeys[key];
      const component = this.state.childrenRefs[key];
      if (component) {
        component.stop();
      }
    },
  },
  render(h) {
    const props = this.$props;
    this.nextProps = props;
    const stateChildren = this.state.children;
    let children = null;
    if (stateChildren) {
      children = stateChildren.map((child) => {
        if (child === null || child === undefined) {
          return child;
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children');
        }
        return h(
          'AnimateChild',
          {
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
              enter: props.enter,
              'after-enter': props.afterEnter,
              'enter-cancelled': props.enterCancelled,
              'before-leave': props.beforeLeave,
              leave: props.leave,
              'after-leave': props.afterLeave,
              'leave-cancelled': props.leaveCancelled,
              css: props.css,
              transitionName: props.transitionName,
              animation: props.animation,
              transitionEnter: props.transitionEnter,
              transitionLeave: props.transitionLeave,
              transitionAppear: props.transitionAppear,
            },
            ref: child.key,
            key: child.key,
          },
          [child],
        );
      });
    }
    const Component = props.component;
    if (Component) {
      let passedProps = props;
      passedProps = {
        className: props.className,
        style: props.style,
        ...props.componentProps,
      };
      return h(
        Component,
        {
          props: passedProps,
        },
        children,
      );
    }
    return children[0] || null;
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/index';
@import '../../styles/mixins';
@import '../../styles/themes/default';
</style>
