/* eslint-disable */

import Vue from 'vue';
import H3Title from './h3-title.vue';

const getRenderText = (propsData) => {
  const Ctor = Vue.extend(HelloWorld);
　　 const vm = new Ctor({propsData}).$mount();
　　 return vm.$el.querySelector('h3').textContent;
　}

describe('h3title.vue',()=>{
  let vm

  afterEach(()=>{
    destroyVM(vm)
  })

  it('测试创建Vue对象',()=>{
    let result
    vm = createTest({
      template:`<h3-title></h3-title>`,
      components:{H3Title},
      props:{
        title:"这是单元测试的title，size是xxs",
        size:"xxs"
      },
    },true)
    expect(vm.$el.querySelector('#title').textContent).to.be.equal('这是单元测试的title，size是xxs');
  })
})