import { debugState } from '../../utils/debug';
import { State, StateHook } from '../../utils/constants';
import { pairsForIn, isFunction } from '../../utils';

export function LifeState (formInstance, options) {
  this.stateFlow = [State.CREATE, State.INIT, State.READY];
  this.state = State.NONE;
  this.asyncId = 0;
  this.pendingPromise = [];
  this.asyncCompleteCbs = [];
  this.hooks = {};
  this.hasLoop = false;
  pairsForIn(options, (key, func) => {
    if (StateHook[key]) {
      this.hooks[key] = func.bind(formInstance);
    }
  });
}

LifeState.prototype.stateHandler = {
  [State.NONE]: {
    guard: () => true,
  },
  // 在表单构造函数执行时开始，至所有逻辑控件实例生成为止
  [State.CREATE]: {
    guard: nextState => (nextState === State.INIT),
    hook: StateHook.onCreate,
  },
  // 逻辑层构造完毕，开始做初始化渲染和初始化各种规则的结果，初始化完毕时结束
  [State.INIT]: {
    guard (nextState) {
      // return nextState === State.READY && !this.hasAsync() && !this.hasLoop;
      return nextState === State.READY;
    },
    hook: StateHook.onInit,
  },
  // 就绪状态，表单加载完成，初始化完成
  [State.READY]: {
    guard: nextState => (nextState === State.UPDATE ||
      nextState === State.ONACTION),
    hook: StateHook.onReady,
  },
  // 空闲状态，无用户操作，初始化完全结束
  [State.IDLE]: {
    guard: nextState => (nextState === State.UPDATE ||
      nextState === State.ONACTION),
  },
  // 由用户操作触发修改时开始，至本次操作相关的计算都完成时结束
  [State.UPDATE]: {
    guard (nextState) {
      return nextState === State.IDLE && !this.hasAsync();
    },
    hook: StateHook.onUpdate,
  },
  [State.ONACTION]: {
    guard: nextState => (nextState === State.IDLE),
  },
};
LifeState.prototype.changeState = function changeState (state) {
  const stateHandler = this.stateHandler;
  const lastState = this.state;
  const oldStateHandler = stateHandler[lastState];
  if (oldStateHandler) {
    const guard = oldStateHandler.guard;
    if (guard.call(this, state)) {
      const newStateHandler = stateHandler[state];
      this.callHook(newStateHandler.preHook);
      this.state = state;
      // const transition = newStateHandler.transition;
      // if (transition) {
      //   transition.call(this, lastState);
      // }
      debugState(state);
      this.callHook(newStateHandler.hook);
      return true;
    }
  }
  return false;
};
LifeState.prototype.stateCirculate = async function stateCirculate () {
  const nextState = this.stateFlow.shift();
  if (!nextState) return;
  this.changeState(nextState);
  if (this.stateFlow.length > 0) {
    await this.flushAsync();
    this.stateCirculate();
  }
};
LifeState.prototype.hasAsync = function hasAsync () {
  return this.pendingPromise.length > 0 || this.asyncCompleteCbs.length > 0 || this.hasLoop;
};

LifeState.prototype.onAsyncComplete = function onAsyncComplete (callback) {
  this.asyncCompleteCbs.push(callback);
};
LifeState.prototype.triggerAsyncComplete = function triggerAsyncComplete () {
  const cbs = this.asyncCompleteCbs;
  this.asyncCompleteCbs = [];
  for (const cb of cbs) {
    cb();
  }
};
LifeState.prototype.flushAsync = function flushAsync () {
  const machine = this;
  return new Promise(function flush (resolve) {
    if (machine.pendingPromise.length > 0) {
      machine.onAsyncComplete(() => {
        flush(resolve);
      });
    } else {
      resolve();
    }
  });
};
LifeState.prototype.callHook = function callHook (hookName) {
  if (hookName && this.hooks[hookName] && isFunction(this.hooks[hookName])) {
    this.hooks[hookName]();
  }
};

export const lifestateMixin = {
  async $triggerEvent (eventName) {
    if (eventName === 'startRender') {
      this.$stateMachine.changeState(State.UPDATE);
    }
    if (eventName === 'finishRender') {
      this.$stateMachine.changeState(State.IDLE);
    }
    if (eventName === 'doAction') {
      this.$stateMachine.changeState(State.ONACTION);
    }
    if (eventName === 'actionDone') {
      await this.$stateMachine.flushAsync();
      this.$stateMachine.changeState(State.IDLE);
    }
  },
  $hangupAsync () {
    this.$stateMachine.asyncId += 1;
    if (this.$stateMachine.pendingPromise) {
      this.$stateMachine.pendingPromise.push(this.$stateMachine.asyncId);
    }
    return this.$stateMachine.asyncId;
  },
  $resolveAsync (id) {
    const pendingPromise = this.$stateMachine.pendingPromise;
    if (pendingPromise) {
      const index = pendingPromise.indexOf(id);
      if (index > -1) {
        pendingPromise.splice(index, 1);
      }
      if (pendingPromise.length === 0) {
        this.$stateMachine.triggerAsyncComplete();
      }
    }
  },
  // 异步结果报错的时候
  $rejectAsync () {
    // 清掉当前进行中的异步队列
    this.$stateMachine.pendingPromise = [];
    // 触发异步完成的回调
    this.$stateMachine.triggerAsyncComplete();
    // 重置表单状态为空闲状态
    this.$stateMachine.changeState(State.IDLE);
    console.log('异步结果报错');
  },
  $nextLoop (callback) {
    if (callback) {
      if (this.$stateMachine.pendingPromise && this.$stateMachine.pendingPromise.length > 0) {
        this.$stateMachine.hasLoop = true;
        this.$stateMachine.onAsyncComplete(() => {
          callback.call(this);
          this.$stateMachine.hasLoop = false;
        });
      } else {
        callback.call(this);
      }
    }
  },
  $destroy () {
    this.$isDestroyed = true;
  },
};
