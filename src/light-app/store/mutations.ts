import Vue from 'vue';
import { MutationTree } from 'vuex';
import { LightAppModuleState } from '.';
import { LightAppMutationType } from './types';
import { ControlStatus } from '@/light-app/config/const';
import LightApp = H3.LightApp;

const mutations: MutationTree<LightAppModuleState> = {
  [LightAppMutationType.IsWorkflow](state, payload: boolean) {
    state.isWorkflow = payload;
  },
  [LightAppMutationType.UpdateColsNameList](state, payload: any) {
    const { name, subSheet, clear, status, index } = payload;
    let newState = subSheet ? 'subColsNameList' : 'colsNameList';
    let controls = subSheet ? state.subFormControls : state.formControls;
    if (clear) {
      state[newState] = [];
    } else {
      switch (status) {
        case 'delete':
          state[newState].splice(index, 1);
          break;
          case 'reset':
          state[newState] = [];
          controls.forEach( control => {
            state[newState].push(control.Options.DisplayName);
          })
          break;
        default:
          state[newState].push(name);
          break;
      }
    }
  },
  [LightAppMutationType.UpdateControlCodeList](state, payload: any) {
    const { key, status, clear } = payload;
    if (clear) {
      state.controlCodeList = [];
    } else {
      switch (status) {
        case 'delete':
          const index = state.controlCodeList.indexOf(key);
          if (index >= 0) {
            state.controlCodeList.splice(index, 1);
          }

          break;
        default:
          state.controlCodeList.push(key);
          break;
      }
    }
  },
  [LightAppMutationType.UpdateFormName](state, payload: any) {
    const { subSheet, name } = payload;
    let newState = subSheet ? 'subFormName' : 'formName';
    state[newState] = name;
    state.formDataUpdateStatus = true;
  },
  [LightAppMutationType.AppCode](state, payload: string) {
    state.appCode = payload;
  },
  [LightAppMutationType.FormControls](state, payload: any) {
    state.formDataUpdateStatus = false;
    state.formControls = payload;
  },
  [LightAppMutationType.SelectedControl](state, payload: any) {
    const { code, subSheet } = payload;
    let newState = subSheet ? 'subSelectedControl' : 'selectedControl';
    state[newState] = code;
  },
  [LightAppMutationType.UpdateFormControls](state, payload: any) {
    const { status, control, subSheet } = payload;
    let newState = subSheet ? 'subFormControls' : 'formControls';
    state.formDataUpdateStatus = true;
    switch (status) {
      case ControlStatus.Create:
        state[newState].push(control);
        break;
      case ControlStatus.DownAdd:
        (() => {
          const selectedControl = subSheet
            ? state.subSelectedControl
            : state.selectedControl;
          const index = state[newState].findIndex(
            item => item.Key === selectedControl
          );
          state[newState].splice(index + 1, 0, control);
        })();
        break;
      case ControlStatus.Edit:
        (() => {
          const index = state[newState].findIndex(
            item => item.Key === control.Key
          );
          state[newState].splice(index, 1, control);
        })();
        break;
      default:
        state[newState] = control;
        break;
    }
  },
  [LightAppMutationType.MoveFormControls](state, payload: any) {
    const { source, target, subSheet } = payload;
    let newState = subSheet ? 'subFormControls' : 'formControls';
    let temp = state[newState].splice(source, 1);
    let start = state[newState].splice(0, target);
    state[newState] = [...start, ...temp, ...state[newState]];
    state.formDataUpdateStatus = true;
  },
  [LightAppMutationType.FormControlsDele](state, payload: any) {
    const { Key, subSheet } = payload;
    let newState = subSheet ? 'subFormControls' : 'formControls';
    const index = state[newState].findIndex(item => item.Key === Key);

    state[newState].splice(index, 1);
    state.formDataUpdateStatus = true;
  },
  [LightAppMutationType.FormCode](state, payload: string) {
    state.formCode = payload;
  },
  [LightAppMutationType.HandleRenameSheet](state, payload: string) {
    state.schemaList = payload;
  },
  [LightAppMutationType.SelectFormObjectId](state, payload: string) {
    state.formObjectId = payload;
  },
  [LightAppMutationType.HandleUniqueControls](state, payload: any) {
    const { status, control } = payload;
    switch (status) {
      case 'add':
        (() => {
          const index = state.uniqueControl.findIndex(
            item => item === control
          );
          if (index < 0) {
            state.uniqueControl.push(control);
          }
        })();
        break;
      case 'delete':
        (() => {
          const index = state.uniqueControl.findIndex(
            item => item === control
          );
          state.uniqueControl.splice(index, 1);
        })();
        break;
      default:
        state.uniqueControl = [];
        break;
    }
  },
  [LightAppMutationType.HandleFormDataLists](state, payload) {
    state.total = payload.total;
    state.formCols = payload.cols;
    let tempArr: any = [];
    if(payload.pageIndex === 0) {
      tempArr = [].concat(payload.rows);
    }else {
      tempArr = state.formRows.concat(payload.rows);
    }
    state.formRows = tempArr;
    console.log('rows', state.formRows);
  }
};

export default mutations;
