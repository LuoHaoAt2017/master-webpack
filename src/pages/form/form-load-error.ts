/**
 * 表单数据加载错误
*/
import { Vue, Component } from 'vue-property-decorator';
import { closeApp } from '../../config/dingtalk-interface';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';

@Component
export default class FormLoadedError extends Vue {
  rules = [
    {
      match: () => {
        const { schemaCode, enableAssociation } = window.GlobalConfig;
        if (schemaCode || enableAssociation) { // || (!schemaCode && !enableAssociation)
          return true;
        }
      },
      action: (res) => {
        H3PluginDeveloper.IShowTip(
          '提示',
          res.ErrorMessage,
          () => {
            closeApp();
          },
          '3000',
        );
      },
    },
    {
      match: () => {
        return true;
      },
      action: (res, that) => {
        const msg = res.ErrorMessage || res.errorMsg || res.errorMessage;
        if (msg) {
          H3PluginDeveloper.IShowTip('提示', msg, () => { that.$router.goBack(); }, '3000');
        }
        // this.$router.goBack();
      },
    },
  ];

  /**
   * 表单数据加载失败
  */
  formLoadErrorHandler (res, that) {
    for (const rule of this.rules) {
      if (rule.match()) {
        rule.action(res, that);
        return;
      }
    }
  }
}
