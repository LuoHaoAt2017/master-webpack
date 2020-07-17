import BaseOptions from './base-options';

/** 地址*/
export default class FormAreaSelectOptions extends BaseOptions {
	/** 格式*/
	areamode: string = '';
	/** 显示详细地址*/
	showdetailaddr: boolean = false;

  merge(dataset: any){
    // 转换属性的类型
    this.showdetailaddr =
      dataset.showdetailaddr === 'true' || dataset.showdetailaddr === null || (dataset.showdetailaddr === true || false);
  }
}
