declare namespace H3 {
  namespace App {
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

    // 节点可视
    enum NodeVisible {
      Inactive, // 未指定
      AllVisible, // 全部可见
      PcVisible, // Pc端可见
      MobileVisible, // 移动端可见
      Invisible // 不可见
    }

    // 应用来源
    enum AppSource {
      SelfBuild, // 自建
      Installed, // APaaS或SaaS
      Directional, // 定向安装
      Template // 模板
    }
    // 视图类型
    export enum ViewType {
      List = 0, // 列表
      Calendar, // 日历
      Timeline, // 时间戳
      Board, // 看板
    }

    // 应用列表返回数据
    interface AppListReturnData {
      AppFactoryGuideState: string | number;
      AppSolutions?: AppSolutions[];
      Apps: AppListItem[];
      AutoLoginToStore: string;
      CanCreateAndShareApp: boolean;
      ClusterType: string;
      CustomAppDic: any;
      DevCode: string;
      EngineType: string;
      IsDeveloper: boolean;
      ShowUpdateGuide: boolean;
      SaasAppList: any[];
      StoreHostAddress?: string;
      EntrySolutionIsAPaas?: boolean;
      canCreateLightApp?: boolean;

      CanCreateOldApp?: boolean;
    }
    // 解决方案
    interface AppSolutions {
      [propName: string]: string;
    }
    // 应用列表
    interface AppListItem {
      AppSource?: AppSource;
      Code: string;
      DisplayName: string;
      EnableDataAcl?: boolean;
      IconCss?: string;
      IsAppSetting?: boolean;
      IsSystem?: boolean;
      IsWorkflowNode?: boolean;
      NodeType?: NodeType;
      NodeVisible?: NodeVisible;
      ObjectId?: string;
      OpenType?: number;
      Removable?: boolean;
      SortKey?: number;
      State?: number;
      Visible?: boolean;
      isActive?: boolean;
      loading?: boolean;
    }
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
      DisplayMode?: number;
      ViewConfigs?: any;
    }
    interface GetStoreUrlReturnData {
      [propName: string]: any;
      StoreUrl: string;
    }
  }
}
