<template>
  <!--  :class='{"animated pulse":errorBol}' -->
  <div id="form-drop-down-list" v-show="isVisible" @click="popUp">
    <div class="popup-content" v-if="formVal.selectshowmode!=1" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
      <div class="left">
        <p class="dp-font30">{{formVal.DisplayName}}
          <span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
          <i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
        </p>
      </div>
      <div class="right">
        <!-- <input class="dp-font30" :class="[errorBol?'error':'']" type="text" :placeholder="placeholder" readonly @click="popUp" v-model="value" v-if='formVal.Editable'> -->
        <textarea class="dp-font30" type="text" rows="1" :placeholder="placeholder" readonly :value="showValue" v-if='formVal.Editable'></textarea>
        <div class="read-only-div dp-font30" v-if='!formVal.Editable&&value'>{{showValue}}</div>
        <div v-transfer-dom v-show="isPopUp">
          <transition enter-class="popUpStart" leave-class="popUpStart" enter-active-class="animated slideInUp popUpAnimation" leave-active-class="animated slideOutDown popUpAnimation">
            <div class="popup-wrap" v-show="isPopUp">
              <div class="btn-wrap btn-wrap-bar bd-bot">
                <div class="cancel-btn dp-font32" @click="cancel">取消</div>
                <div class="operate-btn">
                  <span class="dp-font32" @click="clear">清空</span>
                  <span class="confirm-btn dp-font32" @click='confirm'>确定</span>
                </div>
              </div>
              <!-- <div class="scroll-wrapper" ref="scrollWraper"> -->
              <ul class="list-wrap">
                <li class="bd-bot" v-for="(item, index) in defaultitems" :key='index' @click="selectItem(item, index)">
                  <p class="dp-font32">{{item.Text}}</p>
                  <span class="dp-font32" :class="[selectedIndex === index? 'icon-danxuanxuanzhe': '']"></span>
                </li>
                <li class="bd-bot hasMore" v-show="hasMore" @click="loadMore()">点击加载更多</li>
              </ul>
              <!-- </div> -->
            </div>
          </transition>
          <transition enter-class="popUpStart" leave-class="popUpStart" enter-active-class="animated fadeIn popUpAnimation" leave-active-class="animated fadeOut popUpAnimation">
            <div class="popup-frame" @click="popDown" v-show="isPopUp"></div>
          </transition>
        </div>
        <div class="icon icon-next2" @click="popUp" v-if="formVal.Editable"></div>
      </div>
    </div>
    <div class="tile-content" v-if="formVal.selectshowmode==1">
      <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
        <div class="left">
          <p class="dp-font30">{{formVal.DisplayName}}
            <span class="require" v-if="formVal.Required">*</span>
          </p>
        </div>
        <ul class="right" v-if='formVal.Editable'>
          <li :class="[selectedIndex === index?'active' : '']" v-for="(item, index) in defaultitems" :key='item.Text' @click="selectItem(item, index)">
            <p class="dp-font30">{{item.Text}}</p>
            <i class="dp-font30" :class="[selectedIndex === index? 'icon-danxuanxuanzhe': '']"></i>
          </li>
        </ul>
        <ul class="right" v-if='!formVal.Editable'>
          <li>
            <p class="dp-font30">{{showValue}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
    <!-- <div class="fix-content dp-font30" :class="[$store.state.corpId?'ding-top':'']" v-if='fixHeadBol'>{{formVal.DisplayName}}</div> -->
    <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
    <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
  </div>
</template>

<script>
import { TransferDomDirective as TransferDom, ViewBox } from 'vux';
import mixin from '../../../mixins/base-controler';
import { GetSchemaPropertyValues } from '../../../service/get-data';
import preventBodyScrollMixin from '../../../mixins/prevent-body-scroll';

export default {
  name: 'FormdropdownList',
  components: {
    ViewBox,
  },
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      defaultitems: [],
      selectedIndex: '',
      isPopUp: false,
      selectedItem: '',
      placeholder: '请选择',
      flag: true,
      FilterFields: [],
      SearchKey: '',
      FromRowNum: 0,
      ToRowNum: 20,
      filterRule: '',
      scopeType: 4,
      isInGrid: false,
      gridDataField: '',
      errorBol: false,
      fixHeadBol: false,
      initialHeight: 0,
      isQuestionShowBol: false,
      isSetValueBol: false,
      value: '',
      hasMore: false,
      sheetData: {},
      isVisible: true,
      showValue: '',
    };
  },
  directives: {
    TransferDom,
  },
  // baseControler的方法混入
  mixins: [mixin, preventBodyScrollMixin],
  created() {
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    // window.math = math;
    this.initDefaultItems();
    this.initPlaceholder();
  },
  mounted() {
    //  this.ControlFixHead();
    this.InitValue(this.formVal.Value);
    this.FormatSelect(this.formVal.Value);
    this.$nextTick(() => {
      $(this.$el)
        .find('textarea')
        .each(function a() {
          this.setAttribute('style', `height:${this.scrollHeight}px;overflow-y:hidden;`);
        })
        .on('input', function b() {
          this.style.height = 'auto';
          this.style.height = `${this.scrollHeight}px`;
        });
    });
  },
  methods: {
    loadMore() {
      this.FromRowNum += 20;
      this.ToRowNum += 20;
      this.getDropdownDefaultItems();
    },
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          this.placeholder = `请选择${this.formVal.DisplayName.trim()}(必填)`;
          this.requiredVal = '*';
        } else {
          this.placeholder = `请选择${this.formVal.DisplayName.trim()}`;
        }
      } else {
        this.placeholder = '';
      }
    },
    async getDropdownDefaultItems() {
      const that = this;
      const data = await GetSchemaPropertyValues(
        this.formVal.boschemacode,
        this.SearchKey,
        this.formVal.mappingfield,
        this.FromRowNum,
        this.ToRowNum,
        this.filterRule,
        this.scopeType,
        this.$store.state.formData.responseContext.SchemaCode,
        this.sheetData,
      );
      if (data.Successful) {
        const newData = data.ReturnData.list;
        that.hasMore = newData.length >= 20;
        for (const val of newData) {
          const tempVal = val || '--';
          const valObj = { Value: tempVal, Text: tempVal };
          that.defaultitems.push(valObj);
        }
        that.isPopUp = true;
        that.$store.state.CotrolPopBol = true;
      } else {
        that.isPopUp = true;
        that.$store.state.CotrolPopBol = true;
        that.hasMore = false;
      }
    },
    initDefaultItems() {
      if (
        this.formVal.datadictitemname != null &&
        this.formVal.DataDictItemValue != null &&
        this.formVal.DataDictItemValue
      ) {
        this.defaultitems = this.formVal.DataDictItemValue;
      } else if (this.formVal.boschemacode && this.formVal.mappingfield) {
        this.LoadAssciationFilter();
      } else {
        this.defaultitems = this.formVal.defaultitems;
        if (this.defaultitems !== '' && this.defaultitems) {
          this.defaultitems = eval(this.defaultitems);
        }
      }
      const tmp = [];
      for (let i = 0; i < this.defaultitems.length; i += 1) {
        if (!this.defaultitems[i].Value) {
          const val = this.defaultitems[i];
          tmp.push({
            Value: val,
            Text: val,
          });
        } else {
          tmp.push(this.defaultitems[i]);
        }
      }
      this.defaultitems = tmp;
    },
    // 获取关联数据
    LoadAssciationFilter() {
      const that = this;
      const rule = that.formVal.associationfilter
        ? JSON.parse(that.formVal.associationfilter)
        : that.formVal.associationfilter;

      if (that.formVal.associationfilter && rule.Rule) {
        this.filterRule = rule.Rule;
        let startIndex = 0;
        while (true) {
          const index2 = this.filterRule.indexOf('{', startIndex + 1);
          const index3 = this.filterRule.indexOf('}', startIndex + 1);
          if (index3 < index2 || index2 < 0) {
            const field = this.filterRule.substring(startIndex + 1, index3);
            if (field.indexOf('.') < 0) {
              if (that.$store.state.formData.data[field]) {
                that.FilterFields.push(field);
              }
            } else {
              const childField = field.split('.')[0];
              if (that.$store.state.formData.data[childField]) {
                that.FilterFields.push(field);
              }
            }
          }
          startIndex = this.filterRule.indexOf('{', index3);
          // 已经到结束位置或找不到 {
          if (startIndex >= this.filterRule.length || startIndex < 0) {
            break;
          }
        }
      }
    },
    GetValue() {
      return this.value ? this.value : '';
    },
    SetValue(val) {
      this.isSetValueBol = true;
      if (val && val.constructor === Object) {
        this.value = val.Value;
        this.formVal.Value = val.Value;
        this.showValue = val.Text;
      } else {
        this.value = val;
        this.formVal.Value = val;
        this.showValue = val;
      }
      if (!val) {
        this.selectedIndex = '';
      }
      this.$nextTick(function d() {
        $(this.$el)
          .find('textarea')
          .each(function c() {
            this.style.height = 'auto';
            this.style.height = `${this.scrollHeight}px`;
          });
      });
      this.OnChange();
    },
    InitValue(val) {
      this.isSetValueBol = true;
      this.value = val;
      this.formVal.Value = val;
      this.showValue = val;
    },
    FormatSelect(val) {
      if (val) {
        if (
          this.formVal.datadictitemname != null &&
          this.formVal.DataDictItemValue != null &&
          this.formVal.DataDictItemValue
        ) {
          this.selectedIndex = this.formVal.DataDictItemValue.indexOf(val);
        } else {
          this.selectedIndex = eval(this.formVal.defaultitems).indexOf(val);
        }
      }
    },
    Validate() {
      const self = this;
      if (this.formVal.Editable && this.formVal.Required) {
        if (this.value) {
          return true;
        }
        this.errorBol = true;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      return true;
    },
    // 添加选项
    AddItem(value, text) {
      if ((text || value) && this.formVal.Editable) {
        let txt = '';
        if (text) {
          txt = text;
        } else {
          txt = value;
        }
        this.defaultitems.push({
          Value: value,
          Text: txt,
        });
      }
    },
    // 清除选项
    ClearItems() {
      this.defaultitems = []; // 清空
    },
    // 选中某项
    selectItem(item, index) {
      this.selectedIndex = index;
      this.SetValue(item);
    },
    hidePopup() {
      this.isPopUp = false;
      setTimeout(() => {
        // 先让popup消失，然后再回到初始位置
        $('.form-child-wrapper').css('top', 0);
        $('.form-child-wrapper').removeClass('no-transform');
        $('.add-wrapper').removeClass('no-transform');
        $('.edit-wrapper').removeClass('no-transform');
      }, 500);
    },
    confirm() {
      this.$store.state.isHtmlChangedBol = true;
      this.$store.state.CotrolPopBol = false;
      // this.hidePopup();
      this.isPopUp = false;
      this.removeModalClassName();
    },
    clear() {
      // this.value = "";
      // this.selectedIndex = "";
      this.SetValue('');
      // this.isPopUp = false;
      // this.hidePopup();
      this.removeModalClassName();
    },
    cancel() {
      this.removeModalClassName();
      this.$store.state.CotrolPopBol = false;
      this.isPopUp = false;
      // this.hidePopup();
    },
    popDown(e) {
      if (e.target.className === 'popup-frame') {
        // this.hidePopup();
        this.removeModalClassName();
        this.$store.state.CotrolPopBol = false;
      }
      // this.scroll.destroy();
      // this.scroll = null;
    },
    popUp() {
      if (!this.formVal.Editable) return;
      if (this.formVal.boschemacode && this.formVal.mappingfield) {
        this.hasMore = this.formVal.boschemacode; // 如果数据源是关联表单则默认有更多数据
        this.defaultitems.splice(0, this.defaultitems.length);
        this.sheetData = {};
        if (this.FilterFields.length > 0) {
          for (const val of this.FilterFields) {
            if (val.indexOf('.') < 0) {
              if (typeof this.sheetData === 'string') {
                this.sheetData = JSON.parse(this.sheetData);
              }
              const data = this.$store.state.formData.data[val];
              if (data && (data.controlkey === 'FormUser' || data.controlkey === 'FormMultiUser' ||
              val === 'CreatedBy' || val === 'OwnerDeptId')) {
                if (data.Value) {
                  if (data.Value.constructor === Array) {
                    const tmp = [];
                    for (const value of data.Value) {
                      if (typeof value === 'string') {
                        tmp.push(value);
                      } else {
                        tmp.push(value.UnitId || value.UnitID);
                      }
                    }
                    this.sheetData[val] = tmp;
                  } else {
                    this.sheetData[val] = data.Value;
                  }
                } else {
                  this.sheetData[val] = '';
                }
              } else {
                this.sheetData[val] = this.$store.state.formData.data[val].Value || '';
              }
            } else {
              const childField = val.split('.')[0];
              const gridVal = this.$store.state.formData.data[childField].Value.L;
              for (const obj of gridVal) {
                for (const key in obj) {
                  if (key === this.ObjectId) {
                    if (typeof this.sheetData === 'string') {
                      this.sheetData = JSON.parse(this.sheetData);
                    }
                    const data = obj[key][val];
                    if (data && (data.controlkey === 'FormUser' || data.controlkey === 'FormMultiUser')) {
                      if (data.Value) {
                        if (data.Value.constructor === Array) {
                          const tmp = [];
                          for (const value of data.Value) {
                            if (typeof value === 'string') {
                              tmp.push(value);
                            } else {
                              tmp.push(value.UnitId);
                            }
                          }
                          this.sheetData[val] = tmp;
                        } else {
                          this.sheetData[val] = data.Value;
                        }
                      } else {
                        this.sheetData[val] = '';
                      }
                    } else {
                      this.sheetData[val] = obj[key][val].Value || '';
                    }
                  }
                }
              }
            }
          }
        }
        this.sheetData = JSON.stringify(this.sheetData);
        this.FromRowNum = 0;
        this.ToRowNum = 20;
        this.getDropdownDefaultItems();
      } else {
        this.isPopUp = true;
        this.$store.state.CotrolPopBol = true;
      }
      this.addModalClassName();
      $('.popup-frame,.btn-wrap-bar').on('touchmove', (e) => {
        e.preventDefault();
      });
    },
    // 返回数据值
    SaveDataField() {
      const result = {};
      result[this.formVal.dataField] = this.GetValue();
      return result;
    },
    getMatrixValue() {
      const val = {};
      val.showVal = this.GetValue();
      val.submitVal = this.GetValue();
      return val;
    },
    // hideQuestion() {
    //   this.isQuestionShowBol = !this.isQuestionShowBol;
    // },
  },
  computed: {},
  watch: {
    value() {
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
    },
    '$store.state.CotrolPopBol': function g(val) {
      if (!val) {
        this.hidePopup();
      }
    },
  },
};
</script>

<style lang="less">
@import '../../../assets/css/form-base.less';
#form-drop-down-list {
  .popupLayout;
  .popup-content {
    .right {
      .read-only-div {
        .px2rem(max-width, 428);
        .px2rem(padding-top, 16);
      }
    }
  }
}

.hasMore {
  text-align: center;
  color: #ddd;
}
</style>