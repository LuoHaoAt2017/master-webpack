<template>
<!--  :class='{"animated pulse":errorBol}' -->
    <div id="form-radio-button-list" v-show="isVisible" @click="popUp">
        <div class="popup-content" v-if="formVal.selectshowmode!=1" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
            <div class="left">
                <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                </p>
            </div>
            <div class="right">
                <!-- <input class="dp-font30" :class="[errorBol?'error':'']" type="text" :placeholder="placeholder" readonly @click="popUp" v-model="value" v-if='formVal.Editable'> -->
                <textarea class="dp-font30" :class="[errorBol?'error':'']" rows="1" type="text" :placeholder="placeholder" readonly :value="value" v-if='formVal.Editable'></textarea>
                <div class="read-only-div dp-font30" v-if='!formVal.Editable&&value'>{{value}}</div>
                <div v-transfer-dom  v-show="isPopUp">
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
                    <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                    </p>
                </div>
                <ul class="right" v-if='formVal.Editable'>
                    <li :class="[selectedIndex === index?'active' : '']" v-for="(item, index) in defaultitems" :key='item.Text' @click="selectItem(item, index)">
                        <p class="dp-font30">{{item.Text}}</p>
                        <i class="dp-font30" :class="[selectedIndex === index? 'icon-danxuanxuanzhe': '']"></i>
                    </li>
                </ul>
                <ul class="right" v-if='!formVal.Editable'>
                    <li :class="[selectedIndex === index?'active' : '']" v-for="(item, index) in selectedItem" :key='item.Text' @click="selectItem(item, index)">
                        <p class="dp-font30">{{item.Text}}</p>
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
import { TransferDomDirective as TransferDom } from 'vux';
import mixin from '../../../mixins/base-controler';
import preventBodyScrollMixin from '../../../mixins/prevent-body-scroll';

export default {
  name: 'FormRadioButtonList',
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      defaultitems: [],
      selectedIndex: '',
      isPopUp: false,
      selectedItem: [],
      placeholder: '请选择',
      isInGrid: false,
      gridDataField: '',
      errorBol: false,
      fixHeadBol: false,
      initialHeight: 0,
      isQuestionShowBol: false,
      scroll: null,
      isSetValueBol: false,
      value: '',
      initValueFlag: false,
      isVisible: true,
    };
  },
  // baseControler的方法混入
  mixins: [mixin, preventBodyScrollMixin],
  directives: {
    TransferDom,
  },
  created() {
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    this.getDefaultItems();
    this.getFirstSelectedItem();
    this.initPlaceholder();
  },
  mounted() {
    // this.ControlFixHead();
    this.$nextTick(() => {
      this.InitValue(this.formVal.Value);
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
    GetValue() {
      return this.value ? this.value : '';
    },
    SetValue(val) {
      this.isSetValueBol = true;
      this.value = val;
      this.formVal.Value = val;
      if (!val) {
        this.selectedIndex = '';
      }
      this.FormatSelectedItems(val);
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

      this.FormatSelectedItems(val);
    },
    FormatSelectedItems(val) {
      if (val) {
        this.selectedItem.push({
          Value: val,
          Text: val,
        });
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
    // 第一次进入表单获取默认列表
    getDefaultItems() {
      if (
        this.formVal.datadictitemname != null &&
        this.formVal.DataDictItemValue != null &&
        this.formVal.DataDictItemValue !== undefined
      ) {
        this.defaultitems = this.formVal.DataDictItemValue;
      } else {
        this.defaultitems = this.formVal.defaultitems;
        if (this.defaultitems !== '' && this.defaultitems !== undefined) {
          this.defaultitems = eval(this.defaultitems);
        }
      }
      const tmp = [];
      for (let i = 0; i < this.defaultitems.length; i += 1) {
        if (!this.defaultitems[i].Value) {
          const val = this.defaultitems[i];
          tmp.push({ Value: val, Text: val });
        } else {
          tmp.push(this.defaultitems[i]);
        }
      }
      this.defaultitems = tmp;
    },
    // 第一次进入获取选中项
    getFirstSelectedItem() {
      const val = this.formVal.Value;
      if (val) {
        if (
          this.formVal.datadictitemname != null &&
          this.formVal.DataDictItemValue != null &&
          this.formVal.DataDictItemValue !== undefined
        ) {
          this.selectedIndex = this.formVal.DataDictItemValue.indexOf(val);
        } else {
          this.selectedIndex = eval(this.formVal.defaultitems).indexOf(val);
        }
      }
      this.flag = false;
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
        this.defaultitems.push({ Value: value, Text: txt });
      }
    },
    // 清除选项
    ClearItems() {
      this.defaultitems = []; // 清空
    },
    // 选中某项
    selectItem(item, index) {
      this.selectedIndex = index;
      // this.value = item.Text;
      this.SetValue(item.Text);
    },
    confirm() {
      this.$store.state.isHtmlChangedBol = true;
      this.$store.state.CotrolPopBol = false;
      this.isPopUp = false;
      // this.hidePopup();
      this.removeModalClassName();
    },
    clear() {
      this.SetValue('');
      this.removeModalClassName();
    },
    cancel() {
      this.isPopUp = false;
      this.$store.state.CotrolPopBol = false;
      // this.hidePopup();
      this.removeModalClassName();
    },
    popDown(e) {
      if (e.target.className === 'popup-frame') {
        this.isPopUp = false;
        // this.hidePopup();
        this.$store.state.CotrolPopBol = false;
        this.removeModalClassName();
      }
      // this.scroll.destroy();
      // this.scroll = null;
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
    popUp() {
      if (!this.formVal.Editable) return;
      this.isPopUp = true;
      this.$store.state.CotrolPopBol = true;
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
  watch: {
    value() {
      // this.$store.state.isHtmlChangedBol = true;
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
    },
    '$store.state.CotrolPopBol': function e(val) {
      if (!val) {
        this.isPopUp = false;
      }
    },
  },
};
</script>
<style lang="less">
@import '../../../assets/css/form-base.less';

#form-radio-button-list {
  .popupLayout;
  .popup-content {
    .right {
      .read-only-div {
        .px2rem(max-width,428);
        .px2rem(padding-top,16);
      }
    }
  }
}
</style>
