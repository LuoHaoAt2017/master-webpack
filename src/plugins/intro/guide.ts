import _get from 'lodash/get';
import _isObject from 'lodash/fp/isObject';
import _isFunction from 'lodash/fp/isFunction';

const GUIDE_KEY = 'guide';

const defaultZIndex = 99999;
const defaultOptions = {
  nextText: '下一步'
};

type Placement = 'top' | 'right' | 'bottom' | 'left';

type Position = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

type Hook = (...parmas: any) => boolean | Promise<any>;

type GuideOptions = {
  [name: string]: any;
  placement?: Placement;
  position?: Position;
  showNext?: boolean;
  showEnd?: boolean;
  toolTipClass?: string;
  nextText?: string;
  next?: Hook;
  before?: Hook;
};

type InitOptions = {
  startFrom?: number;
  total?: number;
};

class Guide {
  stepStack: Map<number, GuideOptions> = new Map();

  total: number = 1;

  options = {};

  startFrom: number = 1;

  // 当前步骤
  currentStep: number = 1;

  maskShow: boolean = false;

  leftArea: HTMLElement = null;

  rightArea: HTMLElement = null;

  topArea: HTMLElement = null;

  bottomArea: HTMLElement = null;

  operateArea: HTMLElement = null;

  endGuideArea: HTMLElement = null;

  tipsContainer: HTMLElement = null;

  hasGuid: boolean = false; // 是否引导

  get current() {
    return this.stepStack.get(this.currentStep);
  }

  constructor(options: InitOptions = {}) {
    this.nextProxy = this.nextProxy.bind(this);
    this.quit = this.quit.bind(this);
  }

  init(initOptions: InitOptions) {
    if (!_isObject(initOptions)) {
      console.error(`init 函数的参数格式是 {
        startFrom?: number;
        total?: number;
      }`);
      return;
    }
    initOptions = Object.assign(
      {},
      {
        startFrom: 1,
        total: 1,
      },
      initOptions
    );
    this.hasGuid = true;
    this.total = initOptions.total;
    this.startFrom = initOptions.startFrom;
  }

  setStep(step: number, options: GuideOptions) {
    if (!this.hasGuid) {
      return;
    }
    if (step < 1) {
      step = 1;
    }
    options = { 
      showNext: true,
      showEnd: true,
      toolTipClass: 'a-normal-placeholder',
      nextText: '我知道了',
      ...options
    };
    if (this.stepStack.has(step)) {
      const exist = this.stepStack.get(step);
      this.stepStack.set(step, options);
    } else {
      this.stepStack.set(step, options);
      if (this.startFrom === step) {
        this.currentStep = this.startFrom;
        this.start();
      }
    }
  }

  start() {
    if (this.leftArea) return;
    this.show();
  }

  back() {
    this.currentStep -= 1;
    if (this.currentStep < 1) {
      this.currentStep = 1;
    }
    this.startFrom = this.currentStep;
    this.update();
  }

  async next() {
    if (!this.hasGuid) {
      return;
    }
    if (this.currentStep + 1 > this.total) {
      this.quit();
      return;
    }
    const action = () => {
      this.currentStep += 1;
      this.startFrom = this.currentStep;
      this.update();
    };
    this.nextHandler(action);
  }

  async nextHandler(callback: Function) {
    if (this.current) {
      if (this.current.next) {
        if (!_isFunction(this.current.next)) {
          console.error('next需要是一个返回boolean值的勾子函数');
          return;
        }
        const ret = await this.current.next(this.currentStep);
        if (ret) {
          callback();
        }
      } else {
        callback();
      }
    }
  }

  nextProxy(e) {
    if (!this.stepStack.get(this.currentStep + 1)) {
      this.hide();
      return;
    }
    const { target } = e;
    if (target.classList && target.classList.contains('h3-guide-tips-operate')) {
      this.next();
    }
  }

  async beforeHandler(callback: Function) {
    if (this.current) {
      if (this.current.before) {
        if (!_isFunction(this.current.before)) {
          console.error('before需要是一个返回boolean值的勾子函数');
          return;
        }
        const ret = await this.current.before(this.currentStep);
        if (ret) {
          callback();
        }
      } else {
        callback();
      }
    }
  }

  go(no: number) {
    const pad = this.total - no;
    const going = pad >= 0 ? no : Math.abs(pad);
    this.currentStep = going;
    this.startFrom = this.currentStep;
    this.update();
  }

  update() {
    const action = () => {
      this.updateRect(this.current);
    };
    this.beforeHandler(action);
  }

  show() {
    if (!this.hasGuid) {
      return;
    }
    const step = this.current;
    if (!this.leftArea) {
      this.createMask(step);
    } else {
      if (!this.maskShow) {
        this.leftArea.style.opacity = '1';
        this.leftArea.style.zIndex = step.zIndex || defaultZIndex;
        this.rightArea.style.opacity = '1';
        this.rightArea.style.zIndex = step.zIndex || defaultZIndex;
        this.topArea.style.opacity = '1';
        this.topArea.style.zIndex = step.zIndex || defaultZIndex;
        this.bottomArea.style.opacity = '1';
        this.bottomArea.style.zIndex = step.zIndex || defaultZIndex;
        this.tipsContainer.style.opacity = '1';
        this.operateArea.style.display = step.showNext ? 'block' : 'none';
        this.endGuideArea.style.display = step.showEnd ? 'block': 'none';
        const oldTipClass = this.stepStack.get(this.currentStep - 1).toolTipClass;
        if (oldTipClass) {
          this.tipsContainer.classList.remove(oldTipClass);
        }
        if (step.toolTipClass) {
          this.tipsContainer.classList.add(step.toolTipClass);
        }
        this.operateArea.innerHTML = step.nextText;
      }
    }
  }

  hide() {
    if (!this.leftArea) {
      return;
    }
    this.maskShow = false;
    this.leftArea.style.opacity = '0';
    this.leftArea.style.zIndex = '-1000';
    this.rightArea.style.opacity = '0';
    this.rightArea.style.zIndex = '-1000';
    this.topArea.style.opacity = '0';
    this.topArea.style.zIndex = '-1000';
    this.bottomArea.style.opacity = '0';
    this.bottomArea.style.zIndex = '-1000';
    this.tipsContainer.style.opacity = '0';
    this.operateArea.style.display = 'none';
    this.endGuideArea.style.display = 'none';
  }

  createMask(step: GuideOptions) {
    const el = step.el;
    const rect = el.getBoundingClientRect();
    if (rect) {
      const mask = this.createRect(step);
      document.body.appendChild(mask);
      this.maskShow = true;
      this.createTipsContainer(rect, step);
    } else {
      console.error('找不到绑定的引导元素');
    }
  }

  createRect(step: GuideOptions) {
    const rect = step.el.getBoundingClientRect();
    const frament = document.createDocumentFragment();
    this.leftArea = this.createAreaLeft(rect, step);
    this.rightArea = this.createAreaRight(rect, step);
    this.topArea = this.createAreaTop(rect, step);
    this.bottomArea = this.createAreaBottom(rect, step);
    const around = [
      this.leftArea,
      this.rightArea,
      this.topArea,
      this.bottomArea
    ];
    around.map(area => {
      frament.appendChild(area);
    });
    this.createOpearteDom(frament, step);
    return frament;
  }

  createOpearteDom (frament: any, step) {
    const operate = document.querySelector('.h3-guide-tips-operate');
    const endGuide = document.querySelector('.h3-guide-tips-endguide');
    if (!operate) {
      this.operateArea = document.createElement('div');
      this.operateArea.classList.add('h3-guide-tips-operate');
      this.operateArea.innerHTML = step.nextText;
      this.operateArea.addEventListener('click', this.nextProxy);
      if (!step.showNext) {
        this.operateArea.style.display = 'none';
      }
      frament.appendChild(this.operateArea);
    }
    if (!endGuide) {
      this.endGuideArea = document.createElement('div');
      this.endGuideArea.classList.add('h3-guide-tips-endguide');
      this.endGuideArea.innerHTML = '结束引导';
      this.endGuideArea.addEventListener('click', this.quit);
      if (!step.showEnd) {
        this.endGuideArea.style.display = 'none';
      }
      frament.appendChild(this.endGuideArea);
    }
  }

  createTipsContainer(rect: DOMRect, step: GuideOptions) {
    const placement: Placement = step.placement || 'right';
    const position = _get(step, 'position', {});
    const tips = document.createElement('div');
    tips.dataset.placement = placement;
    tips.classList.add('h3-guide-tips', placement);
    if (step.toolTipClass) {
      tips.classList.add(step.toolTipClass);
    }

    const $content = document.createElement('div');
    $content.classList.add('h3-guide-tips-content');
    const content = `
      <span>${step.content}</span>
    `;
    $content.innerHTML = content;

    // const $operate = document.createElement('div');
    // $operate.classList.add('h3-guide-tips-operate');
    // $operate.innerHTML = '我知道了';
    // $operate.addEventListener('click', this.nextProxy);
    tips.appendChild($content);
    // tips.appendChild($operate);
    this.handelTipsPosition(tips, rect, placement, position);
    this.tipsContainer = tips;
  }

  updateRect(step: GuideOptions) {
    const el = step.el;
    const rect = el.getBoundingClientRect();
    if (rect) {
      const oldClass = _get(this.tipsContainer, 'dataset.placement', 'right');
      const placement = step.placement || 'right';
      const position = _get(step, 'position', {});
      this.tipsContainer.dataset.placement = placement;
      this.tipsContainer.classList.remove(...this.tipsContainer.classList);
      this.tipsContainer.classList.add('h3-guide-tips', placement, step.toolTipClass);
      const $content = this.tipsContainer.querySelector(
        '.h3-guide-tips-content span'
      );
      this.operateArea.innerHTML = step.nextText;
      $content.innerHTML = step.content;
      // const $count = this.tipsContainer.querySelector('.h3-guide-tips-count');
      // $count.innerHTML = `${this.currentStep}/${this.total}`;
      const oldMap: {
        [name: string]: HTMLElement;
      } = {
        left: this.leftArea,
        right: this.rightArea,
        top: this.topArea,
        bottom: this.bottomArea
      };
      const oldContainer = oldMap[oldClass];
      // 先输出原先的旧容器
      oldContainer.firstChild.remove();
      this.tipsContainer.style.top = this.tipsContainer.style.left = this.tipsContainer.style.right = this.tipsContainer.style.bottom =
        '';
      this.handelTipsPosition(this.tipsContainer, rect, placement, position);
      this.leftArea.style.width = `${rect.left}px`;
      this.rightArea.style.left = `${rect.right}px`;
      this.topArea.style.left = `${rect.left}px`;
      this.topArea.style.width = `${rect.width}px`;
      this.topArea.style.height = `${rect.top}px`;
      this.bottomArea.style.top = `${rect.bottom}px`;
      this.bottomArea.style.left = `${rect.left}px`;
      this.bottomArea.style.width = `${rect.width}px`;
      this.leftArea.style.zIndex = this.rightArea.style.zIndex = this.topArea.style.zIndex = this.bottomArea.style.zIndex =
        step.zIndex || `${defaultZIndex}`;
      this.operateArea.style.display = step.showNext ? 'block' : 'none';
      this.endGuideArea.style.display = step.showEnd ? 'block' : 'none';
    } else {
      console.error('找不到绑定的引导元素');
    }
  }

  handelTipsPosition(
    container: HTMLElement,
    rect: DOMRect,
    placement: Placement,
    position?: Position
  ) {
    container.classList.add('animate');
    switch (placement) {
      case 'right':
        container.style.top = `${position.top || rect.top + 'px'}`;
        container.style.left = `${position.left || '20px'}`;
        position.right && (container.style.right = position.right);
        position.bottom && (container.style.bottom = position.bottom);
        this.rightArea.appendChild(container);
        break;
      case 'bottom':
        container.style.top = `${position.top || '20px'}`;
        container.style.left = position.left ? `${position.left}` : '50%';
        position.right && (container.style.right = position.right);
        position.bottom && (container.style.bottom = position.bottom);
        this.bottomArea.appendChild(container);
        break;
      case 'left':
        container.style.top = `${position.top || rect.top + 'px'}`;
        container.style.right = `${position.right || '20px'}`;
        position.left && (container.style.left = position.left);
        position.bottom && (container.style.bottom = position.bottom);
        this.leftArea.appendChild(container);
        break;
      case 'top':
        container.style.bottom = `${position.bottom || '10px'}`;
        container.style.left = position.left ? `${position.left}` : '50%';
        position.right && (container.style.right = position.right);
        position.top && (container.style.top = position.top);
        this.topArea.appendChild(container);
        break;
    }
    const timer = window.setTimeout(() => {
      container.classList.remove('animate');
      window.clearTimeout(timer);
    }, 600);
  }

  createAreaLeft(rect: DOMRect, step: GuideOptions) {
    const left = document.createElement('div');
    left.classList.add('h3-guide-mask');
    left.style.top = '0';
    left.style.bottom = '0';
    left.style.width = rect.left + 'px';
    step.zIndex && (left.style.zIndex = step.zIndex);
    return left;
  }

  createAreaRight(rect: DOMRect, step: GuideOptions) {
    const right = document.createElement('div');
    right.classList.add('h3-guide-mask');
    right.style.top = '0';
    right.style.bottom = '0';
    right.style.left = rect.right + 'px';
    right.style.right = '0';
    step.zIndex && (right.style.zIndex = step.zIndex);
    return right;
  }

  createAreaTop(rect: DOMRect, step: GuideOptions) {
    const top = document.createElement('div');
    top.classList.add('h3-guide-mask');
    top.style.top = '0';
    top.style.left = rect.left + 'px';
    top.style.width = rect.width + 'px';
    top.style.height = rect.top + 'px';
    step.zIndex && (top.style.zIndex = step.zIndex);
    return top;
  }

  createAreaBottom(rect: DOMRect, step: GuideOptions) {
    const bottom = document.createElement('div');
    bottom.classList.add('h3-guide-mask');
    bottom.style.top = rect.bottom + 'px';
    bottom.style.bottom = '0';
    bottom.style.left = rect.left + 'px';
    bottom.style.width = rect.width + 'px';
    step.zIndex && (bottom.style.zIndex = step.zIndex);
    return bottom;
  }

  quit() {
    if (!this.hasGuid) {
      return;
    }
    document.body.removeChild(this.leftArea);
    document.body.removeChild(this.rightArea);
    document.body.removeChild(this.topArea);
    document.body.removeChild(this.bottomArea);
    document.body.removeChild(this.operateArea);
    document.body.removeChild(this.endGuideArea);
    this.endGuideArea = this.operateArea = this.leftArea = this.rightArea = this.topArea = this.bottomArea = null;
    this.tipsContainer = null;
    this.currentStep = 1;
    window[GUIDE_KEY] = null;
    this.hasGuid = false;
  }
}

if (!window[GUIDE_KEY]) {
  window[GUIDE_KEY] = new Guide();
}

const proxy: Guide = window[GUIDE_KEY];

export default proxy;
