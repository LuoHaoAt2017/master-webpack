import { FormControlType } from '../typings/const';
const getters: any = {
  boardColumnName (state) {
    if (state.board && state.board.controls) {
      const control = state.board.controls.find(ctrl => ctrl.FieldCode === state.board.boardColumnField);
      if (control) {
        return control.DisplayName;
      }
    }
    return '';
  },
  boardColumnType (state) {
    if (state.board && state.board.controls) {
      const control = state.board.controls.find(ctrl => ctrl.FieldCode === state.board.boardColumnField);
      if (control) {
        return control.Type;
      }
    }
    return FormControlType.FormDropDownList;
  },
  controlOptions (state) {
    const ret = {};
    if(state.board.controls) {
      state.board.controls.forEach(ctrl => {
        if (ctrl.Type === FormControlType.FormNumber) {
          ret[ctrl.FieldCode] = {
            DisplayName: ctrl.DisplayName,
            Type: ctrl.Type,
            ShowMode: (ctrl as any).Options.ShowMode,
            DecimalPlaces: (ctrl as any).Options.DecimalPlaces <= 0 ? 0 : (ctrl as any).Options.DecimalPlaces,
          };
        } else if (ctrl.Type === FormControlType.FormDateTime) {
          ret[ctrl.FieldCode] = {
            DisplayName: ctrl.DisplayName,
            Type: ctrl.Type,
            DateTimeMode: (ctrl as any).Options.DateTimeMode,
          };
        } else {
          ret[ctrl.FieldCode] = {
            DisplayName: ctrl.DisplayName,
            Type: ctrl.Type,
          };
        }
      });
    }
    return ret;
  },
};

export default getters;
