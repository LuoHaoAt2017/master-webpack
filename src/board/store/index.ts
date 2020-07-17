import actions from './actions';
import mutations from './mutations';
import getters from './getters';
// import Board from './state';


const LightBoardModule = {
  namespaced: true,
  actions,
  getters,
  state: {
    board: {},
    boardColumnRecords: {},
    editingStackValue: '', // 编辑的表单编码
  },
  mutations,
};

export default LightBoardModule;
