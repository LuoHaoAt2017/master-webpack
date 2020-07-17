// import { setTimeout } from 'timers';
import H3PluginDeveloper from '../lib/h3-plugins-developer';
import { SolutionState } from '../config/license';

export default class UploadPic {
  constructor () {
    this.sw = 0;
    this.sh = 0;
    this.tw = 0;
    this.th = 0;
    this.scale = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.maxSize = 0;
    this.fileSize = 0;
    this.fileDate = null;
    this.fileType = '';
    this.fileName = '';
    this.fileId = '';
    this.input = null;
    this.display = null;
    this.canvas = null;
    this.mime = {};
    this.type = '';
    this.imgCounts = 0;
  }

  init (options) {
    this.maxWidth = options.maxWidth || 800;
    this.maxHeight = options.maxHeight || 600;
    this.maxSize = options.maxSize || 5 * 1024 * 1024;
    this.input = options.input;
    this.display = options.display;
    this.imgCounts = options.choosePicCounts;
    this.mime = {
      png: 'image/png', jpg: 'image/jpg', jpeg: 'image/jpeg', bmp: 'image/bmp',
    };
    this.callback = options.callback || (() => {});
    this.loading = options.loading || (() => {});
    this.removeCallback = options.removeCallback || (() => {});
    this.addEvent();
  }

  addEvent () {
    const self = this;

    function tmpSelectFile (ev) {
      self.handelSelectFile(ev);
    }
    this.input.addEventListener('change', tmpSelectFile, false);
  }

  handelSelectFile (ev) {
    const self = this;
    const files = ev.target.files;
    const len = files.length;
    if (files != null && files.length > 0) {
      for (let i = 0; i < len; i += 1) {
        if (i > 7 - self.imgCounts) {
          return false;
        }
        const file = ev.target.files[i];
        if (typeof (file) === 'undefined') {
          continue;
        }
        if (!/image.(png|jpg|jpeg|bmp)/.test(file.type)) {
          H3PluginDeveloper.IShowWarn('警告', '选择文件非图片类型');
          continue;
        }

        if (file.size > this.maxSize) {
          H3PluginDeveloper.IShowWarn('警告', `选择文件大于${this.maxSize / 1024 / 1024}M，请重新选择`);
          continue;
        }

        // TODO: 不知道为啥会为 undefined
        const solutionStates = window.GlobalConfig.solutionStates;
        if (solutionStates && solutionStates.indexOf(SolutionState.FileSizeExceed) > -1) {
          H3PluginDeveloper.IShowWarn('警告', '附件量已达上限，请升级附件量套餐', () => {}, 2000);
          continue;
        }
        self.readImage(file);
      }
    }
    return null;
  }

  readImage (file) {
    const self = this;
    function tmpCreateImage (uri, type, id, name) {
      self.createImage(uri, type, id, name);
    }
    this.loading();
    // H3PluginDeveloper.IShowWarn('警告', file.name);
    this.getURI(file, tmpCreateImage);
  }

  getURI (file, callback) {
    const reader = new FileReader();
    const self = this;

    let type = null;
    if (typeof (file) !== 'undefined') {
      type = file.type;
    }
    // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
    if (!type) {
      type = self.mime[file.name.match(/\.([^\.]+)$/i)[1]];
    }

    const tmpLoad = function tmpLoad () {
      // 头不带图片格式，需填写格式
      const re = /^data:base64,/;
      let ret = `${this.result}`;

      if (re.test(ret)) {
        ret = ret.replace(re, `data:${type};base64,`);
      }

      const fileId = H3PluginDeveloper.IGuid();
      if (callback) {
        callback(ret, type, fileId, file.name);
      }
      if (self.display) {
        // 此处处理成点击放大的效果
        const $contanier = $('<div class="img-container"></div>');
        const $remove = $('<span class="icon-reset" ></span>');
        const $image = $(`<img  id="${fileId}"  class="imgnormal" src="${this.result}" alt=""  />`);
        // 预留删除接口
        $contanier.append($image);
        $contanier.append($remove);
        if ($(self.display).find('.addNewPic').length) {
          $(self.display).find('.addNewPic').before($contanier);
        } else {
          $(self.display).append($contanier);
        }
        $(self.display).show();
        self.imgCounts = $(self.display).find('.img-container').length - 1;

        $contanier.unbind('click').bind('click', function click () {
          $(this).remove();
          const imgLength = $(self.display).find('.img-container').length - 1;
          $(self.display).attr('imgLength', imgLength);
          self.imgCounts = imgLength;
          self.removeCallback(imgLength);
        });
      }
    };

    reader.onload = tmpLoad;

    reader.readAsDataURL(file);

    return false;
  }

  createImage (uri, tpye, fileId, fileName) {
    const img = new Image();
    const self = this;

    function tmpLoad () {
      self.drawImage(this, tpye, fileId, fileName);
    }
    img.onload = tmpLoad;
    img.src = uri;
  }

  drawImage (img, tpye, fileId, fileName) {
    this.sw = img.width;
    this.sh = img.height;
    this.tw = img.width;
    this.th = img.height;

    this.scale = (this.tw / this.th).toFixed(2);

    // if (this.sw > this.maxWidth) {
    //   this.sw = this.maxWidth;
    // this.sh = Math.round(this.sw / this.scale);
    // }

    // if (this.sh > this.maxHeight) {
    //   this.sh = this.maxHeight;
    //   this.sw = Math.round(this.sh * this.scale);
    // }

    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');

    this.canvas.width = this.sw;
    this.canvas.height = this.sh;

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

    this.callback(this.canvas.toDataURL(this.type), tpye, fileId, fileName);

    ctx.clearRect(0, 0, this.tw, this.th);
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.canvas = null;
  }
}
