<template>
  <div style=" background-color: #F8F8F8;">
    <h3-scroll ref="scroll" :scroll="onScrollDocument" :enable-down="false" :load-more="loadMore" :is-lock="isLock" wrap-id="wrapId">
      <div class="staticHeader" v-if="!isIos">
        <h3-tab ref="staticFlowTab" class="staticFlowTab" :style="tabFlowOparityStyle"
        :apps="apps"  :selected-index="staticTabIndex" :onChange="onChangeTab" ></h3-tab>
        <div class="comments-header"  ref="staticCommentHeader" :style="commentHeadOparityStyle">
          <span>评论({{commentsLists.length > 10 ? 10 :commentsLists.length}})</span>
          <span @click="onClickRemark">写评论</span>
        </div>
      </div>
      <h3-card-form @click.native="clickCardForm(item)" ref="companyInfo" v-for="(item, index) in itemLists" :key="item.title">
        <template slot="aside" v-if="item.profileUrl">
          <img v-if="item.profileUrl" :src="item.profileUrl" />
          <div v-else class="handler-name">{{item.Name.substr(-2,2)}}</div>
        </template>
        <div> 
          <div style="display: flex"> 
            <div :class="mainTitleCls(item)">
              {{item.title}}
            </div>
          </div>
          <div class="main-summary has-aside" 
              v-for="(summary,index) in item.summary" :key="index" 
              v-if="item.summary && index < 5">
            {{summary}}
          </div>
        </div>
        <template slot="extra">
          <div class=" aufont arrow icon-base-right" ></div>
        </template>
      </h3-card-form>
      <h3-tab ref="flowTab" :apps="apps" :class="tabFlowCls" :selected-index="staticTabIndex" :onChange="onChangeTab"></h3-tab>
      <template v-if="staticTabIndex === 0">
        <div class="h3-add-new-form" ref="addNewForm">
          <div class="h3-add-new-form-title">新增表单</div>
          <div class="formRow">
            <div class="formApp"
                  v-for="(node,index) in commonNodes"  
                  :key="index" v-if="index < 8">
              <div class="formIcon" :style="{color:node.Background}">
                <span :class="node.IconCss"></span>
              </div>
              <div class="formName">{{node.DisplayName}}</div>
            </div>
          </div>
        </div>
        <div class="comments-header" :class="commentHeadCls" ref="commentsHeader">
          <span>评论({{commentsLists.length > 10 ? 10 :commentsLists.length}})</span>
          <span @click="onClickRemark">写评论</span>
        </div>
        <h3-card-comment :comments-lists="commentsLists" id="wrapId">
          <div class="read-more" v-if="commentsLists.length > 10" @click="loadMoreComment">查看更多</div>
        </h3-card-comment>
      </template>
      <div v-else-if="staticTabIndex === 2" style="position: relative" id="wrapId">
        <h3-card-data-form :data-lists="dataLists"></h3-card-data-form>
      </div>
      <template v-else>
        <h3-blank-page id="wrapId" :style="wrapNoContentStyle"  tipText="暂无数据" img="../../assets/img/blankpage.png">
        </h3-blank-page>
      </template>
    </h3-scroll>
    <h3-button-group :button-group="buttonGroup" class="share-button"></h3-button-group>
  </div>
</template>

<script>
import cx from 'classnames';
import H3Scroll from '../../components/h3-scroll/mescroll';
import H3CardForm from '../../widgets/h3-card-data-list/index';
import H3ButtonGroup from '../../widgets/h3-button/h3-button-group2';
import { H3TabFlow, H3TabItem } from '../../components/h3-tab';
import H3Tab from '../../widgets/h3-tab/h3-tab-datalist';
import H3BlankPage from '../../widgets/h3-blank-page/index';
import H3CardComment from './h3-card-comment';
import H3CardDataForm from './h3-card-data-form';

export default {
  components: {
    H3CardForm,
    H3Tab,
    H3TabFlow,
    H3TabItem,
    H3Scroll,
    H3ButtonGroup,
    H3CardComment,
    H3CardDataForm,
    H3BlankPage,
  },
  data() {
    return {
      flowTabTop: 0,
      staticFlowTabHeight: 0,
      commentsHeaderTop: 0,
      showStaticCommentHead: false,
      showStaticFlowTab: false,
      staticTabIndex: 0,
      itemLists: [
        {
          title: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          summary: [
            '地区：深圳',
            '行业：互联网',
            '标签：钉钉4星ISV服务商',
          ],
        },
      ],
      dataLists: [
        {
          title: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          summary: [
            '地区：深圳',
            '行业：互联网',
            '标签：钉钉4星ISV服务商',
          ],
        },
        {
          title: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          summary: [
            '地区：深圳',
            '行业：互联网',
            '标签：钉钉4星ISV服务商',
          ],
        },
        {
          title: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          summary: [
            '地区：深圳',
            '行业：互联网',
            '标签：钉钉4星ISV服务商',
          ],
        },
        {
          title: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          summary: [
            '地区：深圳',
            '行业：互联网',
            '标签：钉钉4星ISV服务商',
          ],
        },
      ],
      apps: [
        {
          DisplayName: '功能',
        },
        {
          DisplayName: '详情',
        },
        {
          DisplayName: '合同1',
        },
        {
          DisplayName: '工作记录2',
        },
        {
          DisplayName: '合同1',
        },
        {
          DisplayName: '工作记录2',
        },
        {
          DisplayName: '合同2',
        },
        {
          DisplayName: '工作记录1',
        },
      ],
      commonNodes: [
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索',
        },
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索',
        },
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索',
        },
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索销售线索',
        },
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索',
        },
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索',
        },
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索销售线索',
        },
        {
          Background: 'rgb(45, 207, 164)',
          IconCss: 'icon-cgfk',
          DisplayName: '销售线索',
        },
      ],
      commentsLists: [
        {
          name: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'), // eslint-disable-line
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              FileName: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
          Files: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              FileName: '1111',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              FileName: '2222',
            },
          ],
        },
        {
          name: '奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络',
          // profileUrl: require('../../../src/assets/img/touxiang.jpeg'),
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络',
          // profileUrl: require('../../../src/assets/img/touxiang.jpeg'),
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络',
          // profileUrl: require('../../../src/assets/img/touxiang.jpeg'),
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络',
          profileUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络',
          // profileUrl: require('../../../src/assets/img/touxiang.jpeg'),
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
        {
          name: '奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络奥哲网络',
          // profileUrl: require('../../../src/assets/img/touxiang.jpeg'),
          time: '2018-04-09 16:18',
          content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容',
          img: [
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
            {
              ThumbnailUrl: require('../../../src/assets/img/touxiang.jpeg'),// eslint-disable-line
              cdnUrl: '',
            },
          ],
        },
      ],
      buttonGroup: [
        {
          title: '分享',
          type: 'share',
          size: 'lg',
          onClick: this.onClickShare,
        },
      ],
      tabFlowOparity: 0,
      commentsHeaderOparity: 0,
      tabFlowCls: '',
      commentHeadCls: '',
    };
  },
  mounted() {
    this.initScroll();
    this.flowTabTop = this.$refs.flowTab.$el.offsetTop;
    this.staticFlowTabHeight = this.$refs.flowTab.$el.offsetHeight;
    this.commentsHeaderTop = this.$refs.commentsHeader.offsetTop || 0;
  },
  activated() {
  },
  methods: {
    loadMoreComment() {
      this.$router.push({
        name: 'formComment',
      });
    },
    loadMore(page, done) {
      done(10, 10);
    },
    onChangeTab(app, index) {
      this.staticTabIndex = index;
    },
    onScrollDocument(mescroll, y) {
      if (this.isIos) { return; }
      const commentsHeaderDistance = this.commentsHeaderTop - this.staticFlowTabHeight;
      if (y < this.flowTabTop) { // 当第一个Tba拦还没有吸顶时
        this.tabFlowOparity = 0;
        this.commentsHeaderOparity = 0;
      } else if (y >= this.flowTabTop && y < commentsHeaderDistance) {
        this.tabFlowOparity = 1;
        this.commentsHeaderOparity = 0;
      } else {
        this.tabFlowOparity = 1;
        this.commentsHeaderOparity = 1;
      }
    },
    onClickShare() {
      this.$router.push({
        name: 'dataShare',
      });
    },
    onClickRemark() {
      this.$router.push({
        name: 'remarkTest',
      });
    },
    onChangeApps() {},
    clickCardForm(item) {
    },
    mainTitleCls(item) {
      return cx('main-title', {
        'has-aside': item.status === undefined || item.status === '',
        'has-aside-status': item.status && item.status !== '',
        'without-summary': item.summary === undefined || item.summary.length < 1,
      });
    },
    initScroll() {
      if (this.isIos) {
        // 如果是IOS 那就加样式
        this.tabFlowCls = 'stay-top';
        this.commentHeadCls = 'stay-top-second';
      } else {
        // 如果不是那就监听滚动事件 动态赋值
      }
    },
  },
  computed: {
    isIos() {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
    tabFlowOparityStyle() {
      return {
        opacity: this.tabFlowOparity,
        filter: `alpha(opacity=${this.tabFlowOparity})`,
        MozOpacity: this.tabFlowOparity,
        KhtmlOpacity: this.tabFlowOparity,
      };
    },
    commentHeadOparityStyle() {
      return {
        opacity: this.commentsHeaderOparity,
        filter: `alpha(opacity=${this.commentsHeaderOparity})`,
        MozOpacity: this.commentsHeaderOparity,
        KhtmlOpacity: this.commentsHeaderOparity,
      };
    },
    wrapNoContentStyle() {
      return {
        top: `${(this.flowTabTop + this.staticFlowTabHeight)}px`,
      };
    },
    enableUp() {
      // Todo 根据有无数据 设置是否能够上拉
      // Todo 功能和详情不允许上拉加载更多
      return this.staticTabIndex === 0;
    },
    isLock() {
      return this.staticTabIndex === 0 || this.staticTabIndex !== 2;
    },
  },
};
</script> 
<style lang="less" scoped>
@import '../../styles/mixins';
@import './style/data-detail.less';

</style>