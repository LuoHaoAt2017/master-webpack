<template>
  <div class="login-scroller">
    <div class="login-container">
      <h2 class="title">
        开发版登录
      </h2>
      <div class="login-form">
        <!-- 测试环境 -->
        <div class="form-item">
          <div class="form-item__label">
            测试环境
          </div>
          <div class="form-item__content">
            <select v-model="selectedTestEnv" placeholder="选择测试环境" @change="setTestEnv">
              <option v-for="env in testEnvs" :key="env" :value="env">
                {{ env }}
              </option>
            </select>
          </div>
        </div>
        <!--用户手机号-->
        <div class="form-item">
          <div class="form-item__label">
            引擎
          </div>
          <div class="form-item__content">
            <select v-model="engine" placeholder="选择引擎" @change="setEngine">
              <option v-for="item in engines" :key="item.Name" :value="item.Name">
                {{ item.Name }}
              </option>
            </select>
          </div>
        </div>
        <!-- 引擎 -->
        <div class="form-item">
          <div class="form-item__label">
            EngineCode
          </div>
          <div class="form-item__content">
            <input v-model="engineCode" type="text" placeholder="enginCode" />
          </div>
        </div>
        <!--用户手机号-->
        <div class="form-item">
          <div class="form-item__label">
            选择用户
          </div>
          <div class="form-item__content">
            <select v-model="userName" placeholder="选择用户" @change="setUserInfo">
              <option v-for="user in users" :key="user.Name" :value="user.Name">
                {{ user.Name }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            Mobile
          </div>
          <div class="form-item__content">
            <input v-model="mobile" type="text" placeholder="mobile" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            dingId
          </div>
          <div class="form-item__content">
            <input v-model="dingId" type="text" placeholder="dingId" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            记住登录信息
          </div>
          <div class="form-item__content">
            <input v-model="setAsCommon" type="checkbox" title="设置后将登录信息保存至本地，下次登录自动填充" />
          </div>
        </div>
        <h3>高级设置</h3>
        <div class="form-item">
          <div class="form-item__label">
            AppCode
          </div>
          <div class="form-item__content">
            <input v-model="appCode" type="text" placeholder="appCode" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            SolutionCode
          </div>
          <div class="form-item__content">
            <input v-model="solutionCode" type="text" placeholder="solutionCode" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            schemaCode（入口表单编码）
          </div>
          <div class="form-item__content">
            <input v-model="schemaCode" type="text" placeholder="入口表单编码" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            isList（钉钉工作台列表）
          </div>
          <div class="form-item__content">
            <input v-model="isList" type="checkbox" placeholder="钉钉工作台列表" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            isExternalForm (表单外链)
          </div>
          <div class="form-item__content">
            <input v-model="isExternalForm" type="checkbox" placeholder="表单外链" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            isExternalShare (表单分享)
          </div>
          <div class="form-item__content">
            <input v-model="isExternalShare" type="checkbox" title="表单分享" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item__label">
            isLightApp (轻应用)
          </div>
          <div class="form-item__content">
            <input v-model="isLightApp" type="checkbox" title="轻应用" />
          </div>
        </div>
      </div>
      <div class="bottom-btn">
        <button @click="login">
          登录
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import storeStartup from '@/config/app-start/store-startup';
import appStart from '@/config/app-start';
import { mergeLoginResponse } from '@/config/app-start/global-config';
import loginData from '@/config/login-data';
import { login } from '@/service/common.service';

  @Component({
    name: 'login',
  })
export default class Login extends Vue {
    setAsCommon: boolean = false;

    engine: string = '';

    engines: Dev.Engine[] = [];

    engineMap: {[name: string]: Dev.Engine} = {};

    userName: string = '';

    users: Dev.User[] = [];

    userMap: {[name: string]: Dev.User} = {};

    engineCode: string = '';

    mobile: string = '';

    dingId: string = '';

    dingtalkAccount: string = '';

    token: string = '1';

    localKey: string = window.btoa('mobileDevLogin');

    localTestEnv: string = 'H3_DEV_GROUP_MOBILE';

    selectedTestEnv: string = '本地';

    appCode: string = '';

    solutionCode: string = '';

    schemaCode: string = '';

    isList: boolean = false;

    isExternalForm: boolean = false;

    isExternalShare: boolean = false;

    isLightApp: boolean = false;

    testEnvs: string[] = [
      '本地',
      'master',
      'kappa',
      'odesy',
      'delta',
      'swork',
      'swat',
      'wind',
      'report',
      'reporting',
      'infrastructure',
    ];

    created () {
      const localSaveStr = window.localStorage.getItem(this.localKey);
      this.selectedTestEnv = window.localStorage.getItem(this.localTestEnv) || '本地';
      if (localSaveStr) {
        // eslint-disable-next-line
        const loginData = JSON.parse(localSaveStr);
        this.engineCode = loginData.engineCode;
        this.mobile = loginData.mobile;
        this.dingId = loginData.dingId;
        this.appCode = loginData.appCode;
        this.solutionCode = loginData.solutionCode;
      }
      const { Users, Engines } = loginData;
      this.users = Users;
      this.engines = Engines;
      this.userMap = this.convertToMap<Dev.User>(Users);
      this.engineMap = this.convertToMap<Dev.Engine>(Engines);
    }

    convertToMap<T extends { Name: string }> (list: T[]) {
      const map: { [name:string]: T } = {};
      list.forEach((item) => {
        map[item.Name] = item;
      });
      return map;
    }

    setEngine () {
      const engine = this.engineMap[this.engine];
      if (engine) {
        this.engineCode = engine.Code;
      }
    }

    setUserInfo () {
      const user = this.userMap[this.userName];
      if (user) {
        this.mobile = user.Mobile || '';
        this.dingId = user.DingId || '';
      }
    }

    setTestEnv () {
      const env = this.selectedTestEnv === '本地' ? '' : this.selectedTestEnv;
      window.localStorage.setItem(this.localTestEnv, env);
      window.location.reload();
    }

    /** 登录 */
    async login () {
      if (!this.engineCode) {
        alert('请输入engineCode');
        return;
      }
      if (!this.mobile && !this.dingId) {
        alert('请输入mobile或dingId');
        return;
      }
      if ((this.isExternalForm || this.isExternalShare || this.isList) &&
        !this.schemaCode) {
        alert('当模拟表单外链、表单分享、表单列表时，schemaCode不能为空');
        return;
      }
      if (this.isLightApp && !this.appCode) {
        alert('当模拟轻应用的时候、appCode不能为空');
        return;
      }
      // http://infrastructure.h3yun.com/login?DingId=
      // $:LWCP_v1:$t6o2FoLzTxkuZTib7xoGPA==&EngineCode=ayw4uutpzi71vj6zn5ebpyr80&ClusterTokenId=1
      // 优先使用dingId登录
      try {
        const data = await login({
          mobile: this.mobile,
          engineCode: this.engineCode,
          token: this.token,
          dingId: this.dingId,
          dingtalkAccount: this.dingtalkAccount,
          appCode: this.appCode,
          solutionCode: this.solutionCode,
        });
        
        // const data = await login({
        //   mobile: '',
        //   engineCode: 'ayw4uutpzi71vj6zn5ebpyr80',
        //   token: 1,
        //   dingId: '$:LWCP_v1:$t6o2FoLzTxkuZTib7xoGPA==',
        //   dingtalkAccount: this.dingtalkAccount,
        //   appCode: this.appCode,
        //   solutionCode: this.solutionCode,
        // });
        this.loginResolver(data);
      } catch (err) {
        alert('登录失败');
      }
    }

    async loginResolver (data: H3.Common.LoginResponse) {
      if (data.Result) {
        if (this.setAsCommon) {
          window.localStorage.setItem(this.localKey, JSON.stringify({
            engineCode: this.engineCode,
            dingId: this.dingId,
            mobile: this.mobile,
            appCode: this.appCode,
            solutionCode: this.solutionCode,
            isList: this.isList,
            isLightApp: this.isLightApp,
            schemaCode: this.schemaCode,
            isExternalForm: this.isExternalForm,
            isExternalShare: this.isExternalShare,
          }));
        }
        const VueInstance = window.GlobalConfig.VueInstance;
        mergeLoginResponse(window.GlobalConfig, data);
        window.GlobalConfig = Object.assign(window.GlobalConfig, {
          engineCode: this.engineCode,
          isList: this.isList,
          isLightApp: this.isLightApp,
          isExternalForm: this.isExternalForm,
          isExternalShare: this.isExternalShare,
          schemaCode: this.schemaCode,
          menuCode: this.schemaCode,
          VueInstance: null,
        });
        // todo
        // window.GlobalConfig.isShowGuide = true;
        // window.GlobalConfig.solutionCode = 'home';

        window.localStorage.setItem('H3_DEV_GlobalConfig', JSON.stringify(window.GlobalConfig));
        window.GlobalConfig = await appStart();
        const homeAddress = window.GlobalConfig.homeAddress;
        window.GlobalConfig.VueInstance = VueInstance;
        storeStartup(this.$store);
        this.$router.push({ path: homeAddress });
      } else {
        alert(data.Message);
      }
    }
}
</script>
<style lang="less" scoped>
  @baseFontSize: 75;
  .px2rem(@name,@px) {
      @{name}: @px/@baseFontSize * 1rem;
  }
  .login-scroller {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .login-container{
    max-width: 750px;
    margin: 0 auto;
    padding-bottom: 50px;
    .title{
      .px2rem(height,120);
      .px2rem(line-height,120);
      text-align: center;
      .px2rem(font-size,50)
    }
    .login-form{
      display: flex;
      flex-direction: column;
      margin: 20px;
      .form-item{
        display: flex;
        margin-bottom: 15px;
        .form-item__label{
          width: 130px;
        }
        .form-item__content{
          flex:1;
          select,input{
            width: 100%;
            height: 32px;
            line-height: 32px;
            border: 1px solid #aaa;
            padding-left: 5px;
            box-sizing: border-box;
            &[type="checkbox"]{
              width:20px;
            }
          }
          select {
            width: 50%;
          }
        }
      }
    }
    .bottom-btn {
      button{
        width: 100%;
        height: 45px;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #107fff;
        text-align: center;
        border: none;
        color: #fff;
        font-size: 16px;
      }
    }
  }
</style>
