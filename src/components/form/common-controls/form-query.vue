<template>
  <ControlWrapper
    class="form-query"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-field
      :class="wrapCls"
      :label="options.DisplayName"
      :tip="options.description"
      :required="editable && options.Required"
      :showIcon="editable"
      :layout="controlLayout"
      @contentClick="chooseItems"
    >
      <p v-if="editable && !value.Name" class="h3-field-placeholder" v-text="value.Name ? '' : placeholder"></p>
      <span
        v-if="value.Name"
        class="h3-field-text"
        :class="{clickable: !editable}"
        @click="selectTagItem(value)"
      >{{ value.Name }}</span>

      <div v-if="editable" slot="extra" class="icon-wapper">
        <span v-if="inputByScan" class="h3-icon aufont h3-icon-scan h3-icon-18 icon-base-scan" @click.stop="scan"></span>
        <i
          v-if="!inputByScan"
          class="h3yun_All form-related-o"
          style="color: #999;"
          @click.stop="chooseItems"
        ></i>
      </div>
    </h3-field>
  </ControlWrapper>
</template>

<script lang="ts">
import { H3Field } from 'h3-mobile-vue';
import { Component, Watch, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import { FormQueryOptions } from '@/lib/form-logic/types/control-options-map';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import ControlWrapper from '../shared/control-wrapper.vue';
import { GetQueryDataByScan, getOriginalUrl } from '../../../service/get-data';

@Component({
  components: {
    H3Field,
    ControlWrapper,
  },
})
export default class FormQuery extends Mixins(baseControler) {
  placeholder:string = '请选择';

  inputByScan:boolean = false;

  // bizObjectId:string = '';

  ObjectId: string = '';

  schemaCode: string = '';

  isSuccessScan: boolean = false; // 是否成功扫码

  options!: FormQueryOptions;

  get wrapCls () {
    return {
      error: this.valid.empty,
    };
  }

  // 分享、外链条件下不支持关联表单跳转
  get isJump (): boolean {
    const responseContext = this.$parent.form.$responseContext;
    return !responseContext.IsExternalForm && !responseContext.IsExternalShare && !responseContext.IsOpenQuery;
  }

  /**
   * 是否外链表单，外链情况下关联表单控件列表只展示标题
  */
  get isExternal () {
    const responseContext = this.$parent.form.$responseContext;
    return responseContext.IsExternalForm || responseContext.IsExternalShare || responseContext.IsOpenQuery;
  }
  get bizObjectId () {
    return (this.$parent as any).bizObjectId;
  }
  @Watch('value.Name')
  valueChanged (val) {
    if (val) {
      this.options.clickedFlag = true;
    }
  }

  created () {
    // this.bizObjectId = this.namespace.split('/')[0];
    // 初始化placeholder
    if (this.options.inputbyscan) {
      this.inputByScan = true;
      this.placeholder = '扫一扫';
    }
    this.schemaCode = this.$parent.form.$responseContext.SchemaCode;
  }

  getAssociationFilterData () {
    // const [bizObjectId,, rowId] = this.namespace.split('/');
    return this.queryFilterData({
      bizObjectId: this.bizObjectId, 
      dataField: this.dataField, 
      rowId: (this.$parent as any).rowId,
    });
  }

  scan () {
    // alert( 'form-query-scan------' );
    H3PluginDeveloper.IScanBarCode(this.scanCallback);
  }

  async getScanSheet (params) {
    const that = this;
    const data = await GetQueryDataByScan(params);
    if (data.Successful) {
      const result = data.ReturnData.Data;
      if (result.rows && result.rows.ReturnData) {
        const items = result.rows.ReturnData;
        if (items && items.length > 1) {
          // 跳转到关联表单页面
        } else if (items && items.length === 1) {
          const currentItem = items[0];
          that.value = { ObjectId: currentItem.ObjectId, Name: currentItem.Name };
          this.isSuccessScan = true;
        } else {
          H3PluginDeveloper.IShowWarn('提示', '没有找到匹配的数据');
        }
      }
    } else {
      H3PluginDeveloper.IShowWarn('提示', '没有找到匹配的数据');
    }
  }

  async chooseItems () {
    this.clearValid();
    if (!this.editable || (this.inputByScan && this.isSuccessScan && !this.options.scanupdateenable)) {
      return;
    }
    setTimeout(async () => {
      const filterDataResult = await this.getAssociationFilterData();
      const sheetdata: string = filterDataResult ? JSON.stringify(filterDataResult) : '{}';
      // 如果在子表中已点击过，则是单选，否则是多选
      const ismultiple:boolean = this.isIngrid && !(this.value && this.value.Name);
      console.log(ismultiple);
      this.$store.state.excludeComp = [];
      console.log('从关联表单控件进入关联表单列表页面', this.isSecondaryForm);
      this.$router.push({
        name: 'formquery',
        params: {
          boschemacode: this.options.boschemacode,
          curcode: this.schemaCode,
          datafield: this.dataField,
          Required: this.options.Required.toString(),
          rowid: '',
          ismultiple: ismultiple.toString(),
          isSingleQuery: 'true',
          sheetdata,
          ObjectId: this.ObjectId,
          value: (this.value && this.value.ObjectId) ? this.value : '',
          namespace: this.namespace,
          bizObjectId: this.bizObjectId,
          isSecondaryForm: this.isSecondaryForm,
          isExternal: this.isExternal.toString(),
        },
      });
    });
  }

  async scanCallback (text) {
    // let scanResult = "https://beta.h3yun.com/mobile/?CorpId=dingdf00f32aeca82bac&sc=s0kv0v2b0744fdtrshg1vadf2l&bo=f8940476-e8e4-4604-b1b8-6b757a099d42&mt=Task&ai=&ao=1";//需要判断是否为二维码接口返回数据转换成对象取ObjectId
    // text = 'https://swork.h3yun.com/su/re/1g3t?engineCode=t0pyfnw9k53ocwir4tkbav932';
    // text = 'https://www.h3yun.com/Mobile/?CorpId=ding421e16868a98af87&sc=olaz1jcwlp0h8d5o1yka703k2&bo=2467fa6c-9314-4034-857f-27090154335b&mt=Task&IsIsv=1';
    if (text.indexOf('/su/re') === -1) {
      const params = await this.handleScanText(text);
      this.getScanSheet(params);
      return;
    }
    const me = this;
    me.getOriginalUrlAsync(text, async (originalUrl) => {
      const params = await me.handleScanText(originalUrl);
      me.getScanSheet(params);
    }, async () => {
      const params = await me.handleScanText(text);
      me.getScanSheet(params);
    });
  }

  async handleScanText (scanResult) {
    // 是否关联表单
    let isQrcode = false;
    if (scanResult.indexOf('mobile/?') > -1 || scanResult.indexOf('mobile/') > -1 ||
      scanResult.indexOf('Mobile/') > -1) {
      isQrcode = true;
    }
    // 设置生效数据、可读权限范围查询
    const filterDataResult = await this.getAssociationFilterData();
    const SheetData = filterDataResult ? JSON.stringify(filterDataResult) : '{}';
    const SchemaCode = this.$parent.form.$responseContext.SchemaCode;
    const params = {
      ActionName: 'GetAppDatas',
      DataField: this.dataField,
      ID: this.options.boschemacode,
      SheetCode: SchemaCode,
      Status: 1,
      scopeType: 3,
      searchParamsJson: {},
      SheetData,
      SheetQuery: 'SheetQuery',
    };
    if (isQrcode) {
      // 二维码
      // 此时已经登陆，分析字符串获取bizobjectid 和schemaCode
      const reg = new RegExp('(^|&)bo=([^&]*)(&|$)');
      const urlSearch = scanResult.split('?')[1];

      const r = urlSearch.match(reg);
      let bizObjectId = '';
      if (r != null) bizObjectId = r[2];
      params.searchParamsJson = JSON.stringify({ ObjectId: [bizObjectId] });
    } else {
      // 条形码 匹配ObjectID
      // 查询关联表单数据
      params.searchParamsJson = JSON.stringify({ ObjectId: [scanResult] });
    }
    return params;
  }

  async getOriginalUrlAsync (shortUrl, success, error) {
    const result = await getOriginalUrl(shortUrl);
    if (result.Successful) {
      success(result.ReturnData.OriginalUrl);
    } else {
      error();
    }
  }

  selectTagItem (item) {
    if (this.editable) {
      return;
    }
    // 编辑或新增模式不允许查看
    const mode = this.$parent.form.$responseContext.FormMode;
    if (mode === 0 || mode === 2) {
      return;
    }
    if (!this.isJump) {
      H3PluginDeveloper.IShowWarn('提示', '无权查看数据');
      return;
    }
    this.$router.push({
      name: 'formPage',
      params: {
        schemaCode: this.options.boschemacode,
        bizObjectId: item.objectId,
      },
      query: {
        refleshRoute: '1',
        schemaCode: this.options.boschemacode,
        bizObjectId: item.ObjectId || item.objectId,
        reScroll: '1',
      },
    });
  }
}
</script>

<style lang="less">
  @import '~@/styles/form-base.less';
  @baseFontSize: 75;
  .px2rem(@name,@px) {
      @{name}: @px/@baseFontSize * 1rem;
  }
  .form-query {
    .h3-field-text{
      box-sizing: border-box;
      display: inline-block;
      .px2rem(padding-left, 16);
      .px2rem(padding-right, 16);
      font-size: 15px;
      .px2rem(border-radius, 6);
      background-color: #F5F5F5;
      &.clickable{
        color: #1890FF;
      }
    }
    .icon-wapper{
      display: inline-block;
      //width: 30px;
      text-align: center;
      .h3-icon-scan{
        color: #888;
      }
    }
  }
</style>
