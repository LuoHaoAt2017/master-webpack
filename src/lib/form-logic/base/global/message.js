import { Mark } from '../../utils/constants';

let midCount = 0;

export class MessageQueue {
  constructor() {
    midCount = 0;
    this.queue = [];
    this.block = true;
  }
  // 消息队列 队尾入队
  messageIn(message) {
    if (this.block) return;
    this.queue.push(message);
  }
  // 消息队列 队头出队
  messageOut() {
    if (this.block) {
      return null;
    }
    return this.queue.shift();
  }
  // 清空队列
  clearQueue() {
    this.queue = [];
  }
  // 阻塞队列
  blockQueue() {
    this.block = true;
  }
  unblockQueue() {
    this.block = false;
  }
  get isEmptyQueue() {
    return this.queue.length === 0;
  }
}

export class Message {
  constructor(options) {
    const {
      source, target, sourceNs, targetNs, mark,
    } = options;
    midCount += 1;
    this.mid = midCount;
    this.target = target;
    this.mark = mark || Mark.ALL;
    if (source) {
      this.source = source;
    }
    if (sourceNs) {
      this.sourceNs = sourceNs;
    }
    if (targetNs) {
      this.targetNs = targetNs;
    }
    if ('isRoot' in options) {
      this.isRoot = options.isRoot;
    }
    if ('isMapping' in options) {
      this.isMapping = options.isMapping;
    }
    if ('isLinkMapping' in options) {
      this.isLinkMapping = options.isLinkMapping;
    }
    if ('isLoadingData' in options) {
      this.isLoadingData = options.isLoadingData;
    }
    if ('payload' in options) {
      this.payload = options.payload;
    }
  }
}

export function messageError(msg, error) {
  const targetField = msg.target ? `到${msg.target}` : '发出的';
  return `由 ${msg.source}${targetField} Message; error: ${error && error.message}`;
}

