declare namespace H3 {
  namespace Workflow {
    // 数据节点类型
    enum NodeType {
      Application = 190,
      Form = 200,
      Scheme = 210,
      Report = 220,
      Group = 230,
      NoListForm = 240,
      Custom = 300
    }
    // 应用表单返回数据
    interface WorkflowContentReturnData {
      GoodsCode?: string | null;
      LicenseExpiredDate?: string;
      LicenseIsAdministrator?: boolean;
      LicenseResidueFileSize?: number;
      LicenseSolutionCode?: string;
      LicenseSolutionName?: string;
      LicenseSolutionStates?: number[];
      LicenseSolutionType?: number;
      WorkflowSchemas: WorkflowSchemaData[];
    }
    interface WorkflowSchemaData {
      AppCode: string;
      Childrens: WorkflowSchemaListItem[] | null;
      DisplayName: string;
      GroupCode: string;
      GroupDisplayName: string;
      loading?: boolean;
      fold: boolean;
    }
    interface WorkflowSchemaListItem {
      Active: boolean;
      AppCode: string;
      BeCreated: boolean;
      BgColor: string | null;
      Code: string;
      DisplayName: string;
      IconCss: string;
      NodeType: NodeType;
      ObjectId: string;
      OpenType: number;
      ParentCode: string;
      SchemaCode: string;
    }
  }
}
