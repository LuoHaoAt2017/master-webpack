declare namespace H3 {
  namespace Form {
    interface QueryValue {
      ObjectId: string,
      Name: string,
    }
    interface FrontEvent {
      events: Events;
    }
    interface Events {
      frontendEvents: FrontendEvents[];
    }
    interface FrontendEvents {
      id: string;
      relyFieldCodes: string[];
      triggerFieldCode: string;
    }
    interface PageData {
      Data: {
        AppCode: string;
        Javascript: string;
        DisplayName: string;
        FormContent: string;
        HtmlContent: string;
        Mode: string;
        ViewContext: any;
        CarryOverMapping: {
          [dataField: string]: QueryValue
        };
        AssociationBOs: any;
      }
      TimeStamp?: number;
      CacheIsBetaForm?: boolean;
      EnableReviewExternalForm: boolean;
      ReviewMobileQrCodeUrl?: boolean;
    }
    interface SNSComment {
      CommentId: string;
    }
    interface SNSList {
      snsItemList: SNSItemList[]
    }
    interface SNSItemList {
      BizObjectId: null;
      Comments: any[];
      CreatedBy: string;
      CreatedTime: string;
      Files: any[];
      FormatCreatedTime: string;
      IsMyItem: boolean;
      ItemType: number;
      Likes: any[];
      LinkContent: string;
      Name: string;
      ObjectId: string;
      ProfilePhotoUrl: string;
      Text: string;
    }
    enum FormMode {
      // 未指定
      Unspecified= -1,
      // 编辑模式
      Edit= 0,
      // 查看模式
      Readonly= 1,
      // 发起流程
      Create= 2,
      // 打印模式
      Print= 3,
    }
  }
}
