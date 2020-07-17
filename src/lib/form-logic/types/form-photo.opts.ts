import BaseOptions from './base-options';

/** 图片*/
export default class FormPhotoOptions extends BaseOptions {
  /** 允许上传多张图片*/
  uploadmultiple: boolean = false;
  /** 仅允许拍照上传*/
  cameraonly: boolean = false;
  /** 是否有水印*/
  hasWaterMark: boolean = false;
  /** 是否压缩*/
  compression: boolean = false;

  merge(dataset: any){
    this.cameraonly = dataset.cameraonly === 'true' || dataset.cameraonly === true;
    this.uploadmultiple = dataset.uploadmultiple === 'true' || dataset.uploadmultiple === true;
    this.hasWaterMark = dataset.haswatermark === 'true' || dataset.haswatermark === true;
    this.compression = dataset.compression === 'true' || dataset.compression === true;
  }

  mergeJson(dataset) {
    this.cameraonly = dataset.cameraonly === 'true' || dataset.cameraonly === true;
    this.hasWaterMark = dataset.haswatermark;
  }
}
