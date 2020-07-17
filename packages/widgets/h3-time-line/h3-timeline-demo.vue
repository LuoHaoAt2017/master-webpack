 
<template>
  <div class="h3-timeline-demo">
    <h3>只展示单张时间轴卡片</h3>
    <h6>内容较少,展示最小高度</h6>
    <h3-timeline-node-child>
      <p>内容较少,展示最小高度</p>
    </h3-timeline-node-child>
    <h6>内容正常</h6>
    <h3-timeline-node-child>
      <p>内容正常</p>
      <p>内容正常</p>
      <p>内容正常</p>
      <p>内容正常</p>
      <p>内容正常</p>
      <p>内容正常</p>
    </h3-timeline-node-child>
    <h3>展示带有时间标题的时间轴卡片</h3>
    <h3-timeline-node>
      <p slot="timeHeader" style="background:#f8f8f8;font-size:20px;">时间标题</p>
      <h3-timeline-node-child>
        <p>第一个时间标题内第一个时间节点</p>
      </h3-timeline-node-child>
      <h3-timeline-node-child>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
      </h3-timeline-node-child>
    </h3-timeline-node>
    <h3>展示带有时间标题的时间轴卡片,时间节点间有分割线(最后一个时间节点无)</h3>
    <h3-timeline-node class="timeline-demo-node-with-line">
      <p slot="timeHeader" style="background:#f8f8f8;font-size:20px;">时间标题</p>
      <h3-timeline-node-child>
        <p>第一个时间标题内第一个时间节点</p>
      </h3-timeline-node-child>
      <h3-timeline-node-child>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
        <p>第一个时间标题内第二个时间节点</p>
      </h3-timeline-node-child>
    </h3-timeline-node>
    <h3>循环展示多条时间标题的多个卡片(时间节点间带分割线)</h3>
    <h3-timeline-node v-for="(group, index) in groupDates" :key="index" class="timeline-demo-node-with-line">
      <p slot="timeHeader" style="background:#f8f8f8;font-size:20px;">{{group.key}}</p>
      <h3-timeline-node-child v-for="(item, index) in group.value" :key="index">
        <p>{{item.Title}}</p>
        <p v-for="(summary, index) in item.Summary" :key="index">{{summary}}</p>
      </h3-timeline-node-child>
    </h3-timeline-node>
  </div>
</template>
<script>
import H3TimelineNode from './h3-timeline-node';
import H3TimelineNodeChild from './h3-timeline-node-child';

export default {
  name: 'h3-timeline-demo',
  components: {
    H3TimelineNode,
    H3TimelineNodeChild,
  },
  data() {
    return {
      groupDates: [
        {
          key: '今天',
          value: [
            {
              ObjectId: '今天1111',
              axis: 'horizen',
              // Status: 'draft',
              Title: '数据标题数据标数据标题数据标数数据标题数据标数据标题数据标',
              Summary: [
                '数据标题数据标控件摘要内容摘要内容摘要内容要内容摘要内容要内容摘要内容要',
                '数据标题数据标控件摘要内容摘要内容摘要内容',
                '数据标题数据标控件摘要内容摘要内容摘要内容',
                '数据标题数据标控件摘要内容摘要内容摘要内容',
              ],
              time: '15:23',
            },
            {
              ObjectId: '今天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222数据标',
              Summary: [
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '昨天',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222数据标题数据标数据标题数据标数据标题数据标数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天333',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标333数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '5月26日',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
        {
          key: '5月25日',
          value: [
            {
              ObjectId: '昨天1111',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
            {
              ObjectId: '昨天22222',
              axis: 'horizen',
              Status: 'approving',
              Title: '数据标题数据标2222',
              Summary: [
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
                '数据标题数据标控件',
              ],
              time: '15:23',
            },
          ],
        },
      ],
    };
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.h3-timeline-demo{
  .node-child-puroduct-minheigth{
    .node-child-content{
      p{
        .px2rem(line-height, 50);
      }
    }
  }
}

.timeline-demo-node-with-line{
  .h3-timeline-node-child-wrapper:not(:last-child){
    .hairline('bottom', #e4e4e4);
  }
}
</style>


