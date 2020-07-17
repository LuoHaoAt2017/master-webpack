export const DefaultValue = {
  ChildRepeatOption: 0,
  ComputationRule: null,
  ComputationRuleFields: null,
  DataDictItemValue: null,
  DisplayRule: null,
  DisplayRuleFields: null,
  Editable: false,
  Printable: true,
  Value: null,
  Visible: false,
  Required: false
};

export const DefaultControlValue = {
  FormDepartment: {
    options: {
      ismultiple: false,
      uservisible: false,
      orgunitvisible: true
    }
  },
  FormMultiDepartment: {
    options: {
      ismultiple: true,
      uservisible: false,
      orgunitvisible: true
    }
  },
  FormMultiUser: {
    options: {
      ismultiple: true,
      uservisible: true,
      orgunitvisible: false
    }
  },
  FormUser: {
    options: {
      ismultiple: false,
      uservisible: true,
      orgunitvisible: false
    }
  },
  FormQuery: {
    defaultOptions: {},
    options: {
      Editable: false
    }
  },
  FormCreater: {
    defaultOptions: {},
    options: {
      Editable: false
    }
  },
  FormOwner: {
    defaultOptions: {},
    options: {
      Editable: false
    }
  },
  FormOwnerDepartment: {
    defaultOptions: {},
    options: {
      Editable: false
    }
  },
  FormCreatedTime: {
    defaultOptions: {},
    options: {
      Editable: false
    }
  },
  FormModifiedTime: {
    defaultOptions: {},
    options: {
      Editable: false
    }
  }
};
