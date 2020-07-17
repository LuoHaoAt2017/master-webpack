<template>
  <div class="guide-rank">
    <div
      class="star"
      v-for="(item, index) in starContainer"
      :key="index"
    >
      <img
        src="../../assets/img/star-empty.png"
        class="star--bg"
        v-if="item.status === 'empty'"
      >
      <img
        src="../../assets/img/star-half.png"
        class="star--bg"
        v-if="item.status === 'half'"
      >
      <img
        src="../../assets/img/star-full.png"
        class="star--bg"
        v-if="item.status === 'full'"
      >
    </div>
  </div>
</template>
<script>

export default {
  name: 'guide-rank',
  props: {
    fullScore: {
      type: [Number, String],
      default: 5,
    },
    rank: {
      type: [Number, String],
      default: 0,
    },
  },
  watch: {
    rank(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.starContainer = [];
        this.calc();
      }
    },
  },
  data() {
    return {
      starContainer: [],
    };
  },
  created() {
    this.calc();
  },
  methods: {
    calc() {
      const rank = this.rank;
      const floor = Math.floor(rank);
      const offset = rank - floor;
      let need;
      let lastIndex;
      let lastType;
      if (offset >= 0.5) {
        need = floor + 0.5;
        lastIndex = floor;
        lastType = 'half';
      } else {
        need = floor;
        lastIndex = floor - 1;
        lastType = 'full';
      }
      for (let i = 0, len = this.fullScore; i < len; i++) {
        if (i < lastIndex) {
          this.starContainer.push({
            status: 'full',
          });
        } else if (i === lastIndex) {
          this.starContainer.push({
            status: lastType,
          });
        } else {
          this.starContainer.push({
            status: 'empty',
          });
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.guide-rank {
  display: flex;
  .star {
    .px2rem(width, 26);
    .px2rem(margin-right, 6);
    &--bg {
      width: 100%;
    }
  }
}
</style>
