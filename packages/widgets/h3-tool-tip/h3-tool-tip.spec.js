/* eslint-disable */

import Vue from 'vue';
import H3ToolTip from '../../widgets/h3-tool-tip/h3-tool-tip';
import { destroyVM, createTest} from '../util';

// const getRenderText = (propsData) => {
//   const Ctor = Vue.extend(HelloWorld);
// 　　 const vm = new Ctor({propsData}).$mount();
// 　　 return vm.$el.querySelector('h3').textContent;
// 　}

function getRenderedText(Component, propsData) {
  const Constructor =Vue.extend(Component)
  const vm = new Constructor({propsData: propsData}).$mount()
  return vm.$el.querySelector('#content').textContent
}


describe('H3tToolTip.vue',()=>{
   let vm

  // afterEach(()=>{
  //   destroyVM(vm)
  // })

  it('用不同的props测试',()=>{
    
    // vm = createTest(H3ToolTip, {
    //   content:'第一个提示框',
    // }, true);
    // expect(vm.$el.querySelector('#content').textContent).to.be.equal('第一个提示框');
    const Constructor =Vue.extend(H3ToolTip);
    const props = {
      content: 'toolTipOne',
      extraBtn: [
        { 
          name: '管理',
        },{
          name: '操作',
        }
      ],
    };
    const vm = new Constructor({propsData:props}).$mount();
    expect(vm.$el.querySelector('#content').textContent).to.equal('toolTipOne');
    expect(getRenderedText(H3ToolTip,{
      content: 'toolTipTwo',
    })).to.equal('toolTipTwo')
  })
})