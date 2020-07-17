import getOptions from '../../default/controls';
import mockStore from '../../default/store';
import { formLogicService, formConverter } from '../../../../../src/lib/form-logic/';
import { pairsForIn, IGuid } from '../../../../../src/lib/form-logic/utils';
import '../../../../../src/config/helper';

jest.mock('../../../../../src/lib/form-logic/utils/http');

const table = [
  // case 1
  ['日期控件', {
    A: ['FormDateTime', { datetimemode: 'hh:ii' }],
    B: ['FormDateTime', { datetimemode: 'yyyy-mm-dd' }],
    C: ['FormDateTime', { datetimemode: 'yyyy-mm-dd hh:ii' }],
  }, {
    Text: [{ A: '2018-09-18 16:10:13' }, '{A}', '16:10'],
    Num: [{ B: '2018-09-18 16:10:13' }, '{B}', ''], // 数值控件接到非数字显示空
    Date: [{ C: '2018-09-18 16:10:13' }, '{C}', '2018-09-18 16:10'],
  }],
  // case 2
  ['数字控件', {
    A: ['FormNumber', { decimalplaces: '2' }],
    B: ['FormNumber', { decimalplaces: '2', showmode: '1' }],
  }, {
    Text: [{ A: 123456789.34 }, '{A}', '123456789.34'],
    Num: [{ B: 123456789.34 }, '{B}', 123456789.34],
    Date: [{ B: 123456789 }, '{B}', ''], // error: 待定，需要确定，数字没有作为时间戳
  }],
  // case 3
  ['单选框控件', {
    A: ['FormRadioButtonList', { defaultitems: [{ Value: '刘备', Text: '刘备' }, { Value: '关羽', Text: '关羽' }, { Value: '张飞', Text: '张飞' }] }],
  }, {
    Text: [{ A: '刘备' }, '{A}', '刘备'],
    Num: [{ A: '关羽' }, '{A}', ''],
    Date: [{ A: '张飞' }, '{A}', ''],
  }],
  // case 4
  ['复选框控件', {
    A: ['FormCheckboxList', { defaultitems: [{ Value: '刘备', Text: '刘备' }, { Value: '关羽', Text: '关羽' }, { Value: '张飞', Text: '张飞' }] }],
  }, {
    Text: [{ A: ['刘备', '关羽'] }, '{A}', '刘备;关羽'],
    Num: [{ A: '关羽' }, '{A}', ''],
    Date: [{ A: '张飞' }, '{A}', ''],
  }],
  // case 5
  ['下拉框控件', {
    A: ['FormDropDownList', { defaultitems: [{ Value: '刘备', Text: '刘备' }, { Value: '关羽', Text: '关羽' }, { Value: '张飞', Text: '张飞' }] }],
  }, {
    Text: [{ A: '刘备' }, '{A}', '刘备'],
    Num: [{ A: '关羽' }, '{A}', ''],
    Date: [{ A: '张飞' }, '{A}', ''],
  }],
  // case 6
  ['地址控件', {
    A: ['FormAreaSelect'],
  }, {
    Text: [{ A: { adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' } }, '{A}', '{\"adcode\":\"440305\",\"adname\":\"广东省 深圳市 南山区\",\"Detail\":\"科兴科学园\"}'],
    Text2: [{ A: { adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' } }, '$.fn.GETADDRESS({A})', '广东省 深圳市 南山区 科兴科学园'],
    Text3: [{ A: '这是一个非法字符串' }, '$.fn.GETADDRESS({A})', ''],
    Num: [{ A: '关羽' }, '{A}', ''],
    Date: [{ A: '张飞' }, '{A}', ''],
  }],
  // case 8
  ['人员单选和部门单选', {
    A: ['FormUser'],
  }, {
    Text: [{ A: 'mock-user-id-1' }, '{A}', 'mock-user-id-1'],
    Num: [{ A: 'mock-user-id-1' }, '{A}', ''],
    // Date: [{ A: 'mock-user-id-1' }, '{A}', ''], // error：待处理
  }],
  ['人员多选和部门多选', {
    A: ['FormMultiUser'],
  }, {
    Text: [{ A: ['mock-user-id-1', 'mock-user-id-2'] }, '{A}', 'mock-user-id-2'], // err: 待处理
    Num: [{ A: ['mock-user-id-1', 'mock-user-id-2'] }, '{A}', ''],
    // Date: [{ A: 'mock-user-id-1' }, '{A}', ''], // error：待处理
  }],
  ['是否控件', {
    A: ['FormCheckbox'],
  }, {
    Text: [{ A: true }, '{A}', 'true'],
    Num: [{ A: false }, '{A}', ''],
    Date: [{ A: true }, '{A}', ''],
  }],
];
describe.each(table)('控件组合计算规则', (caseName, controls, expectedResult) => {
  let formInstance;
  const bizObjectId = IGuid();
  beforeAll(() => {
    const controlDatas = {};
    for (const field in controls) {
      if (Object.prototype.hasOwnProperty.call(controls, field)) {
        const [controlKey, opts] = controls[field];
        controlDatas[field] = getOptions(controlKey, field, opts || {});
      }
    }
    const returnData = Object.assign({}, controlDatas, {
      Text: getOptions('FormTextArea', 'Text'),
      Text2: getOptions('FormTextArea', 'Text2'),
      Text3: getOptions('FormTextArea', 'Text3'),
      Num: getOptions('FormNumber', 'Num', { decimalplaces: '2' }),
      Date: getOptions('FormDateTime', 'Date', { datetimemode: 'yyyy-mm-dd hh:mm' }),
    });
    const responseContext = {
      AssociatedBoNames: {},
      ReturnData: returnData,
    };
    let formData = {
      $renderControls: Object.keys(returnData),
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
  pairsForIn(expectedResult, (resField, expected) => {
    test(caseName + resField, async () => {
      const [vals, rule, result] = expected;
      for (const dataField in vals) {
        if (Object.prototype.hasOwnProperty.call(vals, dataField)) {
          formInstance[dataField].value = vals[dataField];
        }
      }
      await formInstance.$stateMachine.flushAsync();
      const fields = Object.keys(vals);
      const resultControl = formInstance[resField];
      const calcResult = formInstance.$calculator.getComputationRuleResult(
        rule,
        fields,
        resultControl,
        resultControl.$valueType === Number,
      );
      resultControl.value = calcResult;
      expect(resultControl.value).toEqual(result);
    });
  });
});

