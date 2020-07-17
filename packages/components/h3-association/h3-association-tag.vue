<template>
    <li unselectable="unselectable" :class="choiceCls"
      :title="selectedItem.ObjectId" v-if="selectedItem.ObjectId"
      style="user-select: none;" @touchstart.prevent.stop="itemClick">
      <div :class="prefixCls+'-select-selection__choice__content'">{{selectedItem.Name}}</div>
    </li>
</template>
<script>
import cx from 'classnames';


export default {
  name: 'h3-association-tag',
  components: {
  },
  directives: {
    // touch,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'h3-association',
    },
    selectedItem: {
      type: Object,
      default() {
        return {
        };
      },
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  created() {
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    itemClick() {
      if (this.touchTimeOut) {
        this.touchTimeOut = null;
      }
      this.isActive = true;
      this.$emit('itemClick', this.selectedItem);
      this.touchTimeOut = setTimeout(() => {
        this.isActive = false;
      }, 200);
    },
  },
  computed: {
    choiceCls() {
      return cx(`${this.prefixCls}-select-selection__choice`, {
        [`${this.prefixCls}-select-selection__choice-active`]: this.isActive,
      });
    },
    activeCls() {
      return `${this.prefixCls}-select-selection__choice`;
    },
  },
  watch: {
  },
};
</script>

