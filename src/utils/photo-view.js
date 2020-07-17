import Hammer from '../lib/hammer';
import { baseUrl } from '../config/env';

// (function ($, wd, dc) {
(function iife(jQuery) {
  const $ = jQuery;
  $.fn.photoview = function photoview(options) {
    function PhotoView(element, opts) {
      this.element = element;
      this.attachmentIds = opts && opts.AttachmentIds; // 附件id集合
      // this.index = options && options.index || 0; // 当前点击对象的索引号
      this.baseUrl = `${baseUrl}/Form/Download?AttachmentID=`;
      this.defaultImageUrl = `${baseUrl}/Content/images/product_default.png`;
      this.arr = this.element.children();
      this.bodyNode = $(document.body);
      this.winW = $(window).width();
      this.winH = $(window).height();
      this.init();
    }

    PhotoView.prototype = {
      init() {
        const m = this;
        m.index = 0;
        m.scale = m.winW / m.winH;
        m.mask = $('<div class="mask-v-box">');
        m.wrap = $('<div class="wrapView-v">');
        m.ulbox = $('<ul class="list-photo">');
        m.pageindex = $('<span class="page-view">×');
        m.wrapHammer = null;
        m.ulHammer = null;
        m.eventShow(m);
        m.slideEvent(m);
      },
      getDates(m) {
        const arrurl = [];
        const arrImg = [];

        for (const img of m.attachmentIds) {
          const url = m.baseUrl + img;
          arrurl.push(url);
          arrImg.push(new Image());
        }
        return {
          arrurl,
          arrImg,
        };
      },
      createArrayDom(m) {
        const imgs = m.getDates(m).arrImg;
        const urls = m.getDates(m).arrurl;
        m.bodyNode.append(m.mask).append(m.wrap);
        m.wrap.append(m.ulbox).append(m.pageindex);
        for (let i = 0; i < imgs.length; i += 1) {
          const img = imgs[i];
          const url = urls[i];
          img.src = url;
          if (img.width / img.height > m.scale) {
            m.ulbox.append(`<li><img src=${url} width="100%"></li>`);
          } else {
            m.ulbox.append(`<li><img src=${url} height="100%"></li>`);
          }
          m.ulbox.width(m.winW * img.length).height(m.winH);
          m.ulbox.children().width(m.winW).height(m.winH);
          // img.onload = function() {
          //     img.onload = null;
          //     if (img.width / img.height > m.scale) {
          //         m.ulbox.append('<li>' + '<img src=' + url + ' width="100%">' + '</li>');
          //     } else {
          //         m.ulbox.append('<li>' + '<img src=' + url + ' height="100%">' + '</li>');
          //     }
          //     m.ulbox.width(m.winW * img.length).height(m.winH);
          //     m.ulbox.children().width(m.winW).height(m.winH);
          // };
          // img.onerror = function() {
          //     //todo  加载失败时的图片链接地址
          //     console.log("image load error");
          //     img.src = m.defaultImageUrl;
          //     m.ulbox.append('<li>' + '<img src=' + m.defaultImageUrl + '>' + '</li>');
          //     m.ulbox.width(m.winW * img.length).height(m.winH);
          //     m.ulbox.children().width(m.winW).height(m.winH);
          // }
        }
        m.mask.hide();
        m.wrap.hide();
      },
      createdom(m) {
        const img = m.getDates(m).arrImg;
        const url = m.getDates(m).arrurl;
        m.bodyNode.append(m.mask).append(m.wrap);
        m.wrap.append(m.ulbox).append(m.pageindex);
        for (let i = 0; i < img.length; i += 1) {
          img[i].src = url[i];
          if (img[i].width / img[i].height > m.scale) {
            m.ulbox.append(`<li><img src=${url[i]} width="100%"></li>`);
          } else {
            m.ulbox.append(`<li><img src=${url[i]} height="100%"</li>`);
          }
          m.ulbox.width(m.winW * img.length).height(m.winH);
          m.ulbox.children().width(m.winW).height(m.winH);
        }
        m.mask.hide();
        m.wrap.hide();
      },
      slideEvent(t) {
        const m = t;
        if (!m.ulHammer) {
          m.ulHammer = new Hammer(m.ulbox.get(0));
          if (m.ulHammer) {
            m.ulHammer.on('swipeleft', () => {
              m.index += 1;
              m.movephoto(m, m.index);
            });
            m.ulHammer.on('swiperight', () => {
              m.index -= 1;
              m.movephoto(m, m.index);
            });
          }
        }
      },
      Edefault(bool) {
        document.ontouchstart = function touchStart() {
          return bool;
        };
      },
      eventShow(t) {
        const m = t;
        if (m.attachmentIds) {
          $(m.arr).each((index, obj) => {
            const hammer = new Hammer(obj);
            hammer.on('tap', () => {
              m.index = index;
              m.createArrayDom(m);
              // m.createdom(m);
              m.Edefault(false);
              m.movephoto(m, m.index);
              m.mask.show();
              m.wrap.show();
              if (!m.wrapHammer) {
                m.wrapHammer = new Hammer(m.wrap.get(0));
                m.wrapHammer.on('tap', () => {
                  setTimeout(() => {
                    m.Edefault(true);
                    m.wrap.remove();
                    m.mask.remove();
                  }, 320);
                });
              }
            });
          });
        } else {
          // 不做操作
        }
      },
      movephoto(t, i) {
        let index = i;
        const m = t;
        if (index > m.getDates(m).arrImg.length - 1) {
          index = m.getDates(m).arrImg.length - 1;
          m.index = index;
        }
        if (index < 0) {
          index = 0;
          m.index = 0;
        }
        m.pageindex.text(`${index + 1}/${m.attachmentIds.length}`);
        // m.pageindex.text(index + 1 + '/' + m.arr.length)
        m.ulbox.css('-webkit-transform', `translateX(-${index * m.winW}px)`);
      },
    };
    return new PhotoView($(this), options);
    // return this.each(function (options) {
    //     new PhotoView($(this),options);
    // });
  };
}(jQuery, window, document));
