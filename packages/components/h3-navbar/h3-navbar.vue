<script>
import classnames from 'classnames';

function emptyFunction() {}
export default {
  name: 'h3-navbar',
  props: {
    prefixCls: {
      type: String,
      default: 'h3-navbar',
    },
    className: {
      type: String,
    },
    mode: {
      type: String,
      validator(value) {
        if (value) {
          if (value === 'dark' || value === 'light') {
            return true;
          }
          return false;
        }
        return true;
      },
    },
    // 这三个参数改成从具名slot传
    // icon: {
    //   type: null,
    // },
    // 如果 leftContent,先去leftContent在取this.$slots.leftContent
    leftContent: {
      type: null,
    },
    // rightContent: {
    //   type: null,
    // },
    onLeftClick: {
      type: Function,
      default() {
        return emptyFunction;
      },
    },
  },
  methods: {
    geticon(h) {
      const icon = this.$slots.icon;
      if (icon) {
        return h(
          'span',
          {
            class: `${this.prefixCls}-left-icon`,
            attrs: {
              'aria-hidden': 'true',
            },
          },
          icon,
        );
      }
      return null;
    },
  },
  render(h) {
    const self = this;
    const {
      prefixCls,
      className,
      mode,
      onLeftClick,
      ...restProps
    } = this.$props;
    const leftContent = this.$props.leftContent || this.$slots.leftContent;
    const rightContent = this.$slots.rightContent;
    const children = this.$slots.default;
    const result = h(
      'div',
      {
        class: classnames(className, prefixCls, `${prefixCls}-${mode}`),
        // ERROR暂时放到这里
        props: { ...restProps },
      },
      [
        h(
          'div',
          {
            class: `${prefixCls}-left`,
            attrs: {
              role: 'button',
            },
            on: {
              click($event) {
                self.onLeftClick($event);
              },
            },
          },
          [self.geticon(h), leftContent],
        ),
        h(
          'div',
          {
            class: `${prefixCls}-title`,
          },
          children,
        ),
        h(
          'div',
          {
            class: `${prefixCls}-right`,
          },
          rightContent,
        ),
      ],
    );
    return result;
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/index';
@import '../../styles/mixins';

@navbar-height: 45 * @hd;
@navbarPrefixCls: h3-navbar;

.@{navbarPrefixCls} {
  display: flex;
  align-items: center;
  height: @navbar-height;
  background-color: @brand-primary;
  color: @fill-base;

  &-left,
  &-title,
  &-right {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &-left {
    padding-left: @h-spacing-lg;
    font-size: @link-button-font-size;

    &-icon {
      margin-right: @h-spacing-sm;
      display: inherit;
    }
  }

  &-title {
    justify-content: center;
    font-size: 18 * @hd;
    white-space: nowrap;
  }

  &-right {
    justify-content: flex-end;
    font-size: @link-button-font-size;
    margin-right: @h-spacing-lg;
  }

  &-light {
    background-color: @fill-base;
    color: @brand-primary;
  }

  &-light &-title {
    color: @color-text-base;
  }
}

</style>
