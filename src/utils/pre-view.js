import { baseUrl } from '../config/env';
import { isDingtalk } from '../config/common';

function FlyZommImg(b, corpId, a) {
  this.options = a;
  this.self = b;
  this.corpId = corpId;
  this.opts = {
    imgSum: 0,
    rollSpeed: 200,
    screenHeight: 165, // 待修改
    // screenHeight: window.screen.height,
    showBoxSpeed: 300,
    miscellaneous: true,
    closeBtn: false,
    hideClass: false,
    // baseUrl:baseUrl + a?"/SNS/Download?fileId=":"/Form/Download?AttachmentID=",
    baseUrl: a && a.type ? (`${baseUrl}/Form/DownloadSnsFileByUUID?corpid=${corpId}&uid=`) : (`${baseUrl}/Form/DownloadFileByUUID?corpid=${corpId}&uid=`),
    AttachmentUrlHandler: a && a.type ? `${baseUrl}/Form/GetSnsDownloadFileUUIDs/?AttachmentIdStr=` : `${baseUrl}/Form/GetDownloadFileUUIDs/?AttachmentIdStr=`,
    slitherCallback() { },
  };
  this.init = function init() {
    const c = this;
    c.defaluts();
    c.bind();
  };
  this.defaluts = function defaluts() {
    const c = $.extend(this.opts, this.options || {});
    this.opts = c;
    return c;
  };
  this.bind = function bind() {
    const c = this;
    c.bindDom();
    $('body').on('click', '.fly-zoom-box', () => {
      c.hideBox();
    });
    $('body').on('click', '.fly-zoom-box-close', (d) => {
      c.hideBox();
      d.stopPropagation();
    });
    $('body').on('click', '.fly-zoom-box-restore', (d) => {
      c.imgRestore('tap');
      d.stopPropagation();
    });
    $('body').on('click', '.fly-zoom-box-zoomout', (d) => {
      c.zommImg(-100, 1);
      d.stopPropagation();
    });
    $('body').on('click', '.fly-zoom-box-zoom', (d) => {
      c.zommImg(100, 1);
      d.stopPropagation();
    });
    $('body').on('click', '.fly-zoom-box-img', (d) => {
      c.imgRestore('tap');
      d.stopPropagation();
    });
    $('body').on('click', '.fly-zoom-box-tool', (d) => {
      d.stopPropagation();
    });
    $('body').on('click', '.fly-zoom-box-label', function clickListener(f) {
      const d = $(this);
      const g = d.html();
      if (g && c.groups && c.groups[c.group_name]) {
        c.group_name = g;
        c.opts.imgSum = c.groups[c.group_name].length;
        c.opts.img_index = 0;
        $('.fly-zoom-box-fix').html(1);
        $('.fly-zoom-box-length').html(c.opts.imgSum);
        const src = c.opts.baseUrl + c.groups[c.group_name][0].dom.attr('id');
        $('.fly-zoom-box-img').attr('src', src);
        $('.fly-zoom-box-label').css({
          background: '',
          color: '#666',
        });
        d.css({
          background: 'rgba(62,69,80,1)',
          color: '#fff',
        });
        c.oWidth = null;
        c.oHeight = null;
        c.imgRestore('oneSwitcher', c.groups[c.group_name][0].dom);
        c.onPinch = null;
        c.onRotate = null;
      }
      f.stopPropagation();
    });
  };
  this.bindDom = function bindDom() {
    const f = this;
    f.opts.imgSum = 0;
    f.opts.img_index = 1;
    f.groups = [];
    f.group_names = [];
    f.group_show = false;
    f.self.find('img').each(function each() {
      const g = $(this);
      if ((f.opts.hideClass && !g.hasClass(f.opts.hideClass)) || !f.opts.hideClass) {
        const i = g.data('group');
        if (i) {
          if (!f.groups[i]) {
            f.group_names.push(i);
            f.groups[i] = [];
          }
          f.groups[i].push({
            dom: g,
          });
          f.group_show = true;
        }
        if (!f.group_show) {
          g.data('index', f.opts.imgSum);
          f.opts.imgSum += 1;
        }
      }
    });
    if (f.group_show) {
      const e = f.group_names;
      for (let d = 0; d < e.length; d += 1) {
        for (let c = 0; c < f.groups[e[d]].length; c += 1) {
          f.groups[e[d]][c].dom.attr('data-index', c);
        }
      }
    }
    this.getImgSize = function getImgSize(img, cb) {
      if (img[0].naturalWidth === 0) {
        const tmp = new Image();
        tmp.src = img[0].src;
        tmp.onload = () => {
          const imgSize = {
            width: tmp.naturalWidth,
            height: tmp.naturalHeight,
          };
          cb(imgSize);
        };
        tmp.onerror = () => {
          // console.log('load error');
        };
      } else {
        cb({ width: img[0].naturalWidth, height: img[0].naturalHeight });
      }
    };
    const self = this;
    this.self.find('img').on('click', function click(e) {
      e.stopPropagation();
      const g = $(this);
      if (!g.attr('id')) {
        return true;
      }
      const that = this;
      const url = self.opts.AttachmentUrlHandler + g.attr('id');
      $.ajax({
        type: 'POST',
        url,
        success(data) {
          if (data) {
            g.attr('id', data[g.attr('id')]);
            // 编辑模式禁用图片预览
            const parent = $(that).parent().parent().parent();
            const isEdited = parent[0].isEdited;
            if (isEdited) {
              return false;
            }
            if (g) {
              if ((f.opts.hideClass && !g.hasClass(f.opts.hideClass)) || !f.opts.hideClass) {
                f.flyBoxHtml(g);
                const target = $(`img[data-id="${$(g).attr('id')}"]`);
                f.getImgSize(target, (imgSize) => {
                  if ($('.fly-zoom-box').length > 0) {
                    // 尝试改变g指向
                    f.imgRestore('oneSwitcher', target, imgSize);
                    // f._imgRestore("oneSwitcher", g);
                    $('body').on('touchmove', (h) => {
                      h.preventDefault();
                    });
                    f.touchBind(f);
                    f.opts.slitherCallback('firstClick', g);
                  }
                });
              }
            }
          }
          return false;
        },
      });
      return false;
    });
  };
  this.reload = function reload() {
    $('body').unbind('touchmove');
    this.self.find('img').unbind('click');
    this.moveUnBind();
    this.bindDom();
  };
  this.flyBoxHtml = function flyBoxHtml(h) {
    const c = parseInt(h.data('index'), 10);
    if (this.group_show) {
      this.group_name = h.data('group');
      this.opts.imgSum = this.groups[this.group_name].length;
      this.opts.img_index = c;
    }
    const f = this.opts.imgSum;
    let e = '';
    // 修改下src属性
    let src = this.opts.baseUrl + h.attr('id');
    src = `${window.location.origin}${src}`;
    const name = h.attr('data-name');
    e += `${"<div class='fly-zoom-box' style='touch-action: none;display: none;-webkit-tap-highlight-color:rgba(255,255,255,0);cursor: pointer;position: fixed;z-index: 9999;width:100% ;height:100% ;background: rgba(20,20,20,1);top:0 ;bottom: 0;right:0 ;left:0 ;'><div class='fly-zoom-box-number' style='touch-action: none;z-index: 999999;position: absolute;bottom: 10px;right: 10px;padding: 10px 0 ;line-height: 26px;color: #ddd;font-size: 14px;text-align: center;'><span style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 0px 6px'><span class='fly-zoom-box-fix'>"}${c + 1}</span>/<span class='fly-zoom-box-length'>${f}</span></span></div><div class='fly-zoom-box-main' style='touch-action: none;z-index: auto;position: relative;width: 100%;height: 100%;overflow: auto'><img class='fly-zoom-box-img' data-id='${h.attr('id')}' data-name='${name}' data-index='${c}' style='touch-action: none;display: block;width: 100%;position: absolute;' src='${src}'></div>`;
    if (this.opts.closeBtn) {
      e += "<div class='fly-zoom-box-close' style='touch-action: none;text-align: center;z-index: 99999999;position: absolute;top: 11px;color: #ddd;font-size: 26px;right: 14px;'>×</div>";
    }
    if (this.opts.miscellaneous && this.group_names.length === 0) {
      e += "<div class='fly-zoom-box-tool' style='touch-action: none;z-index: 999999;position: absolute;bottom: 10px;padding: 10px 0 ;width: 200px;line-height: 26px;color: #ddd;font-size: 14px;margin: 0 auto;right: 0;left: 0;text-align: center;background: rgba(20,20,20,0.3);border-radius: 50px'><span class='fly-zoom-box-zoomout' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 0px 6px'>－</span><span class='fly-zoom-box-restore' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 2px 6px;margin: 0  0 0 10px '>还原</span><span class='fly-zoom-box-close' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 2px 6px;margin: 0 10px'>关闭</span><span class='fly-zoom-box-zoom' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 0px 6px'>＋</span></div>";
    }
    if (this.group_names.length > 0 && this.opts.miscellaneous) {
      e += "<div class='fly-zoom-box-tool' style='touch-action: none;text-align: center;z-index: 999999;position: absolute;bottom: 10px;padding: 10px 0 ;line-height: 26px;color: #ddd;font-size: 12px;margin: 0 auto;right: 0;left: 0;background: rgba(20,20,20,0.3);'>";
      const g = this.group_names;
      for (let d = 0; d < g.length; d += 1) {
        e += "<span class='fly-zoom-box-label' style='width: max-content;border-radius: 5px;display: inline-block;";
        if (g[d] === this.group_name) {
          e += 'background: rgba(62,69,80,1);color: #fff;';
        } else {
          e += 'color: #666;';
        }
        e += `padding: 2px 9px;margin: 5px 10px 0 10px'>${g[d]}</span>`;
      }
    }
    e += '</div>';
    $('body').append(e);
    this.showBox();
  };
  this.hideBox = function hideBox() {
    $('.fly-zoom-box').hide(this.opts.showBoxSpeed, 'linear', function callback() {
      $(this).remove();
    });
    $('body').unbind('touchmove');
    this.opts.slitherCallback('close', $('.fly-zoom-box-img'));
    this.moveUnBind();
  };
  this.showBox = function showBox() {
    $('.fly-zoom-box').show(this.opts.showBoxSpeed);
  };
  this.rightMove = function rightMove() {
    const e = this;
    if (e.opts.imgSum === 1) {
      return;
    }
    let f;
    let c;
    if (e.group_show) {
      c = e.opts.img_index + 1;
      const d = e.opts.imgSum;
      if (c >= d) {
        c = 0;
      }
      e.opts.img_index = c;
      f = e.groups[e.group_name][c].dom;
    } else {
      c = parseInt($('.fly-zoom-box-img').attr('data-index'), 10);
      c += 1;
      const d = this.opts.imgSum;
      if (c >= d) {
        c = 0;
      }
      f = '';
      this.self.find('img').each(function each() {
        const g = $(this);
        if (g.data('index') === c) {
          f = g;
          return false;
        }
        return true;
      });
    }
    $('.fly-zoom-box-fix').html(c + 1);
    $('.fly-zoom-box .fly-zoom-box-img').animate({
      left: '-200%',
    }, e.opts.rollSpeed, 'linear', function animateCallback() {
      $(this).remove();
    });
    const url = this.opts.AttachmentUrlHandler + $(f).attr('id');
    const that = this;
    $.ajax({
      type: 'POST',
      url,
      success(data) {
        $(f).attr('id', data[$(f).attr('id')]);
        const src = window.location.origin + e.opts.baseUrl + $(f).attr('id');
        const name = $(f).attr('data-name');
        $('.fly-zoom-box-main').append(`<img data-id='${$(f).attr('id')}' class='fly-zoom-box-img' data-name='${name}' data-index='${c}'  style='left:100%;display: block;position: absolute;' src='${src}'>`);
        const target = $(`img[data-id="${$(f).attr('id')}"]`);
        that.getImgSize(target, (imgSize) => {
          if ($('.fly-zoom-box').length > 0) {
            $('.fly-zoom-box-img').animate({
              left: '0%',
            }, e.opts.rollSpeed, 'linear', () => {
              e.touchBind(e);
              e.imgRestore('switcher', f, imgSize);
            });
            e.moveUnBind(c);
            e.opts.slitherCallback('left', f);
          }
        });
      },
    });
  };
  this.leftMove = function leftMove() {
    const e = this;
    if (e.opts.imgSum === 1) {
      return;
    }
    let f;
    let c;
    if (e.group_show) {
      c = e.opts.img_index - 1;
      const d = e.opts.imgSum;
      if (c < 0) {
        c = (d - 1);
      }
      e.opts.img_index = c;
      f = e.groups[e.group_name][c].dom;
    } else {
      c = parseInt($('.fly-zoom-box-img').attr('data-index'), 10);
      c -= 1;
      const d = this.opts.imgSum;
      if (c < 0) {
        c = (d - 1);
      }
      f = '';
      this.self.find('img').each(function each() {
        const g = $(this);
        if (g.data('index') === c) {
          f = g;
          return false;
        }
        return true;
      });
    }
    $('.fly-zoom-box-fix').html(c + 1);
    $('.fly-zoom-box-main .fly-zoom-box-img').animate({
      left: '200%',
    }, e.opts.rollSpeed, 'linear', function animateCallback() {
      $(this).remove();
    });
    const url = this.opts.AttachmentUrlHandler + $(f).attr('id');
    $.ajax({
      type: 'POST',
      url,
      success(data) {
        $(f).attr('id', data[$(f).attr('id')]);
        const src = window.location.origin + e.opts.baseUrl + $(f).attr('id');
        const name = $(f).attr('data-name');
        $('.fly-zoom-box-main').append(`<img data-id='${$(f).attr('id')}' class='fly-zoom-box-img' data-name='${name}' data-index='${c}'  style='right:100%;display: block;position: absolute;' src='${src}'>`);
        const target = $(`img[data-id="${$(f).attr('id')}"]`);
        e.getImgSize(target, (imgSize) => {
          if ($('.fly-zoom-box').length > 0) {
            $('.fly-zoom-box-img').animate({
              right: '0%',
            }, e.opts.rollSpeed, 'linear', () => {
              e.touchBind(e);
              e.imgRestore('switcher', f, imgSize);
            });
            e.moveUnBind();
            e.opts.slitherCallback('right', f);
          }
        });
      },
    });
  };
  this.moveUnBind = function moveUnBind() {
    $('body').unbind('touchstart');
    $('body').unbind('touchend');
  };
  this.touchBind = function touchBind(t) {
    let e;
    let d;
    const c = t;
    $('body').on('touchstart', (i) => {
      const f = i.originalEvent.touches ? i.originalEvent.touches[0] : i;
      c.startX = f.pageX;
      c.startY = f.pageY;
      window.clearTimeout(c.longTapTimeout);
      if (i.originalEvent.touches.length > 1) {
        const g = i.originalEvent.touches[1];
        const j = Math.abs(g.pageX - c.startX);
        const h = Math.abs(g.pageY - c.startY);
        c.touchDistance = c.getDistance(j, h);
        c.touchVector = {
          x: g.pageX - c.startX,
          y: g.pageY - c.startY,
        };
      } else {
        c.startTime = c.getTime();
        c.longTapTimeout = setTimeout(() => {
          c.emitEvent('longtap');
        }, 800);
        if (c.previousTouchPoint) {
          if (Math.abs(c.startX - c.previousTouchPoint.startX) < 10
          && Math.abs(c.startY - c.previousTouchPoint.startY) < 10
            && Math.abs(c.startTime - c.previousTouchTime) < 500) {
            c.emitEvent('doubletap');
          }
        }
        c.previousTouchTime = c.startTime;
        c.previousTouchPoint = {
          startX: c.startX,
          startY: c.startY,
        };
      }
    });
    $('body').on('touchmove', (o) => {
      // const p = c.getTime();
      if (o.originalEvent.touches.length > 1) {
        if (c.touchVector) {
          const g = {
            x: o.originalEvent.touches[1].pageX - o.originalEvent.touches[0].pageX,
            y: o.originalEvent.touches[1].pageY - o.originalEvent.touches[0].pageY,
          };
          const k = c.getRotateAngle(g, c.touchVector);
          if (k > 30) {
            c.emitEvent('rotate');
            c.touchVector.x = g.x;
            c.touchVector.y = g.y;
          } else {
            const j = Math.abs(o.originalEvent.touches[0].pageX - o.originalEvent.touches[1].pageX);
            const f = Math.abs(o.originalEvent.touches[1].pageY - o.originalEvent.touches[1].pageY);
            const n = c.getDistance(j, f);
            if (c.touchDistance) {
              const h = n / c.touchDistance;
              const i = h - c.previousPinchScale;
              c.emitEvent('pinch', {
                scale: i,
              });
              c.previousPinchScale = h;
            }
          }
        }
      } else {
        window.clearTimeout(c.longTapTimeout);
        const q = o.originalEvent.touches ? o.originalEvent.touches[0] : o;
        const m = c.moveX === null ? 0 : q.pageX - c.moveX;
        const l = c.moveY === null ? 0 : q.pageY - c.moveY;
        c.emitEvent('move', {
          deltaX: m,
          deltaY: l,
        });
        c.moveX = q.pageX;
        c.moveY = q.pageY;
      }
      o.preventDefault();
    });
    $('body').on('touchend', () => {
      window.clearTimeout(c.longTapTimeout);
      const f = c.getTime();
      e = c.moveX - c.startX;
      d = c.moveY - c.startY;
      if ((c.moveX !== null && Math.abs(e) > 10) || (c.moveY !== null && Math.abs(d) > 10)) {
        if (Math.abs(e) > Math.abs(d) && e > 70) {
          c.emitEvent('left');
        } else if (Math.abs(e) > Math.abs(d) && e < -70) {
          c.emitEvent('right');
        } else if (Math.abs(d) > Math.abs(e) && d > 70) {
          c.emitEvent('bottom');
        } else if (Math.abs(d) > Math.abs(e) && d < -70) {
          c.emitEvent('top');
        } else if (f - c.startTime < 500) {
          c.emitEvent('swipe');
        }
      } else if (f - c.startTime < 2000) {
        if (f - c.startTime < 500) {
          c.emitEvent('tap');
        }
      }
      c.emitEvent('touchend');
    });
  };
  // f -scale
  this.zommImg = function zommImg(t, i) {
    let f = t;
    if (i <= 0) {
      if (Number.isNaN(Number(f)) || Math.abs(f) > 0.2 || Math.abs(f) < 0.02) {
        return false;
      }
    }
    const g = $('.fly-zoom-box-img');
    const n = g.width();
    const d = g.height();
    const j = window.screen.width;
    const e = window.screen.height - this.opts.screenHeight;
    let k;
    let c;
    let m;
    let l;
    if (i <= 0) {
      f *= 2;
      k = n + (n * f);
      c = d + (d * f);
      m = (j - k) / 2;
      l = (e - c) / 2;
    } else {
      k = n + f;
      c = d * (k / n);
      if (k < j) {
        return false;
      }
      if (f > 0) {
        this.onPinch = true;
      }
      m = (j - k) / 2;
      l = (e - c) / 2;
    }
    if (k / this.oWidth >= 2 || k / this.oWidth <= 0.5) {
      return false;
    }
    g.width(k);
    g.height(c);
    g.css({
      top: `${l}px`,
      left: `${m}px`,
    });
    return g;
  };
  this.getTime = function getTime() {
    return new Date().getTime();
  };
  this.getDistance = function getDistance(d, c) {
    return Math.sqrt((d * d) + (c * c));
  };
  this.getRotateDirection = function getRotateDirection(d, c) {
    return (d.x * c.y) - (c.x * d.y);
  };
  this.getRotateAngle = function getRotateAngle(i, g) {
    let j = this.getRotateDirection(i, g);
    j = j > 0 ? -1 : 1;
    const e = this.getDistance(i.x, i.y);
    const d = this.getDistance(g.x, g.y);
    const f = e * d;
    if (f === 0) {
      return 0;
    }
    const c = (i.x * g.x) + (i.y * g.y);
    let h = c / f;
    if (h > 1) {
      h = 1;
    }
    if (h < -1) {
      h = -1;
    }
    return (Math.acos(h) * j * 180) / Math.PI;
  };
  this.setNumber = function setNumber(
    img,
    screenWidth,
    screenHeight,
    initTop,
    bodyWidth,
    initSize,
  ) {
    // var j,p
    let width;
    let height;
    if (img) {
      if (initSize) {
        width = initSize.width;
        height = initSize.height;
      } else {
        width = img.naturalWidth;
        height = img.naturalHeight;
      }
    }
    // 屏幕的高宽比
    const screenScale = screenHeight / screenWidth;
    const imgScale = height / width;
    if (imgScale > 1) {
      if (imgScale > screenScale) {
        const resizeScale = screenHeight / height;
        height = screenHeight;
        width *= resizeScale;
      } else {
        const resizeScale = screenWidth / width;
        width = screenWidth;
        height *= resizeScale;
      }
    } else {
      const resizeScale = screenWidth / width;
      width = screenWidth;
      height *= resizeScale;
    }
    // 计算top
    let top = 0;
    if (height >= screenHeight) {
      top = 0;
    } else if (isDingtalk) {
      top = (screenHeight - 60 - height) / 2;
    } else {
      top = (screenHeight - height) / 2;
    }
    return {
      per: 1,
      dwidth: width,
      dheight: height,
      ch: top,
    };
  };
  this.imgRestore = function imgRestore(m, j, imgSize) {
    const l = this;
    l.cdomthis = j;
    const f = $('.fly-zoom-box-img');
    const g = window.screen.width;
    // var e = window.screen.height - l.opts.screenHeight;
    const e = window.screen.height;
    // const o = (g - l.oWidth) / 2;
    // const i = (e - l.oHeight) / 2;
    const k = document.body.offsetWidth;
    // const d = document.body.offsetHeight;
    const n = 50;
    if (m === 'tap') {
      f.css({
        top: `${l.oTop}px`,
        width: `${l.oWidth}px`,
        height: `${l.oHeight}px`,
        margin: '0 auto',
        right: '0%',
        left: '0%',
      });
      l.onPinch = null;
      l.onRotate = null;
    } else if (m === 'chage') {
      const c = l.setNumber(j, g, e, n, k);
      f.css({
        top: `${c.ch}px`,
        width: `${c.dwidth * c.per}px`,
        height: `${c.dheight * c.per}px`,
        margin: '0 auto',
      });
      l.oTop = c.ch;
      l.oWidth = c.dwidth * c.per;
      l.oHeight = c.dheight * c.per;
    } else if (m === 'touchend') {
      if (f.width() < l.oWidth) {
        const c = l.setNumber(j, g, e, n, k);
        f.animate({
          top: `${c.ch}px`,
          width: `${c.oWidth}px`,
          height: `${c.oHeight}px`,
          margin: '0 auto',
          right: '0%',
          left: '0%',
        }, 80, 'linear', () => {
          l.onPinch = null;
          l.onRotate = null;
        });
      }
    } else if (m === 'switcher' || m === 'oneSwitcher') {
      const c = l.setNumber(j, g, e, n, k, imgSize);
      f.css({
        top: `${c.ch}px`,
        width: `${c.dwidth * c.per}px`,
        height: `${c.dheight * c.per}px`,
        margin: '0 auto',
        right: '0%',
        left: '0%',
      });
      l.oTop = c.ch;
      l.oWidth = c.dwidth * c.per;
      l.oHeight = c.dheight * c.per;
    }
  };
  this.emitEvent = function emitEvent(d, j) {
    const i = this;
    switch (d) {
      case 'tap':
        break;
      case 'doubletap':
        i.onDoubletap = true;
        break;
      case 'longtap':
        i.onLongtap = true;
        break;
      case 'swipe':
        i.onSwipe = true;
        break;
      case 'move':
        if (i.onPinch) {
          i.onMove = true;
          const e = $('.fly-zoom-box-img');
          const h = parseInt(e.css('top'), 10);
          const g = parseInt(e.css('left'), 10);
          const c = h + j.deltaY;
          const f = g + j.deltaX;
          e.css({
            top: `${c}px`,
            left: `${f}px`,
          });
        }
        break;
      case 'pinch':
        i.onPinch = true;
        i.isPinch = true;
        i.zommImg(j.scale, 0);
        break;
      case 'rotate':
        i.isRotate = true;
        i.onRotate = true;
        break;
      case 'left':
        if (!i.onPinch && !i.onRotate) {
          i.onLeft = true;
          i.leftMove();
        }
        break;
      case 'right':
        if (!i.onPinch && !i.onRotate) {
          i.onRight = true;
          i.rightMove();
        }
        break;
      case 'top':
        if (!i.onPinch && !i.onRotate) {
          i.onTop = true;
        }
        break;
      case 'bottom':
        if (!i.onPinch && !i.onRotate) {
          i.onBottom = true;
        }
        break;
      case 'touchend':
        // var target=$('img[data-id="'+$(f).attr('id')+'"]');
        // f.getImgSize(target,function(imgSize){
        //     $(".fly-zoom-box-img").animate({
        //         right: "0%"
        //     }, e.opts.rollSpeed, "linear", function () {
        //         e.touchBind(e);
        //         e.imgRestore("switcher", f)
        //     });
        //     f.moveUnBind();
        //     f.opts.slitherCallback("right", f);
        // });
        i.imgRestore('touchend', i.cdomthis);
        i.isPinch = null;
        i.isRotate = null;
        i.startX = null;
        i.startY = null;
        i.moveX = null;
        i.moveY = null;
        i.touchDistance = null;
        i.previousPinchScale = 1;
        break;
      default:
        break;
    }
  };
}
$.fn.FlyZommImg = function flyZommImg(corpId, a) {
  const b = new FlyZommImg(this, corpId, a);
  b.init();
  return b;
};
