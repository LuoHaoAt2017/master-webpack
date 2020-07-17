declare namespace H3 {
  namespace Form {
    interface RuntimeCache {
      Queue: string[];
      Map: {
        [schemaCode: string]: SchemaCache;
      }
      Count?: number;
    }

    interface SchemaCache {
      Javascript: string;
      SheetContent: string;
      TimeStamp: number;
      CacheIsBetaForm: boolean;
    }

    interface PageDataTrack {
      [key: string]: DataCache;
    }

    interface DataCache {
      fromHome?: boolean;
      appCode: string;
      workItemId: string;
      schemaCode: string;
      DisplayName: string;
      bizObjectId: string;
      fromBoard?: boolean;
    }
  }
}
