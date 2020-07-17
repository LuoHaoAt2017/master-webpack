<template>
  <div class="search-history">
    <div class="head-wrap">
      <ul>
        <li>搜索记录</li>
        <li class="clear-botton" @click="clearHistory">
          <h3-icon type="delete"></h3-icon>记录</li>
      </ul>
    </div>
    <div class="content-wrap">
      <ul>
        <li v-for="(item, index) in getHistoryItems" @click.stop="chooseItem(item)">
          <div class="list-item">
            <span class="item-name">{{item}}</span>
            <div class="icon-wrap" @click.stop="delHistory(index, item)">
              <h3-icon type="close"></h3-icon>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import h3Icon from '../../components/h3-icon/index.vue';

export default {
  name: 'searchHistory',
  components: {
    h3Icon,
  },
  props: {
    historyItems: Array,
  },
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.items = this.historyItems;
  },
  methods: {
    delHistory(idx, item) {
      this.getHistoryItems.splice(idx, 1);
      this.items = this.getHistoryItems;
      this.$emit('delHistoryItem', item);
    },
    clearHistory() {
      this.items = [];
      this.$emit('clearHistoryItems', true);
    },
    chooseItem(item) {
      this.$emit('chooseHistoryItem', item);
    },
  },
  computed: {
    getHistoryItems() {
      const ops = [];
      if (Array.isArray(this.items)) {
        this.items.forEach((value) => {
          const isString = Object.prototype.toString.call(value).toLowerCase() === '[object string]';
          if (isString) {
            ops.push(value);
          }
        });
      }
      return ops;
    },
  },
};
</script>
<style lang="less">
@import "../../styles/mixins";
@import "../../styles/themes/default";
@import "../../styles/h3-ui/h3-list";

.search-history{
  .head-wrap{
    width: 100%;
    height: 40 * @hd;
    background-color: #f8f8f8;
    ul{
      display: flex;
      justify-content: space-between;
      padding-left: @h-spacing-lg;
      padding-right: @h-spacing-lg;
      padding-top: @v-spacing-lg;
      color: @color-text-gray;
      font-size: @font-size-caption-sm;
    }
  }
  .content-wrap{
    width: 100%;
    ul{
      li{
        height: 44 * @hd;
        border-bottom: 1px solid @border-color-light;
      }
      .list-item{
        height: 100%;
        padding-left: @h-spacing-lg;
        padding-right: 10 * @hd;
        display: flex;
        justify-content: space-between;
        color: #666;
        align-items: center;
        .icon-wrap{
          width: 40 * @hd;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>


