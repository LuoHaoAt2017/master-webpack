<template>
<div>
  <div class="h3-test2">氚云移动端组件库scrum 第二期demo</div>
    <h3-accordion default-index="0">
      <h3-accordion-item title="数据列表" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('dataListSecond')" >
            不带头像-复选按钮-不可以左滑
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('dataListFrist')" >
            带头像-复选按钮-可以左滑
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('dataListSingleCheck')" >
            带头像单选
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="表单数据详情" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('formInfoIndex')" >
            首页
          </h3-list-item>
          <!-- <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('dataListFrist')" >
            带头像-复选按钮-可以左滑
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('dataListSingleCheck')" >
            带头像单选
          </h3-list-item> -->
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="时间轴" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('sheetHomeTest')" >
            时间轴验证页面
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('personalTest')" >
            个人中心
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('testTimelineStatic')" >
            时间轴组件(静态)
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('testTimelineSticky')" >
            时间轴组件(具有吸顶效果)
          </h3-list-item>
        </h3-list>
      </h3-accordion-item>
      <h3-accordion-item title="签名" icon-class="icon-base-down">
        <h3-list :hasHeader="false">
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('signatureTest')" >
            签名列表
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('remarkSignature')" >
            审批签名(无签名列表)
          </h3-list-item>
          <h3-list-item :hasThumb="false" arrow="horizontal" @click.native="jump('remarkSignatureList')" >
            审批签名(有签名列表)
          </h3-list-item>
        </h3-list>
        
      </h3-accordion-item>
    </h3-accordion>
</div>
</template>

<script>
import cx from 'classnames';
import h3List from '../../components/h3-list/h3-list';
import h3ListItem from '../../components/h3-list/h3-list-item';
import H3Accordion from '../../components/h3-accordion/h3-accordion';
import H3AccordionItem from '../../components/h3-accordion/h3-accordion-item';

export default {
  name: 'data-list-demo',
  components: {
    H3Accordion,
    H3AccordionItem,
    h3List,
    h3ListItem,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    jump(type) {
      this.$router.push({
        name: type,
      });
    },
  },
  computed: {
  },
};
</script> 
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.data-list-introduce-ccontent{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .px2rem(padding,30);
  div{
    flex: 1;
    .px2rem(width,230);
    .px2rem(height,230);
  }
}

</style>