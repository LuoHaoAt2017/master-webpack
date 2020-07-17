<template>
  <div class="home-user-info">
    <img :src="UserInfo.profilePhotoUrl" alt class="head-img" v-if="UserInfo.profilePhotoUrl">
    <div class="default-header dp-font24" v-if="!UserInfo.profilePhotoUrl">
      {{defaultHeaderName}}
    </div>
    <div class="name dp-font32">
      {{UserInfo.userName}}
    </div>
    <div class="name-hello dp-font32">
      ，你好
    </div>
    <div class="identify dp-font22" v-if="UserInfo.isAdministrator">管理员</div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, namespace } from 'vuex-class';
import { HomeActionType } from '@/store/modules/home/types';
import filterSpecial from '@/utils/filter-special-characters';

@Component
export default class HomeMyworkList extends Vue {
  @State('UserInfo')
  UserInfo: any;

  get defaultHeaderName() {
    const userName = this.UserInfo.userName || '';
    let res = filterSpecial(userName).toUpperCase();
    if (res) {
      res = res.substr(res.length - 2);
    }
    return res;
  }
}
</script>
<style lang="less">
  @baseFontSize: 75;
  @baseThemeColor: #1890ff;
  .px2rem(@name,@px) {
    @{name}: @px / @baseFontSize * 1rem;
  }
  .home-user-info {
    background-color: #fff;
    .px2rem(padding-top, 52);
    .px2rem(padding-left, 38);
    display: flex;
    flex-direction: row;
    align-items: center;
    .head-img, .default-header {
      .px2rem(width, 68);
      .px2rem(height, 68);
      border-radius: 50%;
      object-fit: cover;
    }
    .default-header{
      background-color: #107FFF;
      .px2rem(line-height, 68);
      text-align: center;
      color: #fff;
    }
    .name-identify {
      .px2rem(width, 310);
      .px2rem(height, 40);
      .px2rem(margin-left, 30);
    }
    .name {
      .px2rem(margin-left, 30);
      color: #333;
      .px2rem(line-height, 68);
      font-weight: 600;
      .px2rem(max-width, 328);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name-hello{
       color: #333;
      .px2rem(line-height, 68);
      font-weight: 600;
    }
    .identify {
      .px2rem(margin-left, 18);
      .px2rem(height, 40);
      .px2rem(padding-left, 20);
      .px2rem(padding-right, 20);
      text-align: center;
      .px2rem(line-height, 40);
      color: #107fff;
      background: #e0ecfa;
      .px2rem(border-radius, 20);
    }
  }
</style>

