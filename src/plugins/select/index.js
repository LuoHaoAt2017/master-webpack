// zyq;
// 下拉框
import SelectComponent from '../../components/select/select-panel.vue';
import mergeOptions from '../../lib/plugin-helper';

let $vm;
let watcher;

const plugin = {
  install (vues) {
    const vue = vues;
    const Select = vue.extend(SelectComponent);

    if (!$vm) {
      $vm = new Select({
        el: document.createElement('div'),
      });
      document.body.appendChild($vm.$el);
    }

    const defaults = {};
    for (const i in $vm.$options.props) {
      if (i !== 'value') {
        defaults[i] = $vm.$options.props[i].default;
      }
    }

    const select = {
      show (options = {}) {
        if (watcher) {
          watcher();
        }
        mergeOptions($vm, options);
        $vm.$off('on-cancel');
        $vm.$off('on-confirm');

        $vm.$on('on-cancel', () => {
          if (options && options.onCancel) {
            options.onCancel();
          }
        });
        $vm.$on('on-confirm', (val) => {
          if (options && options.onConfirm) {
            options.onConfirm(val);
          }
        });
        $vm.show = true;
      },
      isShow () {
        return $vm.show;
      },
      hide () {
        $vm.show = false;
      },
    };

    if (!vue.$aut) {
      vue.$aut = {
        select,
      };
    } else {
      vue.$aut.select = select;
    }

    vue.mixin({
      created () {
        this.$aut = vue.$aut;
      },
    });
  },
};

export default plugin;
export const install = plugin.install;
