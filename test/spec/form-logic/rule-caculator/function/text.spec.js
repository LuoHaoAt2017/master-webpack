import getOptions from '../../default/controls';
import mockStore from '../../default/store';
import { formLogicService, formConverter } from '../../../../../src/lib/form-logic';

const table = [
  ['数字拼接 ', { A: '0', B: '2', C: '3' }, '{A} + {B} + {C}', '023'],
  ['中英文数字拼接 ', { A: 'splice', B: '拼接', C: '3' }, '{A} + {B} + {C}', 'splice拼接3'],
  ['英文startwith ', { A: 'TestStartWith' }, "$.fn.STARTSWITH({A}, 'test')", 'false'],
  ['中文startwith ', { A: '西瓜真甜' }, "$.fn.STARTSWITH({A}, '真甜')", 'false'],
  ['英文contains ', { A: 'testcontains', B: 'contains' }, '$.fn.CONTAINS({A}, {B})', 'true'],
  ['中文contains ', { A: '不包含葡萄', B: '那有什么呢' }, '$.fn.CONTAINS({A}, {B})', 'false'],
  ['中文left ', { A: '香蕉' }, '$.fn.LEFT({A})', ''],
  ['英文left ', { A: 'banana' }, '$.fn.LEFT({A}, 3)', 'ban'],
  ['中文len ', { A: '香蕉 &苹果' }, '$.fn.LENGTH({A})', '6'],
  ['中英文len ', { A: 'banana &苹果' }, '$.fn.LENGTH({A})', '10'],
  ['旧字符串为空replace ', { A: '' }, "$.fn.REPLACE({A}, 0, 7, 'orange')", 'orange'],
  ['起始位置为0的replace ',
    { A: 'banana替换成orange' }, "$.fn.REPLACE({A}, 0, 7, 'orange')", 'banana替换成orangorange替换成orange'],
  ['替换起始位置大于旧字符串长度replace ',
    { A: 'banana' }, "$.fn.REPLACE({A}, 7, 7, 'orange')", 'bananaorange'],
  ['替换起始位置+替换长度>旧字符串长度replace ',
    { A: 'banana' }, "$.fn.REPLACE({A}, 4, 7, 'orange')", 'banorange'],
  ['中文right ', { A: '鸭梨' }, '$.fn.RIGHT({A})', '鸭梨'],
  ['英文right ', { A: 'pear' }, '$.fn.RIGHT({A}, 2)', 'ar'],
  ['有结果search ', { A: 'pitaya火龙果' }, "$.fn.SEARCH('ya火', {A}, 2)", '5'],
  ['无结果search ', { A: 'pitaya火龙果' }, "$.fn.SEARCH('ya火', {A}, 7)", '0'],
  ['substitute ', { A: 'pitaya火龙果火龙果火龙果' }, "$.fn.SUBSTITUTE({A}, '火龙果', '桃子', 2)", 'pitaya桃子桃子火龙果'],
  ['mid ', { A: 'grapefruit' }, '$.fn.SUBSTRING({A}, 2, 3)', 'rap'],
  ['lower ', { A: 'GRAPEfrUIT中文呢' }, '$.fn.TOLOWER({A})', 'grapefruit中文呢'],
  ['upper ', { A: 'grapeFRuit中文呢' }, '$.fn.TOUPPER({A})', 'GRAPEFRUIT中文呢'],
  ['trim ', { A: '  grape  fruit  ' }, '$.fn.TRIM({A})', 'grape  fruit'],
];
describe.only.each(table)('测试文本函数', (caseName, opts, rule, result) => {
  let formInstance;
  const bizObjectId = 'testTextFunc';
  beforeAll(() => {
    const responseContext = {
      ReturnData: {
        A: getOptions('FormTextBox', 'A'),
        B: getOptions('FormTextBox', 'B'),
        C: getOptions('FormTextBox', 'C'),
        Result: getOptions('FormTextBox', 'Result'),
      },
    };
    let formData = {
      $renderControls: ['A', 'B', 'C', 'Result'],
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
  test(`测试规则${caseName}${rule}`, () => {
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
