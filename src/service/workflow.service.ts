// zyq;
import fetch from '@/config/fetch';
import Reponse = H3.Http.Response;
import Workflow = H3.Workflow;

// 请求后台能流畅
export const getWorkflowSchemaList = (solutionCode, appCode) =>
  fetch<Reponse<Workflow.WorkflowContentReturnData>>(
    'Mobile/MobileService/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'GetWorkflowSchemas',
        AppCode: appCode,
        SolutionCode: solutionCode
      })
    },
    'POST'
  );
