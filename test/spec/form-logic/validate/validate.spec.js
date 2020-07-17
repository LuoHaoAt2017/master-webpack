import getOptions from '../default/controls';
import mockStore from '../default/store';
import { formLogicService, formConverter } from '../../../../src/lib/form-logic';

const overLengthStr = '参考消息网9月25日报道 外媒称，伊朗革命卫队23日誓言将针对阅兵式袭击事件展开“致命且刻骨铭心的”报复行动。这次袭击事件造成25人丧生，其中包括12名他们的革命卫队战友。伊朗政府指责海湾国家在背后支持实施袭击的枪手。参考消息网9月25日报道 外媒称，伊朗革命卫队23日誓言将针对阅兵式袭击事件展开“致命且刻骨铭心的”报复行动。这次袭击事件造成25人丧生，其中包括12名他们的革命卫队战友。伊朗政府指责海湾国家在背后支持实施袭击的枪手。';
const photoVal = [{
  AttachmentId: '48e15da4-8b3a-4760-a849-3fe2af79f461',
  Code: '48e15da4-8b3a-4760-a849-3fe2af79f461',
  Description: null,
  Name: 'empty.png',
  Size: 4317,
  ThumbnailUrl: 'https://testci-ossthumbnail.oss-cn-shenzhen.aliyuncs.com/hkvahvi2mau4d93l/48e15da4-8b3a-4760-a849-3fe2af79f461',
  Url: '/Form/Download/?AttachmentID=48e15da4-8b3a-4760-a849-3fe2af79f461',
}, {
  AttachmentId: '48e15da4-8b3a-4760-a849-3fe2af79f461',
  Code: '48e15da4-8b3a-4760-a849-3fe2af79f461',
  Description: null,
  Name: 'demo.png',
  Size: 4317,
  ThumbnailUrl: 'https://testci-ossthumbnail.oss-cn-shenzhen.aliyuncs.com/hkvahvi2mau4d93l/48e15da4-8b3a-4760-a849-3fe2af79f461',
  Url: '/Form/Download/?AttachmentID=48e15da4-8b3a-4760-a849-3fe2af79f461',
}];
const table = [
  ['年月日时分日期控件', 'A', ['FormDateTime', { datetimemode: 'yyyy-mm-dd hh:ii' }], [
    ['2018-09-19 16:22', true, {}], ['', false, { empty: true }],
  ]],
  ['地址控件', 'A', ['FormAreaSelect'], [
    ['{ "adcode": "440305", "adname": "广东省 深圳市 南山区", "Detail": "科兴科学园" }', true, {}],
    ['{ "adcode": "", "adname": "", "Detail": "" }', false, { empty: true }],
  ]],
  ['复选框控件', 'A', ['FormCheckboxList'], [
    ['选项1；选项2', true, {}], ['', false, { empty: true }], [overLengthStr, false, { outofLength: true, empty: true }],
  ]],
  ['下拉框控件', 'A', ['FormDropDwonList'], [['选项2', true, {}], ['', false, { empty: true }]]],
  ['单选框控件', 'A', ['FormRadioButtonList'], [['选项2', true, {}], ['', false, { empty: true }]]],
  ['是否控件', 'A', ['FormCheckbox'], [[true, true, {}], [false, true, {}]]],
  ['位置控件', 'A', ['FormMap'], [
    ['{ "Address": "广东", "Point": { "lat": 123, "lng": 456 } }', true, {}],
    ['{ "Address": "", "Point": { "lat": 0, "lng": 0 } }', false, { empty: true }],
  ]],
  ['关联表单多选控件', 'A', ['FormMultyQuery'], [
    [['2134134124', 'werxcwer43214'], true, {}], [[], false, { empty: true }],
  ]],
  ['关联表单控件', 'A', ['FormQuery'], [
    ['2134134124', true, {}], ['', false, { empty: true }],
  ]],
  ['人员部门多选控件', 'A', ['FormMultyUser'], [
    [['2134134124', 'werxcwer43214'], true, {}], [[], false, { empty: true }],
  ]],
  ['人员部门单选控件', 'A', ['FormUser'], [
    [['2134134124'], true, {}], [[], false, { empty: true }],
  ]],
  ['数字控件', 'A', ['FormNumber'], [[23423, true, {}], ['', false, { empty: true }], [0, true, {}]]],
  ['多行文本控件', 'A', ['FormTextArea'], [['SDF234', true, {}], ['', false, { empty: true }]]],
  ['单行文本控件', 'A', ['FormTextBox'], [['SDF234', true, {}], ['', false, { empty: true }]]],
  ['图片控件', 'A', ['FormPhoto', { Value: photoVal }], [['', true, {}]]],
  ['附件控件', 'A', ['FormAttachment', { Value: photoVal }], [['', true, {}]]],
];
describe.each(table)('逻辑层校验接口测试', (caseName, dataField, control, initalVals) => {
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
    // console.log(destControl);
    initalVals.forEach((val) => {
      const [receivedVal, expectedVal, valid] = val;
      // console.log(receivedVal);
      const result = destControl.$validate(receivedVal);
      // console.log(result);
      expect(result).toEqual(expectedVal);
      // console.log(destControl);
      expect(destControl.valid).toEqual(valid);
    });
  });
});
