import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import { getCookie } from '@/utils';

export default {
  install (Vue) {
    if (process.env.NODE_ENV === 'production' && Sentry) {
      // TODO 改成通过全局引入DSN
      // const sentryDsn = window._H3_SENTRY_DSN_;
      const sentryDsn = process.env.H3_ENV === 'release'
        ? 'https://72560325853f45129acf0842baa1cbbd@sentry2.techoa.h3yun.net/3'
        : 'https://897c492cd6d24050bfcddffcccf74d55@sentry2.techoa.h3yun.net/5';
      Sentry.init({
        dsn: sentryDsn,
        release: process.env.ASSETS_DIR,
        integrations: [new Integrations.Vue({ Vue, attachProps: true })],
      });
    }
    Vue.prototype.$sentry = Sentry;
    // 监听promise
    window.addEventListener('unhandledrejection', err => {
      const st = window.setTimeout(() => {
        window.clearTimeout(st);
        Sentry.withScope(function (scope) {
          scope.setTag('errorType', 'unhandledrejection');
          scope.setLevel(Sentry.Severity.Error);
          Sentry.captureException(err);
        });
      }, 0);
    });
  },
};

/**
 * 用户登录成功后，捕获用户登录成功信息
 * @param userinfo 用户信息
 */
export const captureUserLogin = (globalConfig: GlobalConfig) => {
  if (process.env.NODE_ENV === 'production' && Sentry) {
    // 使用Sentry获取上报用户信息
    try {
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: globalConfig.userId,
          username: globalConfig.userName,
          engine: globalConfig.engineCode,
          solutionCode: globalConfig.solutionCode || 'home',
          appId: globalConfig.appCode || 'home',
          appCode: globalConfig.appCode || 'home',
          agentId: globalConfig.agentId,
        });
      });
      const shardkey = getCookie('shardkey2');
      if (shardkey) {
        Sentry.setTag('shardkey', getCookie('shardkey2'));
      }
      Sentry.captureMessage('Sentry 已经接入 用户登录成功');
    } catch (err) {
      Sentry.captureException(new Error('获取用户信息失败'));
    }
  }
};

export const captureExceptionWithTag = (exception: Error, tags: { [key: string]: string }) => {
  if (Sentry) {
    Sentry.withScope((scope) => {
      scope.setTags(tags);
      Sentry.captureException(exception);
    });
  }
};
