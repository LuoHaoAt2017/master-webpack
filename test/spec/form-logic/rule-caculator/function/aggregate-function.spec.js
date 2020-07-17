import getOptions from '../../default/controls';
import mockStore from '../../default/store';
import { formLogicService, formConverter } from '../../../../../src/lib/form-logic';
import { IGuid } from '../../../../../src/lib/form-logic/utils';

const table = [
  ['数字聚合函数SUM ', {
    A: [
      { 'A.a': -2 }, { 'A.a': 0 }, { 'A.a': 4 }, { 'A.a': 22 }],
  }, '$.fn.SUM({A.a})', ['A.a'], 24],
  ['数字聚合函数MAX ', {
    A: [
      { 'A.a': -2 }, { 'A.a': 0 }, { 'A.a': 4 }, { 'A.a': 22 }],
  }, '$.fn.MAX({A.a})', ['A.a'], 22],
  ['数字聚合函数MIN ', {
    A: [
      { 'A.a': -2 }, { 'A.a': 0 }, { 'A.a': 4 }, { 'A.a': 22 }],
  }, '$.fn.MIN({A.a})', ['A.a'], -2],
  ['数字聚合函数AVG ', {
    A: [
      { 'A.a': -2 }, { 'A.a': 0 }, { 'A.a': 4 }, { 'A.a': 22 }],
  }, '$.fn.AVG({A.a})', ['A.a'], 6],
];
describe.only.each(table)('测试聚合函数', (caseName, opts, rule, fields, result) => {
  let formInstance;
  const bizObjectId = 'testAggregateFunc';
  beforeAll(() => {
    const responseContext = {
      ReturnData: {
        A: getOptions('FormGridView', 'A', {
          Value: {
            R: [],
            T: {
              'A.a': getOptions('FormNumber', 'A.a'),
            },
          },
        }),
        Result: getOptions('FormNumber', 'Result'),
      },
    };
    let formData = {
      $renderControls: ['A', 'Result'],
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
  test(`${caseName}${rule}`, () => {
    for (const dataField in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, dataField)) {
        const valueArr = opts[dataField];
        const tempRows = [];
        valueArr.forEach((val) => {
          const rowObj = {};
          rowObj[IGuid()] = val;
          tempRows.push(rowObj);
        });
        formInstance[dataField].$setValue(tempRows);
      }
    }
    const resultControl = formInstance.Result;
    const calcResult = formInstance.$calculator.getComputationRuleResult(
      rule,
      fields,
      resultControl,
      true,
    );
    expect(`${calcResult}`).toEqual(`${result}`);
  });
});
