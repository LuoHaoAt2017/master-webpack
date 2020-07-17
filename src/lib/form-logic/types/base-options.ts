abstract class BaseOptions {
  Type!: number;

  DataDictItemValue?: string;

  DisplayName!: string;

  Editable!: boolean;

  Printable!: boolean;

  Required!: boolean;

  controlKey: string = '';

  controlkey: string = '';

  description: string = '';

  dataField: string = '';

  sourcetype: string = '';

  LightAppPreview: boolean = false;

  datalinkresult: string = '';

  datalinkcondition: any[]|string = [];

  datalinkschemacode: string = '';

  merge(dataset) { }
  mergeJson(json) { }
}

export default BaseOptions;
