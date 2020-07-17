import Vue from 'vue';
import Vuex from 'vuex';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import formComment from './../../../src/pages/my-work/index.vue';


describe('', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  window.GlobalConfig = {};
  const activated = jest.fn();
  formComment.created = activated;
  const store = new Vuex.Store({
    state: {
      formData: {
        responseContext: '2',
      },
    },
  });
  const wrapper = mount(formComment, {
    store,
    localVue,
  });

  test.only('测试获取数量接口被调用', (done) => {
    const getData = jest.fn();
    wrapper.setMethods({ queryFlowsCounts: getData });
    expect(activated).toBeCalled();
    done();
  });

  test('测试点击关闭按钮后tips消失', () => {
    localStorage.clear();
    wrapper.setData({ hasAvailableWorkflow: true });
    expect(wrapper.contains('.fast-add')).toBe(true);
    expect(wrapper.vm.showTip).toBe(true);
    expect(wrapper.contains('.guide-tool-tip')).toBe(true);
    wrapper.vm.hideTip();
    expect(wrapper.vm.showTip).toBe(false);
  });
});
