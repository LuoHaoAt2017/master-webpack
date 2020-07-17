declare namespace H3 {
  namespace Guide {
    interface RecommendReturnData {
      [propName: string]: any;
      Result: RecommendTemplateList[];
    }
    interface RecommendTemplateList {
      Code: string;
      InstallCount: number;
      IsFree: boolean;
      Logo: string;
      Name: string;
      Summary: string;
      detailLoading?: boolean;
    }
    interface RecommendDetailReturnData {
      [propName: string]: any;
      TemplateDetail: RecommendDetailObj;
    }
    interface RecommendDetailObj {
      Code: string;
      CompanyName: string;
      InstalledCount: number;
      IsFree: boolean;
      Logo: string;
      Name: string;
      Price: number;
      Rate: number;
      Recommendation: string;
      Summary: string;
      MobileScreenShots: string[];
      CommentListTotal: number;
    }
  }
}
