<template>
  <layout
    title="发起流程"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div id="schemas-page">
      <h3-blank-page v-if="schemaList.length === 0" tipText="暂无数据" img="../../assets/img/blankpage.png" />
      <div
        v-for="(group, index) in schemaList"
        :key="group.GroupCode"
        class="schemas-group"
      >
        <template v-if="group.loading">
          <div
            class="schemas-group__loading"
            :class="{last: index === schemaList.length - 1}"
          >
            <skeleton class="left" />
            <skeleton class="right" />
          </div>
        </template>
        <template v-else>
          <div
            class="schemas-group__name"
            :class="{last: index === schemaList.length - 1 && group.fold}"
          >
            <div
              class="schemas-name__mask"
              @click="toggleGroup(index, $event)"
            ></div>
            <div class="folder">
              <img
                v-show="group.fold"
                src="@/assets/img/schema-fold.svg"
              />
              <img
                v-show="!group.fold"
                src="@/assets/img/schema-unfold.svg"
              />
            </div>
            <span class="group-name">{{ group.DisplayName }}</span>
            <i
              class="arrow h3yun_All right-o fa box-icon"
              :class="{expand: !group.fold}"
            ></i>
          </div>
          <ul
            class="schemas-group__list"
            :class="{ungroup: group.GroupDisplayName === '未分组', expand: !group.fold}"
            :style="!group.fold ? `height: ${group.Childrens.length * 1.46667}rem` : ''"
          >
            <li
              v-for="(schema, i) in group.Childrens"
              :key="schema.Code"
              class="list-item"
              :class="{last: index === schemaList.length - 1 && i === group.Childrens.length - 1}"
              @click="openSchema(schema)"
            >
              <i
                :style="{color: getIconColor(schema.Code)}"
                class="schema-icon fa box-icon h3yun_All"
                :class="`${schema.IconCss}-o`"
              ></i>
              <span class="schema-name">{{ schema.DisplayName }}</span>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import skeleton from '@/components/common/skeleton-loading.vue';
import calcIconColor from '@/utils/calc-icon-color';
import { WorkflowActionType } from '@/store/modules/workflow/types';
import H3BlankPage from '../../../../packages/widgets/h3-blank-page/index.vue';
// vuex-class module命名空间
const workflowModule = namespace('Workflow');
const NodeType = {
  // 190: '应用程序',
  200: '非流程', // 列表模块（不能发起流程）
  210: '流程', // 流程列表模块（可以发起流程）
  220: '报表', // 报表模块
  // 230: '分组', // 节点分组
  240: '非流程', // 表单模块（无列表，单行数据）
  300: '自定义表单', // 自定义列表模块（不含表单）
  270: '仪表盘', // 自定义列表模块（不含表单）
};

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

  @Component({
    name: 'schemas',
    components: {
      skeleton,
      H3BlankPage,
    },
    filters: {
      formatSchemaType (val: number) {
        return NodeType[val];
      },
    },
  })
export default class Schemas extends Vue {
    @workflowModule.State('schemaList') schemaList; // 表单列表

    @workflowModule.Action(WorkflowActionType.GetWorkflowSchemas) getWorkflowSchemas;

    appCode: string = '';

    showFirstTips: boolean = false;

    viewHeight: number = 0;

    created () {
      this.viewHeight = document.body.getBoundingClientRect().height;
      this.getWorkflowSchemas();
    }

    beforeRouteLeave (to, from, next) {
      if (to.name === 'apps' || to.name === 'home' || to.name === 'singleApp') {
        this.$store.state.excludeComp = ['startWorkflow'];
      } else {
        this.$store.state.excludeComp = [];
      }
      next();
    }

    toggleGroup (index: number, event: any) {
      this.schemaList[index].fold = !this.schemaList[index].fold;
    }

    openSchema (schema: H3.Workflow.WorkflowSchemaListItem) {
      if (schema.NodeType === 210) {
        const appCode = schema.AppCode;
        const schemaCode = schema.Code;
        const appName = schema.DisplayName;
        this.$root.eventHub.$emit('query-lists');
        this.$router.push({
          name: 'formPage',
          params: {
            schemaCode: schemaCode,
          },
          query: {
            schemaCode: schemaCode,
          },
        });
      }
    }

    getIconColor (id) {
      return calcIconColor(id);
    }

    goBack () {
      this.$router.go(-1);
    }
}
</script>
<style lang="less" scoped>
  @baseFontSize: 75;
  @baseThemeColor: #107fff;
  .px2rem(@name,@px) {
      @{name}: @px / @baseFontSize * 1rem;
  }
  #schemas-page {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 499;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    background: #f5f7f9;
    .schemas-edit-tips {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .px2rem(padding-top, 12);
      .px2rem(padding-bottom, 12);
      .px2rem(padding-left, 20);
      .px2rem(padding-right, 20);
      background: #f2f8ff;
      span {
        font-size: 12px;
        color: #50a8ff;
      }
      img {
        .px2rem(width, 25);
        .px2rem(height, 25);
      }
    }
    .schemas-group {
      overflow: hidden;
      background-color: #fff;
      &:first-of-type {
        .px2rem(margin-top, 20);
      }
      &__name {
        display: flex;
        align-items: center;
        position: relative;
        .px2rem(height, 110);
        .px2rem(margin-left, 28);
        border-bottom: 1px solid #ebedf2;
        .schemas-name__mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        &.ungroup {
          display: none;
        }
        &.last {
          border-bottom: none;
        }
        .folder {
          display: flex;
          align-items: center;
          .px2rem(width, 70);
          img {
            .px2rem(width, 50);
          }
        }
        .arrow {
          .px2rem(width, 100);
          color: #c4cad9;
          text-align: center;
          transition: transform 0.15s ease;
          &.expand {
            transform: rotate(90deg);
          }
        }
        .group-name {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      &__list {
        height: 0;
        opacity: 0;
        transition: height 0.15s ease, opacity 0.15s ease;
        &.ungroup {
          .list-item {
            .px2rem(margin-left, 28);
          }
        }
        &.expand {
          opacity: 1;
        }
        .list-item {
          display: flex;
          align-items: center;
          .px2rem(height, 108);
          .px2rem(margin-left, 70);
          .px2rem(padding-right, 30);
          border-bottom: 1px solid #ebedf2;
          &.last {
            border-bottom: none;
          }
          .schema-icon {
            .px2rem(width, 88);
            .px2rem(height, 88);
            font-size: 22px;
            text-align: center;
            .px2rem(line-height, 88);
          }
          .schema-type {
            display: flex;
            justify-content: center;
            align-items: center;
            .px2rem(width, 88);
            .px2rem(height, 40);
            background: #e0ecfa;
            border-radius: 20px;
            color: @baseThemeColor;
            font-size: 11px;
            &.workflow {
              background: rgba(32, 207, 48, 0.1);
              color: #069913;
            }
          }
          .schema-name {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      &__loading {
        display: flex;
        align-items: center;
        width: 100%;
        .px2rem(height, 110);
        .px2rem(margin-left, 28);
        border-bottom: 1px solid #ebedf2;
        &.last {
          width: 80%;
          border-bottom: none;
        }
        .left {
          .px2rem(width, 70);
          .px2rem(height, 70);
          .px2rem(border-radius, 6);
        }
        .right {
          flex: 1;
          .px2rem(height, 70);
          .px2rem(margin-left, 20);
          .px2rem(margin-right, 56);
          .px2rem(border-radius, 6);
        }
      }
    }
  }
  .schemas-page__bottom {
    .px2rem(padding-bottom, 98)!important;
  }
  @keyframes skeleton-loading {
    0% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0 50%;
    }
  }
</style>
