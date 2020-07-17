import getOptions from '../default/controls';
import mockStore from '../default/store';
import { formLogicService, formConverter } from '../../../../src/lib/form-logic';
import '../../../../src/config/helper';

jest.mock('../../../../src/lib/form-logic/utils/http');

const emptyAddress = { Detail: '', adcode: '', adname: '' };
const emptyMapAddress = { Address: '', Point: { lat: 0, lng: 0 } };
const user1 = {
  Avatar: 'https://static.dingtalk.com/media/lADPACOG83npV-fNAe_NAgc_519_495.jpg',
  Birthday: '1753/1/1',
  Code: 'ZHANGSAN',
  DepartmentName: '研发中心',
  DeptId: 0,
  DingTalkAccount: '1032095221472761.ding83d0fc05f4b7420f35c2f4657eb6378f',
  DisplayName: '张三',
  Email: 'zhangsan@authine.com',
  Gender: '未知',
  HasChild: false,
  Icon: 'glyphicon-user',
  Mobile: '18612345678',
  ParentId: 'mock-dept-id-1',
  Type: 4,
  UnitID: 'mock-user-id-1',
  _Gender: 0,
};
const user2 = {
  Avatar: 'https://static.dingtalk.com/media/lADPACOG83npV-fNAe_NAgc_519_495.jpg',
  Birthday: '1753/1/1',
  Code: 'LISI',
  DepartmentName: '测试部',
  DeptId: 0,
  DingTalkAccount: '1032095221472761.ding83d0fc05f4b7420f35c2f4657eb6378f',
  DisplayName: '李四',
  Email: 'lisi@authine.com',
  Gender: '未知',
  HasChild: false,
  Icon: 'glyphicon-user',
  Mobile: '13087654321',
  ParentId: 'mock-dept-id-2',
  Type: 4,
  UnitID: 'mock-user-id-2',
  _Gender: 1,
};
const table = [
  // case 1
  ['年月日时分日期控件', 'A', ['FormDateTime', { datetimemode: 'yyyy-mm-dd hh:ii' }], [
    [1537341755763, ''], ['/Date(1537345326917)/', '2018-09-19 16:22'],
    ['2018-09-01 14:23', '2018-09-01 14:23'], ['2018/09/01 14:23', '2018-09-01 14:23'],
    [undefined, ''], [NaN, ''], [null, ''], ['12dd-234d23-234d', ''],
  ]],
  ['年月日日期控件', 'A', ['FormDateTime', { datetimemode: 'yyyy-mm-dd' }], [
    [1537341755763, ''], ['/Date(1537345326917)/', '2018-09-19'],
    ['2018-09-01 14:23', '2018-09-01'], ['2018/09/01', '2018-09-01'],
    [undefined, ''], [NaN, ''], [null, ''], ['12dd-234d23-234d', ''],
  ]],
  ['年月日期控件', 'A', ['FormDateTime', { datetimemode: 'yyyy-mm' }], [
    [1537341755763, ''], ['/Date(1537345326917)/', '2018-09'], ['2018', '2018-01'],
    ['2018-09-01 14:23', '2018-09'], ['2018/09/01', '2018-09'], ['8', '2001-08'],
    [undefined, ''], [NaN, ''], [null, ''], ['12dd-234d23-234d', ''],
  ]],
  // ['时分日期控件', 'A', ['FormDateTime', { datetimemode: 'hh:ii' }], [
  //   [1537341755763, ''], ['/Date(1537345326917)/', ''], ['2018', ''],
  //   ['2018-09-01 14:23', '14:23'], ['2018/09/01', '00:00'], ['23:12', '23:12'],
  //   [undefined, ''], [NaN, ''], [null, ''], ['12dd-234d23-234d', ''],
  // ]],
  ['单行文本控件', 'A', ['FormTextBox'], [[153, '153'], ['lsdk你好', 'lsdk你好'],
    ['2019-09-12', '2019-09-12'], [[1, 2, 3], '1,2,3'], [{ a: 1 }, '[object Object]'],
    [undefined, ''], [NaN, ''], [null, ''], [true, 'true'],
  ]],
  ['多行文本控件', 'A', ['FormTextArea'], [[153, '153'], ['lsdk你好', 'lsdk你好'],
    ['2019-09-12', '2019-09-12'], [[1, 2, 3], '1,2,3'], [{ a: 1 }, '[object Object]'],
    [undefined, ''], [NaN, ''], [null, ''], [true, 'true'],
  ]],
  // ['数字控件', 'A', ['FormNumber'], [[153, '153'], ['lsdk你好', ''], [true, ''],
  //   ['2019-09-12', ''], [[1, 2, 3], ''], [{ a: 1 }, ''], [112.12, '112'],
  //   [undefined, ''], [NaN, ''], [null, ''], ['112.12', '112'], ['123,123,123', ''],
  // ]],
  ['带三位小数位数数字控件', 'A', ['FormNumber', { decimalplaces: '3' }], [[true, ''],
    ['2019-09-12', ''], [[1, 2, 3], ''], [{ a: 1 }, ''], [112.12, '112.120'], ['lsdk你好', ''],
    [undefined, ''], [NaN, ''], [null, ''], ['112.122', '112.122'], [153, '153.000'],
  ]],
  ['千分位带三位小数位数数字控件', 'A', ['FormNumber', { decimalplaces: '3', showmode: '1' }], [[true, ''],
    ['2019-09-12', ''], [[1, 2, 3], ''], [{ a: 1 }, ''], [112112.12, '112,112.120'],
    [undefined, ''], [NaN, ''], [null, ''], ['112.122', '112.122'], [1567153, '1,567,153.000'],
    ['lsdk你好', ''],
  ]],
  ['单选框', 'A', ['FormRadioButtonList'], [[153, ''], ['lsdk你好', ''], [false, ''],
    ['2019-09-12', ''], [[1, 2, 3], ''], [{ a: 1 }, ''],
    [undefined, ''], [NaN, ''], [null, ''], ['选项1', '选项1'],
  ]],
  ['下拉框', 'A', ['FormDropDownList'], [[153, {}], ['lsdk你好', {}], [false, {}],
    ['2019-09-12', {}], [[1, 2, 3], {}], [{ a: 1 }, {}],
    [undefined, {}], [NaN, {}], [null, {}], ['选项1', { Value: '选项1', Text: '选项1' }],
  ]],
  ['复选框', 'A', ['FormCheckboxList'], [[153, ''], ['lsdk你好', ''], [false, ''],
    ['2019-09-12', ''], [[1, 2, 3], ''], [{ a: 1 }, ''],
    [undefined, ''], [NaN, ''], [null, ''], ['选项1', '选项1'],
  ]],
  ['地址', 'A', ['FormAreaSelect'], [[153, emptyAddress], ['lsdk你好', emptyAddress], [false, emptyAddress],
    ['2019-09-12', emptyAddress], [[1, 2, 3], emptyAddress], [{ a: 1 }, emptyAddress], [undefined, emptyAddress], [NaN, emptyAddress],
    [null, emptyAddress], [{ adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' }, { adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' }],
    ['{ "adcode": "440305", "adname": "广东省 深圳市 南山区", "Detail": "科兴科学园" }', { adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' }],
    ['{ "a": "1" }', emptyAddress],
  ]],
  ['位置', 'A', ['FormMap'], [[153, emptyMapAddress], ['lsdk你好', emptyMapAddress], [false, emptyMapAddress],
    ['2019-09-12', emptyMapAddress], [[1, 2, 3], emptyMapAddress], [{ a: 1 }, emptyMapAddress], [undefined, emptyMapAddress], [NaN, emptyMapAddress],
    [null, emptyMapAddress], [{ Address: '广东', Point: { lat: 123, lng: 456 } }, { Address: '广东', Point: { lat: 123, lng: 456 } }],
    ['{ "Address": "广东", "Point": { "lat": 123, "lng": 456 } }', { Address: '广东', Point: { lat: 123, lng: 456 } }],
    ['{ "a": "1" }', emptyMapAddress],
  ]],
  ['是否控件', 'A', ['FormCheckbox'], [[153, false], ['lsdk你好', false], [false, false],
    ['2019-09-12', false], [[1, 2, 3], false], [{ a: 1 }, false],
    [undefined, false], [NaN, false], [null, false], [true, true],
  ]],
  ['关联表单', 'A', ['FormQuery', { boschemacode: 'mock-schema-code' }], [[153, {}], ['lsdk你好', {}], [false, {}],
    ['2019-09-12', {}], [[1, 2, 3], {}], [{ a: 1 }, {}], [null, {}], [true, {}],
    [undefined, {}], [NaN, {}], ['mock-guid-1', { Name: '测试数据1', ObjectId: 'mock-guid-1' }],
  ]],
  ['关联表单多选', 'A', ['FormMultiQuery', { boschemacode: 'mock-schema-code' }], [[153, []], ['lsdk你好', []], [false, []],
    ['2019-09-12', []], [[1, 2, 3], []], [{ a: 1 }, []], [null, []], [true, []],
    [undefined, []], [NaN, []],
    [['mock-guid-1', 'mock-guid-2'], [{ name: '测试数据2', objectId: 'mock-guid-2' }, { name: '测试数据1', objectId: 'mock-guid-1' }]],
  ]],
  ['单人部门', 'A', ['FormUser'], [[153, []], ['lsdk你好', []], [false, []],
    ['2019-09-12', []], [[1, 2, 3], []], [{ a: 1 }, []], [null, []], [true, []],
    [undefined, []], [NaN, []],
    [['mock-user-id-1'], [user1]],
  ]],
  ['多人部门', 'A', ['FormMultiUser'], [[153, []], ['lsdk你好', []], [false, []],
    ['2019-09-12', []], [[1, 2, 3], []], [{ a: 1 }, []], [null, []], [true, []],
    [undefined, []], [NaN, []],
    [['mock-user-id-1'], [user1]], [['mock-user-id-1', 'mock-user-id-2'], [user1, user2]],
  ]],
  ['公式型文本控件', 'A', ['FormFormula', { bindtype: 'text' }], [[153, '153'], ['lsdk你好', 'lsdk你好'],
    ['2019-09-12', '2019-09-12'], [[1, 2, 3], '1,2,3'], [{ a: 1 }, '[object Object]'],
    [undefined, ''], [NaN, ''], [null, ''], [true, 'true'],
  ]],
  ['公式型布尔值控件', 'A', ['FormFormula', { bindtype: 'boolean' }], [[153, 'true'],
    ['2019-09-12', 'true'], [[1, 2, 3], 'true'], [{ a: 1 }, 'true'], [false, 'false'],
    [undefined, 'false'], [NaN, 'false'], [null, 'false'], [true, 'true'], ['lsdk你好', 'true'],
  ]],
  ['公式型数字千分位3位小数', 'A', ['FormFormula', { bindtype: 'number', showmode: '1', decimalplaces: 3 }], [
    ['2019-09-12', '2,019.000'], [{ a: 1 }, '0.000'], [112112.12, '112,112.120'],
    [undefined, ''], [NaN, ''], [null, ''], ['112.122', '112.122'], [1567153, '1,567,153.000'],
    ['lsdk你好', '0.000'], [true, '0.000'],
  ]],
  // [[1, 2, 3], '1.000'], 待解决
  ['公式型数字控件', 'A', ['FormFormula', { bindtype: 'number' }], [[153, '153'], ['lsdk你好', '0'], [true, '0'],
    ['2019-09-12', '0'], [{ a: 1 }, '0'], [112.12, '112.12'],
    [undefined, ''], [NaN, ''], [null, ''], ['112.12', '112.12'], ['123,123,123', '123,123,123'],
  ]],
  // [[1, 2, 3], '0'], 待解决
];

describe.each(table)('初始值和赋值接口测试', (caseName, dataField, control, initalVals) => {
  let formInstance;
  const bizObjectId = 'testMixControlRule';
  beforeAll(() => {
    const returnData = {};
    const [controlKey, opts] = control;
    returnData[dataField] = getOptions(controlKey, dataField, opts || {});
    const responseContext = {
      ReturnData: returnData,
      AssociatedBoNames: '',
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
  test(caseName, () => {
    const destControl = formInstance[dataField];
    initalVals.forEach((val) => {
      const [receivedVal, expectedVal] = val;
      const result = destControl.$setValue(receivedVal);
      if (result instanceof Promise) {
        const asyncId = formInstance.$hangupAsync();
        result.then((response) => {
          expect(response).toEqual(expectedVal);
          formInstance.$resolveAsync(asyncId);
        }).catch((err) => {
          throw err;
        });
      } else {
        // console.log(receivedVal, result, expectedVal);
        expect(result).toEqual(expectedVal);
      }
    });
    return formInstance.$stateMachine.flushAsync();
  });
});

