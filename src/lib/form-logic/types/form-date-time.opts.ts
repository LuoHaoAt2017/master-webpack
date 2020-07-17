import BaseOptions from './base-options';

/** 日期*/
export default class FormDateTimeOptions extends BaseOptions {
	/** 日期格式*/
	datetimemode: string = '';

  mergeJson(json) {
    this.controlKey = 'FormDateTime';
    this.controlkey = 'FormDateTime';
  }
}
