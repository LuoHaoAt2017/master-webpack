import getOptions from '../../default/controls';
import mockStore from '../../default/store';
import { formLogicService, formConverter } from '../../../../../src/lib/form-logic';
import '../../../../../src/config/helper';

const table = [
  ['年月算年份差YEARS', { A: '2018-02', B: '2016-08' }, '$.fn.YEARS({A}, {B})', 1.5],
  ['年月日算年份差YEARS', { C: '2018-02-01', D: '2016-08-01' }, '$.fn.YEARS({C}, {D})', 1.5],
  ['年月日时分算年份差YEARS', { E: '2018-02-01 00:00', F: '2016-07-31 23:59' },
    '$.fn.YEARS({E}, {F})', 1.5],
  ['年月算天数差DAYS', { A: '2018-01', B: '2016-07' }, '$.fn.DAYS({A}, {B})', 549],
  ['年月日算天数差DAYS', { C: '2018-03-12', D: '2016-07-02' }, '$.fn.DAYS({C}, {D})', 618],
  ['年月日时分算天数差DAYS', { E: '2018-03-12 14:56', F: '2016-07-02 13:34' },
    '$.fn.DAYS({E}, {F})', 618.06],
  ['年月算小时差HOURS', { A: '2018-02', B: '2018-01' }, '$.fn.HOURS({A}, {B})', 744],
  ['年月日算小时差HOURS', { C: '2018-02-03', D: '2018-01-23' }, '$.fn.HOURS({C}, {D})', 264],
  ['年月日时分算小时差HOURS', { E: '2018-02-03 03:23', F: '2018-01-23 15:23' },
    '$.fn.HOURS({E}, {F})', 252],
  ['年月算分钟差MINUTES', { A: '2018-02', B: '2018-01' }, '$.fn.MINUTES({A}, {B})', 44640],
  ['年月日算分钟差MINUTES', { C: '2018-02-03', D: '2018-01-23' }, '$.fn.MINUTES({C}, {D})', 15840],
  ['年月日时分算分钟差MINUTES', { E: '2018-02-03 03:23', F: '2018-01-23 15:23' },
    '$.fn.MINUTES({E}, {F})', 15120],
  ['年月算增加天数ADDDAY', { A: '2018-02' }, '$.fn.ADDDAY({A}, 35)', '2018-03-08'],
  ['年月日算增加天数ADDDAY', { C: '2017-02-03' }, '$.fn.ADDDAY({C}, -30)', '2017-01-04'],
  ['年月日时分算增加天数ADDDAY', { E: '2000-02-03 14:20' },
    '$.fn.ADDDAY({E}, 30)', '2000-03-04 14:20'],
  ['年月算增加月份ADDMONTH', { A: '2018-02' }, '$.fn.ADDMONTH({A}, -35)', '2015-03-01'],
  ['年月日算增加月份ADDMONTH', { C: '2017-02-03' }, '$.fn.ADDMONTH({C}, 30)', '2019-08-03'],
  ['年月日时分算增加月份ADDMONTH', { E: '2000-02-03 14:20' },
    '$.fn.ADDMONTH({E}, 30)', '2002-08-03 14:20'],
  ['年月算增加年数ADDYEAR', { A: '2018-02' }, '$.fn.ADDYEAR({A}, -3)', '2015-02-01'],
  ['年月日算增加年数ADDYEAR', { C: '2017-02-03' }, '$.fn.ADDYEAR({C}, 3)', '2020-02-03'],
  ['年月日时分算增加年数ADDYEAR', { E: '2000-02-03 14:20' },
    '$.fn.ADDYEAR({E}, 30)', '2030-02-03 14:20'],
  ['DATE函数', { A: '2018-02' }, "$.fn.DATE('2018', '09', '18', '10', '40', '45')",
    '2018-09-18 10:40:45'],
  ['YEAR函数', { A: '2016-02', C: '2017-09-18', E: '2018-09-18 13:23' },
    '$.fn.YEAR({A})+ "," + $.fn.YEAR({C})+ "," + $.fn.YEAR({E})', '2016,2017,2018'],
  ['MONTH函数', { A: '2016-02', C: '2017-09-18', E: '2018-10-18 13:23' },
    '$.fn.MONTH({A})+ "," + $.fn.MONTH({C})+ "," + $.fn.MONTH({E})', '2,9,10'],
  ['DAY函数', { A: '2016-02', C: '2017-09-18', E: '2018-10-18 13:23' },
    '$.fn.DAY({A})+ "," + $.fn.DAY({C})+ "," + $.fn.DAY({E})', '1,18,18'],
  ['HOUR函数', { A: '2016-02', C: '2017-09-18', E: '2018-10-18 13:23' },
    '$.fn.HOUR({A})+ "," + $.fn.HOUR({C})+ "," + $.fn.HOUR({E})', '0,0,13'],
  ['MINUTE函数', { A: '2016-02', C: '2017-09-18', E: '2018-10-18 13:23' },
    '$.fn.MINUTE({A})+ "," + $.fn.MINUTE({C})+ "," + $.fn.MINUTE({E})', '0,0,23'],
  ['QUARTER函数', { A: '2016-02', C: '2017-06-18', E: '2018-10-18 13:23' },
    '$.fn.QUARTER({A})+ "," + $.fn.QUARTER({C})+ "," + $.fn.QUARTER({E})', '1,2,4'],
  ['WEEKDAY函数', { A: '2016-02', C: '2017-06-18', E: '2018-10-18 13:23' },
    '$.fn.WEEKDAY({A})+ "," + $.fn.WEEKDAY({C})+ "," + $.fn.WEEKDAY({E})', '1,0,4'],
  ['WEEKNUM函数', { A: '2016-02', C: '2017-06-18', E: '2018-10-18 13:23' },
    '$.fn.WEEKNUM({A})+ "," + $.fn.WEEKNUM({C})+ "," + $.fn.WEEKNUM({E})', '6,25,42'],
];
describe.only.each(table)('测试日期函数', (caseName, opts, rule, result) => {
  let formInstance;
  const bizObjectId = 'testDateFunc';
  beforeAll(() => {
    const responseContext = {
      ReturnData: {
        A: getOptions('FormDateTime', 'A', { datetimemode: 'yyyy-mm' }),
        B: getOptions('FormDateTime', 'B', { datetimemode: 'yyyy-mm' }),
        C: getOptions('FormDateTime', 'C'),
        D: getOptions('FormDateTime', 'D'),
        E: getOptions('FormDateTime', 'E', { datetimemode: 'yyyy-mm-dd hh:mm' }),
        F: getOptions('FormDateTime', 'F', { datetimemode: 'yyyy-mm-dd hh:mm' }),
        Result: getOptions('FormDateTime', 'Result'),
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
