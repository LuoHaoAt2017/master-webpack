<template>
  <div>
    <h3-scroll ref="scroll"  :loadMore="loadMore">
      <h3-card-comment :comments-lists="commentsLists"></h3-card-comment>
    </h3-scroll>
    <h3-button-group :button-group="buttonGroup" class="share-button" ></h3-button-group>
  </div>
</template>

<script>
import H3Scroll from '../../components/h3-scroll/mescroll';
import H3ButtonGroup from '../../widgets/h3-button/h3-button-group2';
import H3CardComment from './h3-card-comment';


export default {
  components: {
    H3Scroll,
    H3ButtonGroup,
    H3CardComment,
  },
  data() {
    return {
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
          title: '评论',
          type: 'share',
          size: 'lg',
          onClick: this.onClickShare,
        },
      ],
    };
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    loadMore(page, done) {
      console.log(page);
      done(0, 0);
    },
    onClickShare() {
    },
    onChangeApps() {},
    clickCardForm() {
    },
  },
  computed: {
    isIos() {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
  },
};
</script> 
<style lang="less" scoped>
@import '../../styles/mixins';
@import './style/data-detail.less';

</style>