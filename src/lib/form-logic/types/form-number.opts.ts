import BaseOptions from './base-options';

/** 数字*/
export default class FormNumberOptions extends BaseOptions {
	/** 小数位数*/
	decimalplaces: number = 0;
	/** 百分比*/
	percentage: boolean = false;
	/** 显示模式*/
	showmode: string = '';
	/** 占位符 */
	placeholder: string = '';

	merge(dataset: any) {
		this.decimalplaces = Number(dataset.decimalplaces);
		if(this.decimalplaces === -1){
      this.decimalplaces = 0
    }
		// 转换属性的类型
		this.percentage = dataset.percentage === 'true' || dataset.percentage === null || (dataset.percentage === true || false);
	}

  mergeJson(dataset: any) {
    // 转换属性的类型
    this.merge(dataset)
    dataset.decimalplaces = dataset.decimalplaces === -1 ? 0 : Number(dataset.decimalplaces)
  }
}
