<template>
  <layout title="新建应用">
    <div
      class="app-page"
    >
      <div class="form-create-wrapper">
        <l-field
         ref="createAppGuide"
          title="应用名称"
          v-model="displayName"
          type="text"
          :maxLength="15"
          @focus="firstFocus"
        >
        </l-field>
        <div class="form-create__icon-control">
          <l-label title="应用图标">
            <h3-swiper
              class="icon-carousel-container"
              dotsPosition="center"
              dotsClass="spot"
              :height="height"
            >
              <h3-swiper-item
                class="form-icon-list clear"
                v-for="page in totalPages"
                :key="page"
              >
                <span
                  class="icon-box"
                  :title="icon"
                  v-for="icon in icons.filter((item, index) => index >= page * pageSize && index < page * pageSize + pageSize)"
                  :key="icon"
                  @click="setIcon(icon)"
                  :class="{ 'selected': icon === selectedIcon }"
                >
                  <i
                    class="h3yun_All"
                    :class="icon"
                  ></i>
                </span>
              </h3-swiper-item>
            </h3-swiper>
          </l-label>
        </div>
      </div>
      <div class="form-create__button">
        <button
          class="btn-reset"
          @click="createApp"
        >保存，继续新建数据表</button>
      </div>
    </div>
    <validate-panel></validate-panel>
  </layout>
</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
import { H3Dialog, H3Swiper } from 'h3-mobile-vue';
import { LLabel, LField } from '@/light-app/components';
import { createLightApp } from '@/light-app/service';
import { FormStatus } from '@/light-app/config/const';
import { FormActionType } from '@/store/modules/form/types';
import { AppActionType } from '@/store/modules/app/types';
import ValidatePanel from '@/components/form/shared/validate-panel.vue';
import Guide from '@/plugins/intro/guide';
import {
  LightAppActionType,
  LightAppMutationType
} from '@/light-app/store/types';
const FormModule = namespace('Form');
const appModule = namespace('App');
const LightAppModule = namespace('LightApp');
@Component({
  name: 'CreateLightApp',
  components: {
    LLabel,
    LField,
    H3Dialog,
    H3Swiper,
    H3SwiperItem: H3Swiper.Item,
    ValidatePanel
  }
})
export default class CreateLightApp extends Vue {
  displayName: string = '未命名的应用';

  selectedIcon: string = 'icon-gzd';

  rules: any = {
    displayName: [
      { maxLength: 15, minLength: 2, message: '请输入应用名称' },
      { required: true, message: '请输入应用名称' }
    ],
    selectedIcon: [{ required: true, message: '请选择应用图标' }]
  };
  icons: string[] = [];

  pageSize: number = 24; // icon图标每页显示数量

  isFirstFocus: boolean = true;

  $refs!: {
    createAppGuide: Vue,
  }

  @Mutation('excludeComp') excludeComp;

  @LightAppModule.Mutation(LightAppMutationType.AppCode) updateAppCode;

  @FormModule.Action(FormActionType.SHOWVALIDMSG) showValidMsg;

  @appModule.Action(AppActionType.GetAppList) getAppList;

  created() {
    import('@/icons/lightAppSelection.json').then(jsonData => {
      const { icons } = jsonData;
      if (icons) {
        this.icons = icons.map(icon => `icon-${icon.properties.name}`);
      }
    });
  }
  mounted() {
    // this.$nextTick(() => {
    //   const timer = window.setTimeout(() => {
    //     if (Guide.hasGuid) {
    //       Guide.setStep(2, {
    //         el: this.$refs.createAppGuide.$el,
    //         content: '输入应用名称，比如“销售管理”',
    //         zIndex: 100,
    //         placement: 'bottom',
    //         toolTipClass: 'create-app-guide',
    //         showNext: true,
    //         showEnd: true
    //       });
    //       Guide.next();
    //       Guide.show();
    //       this.backStack.push(Guide.quit);       
    //     }
    //     window.clearTimeout(timer);
    //   }, 300);
    // }); 
  }

  get totalPages() {
    return Math.floor(this.icons.length / this.pageSize);
  }

  get height() {
    return `${434 / 75}rem`;
  }

  setIcon(icon) {
    this.selectedIcon = icon;
  }

  firstFocus() {
    if (this.isFirstFocus) {
      Guide.hide();
      this.displayName = '';
      this.isFirstFocus = false;
    }
  }

  async createApp() {
    if (!this.displayName) {
      this.showValidMsg('请输入应用名称');
      return;
    }
    if (!this.selectedIcon) {
      this.showValidMsg('请选择应用图标');
      return;
    }
    if (this.displayName && this.selectedIcon) {
      if (Guide.hasGuid) {
        Guide.hide();
        this.backStack.popOnly();
      }
      H3PluginDeveloper.IShowPreLoader('创建中...');
      const params = {
        icon: this.selectedIcon,
        displayName: this.displayName
      };
      const res = await createLightApp(params);
      if (res.success) {
        H3PluginDeveloper.IHidePreLoader();
        this.updateAppCode(res.returnData.appCode);
        this.getAppList();
        this.$router.replace({
          name: 'lightFormDesignPage',
          query: {
            appCode: res.returnData.appCode,
            formStatus: FormStatus.Create
          }
        });
      } else {
        H3PluginDeveloper.IShowPreLoader('创建失败');
        Guide.quit();
      }
    }
  }

  beforeRouteLeave(to, from, next) {
    this.excludeComp(['CreateLightApp']);
    next();
  }
}
</script>

<style lang="less">
.spot {
  a {
    &:first-child {
      margin-left: 0 !important;
    }
    .h3-icon-dot {
      width: 0.2133rem !important;
      height: 0.2133rem !important;
      border-radius: 100px;
      clip-path: circle(50% at 50% 50%);
      background: #ccc;
    }
  }
  &.h3-indicator {
    bottom: 0.30677rem !important;
  }
}
</style>
<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.app-page {
  .px2rem(padding-bottom, 27);
}
.form-create {
  &-wrapper {
    padding: 0.4rem 0 0;
    padding-bottom: 0;
    background-color: #fff;
    .app-field-container {
      padding-left: 0.4rem;
      padding-right: 0.4rem;
    }
    .m-24 {
      .px2rem(padding-top, 48);
    }
    .input-control {
      width: 100%;
      .px2rem(height, 88);
      .px2rem(light-height, 88);
      .px2rem(margin-bottom, 24);
      .px2rem(padding-left, 15);
      .px2rem(font-size, 30);
      .px2rem(border-radius, 4);
      color: #ccc;
      border: 1px solid #e0e0e0;
      box-sizing: border-box;
    }
  }
  &__icon-control {
    .px2rem(padding-top, 3);
      padding-left: 0.4rem;
      padding-right: 0.4rem;
    .required-icon {
      vertical-align: middle;
      color: #d94838;
    }
    .icon-carousel-container {
      overflow: hidden;
    }
    .icon-carousel-list {
      width: 5000px;
      // transform: translate3d(0, 0, 0);
      transition: transform 0.1s ease-in;
    }
    .form-icon-list {
      .px2rem(width, 690);
      .px2rem(margin-top, 19);
      float: left;
      .icon-box {
        float: left;
        color: #93979d;
        .px2rem(width, 72);
        .px2rem(height, 72);
        .px2rem(margin-left, 51);
        .px2rem(margin-bottom, 18);
        line-height: 0.96rem;
        text-align: center;
        .h3yun_All {
          .px2rem(font-size, 48);
        }
        &:nth-child(6n + 1) {
          margin-left: 0 !important;
        }
        &.selected {
          color: #fff;
          background: @lightAppPrimaryColor;
          border-radius: 0.16rem;
        }
      }
    }
  }
  &__button {
    .px2rem(margin-top, 84);
    .px2rem(margin-left, 30);
    .px2rem(margin-right, 30);

    .btn-reset {
      .px2rem(font-size, 32);
    }
  }
}
</style>
