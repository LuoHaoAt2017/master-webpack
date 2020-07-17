/**
 * H3Yun-FormLogic配置
 * 此配置需要在挂在VUEX-Plugins之前配置
 */
import FormLogicContext from 'h3yun-formlogic/src/context';
import Utils from '@/lib/h3-plugins-developer';
// import fetch from '@/config/fetch';
import fetch from '@/lib/form-logic/utils/fetch';
import { baseUrl } from '@/config/env';

const isDebugMode = process.env.NODE_ENV !== 'production';

export const modulePath = ['Form'];

new FormLogicContext({
  version: 2,
  baseUrl: baseUrl,
  platform: 'mobile',
  modulePath: modulePath,
  moduleName: 'ViewModel',
  debugMode: isDebugMode,
  watching: {
    state: isDebugMode,
    msg: isDebugMode,
    action: isDebugMode,
    mutation: isDebugMode,
  },
  fetch: fetch,
  // fetchLight: fetchLight,
  h3Utils: Utils,
});
