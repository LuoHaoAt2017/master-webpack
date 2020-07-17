<template>
  <div class="template-card">
    <div class="card__header">
      <div class="template__icon">
        <img
          class="template__icon-img"
          :src="data.Logo"
        >
      </div>
      <div class="template__info">
        <div class="template__info-top">
          <span class="template__name">
            {{ data.Name }}
          </span>
          <span
            class="template__price"
            v-if="!data.IsFree"
          >
            ¥{{ data.Price }}
          </span>
          <span
            class="template__price template__price--free"
            v-else
          >
            免费
          </span>
        </div>
        <div class="template__info-center">
          {{ data.Summary }}
        </div>
        <div class="template__info-bottom">
          <span class="template__rate">
            {{ data.Rate.toFixed(1) }}
            <rank
              :rank="data.Rate"
              style="margin-left: 0.2rem;"
            ></rank>
          </span>
          <span class="template__installed">
            {{ data.InstalledCount }}次安装
          </span>
        </div>
      </div>
    </div>
    <div class="card__content">
      <p class="template__desc">
        {{ data.GuideDescription ? data.GuideDescription : data.Recommendation }}
      </p>
    </div>
    <div class="card__footer">
      <h3-button
        class="card__footer-btn"
        type="primary"
        :disabled="isInstalling || disabled"
        @click="installTemplate"
        :loading="isInstalling"
        size="large"
        inline
        style="font-size: 17px;background: #1890FF;"
      >
        <span class="tips">{{ installTips }}</span>
      </h3-button>
    </div>
  </div>
</template>
<script>
import { H3Button } from 'h3-mobile-vue';
import { install } from '../../service/get-data';
import rank from './rank.vue';

export default {
  name: 'template-card',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    scene: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isInstalling: false,
      isIntallFailed: false,
      installTips: this.data.IsFree ? '安装' : '安装试用',
    };
  },
  components: {
    H3Button,
    rank,
  },
  methods: {
    async installTemplate() {
      this.isInstalling = true;
      this.installTips = '安装中';
      this.$emit('install-start');
      const appCode = this.data.Code;
      const isTrial = !this.data.IsFree;
      try {
        const data = await install(appCode, isTrial, this.scene[0]);
        if (data.Successful) {
          // 安装成功
          this.isInstalling = false;
          this.installTips = '已安装';
          this.$emit('install-success', this.data.Name);
        } else {
          this.isInstalling = false;
          this.isIntallFailed = true;
          this.installTips = '重新安装';
          window.toast.show({
            text: '安装失败',
            mask: false,
          });
          this.$emit('install-failed');
        }
      } catch (error) {
        this.isInstalling = false;
        this.isIntallFailed = true;
        this.installTips = '重新安装';
        window.toast.show({
          text: '安装失败',
          mask: false,
        });
        this.$emit('install-failed');
      }
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.template-card {
  margin: 0.13333333rem 0.4rem;
  background: #fff;
  .px2rem(border-radius, 20);
  box-shadow: 0 12px 56px -8px rgba(90, 121, 143, 0.2);
  border: 1px solid #eeeeee;
  .card__header {
    display: flex;
    .px2rem(padding-top, 44);
    .px2rem(padding-bottom, 62);
    .px2rem(padding-left, 23);
    .px2rem(padding-right, 23);
    .px2rem(margin-left, 9);
    .px2rem(margin-right, 9);
    border: 0 !important;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      from(#e4e4e4),
      color-stop(50%, #e4e4e4),
      color-stop(50%, transparent)
    );
    background-image: linear-gradient(
      0deg,
      #e4e4e4,
      #e4e4e4 50%,
      transparent 50%
    );
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .template__icon {
    .px2rem(width, 160);
    .px2rem(height, 160);
    .px2rem(margin-right, 32);
    &-img {
      width: 100%;
      height: 100%;
      border-radius: 25%;
    }
  }
  .template__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    &-top {
      display: flex;
      justify-content: space-between;
    }
    &-center {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: #999;
      font-size: 12px;
    }
    &-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .template__name {
    color: #000;
    font-size: 17px;
    font-weight: bold;
  }
  .template__price {
    color: #f5222d;
    font-size: 16px;
    &--free {
      color: @baseThemeColor;
    }
  }
  .template__rate {
    display: flex;
    align-items: center;
    color: #333;
    font-size: 13px;
  }
  .template__installed {
    color: #999;
    font-size: 12px;
  }
  .template__desc {
    .px2rem(padding-top, 0);
    .px2rem(padding-left, 32);
    .px2rem(padding-right, 32);
    .px2rem(min-height, 388);
    .px2rem(max-height, 388);
    overflow-y: auto;
    overflow-x: hidden;
    word-break: break-all;
    white-space: pre-line;
    font-size: 14px;
    color: #333;
    line-height: 1.7;
  }
  .card__footer {
    .px2rem(padding-top, 35);
    .px2rem(padding-bottom, 43);
    text-align: center;
    &-btn {
      .px2rem(width, 428);
      .tips {
        position: relative;
        bottom: 1px;
      }
    }
  }
  .h3-loading-spinner {
    width: 12px;
    height: 12px;
  }
}
</style>
