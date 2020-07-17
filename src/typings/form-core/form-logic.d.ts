interface FormLogicOptions {
  bizObjectId: string;
  returnData: any;
  formData: any;
  Javascript: string;
  updateView: (mutType: string, payload: any) => void;
}

// interface FormLogic extends ActionMixin, HelperMixin, LifestateMixin{
//   config: any;

//   $renderFields: string[];

//   // $dispatcher: Dispatcher;

//   // $caculator: Caculator;

//   // $customApi: CustomApi;
// }


interface ActionMixin {
  $validate: (actionName: string) => { pass: boolean, invalidControl: string };
  $doAction: (actionControl: any, text:string, attachments: any[], url: string) => Promise<any>|false;
  $getPostValue: (actionControl: any) => any;
}

interface HelperMixin {
  $batchAllField: (callback: (dataField: string, control: any) => void) => void;
  $batchAllRendered: (callback: (dataField: string, control: any) => void) => void;
  $setQueryCache: (id:string, queryItem:any) => void;
  $getQueryCache: (id:string) => any;
  $errorHandler: (errorMsg: string, error: Error) => void;
}

interface LifestateMixin {
  $triggerEvent: (eventName:string) => void;
  $hangupAsync: () => number;
  $resolveAsync: (id:string) => void;
  $nextLoop: (callback: () => void) => void;
  $destroy: () => void;
}
