// import Vue from 'vue';
import Vuex from 'vuex';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Application from '../../../src/pages/application';

jest.mock('../../../src/service/get-data');

function shuffle(arr) {
  return arr.slice().sort(() => (Math.random() > 0.5 ? 1 : -1));
}

describe('application应用页面排序功能测试', () => {
  let wrapper = null;
  const localVue = createLocalVue();
  localVue.use(Vuex);
  window.GlobalConfig = {};
  const sortedApps = (function shuffleApps() {
    const res = [];
    for (let i = 0; i < 8; i += 1) {
      res.push({
        DisplayName: `测试应用${i}`,
        SchemaCode: `D00${i}Test${i}`,
      });
    }
    return shuffle(res);
  }());
  const renderPage = () => {
    const store = new Vuex.Store({
      state: {
        appId: 'static',
        isAPaaS: true,
      },
    });
    wrapper = shallowMount(Application, {
      store,
      localVue,
    });
    return wrapper.vm.$nextTick();
  };
  beforeAll(() => {
    window.localStorage.clear();
  });
  afterAll(() => {
    window.localStorage.clear();
  });
  beforeEach(renderPage);
  afterEach(() => {
    wrapper.destroy();
  });
  test('测试将排序后的应用顺序保存到localstorage', () => {
    wrapper.vm.saveCustomAppOrder(sortedApps);
    const orderMapperStr = window.localStorage.getItem(wrapper.vm.localKey);
    const orderMapper = JSON.parse(orderMapperStr);
    for (let i = 0; i < sortedApps.length; i += 1) {
      expect(orderMapper[sortedApps[i].SchemaCode]).toBe(i);
    }
  });
  test('测试页面加载时读取localStorage中的排序数据', () => {
    const vmApps = wrapper.vm.apps;
    expect(sortedApps).toEqual(vmApps);
    window.localStorage.clear();
  });
  test('后台添加新应用，localStorage中已有排序，加载后新应用排在最后', () => {
    const localKey = wrapper.vm.localKey;
    const originApps = wrapper.vm.apps;
    const shortApps = originApps.slice(0, 5);
    const tailApps = originApps.slice(5);
    const orderMap = {};
    const shuffleApps = shuffle(shortApps);
    for (let i = 0; i < 5; i += 1) {
      orderMap[shuffleApps[i].SchemaCode] = i;
    }
    const expectedApps = shuffleApps.concat(tailApps);
    window.localStorage.clear();
    window.localStorage.setItem(localKey, JSON.stringify(orderMap));
    wrapper.destroy();
    return renderPage().then(() => {
      expect(wrapper.vm.apps).toEqual(expectedApps);
    });
  });
});
describe('application应用页面侧滑UI功能', () => {
  let wrapper = null;
  const localVue = createLocalVue();
  localVue.use(Vuex);
  window.GlobalConfig = {};
  beforeEach(() => {
    const store = new Vuex.Store({
      state: {
        appId: 'static',
        isAPaaS: true,
      },
    });
    wrapper = mount(Application, {
      store,
      localVue,
      stubs: {
        'h3-blank-page': '<div/>',
        'app-search': '<div/>',
        'h3-tool-tip': '<div class="h3-tool-tip-stub"/>',
        'h3-grid': '<div class="h3-grid-stub"/>',
        transition: '<div><slot></slot></div>',
      },
    });
    return wrapper.vm.$nextTick().then(() => {
      const appManager = wrapper.find({ name: 'app-manager' });
      appManager.find('.h3-apps-tab-more').trigger('click');
      appManager.find('.app-sort-btn').trigger('click');
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  test('点击排序按钮 开启排序', (done) => {
    localVue.config.errorHandler = done;
    const appManager = wrapper.find({ name: 'app-manager' });
    appManager.vm.$nextTick(() => {
      expect(appManager.contains('.app-sort-hint')).toBe(true);
      expect(appManager.contains({ name: 'h3-sort-item' })).toBe(true);
      done();
    });
  });
  test('点击完成触发排序', () => {
    const mockFn = jest.fn();
    wrapper.vm.saveCustomAppOrder = mockFn;
    const appManager = wrapper.find({ name: 'app-manager' });
    wrapper.vm.sortableApps = shuffle(wrapper.vm.apps);
    expect(appManager.find('.app-sort-btn').text()).toBe('完成');
    appManager.find('.app-sort-btn').trigger('click');
    expect(appManager.emitted().onHideModal.length).toBe(1);
    expect(appManager.emitted().onHideModal[0]).toEqual([true]);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  test('点击X不触发排序，直接关闭', () => {
    const mockFn = jest.fn();
    wrapper.vm.saveCustomAppOrder = mockFn;
    const appManager = wrapper.find({ name: 'app-manager' });
    appManager.find({ name: 'h3-icon' }).trigger('click');
    // expect(appManager.emitted().onHideModal.length).toBe(1);
    // expect(appManager.emitted().onHideModal[0]).toEqual([false]);
    expect(mockFn).not.toHaveBeenCalledTimes(1);
  });
  test('点击蒙尘触发应用排序', (done) => {
    localVue.config.errorHandler = done;
    const mockFn = jest.fn();
    wrapper.vm.saveCustomAppOrder = mockFn;
    const appManager = wrapper.find({ name: 'app-manager' });
    wrapper.vm.sortableApps = shuffle(wrapper.vm.apps);
    appManager.vm.$nextTick(() => {
      appManager.find('.h3-modal-mask').trigger('click');
      expect(appManager.emitted().onHideModal.length).toBe(1);
      expect(appManager.emitted().onHideModal[0]).toEqual([true]);
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    });
  });
});

