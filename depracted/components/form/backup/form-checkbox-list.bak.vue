<template>
<!--  :class='{"animated pulse":errorBol}' -->
    <div id="form-checkbox-list" v-show="isVisible" @click="popUp">
        <div class="popup-content" v-if="formVal.selectshowmode!=1" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
            <div class="left">
                <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                </p>
            </div>
            <!--  :class="{'value-height':value}" -->
            <div class="right">
                <input v-show='!value||(value&&!value.length)' class="dp-font30" type="text" :class="[errorBol?'error':'']" :placeholder="placeholder" readonly @click="popUp" v-model="value">
                <ul v-show='value&&value.length>0' class="selected-list">
                  <li class="dp-font24" v-for='(item,index) in value' :key="index" v-if="item">{{item}}</li>
                </ul>
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
                    <!-- <div class="select-all dp-font32" @click="isSelectAll">全选
                        <span class="dp-font32" :class="[selectAll?'icon-yixuanzhe':'icon-weixuanzhong']"></span>
                    </div> -->
                    <!-- <div class="scroll-wrapper"> -->
                    <ul class="list-wrap">
                        <div class="select-all dp-font32 bd-bot" @click="isSelectAll">全选
                          <span class="dp-font32" :class="[selectAll?'icon-yixuanzhe':'icon-weixuanzhong']"></span>
                        </div>
                        <li class="bd-bot" v-for="(item, index) in defaultitems" :key='index' @click="selectItem(item, index)">
                            <p class="dp-font32">{{item.Text}}</p>
                            <span class="dp-font32" :class="[selectedItem[index]&&selectedItem[index].Text==item.Text?'icon-yixuanzhe': 'icon-weixuanzhong']"></span>
                        </li>
                    </ul>
                    <!-- </div> -->
                </div>
                </transition>
                <!-- <transition enter-active-class="animated fadeIn popUpAnimation" leave-active-class="animated fadeOut popUpAnimation"> -->
                    <div class="popup-frame" @click="popDown" v-show="isPopUp"></div>
                <!-- </transition> -->
                </div>
                <div class="icon icon-next2" @click="popUp" v-if="formVal.Editable"></div>
            </div>
        </div>
        <div class="tile-content" v-if="formVal.selectshowmode==1">
            <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
                <div class="left">
                    <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required">*</span>
                    </p>
                </div>
                <ul class="right" v-if='formVal.Editable'>
                  <!-- [selectedItem[index].Text==item.Text?'active' : ''] -->
                  <li v-for="(item, index) in defaultitems" :key='item.Text' :class="isSelectedItem(item,index)" @click="selectItem(item, index)">
                      <p class="dp-font30">{{item.Text}}</p>
                      <i :class="isIconSelected(item,index)" @click.stop="selectItem(item, index)"></i>
                  </li>
                </ul>
                <!-- <ul class="right" v-if='!formVal.Editable'>
                  <li v-for="(item, index) in selectedItem" :key='item.Text' :class="[selectedItem[index]==item?'active' : '']">
                      <p class="dp-font30">{{item.Text}}</p>
                  </li>
                </ul> -->
                <ul v-if='!formVal.Editable' class="selected-list">
                  <li class="dp-font24" v-for='(item,index) in selectedItem' :key="index" v-if="item&&item.Text">{{item.Text}}</li>
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
import { setTimeout } from 'timers';
import mixin from '../../../mixins/base-controler';
import preventBodyScrollMixin from '../../../mixins/prevent-body-scroll';

export default {
  name: 'FormCheckboxList',
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      defaultitems: [],
      selectedIndex: [],
      isPopUp: false,
      selectedItem: [],
      selectAll: false,
      placeholder: '请选择',
      flag: true,
      isInGrid: false,
      gridDataField: '',
      errorBol: false,
      fixHeadBol: false,
      initialHeight: 0,
      isQuestionShowBol: false,
      scroll: null,
      isSetValueBol: false,
      value: [],
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
    this.initDefaultItems();
    // 初始化placeholder
    this.initPlaceholder();
  },
  mounted() {
    //  this.ControlFixHead();
    this.InitValue(this.formVal.Value);
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
    // 初始化默认选项
    initDefaultItems() {
      if (
        this.formVal.datadictitemname != null &&
        this.formVal.DataDictItemValue != null &&
        this.formVal.DataDictItemValue
      ) {
        this.defaultitems = this.formVal.DataDictItemValue;
      } else {
        this.defaultitems = this.formVal.defaultitems;
        if (this.defaultitems !== '' && this.defaultitems) {
          this.defaultitems = eval(this.defaultitems);
        }
      }
      const tmp = [];
      for (let i = 0; i < this.defaultitems.length; i += 1) {
        const val = this.defaultitems[i];
        if (!val.Value) {
          tmp.push({
            Value: val,
            Text: val,
          });
        } else {
          tmp.push(val);
        }
      }
      this.defaultitems = tmp;
    },
    GetValue() {
      if (this.value == null) this.value = '';
      if (this.value.constructor === Array) {
        return this.value.join(';');
      }
      return this.value;
    },
    SetValue(val) {
      this.isSetValueBol = true;
      if (!val) {
        this.value = [];
      } else if (Object.prototype.toString.call(val).indexOf('Array') > -1) {
        this.value = val;
      } else {
        this.value = val.split(';');
      }
      this.formVal.Value = val;
      if (!this.selectedItem.length) {
        this.FormatSelectedItems(this.value);
      }
      this.OnChange();
    },
    InitValue(val) {
      this.isSetValueBol = true;
      if (val) {
        this.value = val.split(';');
      }
      this.formVal.Value = val;
      if (!this.selectedItem.length) {
        this.FormatSelectedItems(this.value);
      }
    },
    FormatSelectedItems(val) {
      const vals = val;
      for (let j = 0; j < this.defaultitems.length; j += 1) {
        this.$set(this.selectedItem, j, '');
      }
      // vals = val;
      if (vals.length) {
        if (vals.length === this.defaultitems.length) {
          this.selectAll = true;
        } else {
          this.selectAll = false;
        }
        this.$nextTick(function a() {
          for (let i = 0; i < vals.length; i += 1) {
            for (let j = 0; j < this.defaultitems.length; j += 1) {
              if (vals[i] === this.defaultitems[j].Text) {
                this.$set(this.selectedItem, j, {
                  Value: vals[i],
                  Text: vals[i],
                });
              }
            }
          }
        });
      } else {
        this.selectAll = false;
      }
    },
    Validate() {
      const self = this;
      if (this.formVal.Editable && this.formVal.Required) {
        if (this.value && this.value.length) {
          return true;
        }
        this.errorBol = true;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      if (this.formVal.Editable) {
        // 校验勾选项总长度是否超过200，如果超过则不给保存
        let totalLength = 0;
        if (this.selectedItem && this.selectedItem.length > 0) {
          for (let i = 0; i < this.selectedItem.length; i += 1) {
            if (this.selectedItem[i]) {
              totalLength += this.selectedItem[i].length + 1;
            }
            if (totalLength > 200) {
              this.errorBol = true;
              setTimeout(() => {
                self.errorBol = false;
              }, 1000);
              return false;
            }
          }
        }
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
      const isItemIndexEmpty = !this.selectedItem[index];
      if (isItemIndexEmpty) {
        this.selectedItem[index] = item;
      } else {
        this.selectedItem[index] = '';
      }
      if (this.formVal.selectshowmode !== '1') {
        if (this.selectedItem.length === this.defaultitems.length) {
          for (const obj of this.selectedItem) {
            if (!obj) {
              this.selectAll = false;
              break;
            }
            this.selectAll = true;
          }
        } else {
          this.selectAll = false;
        }
      } else {
        const temp = [];
        for (const p of this.selectedItem) {
          if (p) {
            temp.push(p.Text);
          }
        }
        this.value = temp;
        this.formVal.Value = temp.join(';');
      }
      this.OnChange();
      this.$forceUpdate();
    },
    // 弹出层收起
    popDown(e) {
      if (e.target.className === 'popup-frame') {
        // this.hidePopup();
        this.isPopUp = false;
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
    // 弹出层滑出
    popUp() {
      if (!this.formVal.Editable) return;
      this.FormatSelectedItems(this.value);
      this.isPopUp = true;
      this.$store.state.CotrolPopBol = true;
      this.addModalClassName();
      $('.popup-frame,.btn-wrap-bar').on('touchmove', (e) => {
        e.preventDefault();
      });
    },
    // 取消选择
    cancel() {
      this.isPopUp = false;
      this.$store.state.CotrolPopBol = false;
      // this.hidePopup();
      this.removeModalClassName();
    },
    clear() {
      this.selectAll = false;
      this.selectedIndex = '';
      this.selectedItem = [];
      // this.isPopUp = false;
      // this.hidePopup();
      this.removeModalClassName();
    },
    // 确认选项
    confirm() {
      this.$store.state.isHtmlChangedBol = true;
      this.$store.state.CotrolPopBol = false;
      const temp = [];
      this.isPopUp = false;
      for (const p of this.selectedItem) {
        if (p) {
          temp.push(p.Text);
        }
      }
      // this.value = temp;
      this.SetValue(temp);
      // this.hidePopup();
      this.removeModalClassName();
    },
    // 是否全选
    isSelectAll() {
      this.selectAll = !this.selectAll;
      this.defaultitems.forEach((item, index) => {
        if (this.selectAll) {
          this.selectedItem[index] = item;
        } else {
          this.selectedItem[index] = '';
        }
      });
      // if (this.selectAll) {
      //   // this.selectedItem = this.defaultitems.slice(0);
      //   this.selectedItem = JSON.parse(JSON.stringify(this.defaultitems));
      // } else {
      //   this.selectedItem = [];
      // }
      // this.value = this.selectedItem;
    },
    // 返回数据值
    SaveDataField() {
      const result = {};
      // if (!this.formVal.Visible&&!this.formVal.Editable) return result;
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
    isSelectedItem(item, index) {
      // [selectedItem[index].Text==item.Text?'active' : '']
      if (this.selectedItem[index]) {
        return [this.selectedItem[index].Text === item.Text ? 'active' : ''];
      }
      return '';
    },
    isIconSelected(item, index) {
      // [selectedItem[index].Text==item.Text? 'icon-yixuanzhe': 'icon-weixuanzhong']
      if (this.selectedItem[index]) {
        return [this.selectedItem[index].Text === item.Text ? 'icon-yixuanzhe' : 'icon-weixuanzhong'];
      }
      return 'icon-weixuanzhong';
    },
  },
  watch: {
    value() {
      // this.$store.state.isHtmlChangedBol = true;
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
    },
    '$store.state.CotrolPopBol': function b(val) {
      if (!val) {
        this.isPopUp = false;
      }
    },
  },
};
</script>

<style lang="less">
@import '../../../assets/css/form-base.less';
#form-checkbox-list {
  .popupLayout;
  .popup-content {
    .value-height {
      // padding-bottom: .14rem;
      .px2rem(padding-bottom,14);
    }
    .right {
      .selected-list {
        font-size: 0;
        .px2rem(max-width,464);
        .px2rem(padding-top,16);
        li {
          color: @font-color-blue;
          .px2rem(padding-top,4);
          .px2rem(padding-bottom,4);
          .px2rem(padding-left,20);
          .px2rem(padding-right,20);
          border: 1px solid #108ee9;
          display: inline-block;
          .px2rem(border-radius,10);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .px2rem(margin-right,14);
          .px2rem(margin-bottom,14);
          max-width: 83%;
        }
      }
    }
  }
  .tile-content {
    .content {
      .selected-list {
        font-size: 0;
        .px2rem(max-width,464);
        .px2rem(padding-top,16);
        li {
          color: @font-color-blue;
          .px2rem(padding-top,4);
          .px2rem(padding-bottom,4);
          .px2rem(padding-left,20);
          .px2rem(padding-right,20);
          border: 1px solid #108ee9;
          display: inline-block;
          .px2rem(border-radius,10);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .px2rem(margin-right,14);
          .px2rem(margin-bottom,14);
          max-width: 83%;
        }
      }
    }
  }
}
</style>
