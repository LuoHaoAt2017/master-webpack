<template>
  <div>
    <div
    class="h3-cells__title"
    v-if="title"
    :style="cleanStyle({
      color: titleColor
    })"
    v-html="title"></div>
    <slot name="title"></slot>
    <div
    class="h3-cells"
    :class="{
      'h3-no-group-title': !title
    }"
    :style="cleanStyle({
      marginTop: typeof gutter === 'number' ? (gutter + 'px') : gutter
    })">
      <slot name="after-title"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import cleanStyle from '../../utils/clean-style';

export default {
  name: 'group',
  methods: {
    cleanStyle,
  },
  props: {
    title: String,
    titleColor: String,
    labelWidth: String,
    labelAlign: String,
    labelMarginRight: String,
    gutter: [String, Number],
  },
};
</script>

<style lang="less">
@import '../../styles/h3-ui/h3-cell.less';
@import '../../styles/blank.less';

.h3-no-group-title {
  margin-top: @group-title-margin-top;
}

/* global config for group items */
.h3-cell-value {
  color: @cell-value-color;
}
.h3-cell-placeholder {
  color: @cell-placeholder-color;
}
</style>
