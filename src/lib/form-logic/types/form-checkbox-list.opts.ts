import BaseOptions from './base-options';

/** 复选框*/
export default class FormCheckboxListOptions extends BaseOptions {
	/** 移动端显示模式*/
	selectshowmode: string = '0';
	/** 绑定数据字典*/
	datadictitemname: string = '';
  /** 选项*/
  defaultitems: string | any[] = '';
	/** 选项*/
	defaultItems: any[] = [];
	/** 默认值*/
	defaultvalue: string = '';
	/** 模式*/
	ischeckbox: string = '';
	/** 关联表单*/
	boschemacode: string = '';
	/** 关联字段*/
	mappingfield: string = '';
	/** 表单过滤条件*/
	associationfilter: string = '';

  merge(dataset: any){
    // 转换属性的类型
    if (
      dataset.datadictitemname != null &&
      dataset.DataDictItemValue != null &&
      dataset.DataDictItemValue !== undefined
    ) {
      dataset.defaultItems = dataset.DataDictItemValue;
    } else {
      dataset.defaultItems = dataset.defaultitems;
      if (dataset.defaultItems !== '' && dataset.defaultItems !== undefined) {
        dataset.defaultItems = eval(dataset.defaultItems);
      }
    }
    const tmp: any[] = [];
    let defaultItems: any = dataset.defaultitems
    if(typeof defaultItems === 'string'){
      defaultItems = JSON.parse(defaultItems) || dataset.defaultItems.split(',')
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
    //this.defaultItems = this.defaultitems as any[] || [];
  }
}
