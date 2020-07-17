<template>
  <ControlWrapper
    class="form-multi-user"
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
      :isMulpitle="true"
      :placeholder="editable ? placeholder : ''"
      :readonly="!editable"
      :tip="options.description"
      :required="editable && options.Required"
      :showModal="pickerShow"
      :showReturn="false"
      :realTimeSearch="true"
      :layout="!editable && selectedData.length < 1 ? 'v' : 'h'"
      ::topNavigation="topNavigation"
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

  @Component({
    components: {
      H3Org,
      ControlWrapper,
    },
  })
export default class FormMultiUser extends Mixins(mixin) {
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
}
</script>

<style lang="less">
  .form-multi-user {
    .h3-org{
      .h3-field-layout-h-label{
        font-weight: 600;
        color: #333;
      }
    }
    .h3-org-select{
      z-index: 999;
    }
    .icon-base-plus{
      color:#666;
    }
  }
  .h3-org-select, .h3-org{
    .aufont{
      line-height: inherit;
    }
  }
</style>
