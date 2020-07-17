<template>
<!-- lbb修改代码规范 -->
	<div class="reportview" @click="hideNav()" style="height: 100%;">
		<!-- <x-header v-if="!$store.state.corpId" :left-options="{preventGoBack:true}" @on-click-back="goBack()" >
			{{displayName}}
			<div slot="right">
				<a @click="filter" v-if="showSearch">筛选</a>
			</div>
		</x-header> -->
    <layout
      :title="displayName"
      :leftOptions="{ preventGoBack: true }"
      :rightOptions="rightOptions"
      @on-click-back="goBack()"
    >
		<div style="height:100%;width:100%;position:absolute;"> <!-- :style="{top:$store.state.corpId?'0':'46px'}" -->
			<div v-if="!showBar && currentWidget" style="width:100%;height:40px;left:0px;right:0px;display:block; background-color:#fff;color:#565656;font-size:14px; line-height:40px; text-align:center">{{currentWidget.DisplayName}}</div>
			<div v-else style="width:100%;height:40px;left:0px;right:0px;display:block; background-color:#fff;position:absolute;" >
				<div style="display:flex;height: 40px;justify-content: space-between;align-items:center;">
					<div style="flex-basis:15%;flex-shrink:0;text-align:center;">
						<a style="font-size: 20px;padding:10px 15px" @click="goPrevView()"  v-show="showNavButton && hasPrevious" class="btn-icon icon-back h3yun_All left-o"></a>
					</div>
					<div  style="flex-basis: 70%;margin-left:0;text-align:center;padding:0 40px;">
						<div style="text-align:center;" v-if="currentWidget">
							<div class="triangle-hoder" @click.stop="toggleNav()">
								<div class="chart-tri-wrap">{{currentWidget.DisplayName}}</div>
								<span class="icon-arrow-down h3yun_All down-o"> </span>
							</div>

							<ul v-show="showNav" class="nav-items" style="overflow:auto;" :style="{maxHeight:scrollHeight+'px'}">
								<li class="item-slice"  @click.stop="selectWidget(option,index)" v-for="(option,index) in reportView.ReportPage.ReportWidgets" :key='index'>{{option.DisplayName}}</li>
							</ul>
						</div>
					</div>
					<div style="flex-basis:15%;flex-shrink:0;text-align:center;" >
						<a style="font-size: 20px;padding:10px 15px" @click="goNextView()"  v-show="showNavButton && hasNext" class="btn-icon icon-nextpage h3yun_All right-o"></a>
					</div>
				</div>
			</div>
			<div class="divider" v-if="showNav"></div>
			<div class="report-wrapper" :class="{topwithheader:$store.state.corpId}">
				<div id="ReportViewContain" style="background: #fff; border-color: #fff; height: 100%; padding: 5px; width: 100%; ">
					<div id="paddingleft" class="paddingleft"></div><div id="paddingright" class="paddingright"></div><div id="paddingtop" class="paddingtop"></div>
				</div>
			</div>
		</div>
        <!-- :menu-code="MenuCode"  -->
        <filterpage v-show="show" v-cloak :page-id="pageId" :is-show="show" :query-items="QueryItems"></filterpage>
    </layout>
  </div>
</template>
<script >
import {
  FilterType,
  TimeTransport,
  NumberTransport,
  isiOS,
  isDingtalk,
  h3AutoHide,
  includeLanscape,
  sliderbuild,
} from '../../config/common';
import { hideRightMenu, closeApp } from '../../config/dingtalk-interface';
import { loadHomeReportWidget, shareReport } from '../../service/get-data';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import filterpage from '../../components/filters/index.vue';
import '../../lib/reports/html2canvas/html2canvas';
import '../../lib/reports/Chart';
import '../../lib/reports/ChartBase-mobile';
import '../../lib/reports/excanvas.min';
import '../../lib/reports/jquery.dataTables.min';
import '../../lib/reports/ReportViewManagerMobile';

export default {
  name: 'report',
  components: {
    filterpage,
  },
  data() {
    return {
      // currentWidgetName:'',
      MenuCode: '',
      AclTypes: [],
      showBar: false,
      showNavButton: false,
      hasNext: false,
      hasPrevious: false,
      showNav: false,
      showSearch: false,
      showExport: false,
      filterValues: null,
      colors: ['#4DA9EB', '#00B25E', '#F19333', '#F06065', '#5C7197', '#9D88BF'],
      Road: [],
      displayMode: 1, // 0代表展示一组ReportWidget 1 代表展示单个图形
      reportId: '',
      widgetId: '',
      reportCode: '',
      displayName: '',
      currentWidget: null,
      currentWidgetIndex: 0,
      reportView: '',
      appCode: '',
      scrollHeight: ((window.screen.width > window.screen.height ?
        window.screen.height : window.screen.width) * 2) / 3,
      pageId: H3PluginDeveloper.IGuid(),
      Colors: ['#4DA9EB', '#00B25E', '#F19333', '#F06065', '#5C7197', '#9D88BF'],
      sliderbuild,
      show: false,
      reportFilterData: [],
      isfilter: false,
      // 过滤
      QueryParams: {}, // 过滤参数
      QueryItems: [],
      rightOptions() {
        return {
          text: this.showSearch? '筛选':'',
          callback:  this.filter
        }
      }
      // rightOptions: {
      //   text: '筛选',
      //   callback:  this.filter
      // }
    };
  },
  created() {
    this.$store.state.excludeComp = [];
    this.reportCode = this.$route.params.reportCode || window.GlobalConfig.reportCode;
    this.reportId = this.$route.params.reportId;
    this.widgetId = this.$route.params.widgetId;
    this.displayName = this.$route.params.displayName;
    // this.showRightMenu();
    // this.currentWidget = this.$route.params.currentWidget;
    if (this.reportCode) {
      this.showBar = true;
    }

    // 接收过滤参数
    this.$root.eventHub.$on(`executeFilter-${this.pageId}`, (e) => {
      this.show = false;
      this.filterValues = e.searchParamsJson;
      for (const filterKey in this.filterValues) {
        if (filterKey.indexOf('_CreatedTime') > -1 || filterKey.indexOf('_ModifiedTime') > -1) {
          let filterTimeArray = this.filterValues[filterKey];
          if (filterTimeArray[0] && filterTimeArray[1] && filterTimeArray[0] === filterTimeArray[1]) {
            this.filterValues[filterKey][1] = `${this.filterValues[filterKey][1]} 23:59:59`;
          }
          filterTimeArray = [];
        }
      }
      this.showReport();
    });
    this.$root.eventHub.$on('cancel-filter', () => {
      this.show = false;
    });
  },
  mounted() {
    this.showRightMenu();
    this.showReport();
  },
  activated() {
    // this.buttonchange();
    // hideRightMenu();
    this.showRightMenu();
  },
  beforeRouteLeave(to, from, next) {
    hideRightMenu();
    // 判断路由切换到哪个页面，判断是否需要缓存
    if (to.name === 'home' || to.name === 'apps') {
      this.$store.state.excludeComp = ['report'];
    } else {
      this.$store.state.excludeComp = [];
    }
    next();
  },
  methods: {
    showReport() {
      if (this.showBar) {
        const reportContainer = $('#ReportViewContain');
        this.reportView = new ReportViewManager('', reportContainer, this.reportCode);
        console.log(this.reportView)
        if (this.reportView.FilterManager) {
          this.reportFilterData = this.reportView.FilterManager.Filters;
          this.QueryItems = this.reportView.FilterManager.Filters;
        }
        // console.log(JSON.stringify(this.reportFilterData))
        if (this.reportView) {
          this.displayName = this.reportView.DisplayName;
          // add by lbb
          if (this.reportView.ReportPage && this.reportView.ReportPage.ReportWidgets) {
            this.reportView.ReportPage.ReportWidgets.forEach((element, index) => {
              if (this.widgetId === element.Code) {
                this.currentWidgetIndex = index;
              }
            }, this);
          }

          if (this.currentWidgetIndex !== 0 &&
            this.reportView.ReportPage && this.reportView.ReportPage.ReportWidgets.length > 0) {
            this.currentWidget = this.reportView.ReportPage.ReportWidgets[this.currentWidgetIndex];
            if (this.reportView.ReportPage.ReportWidgets.length > 1) {
              if (this.currentWidgetIndex === this.reportView.ReportPage.ReportWidgets.length - 1) {
                this.hasNext = false;
              } else {
                this.hasNext = true;
              }
              this.hasPrevious = true;
              this.showNavButton = true;
            } else {
              this.showNavButton = false;
              this.hasNext = false;
            }
          }
          if (!this.currentWidget && this.reportView.ReportPage && this.reportView.ReportPage.ReportWidgets.length > 0) {
            this.currentWidgetIndex = 0;
            this.currentWidget = this.reportView.ReportPage.ReportWidgets[0];
            // this.currentWidgetName = this.currentWidget.DisplayName;
            if (this.reportView.ReportPage.ReportWidgets.length > 1) {
              this.showNavButton = true;
              this.hasNext = true;
            } else {
              this.showNavButton = false;
              this.hasNext = false;
            }
          }

          if (
            this.reportView.ReportPage &&
            this.reportView.ReportPage.Filters &&
            this.reportView.ReportPage.Filters.length > 0 &&
            !this.filterValues
          ) {
            this.showSearch = true;
            this.filterValues = {};
            for (const filter of this.reportView.ReportPage.Filters) {
              const ColumnCode = filter.ColumnCode;
              const FilterValue = filter.FilterValue;
              // const DisplayName = filter.DisplayName;
              const myfiltertype = filter.FilterType;
              const ColumnType = filter.ColumnType;
              const defaultValue = filter.DefaultValue;
              if (myfiltertype === FilterType.Organization) {
                switch (FilterValue) {
                  case '1':
                    this.filterValues[ColumnCode] = [this.$store.state.UserInfo.userId];
                    break;
                  case '2':
                    this.filterValues[ColumnCode] = [this.$store.state.UserInfo.userParent];
                    break;
                  case '3':
                    this.filterValues[ColumnCode] = [];
                    break;
                  default:
                    break;
                }
              } else if (myfiltertype === FilterType.DateTime) {
                const TimeValue = TimeTransport(FilterValue);
                this.filterValues[ColumnCode] = TimeValue;
              } else if (myfiltertype === FilterType.Numeric) {
                this.filterValues[ColumnCode] = NumberTransport(FilterValue);
              } else if (
                myfiltertype === FilterType.FixedValue ||
                ColumnType === 5 ||
                myfiltertype === FilterType.MasterData ||
                myfiltertype === FilterType.Boolean
              ) {
                this.filterValues[ColumnCode] = [defaultValue];
              } else {
                this.filterValues[ColumnCode] = [FilterValue || defaultValue];
              }
            }
          }
          // this.buttonchange();
          this.reportView.GetReport(
            H3PluginDeveloper.IClone(this.filterValues),
            this.currentWidget,
            null,
            true,
            null,
            this,
            null,
            this.colors[0],
          );
        }
      } else {
        this.getReportWidget(this.reportId, this.widgetId);
      }
    },
    async getReportWidget(reportId, widgetId) {
      let data = await loadHomeReportWidget(reportId, widgetId);
      let reportPageCode = '';
      let widget = '';
      if (data.Successful) {
        data = data.ReturnData.Data;
        reportPageCode = data.ReportPageCode;
        this.displayName = data.DisPlayName;
        widget = data.ReportWidget;
      }

      if (widget) {
        this.currentWidget = widget;
        const reportContainer = $('#ReportViewContain');
        this.reportView =
          new ReportViewManager(null, reportContainer, reportPageCode, false);
        const reportPage = this.reportView.ReportPage;
        this.reportFilterData = reportPage.Filters; // 过滤参数获取
        if (reportPage && reportPage.Filters &&
        reportPage.Filters.length > 0 && !this.filterValues) {
          this.showSearch = true;
          this.filterValues = {};
          for (const filter of reportPage.Filters) {
            const ColumnCode = filter.ColumnCode;
            const FilterValue = filter.FilterValue;
            // const DisplayName = filter.DisplayName;
            const myfiltertype = filter.FilterType;
            const defaultValue = filter.DefaultValue;
            const ColumnType = filter.ColumnType;
            if (myfiltertype === FilterType.Organization) {
              switch (FilterValue) {
                case '1':
                  this.filterValues[ColumnCode] = [this.$store.state.UserInfo.userId];
                  break;
                case '2':
                  this.filterValues[ColumnCode] = [this.$store.state.UserInfo.userParent];
                  break;
                case '3':
                  this.filterValues[ColumnCode] = [this.$store.state.UserInfo.companyId];
                  break;
                default:
                  break;
              }
            } else if (myfiltertype === FilterType.DateTime) {
              const TimeValue = TimeTransport(FilterValue);
              this.filterValues[ColumnCode] = TimeValue;
            } else if (myfiltertype === FilterType.Numeric) {
              this.filterValues[ColumnCode] = NumberTransport(FilterValue);
            } else if (
              myfiltertype === FilterType.FixedValue ||
              ColumnType === 5 ||
              myfiltertype === FilterType.MasterData ||
              myfiltertype === FilterType.Boolean
            ) {
              this.filterValues[ColumnCode] = [defaultValue];
            } else {
              this.filterValues[ColumnCode] = [FilterValue];
            }
          }
        }
        this.reportView.GetReport(
          H3PluginDeveloper.IClone(this.filterValues),
          widget,
          null,
          true,
          null,
          this,
          null,
          this.colors[0],
        );
      }
    },

    setReportView() {
      if (this.reportView) {
        this.reportView.GetReport(
          H3PluginDeveloper.IClone(this.filterValues),
          this.currentWidget,
          null,
          true,
          null,
          this,
          null,
          this.colors[this.currentWidgetIndex % 6],
        );
      }
    },
    goPrevView() {
      this.Road = [];
      this.hasNext = true;
      if (this.currentWidgetIndex - 1 < 0) {
        return false;
      }
      this.currentWidget = this.reportView.ReportPage.ReportWidgets[this.currentWidgetIndex - 1];
      if (this.currentWidgetIndex - 1 <= 0) {
        this.hasPrevious = false;
      }
      this.currentWidgetIndex -= 1;
      this.setReportView();
      return null;
    },
    goNextView() {
      this.Road = [];
      this.hasPrevious = true;
      const len = this.reportView.ReportPage.ReportWidgets.length;
      if (this.currentWidgetIndex + 1 === len) {
        return;
      }
      this.currentWidget = this.reportView.ReportPage.ReportWidgets[this.currentWidgetIndex + 1];
      // 同时更新下拉框显示
      if (this.currentWidgetIndex === len - 2) {
        this.hasNext = false;
      }
      this.currentWidgetIndex += 1;
      this.setReportView();
    },
    toggleNav() {
      this.showNav = !this.showNav;
    },
    hideNav() {
      this.showNav = false;
    },
    selectWidget(widget, index) {
      this.Road = [];
      const len = this.reportView.ReportPage.ReportWidgets.length;
      this.currentWidgetIndex = index;
      this.currentWidget = widget;
      this.showNav = false;
      this.hasNext = this.currentWidgetIndex !== len - 1;
      this.hasPrevious = this.currentWidgetIndex !== 0;
      this.setReportView();
      // this.buttonchange();
    },
    filter() {
      // 点击展示过滤组件
      this.show = !this.show;
    },
    hideFilter() {
      // 隐藏过滤组件
      this.show = false;
    },
    showRightMenu() {
      const that = this;
      if (isDingtalk) {
        dd.biz.navigation.setRight({
          show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
          control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
          text: '筛选', // 控制显示文本，空字符串表示显示默认文本
          onSuccess() {
            that.show = that;
          },
          onFail() {},
        });
        // dd.biz.navigation.setMenu({
        //   backgroundColor: '#fff',
        //   items: [
        //     {
        //       id: '1', // 字符串
        //       iconId: '', // 字符串，图标命名
        //       text: '筛选',
        //     },
        //   ],
        //   onSuccess(data) {
        //     if (data.id === '1') {
        //       that.show = that;
        //     }
        //   },
        //   onFail(err) {
        //     console.log(err);
        //   },
        // });
      }
    },
    // 格式化过滤参数
    formatQueryParams() {
      if (!this.QueryParams) {
        this.QueryParams = {};
      }
      if (this.QueryParams.searchParamsJson) {
        const tmp = this.QueryParams.searchParamsJson;
        delete tmp.Name;
        this.QueryParams.searchParamsJson = tmp;
      } else {
        this.QueryParams.searchParamsJson = {};
      }
    },
    async shareReportToDingTalk(reportCode, widgetId, reportId, title, text, cid, img) {
      const data = await shareReport(reportCode, widgetId, reportId, title, text, cid, img);
      if (data.Successful) {
        h3AutoHide({ icon: 'h3yun_All check', text: '分享成功！' });
      } else {
        h3AutoHide({ icon: 'h3yun_All close', text: '分享失败！' });
      }
    },
    shareReport() {
      const that = this;
      if (isDingtalk) {
        dd.biz.chat.pickConversation({
          corpId: that.$store.state.corpId,
          isConfirm: 'false',
          onSuccess(data) {
            dd.device.notification.confirm({
              message: data.title,
              title: '确定分享给：',
              buttonLabels: ['否', '是'],
              onSuccess(result) {
                if (result.buttonIndex === 1) {
                  html2canvas($('#ReportViewContain'), {
                    onrendered(canvas) {
                      const img = new Image();
                      img.src = canvas.toDataURL('image/jpeg');
                      that.shareReportToDingTalk(
                        that.reportCode,
                        that.widgetId,
                        that.reportId,
                        that.displayName,
                        result.value,
                        data.cid,
                        img.src,
                      );
                    },
                  });
                }
              },
              // onFail(err) { console.log(err); },
            });
          },
          // onFail(err) { console.log(err); },
        });
      }
    },
    landscapetrigger() {
      if (this.show) {
        this.show = false;
      }
      if (includeLanscape) {
        this.landscapeout();
      } else {
        this.landscape();
      }
    },
    landscape() {
      if (window.location.href.indexOf('?') > -1) {
        window.location.href = window.location.href.replace('#', '&dd_orientation=landscape&loading=false#');
      } else {
        window.location.href = window.location.href.replace('#', '?dd_orientation=landscape&loading=false#');
      }
    },
    landscapeout() {
      if (isiOS) {
        closeApp();
      } else if (window.location.href.indexOf('&dd_orientation=landscape') > -1) {
        window.location.href = window.location.href.replace('&dd_orientation=landscape', '');
      } else if (window.location.href.indexOf('?dd_orientation=landscape') > -1) {
        window.location.href = window.location.href.replace('dd_orientation=landscape', '');
      }
    },
    buttonchange() {
      // return;
    },
    exportHelp() {
      if (includeLanscape) {
        if (isiOS) {
          Global.CloseApp();
        } else if (window.location.href.indexOf('&dd_orientation=landscape') > -1) {
          window.location.href = window.location.href.replace('&dd_orientation=landscape', '');
        } else if (window.location.href.indexOf('?dd_orientation=landscape') > -1) {
          window.location.href = window.location.href.replace('dd_orientation=landscape', '');
        }
        return;
      }
      this.initLocalStorage();
      hideRightMenu();
      this.$router.push({ name: 'help', params: { type: 3 } });
    },
    initLocalStorage() {
      localStorage.setItem('detailSchemaCode', '');
      localStorage.setItem('detailObjectId', '');
      localStorage.setItem('currentWidgetIndex', '0');
      localStorage.setItem('reportViewHistory', '');
      localStorage.setItem('reportGoBack', '');
      localStorage.setItem('reportGoHelp', '');
    },
    linkBack(widgetObjectid) {
      for (let i = 0; i < this.reportView.ReportPage.ReportWidgets.length; i += 1) {
        const item = this.reportView.ReportPage.ReportWidgets[i];
        if (item.ObjectId === widgetObjectid) {
          this.currentWidgetIndex = i;
          this.currentWidget = item;
          this.currentWidgetName = item.DisplayName;
          break;
        }
      }
      if (this.reportView.ReportPage.ReportWidgets.length > 1) {
        this.showNavButton = true;
        if (this.currentWidgetIndex === this.reportView.ReportPage.ReportWidgets.length - 1) {
          this.hasPrevious = true;
          this.hasNext = false;
        } else if (this.currentWidgetIndex === 0) {
          this.hasNext = true;
          this.hasPrevious = false;
        } else {
          this.hasPrevious = true;
          this.hasNext = true;
        }
      } else {
        this.showNavButton = false;
        this.hasNext = false;
      }
      // this.buttonchange();
      this.reportView.GetReport(
        H3PluginDeveloper.IClone(this.filterValues),
        this.currentWidget,
        null,
        true,
        null,
        this,
        null,
        this.Colors[this.currentWidgetIndex % 6],
      );
    },
    goBack() {
      const widgetObjectid = this.Road.pop();
      if (this.$aut.select.isShow()) {
        this.$aut.select.hide();
        return;
      } else if (this.$store.state.DateTimePluginShow) {
        this.$h3.datetime.hide();
        return;
      } else if (this.show) {
        // 如果过滤组件打开 只关闭过滤组件 不返回
        this.show = false;
        return;
      } else if (window.GlobalConfig.reportCode) {
        closeApp();
      }
      if (widgetObjectid) {
        this.linkBack(widgetObjectid);
      } else {
        // this.$destroy();
        this.$store.state.excludeComp = ['report'];
        this.$router.go(-1);
      }
    },
    goSheetDetail(schemaCode, bizObjectId) {
      if (window.location.href.indexOf('dd_orientation=landscape') > -1) {
        if (isDingtalk) {
          closeApp();
        } else if (window.location.href.indexOf('&dd_orientation=landscape') > -1) {
          window.location.href = window.location.href.replace('&dd_orientation=landscape', '');
        } else if (window.location.href.indexOf('?dd_orientation=landscape') > -1) {
          window.location.href = window.location.href.replace('dd_orientation=landscape', '');
        }
        return;
      }
      this.initLocalStorage();
      this.$router.push({
        name: 'formPage',
        params: { schemaCode, bizObjectId },
      });
    },
  },
  watch: {
    reportFilterData(nVal) {
      if (!nVal) {
        return false;
      }
      this.QueryItems = [];
      let field = null;
      // let searchParamsJson;
      for (let i = 0, len = nVal.length; i < len; i += 1) {
        field = nVal[i];
        field.PropertyName = field.ColumnCode;
        if (
          this.filterValues[field.ColumnCode] !== null &&
          typeof this.filterValues[field.ColumnCode] !== 'undefined' &&
          this.filterValues[field.ColumnCode][0] !== null &&
          typeof this.filterValues[field.ColumnCode][0] !== 'undefined'
        ) {
          field.DefaultValue =
            this.filterValues[field.ColumnCode][0] !== null &&
            typeof this.filterValues[field.ColumnCode][0] !== 'undefined'
              ? this.filterValues[field.ColumnCode][0]
              : null;
        }
        if (FilterType.AssociationField === field.FilterType) {
          field.DataType = 10;
          if (field.ColumnCode) {
            if (field.ColumnCode.indexOf('_') > -1) {
              field.AssociationSchemaCode = field.ColumnCode.split('_')[0];
              field.AssociationSchemaCode = field.AssociationSchemaCode.substring(
                1,
                field.AssociationSchemaCode.length,
              );
              field.AssociationField = field.ColumnCode.split('_')[1];
            }
          }
        } else if (FilterType.Numeric === field.FilterType) {
          field.DataType = 35;
          field.DefaultValue = field.FilterValue ? field.FilterValue : field.DefaultValue;
        } else if (FilterType.String === field.FilterType) {
          field.DataType = 14;
        } else if (
          FilterType.FixedValue === field.FilterType ||
          FilterType.Boolean === field.FilterType ||
          FilterType.MasterData === field.FilterType
        ) {
          field.DataType = 13;
          field.SelectedValues = field.FilterValue;
        } else if (FilterType.DateTime === field.FilterType) {
          field.DataType = 5;
          if (field.FilterValue) {
            field.DefaultValue = TimeTransport(field.FilterValue).join(';');
          }
        } else if (FilterType.Organization === field.FilterType) {
          field.DataType = 26;
        } else if (FilterType.Association === field.FilterType) {
          field.DataType = 51;
        } else if (FilterType.Address === field.FilterType) {
          field.DataType = 56;
        }
        this.QueryItems.push(field);
      }
      return null;
    },
  },
};
</script>
<style lang="less"  >

@import '../../components/reports/style/ChartBase.css';


.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

table {
  width: 100%;
  height: auto;
}

.table > thead > tr > th {
  padding: 0.6rem 0.2rem;
  position: relative;
  vertical-align: middle;
  white-space: nowrap;

  color: #fff;
  background-color: #49a1f3;
}

.table > thead > tr > th {
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: #00b5f1;
  height: 20px;
}

.table > tbody > tr > th,
.table > tbody > tr > td {
  content: '';
  border-width: 0 0 1px 1px !important;
  border-style: solid !important;
  border-color: #ddd !important;
  height: 20px;
}

.odd {
  background-color: white;
}

.even {
  background-color: #f5f7fa;
}

.table {
  border-collapse: collapse;
}

.table {
  background-color: #fff;
}

.table-column-freezen,
.table-row-freezen,
.table-onlyheader-freezen {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  width: auto;
  height: auto;
}

.table thead > tr > th,
.table tbody > tr > th,
.table tfoot > tr > th,
.table thead > tr > td,
.table tbody > tr > td,
.table tfoot > tr > td {
  white-space: nowrap;
  text-align: left;
  vertical-align: middle;
}

.Mytable_SimpleBoard {
  height: 70%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 15%;
  right: 15%;
  bottom: 15%;
  text-align: center;
  /*border-top: 1px solid #e2e2e2;
  border-left: 1px solid #e2e2e2;*/
}

table.Mytable_SimpleBoard {
  height: auto;
}

.report-wrapper {
  width: 100%;
  min-height: 90%;
  height: 90%;
  overflow: hidden;
  position: absolute;
  top: 51px;
  .align-left:before {
    content: '';
    width: 0;
    height: 0;
  }
  .align-right:before {
    content: '';
    width: 0;
    height: 0;
  }
}
.topwithheader {
  height: 51px;
}
.triangle-hoder {
  border: solid 1px #4b9aee;
  border-radius: 16px;
  color: #4b9aee;
  padding: 5px 0;
  span {
    float: right;
    margin-top: -15px;
    margin-right: 15px;
  }
}
.nav-items {
  position: absolute;
  background-color: #fff;
  width: 270px;
  text-align: center;
  top: 100%;
  left: 50%;
  border: 1px solid #ddd;
  margin-left: -135px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 6px;
}

.item-slice {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-family: 'PingFang SC', 'Microsoft YaHei Regular';
  border-bottom: 1px solid #ddd;
}
.table thead > tr > th,
.table tbody > tr > th,
.table tfoot > tr > th,
.table thead > tr > td,
.table tbody > tr > td,
.table tfoot > tr > td {
  padding: 8px;
}

</style>
