
export default {
  data() {
    return {
    };
  },
  methods: {
    Submit() {

      let successTips;
      const responseContext = this.$store.state.Form.ViewModel[this.bizObjectId].$responseContext;
      if ((actionControl.Action === 'Submit' &&
          (responseContext.InstanceId || responseContext.WorkItemId) &&
          !responseContext.IsCreateMode && responseContext.WorkflowState !== 4 &&
          responseContext.WorkItemType === 2)) {
        successTips = '审批';
      } else {
        successTips = actionControl.Text;
      }

      if((this.responseContext.InstanceId ||
        this.responseContext.WorkItemId) &&
        !this.responseContext.IsCreateMode &&
        this.responseContext.WorkflowState !== 4 &&
        this.responseContext.WorkItemType === 2){

        const pageValid = await this.validateControls(commentItem.Action);
        if (pageValid) {
          this.$router.push({
            name: 'approve',
            params: {
              commentPlaceholder: this.commentPlaceholder,
              commmentItem: JSON.stringify(commentItem),
              destActivity: this.destActivity,
              fromRoute: this.fromRoute.toString(),
              bizObjectId: this.bizObjectId,
              currentCommentId: this.currentCommentId
            },
          });
        }

      }else{
        const pageValid = await this.validateControls(commentItem.Action);
        if (pageValid) {
          this.dispatchDoAction(commentItem, commentItem.Text, null);
        }
      }
    },

    Reject() {
      this.commentPlaceholder = '请输入您的审批意见';
      this.$router.push({
        name: 'approve',
        params: {
          commentPlaceholder: this.commentPlaceholder,
          commmentItem: JSON.stringify(commentItem),
          destActivity: this.destActivity,
          fromRoute: this.fromRoute.toString(),
          bizObjectId: this.bizObjectId,
          currentCommentId: this.currentCommentId
        },
      });
    },

    Edit() {
      this.$router.replace({
        name: 'formPage',
        params: {
          schemaCode: this.responseContext.SchemaCode,
          bizObjectId: this.responseContext.BizObjectId,
          isExternalForm: this.isExternalFormBol ? '1' : '',
          mode: '0',
        },
      });
    },

    LinkToSns() {
      const snscounts = commentItem.Text.substring(commentItem.Text.indexOf('(') + 1, commentItem.Text.indexOf(')'));
      if (snscounts !== '0') {
        this.$router.replace({
          name: 'snslist',
          params: {
            schemaCode: this.schemaCode || window.GlobalConfig.schemaCode,
            bizObjectId: this.bizObjectId || this.responseContext.BizObjectId,
          },
        });
      } else {
        this.$router.push({
          name: 'snscomment',
          params: {
            schemaCode: this.schemaCode || window.GlobalConfig.schemaCode,
            bizObjectId: this.bizObjectId || this.responseContext.BizObjectId,
          },
        });
      }
    },
    'QrCode,ExternalShare'() {
      let schemaCode = '';
      if (this.schemaCode) {
        schemaCode = this.schemaCode;
      } else {
        schemaCode = window.GlobalConfig.schemaCode;
      }
      this.$router.push({
        name: 'share',
        params: {
          displayName: this.responseContext.Name,
          bizObjectId: this.responseContext.BizObjectId,
          schemaCode,
          appCode: this.appCode,
        },
      });
    },

    CancelInstance() {
      // 有问题
      H3PluginDeveloper.IConfirm('提示', '您确定作废流程吗？', (ev) => {
        if (ev) {
          this.dispatchDoAction(commentItem, commentItem.Text, null);
        }
      });
    },
    Remove() {
      // 有问题
      H3PluginDeveloper.IConfirm('提示', '确定删除该条数据吗?', (ev) => {
        if (ev) {
          this.dispatchDoAction(commentItem, commentItem.Text, null);
        }
      });
    },

    Forward() {
      this.$router.push({
        name: 'forwardSelect',
        params: {
          actionControl: commentItem,
          bizObjectId: this.bizObjectId,
        }
      });
    },

    Other() {
      this.dispatchDoAction(commentItem, commentItem.Text, null);
    }
  }
};
