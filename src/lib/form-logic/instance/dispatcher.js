import { Message, MessageQueue, messageError } from '../base/global/message';
import { toArray, lazyPush, parsePath } from '../utils';
import { debugMsg } from '../utils/debug';
import { State, Mark } from '../utils/constants';

export default class Dispatcher {
  constructor (formInstance) {
    this.pubsubs = {};
    this.watchers = [];
    this.$form = formInstance;
    this.messageQueue = new MessageQueue();
  }

  // 注册订阅，当发布者 发布消息时， 分发器将消息分发给订阅者
  register (suber, puber) {
    if (!suber || suber.length === 0) {
      return;
    }
    const subers = toArray(suber);
    const pubers = toArray(puber);
    // 例A = B + C B和C为pub A为sub
    // 兼容PC端，跨子表的规则，pub在子表内，sub在子表外，订阅整个子表,2019-5-15晚 修改逻辑为不绑定在子表上
    pubers.forEach((pub) => {
      // const pubIngrid = pub.includes('.');
      // const parentPubField = pubIngrid ? pub.split('.')[0] : '';
      subers.forEach((sub) => {
        // const parentSubField = sub.includes('.') ? sub.split('.')[0] : '';
        // let pubField;
        // if (pubIngrid && parentPubField !== parentSubField) {
        //   // 如果pub在子表内，且和sub不在同一子表内，则订阅的字段选为整个子表字段
        //   pubField = parentPubField;
        // } else {
        //   pubField = pub;
        // }
        const pubField = pub;
        if (this.pubsubs[pubField]) {
          lazyPush(this.pubsubs[pubField], sub);
        } else {
          this.pubsubs[pubField] = [sub];
        }
      });
    });
  }

  // 分发消息， 分发发布者的消息给订阅者
  dispatchMsg (pubControl, pubInfo) {
    const formInstance = this.$form;
    const messageQueue = this.messageQueue;
    if (messageQueue.block) return;
    // 按照广度优先遍历 遍历关系树（有递归），依次添加到消息队列
    const publisher = pubControl.dataField;
    try {
      // 判断是否是INIT状态 并且是新增模式
      const isLoadingData = formInstance.$stateMachine.state === State.INIT &&
        !formInstance.$responseContext.IsCreateMode;
      // 在订阅列表中，查找发布者的订阅者
      const subscribers = this.pubsubs[publisher];
      if (subscribers && subscribers.length > 0) {
        for (const subscriber of subscribers) {
          const subControl = formInstance[subscriber];
          if (!subControl) {
            continue;
          }
          // 处理订阅的控件在子表中；
          // 如果发布和订阅都在同一个子表，则将消息推送送到同一行的对应控件；
          // 如果不在同一行，则对所有行的对应控件推送消息；
          if (subControl.isIngrid) {
            if (pubControl.parentDataField === subControl.parentDataField) {
              if (pubInfo.mark !== Mark.NOGRID) {
                const targetNs = pubInfo.sourceNs.slice();
                targetNs[targetNs.length - 1] = subscriber;
                messageQueue.messageIn(new Message({
                  mark: pubInfo.mark,
                  source: pubInfo.source,
                  target: subscriber,
                  targetNs,
                  isLoadingData,
                }));
              }
            } else {
              const gridControl = formInstance[subControl.parentDataField];
              for (const rowId of gridControl.rows) {
                const targetNs = [subControl.parentDataField, rowId, subscriber];
                messageQueue.messageIn(new Message({
                  mark: pubInfo.mark,
                  source: pubInfo.source,
                  target: subscriber,
                  targetNs,
                  isLoadingData,
                }));
              }
            }
          } else {
            messageQueue.messageIn(new Message({
              source: pubInfo.source,
              target: subscriber,
              isLoadingData,
            }));
          }
        }
      }
      // 在监控列表中，查找发布者，如果发现则生成消息加入消息队列
      if (this.watchers.includes(publisher)) {
        messageQueue.messageIn(new Message({
          target: publisher,
          targetNs: pubInfo.sourceNs,
          isMapping: true,
          isLoadingData,
        }));
      }
      // 消息调试
      debugMsg(messageQueue);
      // 树节点遍历完成，开始遍历消息队列
    } catch (error) {
      if (formInstance.$$debugMode) {
        formInstance.$errorHandler(`控件${publisher}消息分发失败`, error);
      }
    } finally {
      formInstance.$triggerEvent('startRender');
    }
  }

  flushMsg () {
    const formInstance = this.$form;
    // 从消息队列中依次依次取出消息进行处理
    // 在消息队列未阻塞时，才可以出栈
    while (!this.messageQueue.isEmptyQueue) {
      const frontMsg = this.messageQueue.messageOut();
      try {
        let target;
        if (frontMsg.targetNs) {
          target = parsePath(formInstance, frontMsg.targetNs);
        } else {
          const targetField = frontMsg.target;
          target = formInstance[targetField];
        }
        if (target) {
          target.$push(frontMsg);
        }
      } catch (err) {
        if (formInstance.$$debugMode) {
          formInstance.$errorHandler(messageError(frontMsg), err);
        }
      }
    }
    if (formInstance.$stateMachine.hasAsync()) {
      formInstance.$stateMachine.flushAsync().then(() => {
        this.flushMsg();
      });
    } else {
      formInstance.$triggerEvent('finishRender');
    }
  }

  // 监控 用于关联表单填充
  watch (field) {
    lazyPush(this.watchers, field);
  }

  pushMsg (control, isLoadingData, namespace) {
    if (control.$$hasSubs) {
      this.messageQueue.messageIn(new Message({
        target: control.dataField,
        targetNs: namespace,
        isLoadingData,
      }));
    }
    if (control.$$hasMapping) {
      this.messageQueue.messageIn(new Message({
        target: control.dataField,
        targetNs: namespace,
        isMapping: true,
        isLoadingData,
      }));
    }
  }

  // 测试是否出现死循环
  testLoop () {
    let log = [];
    let current;
    const search = (field, isStart) => {
      if (!isStart && field === current) {
        console.warn('你死了');
        console.log(log);
        log = [];
        return;
      }
      log.push(field);
      const targets = this.pubsubs[field];
      if (targets && targets.length > 0) {
        for (const target of targets) {
          search(target);
        }
      }
    };
    for (const field in this.pubsubs) {
      log = [];
      current = field;
      search(field, true);
      console.log(log);
    }
  }
}
