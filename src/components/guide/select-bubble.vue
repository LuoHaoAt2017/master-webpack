<template>
  <div
    class="bubble"
    :class="{'bubble--reverse': isReverse}"
  >
    <div class="bubble__list">
      <div
        class="bubble__list-item"
        v-for="item in selectList"
        :key="item.Code"
        :style="{width: `${100 / column}%`}"
      >
        <div
          class="wrapper"
          :class="{'wrapper--active': item.isSelect, 'wrapper--disabled': item.disabled,}"
          @click="select(item)"
        >
          <span aria-label="loading" class="loading h3-loading-spinner" v-if="item.loading"></span>
          {{item.Name}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>

function debounce(func, wait, immediate) {
  let timeout;
  let result;
  const debounced = function (...args) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }

    if (immediate) {
      const callNow = !timeout;

      timeout = setTimeout(function () {
        timeout = null;
      }, wait);

      if (callNow) {
        result = func.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    }
    return result;
  }

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  }

  return debounced;
}

export default {
  name: 'select-bubble',
  model: {
    prop: 'click',
    event: 'change',
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    limit: {
      type: Number,
      validator: value =>
        value > 0, // 气泡点击次数
      default: 1,
    },
    column: {
      type: Number,
      validator: value =>
        value > 0 && value < 4, // 默认最大为4栏
      default: 2,
    },
    isReverse: {
      type: Boolean, // 气泡排列方向，默认false为自上而下
      default: false,
    },
  },
  data() {
    return {
      selectList: [],
      selectedNum: 0,
    };
  },
  created() {
    const list = this.list;
    list.forEach((item) => {
      this.$set(item, 'isSelect', false); // 依赖收集
      this.$set(item, 'disabled', false);
      this.$set(item, 'loading', false);
    });
    this.selectList = list;
  },
  methods: {
    select: debounce(function selectHandle(item) {
      console.log(item)
      const changeData = [];
      if (item.isSelect) {
        if (this.limit !== 1) {
          this.selectedNum--;
          item.isSelect = false;
          this.selectList.forEach((i) => {
            if (!i.isSelect) {
              i.disabled = false;
            } else {
              changeData.push(i.Code);
            }
          });
        } else {
          changeData.push(item.Code)
        }
        this.$emit('on-change', changeData);
      } else if (this.limit === 1) {
        item.isSelect = true;
        this.selectList.forEach((i) => {
          if (item.Code !== i.Code) {
            i.isSelect = false;
          }
        });
        this.$emit('on-change', [item.Code]);
      } else {
        // 多选模式
        this.selectedNum++;
        if (this.selectedNum < this.limit) {
          item.isSelect = true;
          this.selectList.forEach((i) => {
            if (i.isSelect) {
              changeData.push(i.Code);
            }
          });
          this.$emit('on-change', changeData);
        } else if (this.selectedNum === this.limit) {
          item.isSelect = true;
          this.selectList.forEach((i) => {
            if (!i.isSelect) {
              i.disabled = true;
            } else {
              changeData.push(i.Code);
            }
          });
          this.$emit('on-change', changeData);
        } else {
          this.selectedNum--;
        }
      }
    }, 200, true),
  },

};
</script>
<style lang="less" scoped>
@bubbleSelectColor: #1890ff;
@bubbleBorderColor: #eeeeee;
@bubbleGradientFrom: #1e94fe;
@bubbleGradientTo: #48b1fb;
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.bubble {
  display: flex;
  flex-direction: column;
  height: 100%;
  .px2rem(padding-left, 26);
  .px2rem(padding-right, 26);
  .px2rem(padding-top, 10);
  box-sizing: border-box;
  &--reverse {
    flex-direction: column-reverse;
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  &__list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    .px2rem(height, 120);
    .px2rem(margin-bottom, 45);
    .wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 84%;
      height: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .px2rem(border-radius, 10);
      border: solid 1px @bubbleBorderColor;
      box-shadow: 0 4px 8px 2px rgba(91, 189, 214, 0.06);
      background: #fff;
      color: #333;
      font-size: 15px;
      transition: all 0.1s ease;
      .name {
        position: relative;
      }
      .loading {
        width: 14px;
        height: 14px;
        margin-right: 4px;
      }
    }
    .wrapper--active {
      border: solid 1px transparent;
      background: @bubbleSelectColor;
      // background: linear-gradient(90deg, @bubbleGradientFrom, @bubbleGradientTo);
      color: #fff;
    }
    .wrapper--disabled {
      border: solid 1px #f2f2f2;
      color: #999;
    }
  }
}
</style>
