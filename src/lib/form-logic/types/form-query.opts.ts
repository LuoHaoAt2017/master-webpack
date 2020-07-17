import BaseOptions from './base-options';
import { jsonParse } from '../utils';

interface Filter {
  Rule?: string
}

/** 关联表单*/
export default class FormQueryOptions extends BaseOptions {
	/** 关联表单*/
	boschemacode: string = '';
	/** 数据范围限定*/
	associationfilter: Filter = {};
	/** 允许扫码输入*/
	inputbyscan: boolean = false;
	/** 允许手动修改扫码结果*/
	scanupdateenable: boolean = false;
	/** 关联表单名称*/
	boschemaname: string = '';
	/** 是否列表视图*/
	islistview: string = '';
	/** 关联配置*/
	mappingcontrols: string = '';
	/** 关联属性*/
	mappingproperties: string = '';
	/** 是否多选*/
	ismultiple: string = '';
	/** 关联表单信息*/
	boschemainfo: string = '';
	/** 关联表单过滤*/
	bofilter: Filter = {};
	/** 在子表中已点击过 (自定义)*/
  clickedFlag: boolean = false;

  merge(dataset: any) {
    this.inputbyscan = dataset.inputbyscan === 'true' || dataset.inputbyscan === true;
    this.scanupdateenable = dataset.scanupdateenable === 'true' || dataset.scanupdateenable === true;
    this.associationfilter = dataset.associationfilter ? jsonParse(dataset.associationfilter) : {}
    this.bofilter = dataset.bofilter ? jsonParse(dataset.bofilter) : {}
	}
  mergeJson(dataset: any) {
    let associationfilter = dataset.associationfilter
    let bofilter = dataset.bofilter
    if(associationfilter && typeof associationfilter === 'string'){
      associationfilter = jsonParse(associationfilter)
    }
    if(bofilter && typeof bofilter === 'string'){
      bofilter = jsonParse(bofilter)
    }
    this.associationfilter = associationfilter ? associationfilter : {}
    this.bofilter = bofilter ? bofilter : {}
  }
}
