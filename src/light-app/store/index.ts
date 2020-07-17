import { Module } from 'vuex';
import actions from './actions';
import mutations from './mutations';

export class LightAppModuleState {
  appCode: string = ''; // 应用唯一标识符
  formControls: H3.LightApp.ControlType[] = []; // 表单控件
  subFormControls: H3.LightApp.ControlType[] = []; // 子表
  formName: string = '未命名的数据表'; // 表单名称
  subFormName: string = '未命名的子数据表';// 子表单名称
  formCode: string = ''; //表单唯一标识符
  selectedControl: string = '';
  subSelectedControl: string = '';
  colsNameList: string[] = [];
  subColsNameList: string[] =[];
  schemaList: string = '';
  formObjectId: string = ''; //选中表单ObjectId
  controlCodeList: string[] = [];
  formDataUpdateStatus: boolean = false;
  isWorkflow: boolean = false; // 表单是否开启流程设计，如开启了流程设计，则必填项在流程内设置
  uniqueControl: number[] = []; // 只允许添加一次的控件
  
  total: number = 0;
  formRows: any[] = [];
  formCols: any[] = [];
}

const LightAppModule: Module<LightAppModuleState, any> = {
  namespaced: true,
  state: new LightAppModuleState(),
  mutations,
  actions
};

export default LightAppModule;
