import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import {
  openLink
} from '@/config/dingtalk-interface';

const PriceAdjustNoticePrefix = 'PriceAdjustNoticed_';

@Component
export default class PriceAdjustMixin extends Vue {
  showPriceAdjustNotice = false;

  @State('UserInfo')
  UserInfo: H3.Common.UserInfo;

  @State('engineCode')
  engineCode: string;

  get isAdministrator () {
    return this.UserInfo.isAdministrator;
  }

  setPriceAdjustNoticeStatus () {
    // 日期 2020-04-01之后不再提示
    const endDay = '2020-03-31 23:59:59';
    const today = new Date();
    if (today > new Date(endDay)) {
      this.showPriceAdjustNotice = false;
      return;
    }
    // 判断是否已经通知过
    const localKey = `${PriceAdjustNoticePrefix}${this.engineCode}`;
    const value = window.localStorage.getItem(localKey);
    if (value) {
      this.showPriceAdjustNotice = false;
    } else {
      this.showPriceAdjustNotice = true;
    }
  }

  viewDetail () {
    this.close();
    openLink('https://www.authine.com/chuanyun/jiage/');
  }

  reload () {}

  close () {
    const localKey = `${PriceAdjustNoticePrefix}${this.engineCode}`;
    window.localStorage.setItem(localKey, 'true');
    this.showPriceAdjustNotice = false;
    this.reload();
  }
}