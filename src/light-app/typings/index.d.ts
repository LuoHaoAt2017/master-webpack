declare namespace H3 {
  namespace LightApp {
    // 数据节点类型
    type NodeType = {
      Application: 190,
      Form: 200,
      Scheme: 210,
      Report: 220,
      Group: 230,
      NoListForm: 240,
      Custom: 300
    }
    interface CreateLightAppData {
      appCode: string;
    }
    interface GetAppFormData {}
    // 应用表单返回数据
    interface AppContentReturnData {
      GoodsCode?: string | null;
      LicenseExpiredDate?: string;
      LicenseIsAdministrator?: boolean;
      LicenseResidueFileSize?: number;
      LicenseSolutionCode?: string;
      LicenseSolutionName?: string;
      LicenseSolutionStates?: number[];
      LicenseSolutionType?: number;
      Schemas: SchemaData[];
      AppName: string;
      IsLightApp: boolean;
      OperationPermission: boolean;
    }
    interface SchemaData {
      AppCode: string;
      Childrens: SchemaListItem[] | null;
      DisplayName: string;
      GroupCode: string;
      GroupDisplayName: string;
      loading?: boolean;
      fold: boolean;
    }
    interface SchemaListItem {
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
      originName?: string;
    }
    interface FormControlsData {}
  }
}
