<template>
  <div v-show="formVal.IsDisplay" class="bd-bot chk-list">
    <div class="param-title">
      <div>{{ formVal.DisplayName }}</div>
    </div>
    <div class="param-value" @click="showSelectPanel">
      <span v-if="selected.length === 0">{{ placeHolder }}</span>
      <div v-if="selected.length > 0" class="chk-wrapper">
        <div v-for="(item,index) in selected" :key="index" class="chk-item">
          {{ item.Text }}
        </div>
      </div>
      <div class="icon h3yun_All right-o"></div>
    </div>
  </div>
</template>

<script>
// zyq;
export default {
  name: 'FormCheckboxList',
  props: ['formVal'],
  data () {
    return {
      placeHolder: '请选择',
      selected: [],
      formatDefaultItems: [],
      backUpValue: null,
    };
  },
  created () {
    this.init();
  },
  mounted () {
    // this.$store.state.readyFiltersCount++;
  },
  methods: {
    init () {
      if (this.formVal.DataType !== 1) {
        this.formatDefaultItems.push({
          Value: '--',
          Text: '--(空值)',
        });
      }
      if (this.formVal.DefaultItems) {
        for (const item of this.formVal.DefaultItems) {
          if (item.constructor === String) {
            this.formatDefaultItems.push({
              Value: item,
              Text: item,
            });
          } else {
            this.formatDefaultItems.push({
              Value: item.Value,
              Text: item.Text,
            });
          }
        }
      }
      this.setValue(this.formVal.DefaultValue);
    },
    getValue () {
      this.backUpValue = null;
      const res = [];
      for (const item of this.selected) {
        // res.push(encodeURIComponent(item.Value));
        res.push(item.Value);
      }
      return res;
    },
    setValue (val) {
      if (!val) {
        return;
      }
      if (val.constructor === String) {
        const tmp = val.split(';');
        const res = [];
        if (this.formVal.IsRadio) {
          for (const item of tmp) {
            if (item === 'false') {
              res.push({ Text: '否', Value: false });
            } else {
              res.push({ Text: '是', Value: true });
            }
          }
        } else {
          for (const item of tmp) {
            res.push({ Text: item, Value: item });
          }
        }

        this.selected = res;
      } else {
        this.selected = val;
      }
      const that = this;
      setTimeout(() => {
        that.$root.eventHub.$emit('refreshScroll', 'checkbox');
      }, 300);
    },
    reset () {
      this.backUpValue = this.selected;
      this.selected = [];
    },
    rollBack () {
      if (this.backUpValue) {
        this.selected = this.backUpValue;
      }
    },
    showSelectPanel () {
      const that = this;
      let datafield = this.formVal.DataField;
      if (
        this.formVal.BOSchemaCode &&
        this.formVal.DataField.indexOf('_') > -1
      ) {
        datafield = this.formVal.DataField.split('_')[1];
      }
      // 区分子表控件--schemaCode传子表id
      if (this.formVal.BOSchemaCode && this.formVal.DataField.indexOf('.') > -1) {
        this.formVal.BOSchemaCode = this.formVal.DataField.split('.')[0];
      }
      this.$aut.select.show({
        display: this.formVal.DisplayName,
        items: this.formatDefaultItems,
        value: this.selected,
        radio: this.formVal.IsRadio,
        schemaCode: this.formVal.BOSchemaCode,
        field: this.formVal.AssociationField,
        filter: this.formVal.AssociationFilter,
        datafield, // this.formVal.DataField,
        onConfirm (val) {
          that.setValue(val);
        },
      });
    },
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.chk-list {
  position: relative;
  .px2rem(padding,24);
  display: flex;
  align-items: flex-start;
  .icon {
    position: absolute;
  }
}
.chk-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  div.chk-item {
    .px2rem(margin-right,14);
    .px2rem(margin-bottom,20);
    .px2rem(padding-left,20);
    .px2rem(padding-right,20);
    .px2rem(height,42);
    .px2rem(line-height,42);
    .px2rem(border-radius,10);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid #467db9;
    .px2rem(font-size,24);
    color: #467db9;
  }
}
</style>
