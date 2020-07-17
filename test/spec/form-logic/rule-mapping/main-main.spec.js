import getOptions from '../default/controls';
import mockStore from '../default/store';
import { formLogicService, formConverter } from '../../../../src/lib/form-logic';
import '../../../../src/config/helper';

jest.mock('../../../../src/lib/form-logic/utils/http');

describe('关联填充-主表关联主表', () => {
  let formInstance;
  const bizObjectId = 'mainMainMappingTest';
  beforeAll(() => {
    const responseContext = {
      IsCreateMode: true, // 新增模式
      AssociatedBoNames: {},
      ReturnData: {
        Query: getOptions('FormQuery', 'Query', {
          Value: 'mock-form-guid-1',
          boschemacode: 'mock-query-schema-code',
          mappingcontrols: JSON.stringify({
            A: 'AA',
            B: 'BB',
            C: 'CC',
            D: 'DD',
            E: 'EE',
            F: 'FF',
            G: 'GG',
            'Sub.a': 'Grid.a',
            'Sub.b': 'Grid.b',
            'Sub.c': 'Grid.c',
            'Sub.d': 'Grid.d',
            'Sub.e': 'Grid.e',
          }),
        }),
        Query2: getOptions('FormQuery', 'Query2', {
          boschemacode: 'mock-query-schema-code',
          mappingcontrols: JSON.stringify({
            'Sub.f': 'HH',
            'Sub.g': 'II',
          }),
        }),
        A: getOptions('FormTextBox', 'A'),
        B: getOptions('FormNumber', 'B'),
        C: getOptions('FormCheckboxList', 'C', { defaultitems: [{ Value: '刘备', Text: '刘备' }, { Value: '关羽', Text: '关羽' }, { Value: '张飞', Text: '张飞' }] }),
        D: getOptions('FormCheckbox', 'D'),
        E: getOptions('FormDateTime', 'E', { datetimemode: 'yyyy-MM-dd hh:mm' }),
        F: getOptions('FormQuery', 'F', { boschemacode: 'mock-schema-code' }),
        G: getOptions('FormUser', 'G'),
        Sub: getOptions('FormGridView', 'Sub', {
          Value: {
            R: [],
            T: {
              'Sub.a': getOptions('FormTextBox', 'Sub.a'),
              'Sub.b': getOptions('FormNumber', 'Sub.b'),
              'Sub.c': getOptions('FormDropDownList', 'Sub.c', { defaultitems: [{ Value: '刘备', Text: '刘备' }, { Value: '关羽', Text: '关羽' }, { Value: '张飞', Text: '张飞' }] }),
              'Sub.d': getOptions('FormQuery', 'Sub.d', { boschemacode: 'mock-schema-code' }),
              'Sub.e': getOptions('FormCheckbox', 'Sub.e'),
              'Sub.f': getOptions('FormMultiUser', 'Sub.f'),
              'Sub.g': getOptions('FormTextBox', 'Sub.g'),
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
  test('主表填充主表', () => {
    expect(formInstance.A.value).toBe('表单是一个填不满的坑');
    expect(formInstance.B.value).toBe(678);
    expect(formInstance.C.value).toBe('张飞');
    expect(formInstance.D.value).toBe(true);
    expect(formInstance.E.value).toBe('2018-09-21 16:35');
    expect(formInstance.F.value).toBe('mock-guid-1');
    expect(formInstance.G.value).toEqual(['mock-user-id-1']);
  });
  test('子表填充子表', () => {
    const rows = formInstance.Sub.value;
    expect(rows.map(r => r.a)).toEqual(['第一行', '第二行']);
    expect(rows.map(r => r.b)).toEqual([11111, 22222]);
    expect(rows.map(r => r.c)).toEqual(['', '']);
    expect(rows.map(r => r.d)).toEqual(['mock-guid-1', 'mock-guid-2']);
    expect(rows.map(r => r.e)).toEqual([true, false]);
  });
  test('主表填充子表', async () => {
    formInstance.Query2.value = 'mock-form-guid-1';
    await formInstance.$stateMachine.flushAsync();
    const rows = formInstance.Sub.value;
    expect(rows.map(r => r.f)).toEqual([['mock-user-id-1', 'mock-user-id-2'], ['mock-user-id-1', 'mock-user-id-2']]);
    expect(rows.map(r => r.g)).toEqual(['前端是一个无底洞', '前端是一个无底洞']);
  });
});

