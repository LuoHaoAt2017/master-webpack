<template>
  <ControlWrapper
    class="form-user"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <H3Org
      :class="wrapCls"
      :org="treeNodes"
      :title="options.DisplayName"
      :selectedData="selectedData"
      :searchData="searchList"
      :orgName="options.key"
      :selectUser="userVisible"
      :selectOrg="orgUnitVisible"
      :isMulpitle="false"
      :placeholder="editable ? placeholder : ''"
      :readonly="!editable"
      :tip="options.description"
      :layout="!editable && selectedData.length < 1 ? 'v' : 'h'"
      :required="editable && options.Required"
      :showModal="pickerShow"
      :showReturn="false"
      :realTimeSearch="true"
      :topNavigation="topNavigation"
      @add="treeFocus"
      @delect="delect"
      @clickTag="showUserDingInfo"
      @onClickBreadcrumb="onClickBreadcrumb"
      @change="onChange"
      @onSearch="onSearch"
      @onClickTrunBack="onClickTrunBack"
      @onClickNextHierarchy="onClickNextHierarchy"
      @ok="onOk"
      @cancle="onCancle"
    />
  </ControlWrapper>
</template>

<script lang="ts">
import { H3Org } from 'h3-mobile-vue';
import { Component, Mixins } from 'vue-property-decorator';
import mixin from '../mixins/user-base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';
// import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { State } from 'vuex-class';
// import Layout from '../../shared/layout/index.vue';

  @Component({
    components: {
      H3Org,
      ControlWrapper,
    },
  })
export default class FormUser extends Mixins(mixin) {
    @State('UserInfo')
    UserInfo!: H3.Common.UserInfo;

    get selectedData () {
      if (this.value === undefined || this.value == null || this.value === '') {
        return [];
      }
      return this.value.map((x: any) => ({
        id: x.UnitID || x.UnitId,
        key: x.UnitID || x.UnitId,
        name: x.DisplayName || x.Name,
        type: (x.UnitType === 4 || x.Type === 4) ? 'user' : 'org',
        source: x,
        avatar: x.ProfilePhotoUrl || x.Avatar,
      }));
    }

    created () {
      if (this.dataField === 'OwnerId' || this.dataField === 'OwnerDeptId') {
        this.options.Required = true;
      }
    }

    mounted () {
      // 迭代25新增功能 人员单选默认值 先注释等新版表单上线 已遗至逻辑层
      // if (this.options.showcuruser && !this.options.orgunitvisible && this.IsCreateMode && this.value.length < 1 ) {
      //   this.value = [this.UserInfo.userId]
      // }
    }
}
</script>

<style lang="less">
  .form-user {
    .h3-org{
      .h3-field-layout-h-label{
        font-weight: 600;
        color: #333;
      }
    }
    .h3-org-select{
      z-index: 999;
      .h3-modal-container{
        position: absolute;
      }
    }
    .icon-base-plus{
      color:#666;
    }
  }
  .h3-org-select, form-user{
    .aufont{
      line-height: inherit;
    }
  }
</style>
