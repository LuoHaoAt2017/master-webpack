import BaseOptions from './base-options';
import { jsonParse } from '../utils';

interface Filter {
  Rule?: string
}

/** 下拉框*/
export default class FormDropDownListOptions extends BaseOptions {
	/** 移动端显示模式*/
	selectshowmode: string = '0';
	/** 数据来源*/
	datasource: string = '';
	/** 绑定数据字典*/
	datadictitemname: string = '';
	/** 默认选项*/
	defaultItems: any[] = [];
	/** 默认选项原始值*/
	defaultitems: string = '';
	/** 默认值*/
	defaultvalue: string = '';
	/** 关联表单编码*/
	boschemacode: string = '';
	/** 关联字段*/
	mappingfield: string = '';
	/** 数据范围限定*/
	associationfilter: Filter = {};
	/** 过滤查询条件 */
	filterRule: string = '';

  merge(dataset: any) {
    this.associationfilter = dataset.associationfilter ? jsonParse(dataset.associationfilter) : {}
	}
  mergeJson(dataset: any) {
    let associationfilter = dataset.associationfilter
    if(associationfilter && typeof associationfilter === 'string'){
      associationfilter = jsonParse(associationfilter)
    }
    this.associationfilter = associationfilter ? associationfilter : {}
  }
}
