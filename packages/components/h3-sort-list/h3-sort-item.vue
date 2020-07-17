<template>
  <div class="h3-sort-item h3-list-item h3-list-item-middle" :style="{transform}" :class="wrapCls" @click="innerClick($event)">
    <div class="h3-list-line">
      <div class="h3-list-content">
        <slot></slot>
      </div>
      <div class="h3-list-extra" style="padding-right: 0" v-show="enabled">
        <span class="h3-sort-handle" @touchstart.prevent.stop="start($event)">
          <h3-icon type="move-up-down"></h3-icon>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';
import H3Icon from '../../components/h3-icon/index.vue';

export default {
  name: 'h3-sort-item',
  components: {
    H3Icon,
  },
  props: {
    order: {
      type: Number,
      default: 0,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    className: String,
    eventArgs: [Object, String, Number, Boolean, Array],
  },
  data() {
    return {
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      touching: false,
      hasTransition: false,
      targetIndex: 0,
      itemHeight: 44,
      leftDragOffset: 0,
      rightDragOffset: 0,
      itemsLength: 0,
      valid: false,
    };
  },
  mounted() {
    this.itemHeight = this.$el.offsetHeight;
  },
  methods: {
    start(e) {
      if (!this.enabled) {
        return;
      }
      const parent = this.getParent();
      if (parent) {
        this.leftDragOffset = parent.leftDragOffset;
        this.rightDragOffset = parent.rightDragOffset;
        this.itemsLength = parent.list.length;
      }
      const touch = e.targetTouches[0];
      const ele = this.$el;
      this.startX = touch.pageX;
      this.startY = touch.pageY;
      this.itemHeight = ele.offsetHeight;
      this.targetIndex = this.order;
      this.touching = true;
      this.batchAll((item) => {
        if (!item.touching) {
          item.setTransition();
        }
      });
      ele.addEventListener('touchmove', this.move);
      ele.addEventListener('touchend', this.end);
    },
    move(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.preventDefault();
      const touch = e.targetTouches[0];
      // 计算坐标，实现拖拽
      const dltX = touch.pageX - this.startX;
      if (dltX > 0) {
        this.offsetX = dltX > this.rightDragOffset ? this.rightDragOffset : dltX;
      } else {
        this.offsetX = -dltX > this.leftDragOffset ? -this.leftDragOffset : dltX;
      }
      this.offsetY = touch.pageY - this.startY;
      // 根据纵向拖拽距离判断当前item的序号
      const distance = Math.abs(this.offsetY);
      const over = Math.floor(distance / this.itemHeight) * Math.sign(this.offsetY);
      this.targetIndex = this.order + over;
      this.targetIndex = this.targetIndex < 0 ? 0 : this.targetIndex;
      this.targetIndex = this.targetIndex >= this.itemsLength ?
        this.itemsLength - 1 : this.targetIndex;
      if (this.targetIndex >= 0 && this.targetIndex < this.itemsLength) {
        this.batchAll((item) => {
          if (!item.touching && item.translate) {
            item.translate(this.order, this.targetIndex);
          }
        });
      }
      this.valid = true;
    },
    end() {
      if (this.valid) {
        this.offsetX = 0;
        this.offsetY = (this.targetIndex - this.order) * this.itemHeight;
        this.hasTransition = true;
        this.$el.addEventListener('transitionend', this.renderNewOrder);
      } else {
        this.reset();
      }
      // this.$el.addEventListener('webkitTransitionEnd', this.renderNewOrder);
      this.$el.removeEventListener('touchmove', this.move);
      this.$el.removeEventListener('touchend', this.end);
    },
    translate(touchingIndex, targetIndex) {
      this.itemHeight = this.$el.offsetHeight;
      this.offsetX = 0;
      if (touchingIndex > this.order) {
        this.offsetY = this.order >= targetIndex ? this.itemHeight : 0;
      } else {
        this.offsetY = this.order <= targetIndex ? -this.itemHeight : 0;
      }
    },
    reset() {
      this.startX = 0;
      this.startY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.targetIndex = 0;
      this.touching = false;
      this.hasTransition = false;
      this.valid = false;
    },
    renderNewOrder() {
      const parent = this.$parent;
      if (parent && parent.reorderList) {
        parent.reorderList(this.order, this.targetIndex);
      }
      this.batchAll((item) => {
        item.reset();
      });
      this.$el.removeEventListener('transitionend', this.renderNewOrder);
    },
    batchAll(callback) {
      const items = this.$parent.$children;
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].order !== undefined) {
          callback(items[i], i);
        }
      }
    },
    getParent() {
      const parent = this.$parent;
      if (parent.list && parent.list.length > 0) {
        return parent;
      }
      return parent.$parent || parent;
    },
    setTransition() {
      this.hasTransition = true;
    },
    innerClick(e) {
      if (this.enabled) {
        e.stopPropagation();
      } else {
        this.$emit('onClick', this.eventArgs);
      }
    },
  },
  computed: {
    transform() {
      const res = this.offsetX === 0 && this.offsetY === 0 ? '' : `translate3d(${this.offsetX}px,${this.offsetY}px,0)`;
      return res;
    },
    wrapCls() {
      return cx(this.className, {
        'h3-sort-touching': this.touching,
        'h3-sort-transition': this.hasTransition,
      });
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/h3-ui/h3-list';
// @import '../../styles/themes/default';
.h3-sort-list{
  .h3-sort{
    &-item{
      will-change: transform;
      .h3-list-line{
        padding-right: 0;
      }
    }
    &-handle{
      display: inline-block;
      font-size: @font-size-heading;
      padding-left: 15 * @hd;
      padding-bottom: 5 * @hd;
      padding-right: 15 * @hd;
      color: #999;
      width:25 * @hd;
    }

    &-touching{
      position: relative;
      z-index:2000;
      box-shadow: 0 2 * @hd 11 * @hd 0 rgba(90,121,143,0.2);
      border: none;
    }

    &-transition{
      transition:transform 400ms;
    }
  }
}
</style>

