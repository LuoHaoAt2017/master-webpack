import FormLogic from './index';
import converter, {findObjectId} from '../utils/converter';

const instances = {};
const track = [];

const service = {
  getInstance (key) {
    return instances[key];
  },
  getControl (...args) {
    if (args.length === 1) {
      // 兼容 bizObjectId 包含斜杆的情况。
      // 因为代码查找命名空间，使用 String.prototype.split 方法，
      // 以 / 为分隔符查找，会导致查找失败
      let bizObjectId = findObjectId(args[0], instances);
      return converter.parseNamespace(args[0], instances, bizObjectId);
    }
    return converter.parseNamespace(args, instances);
  },
  getCurrentForm () {
    const curKey = track[track.length - 1];
    return curKey && instances[curKey];
  },
  newInstance (options) {
    const bizObjectId = options.bizObjectId;
    const instance = new FormLogic(options);
    instances[bizObjectId] = instance;
    track.push(bizObjectId);
    return instance;
  },
  setQueryCache (queryItem) {
    FormLogic.prototype.setQueryCache(queryItem);
  },
  setConfig (arg) {
    Object.assign(FormLogic.config, arg);
  },
  getConfig (key) {
    return FormLogic.config[key];
  },
  destroy (key) {
    if (instances[key]) {
      instances[key].$destroy();
      delete FormLogic.queryCache[key];
      delete instances[key];
      delete FormLogic.queryCache[key];
      const index = track.indexOf(key);
      if (index > -1) {
        track.splice(index, 1);
      }
    }
  },
};

service.setConfig({
  // debugMode: true,
  platForm: 'mobile',
});

export default service;
