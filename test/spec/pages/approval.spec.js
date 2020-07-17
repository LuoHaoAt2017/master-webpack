import Vuex from 'vuex';
import $ from 'jquery';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import approval from './../../../src/pages/my-work/sub-pages/approve.vue';
import commentsData from './../../__mocks__/mockData/queryItems.js';
import windowConfigData from './../../__mocks__/mockData/windowConfigData.js';
import mescroll from './../../../packages/components/h3-scroll/mescroll.vue';
import './../../../src/config/helper.js';

window.$ = $;
jest.mock('../../../src/service/get-data.js');
describe('', () => {
  let wrapper;
  beforeEach(() => {
    const localVue = createLocalVue();
    window.GlobalConfig = windowConfigData;
    localVue.use(Vuex);
    const store = new Vuex.Store({
      state: commentsData,
    });
    const created = jest.fn();

    mescroll.mounted = created;// mescroll里面的mounted函数报错Cannot set property 'onScroll' of undefined
    wrapper = mount(approval, {
      store,
      localVue,
      parentComponent: {
        data: () => ({ eventHub: new localVue() }),
      },
    });
    wrapper.vm.searchByKeyAsync();
    // 因为上面的mescroll.mounted报错，导致loadmore函数无法正常加载
  });
  beforeAll(() => {
  });


  test('测试点击筛选出现蒙版,点击确定调用筛选', () => {
    wrapper.vm.$refs.scroll.mescroll = {};
    wrapper.vm.$refs.scroll.mescroll.resetUpScroll = wrapper.vm.loadMore;
    const mockFn = jest.fn();
    wrapper.vm.filter = mockFn;
    wrapper.find('.filter').trigger('click');
    expect(wrapper.vm.showFilter).toBe(true);
    wrapper.findAll('.all-border').at(1).trigger('click');
    expect(mockFn).toHaveBeenCalled();
  });
  test('测试点击已审批切换数据', () => {
    const mockFn = jest.fn();
    wrapper.vm.hideFilter = mockFn;
    wrapper.vm.$refs.scroll.mescroll = {};
    wrapper.vm.$refs.scroll.mescroll.resetUpScroll = mockFn;
    wrapper.vm.toggleStatus(1);
    //wrapper.findAll('.h3-tab-item').at(1).trigger('click');
    expect(mockFn).toHaveBeenCalled();
  });
});
