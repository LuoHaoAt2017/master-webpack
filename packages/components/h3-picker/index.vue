<template>
  <div class="h3-picker">
    <h3-flexbox :gutter="0">
      <h3-flexbox-item :span="columnWidth && columnWidth[index]" v-for="(one, index) in currentData" :key="index" style="margin-left:0;">
        <div class="h3-picker-item" :id="`h3-picker-${uuid}-${index}`"></div>
      </h3-flexbox-item>
    </h3-flexbox>
  </div>
</template>

<script>
import Scroller from '../../utils/picker/anima-scroller';
import { H3Flexbox, H3FlexboxItem } from '../h3-flexbox';
import Manager from '../../utils/picker/chain';
import value2name from '../../filters/value2name';
import isArray from '../../utils/is-array';

export default {
  name: 'picker',
  components: {
    H3Flexbox,
    H3FlexboxItem,
  },
  created() {
    if (this.columns !== 0) {
      const length = this.columns;
      this.store = new Manager(this.data, length, this.fixedColumns);
      this.currentData = this.store.getColumns(this.value);
    }
  },
  mounted() {
    this.uuid = Math.random().toString(36).substring(3, 8);
    this.$nextTick(() => {
      this.render(this.currentData, this.currentValue);
    });
  },
  props: {
    data: Array,
    columns: {
      type: Number,
      default: 0,
    },
    fixedColumns: {
      type: Number,
      default: 0,
    },
    value: Array,
    itemClass: {
      type: String,
      default: 'scroller-item',
    },
    columnWidth: Array,
  },
  methods: {
    getNameValues() {
      return value2name(this.currentValue, this.data);
    },
    getId(i) {
      return `#h3-picker-${this.uuid}-${i}`;
    },
    render(data, value) {
      this.count = this.currentData.length;
      const self = this;
      if (!data || !data.length) {
        return;
      }
      const count = this.currentData.length;
      // set first item as value
      if (value.length < count) {
        for (let i = 0; i < count; i += 1) {
          if (process.env.NODE_ENV === 'development' &&
            typeof data[i][0] === 'undefined' &&
            isArray(this.data) &&
            this.data[0] &&
            typeof this.data[0].value !== 'undefined' &&
            !this.columns) {
            console.error('[h3 error] 渲染出错，如果为联动模式，需要指定 columns(列数)');
          }
          this.$set(self.currentValue, i, data[i][0].value || data[i][0]);
        }
      }

      for (let i = 0; i < data.length; i += 1) {
        /**
        * Still don't know why this happens
        */
        if (!document.querySelector(self.getId(i))) {
          return;
        }
        if (self.scroller[i]) {
          self.scroller[i].destroy();
        }
        self.scroller[i] = new Scroller(self.getId(i), {
          data: data[i],
          defaultValue: value[i] || data[i][0].value,
          itemClass: self.item_class,
          onSelect(val) {
            self.$set(self.currentValue, i, val);
            if (!this.columns || (this.columns && self.getValue().length === self.store.count)) {
              self.$nextTick(() => {
                self.$emit('on-change', self.getValue());
              });
            }
            if (self.columns !== 0) {
              self.renderChain(i + 1);
            }
          },
        });
        if (self.currentValue) {
          self.scroller[i].select(value[i]);
        }
      }
    },
    renderChain(i) {
      if (!this.columns) {
        return;
      }

      // do not render for last scroller
      if (i > this.count - 1) {
        return;
      }

      const self = this;
      const ID = this.getId(i);
      // destroy old one
      this.scroller[i].destroy();
      const list = this.store.getChildren(self.getValue()[i - 1]);
      this.scroller[i] = new Scroller(ID, {
        data: list,
        itemClass: self.item_class,
        onSelect(value) {
          self.$set(self.currentValue, i, value);
          self.$nextTick(() => {
            self.$emit('on-change', self.getValue());
          });
          self.renderChain(i + 1);
        },
      });
      // list is Array(empty) as maybe
      if (list.length) {
        this.$set(this.currentValue, i, list[0].value);
        this.renderChain(i + 1);
      } else {
        this.$set(this.currentValue, i, null);
      }
    },
    getValue() {
      const data = [];
      for (let i = 0; i < this.currentData.length; i += 1) {
        if (this.scroller[i]) {
          data.push(this.scroller[i].value);
        } else {
          return [];
        }
      }
      return data;
    },
    emitValueChange(val) {
      if (!this.columns || (this.columns && val.length === this.store.count)) {
        this.$emit('on-change', val);
      }
    },
  },
  data() {
    return {
      scroller: [],
      count: 0,
      uuid: '',
      currentData: this.data,
      currentValue: this.value,
    };
  },
  watch: {
    value(val) {
      if (JSON.stringify(val) !== JSON.stringify(this.currentValue)) {
        this.currentValue = val;
      }
    },
    currentValue(val, oldVal) {
      this.$emit('input', val);
      // render all the scroller for chain datas
      if (this.columns !== 0) {
        if (val.length > 0) {
          if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
            this.currentData = this.store.getColumns(val);
            this.$nextTick(() => {
              this.render(this.currentData, val);
            });
          }
        }
      } else if (val.length) {
        for (let i = 0; i < val.length; i += 1) {
          if (this.scroller[i] && this.scroller[i].value !== val[i]) {
            this.scroller[i].select(val[i]);
          }
        }
      } else {
        this.render(this.currentData, []);
      }
    },
    data(val) {
      if (JSON.stringify(val) !== JSON.stringify(this.currentData)) {
        this.currentData = val;
      }
    },
    currentData(newData) {
      if (Object.prototype.toString.call(newData[0]) === '[object Array]') {
        this.$nextTick(() => {
          this.render(newData, this.currentValue);
          // emit on-change after rerender
          this.$nextTick(() => {
            this.emitValueChange(this.getValue());

            if (JSON.stringify(this.getValue()) !== JSON.stringify(this.currentValue)) {
              if (!this.columns || (this.columns && this.getValue().length === this.store.count)) {
                this.currentValue = this.getValue();
              }
            }
          });
        });
      } else if (this.columns !== 0) {
        if (!newData.length) {
          return;
        }
        const length = this.columns;
        this.store = new Manager(newData, length, this.fixedColumns);
        this.currentData = this.store.getColumns(this.currentValue);
      }
    },
  },
  beforeDestroy() {
    for (let i = 0; i < this.count; i += 1) {
      if (this.scroller[i]) {
        this.scroller[i].destroy();
      }
      this.scroller[i] = null;
    }
  },
};
</script>

<style lang="less">
@import '../../styles/mixins.less';
@import './style/index.less';
</style>

