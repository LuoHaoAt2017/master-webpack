import { defaultReturnOpts, defaultHtmlData } from './default';

const controls = {
  FormNumber: {
    decimalplaces: '0',
    showmode: '0',
  },
  FormTextBox: {
    asfilter: null,
    defaultitems: '选项1,选项2,选项3',
    inputbyscan: 'false',
    ismappingproperty: null,
    mode: 'Normal',
    placeholder: '',
    repeat: 'false',
    scanupdateenable: 'false',
  },
  FormTextArea: {
    placeholder: '',
    rows: '3',
  },
  FormDateTime: {
    datetimemode: 'yyyy-mm-dd',
  },
  FormRadioButtonList: {
    defaultitems: ['选项1', '选项2', '选项3'],
    defaultvalue: '',
    selectshowmode: '0',
  },
  FormCheckboxList: {
    defaultitems: ['选项1', '选项2', '选项3'],
    defaultvalue: '',
    selectshowmode: '0',
    ischeckbox: 'false',
    mappingfield: '',
    associationfilter: '',
    boschemacode: '',
  },
  FormDropDownList: {
    defaultitems: ['选项1', '选项2', '选项3'],
    defaultvalue: '',
    selectshowmode: '0',
    mappingfield: '',
    associationfilter: '',
    boschemacode: '',
    filterFields: [],
  },
  FormAttachment: {
    maxuploadsize: '10',
  },
  FormAreaSelect: {
    areamode: 'P-C-T',
    showdetailaddr: 'true',
  },
  FormMap: {
    range: '0',
  },
  FormUser: {
    ismultiple: 'false',
    isrelatedmember: 'false',
    mappingcontrols: null,
    orgunitvisible: 'true',
    showunactive: 'false',
    unitselectionrange: '',
    usedatacache: 'true',
    uservisible: true,
  },
  FormMultiUser: {
    ismultiple: 'true',
    isrelatedmember: 'false',
    mappingcontrols: null,
    orgunitvisible: 'true',
    showunactive: 'false',
    unitselectionrange: '',
    usedatacache: 'true',
    uservisible: true,
  },
  FormPhoto: {
    cameraonly: 'false',
    compression: 'false',
    hasWaterMark: 'false',
    uploadmultiple: 'false',
  },
  FormCheckbox: {
    defaultitems: ['是/否'],
    defaultvalue: 'false',
  },
  FormQuery: {
    associationfilter: '',
    bofilter: null,
    boschemacode: 'D000130sourcemain',
    boschemainfo: '{"AppPackage":"D000130yjhtest","AppGroup":"75c1410c342d4023bb585468cb155f72","AppMenu":null,"IsChildSchema":false}',
    boschemaname: '',
    inputbyscan: 'false',
    islistview: 'false',
    ismultiple: 'false',
    mappingcontrols: null,
    mappingproperties: null,
    scanupdateenable: 'false',
  },
  FormMultiQuery: {
    associationfilter: '',
    bofilter: null,
    boschemacode: 'D000130sourcemain',
    boschemainfo: '{"AppPackage":"D000130yjhtest","AppGroup":"75c1410c342d4023bb585468cb155f72","AppMenu":null,"IsChildSchema":false}',
    boschemaname: '',
    inputbyscan: 'false',
    islistview: 'false',
    ismultiple: 'true',
    mappingcontrols: null,
    mappingproperties: null,
    scanupdateenable: 'false',
  },
  FormGridView: {
    nameitems: '',
    displayMode: '',
    displayFields: '',
  },
};

export default function getOptions(controlKey, dataField, options = {}) {
  const formControlOpts = controls[controlKey];
  if (controlKey === 'FormGridView') {
    // dataField为数组
    if (options.Value && options.Value.R && options.Value.R.length > 0) {
      let rowIndex = 0;
      options.Value.R = options.Value.R.map((row) => {
        rowIndex += 1;
        const rowOpts = JSON.parse(JSON.stringify(options.Value.T));
        for (const field in rowOpts) {
          if (Object.prototype.hasOwnProperty.call(rowOpts, field)) {
            const controlOpts = rowOpts[field];
            if (row[field]) {
              controlOpts.Value = row[field];
            }
          }
        }
        rowOpts[`${dataField}.ObjectId`] = { Value: `mock-row-guid-${rowIndex}` };
        return rowOpts;
      });
    }
  }
  return Object.assign(
    {},
    defaultReturnOpts,
    defaultHtmlData,
    formControlOpts,
    { controlkey: controlKey, dataField },
    options,
  );
}
