import { mount } from '@vue/test-utils';
import AppManager from '../../../../src/components/app/app-manager';
import { generateAppDatas } from '../../../__mocks__/mockData/queryAppDatas';

const recentAppCode = 'SYS_RecentModule';

describe('AppManager 单应用', () => {
  let wrapper;
  const appDatas = generateAppDatas(1, true);
  beforeEach(() => {
    wrapper = mount(AppManager, {
      propsData: {
        tabApps: appDatas.Apps,
        appGroups: appDatas.AppGroups,
        wrapperTop: 44,
        page: 'apps',
      },
      attachToDocument: true,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  // 单应用，单个标签
  it('只有一个应用时，不显示tab栏', () => {
    expect(wrapper.contains('.h3-tab')).toBe(false);
    expect(wrapper.vm.tabHeight).toBe(0);
  });
  // 单应用，两个标签（应用本身和最近使用）
  it('大于1小于3个应用显示tab栏但不应显示更多按钮', () => {
    const recentAppGroup = {
      SchemaCode: recentAppCode,
      GroupCode: recentAppCode,
      AppCode: recentAppCode,
      DisplayName: '最近使用',
      Childrens: appDatas.RecentModules,
    };
    appDatas.Apps.unshift(recentAppGroup);
    appDatas.AppGroups.unshift(recentAppGroup);
    expect(wrapper.contains('.h3-apps-tab-more')).toBe(false);
  });
});

describe('AppManager 多应用', () => {
  let wrapper = {};
  const appDatas = generateAppDatas(4, true, { groupCount: 1, formCount: 4 });
  const recentAppGroup = {
    SchemaCode: recentAppCode,
    AppCode: recentAppCode,
    GroupCode: recentAppCode,
    DisplayName: '最近使用',
    Childrens: appDatas.RecentModules,
  };
  appDatas.Apps.unshift(recentAppGroup);
  appDatas.AppGroups.unshift(recentAppGroup);
  beforeEach(() => {
    wrapper = mount(AppManager, {
      propsData: {
        tabApps: appDatas.Apps,
        appGroups: appDatas.AppGroups,
        wrapperTop: 44,
        page: 'setting',
        appClass: 'app-test-class',
      },
      scopedSlots: {
        // modal: '<div slot-scope="{gotoApp, selectedApp}" class="app-manager-list">' +
        // '<div id="test-modal" @click="gotoApp(\'SYS_RecentModule\')">{{selectedApp}}</div>' +
        // '</div>',
        modal: function modal({ gotoApp, selectedApp }) {
          return this.$createElement('div', {
            class: {
              'app-manager-list': true,
            },
          }, [
            this.$createElement('div', {
              attrs: { id: 'test-modal' },
              on: {
                click: () => gotoApp('SYS_RecentModule'),
              },
            }, selectedApp),
          ]);
        },
      },
      attachToDocument: true,
    });
    return wrapper.vm.$nextTick();
  });
  afterEach(() => {
    wrapper.destroy();
  });
  test('多个应用时，点击tab跳转到相应应用', () => {
    const mockupFn = jest.fn();
    wrapper.setMethods({ scrollByStep: mockupFn });
    const code = appDatas.Apps[2].SchemaCode;
    wrapper.findAll({ name: 'h3-tab-item' }).at(2).trigger('click');
    expect(wrapper.vm.activeCode).toBe(code);
  });
  test('测试应用点击事件以及自定义class', () => {
    const testApps = wrapper.findAll('.app-test-class>div:first-child');
    // 在所有应用中随机选一个应用
    const targetIndex = Math.floor(Math.random() * (testApps.length - 1));
    const targetApp = testApps.at(targetIndex);
    targetApp.trigger('click');
    const emitted = wrapper.emitted().onAppClick;
    expect(emitted).toBeTruthy();
    expect(emitted[0][0].DisplayName).toEqual(targetApp.text());
  });
  test('page设置为setting应显示+-图标', () => {
    expect(wrapper.find('.h3-grid-appstate-icon').exists()).toBe(true);
  });
  test('点击更多侧滑蒙尘出现，并测试作用域插槽', () => {
    const target = appDatas.Apps[2];
    wrapper.findAll({ name: 'h3-tab-item' }).at(2).trigger('click');
    wrapper.find('.h3-apps-tab-more').trigger('click');
    const modalContainer = wrapper.find('.h3-modal-container');
    expect(modalContainer.isVisible()).toBe(true);
    expect(modalContainer.text()).toBe(target.SchemaCode);
  });
  test('测试作用域插槽内点击应用跳转', () => {
    jest.useFakeTimers();
    const spyGoToApp = jest.spyOn(wrapper.vm, 'gotoApp');
    const mockupFn = jest.fn();
    wrapper.setMethods({ scrollByStep: mockupFn });
    wrapper.find('.h3-apps-tab-more').trigger('click');
    const modalContainer = wrapper.find('.h3-modal-container');
    const clickEvt = new Event('click');
    modalContainer.element.querySelector('#test-modal').dispatchEvent(clickEvt);
    expect(spyGoToApp).toBeCalledWith('SYS_RecentModule');
    jest.runAllTimers();
    expect(mockupFn).toBeCalled();
  });
});

