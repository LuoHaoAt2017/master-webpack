// 所有控件的公用方法，计算规则，隐藏规则
import { Vue, Component } from 'vue-property-decorator';
import H3PluginDeveloper from '../lib/h3-plugins-developer';
import { getLastBizObjectIdBySchema } from '../service/get-data';

//   Application = 190,
//   Form = 200,
//   Scheme = 210,
//   Report = 220, 报表
//   Group = 230,
//   NoListForm = 240, 单表模式
//   Custom = 300
//   dashbord = 270

@Component
export default class OpenFormMixin extends Vue {

  /**
   * 打开表单逻辑判断
   * @param schema 表单数据
   * @param fromHome 是否是从首页进入/快速进入到表单
   */
  openForm(schema: H3.App.SchemaListItem, fromHome: string) {
    if (fromHome && !schema.BeCreated) {
      H3PluginDeveloper.IShowTip('提示', '没有权限');
      return;
    }
    if (schema.NodeType === 270) {
      // 去到仪表盘
      this.$router.push({
        name: 'dashboard',
        query: {
          reportId: schema.Code,
          AppCode: schema.AppCode
        }
      });

    } else if (schema.NodeType === 220) {
      // 打开报表
      this.$router.push({
        name: 'report',
        params: {
          reportCode: schema.Code,
          AppCode: schema.AppCode
        }
      });
    } else if (schema.NodeType === 240) {
      // 打开单表模式表单
      this.goToSingleFormPage(schema.Code, fromHome);
    } else if (fromHome === '1') {
      // 打开表单 立即新建表单
      this.$router.push({
        name: 'formPage',
        params: {
        schemaCode: schema.SchemaCode,
        },
        query: {
            schemaCode: schema.SchemaCode,
            fromHome,
        },
      });
    } else {
      // 打开列表
      const appCode = schema.AppCode;
      const schemaCode = schema.Code;
      const appName = schema.DisplayName;
      this.$root.eventHub.$emit('query-lists');
      this.$router.push({
        name: 'list',
        params: { appCode, schemaCode, appName },
        query: { schemaCode },
      });
    }
  }

  /**
   * 请求并打开单表模式表单
   * @param schema 表单数据
   * @param fromHome 是否是从首页进入/快速进入
   */
  async goToSingleFormPage(schemaCode: string, fromHome: string) {
    const data = await getLastBizObjectIdBySchema(schemaCode);
    if (data.Successful) {
      const objectId = data.ReturnData.Data.BizObjectId;
      this.$router.push({
          name: 'formPage',
          params: {
              schemaCode,
              bizObjectId: objectId,
              showList: 'false',
          },
          query: {
              fromHome,
              schemaCode,
              bizObjectId: objectId
          }
      });
    } else {
      this.$router.push({
          name: 'formPage',
          params: {
            schemaCode,
            showList: 'false'
          },
          query: {
              fromHome,
              schemaCode,
          }
      });
    }
  }

}
