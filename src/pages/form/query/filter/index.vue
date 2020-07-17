<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import QueryFilterText from './query-text.vue';
import QueryFilterSelect from './query-select.vue';
import QueryFilterMultiSelect from './query-multi-select.vue';
import QueryFilterDate from './query-date.vue';
import QueryFilterAreaSelect from './query-areaselect.vue';

@Component({
  name: 'query-filter',
  components: {
    QueryFilterText,
    QueryFilterSelect,
    QueryFilterDate,
    QueryFilterAreaSelect,
    QueryFilterMultiSelect,
  },
})
export default class QueryFilter extends Vue {
  @Prop()
  columns!: any[];

  @Prop()
  controls!: any;

  @Prop() isCollapsed!: boolean;

  @Prop() hasError!: boolean;

  get formatQueryColumns () {
    const ret = [];
    this.columns.forEach((col) => {
      const control = this.controls[col];
      if (control) {
        ret.push(control);
      }
    });
    return ret;
  }

  get queryValueMap () {
    const ret = {};
    this.columns.forEach(col => {
      ret[col] = '';
    });
    return ret;
  }

  change (dataField, val) {
    this.queryValueMap[dataField] = val;
    this.$emit('change', this.queryValueMap);
  }

  render () {
    const self = this;
    const h = this.$createElement;
    const childrens = [];
    this.formatQueryColumns.forEach(col => {
      if (col) {
        const controlKey = col.controlKey;
        // FormFormula 特殊处理
        switch (controlKey) {
          case 'FormTextBox':
          case 'FormTextArea':
          case 'FormNumber':
          case 'FormSeqNo':
          case 'FormQuery':
            childrens.push(h('QueryFilterText', {
              props: {
                dataField: col.dataField,
                title: col.displayName,
                hasError: self.hasError,
              },
              on: {
                change: (dataField, val) => {
                  self.change(dataField, val);
                },
              },
            }));
            break;
          case 'FormDateTime':
          case 'FormCreatedTime':
          case 'FormModifiedTime':
            childrens.push(h('QueryFilterDate', {
              props: {
                dataField: col.dataField,
                title: col.displayName,
                mode: col.options.datetimemode || col.options.DateTimeMode,
                hasError: self.hasError,
              },
              on: {
                change: (dataField, val) => {
                  self.change(dataField, val);
                },
              },
            }));
            break;
          case 'FormDropDownList':
            childrens.push(h('QueryFilterSelect', {
              props: {
                dataField: col.dataField,
                title: col.displayName,
                options: col.options.defaultitems || col.options.DefaultItems,
                hasError: self.hasError,
              },
              on: {
                change: (dataField, val) => {
                  self.change(dataField, val);
                },
              },
            }));
            break;
          case 'FormCheckboxList':
            childrens.push(h('QueryFilterMultiSelect', {
              props: {
                dataField: col.dataField,
                title: col.displayName,
                options: col.options.defaultitems || col.options.DefaultItems,
                hasError: self.hasError,
              },
              on: {
                change: (dataField, val) => {
                  self.change(dataField, val);
                },
              },
            }));
            break;
          case 'FormAreaSelect':
            childrens.push(h('QueryFilterAreaSelect', {
              props: {
                dataField: col.dataField,
                title: col.displayName,
                mode: col.options.areamode || col.options.AreaMode,
                hasError: self.hasError,
              },
              on: {
                change: (dataField, val) => {
                  self.change(dataField, val);
                },
              },
            }));
            break;
        }
      }
    });

    return h('div', {
      class: [
        'open-query-filter',
      ],
    }, childrens);
  }
}
</script>

<style lang="less" scoped>
</style>
