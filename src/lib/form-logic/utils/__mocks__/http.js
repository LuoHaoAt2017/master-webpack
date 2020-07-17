export const getHomeDatas = () => {};

function getBizObject(schemaCode, objectId) {
  const mockData = {
    'mock-schema-code': {
      'mock-guid-1': {
        Name: '测试数据1',
        ObjectId: 'mock-guid-1',
      },
      'mock-guid-2': {
        Name: '测试数据2',
        ObjectId: 'mock-guid-2',
      },
      'mock-guid-3': {
        Name: '测试数据3',
        ObjectId: 'mock-guid-3',
      },
    },
    'mock-query-schema-code': {
      'mock-form-guid-1': {
        CreatedBy: 'mock-user-id-1',
        CreatedBy_Name: ['张三'],
        CreatedTime: '2018-09-21 16:35',
        EnableHomePage: false,
        EnableTask: false,
        AA: '表单是一个填不满的坑',
        BB: 678,
        CC: '张飞',
        DD: true,
        EE: '2018-09-21 16:35',
        FF: 'mock-guid-1',
        FF_Name: '测试数据1',
        FF_SchemaCode: 'mock-schema-code',
        GG: 'mock-user-id-1',
        GG_Name: ['张三'],
        HH: ['mock-user-id-1', 'mock-user-id-2'],
        HH_Name: ['张三', '李四'],
        II: '前端是一个无底洞',
        ModifiedBy: '',
        ModifiedBy_Name: [],
        ModifiedTime: '2018-09-21 16:35',
        Name: '201800000016   测试AA     ',
        ObjectId: 'mock-form-guid-1',
        OwnerDeptId: 'mock-dept-id-1',
        OwnerDeptId_Name: ['研发中心'],
        OwnerId: 'mock-user-id-1',
        OwnerId_Name: ['张三'],
        SeqNo: '201800000016',
        Status: 1,
        Summary: '',
        WorkflowInstanceId: '',
      },
    },
    'mock-query-sub-schema-code': {
      'mock-row-guid-1': {
        'Grid.a': '第一行',
        'Grid.b': 11111,
        'Grid.c': '选项1',
        'Grid.d': 'mock-guid-1',
        'Grid.d_SchemaCode': 'mock-schema-code',
        'Grid.e': true,
        'Grid.f': '子表f1',
        'Grid.g': 'mock-dept-id-2',
        'Grid.g_Name': ['测试部'],
        'Grid.h': '2018-9-26 16:26',
        'Grid.Name': '我是第一行',
        'Grid.ObjectId': 'mock-row-guid-1',
        'Grid.ParentObjectId': '',
      },
      'mock-row-guid-2': {
        'Grid.a': '第二行',
        'Grid.b': 22222,
        'Grid.c': '选项2',
        'Grid.d': 'mock-guid-2',
        'Grid.d_SchemaCode': 'mock-schema-code',
        'Grid.d_Name': '测试数据2',
        'Grid.e': false,
        'Grid.f': '子表f2',
        'Grid.g': 'mock-dept-id-1',
        'Grid.g_Name': ['研发中心'],
        'Grid.h': '2018-9-26 16:26',
        'Grid.Name': '我是第一行',
        'Grid.ObjectId': 'mock-row-guid-2',
        'Grid.ParentObjectId': '',
      },
    },
  };
  return mockData[schemaCode] && mockData[schemaCode][objectId];
}

function getUnit(unitId) {
  const mockDeptData = {
    'mock-dept-id-1': {
      Avatar: null,
      Birthday: '/Date(-62135596800000)/',
      ChildrenNodes: [],
      Code: 'G00049',
      DepartmentName: null,
      DingTalkAccount: null,
      DisplayName: '研发中心',
      Email: null,
      Gender: 0,
      Icon: 'glyphicon-folder-close',
      IsExpand: false,
      IsSelected: true,
      Level: 0,
      Mobile: null,
      ParentId: 'mock-dept-parent-guid',
      Type: 2,
      UnitID: 'mock-dept-id-1',
    },
    'mock-dept-id-2': {
      Avatar: null,
      Birthday: '/Date(-62135596800000)/',
      ChildrenNodes: [],
      Code: 'G00049',
      DepartmentName: null,
      DingTalkAccount: null,
      DisplayName: '测试部',
      Email: null,
      Gender: 0,
      Icon: 'glyphicon-folder-close',
      IsExpand: false,
      IsSelected: true,
      Level: 0,
      Mobile: null,
      ParentId: 'mock-dept-parent-id',
      Type: 2,
      UnitID: 'mock-dept-id-2',
    },
  };
  const mockUserData = {
    'mock-user-id-1': {
      Avatar: 'https://static.dingtalk.com/media/lADPACOG83npV-fNAe_NAgc_519_495.jpg',
      Birthday: '1753/1/1',
      Code: 'ZHANGSAN',
      DepartmentName: '研发中心',
      DeptId: 0,
      DingTalkAccount: '1032095221472761.ding83d0fc05f4b7420f35c2f4657eb6378f',
      DisplayName: '张三',
      Email: 'zhangsan@authine.com',
      Gender: '未知',
      HasChild: false,
      Icon: 'glyphicon-user',
      Mobile: '18612345678',
      ParentId: 'mock-dept-id-1',
      Type: 4,
      UnitID: 'mock-user-id-1',
      _Gender: 0,
    },
    'mock-user-id-2': {
      Avatar: 'https://static.dingtalk.com/media/lADPACOG83npV-fNAe_NAgc_519_495.jpg',
      Birthday: '1753/1/1',
      Code: 'LISI',
      DepartmentName: '测试部',
      DeptId: 0,
      DingTalkAccount: '1032095221472761.ding83d0fc05f4b7420f35c2f4657eb6378f',
      DisplayName: '李四',
      Email: 'lisi@authine.com',
      Gender: '未知',
      HasChild: false,
      Icon: 'glyphicon-user',
      Mobile: '13087654321',
      ParentId: 'mock-dept-id-2',
      Type: 4,
      UnitID: 'mock-user-id-2',
      _Gender: 1,
    },
  };
  return mockDeptData[unitId] || mockUserData[unitId];
}

export const getFormatBizObject = function getFormatBizObject(schemaCode, objectIdStr) {
  const queryDatas = [];
  const objectIdList = objectIdStr.split(';');
  for (const objectId of objectIdList) {
    const obj = getBizObject(schemaCode, objectId);
    if (obj) {
      queryDatas.push(obj);
    }
  }
  return Promise.resolve({
    Successful: true,
    ReturnData: {
      ListViewData: queryDatas,
    },
    Logined: true,
  });
};

export const getMultiFormUser = function getMultiFormUser(unitIdArr) {
  if (typeof unitIdArr === 'string') {
    unitIdArr = JSON.parse(unitIdArr);
  }
  const queryDatas = [];
  for (const unitId of unitIdArr) {
    const obj = getUnit(unitId);
    if (obj) {
      queryDatas.push(obj);
    }
  }
  return Promise.resolve({
    Successful: true,
    ReturnData: {
      UnitItems: queryDatas,
    },
    Logined: true,
  });
};

// 关联表单关联附件控件时请求数据
export const GetMappingFilesData = () => Promise.resolve({
  Successful: true,
  ReturnData: {
    HandlerResult: [{
      AttachmentId: '0ef8bd9a-4c6a-430f-bd32-fdbc9190a8e3',
      Description: null,
      FileId: '0ef8bd9a-4c6a-430f-bd32-fdbc9190a8e3',
      FileName: 'Screenshot.png',
      Size: 53185,
      Thumb: 'https://testci-ossthumbnail.oss-cn-shenzhen.aliyuncs.com/t0pyfnw9k53ocwir4tkbav932/0ef8bd9a-4c6a-430f-bd32-fdbc9190a8e3',
    }],
  },
  Logined: true,
});

// 关联表单时获取关联子表数据
export const getChildSheetData = () => {
  const mockData = [
    getBizObject('mock-query-sub-schema-code', 'mock-row-guid-1'),
    getBizObject('mock-query-sub-schema-code', 'mock-row-guid-2'),
  ];
  return Promise.resolve({
    Successful: true,
    ReturnData: {
      ListViewData: mockData,
    },
    Logined: true,
  });
};

