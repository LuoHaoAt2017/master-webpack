<template>
   <div class="app">
      <button @click="add" class="add-btn">+</button>
      <button @click="remove" class="remove-btn">-</button>
      <transition-group name="slide" tag="ul" class="list-wrapper">
          <li class="list" v-for="(item, index) in lists"  :key="item.code">
              <span class="text">{{item.text}}</span>
          </li>
      </transition-group>
  </div>
</template>

<script>
export default {
  name: 'transition-group-test',
  data() {
    return {
      lists: [
        {
          text: '张三',
          code: 'zs',
        },
        {
          text: '李四',
          code: 'ls',
        },
        {
          text: '王五',
          code: 'ww',
        },
        {
          text: '马六',
          code: 'ml',
        },
      ],
    };
  },
  methods: {
    add() {
      const length = this.lists.length;
      this.lists.push({
        code: `AA${length}`,
        text: `AA${length}`,
      });
    },
    remove() {
      this.lists.splice(0, 1);
    },
  },
};
</script>

<style lang="less">
.list {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
  background: #eee;
  transition: all .4s;
  &.slide-move {
    transition: transform 1s;
  }
  &.slide-enter {
    transform: translate3d(-100%, 0, 0);
  }
  &.slide-leave-active {
    position: absolute;
    transform: translate3d(-100%, 0, 0);
  }
  &:last-child {
    margin-bottom: 0
  }
  .text {
    flex: 1;
    padding-left: 20px;
  }
}
</style>




