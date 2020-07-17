import BaseOptions from './base-options';

/** 流水号*/
export default class FormSeqNoOptions extends BaseOptions {
	/** 日期格式*/
	datetimemode: string = '';
	/** 自增序号位数*/
	incrementnum: string = '';
	/** 前置字符（做多4位字母或数字）*/
	prefix: string = '';
}