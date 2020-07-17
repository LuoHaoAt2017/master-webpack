import { toArray } from '../../utils';

export default function pubsubMixin(controlParam) {
  const control = controlParam;
  // 订阅
  control.prototype.$subscribe = function subscribe(fields) {
    const fieldList = toArray(fields);
    // 向分发器注册订阅消息
    this.$form.$dispatcher.register(this.dataField, fieldList);
    // return function unsubscribe() {
    // };
  };

  // 发布消息，当前控件发布消息给他的订阅者
  control.prototype.$publish = function publish(namespace, isNogrid) {
    const pubControl = this;
    const pubInfo = {
      source: pubControl.dataField,
    };
    // 如果有传入namespace，则传递namespace（就是说明在子表中）
    if (namespace) {
      pubInfo.sourceNs = namespace;
    }
    if (isNogrid) {
      pubInfo.mark = 'nogrid';
    }
    // if (pubControl.$$curMsg) {
    //   // 有curMsg，将父消息传递到子消息中
    //   pubInfo.parent = pubControl.$$curMsg;
    // } else {
    //   // 无parentMsg, 说明是根节点（用户操作触发）
    //   pubInfo.isRoot = true;
    // }
    this.$form.$dispatcher.dispatchMsg(pubControl, pubInfo);
  };

  // 推送/控件接收消息
  control.prototype.$push = function push(message) {
    this.$handleMsg(message);
  };

  // 取消订阅
  // control.prototype.$unsubscribe = function unsubscribe(fields) {
  //   const fieldList = toArray(fields);
  //   this.$form.$dispatcher.remove(this.dataField, fieldList);
  // };
}
