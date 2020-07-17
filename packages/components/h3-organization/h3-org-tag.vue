<template>
  <h3-touch 
    :onTouchStart="touchStart" 
    :onTouchMove="touchMove" 
    :onTouchEnd="touchEnd" 
    :onTouchCancel="touchCancel"
    :class="choiceCls" >
    <li unselectable="unselectable"  
      :title="selectedItem.ObjectId" v-if="selectedItem.ObjectId"
      @click="itemClick"
      style="user-select: none;">
      <div :class="prefixCls+'-select-selection__choice__content'">{{selectedItem.DisplayName}}
      </div>
    </li>
  </h3-touch>
</template>
<script>
import cx from 'classnames';
import h3Touch from '../h3-touch/';
import touch2 from '../../mixins/touch2';

export default {
  name: 'h3-org-tag',
  mixins: [touch2],
  components: {
    h3Touch,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'h3-multiuser',
    },
    selectedItem: {
      type: Object,
      default() {
        return {};
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
    touchStart() {
      this.isActive = true;
    },
    touchEnd() {
      this.isActive = false;
    },
    itemClick() {
      this.$emit('itemClick', this.selectedItem);
    },
  },
  computed: {
    choiceCls() {
      return cx(`${this.prefixCls}-select-selection__choice`, {
        [`${this.prefixCls}-select-selection__choice-active`]: this.isActive,
      });
    },
  },
  watch: {
  },
};
</script>

