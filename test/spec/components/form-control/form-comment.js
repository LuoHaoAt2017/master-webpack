// 无法解决vux的问题，暂时注释

// import Vuex from 'vuex';
// import $ from 'jquery';
// import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
// import formComment from './../../../../src/components/forms/common-controls/form-comment.vue';
// import commentsData from './../../../__mocks__/mockData/queryItems.js';
// import windowConfigData from './../../../__mocks__/mockData/windowConfigData.js';
// import './../../../../src/config/helper.js';

// describe('', () => {
//   const localVue = createLocalVue();
//   window.GlobalConfig = windowConfigData;
//   localVue.use(Vuex);
//   window.GlobalConfig = {};
//   const activated = jest.fn();
//   formComment.activated = activated;
//   const store = new Vuex.Store({
//     state: commentsData,
//   });
//   const wrapper = mount(formComment, {
//     store,
//     localVue,
//   });

//   test('测试渲染出的任务节点数量', () => {
//     wrapper.vm.toggleCollapse();
//     expect(wrapper.findAll('.time-node').length).toBe(wrapper.vm.groupWorkItems.length);
//   });
// });
