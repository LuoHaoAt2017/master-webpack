import getOptions from '../../default/controls';
import mockStore from '../../default/store';
import { formLogicService, formConverter } from '../../../../../src/lib/form-logic';

const table = [
  ['IF函数 ', { A: 1 }, '$.fn.IF({A} >= 7, 1, 0)', 0],
  ['AND函数 ', { A: 1 }, "'辣鱼' && 0", 0],
  ['OR函数 ', { A: 1 }, "0 || '辣鱼'", '辣鱼'],
  ['ISNULL函数 ', { A: 0 }, '$.fn.ISNULL({A})', true],
  ['ISNULL函数 ', { B: '选项1' }, '$.fn.ISNULL({B})', false],
  ['GETADDRESS函数 ', { C: JSON.stringify({ adcode: '110101', adname: '北京市市辖区东城区', Detail: '' }) },
    '$.fn.GETADDRESS({C})', '北京市市辖区东城区'],
];
describe.only.each(table)('测试逻辑函数', (caseName, opts, rule, result) => {
  let formInstance;
  const bizObjectId = 'testLogicFunc';
  beforeAll(() => {
    const responseContext = {
      ReturnData: {
        A: getOptions('FormNumber', 'A'),
        B: getOptions('FormRaidoButtonList', 'B'),
        C: getOptions('FormAreaSelect', 'C'),
        Result: getOptions('FormTextBox', 'Result'),
      },
    };
    let formData = {
      $renderControls: ['A', 'B', 'C', 'D', 'Result'],
      $responseContext: responseContext,
    };
    formData = formConverter.convertReturnData(formData, responseContext.ReturnData);
    const store = mockStore(formData);
    formInstance = formLogicService.newInstance({
      bizObjectId: 'bizObjectId',
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
        formInstance[dataField].value = opts[dataField];
      }
    }
    const fields = Object.keys(opts);
    const resultControl = formInstance.Result;
    const calcResult = formInstance.$calculator.getComputationRuleResult(
      rule,
      fields,
      resultControl,
      false,
    );
    expect(`${calcResult}`).toEqual(`${result}`);
  });
});

