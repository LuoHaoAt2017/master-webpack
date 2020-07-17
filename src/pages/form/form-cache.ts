/**
 * @author YJH
 * @description 表单数据缓存
 */
import {
  Vue, Component
} from 'vue-property-decorator';
import Form = H3.Form;
import { jsonParse } from '@/utils';
import { State } from 'vuex-class';

const Constants = {
  MaxFormNumber: 50,
  TimeStampName: 'TimeStamp',
  FormContentName: 'FormContent',
  SchemaCodeName: 'SchemaCode',
  JavascriptName: 'Javascript',
};

@Component
export default class FormCache extends Vue {

  @State('engineCode')
  engineCode

  private RuntimeCacheKey: string;

  private FormCache: Form.RuntimeCache = {
    Queue: [],
    Map: {},
  };

  private PageDataTrack: Form.PageDataTrack = {};

  created() {
    this.RuntimeCacheKey = `FormRuntimeCache-${this.engineCode}`;
    const FormCacheStr = window.localStorage.getItem(this.RuntimeCacheKey);
    if (FormCacheStr) {
      const FormContent: Form.RuntimeCache = jsonParse(FormCacheStr);
      if (FormContent) {
        this.FormCache = FormContent;
      }
    }
  }

  $setRuntimeCache(code: string, cacheContent: Form.SchemaCache) {
    this.FormCache.Map[code] = cacheContent;
    const length = this.FormCache.Queue.push(code);
    if (length > Constants.MaxFormNumber) {
      const top = this.FormCache.Queue.shift();
      delete this.FormCache.Map[top];
    }
    const cacheStr = JSON.stringify(this.FormCache);
    window.localStorage.setItem(this.RuntimeCacheKey, cacheStr);
  }

  $getRuntimeCache(code: string): Form.SchemaCache {
    if (this.FormCache && this.FormCache.Map[code]) {
      return this.FormCache.Map[code];
    }
    return null;
  }

  $setDataCache(cacheKey: string, cacheContent: Form.DataCache) {
    this.PageDataTrack[cacheKey] = cacheContent;
  }

  $getDataCache(cacheKey: string): Form.DataCache {
    return this.PageDataTrack[cacheKey];
  }

  $delDataCache(cacheKey: string): boolean {
    if (this.PageDataTrack[cacheKey]) {
      return delete this.PageDataTrack[cacheKey];
    }
    return false;
  }
}