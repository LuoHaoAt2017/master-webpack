import getOptions from '../default/controls';
import mockStore from '../default/store';
import { formLogicService, formConverter } from '../../../../src/lib/form-logic';
import '../../../../src/config/helper';

jest.mock('../../../../src/lib/form-logic/utils/http');

describe('关联填充-子表关联主表和子表关联子表', () => {
  let formInstance;
  const bizObjectId = 'mainChildMappingTest';
  beforeAll(() => {
    const responseContext = {
      IsCreateMode: true, // 新增模式
      AssociatedBoNames: {},
      ReturnData: {
        A: getOptions('FormTextBox', 'A'),
        B: getOptions('FormNumber', 'B'),
        C: getOptions('FormCheckboxList', 'C', { defaultitems: [{ Value: '刘备', Text: '刘备' }, { Value: '关羽', Text: '关羽' }, { Value: '张飞', Text: '张飞' }] }),
        D: getOptions('FormUser', 'D'),
        Sub: getOptions('FormGridView', 'Sub', {
          Value: {
            R: [{}],
            T: {
            // 关联主表
              'Sub.Query': getOptions('FormQuery', 'Sub.Query', {
                boschemacode: 'mock-query-schema-code',
                mappingcontrols: JSON.stringify({
                  A: 'AA',
                  B: 'BB',
                  C: 'CC',
                  'Sub.a': 'DD',
                  'Sub.b': 'EE',
                  'Sub.c': 'FF',
                  'Sub.d': 'GG',
                  'Sub.e': 'HH',
                }),
              }),
              // 关联子表
              'Sub.Query2': getOptions('FormQuery', 'Sub.Query2', {
                boschemacode: 'mock-query-sub-schema-code',
                boschemainfo: '{"AppPackage":"D000130yjhtest","AppGroup":"75c1410c342d4023bb585468cb155f72","AppMenu":null,"IsChildSchema":true}',
                mappingcontrols: JSON.stringify({
                  A: 'Grid.a',
                  B: 'Grid.b',
                  D: 'Grid.g',
                  'Sub.a': 'Grid.e',
                  'Sub.b': 'Grid.h',
                  'Sub.c': 'Grid.d',
                }),
              }),
              'Sub.a': getOptions('FormCheckbox', 'Sub.a'),
              'Sub.b': getOptions('FormDateTime', 'Sub.b', { datetimemode: 'yyyy-mm-dd hh:mm' }),
              'Sub.c': getOptions('FormQuery', 'Sub.c', { boschemacode: 'mock-schema-code' }),
              'Sub.d': getOptions('FormUser', 'Sub.d'),
              'Sub.e': getOptions('FormMultiUser', 'Sub.e'),
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
  test('子表关联主表-主表填充主表', async () => {
    const initRows = formInstance.Sub.rows;
    expect(initRows.length).toBe(1);
    formInstance.Sub.$updateRow(initRows[0], { 'Sub.Query': 'mock-form-guid-1' });
    await formInstance.$stateMachine.flushAsync();
    expect(formInstance.A.value).toBe('表单是一个填不满的坑');
    expect(formInstance.B.value).toBe(678);
    expect(formInstance.C.value).toBe('张飞');
  });
  test('子表关联主表-主表填充子表', async () => {
    const initRows = formInstance.Sub.rows;
    formInstance.Sub.$updateRow(initRows[0], { 'Sub.Query2': 'mock-row-guid-1' });
    await formInstance.$stateMachine.flushAsync();
    const rowValues = formInstance.Sub.value;
    expect(rowValues.map(r => r.a)).toEqual([true]);
    expect(rowValues.map(r => r.b)).toEqual(['2018-09-26 16:26']);
    expect(rowValues.map(r => r.c)).toEqual(['mock-guid-1']);
    expect(rowValues.map(r => r.d)).toEqual([['mock-user-id-1']]);
    expect(rowValues.map(r => r.e)).toEqual([['mock-user-id-1', 'mock-user-id-2']]);
  });
  test('子表关联子表-子表填充主表', async () => {
    const initRows = formInstance.Sub.rows;
    expect(initRows.length).toBe(1);
    formInstance.Sub.$updateRow(initRows[0], { 'Sub.Query2': 'mock-row-guid-1' });
    await formInstance.$stateMachine.flushAsync();
    expect(formInstance.A.value).toBe('第一行');
    expect(formInstance.B.value).toBe(11111);
    expect(formInstance.D.value).toEqual(['mock-dept-id-2']);
  });
  test('子表关联子表-子表填充子表', async () => {
    const initRows = formInstance.Sub.rows;
    formInstance.Sub.$updateRow(initRows[0], { 'Sub.Query': 'mock-row-guid-1' });
    await formInstance.$stateMachine.flushAsync();
    const rowValues = formInstance.Sub.value;
    expect(rowValues.map(r => r.a)).toEqual([true]);
    expect(rowValues.map(r => r.b)).toEqual(['2018-09-26 16:26']);
    expect(rowValues.map(r => r.c)).toEqual(['mock-guid-1']);
  });
});

