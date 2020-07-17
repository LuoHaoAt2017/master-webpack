<template>
  <div class="home-mywork-list">
    <ul>
      <li v-for="(item, index) in myWorkList" :key="index" @click="link(item)">
        <p class="num dp-font44">{{item.count}}</p>
        <p class="item-name">
          <span class="dp-font24">
            {{item.title}}
            <i class="spot" v-show="item.isRemind"></i>
          </span>
        </p>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, namespace } from 'vuex-class';

// vuex-class module命名空间
const homeModule = namespace('Home');
const myWorkMaps= {
  1: {
    route: 'approval',
    title: '待我审批'
  },
  2: {
    route: 'fillsheet',
    title: '待我经办'
  },
  3: {
    route: 'circulate',
    title: '抄送我的'
  },
  4: {
    route: 'myapplication',
    title: '我发起的'
  },
};

@Component
export default class HomeWorkList extends Vue {
  @homeModule.State('MyWorkflow')
  MyWorkflow: H3.Home.MyWorkflowItem[]; // 代办信息
  
  link(item) {
    this.$router.push(`/${item.route}`);
  }

  get myWorkList() {
    let MyWorkflow: H3.Home.MyWorkflowItem[];
    if (this.MyWorkflow.length === 0) {
      MyWorkflow = [
        { Type: 1, Count: 0 },
        { Type: 2, Count: 0 },
        { Type: 3, Count: 0 },
        { Type: 4, Count: 0 },
      ];
    } else {
      MyWorkflow = this.MyWorkflow;
    }
    return MyWorkflow.map(item => ({
      count: item.Count>999 ? '999+' : item.Count,
      isRemind: item.IsRemind,
      title: myWorkMaps[item.Type].title,
      route: myWorkMaps[item.Type].route,
    }));
  }

}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.home-mywork-list {
  background: #fff;
  .px2rem(padding-top, 46);
  .px2rem(padding-right, 10);
  .px2rem(padding-bottom, 38);
  .px2rem(padding-left, 24);
  border-bottom: 10px solid #f5f7f9;
  ul {
  width: 100%;
  display: flex;
  flex-direction: row;
  li {
    flex: 1;
    text-align: center;
    .num {
      color: #333;
      .px2rem(line-height, 48);
      font-weight: bold;
    }
    .item-name {
      .px2rem(margin-top, 8);
      .px2rem(line-height, 34);
      color: #666;
      span {
        position: relative;
        .spot {
          .px2rem(height, 12);
          .px2rem(width, 12);
          border-radius: 50%;
          background: #fd9a10;
          display: block;
          position: absolute;
          top: 0;
          .px2rem(right, -10);
        }
      }
    }
    .work-item {
      .px2rem(height, 90);
      .px2rem(width, 176);
    }
  }
}
}

</style>
