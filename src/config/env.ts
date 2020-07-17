/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
/* eslint-disable */
// zyq;
/** 路由模式 */
let tempBaseUrl;

export const routerMode = 'history';

/** 是否为生产模式 */
export const isProductionMode = process.env.NODE_ENV === 'production';

if (isProductionMode) {
  tempBaseUrl = '';
} else {
  const localDevGroup = window.localStorage.getItem('H3_DEV_GROUP_MOBILE') || '';
  tempBaseUrl =  localDevGroup ? `/${localDevGroup}Api` : '/apis';
}

/** 域名地址 */
export const baseUrl = tempBaseUrl;

/** 图片所在域名地址 */
export const imgBaseUrl = process.env.PUBLIC_PATH + process.env.ASSETS_DIR;
