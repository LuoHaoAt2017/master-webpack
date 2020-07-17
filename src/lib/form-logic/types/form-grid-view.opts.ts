import BaseOptions from './base-options';

/** 子表*/
export default class FormGridViewOptions extends BaseOptions {
	/** 数据标题*/
	nameitems: string = '';
	/** 子*/
	children: string = '';
	/** 显示模式*/
	displayMode: string = '';
	/** 移动端显示字段*/
	displayFields: string = '';
}