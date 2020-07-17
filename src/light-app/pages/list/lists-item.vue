<template>
  <div
    v-if="row"
    :class="{cancel: row.Status === 3 && isWorkflow}"
    class="row-item"
    @click="openListItem(row)"
  >
    <div class="item-top">
      <span
        :class="{draft: row.Status === 0}"
      >
      </span>
      <!-- v-html 用于高亮搜索词，防xss已在数据源处理 -->
      <template v-if="isSearch">
        <span
          v-if="row.Name"
          class="name"
          v-html="row.Name"
        ></span>
        <span
          v-else
          class="name"
        >- -</span>
      </template>
      <template v-else>
        <span
          v-if="row.Name"
          class="name"
          v-text="row.Name"
        ></span>
        <span
          v-else
          class="name"
        >- -</span>
      </template>
      <!-- 流程状态暂隐藏 -->
      <span
        v-if="row.Status > 0 && isWorkflow"
        class="status"
        :class="`${handleStatus(row.Status).tag}`"
      >{{ handleStatus(row.Status).name }}</span>
    </div>
    <!-- 当前处理人和当前节点显示 -->
    <div class="participant-activityName">
      <p v-if="row.Participant && row.Participant.length > 0">
        <span class="title">当前处理人</span>
        <span>{{ getParticipant }}</span>
      </p>
      <p v-if="row.ActivityName && row.ActivityName.length > 0">
        <span class="title">当前节点</span>
        <span>{{ getActivityName }}</span>
      </p>
    </div>
    <!-- 内容摘要 -->
    <div
      v-if="row.Summary"
      class="summary-wrapper"
    >
      <div
        v-for="(item, index) in handleSummary(row.Summary)"
        :key="index"
        class="summary-item"
      >
        <span class="summary-title summary-span">{{ item.title }}</span>
        <span class="summary-text summary-span">{{ item.text }}</span>
      </div>
    </div>
    <div
      v-else
      class="summary-wrapper"
    >
      <div class="summary-item">
        <span class="summary-title summary-span">- -</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
} from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { workflowData } from '@/light-app/config/list-const';
const lightListModule = namespace('LightList');
@Component({
  name: 'lists-item',
})
export default class ListsItem extends Vue {
  @lightListModule.State('isWorkflow')
  isWorkflow: boolean; // 是否开启流程

  @Prop()
  row: any;

  @Prop()
  sheetCode!: string;

  @Prop()
  isSearch!: boolean;

  /**
   * 当前处理人
   */
  get getParticipant () {
    const participants = this.row.Participant;
    const participantName:string[] = [];
    let participantStr:string = '';
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      participantName.push(participant.Name);
    }
    const len:number = participantName.length;
    if (len > 3) {
      participantStr = `${participantName.slice(0, 3).join('、')}等len人`;
    } else {
      participantStr = participantName.join('、');
    }
    return participantStr;
  }

  /**
   * 当前节点
   */
  get getActivityName () {
    const activityNames:string[] = this.row.ActivityName;
    let activityNameStr:string = '';
    const len:number = activityNames.length;
    if (len > 3) {
      activityNameStr = `${activityNames.slice(0, 3).join('、')}等`;
    } else {
      activityNameStr = activityNames.join('、');
    }
    return activityNameStr;
  }

  /**
   * 摘要数据处理
   */
  handleSummary (summary: string): object[] {
    const temp: string[] = summary.split('\r\n');
    temp.pop();
    const summaryArr: object[] = temp.map(item => {
      const map: string[] = item.split(':');
      return {
        title: map[0].trim(),
        text: map[1].trim() || '- -',
      };
    });
    return summaryArr;
  }

  /**
   * 表单数据状态处理
   */
  handleStatus (status) {
    return workflowData[status];
  }

  /**
   *
   * 查看数据项
   */
  openListItem ({ ObjectId, Name }) {
    this.$router.push({
      name: 'formPage',
      params: {
        schemaCode: this.sheetCode,
        bizObjectId: ObjectId,
        // linkSource: !Name ? 'list' : '',
      },
      query: {
        schemaCode: this.sheetCode,
        bizObjectId: ObjectId,
      },
    });
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/light-app.less';
.row-item {
  .px2rem(min-height, 149);
  .px2rem(border-radius, 24);
  .px2rem(padding-left, 28);
  .px2rem(padding-right, 24);
  .px2rem(padding-top, 24);
  .px2rem(padding-bottom, 25);
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0.18667rem 0 rgba(42, 104, 209, 0.1);
  margin: 0 auto;
  position: relative;
  // 流程已取消
  &.cancel {
    .item-top {
      .name {
        color: #CCCCCC;
      }
    }
    .participant-activityName {
      p {
        color: #CCCCCC;
      }
    }
    .summary-wrapper {
      .summary-span {
        color: #CCCCCC;
      }
    }
  }
  &.draft:before {
    content: "";
    width: 0;
    height: 0;
    display: block;
    border-bottom: 8px solid #ffaf06;
    border-left: 8px solid rgba(0,0,0,0);
    border-right: 8px solid rgba(0,0,0,0);
    position: absolute;
    top: -2px;
    z-index: 100;
    left: -5px;
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .px2rem(margin-bottom, 20);
  &:first-child {
    .px2rem(margin-top, 24);
  }
  .item-top {
    display: flex;
    .px2rem(height, 45);
    .px2rem(line-height, 45);
    .draft {
      .px2rem(width, 22);
      .px2rem(height, 22);
      background: #FFCA00;
      border-radius: 50%;
      display: inline-block;
      .px2rem(margin-top, 13);
      .px2rem(margin-right, 16);
    }
    .status {
      // float: right;
      // .px2rem(width, 24);
      // .px2rem(height, 24);
      // border-radius: 50%;
      // .px2rem(margin-top, 6);
      float: right;
      .px2rem(width, 88);
      .px2rem(height, 40);
      .px2rem(border-radius, 20);
      .px2rem(font-size, 22);
      .px2rem(line-height, 40);
      text-align: center;
      &_0 {
        color: #ff870f;
        background: #ffefe6;
      }
      &_1 {
        color: #00D495;
        background: #E6FFF5;
      }
      &_2 {
        color: #107fff;
        background:rgba(16,127,255,0.1);
      }
      &_3 {
        color: #666;
        background: #EBEDF2;
      }
    }
  }
  .name {
    flex: 1;
    .px2rem(font-size, 32);
    display: inline-block;
    .px2rem(line-height, 45);
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .participant-activityName {
    p {
      color: #F58522;
      .px2rem(line-height, 32);
      .px2rem(margin-top, 16);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0;
      span {
        .px2rem(font-size, 24);
      }
      span.title {
        display: inline-block;
        width: 25%;
        .px2rem(padding-right, 8);
        box-sizing: border-box;
      }
    }
  }
}
.summary-wrapper {
  .px2rem(margin-top, 14);
  .summary-item {
    font-size: 0;
    .summary-title {
      width: 25%;
      .px2rem(padding-right, 8);
    }
    .summary-text {
      width: 75%;
    }
    .summary-span {
      .px2rem(font-size, 24);
      .px2rem(line-height, 36);
      color: #666;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }
  }
}
</style>
