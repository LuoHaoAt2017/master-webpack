import BaseOptions from './base-options';

/** 单选框*/
export default class FormRadioButtonListOptions extends BaseOptions {
  /** 移动端显示模式*/
  selectshowmode: string = '0';

  /** 绑定数据字典*/
  datadictitemname: string = '';

  /** 选项默认*/
  defaultItems: any[] = [];

  /** 默认值*/
  defaultvalue: string = '';

  merge(dataset: any){
    // 转换属性的类型
    let defaultItems: any[]|string = []
    if (
      dataset.datadictitemname != null &&
      dataset.DataDictItemValue != null &&
      dataset.DataDictItemValue !== undefined
    ) {
      defaultItems = dataset.DataDictItemValue;
    } else {
      defaultItems = dataset.defaultitems;
      if (defaultItems !== '' && defaultItems !== undefined) {
        defaultItems = eval(defaultItems as string);
      }
    }
    const tmp: any[] = [];
    if(typeof defaultItems === 'string'){
      defaultItems = defaultItems.split(',')
    }
    for (let i = 0; i < defaultItems.length; i += 1) {
      if (!defaultItems[i].Value) {
        const val = defaultItems[i];
        tmp.push({ Value: val, Text: val });
      } else {
        tmp.push(defaultItems[i]);
      }
    }
    this.defaultItems = tmp;
  }
  mergeJson(json) {
    this.merge(json)
  }
}
