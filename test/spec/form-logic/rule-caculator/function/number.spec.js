import getOptions from '../../default/controls';
import mockStore from '../../default/store';
import { formLogicService, formConverter } from '../../../../../src/lib/form-logic';

// 用例名称    |    字段设置及赋值      |  规则       | 预期结果
const table = [
  ['相加相乘', { A: 1, B: 2, C: 3 }, '{A} + {B} * {C}', 7],
  ['相减相除', { A: 5, C: 1.8, D: 1.2 }, '{A} - {C} / {D}', 3.5],
  ['加减乘除混合计算', {
    A: 12, B: 43, C: 45.2, D: 19.6,
  }, '({A} + {B}) * {A} / ({C} - {D})', 25.78125],
  ['分母为0', { A: 1, B: 0 }, '{A} / {B}', 0],
  ['绝对值', { A: -5 }, '$.fn.ABS({A})', 5],
  ['三角函数', { A: 30, B: 60 }, '$.fn.SIN({A}) + $.fn.COS({B})', 1],
  ['向下取整', { C: 4.62, D: -4.32 }, '($.fn.INT({C}) + $.fn.INT({D})) * $.fn.INT({C})', -4],
  ['取余', { A: 10, B: 4 }, '$.fn.MOD({A}, {B})', 2],
  ['圆周率π', {}, '$.fn.PI()', Math.PI],
  ['四舍五入', { C: 4.567 }, '$.fn.ROUND({C}, 1)', 4.6],
  ['四舍五入负数', { D: -6.543 }, '$.fn.ROUND({D}, 1)', -6.5],
  ['平方根', { A: 256 }, '$.fn.SQRT({A})', 16],
  ['大写金额', { C: 1234567.89 }, '$.fn.UPPERMONEY({C})', '壹佰贰拾叁万肆仟伍佰陆拾柒元捌角玖分'],
  ['大写金额带零', { D: 76543210.89 }, '$.fn.UPPERMONEY({D})', '柒仟陆佰伍拾肆万叁仟贰佰壹拾元零捌角玖分'],
];
describe('测试数字函数', () => {
  let formInstance;
  const bizObjectId = 'testNumberFunc';
  beforeAll(() => {
    const responseContext = {
      ReturnData: {
        A: getOptions('FormNumber', 'A'),
        B: getOptions('FormNumber', 'B'),
        C: getOptions('FormNumber', 'C', { decimalplaces: '2' }),
        D: getOptions('FormNumber', 'D', { decimalplaces: '2' }),
        Result: getOptions('FormNumber', 'Result'),
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
  test.each(table)('%s', (caseName, opts, rule, result) => {
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
      !Number.isNaN(Number(result)),
    );
    expect(`${calcResult}`).toEqual(`${result}`);
  });
});

