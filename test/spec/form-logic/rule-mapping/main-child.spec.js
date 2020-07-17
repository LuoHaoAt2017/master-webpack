import getOptions from '../default/controls';
import mockStore from '../default/store';
import { formLogicService, formConverter } from '../../../../src/lib/form-logic';
import '../../../../src/config/helper';

jest.mock('../../../../src/lib/form-logic/utils/http');

describe('关联填充-主表关联子表', () => {
  let formInstance;
  const bizObjectId = 'mainChildMappingTest';
  beforeAll(() => {
    const responseContext = {
      IsCreateMode: true, // 新增模式
      AssociatedBoNames: {},
      ReturnData: {
        Query: getOptions('FormQuery', 'Query', {
          Value: 'mock-row-guid-2',
          boschemacode: 'mock-query-sub-schema-code',
          boschemainfo: '{"AppPackage":"D000130yjhtest","AppGroup":"75c1410c342d4023bb585468cb155f72","AppMenu":null,"IsChildSchema":true}',
          mappingcontrols: JSON.stringify({
            A: 'Grid.a',
            B: 'Grid.b',
            C: 'Grid.c',
            'Sub.d': 'Grid.d',
            'Sub.e': 'Grid.e',
            'Sub.f': 'Grid.f',
            'Sub.g': 'Grid.g',
          }),
        }),
        A: getOptions('FormTextBox', 'A'),
        B: getOptions('FormNumber', 'B'),
        C: getOptions('FormCheckboxList', 'C', { defaultitems: [{ Value: '选项1', Text: '选项1' }, { Value: '选项2', Text: '选项2' }, { Value: '选项3', Text: '选项3' }] }),
        Sub: getOptions('FormGridView', 'Sub', {
          Value: {
            R: [],
            T: {
              'Sub.d': getOptions('FormQuery', 'Sub.d', { boschemacode: 'mock-schema-code' }),
              'Sub.e': getOptions('FormCheckbox', 'Sub.e'),
              'Sub.f': getOptions('FormTextBox', 'Sub.f'),
              'Sub.g': getOptions('FormUser', 'Sub.g'),
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
  test('子表填充主表', () => {
    expect(formInstance.A.value).toBe('第二行');
    expect(formInstance.B.value).toBe(22222);
    expect(formInstance.C.value).toBe('选项2');
  });
  test('子表填充子表', () => {
    const rows = formInstance.Sub.value;
    expect(rows.map(r => r.d)).toEqual(['mock-guid-2']);
    expect(rows.map(r => r.e)).toEqual([false]);
    expect(rows.map(r => r.f)).toEqual(['子表f2']);
    expect(rows.map(r => r.g)).toEqual([['mock-dept-id-1']]);
  });
});

