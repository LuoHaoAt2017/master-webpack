<template>
  <a href="javascript:;" class="h3-tabbar__item" :class="{'h3-bar__item_on': isActive, 'h3-tabbar-simple': simple}" @click="onItemClick(true)">
    <div class="h3-tabbar__icon" :class="[iconClass || $parent.iconClass, {'h3-reddot': showDot}]" v-if="!simple">
      <slot name="icon" v-if="!simple && !(hasActiveIcon && isActive)"></slot>
      <slot name="icon-active" v-if="!simple && hasActiveIcon && isActive"></slot>
      <sup v-if="badge"><badge :text="badge"></badge></sup>
    </div>
    <p class="h3-tabbar__label">
      <slot name="label"></slot>
    </p>
  </a>
</template>

<script>
import { childMixin } from '../../mixins/multi-items';
import Badge from '../../components/h3-badge/';

export default {
  name: 'h3-tabbar-item',
  components: {
    Badge,
  },
  mounted() {
    if (!this.$slots.icon) {
      this.simple = true;
    }
    if (this.$slots['icon-active']) {
      this.hasActiveIcon = true;
    }
  },
  mixins: [childMixin],
  props: {
    showDot: {
      type: Boolean,
      default: false,
    },
    badge: String,
    link: [String, Object],
    iconClass: String,
  },
  computed: {
    isActive() {
      return this.$parent.index === this.currentIndex;
    },
  },
  data() {
    return {
      simple: false,
      hasActiveIcon: false,
    };
  },
};
</script>