<template>
  <div  :class="wrapClasses">
    <slot></slot>
  </div>
</template>

<script>
import cx from 'classnames';

const prefixCls = 'h3-flexbox';

export default {
  name: 'h3-flexbox',
  props: {
    direction: {
      type: String,
      default: 'row',
    },
    wrap: {
      type: String,
      default: 'nowrap',
    },
    justify: {
      type: String,
      default: 'center',
    },
    align: {
      type: String,
      default: 'center',
    },
    // disabled: {
    //   type: Boolean,
    // },
    gutter: {
      type: Number,
      default: 8,
    },
    orient: {
      type: String,
      default: 'horizontal',
    },
  },
  computed: {
    wrapClasses() {
      return cx(prefixCls, {
        [`${prefixCls}-dir-row`]: this.direction === 'row',
        [`${prefixCls}-dir-row-reverse`]: this.direction === 'row-reverse',
        [`${prefixCls}-dir-column`]: this.direction === 'column',
        [`${prefixCls}-dir-column-reverse`]: this.direction === 'column-reverse',

        [`${prefixCls}-nowrap`]: this.wrap === 'nowrap',
        [`${prefixCls}-wrap`]: this.wrap === 'wrap',
        [`${prefixCls}-wrap-reverse`]: this.wrap === 'wrap-reverse',

        [`${prefixCls}-justify-start`]: this.justify === 'start',
        [`${prefixCls}-justify-end`]: this.justify === 'end',
        [`${prefixCls}-justify-center`]: this.justify === 'center',
        [`${prefixCls}-justify-between`]: this.justify === 'between',
        [`${prefixCls}-justify-around`]: this.justify === 'around',

        [`${prefixCls}-align-start`]: this.align === 'start',
        [`${prefixCls}-align-center`]: this.align === 'center',
        [`${prefixCls}-align-end`]: this.align === 'end',
        [`${prefixCls}-align-baseline`]: this.align === 'baseline',
        [`${prefixCls}-align-stretch`]: this.align === 'stretch',

        [`${prefixCls}-align-content-start`]: this.alignContent === 'start',
        [`${prefixCls}-align-content-end`]: this.alignContent === 'end',
        [`${prefixCls}-align-content-center`]: this.alignContent === 'center',
        [`${prefixCls}-align-content-between`]: this.alignContent === 'between',
        [`${prefixCls}-align-content-around`]: this.alignContent === 'around',
        [`${prefixCls}-align-content-stretch`]: this.alignContent === 'stretch',
      });
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';

@flexPrefixCls: h3-flexbox;

/* flexbox */
.@{flexPrefixCls} {
  text-align: left;
  overflow: hidden;
  display: flex;
  display: -webkit-flex;
  align-items: center;

  &&-dir-row {
    flex-direction: row;
  }

  &&-dir-row-reverse {
    flex-direction: row-reverse;
  }

  &&-dir-column {
    flex-direction: column;
  }

  &&-dir-column-reverse {
    flex-direction: column-reverse;
  }

  &&-nowrap {
    flex-wrap: nowrap;
  }

  &&-wrap {
    flex-wrap: wrap;
  }

  &&-wrap-reverse {
    flex-wrap: wrap-reverse;
  }

  &&-justify-start {
    justify-content: flex-start;
  }

  &&-justify-end {
    justify-content: flex-end;
  }

  &&-justify-center {
    justify-content: center;
  }

  &&-justify-between {
    justify-content: space-between;
  }

  &&-justify-around {
    justify-content: space-around;
  }

  &&-align-start {
    align-items: flex-start;
  }

  &&-align-end {
    align-items: flex-end;
  }

  &&-align-center {
    align-items: center;
  }

  &&-align-stretch {
    align-items: stretch;
  }

  &&-align-baseline {
    align-items: baseline;
  }

  &&-align-content-start {
    align-content: flex-start;
  }

  &&-align-content-end {
    align-items: flex-end;
  }

  &&-align-content-center {
    align-items: center;
  }

  &&-align-content-between {
    align-items: stretch;
  }

  &&-align-content-around {
    align-items: baseline;
  }

  &&-align-content-stretch {
    align-items: baseline;
  }

  & &-item {
    box-sizing: border-box;
    flex: 1;
    -webkit-flex: 1;
    margin-left: @h-spacing-md;
    min-width: 10 * @hd;

    &:first-child {
      margin-left: 0 !important;
    }
  }
}
</style>

