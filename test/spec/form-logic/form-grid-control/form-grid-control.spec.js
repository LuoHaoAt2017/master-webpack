// 子表里面可以拖选的控件
// 权限设置可见高于隐藏规则
// 子表默认值
import getOptions from '../default/controls';
import mockStore from '../default/store';
import { formLogicService, formConverter } from '../../../../src/lib/form-logic';
import { IGuid } from '../../../../src/lib/form-logic/utils';
import '../../../../src/config/helper';

jest.mock('../../../../src/lib/form-logic/utils/http');

// const table = [
//   ['数字聚合函数SUM ', {
//     A: [
//       { 'A.a': -2 }, { 'A.a': 0 }, { 'A.a': 4 }, { 'A.a': 22 }],
//   }, '$.fn.SUM({A.a})', ['A.a'], 24],
// ];
// describe.only.each(table)('测试聚合函数', (caseName, opts, rule, fields, result) => {
const rowData = {
  'A.a': 12,
  'A.b': '沙田柚',
  'A.c': '橙子',
  'A.d': '选项3',
  'A.e': '选项2',
  'A.f': '选项1;选项2',
  'A.g': '2018-09-26',
  'A.h': true,
  'A.i': ['mock-user-id-1'],
  'A.j': ['mock-user-id-1', 'mock-user-id-2'],
  'A.l': 'mock-guid-1',
  'A.m': ['mock-guid-1', 'mock-guid-2'],
  'A.n': '{ "adcode": "440305", "adname": "广东省 深圳市 南山区", "Detail": "科兴科学园" }',
  // 权限设置不可见
  'A.o': 3,
  // 默认值
  'A.p': '选项3',
};
describe('子表接口', () => {
  let formInstance;
  const bizObjectId = 'testFormGridView';
  beforeAll(() => {
    const responseContext = {
      AssociatedBoNames: {},
      ReturnData: {
        A: getOptions('FormGridView', 'A', {
          Value: {
            R: [],
            T: {
              'A.a': getOptions('FormNumber', 'A.a'),
              'A.b': getOptions('FormTextBox', 'A.b'),
              'A.c': getOptions('FormTextArea', 'A.c'),
              'A.d': getOptions('FormRadioButtonList', 'A.d'),
              'A.e': getOptions('FormDropDownList', 'A.e'),
              'A.f': getOptions('FormCheckboxList', 'A.f'),
              'A.g': getOptions('FormDateTime', 'A.g'),
              'A.h': getOptions('FormCheckbox', 'A.h'),
              'A.i': getOptions('FormUser', 'A.i'),
              'A.j': getOptions('FormMultiUser', 'A.j'),
              'A.k': getOptions('FormAttachment', 'A.k'),
              'A.l': getOptions('FormQuery', 'A.l', { boschemacode: 'mock-schema-code' }),
              'A.m': getOptions('FormMultiQuery', 'A.m', { boschemacode: 'mock-schema-code' }),
              'A.n': getOptions('FormAreaSelect', 'A.n'),
              // 权限设置不可见
              'A.o': getOptions('FormNumber', 'A.o', {
                Visible: false,
                DisplayRule: '{A.a} == 2',
                DisplayRuleFields: ['A.a'],
              }),
              // 默认值
              'A.p': getOptions('FormRadioButtonList', 'A.p', { Value: '选项2' }),
            },
          },
        }),
        // Result: getOptions('FormNumber', 'Result'),
      },
    };
    let formData = {
      $renderControls: ['A'],
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
  beforeEach(() => {
    formInstance.A.$clearRows(true);
  });
  test('$addRow, 权限设置不可见及默认值', () => {
    const gridControl = formInstance.A;
    const objectId = IGuid();
    gridControl.$addRow(objectId);
    expect(gridControl[objectId]).toBeTruthy();
    expect(gridControl[objectId]['A.o'].visible).toEqual(false);
    expect(gridControl[objectId]['A.p'].value).toEqual('选项2');
  });
  test('$addRow既有objectId, 又有rowData', async () => {
    const gridControl = formInstance.A;
    const objectId = IGuid();
    gridControl.$addRow(objectId, rowData);
    await formInstance.$stateMachine.flushAsync();
    expect(gridControl[objectId]['A.a'].value).toEqual(12);
    expect(gridControl[objectId]['A.b'].value).toEqual('沙田柚');
    expect(gridControl[objectId]['A.c'].value).toEqual('橙子');
    expect(gridControl[objectId]['A.d'].value).toEqual('选项3');
    expect(gridControl[objectId]['A.e'].value).toEqual('选项2');
    expect(gridControl[objectId]['A.f'].value).toEqual('选项1;选项2');
    expect(gridControl[objectId]['A.g'].value).toEqual('2018-09-26');
    expect(gridControl[objectId]['A.h'].value).toEqual(true);
    expect(gridControl[objectId]['A.i'].value).toEqual(['mock-user-id-1']);
    expect(gridControl[objectId]['A.j'].value).toEqual(['mock-user-id-1', 'mock-user-id-2']);
    expect(gridControl[objectId]['A.l'].value).toEqual('mock-guid-1');
    expect(gridControl[objectId]['A.m'].value).toEqual(['mock-guid-1', 'mock-guid-2']);
    expect(gridControl[objectId]['A.n'].value).toEqual(JSON.stringify({ adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' }));
    expect(gridControl[objectId]['A.o'].value).toEqual(3);
    expect(gridControl[objectId]['A.p'].value).toEqual('选项3');
  });
  test('$clearRows 清空所有行', async () => {
    const gridControl = formInstance.A;
    gridControl.$addRow();
    gridControl.$clearRows();
    await formInstance.$stateMachine.flushAsync();
    expect(gridControl.rows.length).toBe(0);
  });
  test('$updateRow接口, 更新一行数据', async () => {
    const gridControl = formInstance.A;
    const objectId = IGuid();
    gridControl.$addRow(objectId, null);
    await formInstance.$stateMachine.flushAsync();
    gridControl.$updateRow(objectId, rowData);
  });
  test('$setValue', async () => {
    const gridControl = formInstance.A;
    const objectId = IGuid();
    gridControl.$addRow(objectId);
    const valueObj = {};
    valueObj[objectId] = rowData;
    gridControl.$setValue([valueObj]);
    await formInstance.$stateMachine.flushAsync();
    expect(gridControl[objectId]['A.a'].value).toEqual(12);
    expect(gridControl[objectId]['A.b'].value).toEqual('沙田柚');
    expect(gridControl[objectId]['A.c'].value).toEqual('橙子');
    expect(gridControl[objectId]['A.d'].value).toEqual('选项3');
    expect(gridControl[objectId]['A.e'].value).toEqual('选项2');
    expect(gridControl[objectId]['A.f'].value).toEqual('选项1;选项2');
    expect(gridControl[objectId]['A.g'].value).toEqual('2018-09-26');
    expect(gridControl[objectId]['A.h'].value).toEqual(true);
    expect(gridControl[objectId]['A.i'].value).toEqual(['mock-user-id-1']);
    expect(gridControl[objectId]['A.j'].value).toEqual(['mock-user-id-1', 'mock-user-id-2']);
    expect(gridControl[objectId]['A.l'].value).toEqual('mock-guid-1');
    expect(gridControl[objectId]['A.m'].value).toEqual(['mock-guid-1', 'mock-guid-2']);
    expect(gridControl[objectId]['A.n'].value).toEqual(JSON.stringify({ adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' }));
    expect(gridControl[objectId]['A.o'].value).toEqual(3);
    expect(gridControl[objectId]['A.p'].value).toEqual('选项3');
  });
  test('$copyRow, 复制一行', async () => {
    const gridControl = formInstance.A;
    const objectId = IGuid();
    gridControl.$addRow(objectId, rowData);
    await formInstance.$stateMachine.flushAsync();
    gridControl.$copyRow(objectId, 0);
    await formInstance.$stateMachine.flushAsync();
    const newRowId = gridControl.rows[1];
    expect(gridControl[newRowId]['A.a'].value).toEqual(12);
    expect(gridControl[newRowId]['A.b'].value).toEqual('沙田柚');
    expect(gridControl[newRowId]['A.c'].value).toEqual('橙子');
    expect(gridControl[newRowId]['A.d'].value).toEqual('选项3');
    expect(gridControl[newRowId]['A.e'].value).toEqual('选项2');
    expect(gridControl[newRowId]['A.f'].value).toEqual('选项1;选项2');
    expect(gridControl[newRowId]['A.g'].value).toEqual('2018-09-26');
    expect(gridControl[newRowId]['A.h'].value).toEqual(true);
    expect(gridControl[newRowId]['A.i'].value).toEqual(['mock-user-id-1']);
    expect(gridControl[newRowId]['A.j'].value).toEqual(['mock-user-id-1', 'mock-user-id-2']);
    expect(gridControl[newRowId]['A.l'].value).toEqual('mock-guid-1');
    expect(gridControl[newRowId]['A.m'].value).toEqual(['mock-guid-1', 'mock-guid-2']);
    expect(gridControl[newRowId]['A.n'].value).toEqual(JSON.stringify({ adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' }));
    expect(gridControl[newRowId]['A.o'].value).toEqual(3);
    expect(gridControl[newRowId]['A.p'].value).toEqual('选项3');
  });
  test('$deleteRow, 删除一行', async () => {
    const gridControl = formInstance.A;
    const objectId = IGuid();
    gridControl.$addRow(objectId, rowData);
    await formInstance.$stateMachine.flushAsync();
    gridControl.$deleteRow(objectId);
    await formInstance.$stateMachine.flushAsync();
    expect(gridControl.rows.length).toBe(0);
  });
  test('$batchAddRows', async () => {
    const gridControl = formInstance.A;
    const objectId = IGuid();
    rowData['A.ObjectId'] = objectId;
    gridControl.$batchAddRows([rowData]);
    await formInstance.$stateMachine.flushAsync();
    expect(gridControl[objectId]['A.a'].value).toEqual(12);
    expect(gridControl[objectId]['A.b'].value).toEqual('沙田柚');
    expect(gridControl[objectId]['A.c'].value).toEqual('橙子');
    expect(gridControl[objectId]['A.d'].value).toEqual('选项3');
    expect(gridControl[objectId]['A.e'].value).toEqual('选项2');
    expect(gridControl[objectId]['A.f'].value).toEqual('选项1;选项2');
    expect(gridControl[objectId]['A.g'].value).toEqual('2018-09-26');
    expect(gridControl[objectId]['A.h'].value).toEqual(true);
    expect(gridControl[objectId]['A.i'].value).toEqual(['mock-user-id-1']);
    expect(gridControl[objectId]['A.j'].value).toEqual(['mock-user-id-1', 'mock-user-id-2']);
    expect(gridControl[objectId]['A.l'].value).toEqual('mock-guid-1');
    expect(gridControl[objectId]['A.m'].value).toEqual(['mock-guid-1', 'mock-guid-2']);
    expect(gridControl[objectId]['A.n'].value).toEqual(JSON.stringify({ adcode: '440305', adname: '广东省 深圳市 南山区', Detail: '科兴科学园' }));
    expect(gridControl[objectId]['A.o'].value).toEqual(3);
    expect(gridControl[objectId]['A.p'].value).toEqual('选项3');
  });
  test('$validate', async () => {
    const gridControl = formInstance.A;
    const valid1 = gridControl.$validate();
    expect(valid1).toBeFalsy();
    const objectId = IGuid();
    gridControl.$addRow(objectId);
    const valid2 = gridControl.$validate();
    expect(valid2).toBeFalsy();
    const valueObj = {};
    valueObj[objectId] = rowData;
    gridControl.$setValue([valueObj]);
    const valid3 = gridControl.$validate();
    expect(valid3).toBeFalsy(); // 附件没有赋值
  });
});
