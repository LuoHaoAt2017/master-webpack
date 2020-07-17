import HomeModule from './home';
import AppModule from './app';
import FormModule from './form';
import WorkflowModule from './workflow';
import LightAppModule from '@/light-app/store';
import LightListModule from '@/light-app/store/modules/list';
import LightBoardModule from '@/board/store';

export default {
  Form: FormModule,
  App: AppModule,
  Home: HomeModule,
  Workflow: WorkflowModule,
  LightApp: LightAppModule,
  LightList: LightListModule,
  LightBoard: LightBoardModule
};
