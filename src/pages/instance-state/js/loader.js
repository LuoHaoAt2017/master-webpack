import { DomCollection } from './setting';
import Workflow from './workflow';
import WorkflowDocument from './workflow-document';
import { ActivityModelInit } from './activity/activity-model-init';

const init = function init(workflowCode, workflowTemplate, activityTemplateConfigs) {
  GlobalWorkflowProperties.Workflow = new Workflow(DomCollection.Workspace);
  // 使用Svg
  GlobalWorkflowProperties.Workflow.UtilizeSvg = true;
  GlobalWorkflowProperties.SVG = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
    .addClass('workspace_svg')
    .attr('version', '1.1');
  GlobalWorkflowProperties.SVG.css('width', '100%').css('height', '100%');
  $(GlobalWorkflowProperties.Workflow.workspace).children(':first').before(GlobalWorkflowProperties.SVG);
  ActivityModelInit(activityTemplateConfigs);
  WorkflowDocument.LoadWorkflow(workflowTemplate, false, true);
};

export default init;

