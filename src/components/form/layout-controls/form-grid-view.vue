<template>
  <div v-show="visible" class="form-grid">
    <ControlWrapper class="grid-header" :error="valid.empty || valid.custom">
      <div class="grid-header__inner" @click="foldGrid">
        <span
          v-if="value.length > 0"
          class="icon h3yun_All right-o"
          :class="[isGridShow ? 'arrow-reverse-animate' : 'arrow-animate']"
        ></span>
        <p class="dp-font34">
          {{ options.DisplayName.trim() }}
          <span v-if="options.Required && editable" class="require">*</span>
        </p>
      </div>
    </ControlWrapper>
    <transition name="gridList">
      <div v-show="isGridShow && !options.displayMode" class="normal-grid-list-wrap">
        <div
          :id="`form-grid-row_${rowId}`"
          v-for="(rowId,index) in value"
          :key="rowId"
          :ref="rowId"
          class="form-grid-view"
        >
          <ControlWrapper class="head" :error="rowValidEmptyMap[rowId]">
            <span class="dp-font30">{{ index + 1 }}</span>
            <ul class="head__button dp-font28">
              <li v-if="editable" class="button copy-row" @click.stop="copyRow(rowId, index)">
                <span class="icon h3yun_All copy-o"></span><span class="buttom__font">复制</span>
              </li>
              <li v-if="editable" class="button del-row" @click.stop="deleteRow(rowId, index)">
                <span class="icon h3yun_All delete-o"></span><span class="buttom__font">删除</span>
              </li>
              <li class="button fold-row" @click="foldRow(rowId)">
                <span
                  class="icon h3yun_All right-o"
                  :class="[rowFoldMap[rowId] ? 'arrow-animate' : 'arrow-reverse-animate']"
                ></span>
                <span v-if="rowFoldMap[rowId]" class="unfold">展开</span>
                <span v-else class="fold">收起</span>
              </li>
            </ul>
          </ControlWrapper>
          <transition name="gridList">
            <subtable-wrapper
              v-if="!rowFoldMap[rowId]"
              :bizObjectId="bizObjectId"
              :dataField="dataField"
              :rowId="rowId"
            />
          </transition>
        </div>
        <div v-show="editable" class="addGrid dp-font28" @click="addRow">
          <div class="addgrid-inner">
            <span class="h3yun_All plus-o dp-font28"></span>添加明细
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import baseControl from '../mixins/base-controler';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { FormGridViewOptions } from '@/lib/form-logic/types/control-options-map';
import SubtableWrapper from '@/components/form/shared/subtable-wrapper';
import ControlWrapper from '../shared/control-wrapper.vue';
import { goTargetSmooth } from '../../../config/common';

const FormVM = namespace('Form/ViewModel');

@Component({
  components: {
    SubtableWrapper,
    ControlWrapper,
  },
})
export default class FromGridView extends Mixins(baseControl) {
    isGridShow: boolean = true;

    rowFoldMap: {
      [rowId: string]: boolean;
    } = {};

    options!: FormGridViewOptions;

    @FormVM.Action(ViewModelAction.ADDROW) addLogicRow;

    @FormVM.Action(ViewModelAction.COPYROW) copyLogicRow;

    @FormVM.Action(ViewModelAction.DELETEROW) deleteLogicRow;

    // 勿删，用于判断组件为子表
    isFormGridView: boolean = true;

    get bizObjectId (): string {
      // console.log(this.namespace);
      // 子表 namespace 由 bizObjectId + '/' + 子表控件dataField 拼接而成
      const idx = this.dataField.length;
      const len = this.namespace.length;
      // const paths = this.namespace.split('/');
      return this.namespace.slice(0, len - idx - 1);
    }

    // 折叠整个子表
    foldGrid () {
      this.isGridShow = !this.isGridShow;
    }

    // 折叠子表明细
    foldRow (rowId) {
      this.$set(this.rowFoldMap, rowId, !this.rowFoldMap[rowId]);
    }

    scrollToTargetRow (targetRowId) {
      // console.log(this.$refs[targetRowId][0]);
      // this.$refs[targetRowId][0].scrollIntoView({
      //   behavior: "smooth",
      // });
      const target = this.$refs[targetRowId][0];
      if (target) {
        const scrollDom = document.getElementById('form-page');
        goTargetSmooth(target, scrollDom);
      }
    }

    addRow () {
      this.addLogicRow({ namespace: this.namespace });
      if (this.value.length > 0) {
        const targetRowId = this.value[this.value.length - 1];
        this.$nextTick(function () {
          this.scrollToTargetRow(targetRowId);
        });
      }
    }

    copyRow (rowId, index) {
      // 复制该子表明细
      this.copyLogicRow({
        namespace: this.namespace,
        objectId: rowId,
        index,
      });
      const targetRowId = this.value[index + 1];
      this.$nextTick(function () {
        this.scrollToTargetRow(targetRowId);
      });
    }

    deleteRow (rowId, index) {
      // 删除该子表明细
      this.deleteLogicRow({
        namespace: this.namespace,
        rowId,
      });
      const targetRowId = this.value[index - 1];
      targetRowId && this.scrollToTargetRow(targetRowId);
      if (!this.value.length) {
        this.$forceUpdate();
      }
    }

    hideErrorWrap () {
      this.clearValid();
    }

    get rowValidEmptyMap () {
      return this.control.rowValidEmptyMap || {};
    }

  // @Watch('value')
  // handler (val) {
  //   // 子表有必填项，删除后自动增加一行
  //   if (!val.length) {
  //     const context = this.$parent.form.$responseContext.ReturnData[this.dataField].Value;
  //     if (context.T && Object.values(context.T).length) {
  //       const hasRequire = Object.values(context.T).some((item:any) => item.Required);
  //       if (hasRequire) {
  //         setTimeout(() => {
  //           this.addRow();
  //         }, 500);
  //       }
  //     }
  //   }
  // }
}
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name, @px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.form-grid {
  background-color: white;
  .h3yun_All,.right-o {
    color: #999999;
    transition: all 0.5s;
    -moz-transition: all 0.5s;
    /* Firefox 4 */
    -webkit-transition: all 0.5s;
    /* Safari 和 Chrome */
    -o-transition: all 0.5s;
    /* Opera */
  }
  .grid-header {
    background-color: #f7f7f7;
  }
  .grid-header__inner {
    .px2rem(height, 80);
    display: flex;
    align-items: center;
    .px2rem(padding-top, 10);
    .px2rem(padding-left, 36);
    position: relative;
    p {
      color: #333333;
      font-weight: bold;
    }
    .arrow-animate {
      transform-origin: center;
      transform: rotate(0deg);
      .px2rem(margin-right, 16);
    }

    .arrow-reverse-animate {
      transform-origin: center;
      transform: rotate(90deg);
      .px2rem(margin-right, 16);
    }
  }
  .normal-grid-list-wrap {
    .form-grid-view {
      .head {
        .px2rem(height, 112);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .px2rem(padding-left, 36);
        position: relative;
        &:after {
          content: "";
          position: absolute;
          background-color: #eee;
          display: block;
          z-index: 1;
          top: auto;
          right: auto;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          -webkit-transform-origin: 50% 100%;
          transform-origin: 50% 100%;
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
        }
        .head__button {
          display: flex;
          justify-content: space-around;
          height: 100%;
          .button {
            color: #999999;
            .px2rem(padding-left, 30);
            font-size: inherit;
            display: flex;
            align-items: center;
            .icon {
              .px2rem(padding-right, 16);
            }
            span {
              display: inline-block;
              transition: all .3s;
              font-size: inherit;
            }
            .h3yun_All,.right-o {
              padding-right: 0;
            }
            .fold, .unfold {
              .px2rem(padding-left, 16);
              .px2rem(padding-right, 30);
            }
          }
          .buttom__font {
            .px2rem(padding-right, 30);
            border-right: 1px solid #d4d4d4;
          }
        }
      }
    }

    .arrow-animate {
      transform-origin: center;
      transform: rotate(0deg);
    }

    .arrow-reverse-animate {
      transform-origin: center;
      transform: rotate(90deg);
    }
  }
  .addGrid {
    text-align: center;
    color: #1890ff;
    height:45px;
    line-height:45px;
    .px2rem(padding-bottom, 20);
    background-color: #f7f7f7;
    // box-shadow: 0 1px 1px #fff;
    .addgrid-inner{
      width: 100%;
      height: 100%;
      background-color: #ffffff;
    }
    .plus-o {
      color: #1890ff;
      .px2rem(margin-right, 6);
    }
  }
  .add-wrapper,
  .edit-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    top: 0;
  }
  .gridList-enter-active, .gridList-leave-active {
    transition: opacity .3s
  }
  .gridList-enter, .gridList-leave-active {
    opacity: 0
  }
}
</style>
