<template>
  <div class="strategy">
    <div class="title dp-font34">设置摘要，信息展示更全面</div>
    <div class="tips dp-font26">管理员在后台对表单设置摘要后，首页即可显示摘要，审批更安全。</div>
    <div class="card-img">
      <img src="../../../assets/img/card-demo.png" />
    </div>
    <div class="translate-center">
      <div class="line"></div>
      <div class="setting-tip dp-font26">设置方法</div>
      <div class="line"></div>
    </div>
    <div class="setting-img">
      <!-- <p>需前往web端设置摘要</p> -->
      <img src="../../../assets/img/strategy.jpg" />
    </div>
  </div>
</template>

<script>
import { setTitle, setLeft } from '../../../config/dingtalk-interface';

export default {
  name: 'summary-help',
  components: {
  },
  data() {
    return {
    };
  },
  methods: {
  },
  activated() {
    setTitle('设置摘要攻略');
    setLeft(() => {
      this.$router.go(-1);
    });
  },
};
</script>

<style lang="less" >
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.app-wrap{
  background-color: #F8F8F8 !important;
  overflow: auto;
}
.strategy{
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: block!important;
    .px2rem(width,5)!important;
    background-color: rgba(0, 0, 0, 0.5)!important;
  }
  .px2rem(padding,30);
  margin-bottom: 0;
  background-color: #F8F8F8;
  .title{
    font-weight: bolder;
    color: #333333;
    // .px2rem(font-size,34);
    .px2rem(margin-bottom,8);
  }
  .tips{
    color: #999999;
    .px2rem(margin-bottom,10);
  }
  .card-img{
    .px2rem(width,712);
    .px2rem(margin-left, -15);
    .px2rem(margin-bottom,-8);
    img{
      width: 100%;
    }
  }
  .translate-center{
    display: flex;
    align-items: center;
    .px2rem(margin-top,56);
    .px2rem(margin-bottom,24);
    .line{
      display: inline-block;
      flex: 1;
      background: #D8D8D8;
      height: 1px;
      .px2rem(margin-right, 163);
    }
    .line:first-child{
      .px2rem(margin-left, 163);
      .px2rem(margin-right, 0);
    }
    .setting-tip{
      text-align: center;
      .px2rem(height,33);
      .px2rem(padding-left,30);
      .px2rem(padding-right,30);
       color: #999999;
    }
  }
  .setting-img{
    background-color: #FFFFFF;
    // .px2rem(padding-left,50);
    // .px2rem(padding-right,50);
    .px2rem(margin-right,-30);
    .px2rem(margin-left,-30);
    p{
      color: #666666;
      text-align: center;
      .px2rem(padding-top,12);
      .px2rem(margin-bottom,26);
      .px2rem(font-size,26);
    }
    img{
      width: 100%;
    }
  }
}

</style>