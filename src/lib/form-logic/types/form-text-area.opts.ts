import BaseOptions from './base-options';

/** 多行文本*/
export default class FormTextAreaOptions extends BaseOptions {
	/** 可见行数*/
	rows: string = '';
	/** 占位提示语*/
	placeholder: string = '';
  /** 范围*/
  Range: string = '';
  /** 区域显示模式*/
  areamode: string = '';
  /** 是否显示详情地址*/
  showdetailaddr: boolean = false;

  merge(dataset: any){
    // 转换属性的类型
    this.showdetailaddr = dataset.showdetailaddr === 'true';
  }
}
