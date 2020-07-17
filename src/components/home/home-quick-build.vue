<template>
   <div class="home-quick-card" v-if="RecentAppList.length > 0">
       <!-- <template v-if="false">
            <div class="schemas-group__loading">
                <skeleton class="qiuck-loading"></skeleton>
            </div>
        </template> -->
        <template>
            <div class="title">
                <p class="dp-font30">快速新增</p>
            </div>
            <div class="quick-form-list">
                <ul>
                    <li
                        v-for="(app, index) in RecentAppList"
                        :key="index"
                        @click="openForm(app, '1')"
                    >
                        <cell-list
                        :name="app.DisplayName"
                        :id="app.ObjectId"
                        :iconName="app.IconCss"
                        :isLight="app.IsLight"
                        >
                        </cell-list>
                    </li>
                </ul>
            </div>
       </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch, Mixins } from "vue-property-decorator";
import { State, Action, namespace } from 'vuex-class';
import { HomeActionType } from '@/store/modules/home/types';
import skeleton from '@/components/common/skeleton-loading.vue';
import { onAppClose } from '@/config/dingtalk-interface';
import { saveRecentApps } from '@/service/home.service';
import OpenFormMixin from '../../mixins/openForm';

// vuex-class module命名空间
const homeModule = namespace('Home');

import cellList from '@/components/common/cell-list.vue';
@Component({
  components: {
    cellList,
    skeleton,
  }
})
export default class HomeQuickBuild extends Mixins(OpenFormMixin) {
    @homeModule.State('RecentAppList') RecentAppList; // 快速新增

    created() {
        // onAppClose(() => {
        //     if (this.RecentAppList && this.RecentAppList.length > 0) {
        //         const recentCodes = this.RecentAppList.map(app => app.Code).join(',');
        //         saveRecentApps(recentCodes);
        //     }
        // });
        // window.addEventListener('beforeunload', (evt) => {
        //     if (this.RecentAppList && this.RecentAppList.length > 0) {
        //         const recentCodes = this.RecentAppList.map(app => app.Code).join(',');
        //         saveRecentApps(recentCodes);
        //     }
        // });
    }

}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.home-quick-card {
    width: 100%;
    background: #fff;
    .px2rem(margin-bottom, 40);
    .title{
        .px2rem(margin-left, 30);
        .px2rem(margin-right, 26);
        border-bottom: 1px solid #F2F2F2;
        p{
            color: #333;
            font-weight: 600;
            .px2rem(line-height, 42);
            .px2rem(padding-top, 22);
            .px2rem(padding-bottom, 19);
            .px2rem(padding-left, 12);
        }
    }
    .quick-form-list{
        width: 100%;
        .px2rem(margin-top, 30);
        .px2rem(padding-bottom, 30);
        .px2rem(padding-left, 20);
        overflow: hidden;
        position: relative;
        ul{
            .px2rem(padding-right, 20);
            white-space: nowrap;
            overflow: hidden;
            overflow-x: auto;
            li{
                margin: 0 3px;
                .px2rem(width, 156);
                display: inline-block;
                .cell-list{
                    padding:0;
                }
                /deep/ .cell-list__bottom{
                    .px2rem(margin-top, 12);
                    /deep/ .cell-list__bottom--name{
                        .px2rem(font-size, 24);
                        .px2rem(height, 34);
                    }
                }

            }
        }
    }
    .qiuck-loading{
        width: 100%;
        height: 150px;
    }
}
</style>
