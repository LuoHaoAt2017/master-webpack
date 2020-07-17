<template>
    <!-- <transition :duration='300' enter-active-class="animated slideInRight" leave-active-class=" "> -->
      <div id="sheethome">
        <layout :title="`${displayName}的首页`" :leftOptions="{ preventGoBack: true }" @on-click-back="goBack">
        <div class="sheet-summary" @click="goSheet()">
          <div class="data-img" v-if="thumbnailUrl">
              <img :src="thumbnailUrl"  v-cloak/>
          </div>
          <div class="summary-main" @click="goSheet()">
              <div class="title content-title">{{Name}}</div>
              <div class="summary">
                <div class="item-data" v-for="(dicData,index) in MobileDicData" v-if="index<3" :key='index'>
                    <span class="key">{{dicData.key}} :</span>
                    <span class="value">{{dicData.value}}</span>
                </div>
              </div>
          </div>
          <div class="summary-link" @click="goSheet()">
              <a href="javascript:;" class="sheet-arrow">
                <i class="icon h3yun_All right-o"></i>
              </a>
            </div>
        </div>
        <asso  v-if="ready"
          :enable-sns="EnableFormSns"
          :schemacode="schemaCode"
          :bizobject-id="bizObjectId"
          :associations="Associations"
          :association-adds="AssociationsFastAdd"
          :appcode="appCode"
          :display-name="displayName"
          :name="Name"
          :summary="Summary"
        >
        </asso>
        </layout>
    </div>

    <!-- </transition> -->

</template>
<script>
// import asso from '../../components/sheet-home/index';
import asso from '../../components/sheet-home/index.vue';
import { loadHomeData } from '../../service/get-data';
import {
  // hideRightMenu,
} from '../../config/dingtalk-interface';
import { isiOS } from '../../../src/config/common';

export default {
  name: 'sheethome',
  components: {
    asso,
  },
  data() {
    return {
      isForward: false,
      schemaCode: '',
      bizObjectId: '',
      displayName: '',
      EnableFormSns: false,
      appCode: null,
      thumbnailUrl: null,
      // EnableTaskRemind:false,
      TaskCount: 0,
      Name: '',
      Summary: '',
      MobileDicData: [],
      Associations: [],
      AssociationsFastAdd: [],
      ready: false,
      delRetFlag: false, // 删除返回标识
      isDataUpdated: false,
    };
  },
  created() {
    this.schemaCode =
      this.$route.params.schemaCode || window.GlobalConfig.schemaCode;
    this.bizObjectId =
      this.$route.params.bizObjectId || window.GlobalConfig.bizObjectId;
    this.displayName = this.$route.params.displayName;
    this.appCode = this.$route.params.appCode;

    this.getSheetHomeData(this.schemaCode, this.bizObjectId);
    const that = this;
    this.$root.eventHub.$on('data-updated', () => {
      if (this.isDataUpdated) {
        return;
      }
      this.isDataUpdated = true;
      that.getSheetHomeData(that.schemaCode, that.bizObjectId);
    });
    this.$root.eventHub.$on('form-remove', () => {
      // that.$router.goBack();
      that.delRetFlag = true;
    });
  },
  mounted() {},
  activated() {
    if (this.delRetFlag) {
      this.delRetFlag = false;
      this.$router.go(-1);
    }
  },
  methods: {
    goBack() {
      // this.$router.go(-1);
      this.$router.goBack();
    },
    goSheet() {
      this.$router.push({
        name: 'formPage',
        params: { schemaCode: this.schemaCode, bizObjectId: this.bizObjectId },
        query: { schemaCode: this.schemaCode, bizObjectId: this.bizObjectId },
      });
    },
    async getSheetHomeData(schemaCode, bizObjectId) {
      this.AssociationsFastAdd = [];
      let data = await loadHomeData(schemaCode, bizObjectId);
      if (!data.Successful) {
        return;
      }
      data = data.ReturnData.Data;

      this.displayName = data.DisplayName;
      this.Name = data.Name;
      this.Summary = data.Summary;
      if (!this.Name && !this.Summary && !this.delRetFlag) {
        this.$router.go(-1);
        return;
      }
      this.EnableFormSns = data.EnableFormSns;
      // this.EnableTaskRemind = data.EnableTask;
      this.TaskCount = data.TaskCount;
      this.thumbnailUrl = data.ThumbnailUrl;

      this.MobileDicData = [];
      for (const dicData of data.MobileDicData) {
        for (const key in dicData) {
          if (dicData[key]) { this.MobileDicData.push({ key, value: dicData[key] }); }
        }
      }
      this.Associations = data.AssociationBOs;
      this.AssociationsFastAdd = [];
      if (this.Associations && this.Associations.length > 0) {
        for (const assos of this.Associations) {
          if (assos.EnableAdd === true) {
            this.AssociationsFastAdd.push(assos);
          }
        }
      }
      this.ready = true;
      this.$root.eventHub.$emit('updateDataCount', data.AssociationBOs);
    },
  },
  watch: {
    $route(to, from) {
      if (from.name === 'sheethome' && to.name === 'sheethome') {
        this.ready = false;
        this.schemaCode = to.params.schemaCode;
        this.bizObjectId = to.params.bizObjectId;
        this.displayName = to.params.displayName;
        this.getSheetHomeData(to.params.schemaCode, to.params.bizObjectId);
      }
    },
    displayName(val) {
      if (val) {
        // setTitle(`${val}的首页`);
        this.displayName = val;
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.isDataUpdated = false;
    if (to.path === '/list' || to.path === 'workflows') {
      this.$root.eventHub.$off('form-remove');
      this.$store.state.excludeComp = ['sheethome'];
    } else {
      this.$store.state.excludeComp = [];
    }
    next();
  },
};
</script>
<style lang="less" >
// @import '../../assets/css/home.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.sheet-summary {
  position: relative;
  color: #fff;
  background: #108ee9;
  .px2rem(height,213);
  // margin-top: 46px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 200;
  div.data-img {
    flex-shrink: 0;
    .px2rem(padding-left,30);
    .px2rem(padding-top,33);
    .px2rem(width,100);
    // .px2rem(height,100);
    img {
      .px2rem(width,100);
      .px2rem(height,100);
    }
  }
  div.summary-link {
    flex-basis: 46px;
    flex-shrink: 0;
    text-align: center;
  }
  div.summary-main {
    // flex-basis:70%;
    .px2rem(flex-basis,554);
    .px2rem(padding-left,30);
    .px2rem(padding-top,33);
    overflow: hidden;
  }
  div.content-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .px2rem(font-size,32);
    color: #fff;
  }
  div.summary {
    .px2rem(margin-top,8);
    div.item-data {
      .px2rem(font-size,26);
      .px2rem(line-height,37);
      color: #cde5fe;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  div.summary-link {
    .px2rem(padding-top,33);
  }
  .sheet-arrow {
    color: #fff;
  }
}
div.row {
  display: flex;
  flex-flow: wrap;
  //justify-content: space-around;
  align-items: flex-start;
  .px2rem(padding-left,23);
  .px2rem(padding-right,23);
  .px2rem(padding-top,40);
  .px2rem(padding-bottom,40);
  div.app {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    align-items: center;
    // .px2rem(margin-left,32);
    // .px2rem(margin-right,32);
    .px2rem(margin-top,20);
    .px2rem(margin-bottom,20);
    &.active {
      opacity: 0.5;
    }
    div.app-icon {
      .px2rem(width,90);
      .px2rem(height,90);
      // .px2rem(line-height,90);
      .px2rem(border-radius,18);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      span {
        font-size: 26px;
      }
    }
    div.app-name {
      text-align: center;
      font-size: 11px;
      color: #666;
      .px2rem(margin-top, 7);
      display: -webkit-box;
      /* autoprefixer: ignore next*/
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      // max-width: 90%;
    }
  }
}
#sheethome {
  height: 100%;
/*  .app-main {
    display: contents;
  }*/
}
</style>
