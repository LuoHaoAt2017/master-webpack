window.GlobalWorkflowProperties = {
  WorkflowMode: undefined,
  SchemaCode: undefined,
  WorkflowCode: undefined,
  WorkflowVersion: undefined,
  WorkflowTemplate: undefined,
  ActivityTemplateConfigs: undefined,
  Workflow: undefined,
  WorkflowDocument: undefined,
  WorkflowInstance: undefined,
  WorkItems: undefined,
  SVG: undefined,
  Wp: undefined,
  vueInstance: undefined,
  VM: null,
};

// 将像素值字符串转为数值
String.prototype.parsePxToFloat = function parsePxToFloat() {
  let f = parseFloat(this.toString().replace('px', ''));
  if (Number.isNaN(Number(f))) { f = 0; }
  return f;
};
