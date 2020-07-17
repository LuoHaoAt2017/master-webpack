import { ViewModelAction } from '@/store/modules/form/viewModel/types';

export default function mockStore(state) {
  return {
    commit(type, payload) {
      const callback = formMutations[type];
      if (callback) {
        callback(state, payload);
      }
    },
  };
}
