// <template>
//   <div 
//     @onTouchStart="_handleTouchStart"
//     @onTouchMove="_handleTouchMove" 
//     @onTouchCancel="_handleTouchCancel"
//     @onTouchEnd="_handleTouchEnd"
//     :style="wrapStyle">
//     <slot></slot>
//   </div>
// </template>

<script>
import {
  calcRotation,
  getEventName, now,
  calcMutliFingerStatus, calcMoveStatus,
  shouldTriggerSwipe, shouldTriggerDirection,
  getDirection, getDirectionEventName,
} from './util';
import { PRESS, DIRECTION_ALL, DIRECTION_VERTICAL, DIRECTION_HORIZONTAL } from './config';

const directionMap = {
  all: DIRECTION_ALL,
  vertical: DIRECTION_VERTICAL,
  horizontal: DIRECTION_HORIZONTAL,
};

export default {
  name: 'h3-gesture',
  props: {
    // config options
    enableRotate: {
      type: Boolean,
      default: false,
    },
    enablePinch: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: 'String',
      default: 'all',
    }, // 'all' | 'vertical' | 'horizontal';
    onPinch: Function,
    onPinchStart: Function,
    onPinchMove: Function,
    onPinchEnd: Function,
    onPinchCancel: Function,
    onPinchIn: Function,
    onPinchOut: Function,
    onRotate: Function,
    onRotateStart: Function,
    onRotateMove: Function,
    onRotateEnd: Function,
    onRotateCancel: Function,
    onPan: Function,
    onPanStart: Function,
    onPanMove: Function,
    onPanEnd: Function,
    onPanCancel: Function,
    onPanLeft: Function,
    onPanRight: Function,
    onPanUp: Function,
    onPanDown: Function,

    // tap
    onTap: Function,

    // long tap
    onPress: Function,
    onPressUp: Function,

    // swipe
    onSwipe: Function,
    onSwipeLeft: Function,
    onSwipeRight: Function,
    onSwipeUp: Function,
    onSwipeDown: Function,
  },
  data() {
    return {
      directionSetting: directionMap[this.direction],
      gesture: {
        startTime: null,
        startTouches: [],

        startMutliFingerStatus: [],

        /* now status snapshot */
        time: null,
        touches: [],

        mutliFingerStatus: [],

        /* delta status from touchstart to now, just for singe finger */
        moveStatus: null,

        /* whether is a long tap */
        press: false,

        /* whether is a pan */
        pan: false,

        /* whether is a swipe */
        swipe: false,
        direction: null,

        /* whether is in pinch process */
        pinch: false,
        scale: null,

        /* whether is in rotate process */
        rotate: false,
        rotation: null,
      },
      event: null,
      pressTimer: null,
    };
  },
  methods: {
    triggerEvent(name, ...args) {
      const cb = this[name];
      if (cb && typeof cb === 'function') {
        // always give user gesture object as first params first
        cb(this.getGestureState(), ...args);
      }
    },
    triggerCombineEvent(mainEventName, eventStatus, ...args) {
      this.triggerEvent(mainEventName, ...args);
      this.triggerSubEvent(mainEventName, eventStatus, ...args);
    },
    triggerSubEvent(mainEventName, eventStatus, ...args) {
      if (eventStatus) {
        const subEventName = getEventName(mainEventName, eventStatus);
        this.triggerEvent(subEventName, ...args);
      }
    },
    triggerPinchEvent(mainEventName, eventStatus, ...args) {
      const { scale } = this.gesture;
      if (eventStatus === 'move' && typeof scale === 'number') {
        if (scale > 1) {
          this.triggerEvent('onPinchOut');
        }
        if (scale < 1) {
          this.triggerEvent('onPinchIn');
        }
      }
      this.triggerCombineEvent(mainEventName, eventStatus, ...args);
    },
    initPressTimer() {
      this.cleanPressTimer();
      this.pressTimer = setTimeout(() => {
        this.setGestureState({
          press: true,
        });
        this.triggerEvent('onPress');
      }, PRESS.time);
    },
    cleanPressTimer() {
      /* tslint:disable:no-unused-expression */
      if (this.pressTimer) {
        clearTimeout(this.pressTimer);
      }
    },
    setGestureState(params) {
      if (!this.gesture) {
        this.gesture = {};
      }
      this.gesture = {
        ...this.gesture,
        ...params,
      };
    },
    getGestureState() {
      if (!this.gesture) {
        return this.gesture;
      }
      return {
        ...this.gesture,
      };
    },
    cleanGestureState() {
      delete this.gesture;
    },
    getTouches(e) {
      return Array.prototype.slice.call(e.touches).map(item => ({
        x: item.screenX,
        y: item.screenY,
      }));
    },
    triggerUserCb(status, e) {
      const cbName = getEventName('onTouch', status);
      if (cbName in this) {
        this[cbName](e);
      }
    },
    handleTouchStart(e) {
      this.triggerUserCb('start', e);
      this.event = e;
      if (e.touches.length > 1) {
        e.preventDefault();
      }
      this.initGestureStatus(e);
      this.initPressTimer();
      this.checkIfMultiTouchStart();
    },
    initGestureStatus(e) {
      this.cleanGestureState();
      // store the gesture start state
      const startTouches = this.getTouches(e);
      const startTime = now();
      const startMutliFingerStatus = calcMutliFingerStatus(startTouches);
      this.setGestureState({
        startTime,
        startTouches,
        startMutliFingerStatus,
        /* copy for next time touch move cala convenient */
        time: startTime,
        touches: startTouches,
        mutliFingerStatus: startMutliFingerStatus,
      });
    },
    checkIfMultiTouchStart() {
      const { enablePinch, enableRotate } = this;
      const { touches } = this.gesture;
      if (touches.length > 1 && (enablePinch || enableRotate)) {
        if (enablePinch) {
          const startMutliFingerStatus = calcMutliFingerStatus(touches);
          this.setGestureState({
            startMutliFingerStatus,

            /* init pinch status */
            pinch: true,
            scale: 1,
          });
          this.triggerCombineEvent('onPinch', 'start');
        }
        if (enableRotate) {
          this.setGestureState({
            /* init rotate status */
            rotate: true,
            rotation: 0,
          });
          this.triggerCombineEvent('onRotate', 'start');
        }
      }
    },
    handleTouchMove(e) {
      this.triggerUserCb('move', e);
      this.event = e;
      if (!this.gesture) {
        // sometimes weird happen: touchstart -> touchmove..touchmove..
        // --> touchend --> touchmove --> touchend
        // so we need to skip the unnormal event cycle after touchend
        return;
      }

      // not a long press
      this.cleanPressTimer();

      this.updateGestureStatus(e);
      this.checkIfSingleTouchMove();
      this.checkIfMultiTouchMove();
    },
    checkIfMultiTouchMove() {
      const { pinch, rotate, touches, startMutliFingerStatus, mutliFingerStatus } = this.gesture;
      if (!pinch && !rotate) {
        return;
      }
      if (touches.length < 2) {
        this.setGestureState({
          pinch: false,
          rotate: false,
        });
        // Todo: 2 finger -> 1 finger, wait to test this situation
        if (pinch) {
          this.triggerCombineEvent('onPinch', 'cancel');
        }
        if (rotate) {
          this.triggerCombineEvent('onRotate', 'cancel');
        }
        return;
      }

      if (pinch) {
        const scale = mutliFingerStatus.z / startMutliFingerStatus.z;
        this.setGestureState({
          scale,
        });
        this.triggerPinchEvent('onPinch', 'move');
      }
      if (rotate) {
        const rotation = calcRotation(startMutliFingerStatus, mutliFingerStatus);
        this.setGestureState({
          rotation,
        });
        this.triggerCombineEvent('onRotate', 'move');
      }
    },
    allowGesture() {
      return shouldTriggerDirection(this.gesture.direction, this.directionSetting);
    },
    checkIfSingleTouchMove() {
      const { pan, touches, moveStatus } = this.gesture;
      if (touches.length > 1) {
        this.setGestureState({
          pan: false,
        });
        // Todo: 1 finger -> 2 finger, wait to test this situation
        if (pan) {
          this.triggerCombineEvent('onPan', 'cancel');
        }
        return;
      }
      if (moveStatus) {
        const { x, y } = moveStatus;
        const direction = getDirection(x, y);
        this.setGestureState({
          direction,
        });
        const eventName = getDirectionEventName(direction);
        if (!this.allowGesture()) {
          return;
        }
        if (!pan) {
          this.triggerCombineEvent('onPan', 'start');
          this.setGestureState({
            pan: true,
          });
        } else {
          this.triggerCombineEvent('onPan', eventName);
          this.triggerSubEvent('onPan', 'move');
        }
      }
    },
    checkIfMultiTouchEnd(status) {
      const { pinch, rotate } = this.gesture;
      if (pinch) {
        this.triggerCombineEvent('onPinch', status);
      }
      if (rotate) {
        this.triggerCombineEvent('onRotate', status);
      }
    },
    updateGestureStatus(e) {
      const time = now();
      this.setGestureState({
        time,
      });
      if (!e.touches || !e.touches.length) {
        return;
      }
      const { startTime, startTouches, pinch, rotate } = this.gesture;
      const touches = this.getTouches(e);
      const moveStatus = calcMoveStatus(startTouches, touches, time - startTime);
      let mutliFingerStatus;
      if (pinch || rotate) {
        mutliFingerStatus = calcMutliFingerStatus(touches);
      }

      this.setGestureState({
        /* update status snapshot */
        touches,
        mutliFingerStatus,
        /* update duration status */
        moveStatus,

      });
    },
    handleTouchEnd(e) {
      this.triggerUserCb('end', e);
      this.event = e;
      if (!this.gesture) {
        return;
      }
      this.cleanPressTimer();
      this.updateGestureStatus(e);
      this.doSingleTouchEnd('end');
      this.checkIfMultiTouchEnd('end');
    },
    handleTouchCancel(e) {
      this.triggerUserCb('cancel', e);
      this.event = e;
      // Todo: wait to test cancel case
      if (!this.gesture) {
        return;
      }
      this.cleanPressTimer();
      this.updateGestureStatus(e);
      this.doSingleTouchEnd('cancel');
      this.checkIfMultiTouchEnd('cancel');
    },
    triggerAllowEvent(type, status) {
      if (this.allowGesture()) {
        this.triggerCombineEvent(type, status);
      } else {
        this.triggerSubEvent(type, status);
      }
    },
    doSingleTouchEnd(status) {
      const { moveStatus, pinch, rotate, press, pan, direction } = this.gesture;

      if (pinch || rotate) {
        return;
      }
      if (moveStatus) {
        const { z, velocity } = moveStatus;
        const swipe = shouldTriggerSwipe(z, velocity);
        this.setGestureState({
          swipe,
        });
        if (pan) {
          // pan need end, it's a process
          // sometimes, start with pan left, but end with pan right....
          this.triggerAllowEvent('onPan', status);
        }
        if (swipe) {
          const directionEvName = getDirectionEventName(direction);
          // swipe just need a direction, it's a endpoint
          this.triggerAllowEvent('onSwipe', directionEvName);
          return;
        }
      }

      if (press) {
        this.triggerEvent('onPressUp');
        return;
      }
      this.triggerEvent('onTap');
    },
    getTouchAction() {
      const { enablePinch, enableRotate } = this.props;
      const { directionSetting } = this;
      if (enablePinch || enableRotate || directionSetting === DIRECTION_ALL) {
        return 'pan-x pan-y';
      }
      if (directionSetting === DIRECTION_VERTICAL) {
        return 'pan-x';
      }
      if (directionSetting === DIRECTION_HORIZONTAL) {
        return 'pan-y';
      }
      return 'auto';
    },
  },
  computed: {
    wrapStyle() {
      return this.getTouchAction();
    },
  },
  beforeDestroy() {
    this.cleanPressTimer();
  },
  render(h) {
    const child = this.$slots.default[0];
    const events = {
      touchstart: this.handleTouchStart,
      touchmove: this.handleTouchMove,
      touchcancel: this.handleTouchCancel,
      touchend: this.handleTouchEnd,
    };
    if (child.componentOptions) {
      // slot里面为vue组件
      return h(child.componentOptions.tag, {
        class: `${child.data.class} ${child.data.staticClass}`,
        style: {
          ...this.wrapStyle,
          ...child.data.style,
          ...child.data.staticStyle,
        },
        on: {
          ...events,
          ...child.data.on,
        },
        nativeOn: child.data.nativeOn,
        attrs: child.data.attrs,
        props: child.componentOptions.propsData,
        key: child.data.key,
        ref: child.data.ref,
      }, child.componentOptions.children);
    }
    // slot 里面内容为html内容
    return h(child.tag, {
      class: `${child.data.class} ${child.data.staticClass}`,
      style: {
        ...this.wrapStyle,
        ...child.data.style,
        ...child.data.staticStyle,
      },
      on: {
        ...events,
        ...child.data.on,
      },
      nativeOn: child.data.nativeOn,
      attrs: child.data.attrs,
      key: child.data.key,
      ref: child.data.ref,
    }, child.children);
  },
};
</script>

