<template>
  <div class="form-control-container">
    <l-drag
      @drag="handleDrag"
      @select="doSelected"
      :options="dragOption"
      ref="drag"
    >
      <transition-group
        name="list"
        v-bind:css="false"
        v-on:enter="animationEnter"
        v-on:leave="animationLeave"
        tag="div"
      >
        <div
          v-for="(item,index) in sheetControlList"
          :key="item.Key"
          class="form-control-item no-user-select"
          @click.stop="doSelected(item.Key)"
          :class="{'selected': selected === item.Key }"
        >
          <div
            class="form-control-item__input"
            :class="{'grid-view': formControlType.FormGridView === item.Type}"
          >
            <list :data="item"></list>
          </div>
          <div
            class="form-control-item__op-box no-user-select"
            v-show="selected === item.Key"
            :class="{'down-enter-active': selected === item.Key && animateSelected === item.Key}"
          >
            <ul class="op-list no-user-select">
              <li
                class="op-item no-user-select"
                :class="{ 'disable': item.Options.ComputationRule }"
                @click.stop="controlEdit(item)"
              >
                <div class="icon-box">
                  <i class="icon h3yun_All edit-o"></i>
                </div>
                <div class="icon-label no-user-select">编辑</div>
              </li>
              <li
                class="op-item no-user-select"
                :class="{ 'disable': index === 0 }"
                @click.stop="controlMove(item, 'up')"
              >
                <div class="icon-box">
                  <i class="icon h3yun_All arrow-up-o"></i>
                </div>
                <div class="icon-label no-user-select">上移</div>
              </li>
              <li
                class="op-item no-user-select"
                :class="{ 'disable': index === sheetControlList.length - 1 }"
                @click.capture="controlMove(item, 'down')"
              >
                <div class="icon-box">
                  <i class="icon h3yun_All arrow-down-o"></i>
                </div>
                <div class="icon-label no-user-select">下移</div>
              </li>
              <li
                class="op-item no-user-select"
                @click.stop="controlDelete(item, index)"
              >
                <div class="icon-box">
                  <i class="icon h3yun_All delete-o"></i>
                </div>
                <div class="icon-label no-user-select">删除</div>
              </li>
            </ul>
            <div
              class="add-box bd-top no-user-select"
              @click.stop="downAddControl(item)"
            >
              <span class="no-user-select">
                <i class="icon h3yun_All plus-o"></i>
              </span>
              <span class="no-user-select">添加字段</span>
            </div>
          </div>
        </div>
      </transition-group>
    </l-drag>
  </div>
</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { ControlFormatValue } from './control-format-value';
import { DragOptionsType } from '@/light-app/components/drag/types.d';
import { ControlStatus } from '@/light-app/config/const';
import { FormControlType } from '@/light-app/config/form-control-type';
import { LDrag } from '@/light-app/components';
import {
  LightAppActionType,
  LightAppMutationType
} from '@/light-app/store/types';
import List from './list.vue';
import cloneDeep from 'lodash/cloneDeep';
import Guide from '@/plugins/intro/guide';

const LightApp = namespace('LightApp');
@Component({
  name: 'FormControl',
  components: {
    LDrag,
    List
  }
})
export default class FormControl extends Vue {
  @Prop()
  subSheet!: boolean;
  @Prop()
  sheetControlList!: H3.LightApp.ControlType[];
  isFirstRouterToogle: boolean = false;
  dragOption: DragOptionsType = null;
  formControlType: any = null;
  animateSelected: string = ''; // 用于除点击外使其他操作动画效果不生效
  expandStatus: any = {}; // 正在展开或收起的字段
  editControl: H3.LightApp.ControlType = null;
  selected: string = '';
  $refs: {
    drag: any;
  };

  @LightApp.State('uniqueControl') uniqueControl;
  @LightApp.State('selectedControl') selectedControl;
  @LightApp.State('subSelectedControl') subSelectedControl;
  @LightApp.Mutation(LightAppMutationType.FormControlsDele) formControlsDele;
  @LightApp.Mutation(LightAppMutationType.MoveFormControls) moveFormControls;
  @LightApp.Mutation(LightAppMutationType.SelectedControl)
  updateSelectedControl;
  @LightApp.Mutation(LightAppMutationType.HandleUniqueControls)
  handleUniqueControls;
  @LightApp.Mutation(LightAppMutationType.UpdateColsNameList)
  updateColsNameList;
  @LightApp.Mutation(LightAppMutationType.UpdateControlCodeList)
  updateControlCodeList;
  
  @Mutation('excludeComp') excludeComp;

  @Watch('subSelectedControl')
  updateSubFormSele(newVal, oldVal) {
    if (this.subSheet) {
      this.selected = this.subSelectedControl;
    }
  }
  @Watch('selectedControl', { immediate: true })
  updateFormSele(newVal, oldVal) {
    if (!this.subSheet) {
      this.selected = this.selectedControl;
    }
  }
  @Watch('$route', { immediate: true })
  routeHandler(to, from) {
    if (from) {
      this.animateSelected = '';
      if (
        (from.name === 'lightFormSubSheetDesignPage' &&
          to.name === 'lightFormDesignPage') ||
        (from.name === 'lightFormDesignPage' &&
          to.name === 'lightFormSubSheetDesignPage')
      ) {
        this.isFirstRouterToogle = true;
        this.selected = this.subSheet
          ? this.subSelectedControl
          : this.selectedControl;
      } else {
        this.isFirstRouterToogle = false;
      }
    }
  }

  created() {
    this.dragOption = {
      className: 'form-control-item'
    };
    this.formControlType = Object.freeze(FormControlType);
  }

  mounted() {
    // Guide.setStep(5, {
    //   el: document.querySelector('.form-control-item__input'),
    //   content: '点击字段进行更多设置',
    //   zIndex: 100,
    //   placement: 'bottom',
    //   toolTipClass: 'form-control-guide',
    //   before: () => {
    //     // this.selected = this.sheetControlList[0].Key;
    //     return true;
    //   }
    // });
  }

  doSelected(code) {
    Guide.hide();
    if (this.selected === code) {return;}
    this.selected = code;
    this.animateSelected = code;
    this.updateSelectedControl({ code, subSheet: this.subSheet });
  }

  handleDrag({ source, target }) {
    this.moveFormControls({ source, target, subSheet: this.subSheet });
  }

  /**
   * 上移下移
   */
  controlMove(data, move) {
    const index = this.sheetControlList.findIndex(
      item => item.Key === data.Key
    );
    let nextIndex = -1;
    // 第一个元素无上移功能，最后一个元素无下移功能
    switch (move) {
      case 'up':
        if (index === 0) {
          return;
        } else {
          nextIndex = index - 1;
        }
        break;
      case 'down':
        if (index === this.sheetControlList.length - 1) {
          return;
        } else {
          nextIndex = index + 1;
        }
        break;
      default:
        break;
    }
    this.moveFormControls({
      source: index,
      target: nextIndex,
      subSheet: this.subSheet
    });
  }

  /**
   * 字段属性编辑
   */
  controlEdit(item) {
    if (item.Options.ComputationRule) {
      return;
    }
    const self = this;
    this.$emit('handleControlStatus', ControlStatus.Edit);
    this.editControl = item;
    if (item.Type === this.formControlType.FormGridView) {
      this.$router.push({
        name: 'lightFormSubSheetDesignPage',
        query: {
          key: item.Key, // 字段编号
          formStatus: ControlStatus.Edit,
          subSheet: 'true'
        }
      });
    } else {
      this.$router.push({
        name: 'lightControlAttributePage',
        query: {
          type: item.Type, // 字段类型
          key: item.Key, // 字段编号
          status: ControlStatus.Edit,
          subSheet: self.subSheet.toString()
        }
      });
    }
  }

  controlDelete(item, index) {
    if (item.Options.Referenced) {
      this.$h3.toast.show({ text: '该字段被规则引用，不允许删除' });
      return;
    }
    this.$h3.modal.show({
      content:
        '此字段添加的所有数据将会被彻底删除，且无法恢复，请确认你要执行此操作',
      type: 'alert',
      actions: [
        {
          text: '取消',
          onPress: () => this.cancelDelete(),
          style: { color: '#999', fontSize: '0.4533rem' }
        },
        {
          text: '删除',
          onPress: () => this.doDelete(item, index),
          style: { color: '#107FF0', fontSize: '0.4533rem' }
        }
      ],
      maskClosable: true
    });
    this.backStack.push(() => {
      this.$h3.modal.hide();
    });
  }

  doDelete(control, index) {
    this.backStack.pop();
    this.isFirstRouterToogle = false;
    // 更新已经存在的系统字段
    if (this.uniqueControl.includes(Number(control.Type))) {
      this.handleUniqueControls({
        status: 'delete',
        control: control.Type,
        subSheet: this.subSheet
      });
    }
    this.$h3.modal.hide();
    this.formControlsDele({
      subSheet: this.subSheet,
      Key: control.Key
    });
    this.updateColsNameList({
      index,
      subSheet: this.subSheet,
      status: 'delete'
    });
    this.updateControlCodeList({
      key: control.Key,
      status: 'delete'
    });
    this.updateSelectedControl({ code: '', subSheet: this.subSheet });
  }

  cancelDelete() {
    this.backStack.pop();
    this.$h3.modal.hide();
  }

  downAddControl(control) {
    this.$emit('downAddControl', control);
  }

  beforeRouteLeave(to, from, next) {
    this.excludeComp(['FormControl']);
    next();
  }

  animationEnter(el) {
    el.style.height = 'auto';
  }

  animationLeave(el, done) {
    if (this.isFirstRouterToogle) {
      el.style.height = 0;
      done();
    } else {
      let height = 5;
      let opacity = 1;
      let animation = () => {
        requestAnimationFrame(() => {
          if (height <= 0) {
            done();
          } else {
            el.style.height = `${height}rem`;
            el.style.opacity = opacity;
            height = height - 0.5;
            opacity = opacity - 0.1;
            animation();
          }
        });
      };
      animation();
    }
  }
}
</script>
<style lang="less">
// 针对明细表样式特殊处理
.grid-view {
  & > .app-label-container {
    & > .app-label-box {
      & > .app-label__title {
        padding-left: 0.2667rem !important;
      }
      & > div {
        & > .icon {
          padding-right: 0.2667rem !important;
        }
      }
    }
    & > .app-label__content {
      .grid-view-simple {
        padding-left: 0.2133rem !important;
        padding-right: 0.2133rem !important;
      }
    }
  }
}
</style>
<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.form-control-container {
  -webkit-touch-callout: none;
  -ms-touch-callout: none;
  -moz-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  .form-control-item {
    width: 100vw;
    background: #fff;
    box-sizing: border-box;
    &.selected {
      position: relative;
      border: 2px dashed @lightAppPrimaryColor;
      box-shadow: 0 0 16px rgba(0, 27, 86, 0.3);
    }
    &__input {
      padding: 0 0.48rem;
      .px2rem(padding-top, 20);
      &.grid-view {
        padding: 0.2667rem;
        padding-bottom: 0;
      }
    }
    &__op-box {
      .px2rem(height, 196);
      background: #f9fbff;
      .op-list {
        display: flex;
        flex-wrap: no-wrap;
        .px2rem(height, 108);
        justify-content: space-around;
        box-sizing: border-box;
      }
      .op-item {
        .px2rem(width, 110);
        text-align: center;
        color: #666;
        .icon-box {
          margin: auto;
          .px2rem(padding-top, 18);
          .icon {
            .px2rem(font-size, 44);
            color: #6c7482;
          }
        }
        .icon-label {
          .px2rem(font-size, 24);
          .px2rem(padding-bottom, 12);
          color: #666;
        }
      }
      .add-box {
        .px2rem(height, 88);
        .px2rem(line-height, 88);
        .px2rem(font-size, 30);
        color: #666;
        text-align: center;
        .icon {
          .px2rem(font-size, 36);
          .px2rem(margin-right, 16);
        }
      }
      .disable {
        .icon-label {
          color: #ccc;
        }
        .icon {
          color: #b4b7bc !important;
        }
      }
    }
  }
}

.down-enter-active {
  animation: down-in 0.2s linear;
}

@keyframes down-in {
  0% {
    height: 0;
  }
  100% {
    height: 2.61333rem;
  }
}

</style>
