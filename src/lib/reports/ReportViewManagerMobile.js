import { DefaultOptions, ReportFilter } from './ReportBase';
import H3PluginDeveloper from '../h3-plugins-developer';
import { baseUrl, imgBaseUrl } from '../../config/env';

// lbb修改代码规范
// 公共函数
const CommonFunction = {
  ActionUrl: '/Reporting/OnAction',
  LoadReportPage: 'LoadReportPage',
  // 加载明细汇总表
  LoadGridData: 'LoadGridData',
  // 加载图表数据
  LoadChartsData: 'LoadChartsData',
  // 加载简易看板
  LoadSimpleBoard: 'LoadSimpleBoard',
  BizObjectId: 'ObjectId',
  // 导出明细表或汇总表
  ExportTable: 'ExportTable',
  // Post
  Post(action, data, callback, isAsync, failCallback, self) {
    // var _measure_start = performance.now();
    // 固定与后台的交互的入口，入口后根据Command的分发事件
    const paramData = $.extend({ ActionName: action }, data);
    $.ajax({
      type: 'POST',
      url: baseUrl + this.ActionUrl,
      async: isAsync === undefined ? true : isAsync,
      data: { PostData: JSON.stringify(paramData) },
      dataType: 'json',
      success(datas) {
        let returnDatas = datas;
        if(!returnDatas.Successful){
          CommonFunction.ShowFailMessage(self.$Container);
        }
        if (returnDatas.Successful) {
          returnDatas = returnDatas.ReturnData;
          if ($.isFunction(callback)) callback.apply(this, [returnDatas]);
        } else if ($.isFunction(failCallback)) {
          failCallback.apply(this, [returnDatas]);
        }
      },
      error(errorData) {
        if ($.isFunction(callback)) {
          callback.apply(this, [errorData]);
        }
      },
    });
  },
  // 读取函数的显示名称
  GetFunctionDisplayName(FunctionType) {
    switch (parseInt(FunctionType, 10)) {
      case DefaultOptions.Function.Count:
        return '统计';
      case DefaultOptions.Function.Sum:
        return '求和';
      case DefaultOptions.Function.Avg:
        return '平均';
      case DefaultOptions.Function.Min:
        return '最小值';
      case DefaultOptions.Function.Max:
        return '最大值';
      default: break;
    }
    return null;
  },
  // 显示错误消息
  ShowFailMessage($container) {
    $container.html('').css('text-align', 'center').append(`<div style='color: #dadada;font-size:14px;margin-top: 5px;'>报表数据有误或已被删除，请重新配置</div>`);
  },
  // 显示没有数据
  ShowNoneItemImg($container) {
    const $img = $(`<img src='${imgBaseUrl}/img/NoneReport.png' />`).css('margin-top', '3%');
    $container.html('').css('text-align', 'center').append($img).append("<div style='color: #dadada;font-size:14px;margin-top: 5px;'>暂无图表数据</div>");
  },
  DetailRowNumber: 'DetailRowNumber',
  StringToArray(str, iscategories, isseries) {
    if (str === null || str === undefined) {
      return null;
    }
    const array = str.split(';'); // 设定分割符为“;”
    if (array === undefined) {
      return null;
    }
    const arraynew = [];
    for (let i = 0; i < array.length; i += 1) {
      const item = array[i];
      let itemnew = JSON.parse(item);
      if (iscategories) {
        itemnew = { key: itemnew, value: itemnew };
      }
      if (isseries) {
        itemnew = { Name: itemnew.Name, Code: itemnew.Name, Data: itemnew.Data };
      }
      arraynew.push(itemnew);
    }
    return arraynew;
  },
  ArrayToString(array) {
    if (array === undefined || array.length === 0) {
      return '';
    }
    // const result = '';
    const newarray = [];
    for (let i = 0; i < array.length; i += 1) {
      const item = array[i];
      newarray.push(JSON.stringify(item));
    }
    return newarray.join(';');
  },
  Colors: ['#4DA9EB', '#00B25E', '#F19333', '#F06065', '#5C7197', '#9D88BF'],
  IsInteger(obj) {
    return Math.floor(obj) === obj;
  },
  ClearArray(array) {
    if (array) {
      let obj;
      for (let i = array.length - 1; i >= 0; i -= 1) {
        obj = array.pop();
        if (obj.free) { obj.free(); }
        obj = null;
      }
    }
  },
  RenderTableTd(aa) {
    if (aa || aa === 0 || aa === '0') {
      if ($.isArray(aa)) {
        const value = aa;
        if (value.length > 0) {
          const temphtml = [];
          temphtml.push("<table  class='childtable' style='width:100%;height:100%;'>");
          for (let i = 0; i < value.length; i += 1) {
              const newvalue = CommonFunction.HtmlDecode(value[i] === null || value[i] === '' ? '-' : value[i]);
            temphtml.push(`<tr style='background-color: transparent;height: auto;line-height: inherit;'>
            <td title='${newvalue}' style='padding: 8px 0px 8px 0px !important;height:20px;'>
            ${newvalue}</td></tr>`);
          }
          temphtml.push('</table>');
          const columnResult = temphtml.join('');
          CommonFunction.ClearArray(temphtml);
          return columnResult;
        } return "<div style='padding:0px 8px 0px 8px'>-</div>";
        }
      else
      {
          aa = CommonFunction.HtmlDecode(aa);
      }
      return aa;
    }
    return '-';
  },
  HtmlDecode: function (val) {
    if (val || val === 0) {
      return $('<div />').text(val).html();
    } else {
      return '';
    }
  },
  GetCombinedTable: function (table, tableAttr) {
    var array = new Array();
    var stringEmpty = "";
    var doubleHH = "--";
    var singleH = "-";
    var unittdbtTh = "unittd bt-Th";
    var unittdhbtth = "unittd hbt-th";
    var unittddatatd = "unittd data-td";
    if (CommonFunction.ObjectIsNotNull(table)) {
      array.push(tableAttr);
      if (CommonFunction.ObjectIsNotNull(table.Thead)) {
        array.push("<thead>");
        var thead = table.Thead;
        var columnTable = table.Thead.ColumnTable;
        if (CommonFunction.ObjectIsNotNull(columnTable)) {
          var lines = columnTable.Lines;
          if (CommonFunction.ObjectIsNotNull(lines)) {

            for (var rowNumber = 0; rowNumber < lines.length; rowNumber++) {
              array.push("<tr>");
              var line = lines[rowNumber];
              var groupByThs = line.GroupByThs;
              if (CommonFunction.ObjectIsNotNull(groupByThs)) {
                for (var i = 0; i < groupByThs.length; i++) {
                  var td = groupByThs[i];
                  var tempclass = stringEmpty;
                  var value = CommonFunction.HtmlDecode(td.V);
                  var colspan = td.ColSpan;
                  var rowspan = td.RowSpan;
                  array.push('<th class="' + tempclass + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >')
                  array.push(value);
                  array.push('</th>');
                }
              }
              var headThs = line.HeadThs;
              if (CommonFunction.ObjectIsNotNull(headThs)) {
                for (var i = 0; i < headThs.length; i++) {
                  var td = headThs[i];
                  var tempclass = unittdbtTh;
                  var value = CommonFunction.HtmlDecode(td.V);
                  var code = CommonFunction.HtmlDecode(td.C);
                  var columnCode = td.ColumnCode;
                  var colspan = td.ColSpan;
                  var rowspan = 1;
                  array.push('<th class="' + tempclass + '" data-code="' + code + '" data-columncode="' + columnCode + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >')
                  array.push(value);
                  array.push('</th>');
                }
              }

              if (rowNumber == 0) {
                var collection = columnTable.Collection;
                if (CommonFunction.ObjectIsNotNull(collection)) {
                  var td = collection;
                  var tempclass = stringEmpty;
                  var value = CommonFunction.HtmlDecode(td.V);
                  var colspan = td.ColSpan;
                  var rowspan = td.RowSpan;
                  array.push('<th class="' + tempclass + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >')
                  array.push(value);
                  array.push('</th>');
                }
              }
              array.push("</tr>");
            }
          }
        }
        var centerTable = table.Thead.CenterTable
        if (CommonFunction.ObjectIsNotNull(centerTable)) {
          var firstLine = centerTable.FirstLine;

          array.push("<tr>");
          var groupByThs = firstLine.GroupByThs;
          if (CommonFunction.ObjectIsNotNull(groupByThs)) {
            for (var i = 0; i < groupByThs.length; i++) {
              var td = groupByThs[i];
              var tempclass = stringEmpty;
              var value = CommonFunction.HtmlDecode(td.V);
              var colspan = td.ColSpan;
              var rowspan = td.RowSpan;
              array.push('<th class="' + tempclass + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >')
              array.push(value);
              array.push('</th>');
            }
          }
          var computeDisplayNames = firstLine.ComputeDisplayNames;
          if (CommonFunction.ObjectIsNotNull(computeDisplayNames)) {
            for (var i = 0; i < computeDisplayNames.length; i++) {
              var td = computeDisplayNames[i];
              var tempclass = stringEmpty;
              var value = CommonFunction.HtmlDecode(td.V);
              var colspan = 1;
              var rowspan = 1;
              array.push('<th class="' + tempclass + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >')
              array.push(value);
              array.push('</th>');
            }
          }
          array.push("</tr>");


          var secondLine = centerTable.SecondLine;
          array.push("<tr>");
          var groupByThs = secondLine.GroupByThs;
          if (CommonFunction.ObjectIsNotNull(groupByThs)) {
            for (var i = 0; i < groupByThs.length; i++) {
              var td = groupByThs[i];
              var tempclass = stringEmpty;
              var value = CommonFunction.HtmlDecode(td.V);
              var colspan = td.ColSpan;
              var rowspan = td.RowSpan;
              array.push('<th class="' + tempclass + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >')
              array.push(value);
              array.push('</th>');
            }
          }
          var computeDisplayNames = secondLine.ComputeDisplayNames;
          if (CommonFunction.ObjectIsNotNull(computeDisplayNames)) {
            for (var i = 0; i < computeDisplayNames.length; i++) {
              var td = computeDisplayNames[i];
              var tempclass = stringEmpty;
              var value = CommonFunction.HtmlDecode(td.V);
              var colspan = 1;
              var rowspan = 1;
              array.push('<th class="' + tempclass + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >')
              array.push(value);
              array.push('</th>');
            }
          }
          array.push("</tr>");

        }
        array.push("</thead>");
      }
      if (CommonFunction.ObjectIsNotNull(table.Tbody)) {
        var tbody = table.Tbody;
        var rowTable = tbody.RowTable;
        if (CommonFunction.ObjectIsNotNull(rowTable)) {
          array.push("<tbody>");
          var lines = rowTable.Lines;
          if (CommonFunction.ObjectIsNotNull(lines)) {
            for (var rowNumber = 0; rowNumber < lines.length; rowNumber++) {
              array.push("<tr>");
              var line = lines[rowNumber];
              var headThs = line.HeadThs;
              if (CommonFunction.ObjectIsNotNull(headThs)) {
                for (var i = 0; i < headThs.length; i++) {
                  var td = headThs[i];
                  var tempclass = unittdhbtth;
                  var value = CommonFunction.HtmlDecode(td.V);
                  var code = CommonFunction.HtmlDecode(td.C);
                  var columnCode = td.ColumnCode;
                  var colspan = td.ColSpan;
                  var rowspan = td.RowSpan;
                  array.push('<th class="' + tempclass + '" data-code="' + code + '" data-columncode="' + columnCode + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >' + value + '</th>');
                }
              }
              var values = line.Values;
              if (CommonFunction.ObjectIsNotNull(values)) {
                for (var i = 0; i < values.length; i++) {
                  var td = values[i];
                  var tempclass = unittddatatd;
                  var value = CommonFunction.HtmlDecode(td.V);
                  var code = CommonFunction.HtmlDecode(td.C);
                  var colspan = 1;
                  var rowspan = 1;
                  var rNumber = rowNumber;
                  var cNumber = i;
                  array.push('<td class="' + tempclass + '" rownumber="' + rNumber + '" columnnumber="' + cNumber + '"  data-code="' + code + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >' + value + '</td>')
                }
              }
              array.push("</tr>");
            }
          }
          var collection = rowTable.Collection;
          if (CommonFunction.ObjectIsNotNull(collection)) {
            array.push("<tr>");
            var collectionHeader = collection.CollectionHeader;
            if (CommonFunction.ObjectIsNotNull(collectionHeader)) {
              var td = collectionHeader;
              var tempclass = stringEmpty;
              var value = CommonFunction.HtmlDecode(td.V);
              var colspan = td.ColSpan;
              var rowspan = td.RowSpan;
              array.push('<th class="' + tempclass + '" data-code="' + code + '" data-columncode="' + columnCode + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >' + value + '</th>');
            }
            var values = collection.Values;
            if (CommonFunction.ObjectIsNotNull(values)) {
              for (var i = 0; i < values.length; i++) {
                var td = values[i];
                var tempclass = unittddatatd;
                var value = CommonFunction.HtmlDecode(td.V);
                var colspan = 1;
                var rowspan = 1;
                var rNumber = CommonFunction.ObjectIsNotNull(rowTable.Lines) ? rowTable.Lines.length : -1;
                var cNumber = i;
                array.push('<td class="' + tempclass + '" rownumber="' + rNumber + '" columnnumber="' + cNumber + '"  data-code="' + code + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >' + value + '</td>')
              }
            }
            var collection = collection.Collection;
            if (CommonFunction.ObjectIsNotNull(collection)) {
              for (var i = 0; i < collection.length; i++) {
                var td = collection[i];
                var tempclass = stringEmpty;
                var value = CommonFunction.HtmlDecode(td.V);
                var colspan = 1;
                var rowspan = 1;
                array.push('<td class="' + tempclass + '" data-code="' + code + '" rowspan="' + rowspan + '" colspan="' + colspan + '" data-value="' + value + '" >' + value + '</td>')
              }
            }
            array.push("</tr>");
          }
          array.push("</tbody>");
        }
      }
      array.push("</table>");
      var tableHtml = array.join(stringEmpty);
      CommonFunction.ClearArray(array);
      return tableHtml;
    }
  },
  ObjectIsNotNull: function (o) {
    return o != null && !$.isEmptyObject(o)
  },
};
// 过滤器管理器
const FilterManager = function a(filterContainer, filters, currentUser, boolDic, bindFun) {
  if (filters === null || filters.length === 0) {
    if (filterContainer) {
      filterContainer.remove();
    }
    return;
  }
  this.Filters = H3PluginDeveloper.IClone(filters);
  this.filterValues = {};
  this.CurrentUser = currentUser;
  this.filterContainer = filterContainer;
  this.boolDic = boolDic;
  this.BindFun = bindFun;
  this.Init();
};
FilterManager.prototype = {
  Init() {
  },
  SetValue(filterValues) {
    this.filterValues = filterValues;
  },
  GetValue() {
    return this.filterValues;
  },
};

// ************   华丽分割线   **************
// ************   华丽分割线   **************
// 图表插件
const ChartManager =
  function a(
    reportPage, widget, filterData, ReportViewManager,
    mobilehomereport, $scope, UnitFilterDataJson,
  ) {
    this.ReportViewManager = ReportViewManager;
    // 报表页
    this.ReportPage = reportPage;
    // 报表配置
    this.Widget = widget;
    // 过滤数据
    this.FilterData = filterData;
    // 报表容器
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    // 报表容器，必然先在页面上占有位置，宽高，才能渲染出来
    this.ElementID = H3PluginDeveloper.IGuid();
    this.$ChartElement = $(`<div id='${this.ElementID}'>`).addClass('echartsbody');
    // edit by xc 图表不需要额外设定高度 不然会上下抖动
    switch (this.Widget.WidgetType) {
      case DefaultOptions.WidgetType.Line:
      case DefaultOptions.WidgetType.Bar:
      case DefaultOptions.WidgetType.Pie:
      case DefaultOptions.WidgetType.Radar:
      case DefaultOptions.WidgetType.Funnel:
        this.$ChartElement.css('height', '100%');
        break;
      default:
        this.$ChartElement.css('height', this.$Container.height());
        break;
    }
    // end

    // this.$ChartElement.css("height", this.$Container.height());
    this.$Container.append(this.$ChartElement);
    // 数据源
    this.SourceData = null;
    // 数据源的列
    this.SourceColumns = null;
    this.MyChartsDataResult = null;
    this.ShowDemo = false;
    this.UnitFilterDataJson = UnitFilterDataJson;
    this.mobilehomereport = mobilehomereport;
    this.$scope = $scope;
    // 初始化
    this.Init();
  };
ChartManager.prototype = {
  // 初始化
  Init() {
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    $('#ReportViewContain').css('width', '100%').find(`#${this.Widget.ObjectId}`).css('width', '100%')
      .css('overflow', 'hidden')
      .css('padding-bottom', '10%')
      .css('height', '90%');
    const that = this;
    // 提示加载中
    that.$ChartElement.html('正在加载数据请稍候...');
    // 加载报表数据源数据
    CommonFunction.Post(
      CommonFunction.LoadChartsData, {
        FilterData: JSON.stringify(that.FilterData),
        WidgetId: that.Widget.ObjectId,
        ReportPageCode: that.ReportPage && that.ReportPage.Code ? that.ReportPage.Code :
          that.Widget.ParentObjectId,
        LinkageDataJson: JSON.stringify(that.UnitFilterDataJson),
      },
      (data) => {
        // if (!data.State) {
        //     that.$ChartElement.html("数据源不正确!");
        //     return;
        // }
        if (that.Widget.WidgetType === DefaultOptions.WidgetType.Area ||
          that.Widget.WidgetType === DefaultOptions.WidgetType.Gauge) {
          that.$ChartElement.html('不支持的图表类型!');
          return;
        }
        that.UnitFilterDataJson = data.UnitFilterDataJson;
        // 数据源 数据
        that.SourceData = data.SourceData;
        // 数据源 列
        that.SourceColumns = data.SourceColumns;
        that.MyChartsDataResult = data.MyChartsDataResult;
        // 开始渲染echarts
        that.BindChart.apply(that, [that.Widget.WidgetType]);
      },
      false,
      undefined,
      that
    );
  },
  // 渲染报表
  BindChart(WidgetType) {
    let chartType = 0;
    let showseries = true;
    if (this.mobilehomereport) {
      showseries = false;
    }
    switch (WidgetType) {
      case DefaultOptions.WidgetType.Line:
        chartType = 0;
        break;
      case DefaultOptions.WidgetType.Bar:
        chartType = 1;
        break;
      case DefaultOptions.WidgetType.Pie:
        chartType = 2;
        break;
      case DefaultOptions.WidgetType.Radar:
        chartType = 3;
        break;
      case DefaultOptions.WidgetType.Funnel:
        chartType = 4;
        break;
      default: break;
    }
    const that = this;
    let height = this.$Container.height();
    if (height <= 0) {
      height = 400;
    }
    let width = this.$Container.width() - 50;
    width = this.$Container.width();
    if (!that.ReportViewManager.applist) {
      let computerwidth = 0;
      const onewidth = 20;
      for (const key in that.MyChartsDataResult.Categories) {
        if (key) {
          computerwidth += 1;
        }
      }
      if (computerwidth * onewidth > width) { width = computerwidth * onewidth; }
    }
    let Series = that.MyChartsDataResult ? that.MyChartsDataResult.Series : null;
    let Categories = that.MyChartsDataResult ? that.MyChartsDataResult.Categories : null;
    this.$ChartElement.html('');
    if (that.MyChartsDataResult && (!that.MyChartsDataResult.Categories
      || that.MyChartsDataResult.Categories.length === 0)
      && (!that.MyChartsDataResult.Series || that.MyChartsDataResult.Series.length === 0
        || !that.MyChartsDataResult.Series.Data ||
        that.MyChartsDataResult.Series.Data.length === 0)) {
      this.ShowDemo = true;
      if (that.Widget.DefaultCategorysData && that.Widget.DefaultSeriesData) {
        const DefaultCategorysData =
          CommonFunction.StringToArray(that.Widget.DefaultCategorysData, true, false);
        const DefaultSeriesData =
          CommonFunction.StringToArray(that.Widget.DefaultSeriesData, false, true);
        if (DefaultCategorysData && DefaultSeriesData && DefaultCategorysData.length > 0 &&
          DefaultSeriesData.length > 0) {
          Series = DefaultSeriesData;
          Categories = DefaultCategorysData;
        } else {
          CommonFunction.ShowNoneItemImg(that.$ChartElement);
          return;
        }
      }
    }
    if (this.ReportViewManager.mobileCallback) {
      this.ReportViewManager.mobileCallback(this.ShowDemo);
    }
    // add by xc 解决js内存泄漏
    if (this.ChartObject) {
      this.ChartObject.clear();
      this.ChartObject = null;
    }
    this.ChartObject = this.$ChartElement.ChartBase({
      ChartType: chartType,
      Width: this.$Container.width(),
      Height: this.$Container.height(),
      BarGap: 5,
      Series,
      Categories,
      ShowSeries: showseries,
      setCfg: false,
      ShowDemo: this.ShowDemo,
      ClickChartCBack(ret) {
        // 联动,作为查询条件；
        if (!that.FilterData) {
          that.FilterData = {};
        }
        const UnitFilterDataJson = [];
        // const UnitWidget = that.Widget;
        const serievalue = ret.SeriesCode;
        const CategorieValue = ret.CateCode;
        // let seriecode = '';
        // if (that.Widget.Series && that.Widget.Series.length > 0) {
        //   seriecode = that.Widget.Series[0];
        // }
        // let categoriecode = '';
        // if (that.Widget.Categories && that.Widget.Categories.length > 0) {
        //   categoriecode = that.Widget.Categories[0];
        // }

        // 分类
        if (that.MyChartsDataResult.SerieCode !== null && that.MyChartsDataResult.SerieCode !== 'null') {
          const value = serievalue;
          const code = that.MyChartsDataResult.SerieCode;
          const displayname = that.MyChartsDataResult.SerieDisplayName;
          const columntype = that.MyChartsDataResult.SerieType;
          let filtertype;
          switch (columntype) {
            case DefaultOptions.ColumnType.Numeric:
              filtertype = DefaultOptions.FilterType.Numeric;
              break;
            case DefaultOptions.ColumnType.DateTime:
              filtertype = DefaultOptions.FilterType.DateTime;
              break;
            case DefaultOptions.ColumnType.String:
              filtertype = DefaultOptions.FilterType.String;
              break;
            case DefaultOptions.ColumnType.SingleParticipant:
              filtertype = DefaultOptions.FilterType.Organization;
              break;
            case DefaultOptions.ColumnType.MultiParticipant:
              filtertype = DefaultOptions.FilterType.Organization;
              break;
            default:
              filtertype = DefaultOptions.FilterType.String;
              break;
          }
          const config = {
            ColumnCode: code,
            DisplayName: displayname,
            FilterType: filtertype,
            DefaultValue: value,
            ColumnType: columntype,
          };
          const UnitFilterDataJsonItem = new ReportFilter(config);

          UnitFilterDataJson.push(UnitFilterDataJsonItem);
          that.FilterData[code] = [value];
        }
        // 系列
        if (that.MyChartsDataResult.CategoryCode !== null && that.MyChartsDataResult.CategoryCode !== 'null') {
          const value = CategorieValue;
          const code = that.MyChartsDataResult.CategoryCode;
          const displayname = that.MyChartsDataResult.CategoryDisplayName;
          const columntype = that.MyChartsDataResult.CategoryType;
          let filtertype;
          switch (columntype) {
            case DefaultOptions.ColumnType.Numeric:
              filtertype = DefaultOptions.FilterType.Numeric;
              break;
            case DefaultOptions.ColumnType.DateTime:
              filtertype = DefaultOptions.FilterType.DateTime;
              break;
            case DefaultOptions.ColumnType.String:
              filtertype = DefaultOptions.FilterType.String;
              break;
            case DefaultOptions.ColumnType.SingleParticipant:
              filtertype = DefaultOptions.FilterType.Organization;
              break;
            case DefaultOptions.ColumnType.MultiParticipant:
              filtertype = DefaultOptions.FilterType.Organization;
              break;
            default:
              filtertype = DefaultOptions.FilterType.String;
              break;
          }
          const config = {
            ColumnCode: code,
            DisplayName: displayname,
            FilterType: filtertype,
            DefaultValue: value,
            ColumnType: columntype,
          };
          const UnitFilterDataJsonItem = new ReportFilter(config);
          UnitFilterDataJson.push(UnitFilterDataJsonItem);
          that.FilterData[code] = [value];
        }
        if (that.Widget.LinkageReports !== null && that.Widget.LinkageReports.length > 0) {
          for (const key in that.Widget.LinkageReports) {
            if (that.Widget.LinkageReports[key]) {
              const Objectid = that.Widget.LinkageReports[key];
              if (that.ReportViewManager.ReportManagers[Objectid]) {
                that.ReportViewManager.ReportManagers[Objectid]
                  .ReLoad(that.FilterData, UnitFilterDataJson);
              }
            }
          }
        }
        if (that.Widget.LinkageReports !== null && that.Widget.LinkageReports.length === 1) {
          that.$scope.Road.push(that.$scope.currentWidget.ObjectId);
          for (let i = 0; i < that.$scope.reportView.ReportPage.ReportWidgets.length; i += 1) {
            const item = that.$scope.reportView.ReportPage.ReportWidgets[i];
            if (item.ObjectId === that.Widget.LinkageReports[0]) {
              that.$scope.currentWidgetIndex = i;
              that.$scope.currentWidget = item;
              that.$scope.currentWidgetName = item.DisplayName;
              break;
            }
          }
          if (that.$scope.reportView.ReportPage.ReportWidgets.length > 1) {
            that.$scope.showNavButton = true;
            if (that.$scope.currentWidgetIndex ===
              that.$scope.reportView.ReportPage.ReportWidgets.length - 1) {
              that.$scope.hasPrevious = true;
              that.$scope.hasNext = false;
            } else if (that.$scope.currentWidgetIndex === 0) {
              that.$scope.hasNext = true;
              that.$scope.hasPrevious = false;
            } else {
              that.$scope.hasPrevious = true;
              that.$scope.hasNext = true;
            }
          } else {
            that.$scope.showNavButton = false;
            that.$scope.hasNext = false;
          }
          that.$scope.buttonchange();

          that.$scope.reportView.GetReport(
            H3PluginDeveloper.IClone(that.$scope.filterValues),
            that.$scope.currentWidget, null, true, null, that.$scope, UnitFilterDataJson,
            that.$scope.Colors[that.$scope.currentWidgetIndex % 6],
          );
        }
      },
    });
  },
  // 重新加载
  ReLoad(filterData, UnitFilterDataJson) {
    this.UnitFilterDataJson = UnitFilterDataJson;
    this.FilterData = filterData;
    // 报表容器
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    // 报表容器，必然先在页面上占有位置，宽高，才能渲染出来
    this.ElementID = H3PluginDeveloper.IGuid();
    this.$ChartElement = $(`<div id='${this.ElementID}'>`).addClass('echartsbody');
    this.$ChartElement.css('height', this.$Container.height());
    this.$Container.append(this.$ChartElement);
    this.Init();
  },
  FullScreenTrigger() {
    this.BindChart.apply(this, [this.Widget.WidgetType]);
  },
};

//* *********************  华丽分割线   ************************
//* *********************  华丽分割线   ************************
// 明细表
const GridViewManager = function a(
  reportPage, widget, filterData, ReportViewManager,
  mobilehomereport, $scope, UnitFilterDataJson,
) {
  this.ReportPage = reportPage;
  this.ReportViewManager = ReportViewManager;
  this.Widget = widget;
  this.FilterData = filterData;
  this.UnitFilterDataJson = UnitFilterDataJson;
  // 报表容器
  this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
  this.SourceColumns = null;
  // 定义过滤器
  this.SourceData = null;
  this.mydatatable = null;
  this.PageIndex = 0;
  this.PageLength = 16;
  this.Total = 0;
  this.FirstLineWidths = [];
  this.HasLoad = false;
  this.$scope = $scope;

  this.columns = [];

  this.mobilehomereport = mobilehomereport;
  this.CodesHasSort = [];
  this.Numeric = false;
  this.ChildCodes = {};
  this.Init();
};
GridViewManager.prototype = {
  Init() {
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    if (!this.HasLoad) {
      $('#ReportViewContain').css('width', '100%').find(`#${this.Widget.ObjectId}`).css('width', '100%')
        .css('overflow', 'hidden')
        .css('padding-bottom', '10%')
        .css('height', '90%');
      if (typeof this.$scope.sliderbuild !== 'undefined' && $.isFunction(this.$scope.sliderbuild)) {
        this.$scope.sliderbuild(this.$Container[0], this.LoadMore, this);
      }
    }
    if (this.HasLoad) {
      if (this.Total < this.PageIndex * this.PageLength) { return; }
    }
    const that = this;
    // 构建表格
    this.$Container.html('');

    // let $TableDiv;
    // let $Table;
    const $TableDiv = $("<div  style='width:100%'>");

    const $Table = $("<table style='width:100%' class='table table-striped table-bordered' >");
    $TableDiv.append($Table);
    this.$Container.append($TableDiv);
    CommonFunction.Post(
      CommonFunction.LoadGridData, {
        WidgetId: that.Widget.ObjectId,
        ReportPageCode: that.ReportPage && that.ReportPage.Code ?
          that.ReportPage.Code : that.Widget.ParentObjectId,
        LinkageDataJson: JSON.stringify(that.UnitFilterDataJson),
        start: 0,
        length: 0,
        FilterData: JSON.stringify(that.FilterData),
      },
      (data) => {
        if (data.iTotalRecords === 0) {
          CommonFunction.ShowNoneItemImg(that.$Container);
          return;
        }
        that.Total = data.iTotalRecords;
        that.Numeric = data.Numeric;
        // 数据源 数据
        // 数据源 列
        that.SourceColumns = data.SourceColumns;
        // const mydata = [];
        const $Tr = $('<tr>');
        const $Tr1 = $('<tr>');
        const columns = [];
        const order = [];
        if (that.Widget.SortColumns && that.SourceColumns) {
          for (let i = 0; i < that.Widget.SortColumns.length; i += 1) {
            const sortitem = that.Widget.SortColumns[i];
            for (let j = 0; j < that.SourceColumns.length; j += 1) {
              const sourceitem = that.SourceColumns[j];
              if (sortitem.ColumnCode === sourceitem.ColumnCode) {
                const dir = sortitem.Ascending ? 'asc' : 'desc';
                order.push([j + 1, dir]);
                break;
              }
            }
          }
        }
        if (!$.isEmptyObject(data.ChildCodes)) {
          // 行号
          const $Th = $("<th colspan='1' rowspan='2' style='max-width:100px;'>").attr('data-class', 'gridview-th align-left').attr('data-field', 'DetailRowNumber').text('行号');
          const align = 'left';
          $Tr.append($Th);
          that.columns[CommonFunction.DetailRowNumber] = CommonFunction.DetailRowNumber;
          columns.push({
            data: CommonFunction.DetailRowNumber,
            title: '行号',
            orderable: false,
            render(aa, bb, cc, dd) {
              return CommonFunction.RenderTableTd(aa, bb, cc, dd, align);
            },
          });
          // end行号
          for (const key in data.ChildCodes) {
            if (data.ChildCodes[key]) {
              const node = data.ChildCodes[key];
              if (!$.isEmptyObject(node.ChildColumnSummary)) {
                let count = 0;
                for (const childkey in node.ChildColumnSummary) {
                  if (node.ChildColumnSummary[childkey]) {
                    count += 1;
                    that.ChildCodes[childkey] = true;
                    const childnode = node.ChildColumnSummary[childkey];
                    const aligns = childnode.Align;
                    const childDisplayName = CommonFunction.HtmlDecode(childnode.DisplayName ? childnode.DisplayName : "-");
                    const $Th1 = $("<th colspan='1' rowspan='1'>").attr('data-class', `childtd gridview-th align-${align}`).attr('data-field', childnode.Code).text(childDisplayName); // .css("width", width);
                    $Tr1.append($Th1);
                    that.columns[childnode.Code] = childnode.Code;
                    columns.push({
                      data: childnode.Code,
                      title: childnode.DisplayName,
                      orderable: false,
                      render(aa, bb, cc, dd) {
                        return CommonFunction.RenderTableTd(aa, bb, cc, dd, aligns);
                      },
                    });
                  }
                }
                const displayName = CommonFunction.HtmlDecode(node.DisplayName ? node.DisplayName : "-");
                const $ThEnd = $(`<th colspan='${count}' rowspan='1'>`).attr('data-class', `gridview-th align-${node.Align}`).attr('data-field', node.Code).text(displayName); // .css("width", width);
                $Tr.append($ThEnd);
              } else {
                const displayName = CommonFunction.HtmlDecode(node.DisplayName ? node.DisplayName : "-");
                const $Ths = $("<th colspan='1' rowspan='2' style='' >").attr('data-class', `gridview-th align-${node.Align}`).attr('data-field', node.Code).text(displayName); // .css("width", width);
                $Tr.append($Ths);
                that.columns[node.Code] = node.Code;
                const aligns = node.Align;
                columns.push({
                  data: node.Code,
                  title: node.DisplayName,
                  orderable: false,
                  render(aa, bb, cc, dd) {
                    return CommonFunction.RenderTableTd(aa, bb, cc, dd, aligns);
                  },
                });
              }
            }
          }
          $Table.append($('<thead>').append($Tr));
          if ($Tr1.children().length > 0) { $Table.find('>thead').append($Tr1); } else {
            $Table.find('>thead').find('th').attr('rowspan', '1');
          }
        } else {
          // 行号
          const $Th = $("<th colspan='1' rowspan='1'   style='max-width:100px;'>").attr('data-class', 'gridview-th align-left').attr('data-field', 'DetailRowNumber').text('行号');
          $Tr.append($Th);
          let align = 'left';
          that.columns[CommonFunction.DetailRowNumber] = CommonFunction.DetailRowNumber;
          columns.push({
            data: CommonFunction.DetailRowNumber,
            title: '行号',
            orderable: false,
            render(aa, bb, cc, dd) {
              return CommonFunction.RenderTableTd(aa, bb, cc, dd, align);
            },
          });
          // end行号
          for (let i = 0; that.SourceColumns !== null && i < that.SourceColumns.length; i += 1) {
            const column = that.SourceColumns[i];
            // let align = 'left';
            if (column.ColumnType === 0) {
              align = 'right';
            }
            const displayName = CommonFunction.HtmlDecode(column.DisplayName ? column.DisplayName : "-");
            const $Ths = $('<th>').attr('data-class', `gridview-th align-${align}`).attr('data-field', column.ColumnCode).text(displayName);
            $Tr.append($Ths);
            that.columns[column.ColumnCode] = column.ColumnCode;
            columns.push({
              data: column.ColumnCode,
              title: column.DisplayName,
              orderable: false,
              /* eslint-disable */
              render(aa, bb, cc, dd) {
                return CommonFunction.RenderTableTd(aa, bb, cc, dd, align);
              },
            });
          }
          $Table.append($('<thead>').append($Tr));
        }
        CommonFunction.Post(
          CommonFunction.LoadGridData, {
            WidgetId: that.Widget.ObjectId,
            ReportPageCode: that.ReportPage && that.ReportPage.Code ? that.ReportPage.Code :
              that.Widget.ParentObjectId,
            LinkageDataJson: JSON.stringify(that.UnitFilterDataJson),
            start: that.PageIndex * that.PageLength,
            length: that.PageLength,
            FilterData: JSON.stringify(that.FilterData),
          },
          (datas) => {
            const returnData = datas;
            that.SourceData = returnData.aaData;
            that.mydatatable = $Table.DataTable({
              autoWidth: true,
              deferRender: true,
              filter: false,
              info: true,
              paginate: false,
              ordering: false,
              processing: true,
              scrollInfinite: true,
              scrollY: '100%',
              scrollCollapse: true,
              serverSide: false,
              data: that.SourceData,
              fixedColumns: true,
              dom: 'rt',
              columns,
              language: {
                lengthMenu: '每页_MENU_条',
                paginate: {
                  previous: '上一页',
                  next: '下一页',
                  first: '首页',
                  last: '尾页',
                },
                zeroRecords: '没有内容',
                info: '当前第_START_到_END_条 共_TOTAL_条',
                infoEmpty: '0条记录',
                processing: '正在加载数据...',
              },
              drawCallback() {
                if (!that.mobilehomereport) {
                  const height = that.$Container.find('.dataTables_scrollHead').css('height');
                  that.$Container.css('margin-top', height);
                  that.$Container.find('.dataTables_scrollHead').css('position', 'absolute').css('top', '5px').css('overflow', '');
                  that.$Container.find('.dataTables_scrollBody').css('overflow', '');
                }
              },
              createdRow(row, rowDatas) {
                const rowData = rowDatas;
                if (that.$scope) {
                  const $row = $(row);
                  if (rowData[CommonFunction.BizObjectId]) {
                    const SchemaCode = rowData[CommonFunction.BizObjectId].SchemaCode;
                    const objectid =
                      rowData[CommonFunction.BizObjectId][CommonFunction.BizObjectId];
                    $row.unbind('click').bind('click', () => {
                      if (typeof (that.$scope.goSheetDetail) !== 'undefined') {
                        that.$scope.goSheetDetail(SchemaCode, objectid);
                        that.$Container.find('.dataTables_scrollHead').css('left', '5px');
                      }
                    });
                  }
                }
              },
            });
            if (!that.HasLoad) {
              that.$Container.scroll(function bb() {
                const ScrollX = `${(`-${$(this)[0].scrollLeft}` - 0) + (5 - 0)}px`;
                that.$Container.find('.dataTables_scrollHead').css('left', ScrollX);
              });
              that.HasLoad = true;
            }
          },
        );
      },
      false,
      undefined,
      that
    );
  },
  ComputerWidth() {
    const that = this;
    that.$Container.find('.dataTables_scrollHeadInner table').css('width', `${that.$Container.find('.dataTables_scrollBody table').scrollWidth}px`);
    that.$Container.find('.dataTables_scrollBody').attr('id', `${that.Widget.ObjectId}_dataTables_scrollBody`);
    let scrollwidht = 0;
    if (document.getElementById(`${that.Widget.ObjectId}_dataTables_scrollBody`)) {
      scrollwidht = document.getElementById(`${that.Widget.ObjectId}_dataTables_scrollBody`).offsetWidth - document.getElementById(`${that.Widget.ObjectId}_dataTables_scrollBody`).scrollWidth;
    }
    const headwidth = `${that.$Container.find('.dataTables_scrollBody').css('width').replace('px', '') - scrollwidht}px`;
    that.$Container.find('.dataTables_scrollHeadInner').css('width', headwidth);
    that.$Container.find('.dataTables_scrollHeadInner table').css('width', headwidth);
    const dicwidthvalue = [];
    let firsttdnumber = 0;
    that.$Container.find('.dataTables_scrollBody .table tbody tr').eq(0).find('td').each(function bb() {
      const $this = $(this);
      const width = $this.css('width');
      dicwidthvalue.push(width);
      firsttdnumber += 1;
    });
    if (firsttdnumber <= 1) { return; }
    let thiswidthcounter = 0;
    const widthNumber = [];
    that.$Container.find('.dataTables_scrollHead .dataTables_scrollHeadInner table thead tr').each(function bb() {
      if (thiswidthcounter === 0) {
        let thcounter = 0;
        $(this).find('th').each(function cpb() {
          const $thisTh = $(this);
          if ($thisTh.attr('colspan') === '1') {
            $thisTh.css('width', dicwidthvalue[thcounter]);
            $thisTh.css('min-width', dicwidthvalue[thcounter]);
            $thisTh.css('max-width', dicwidthvalue[thcounter]);
          } else {
            for (let kkk = thcounter; kkk < thcounter + ($thisTh.attr('colspan') - 0); kkk += 1) {
              widthNumber.concat(kkk);
            }
          }
          thcounter += ($thisTh.attr('colspan') - 0);
        });
      } else {
        $(this).find('th').each(function cpb() {
          for (let jjj = 0; jjj < widthNumber.length; jjj += 1) {
            const number = widthNumber[jjj];
            $(this).css('width', dicwidthvalue[number]);
            $(this).css('min-width', dicwidthvalue[number]);
            $(this).css('max-width', dicwidthvalue[number]);
          }
        });
      }
      $(this).css('width', dicwidthvalue[thiswidthcounter]);
      thiswidthcounter += 1;
    });
  },
  ReLoad(filterData, UnitFilterDataJson) {
    this.PageIndex = 0;
    this.Total = 0;
    this.FirstLineWidths = [];
    this.HasLoad = false;
    this.columns = [];
    this.UnitFilterDataJson = UnitFilterDataJson;
    this.FilterData = filterData;
    // 报表容器
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    this.Init();
  },
  FullScreenTrigger() {
    // const pannel = this.$Container.parent();
    this.$Container.find('.dataTables_scrollBody').css('max-height', `${this.$Container.css('height').replace('px', '') - this.$Container.find('.dataTables_scrollHead').css('height').replace('px', '') - 50}px`);
    // 待修正，
    this.mydatatable.ajax.reload();
  },
  LoadMore(managers) {
    const manager = managers;
    manager.PageIndex += 1;
    if (manager.PageIndex * manager.PageLength >= manager.Total) { return; }
    CommonFunction.Post(
      CommonFunction.LoadGridData, {
        WidgetId: manager.Widget.ObjectId,
        ReportPageCode: manager.ReportPage && manager.ReportPage.Code ? manager.ReportPage.Code :
          manager.Widget.ParentObjectId,
        LinkageDataJson: JSON.stringify(manager.UnitFilterDataJson),
        start: manager.PageIndex * manager.PageLength,
        length: manager.PageLength,
        FilterData: JSON.stringify(manager.FilterData),
      },
      (data) => {
        if (data.aaData) {
          // 删除上一页的汇总行
          if (data.aaData.length > 0 && manager.Numeric) {
            manager.$Container.find('.dataTables_scrollBody>table>tbody').find('>tr:last').remove();
          }
          for (let i = 0; i < data.aaData.length; i += 1) {
            const item = data.aaData[i];
            const $tr = manager.GetTr(item, manager);
            manager.$Container.find('.dataTables_scrollBody>table>tbody').append($tr);
          }
          manager.ComputerWidth();
        }
      }
    );
  },
  GetTr(item, manager) {
    // 这里没考虑子表合并
    const childtd = 'childtd';
    const empty = '';
    let html = '<tr';
    const trclass = manager.$Container.find('.dataTables_scrollBody>table>tbody').find('>tr:last').hasClass('even') ? 'odd' : 'even';
    html += ` class='${trclass}' `;
    html += ' > ';
    if (manager.columns[CommonFunction.DetailRowNumber]) {
      html += "<td class=' gridview-th align-left'>";
      html += item[CommonFunction.DetailRowNumber];
      html += '</td>';
    }
    for (const key in manager.columns) {
      if (!manager.columns[key] || key === CommonFunction.DetailRowNumber ||
        manager.columns[key] !== key) continue;
      let align = 'left';
      let column = null;
      // manager.columns[key];
      for (let i = 0; i < manager.SourceColumns.length; i += 1) {
        if (manager.SourceColumns[i].ColumnCode === key) {
          column = manager.SourceColumns[i];
          break;
        }
      }
      if (column && column.ColumnType === 0) {
        align = 'right';
      }
      const classTd = `${this.ChildCodes[key] ? childtd : empty} gridview-th align-${align}`;
      html += `<td class='${classTd}'>`;
      let value = '--';
      const aa = item[key];
      if (aa) {
        if ($.isArray(aa)) {
          value = aa;
          let childhtml = '';
          if (value.length > 0) {
            childhtml = '';
            childhtml += "<table class='childtable' style='width:100%;height:100%;'>";
            for (let i = 0; i < value.length; i += 1) {
                const newvalue = CommonFunction.HtmlDecode(value[i] === null || value[i] === '' ? '-' : value[i]);
              childhtml += `<tr style='background-color: transparent;height: auto;line-height: inherit;'><td title='${newvalue}' style='padding: 8px 0px 8px 0px !important;height:20px;'>${newvalue}</td></tr>`;
            }
            childhtml += '</table>';
            value = childhtml;
          } else {
            value = "<div style='padding:0px 8px 0px 8px'>-</div>";
          }
        } else {
            value = CommonFunction.HtmlDecode(aa);
        }
      }
      html += value;
      html += '</td>';
    }
    html += '</tr>';
    const $tr = $(html);
    if (item[CommonFunction.BizObjectId]) {
      const SchemaCode = item[CommonFunction.BizObjectId].SchemaCode;
      const objectid = item[CommonFunction.BizObjectId][CommonFunction.BizObjectId];
      $tr.unbind('click').bind('click', () => {
        manager.$scope.goSheetDetail(SchemaCode, objectid);
      });
    }
    return $tr;
  },
};

//* ***********************   华丽分割线   ********************************************
//* ***********************   华丽分割线   ********************************************
// 汇总表
const ChartTableManager = function a(
  reportPage, widget, filterData,
  ReportViewManager, mobilehomereport, $scope, UnitFilterDataJson,
) {
  this.ReportViewManager = ReportViewManager;
  this.mobilehomereport = mobilehomereport;
  // 报表页
  this.ReportPage = reportPage;
  this.Widget = widget;
  this.FilterData = filterData;
  // 报表容器
  this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
  // ------------------------------------new------------------------------------------------------
  //整个报表
  this.TotalTable = null;
  //冻结列表头
  this.FreezeColumnTable = null;
  //冻结
  this.FreezeOnlyHeadTable = null;
  //冻结行表头
  this.FreezeRowTable = null;
  //列路径，用于联动
  this.ColumnLinkageConditionMap = null;
  //行路径，用于联动
  this.RowLinkageConditionMap = null;
  // 联动过滤条件
  this.UnitFilterDataJson = UnitFilterDataJson;
  // 存储table最后两行的宽度
  this.lastsecondline = [];
  this.lastline = [];
  this.$scope = $scope;
  // ------------------------------------new------------------------------------------------------
  // ------------------------------------Old----------------------------------------------------
  // 数据源
  this.SourceData = null;
  // 数据源的列
  this.SourceColumns = null;
  // 维度数据
  this.Series = { Filed: null, Data: null };
  // 分类
  this.Category = {
    MasterCategory: { Filed: null, Data: null },
    SubCategory: { Filed: null, Data: null },
  };
  //----------------------------------------------------------------------------------------
  this.Init();
};
ChartTableManager.prototype = {
  Init() {
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    $('#ReportViewContain').css('width', '100%').find(`#${this.Widget.ObjectId}`).css('width', '100%')
      .css('overflow', 'hidden')
      .css('padding-bottom', '10%')
      .css('height', '90%');
    // 绑定滑动
    const dom = this.$Container[0];
    if (typeof this.$scope.sliderbuild !== 'undefined' && $.isFunction(this.$scope.sliderbuild)) {
      this.$scope.sliderbuild(dom);
    }
    // end绑定滑动
    const that = this;
    // 提示加载中
    that.$Container.html('正在加载数据请稍候...');
    // 加载报表数据源数据
    CommonFunction.Post(
      CommonFunction.LoadChartsData, {
        FilterData: JSON.stringify(that.FilterData),
        WidgetId: that.Widget.ObjectId,
        ReportPageCode: that.ReportPage && that.ReportPage.Code ? that.ReportPage.Code :
          that.Widget.ParentObjectId,
        LinkageDataJson: JSON.stringify(that.UnitFilterDataJson),
      },
      (data) => {
        if ((data.TotalTable === null || data.TotalTable.length == 0)) {
          CommonFunction.ShowNoneItemImg(that.$Container);
          return;
        }
        that.TotalTable = data.TotalTable;
        //列表头table
        that.FreezeColumnTable = data.FreezeColumnTable;
        //行表头数;
        that.FreezeOnlyHeadTable = data.FreezeOnlyHeadTable;
        //列路径，用于联动
        that.FreezeRowTable = data.FreezeRowTable;
        //行路径，用于联动
        that.ColumnLinkageConditionMap = data.ColumnLinkageConditionMap;
        that.RowLinkageConditionMap = data.RowLinkageConditionMap;
        //开始渲染echarts
        that.BuildTable.apply(that);
        return null;
      },
      false,
      undefined,
      that
    );
  },
  BuildTable() {
            const stringEmpty = "";
            const doubleHH = "--";
            const singleH = "-";
            const unittdbtTh = "unittd bt-Th";
            const unittdhbtth = "unittd hbt-th";
            const unittddatatd = "unittd data-td";
            const that = this;
            this.$Container.html(stringEmpty);
            var top = 0;
            var left = 0;
            //-----------------------------------New------------------------------------------------
            //1.填列标题；
            var tableHtml = CommonFunction.GetCombinedTable(that.TotalTable, "<table class='table table-bordered table-condensed orgtable'>");
            var freezenColumnTableHtml = CommonFunction.GetCombinedTable(that.FreezeColumnTable, "<table class='table table-bordered table-condensed table-column-freezen' style='top:" + top + "px;left:" + left + "px;'>");
            var freezenRowTableHtml = CommonFunction.GetCombinedTable(that.FreezeRowTable, "<table class='table table-bordered table-condensed table-row-freezen' style='top:" + top + "px;left:" + left + "px;'>");
            var freezenOnlyHeaderTableHtml = CommonFunction.GetCombinedTable(that.FreezeOnlyHeadTable, "<table class='table table-bordered table-condensed table-condensed table-onlyheader-freezen'  style='top:" + top + "px;left:" + left + "px;'>");
            this.$Container.html(tableHtml + freezenColumnTableHtml + freezenRowTableHtml + freezenOnlyHeaderTableHtml);
            that.BindEvent();
  },
  BindEvent() {
    const that = this;
    let top = 0;
    let left = 0;
    const mobilefrozenSwitch = !that.mobilehomereport;
    const IsMobile = true;
    const FlagFreezenColumn = (that.Widget.FrozenHeaderType == DefaultOptions.ReportFrozenHeaderType.FrozenColumnHeader || that.Widget.FrozenHeaderType == DefaultOptions.ReportFrozenHeaderType.FrozenRowAndColumnHeader);
    const FlagFreezenRow = (that.Widget.FrozenHeaderType == DefaultOptions.ReportFrozenHeaderType.FrozenRowHeader || that.Widget.FrozenHeaderType == DefaultOptions.ReportFrozenHeaderType.FrozenRowAndColumnHeader);
    if (IsMobile && !that.mobilehomereport) {
      top = ($('#ReportViewContain').position().top - 0) + ($('#ReportViewContain').css('padding').replace('px', '') - 0);
      left = $('#ReportViewContain').css('padding').replace('px', '');
      that.$Container.find('.table-column-freezen').attr('style', 'top:' + top + 'px;left:' + left + 'px');
      that.$Container.find('.table-onlyheader-freezen').attr('style', 'top:' + top + 'px;left:' + left + 'px');
      that.$Container.find('.table-row-freezen').attr('style', 'top:' + top + 'px;left:' + left + 'px');
    }
    if (FlagFreezenColumn || FlagFreezenRow) {
      that.ComputeOrgWidth(that.$Container.find('.orgtable'));
    }
    if (FlagFreezenColumn) {
      that.ComputeOrgWidth(that.$Container.find('.orgtable'));
      // const ColumnHeaderTableLastSecondLineCounter = 0;
      // const ColumnHeaderTableLastLineCounter = 0;
      // 计算最后两行的宽度
      that.ComputerWidth(that.$Container.find('.table-column-freezen'), that.lastsecondline, that.lastline);
    }
    // 行表头冻结
    if (FlagFreezenRow) {
      that.ComputerWidth(that.$Container.find('.table-onlyheader-freezen'), that.lastsecondline, that.lastline);
      that.ComputerWidth(that.$Container.find('.table-row-freezen'), that.lastsecondline, that.lastline);
    }

    // 绑定滚动事件
    if (mobilefrozenSwitch) {
      {
        const myheight = $('#ReportViewContain').height();
        const mywidth = $('#ReportViewContain').width();
        const paddingleftTop = 0;
        const paddingleftleft = 0;
        const paddingleftheight = myheight;

        const paddingrightTop = 0;
        const paddingrightright = 0;
        const paddingrightheight = myheight;
        const paddingtopTop = 0;
        const paddingtopleft = 5;
        const paddingtopwidth = mywidth;
        if ($('#paddingleft') && $('#paddingleft').length === 0) {
          $('#ReportViewContain').append($('<div id="paddingleft" class="paddingleft"></div>'));
        }
        if ($('#paddingright') && $('#paddingright').length === 0) {
          $('#ReportViewContain').append($('<div id="paddingright" class="paddingright"></div>'));
        }
        if ($('#paddingtop') && $('#paddingtop').length === 0) {
          $('#ReportViewContain').append($('<div id="paddingtop" class="paddingtop"></div>'));
        }
        $('#paddingleft').attr('style', `position:absolute;left:${paddingleftleft};top:${paddingleftTop}px;width:5px;height:${paddingleftheight}px;z-index:98;background-color:#fff;`);
        $('#paddingright').attr('style', `position:absolute;right:${paddingrightright};top:${paddingrightTop}px;width:5px;height:${paddingrightheight}px;z-index:98;background-color:#fff;`);
        $('#paddingtop').attr('style', `position:absolute;left:${paddingtopleft}px;top:${paddingtopTop}px;width:${paddingtopwidth}px;height:5px;z-index:98;background-color:#fff;`);
      }
      this.$Container.scroll(function bb() {
        if (IsMobile) {
          const ScrollY = `${((`-${$(this)[0].scrollTop}`) - 0) + (5 - 0)}px`;
          const ScrollX = `${(`-${$(this)[0].scrollLeft}` - 0) + (5 - 0)}px`;
          if (mobilefrozenSwitch) {
            that.$Container.find('.table-column-freezen').css('left', ScrollX);
            that.$Container.find('.table-row-freezen').css('top', ScrollY);
          }
        } else {
          const ScrollY = `${$(this)[0].scrollTop + (top - 0)}px`;
          const ScrollX = `${$(this)[0].scrollLeft + (left - 0)}px`;
          that.$Container.find('.table-column-freezen').css('top', ScrollY);
          if (mobilefrozenSwitch) {
            that.$Container.find('.table-row-freezen').css('left', ScrollX);
            that.$Container.find('.table-onlyheader-freezen').css('top', ScrollY);
            that.$Container.find('.table-onlyheader-freezen').css('left', ScrollX);
          }
        }
      });
    }

    this.$Container.off('click').on('click', (e) => {
      const $target = $(e.target);
      const tempclass = e.target.attributes.class ? e.target.attributes.class.value : '';
      switch (tempclass) {
        case 'data-td':
          {
            if (!that.FilterData) {
              that.FilterData = {};
            }
            const UnitFilterDataJson = [];
            const rownum = $target.attr('row') - 0;
            const columnnum = $target.attr('col') - 0;
            for (const rowcode in that.RowRoad[rownum]) {
              if (that.RowRoad[rownum][rowcode]) {
                // const UnitWidget = that.Widget;
                const value = that.RowRoad[rownum][rowcode];
                let code = rowcode;
                code = code.toLowerCase();
                let displayname;
                let columntype;
                let filtertype;
                for (let i = 0;
                  that.Widget.Categories && i < that.Widget.Categories.length; i += 1) {
                  const column = that.Widget.Categories[i];
                  if (column.ColumnCode.toLowerCase() === code) {
                    displayname = column.DisplayName;
                    columntype = column.ColumnType;
                    switch (columntype) {
                      case DefaultOptions.ColumnType.Numeric:
                        filtertype = DefaultOptions.FilterType.Numeric;
                        break;
                      case DefaultOptions.ColumnType.DateTime:
                        filtertype = DefaultOptions.FilterType.DateTime;
                        break;
                      case DefaultOptions.ColumnType.String:
                        filtertype = DefaultOptions.FilterType.String;
                        break;
                      default: break;
                    }
                  }
                }
                const config = {
                  ColumnCode: code,
                  DisplayName: displayname,
                  FilterType: filtertype,
                  DefaultValue: value,
                  ColumnType: columntype,
                };
                const UnitFilterDataJsonItem = new ReportFilter(config);

                UnitFilterDataJson.push(UnitFilterDataJsonItem);
                that.FilterData[code] = [value];
              }
            }
            for (const columncode in that.ColumnRoad[columnnum]) {
              if (that.ColumnRoad[columnnum][columncode]) {
                // const UnitWidget = that.Widget;
                const value = that.ColumnRoad[columnnum][columncode];
                if (typeof value === 'undefined') { continue; }
                let code = columncode;
                code = code.toLowerCase();
                let displayname;
                let columntype;
                let filtertype;
                for (let i = 0;
                  that.Widget.Categories && i < that.Widget.Categories.length;
                  i += 1) {
                  const column = that.Widget.Series[i];
                  if (column.ColumnCode.toLowerCase() === code) {
                    displayname = column.DisplayName;
                    columntype = column.ColumnType;
                    switch (columntype) {
                      case DefaultOptions.ColumnType.Numeric:
                        filtertype = DefaultOptions.FilterType.Numeric;
                        break;
                      case DefaultOptions.ColumnType.DateTime:
                        filtertype = DefaultOptions.FilterType.DateTime;
                        break;
                      case DefaultOptions.ColumnType.String:
                        filtertype = DefaultOptions.FilterType.String;
                        break;
                      default: break;
                    }
                  }
                }
                const config = {
                  ColumnCode: code,
                  DisplayName: displayname,
                  FilterType: filtertype,
                  DefaultValue: value,
                  ColumnType: columntype,
                };
                const UnitFilterDataJsonItem = new ReportFilter(config);
                UnitFilterDataJson.push(UnitFilterDataJsonItem);
                that.FilterData[code] = [value];
              }
            }

            if (that.Widget.LinkageReports !== null && that.Widget.LinkageReports.length === 1) {
              that.$scope.Road.push(that.$scope.currentWidget.ObjectId);
              for (let i = 0; i < that.$scope.reportView.ReportPage.ReportWidgets.length; i += 1) {
                const item = that.$scope.reportView.ReportPage.ReportWidgets[i];
                if (item.ObjectId === that.Widget.LinkageReports[0]) {
                  that.$scope.currentWidgetIndex = i;
                  that.$scope.currentWidget = item;
                  that.$scope.currentWidgetName = item.DisplayName;
                  break;
                }
              }
              if (that.$scope.reportView.ReportPage.ReportWidgets.length > 1) {
                that.$scope.showNavButton = true;
                if (that.$scope.currentWidgetIndex ===
                  that.$scope.reportView.ReportPage.ReportWidgets.length - 1) {
                  that.$scope.hasPrevious = true;
                  that.$scope.hasNext = false;
                } else if (that.$scope.currentWidgetIndex === 0) {
                  that.$scope.hasNext = true;
                  that.$scope.hasPrevious = false;
                } else {
                  that.$scope.hasPrevious = true;
                  that.$scope.hasNext = true;
                }
              } else {
                that.$scope.showNavButton = false;
                that.$scope.hasNext = false;
              }
              that.$scope.buttonchange();

              that.$scope.reportView.GetReport(
                H3PluginDeveloper.IClone(that.$scope.filterValues),
                that.$scope.currentWidget, null, true, null, that.$scope,
                UnitFilterDataJson, that.$scope.Colors[that.$scope.currentWidgetIndex % 6],
              );
            }
          }
          break;
        case 'bt-Th':
          // 联动,作为查询条件；
          if (!that.FilterData) {
            that.FilterData = {};
          }

          if (1) {
            // const UnitWidget = that.Widget;
            const value = $target.attr('data-code');
            let code = $target.attr('data-columncode');
            code = code.toLowerCase();
            let displayname;
            let columntype;
            let filtertype;
            for (let i = 0; that.Widget.Series && i < that.Widget.Series.length; i += 1) {
              const column = that.Widget.Series[i];
              if (column.ColumnCode.toLowerCase() === code) {
                displayname = column.DisplayName;
                columntype = column.ColumnType;
                switch (columntype) {
                  case DefaultOptions.ColumnType.Numeric:
                    filtertype = DefaultOptions.FilterType.Numeric;
                    break;
                  case DefaultOptions.ColumnType.DateTime:
                    filtertype = DefaultOptions.FilterType.DateTime;
                    break;
                  case DefaultOptions.ColumnType.String:
                    filtertype = DefaultOptions.FilterType.String;
                    break;
                  default: break;
                }
              }
            }
            const config = {
              ColumnCode: code,
              DisplayName: displayname,
              FilterType: filtertype,
              DefaultValue: value,
              ColumnType: columntype,
            };
            const UnitFilterDataJsonItem = new ReportFilter(config);
            const UnitFilterDataJson = [];
            UnitFilterDataJson.push(UnitFilterDataJsonItem);
            that.FilterData[code] = [value];
            if (that.Widget.LinkageReports !== null && that.Widget.LinkageReports.length === 1) {
              that.$scope.Road.push(that.$scope.currentWidget.ObjectId);
              for (let i = 0; i < that.$scope.reportView.ReportPage.ReportWidgets.length; i += 1) {
                const item = that.$scope.reportView.ReportPage.ReportWidgets[i];
                if (item.ObjectId === that.Widget.LinkageReports[0]) {
                  that.$scope.currentWidgetIndex = i;
                  that.$scope.currentWidget = item;
                  that.$scope.currentWidgetName = item.DisplayName;
                  break;
                }
              }
              if (that.$scope.reportView.ReportPage.ReportWidgets.length > 1) {
                that.$scope.showNavButton = true;
                if (that.$scope.currentWidgetIndex ===
                  that.$scope.reportView.ReportPage.ReportWidgets.length - 1) {
                  that.$scope.hasPrevious = true;
                  that.$scope.hasNext = false;
                } else if (that.$scope.currentWidgetIndex === 0) {
                  that.$scope.hasNext = true;
                  that.$scope.hasPrevious = false;
                } else {
                  that.$scope.hasPrevious = true;
                  that.$scope.hasNext = true;
                }
              } else {
                that.$scope.showNavButton = false;
                that.$scope.hasNext = false;
              }
              that.$scope.buttonchange();

              that.$scope.reportView.GetReport(
                H3PluginDeveloper.IClone(that.$scope.filterValues),
                that.$scope.currentWidget, null, true, null, that.$scope, UnitFilterDataJson,
                that.$scope.Colors[that.$scope.currentWidgetIndex % 6],
              );
            }
          }
          break;
        case 'hbt-th':
          // 联动,作为查询条件；
          if (!that.FilterData) {
            that.FilterData = {};
          }
          if (1) {
            // const UnitWidget = that.Widget;
            const value = $target.attr('data-code');
            let code = $target.attr('data-columncode');
            code = code.toLowerCase();
            let displayname;
            let columntype;
            let filtertype;
            for (let i = 0; that.Widget.Categories && i < that.Widget.Categories.length; i += 1) {
              const column = that.Widget.Categories[i];
              if (column.ColumnCode.toLowerCase() === code) {
                displayname = column.DisplayName;
                columntype = column.ColumnType;
                switch (columntype) {
                  case DefaultOptions.ColumnType.Numeric:
                    filtertype = DefaultOptions.FilterType.Numeric;
                    break;
                  case DefaultOptions.ColumnType.DateTime:
                    filtertype = DefaultOptions.FilterType.DateTime;
                    break;
                  case DefaultOptions.ColumnType.String:
                    filtertype = DefaultOptions.FilterType.String;
                    break;
                  default: break;
                }
              }
            }
            const config = {
              ColumnCode: code,
              DisplayName: displayname,
              FilterType: filtertype,
              DefaultValue: value,
              ColumnType: columntype,
            };
            const UnitFilterDataJsonItem = new ReportFilter(config);
            const UnitFilterDataJson = [];
            UnitFilterDataJson.push(UnitFilterDataJsonItem);
            that.FilterData[code] = [value];
            if (that.Widget.LinkageReports !== null && that.Widget.LinkageReports.length === 1) {
              that.$scope.Road.push(that.$scope.currentWidget.ObjectId);
              for (let i = 0; i < that.$scope.reportView.ReportPage.ReportWidgets.length; i += 1) {
                const item = that.$scope.reportView.ReportPage.ReportWidgets[i];
                if (item.ObjectId === that.Widget.LinkageReports[0]) {
                  that.$scope.currentWidgetIndex = i;
                  that.$scope.currentWidget = item;
                  that.$scope.ViewModel.currentWidgetName = item.DisplayName;
                  break;
                }
              }
              if (that.$scope.reportView.ReportPage.ReportWidgets.length > 1) {
                that.$scope.showNavButton = true;
                if (that.$scope.currentWidgetIndex ===
                  that.$scope.reportView.ReportPage.ReportWidgets.length - 1) {
                  that.$scope.hasPrevious = true;
                  that.$scope.hasNext = false;
                } else if (that.$scope.currentWidgetIndex === 0) {
                  that.$scope.hasNext = true;
                  that.$scope.hasPrevious = false;
                } else {
                  that.$scope.hasPrevious = true;
                  that.$scope.hasNext = true;
                }
              } else {
                that.$scope.showNavButton = false;
                that.$scope.hasNext = false;
              }
              that.$scope.buttonchange();

              that.$scope.reportView.GetReport(
                H3PluginDeveloper.IClone(that.$scope.filterValues),
                that.$scope.currentWidget, null, true, null, that.$scope, UnitFilterDataJson,
                that.$scope.Colors[that.$scope.currentWidgetIndex % 6],
              );
            }
          }
          break;
        default:
          break;
      }
    });
  },
 ComputeOrgWidth: function (Dom) {
            const that = this;
            that.lastsecondline = [];
            that.lastline = [];
            Dom.find("thead tr:eq(-2) th").each(function () {
                let $this = $(this);
                that.lastsecondline.push($this.css("width"));
            });
            Dom.find("thead tr:last th").each(function () {
                let $this = $(this);
                that.lastline.push($this.css("width"));
            });
        },
        ComputerWidth: function (Dom) {
            const that = this;
            let ColumnHeaderTableLastSecondLineCounter = 0;
            let ColumnHeaderTableLastLineCounter = 0;
            //计算最后两行的宽度
            Dom.find("thead tr:eq(-2) th").each(function () {
                let $this = $(this);
                $this.css("width", that.lastsecondline[ColumnHeaderTableLastSecondLineCounter]);
                $this.css("min-width", that.lastsecondline[ColumnHeaderTableLastSecondLineCounter]);
                $this.css("max-width", that.lastsecondline[ColumnHeaderTableLastSecondLineCounter]);
                ColumnHeaderTableLastSecondLineCounter++;
            });
            Dom.find("thead tr:last th").each(function () {
                let $this = $(this);
                $this.css("width", that.lastline[ColumnHeaderTableLastLineCounter]);
                $this.css("min-width", that.lastline[ColumnHeaderTableLastLineCounter]);
                $this.css("max-width", that.lastline[ColumnHeaderTableLastLineCounter]);
                ColumnHeaderTableLastLineCounter++;
            });
        },
  // 读取某列的数据
  ReLoad(filterData, UnitFilterDataJson) {
    this.FilterData = filterData;
    this.UnitFilterDataJson = UnitFilterDataJson;
    // 报表容器
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    this.Init();
  },
  FullScreenTrigger() { },
};

const SimpleBoardChildManager = function bb(
  reportPage, widget, filterData, widgetsimpleboard, allColor, ReportViewManager,
  mobilehomereport, $scope, UnitFilterDataJson,
) {
  this.ReportViewManager = ReportViewManager;
  this.reportPage = reportPage;
  this.Widget = widget;
  this.FilterData = filterData;
  this.WidgetSimpleBoard = widgetsimpleboard;
  // 报表容器
  this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}_table`);
  // 定义过滤器
  this.Text = null;
  this.Value = null;
  this.allColor = allColor;
  this.$scope = $scope;
  this.UnitFilterDataJson = UnitFilterDataJson;
  this.Init();
};
SimpleBoardChildManager.prototype = {
  Init() {
    const that = this;
    const $td = this.$Container.find(`tr:eq(${this.WidgetSimpleBoard.RowIndex})`).children(`td:eq(${this.WidgetSimpleBoard.ColumnIndex})`);
    $td.find('.simpleoard-loadingdata').html('加载中...');
    // 加载报表数据源数据
    CommonFunction.Post(
      CommonFunction.LoadSimpleBoard, {
        FilterData: JSON.stringify(that.FilterData),
        WidgetId: that.Widget ? that.Widget.ObjectId : null,
        ReportPageCode: that.reportPage ? that.reportPage.ObjectId : that.Widget.ParentObjectId,
        SimpleBoardId:
          that.WidgetSimpleBoard ? that.WidgetSimpleBoard.ObjectId : null,
        LinkageDataJson: JSON.stringify(that.UnitFilterDataJson),
      },
      (data) => {
          that.Text = CommonFunction.HtmlDecode(data.Text);
        // 列表头table
          that.Value = CommonFunction.HtmlDecode(data.Value);
        // 开始渲染echarts
        that.BuildTable.apply(that);
      },
      false,
      (data) => {
      },
      that
    );
  },
  BuildTable() {
    const that = this;
    const $div = $("<div class='simpleoard-truedata'>");
    const $positiondiv1 = $('<div>');
    const $Text = $(`<p class='myReportWidgetSimpleBoardText' >${this.Text}</p>`);
    const $Value = $(`<p class='myReportWidgetSimpleBoardValue'  style='color:${this.allColor}'>${this.Value}</p>`);
    const $td = this.$Container.find(`tr:eq(${this.WidgetSimpleBoard.RowIndex})`).children(`td:eq(${this.WidgetSimpleBoard.ColumnIndex})`);
    $div.append($positiondiv1.append($Value).append($Text));
    $td.find('.simpleoard-loadingdata').hide();
    $td.append($div);
    $td.unbind('click').bind('click', () => {
      if (that.$scope && that.$scope.Road && that.WidgetSimpleBoard &&
        that.WidgetSimpleBoard.LinkageReports &&
        that.WidgetSimpleBoard.LinkageReports.length === 1) {
        that.$scope.Road.push(that.$scope.currentWidget.ObjectId);
        for (let i = 0; i < that.$scope.reportView.ReportPage.ReportWidgets.length; i += 1) {
          const item = that.$scope.reportView.ReportPage.ReportWidgets[i];
          if (item.ObjectId === that.WidgetSimpleBoard.LinkageReports[0]) {
            that.$scope.currentWidgetIndex = i;
            that.$scope.currentWidget = item;
            that.$scope.currentWidgetName = item.DisplayName;
            break;
          }
        }
        if (that.$scope && that.$scope.reportView.ReportPage.ReportWidgets.length > 1) {
          that.$scope.showNavButton = true;
          if (that.$scope.currentWidgetIndex ===
            that.$scope.reportView.ReportPage.ReportWidgets.length - 1) {
            that.$scope.hasPrevious = true;
            that.$scope.hasNext = false;
          } else if (that.$scope.currentWidgetIndex === 0) {
            that.$scope.hasNext = true;
            that.$scope.hasPrevious = false;
          } else {
            that.$scope.hasPrevious = true;
            that.$scope.hasNext = true;
          }
        } else {
          that.$scope.showNavButton = false;
          that.$scope.hasNext = false;
        }
        that.$scope.buttonchange();

        that.$scope.reportView.GetReport(
          H3PluginDeveloper.IClone(that.$scope.filterValues),
          that.$scope.currentWidget, null, true, null, that.$scope, null,
          that.$scope.Colors[that.$scope.currentWidgetIndex % 6],
        );
      }
    });
  },
  ReLoad(filterData, UnitFilterDataJson) {
    this.FilterData = filterData;
    this.UnitFilterDataJson = UnitFilterDataJson;
    this.Init();
  },
};

//* **********************   华丽分割线   *****************************
//* **********************   华丽分割线   *****************************
// 简易看板
const SimpleBoardManager = function bb(
  reportPage, widget, filterData, ReportViewManager,
  mobilehomereport, $scope, UnitFilterDataJson,
) {
  this.ReportViewManager = ReportViewManager;
  this.ReportPage = reportPage;
  this.Widget = widget;
  this.FilterData = filterData;
  // 报表容器
  this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
  this.SourceColumns = null;
  this.SimpleBoardChildManagers = [];
  // this.allColor = color;
  this.allColor = '#1890FF';
  // 定义过滤器
  this.SourceData = null;
  this.$scope = $scope;
  this.UnitFilterDataJson = UnitFilterDataJson;
  this.mobilehomereport = mobilehomereport;
  this.Init();
};
SimpleBoardManager.prototype = {
  Init() {
    this.$Container = this.ReportViewManager.$WidgetContainer.find(`#${this.Widget.ObjectId}`);
    this.$Container.html('');
    // const num = Math.floor(Math.random(0, 6) * 6);
    this.CreateLayout();
    // if (this.ReportViewManager.mobileCallback) {
    //   this.ReportViewManager.mobileCallback(false, 5);
    // }
    for (let i = 0;
      this.Widget.ReportWidgetSimpleBoard !== null &&
      i < this.Widget.ReportWidgetSimpleBoard.length; i += 1) {
      const ReportWidgetSimpleBoard = this.Widget.ReportWidgetSimpleBoard[i];
      if (!ReportWidgetSimpleBoard.ReportSourceId) continue;
      this.SimpleBoardChildManagers[ReportWidgetSimpleBoard.ObjectId] =
        new SimpleBoardChildManager(
          this.ReportPage, this.Widget, this.FilterData, ReportWidgetSimpleBoard,
          this.allColor, this.ReportViewManager, this.mobilehomereport, this.$scope,
          this.UnitFilterDataJson,
        );
    }
  },
  CreateLayout() {
    const RowNum = this.Widget.SimpleBoardRowNumber - 0;
    const ColumnNum = this.Widget.SimpleBoardColumnNumber - 0;
    const $table = $('<table >');
    $table.addClass('Mytable_SimpleBoard');
    $table.attr('id', `${this.Widget.ObjectId}_table`);
    const $tablebody = $('<tbody>');
    $table.append($tablebody);
    for (let i = 0; i < RowNum; i += 1) {
      const heigth = `${100 / RowNum}%`;
      const $tr = $(`<tr heigth="${heigth}">`);
      $table.append($tr);
      for (let j = 0; j < ColumnNum; j += 1) {
        const width = `${100 / ColumnNum}%`;
        const $td = $(`<td width="${width}">`);

        $td.css('padding-bottom', '0.43rem');

        // var $divimg = $("<div style='float:left;' class='myimg'>");
        // var $positiondiv = $("<div style=''>")
        // var $img = $("<i class='icon-Personnel_015_o' style='height: 40px;width: 40px;
        // display: block;line-height: 40px;text-align: center;font-size: 22px;
        // background-color: " + this.allColor + ";border-radius: 20px;color:#fff;'>");
        // $divimg.append($positiondiv.append($img));
        const $div = $("<div class='simpleoard-loadingdata'><span>--</span></div>");
        // $td.append($divimg).append($div);
        $td.append($div);
        $tr.append($td);
      }
    }
    this.$Container.append($table);
  },
  ReLoad(filterData, UnitFilterDataJson) {
    this.FilterData = filterData;
    this.UnitFilterDataJson = UnitFilterDataJson;
    this.Init();
  },
  FullScreenTrigger() {
    this.$Container.find('.dataTables_scrollBody').css('max-height', `${this.$Container.css('height').replace('px', '') - 78}px`);
  },
};

// ***************   华丽分割线   **************
// ***************   华丽分割线   **************

// 报表展示
window.ReportViewManager = function bb($filterContainer, $widgetContainer, reportCode, applist) {
  const that = this;
  // 报表配置
  this.ReportPage = null;
  // 与后台交互的事件
  this.LoadReportPage = 'LoadReportPage';
  // 编码
  this.Code = reportCode;
  // 过滤器容器
  this.$FilterContainer = $filterContainer;
  // 报表容器
  this.$WidgetContainer = $($widgetContainer);
  // 过滤器
  this.FilterManager = null;
  // bool
  this.boolDic = null;
  // 当前用户信息
  this.CurrentUser = null;
  // 是移动端应用首页
  this.applist = applist;
  // 显示名称
  this.DisplayName = '';
  // 报表管理器集合
  this.ReportManagers = {};
  if (this.applist) {
    that.FilterManager = new FilterManager(null, null, that.CurrentUser, this.boolDic, () => {
      that.ReLoadAllReport.apply(that);
    });
    return;
  }
  this.Init();
};
window.ReportViewManager.prototype = {
  Init() {
    const that = this;
    CommonFunction.Post(
      CommonFunction.LoadReportPage, { Code: this.Code },
      (data) => {
        if (that.ValidateReportPage.apply()) {
          // 过滤器构造，把过滤器改变时，触发的事件传过去，也是OnChange的回调函数
          that.FilterManager = new FilterManager(
            that.$FilterContainer,
            data.ReportPage.Filters,
            that.CurrentUser,
            that.boolDic,
            (() => {
              that.ReLoadAllReport.apply(that);
            }),
          );
        }
        that.ReportPage = data.ReportPage;
        that.CurrentUser = data.CurrentUser;
        that.DisplayName = data.DisplayName;
        that.boolDic = data.boolDic;
        // 校验
      }, false,
      () => {
        that.$WidgetContainer.html('报表不存在!');
      },
    );
  },
  // 校验
  ValidateReportPage() {
    return true;
  },
  // 创建报表
  CreateReport(widget, mobilehomereport, $scope, UnitFilterDataJson, color) {
    // const reportId = widget.ObjectId;
    // const reportManager = null;
    let filterData = null;
    if (this.FilterManager) {
      filterData = this.FilterManager.GetValue();
    }
    if (!this.ReportManagers[widget.ObjectId]) {
      switch (widget.WidgetType) {
        case DefaultOptions.WidgetType.Detail:
          // 明细表
          this.ReportManagers[widget.ObjectId] =
            new GridViewManager(
              this.ReportPage, widget,
              filterData, this, mobilehomereport, $scope, UnitFilterDataJson,
            );
          break;
        case DefaultOptions.WidgetType.Combined:
          // 汇总表
          this.ReportManagers[widget.ObjectId] =
            new ChartTableManager(
              this.ReportPage, widget,
              filterData, this, mobilehomereport, $scope, UnitFilterDataJson,
            );
          break;
        case DefaultOptions.WidgetType.SimpleBoard:
          this.ReportManagers[widget.ObjectId] =
            new SimpleBoardManager(
              this.ReportPage, widget,
              filterData, this, mobilehomereport, $scope, UnitFilterDataJson, color,
            );
          break;
        default:
          // 图表
          this.ReportManagers[widget.ObjectId] =
            new ChartManager(
              this.ReportPage, widget,
              filterData, this, mobilehomereport, $scope, UnitFilterDataJson,
            );
          break;
      }
    }
  },
  // 获取单个报表数据，移动端可调用
  GetReport(
    filterValue, widget, reportPage, notapplist,
    mobilehomereport, $scope, UnitFilterDataJson, color, mobileCallback,
  ) {
    const filterValues = filterValue;
    this.mobileCallback = mobileCallback;
    if (reportPage) {
      this.ReportPage = reportPage;
    }
    if (this.FilterManager) {
      this.FilterManager.SetValue(filterValues);
    }
    if (!widget) {
      return;
    }
    if (this.boolDic && !$.isEmptyObject(this.boolDic)) {
      for (const key in this.boolDic) {
        if (filterValues && filterValues[key] && filterValues[key].length > 0) {
          if (filterValues[key][0] === '是;' || filterValues[key][0] === '是') {
            filterValues[key][0] = '1;';
          } else if (filterValues[key][0] === '否;' || filterValues[key][0] === '否') {
            filterValues[key][0] = '0;';
          } else if (filterValues[key] === '是;否;' || filterValues[key] === '是;否') {
            filterValues[key][0] = '1;0;';
          }
        }
      }
    }
    if (this.$WidgetContainer.find(`#${widget.ObjectId}`).length > 0) {
      this.$WidgetContainer.find(`#${widget.ObjectId}`).remove();
    }
    const $widgetDiv = $('<div>').attr('id', widget.ObjectId).css('height', '100%');
    if (notapplist) {
      this.$WidgetContainer.html('').append($widgetDiv);
    } else {
      this.$WidgetContainer.append($widgetDiv);
    }
    if (this.ReportManagers[widget.ObjectId] != null) {
      this.ReportManagers[widget.ObjectId].ReLoad(filterValues, UnitFilterDataJson);
    } else {
      this.CreateReport(widget, mobilehomereport, $scope, UnitFilterDataJson, color);
    }
  },
  // 刷新接口
  ReLoadAllReport() {
    const filterData = this.FilterManager.GetValue();
    for (const code in this.ReportManagers) {
      if (this.ReportManagers[code]) {
        this.ReportManagers[code].ReLoad(filterData);
      }
    }
  },
};
