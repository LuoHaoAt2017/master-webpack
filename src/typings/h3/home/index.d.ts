declare namespace H3 {
  namespace Home {
    interface PageData {
      BannerList: Banner[];
      MyWorkflow: MyWorkflowItem[];
      RecentAppList: RecentAppItem[];
      ReportList?: ReportItem[];
      TimeStamp: number;
      IsApp: boolean;
    }

    interface WorkflowData {
      MyWorkflow: MyWorkflowItem[];
    }

    interface RecentData {
      DbRecentAppList: RecentAppItem[];
      RecentModifiedTimestamp: number;
    }

    interface LocalRecentData {
      list: RecentAppItem[];
      stamp: number;
    }

    interface RecentAppItem {
      Active: boolean
      AppCode: string
      BeCreated: boolean
      BgColor?: string
      Code: string
      DisplayName: string
      IconCss: string
      MenuType: string
      ObjectId: string
      OpenType: number
      ParentCode: string
      SchemaCode: string
    }

    interface Banner {
      Content: string;
      Cover: string;
      CreatedTime: string;
      Deadline: string;
      EffectiveModules: string[];
      ExistDetail: boolean;
      FilePath: string;
      IsShow: boolean;
      ModifiedTime: string;
      ObjectId: string;
      SortIndex: number;
      Title: string;
      LinkUrl: string;
    }

    enum MyWorkflowType {
      /** 待我审批 */
      Transact = 1,
      /** 待我经办 */
      Approval = 2,
      /** 抄送我的 */
      Circulate = 3,
      /** 我申请的 */
      Apply = 4,
    }
    interface MyWorkflowItem {
      Count: number;
      IsRemind?: boolean;
      Type: MyWorkflowType;
    }

    interface ReportItem {
      ReportId: string;
      ReportWidgetId: string;
      ReportWidgetName: string;
      WidgetType: number;
      IsChart3:boolean; // 是否仪表盘
      config: any;
      corpId: string;
      objectId: string;
      uuid: string;
    }
  }
}
