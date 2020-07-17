import BaseOptions from './base-options';

/** 单行文本*/
export default class FormTextBoxOptions extends BaseOptions {
	/** 是否允许重复录入*/
  norepeat: string = '';

	/** 文本格式*/
  mode: string = '';

	/** 是否允许扫码输入*/
  inputbyscan: boolean = false;

	/** 是否可修改扫码结果*/
  scanupdateenable: boolean = false;

	/** 默认选项，单行文本确定需要这个选项？未来可能会弃用*/
  defaultitems: string = '';

	/** 是否映射属性*/
  ismappingproperty: string = '';

	/** 作为关联表单搜索项*/
  asfilter: string = '';

	/** 提示语*/
	placeholder: string = '';

  merge(dataset: any) {
    this.inputbyscan = dataset.inputbyscan === 'true' || dataset.inputbyscan === true;
    this.scanupdateenable = dataset.scanupdateenable === 'true' || dataset.scanupdateenable === true;
  }
}
