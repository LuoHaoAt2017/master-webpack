import { go } from '../libs/router';

const parentMixin = {
  mounted() {
    if (this.value >= 0) {
      this.currentIndex = this.value;
    }
    this.updateIndex();
  },
  methods: {
    updateIndex() {
      if (!this.$children || !this.$children.length) return;
      this.number = this.$children.length;
      const children = this.$children;
      for (let i = 0; i < children.length; i += 1) {
        children[i].currentIndex = i;
        if (children[i].currentSelected) {
          this.index = i;
        }
      }
    },
  },
  props: {
    value: Number,
  },
  watch: {
    currentIndex(val, oldVal) {
      if (oldVal > -1 && this.$children[oldVal]) {
        this.$children[oldVal].currentSelected = false;
      }
      if (val > -1 && this.$children[val]) {
        this.$children[val].currentSelected = true;
      }
      this.$emit('input', val);
      this.$emit('on-index-change', val, oldVal);
    },
    index(val) {
      this.currentIndex = val;
    },
    value(val) {
      this.index = val;
    },
  },
  data() {
    return {
      index: -1,
      currentIndex: this.index,
      number: this.$children.length,
    };
  },
};

const childMixin = {
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.$parent.updateIndex();
  },
  beforeDestroy() {
    const $parent = this.$parent;
    this.$nextTick(() => {
      $parent.updateIndex();
    });
  },
  methods: {
    onItemClick(hasLink) {
      if (this.$parent.preventDefault) {
        this.$parent.$emit('on-before-index-change', this.currentIndex);
        return;
      }
      if (typeof this.disabled === 'undefined' || this.disabled === false) {
        // this.onPanOffset(this.$parent.currentIndex, this.currentIndex);
        this.currentSelected = true;
        this.$parent.currentIndex = this.currentIndex;
        this.$nextTick(() => {
          this.$emit('on-item-click', this.currentIndex);
        });
      }
      if (hasLink === true) {
        go(this.link, this.$router);
      }
    },
    // onPanOffset(oldIndex, curIndex) {
    //   const tabWidth = this.$parent.$el.offsetWidth;
    //   const tabSize = this.$parent.$el.offsetWidth / this.$parent.$children.length;
    //   const screenWidth = window.screen.availWidth;
    //   const scrollWidth = tabWidth - screenWidth;
    //   if (screenWidth > 0) {
    //     const scrollLeft = this.$parent.$el.parentElement.scrollLeft;
    //     if (curIndex > oldIndex) {
    //       const offset = Math.min(tabSize, scrollWidth - scrollLeft);
    //       this.$parent.$el.parentElement.scrollLeft += offset;
    //     } else {
    //       const offset = Math.min(tabSize, scrollLeft);
    //       this.$parent.$el.parentElement.scrollLeft -= offset;
    //     }
    //   }
    // },
  },
  watch: {
    currentSelected(val) {
      if (val) {
        this.$parent.index = this.currentIndex;
      }
    },
    selected(val) {
      this.currentSelected = val;
    },
  },
  data() {
    return {
      currentIndex: -1,
      currentSelected: this.selected,
    };
  },
};

export {
  parentMixin,
  childMixin,
};
