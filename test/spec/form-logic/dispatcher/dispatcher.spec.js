import getOptions from '../default/controls';
import mockStore from '../default/store';
import { formLogicService, formConverter } from '../../../../src/lib/form-logic';

describe('消息分发/规则触发测试', () => {
  let formInstance;
  const bizObjectId = 'dispatchertest';
  beforeAll(() => {
    const responseContext = {
      IsCreateMode: true, // 新增模式，新增模式下初始化会执行计算规则
      ReturnData: {
        A: getOptions('FormNumber', 'A', { Value: 1 }),
        B: getOptions('FormNumber', 'B', { Value: 2 }),
        C: getOptions('FormNumber', 'C', { ComputationRule: '{A} + {B}', ComputationRuleFields: ['A', 'B'] }),
        D: getOptions('FormNumber', 'D', { ComputationRule: '$.fn.SUM({E.a})', ComputationRuleFields: ['E.a'] }),
        F: getOptions('FormNumber', 'F', { ComputationRule: '{E.d}', ComputationRuleFields: ['E.d'] }),
        E: getOptions('FormGridView', 'E', {
          Value: {
            R: [
              { 'E.a': 1, 'E.d': 8 },
              { 'E.a': 4, 'E.d': 9 },
            ],
            T: {
              'E.a': getOptions('FormNumber', 'E.a'),
              'E.b': getOptions('FormNumber', 'E.b', { ComputationRule: '{E.a}', ComputationRuleFields: ['E.a'] }),
              'E.c': getOptions('FormNumber', 'E.c', { ComputationRule: '{B}', ComputationRuleFields: ['B'] }),
              'E.d': getOptions('FormNumber', 'E.d'),
            },
          },
        }),
      },
    };
    let formData = {
      $renderControls: Object.keys(responseContext.ReturnData),
      $responseContext: responseContext,
    };
    formData = formConverter.convertReturnData(formData, responseContext.ReturnData);
    const store = mockStore(formData);
    formInstance = formLogicService.newInstance({
      bizObjectId,
      returnData: responseContext.ReturnData,
      formData,
      javascript: '',
      updateView(mutType, payload) {
        store.commit(mutType, payload);
      },
    });
    return formInstance.$stateMachine.flushAsync();
  });
  afterAll(() => {
    formLogicService.destroy(bizObjectId);
  });
  test('规则控件映射确认', () => {
    const dispatcher = formInstance.$dispatcher;
    const pubsubs = dispatcher.pubsubs;
    const expectedMapping = {
      A: ['C'],
      B: ['C', 'E.c'],
      E: ['D', 'F'],
      'E.a': ['E.b'],
    };
    expect(pubsubs).toEqual(expectedMapping);
  });
  test('计算规则初始化执行结果验证', () => {
    expect(formInstance.A.value).toEqual(1);
    expect(formInstance.C.value).toEqual(3);
    expect(formInstance.D.value).toEqual(5);
    // expect(formInstance.F.value).toEqual('');
    const subTableVal = formInstance.E.value;
    const cColVal = subTableVal.map(r => r.c);
    expect(cColVal).toEqual([2, 2]);
  });
  test('主表内规则验证C=A+B', () => {
    formInstance.A.value = 10;
    formInstance.B.value = 20;
    expect(formInstance.A.value).toEqual(10);
    expect(formInstance.C.value).toEqual(30);
  });
  test('主表子表规则验证D=SUM(E.a), F=E.b, E.c=B', () => {
    formInstance.E.$updateRow('mock-row-guid-1', { 'E.a': 5, 'E.d': 13 });
    formInstance.E.$updateRow('mock-row-guid-2', { 'E.a': 7, 'E.d': 16 });
    expect(formInstance.D.value).toEqual(12);
    // expect(formInstance.F.value).toEqual('');
    const subTableVal = formInstance.E.value;
    const cColVal = subTableVal.map(r => r.c);
    expect(cColVal).toEqual([20, 20]);
  });
});

