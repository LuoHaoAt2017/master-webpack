<script>
import test2 from './test2';

export default {
  name: 'test',
  props: {
    name: String,
  },
  components: {
    test2,
  },
  render(h) {
    // return h(test2, { props: this.$props });
    const child = this.$slots.default[0];
    if (child.componentOptions) {
      // slot里面为vue组件
      return h(child.componentOptions.tag, {
        class: `${child.data.class} ${child.data.staticClass}`,
        style: {
          ...child.data.style,
          ...child.data.staticStyle,
        },
        on: child.data.on,
        nativeOn: child.data.nativeOn,
        attrs: child.data.attrs,
        props: child.componentOptions.propsData,
        key: child.data.key,
        ref: child.data.ref,
      }, child.componentOptions.children);
    }
    // slot 里面内容为html内容
    return h(child.tag, {
      class: `${child.data.class} ${child.data.staticClass}`,
      style: {
        ...child.data.style,
        ...child.data.staticStyle,
      },
      on: child.data.on,
      nativeOn: child.data.nativeOn,
      attrs: child.data.attrs,
      key: child.data.key,
      ref: child.data.ref,
    }, child.children);
  },
};
</script>
