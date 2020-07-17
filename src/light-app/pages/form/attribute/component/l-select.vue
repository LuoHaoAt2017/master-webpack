<template>
  <div class="select-wrapper">
    <l-label
      title="选项"
      :required="false"
    >

      <div class="select__option-list">

        <div
          v-for="(item, index) in curList"
          :key="index"
        >
          <div class="option-item">
            <span
              class="icon-select-box fl-l"
              @click="doSelect(item, index)"
            >
              <i
                class="icon h3yun_All"
                :class="[selected.includes(item) ? 'single-selection-o selected': 'circle-o']"
              ></i>
            </span>
            <l-input
              class="option-item-input"
              :value="item"
              :maxLength="20"
              @input="handInput($event, index)"
              @blur="handleBlur($event, index)"
            >
            </l-input>
            <span
              class="icon-delete-box"
              @click="deleteSelect(index)"
            >
              <i class="icon h3yun_All delete-o"></i>
            </span>
            <span
              class="icon-up-box"
              @click="moveSelect(index)"
              v-if="index !== 0"
            >
              <i class="icon h3yun_All arrow-up-o"></i>
            </span>
          </div>
        </div>

      </div>
      <div
        class="select__option-add"
        @click="addSelect"
      >
        <span class="icon-add-box">
          <i class="icon h3yun_All plus-circle"></i>
        </span>
        <span class="label">添加选项</span>
      </div>
    </l-label>
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
import { LLabel, LInput, LDrag } from '@/light-app/components';
import { FormControlType } from '@/light-app/config/form-control-type';
@Component({
  name: 'LSelect',
  components: {
    LLabel,
    LInput,
    LDrag
  }
})
export default class LSelect extends Vue {
  @Prop()
  list!: [];
  @Prop()
  defaultValue!: [];
  @Prop({ default: 50 })
  maxNum?: number;
  @Prop()
  type?: number; // 控件类型
  placeholder: string = '请输入';
  curList: string[] = [];
  selected: string[] = [];
  dragOptions: any = {
    className: 'icon-up-box',
    dragBoxItem: 'option-item'
  };
  len: number = 0;

  created() {
    this.curList = [...this.list];
    this.getMaxLen();
    if (typeof this.defaultValue === 'string') {
      this.selected = (this.defaultValue as string).split(';');
    } else {
      this.selected = this.defaultValue || [];
    }
  }

  getMaxLen() {
    const reg = /^\u9009\u9879\d+$/;
    let maxLen = 0;
    this.curList.forEach(item => {
      if (reg.test(item)) {
        let arr = item.match(/\d+/g)[0];
        const len = Number(arr);
        if (maxLen < len) {
          maxLen = len;
        }
      }
    });
    this.len = maxLen;
  }

  addSelect() {
    if (this.curList.length > this.maxNum) {
      this.$h3.toast.show({ text: '最多支持50个选项值' });
    } else {
      this.len = this.len + 1;
      const data = '选项' + this.len;
      this.curList.push(data);
      this.getMaxLen();

      this.$emit('click', { curList: this.curList, status: 'add' });
    }
  }
  doSelect(data: string, index: number) {
    if (this.selected.includes(data)) {
      this.selected = this.selected.map(item => {
        if (item !== data) {
          return item;
        }
      });
    } else {
      // 下拉框单选
      if (this.type === FormControlType.FormDropDownList) {
        this.selected = [data];
      } else {
        // 复选框多选
        this.selected.push(data);
      }
    }
    this.$emit('change', this.selected);
  }

  deleteSelect(index) {
    if (this.curList.length === 1) {
      this.$h3.toast.show({ text: '最后一项，不允许删除' });
    } else {
      this.curList.splice(index, 1);
      this.getMaxLen();
      this.$emit('click', { curList: this.curList, status: 'delete' });
    }
  }

  moveSelect(index) {
    const pre = this.curList[index - 1];
    this.curList.splice(index - 1, 1, this.curList[index]);
    this.curList.splice(index, 1, pre);
    this.$emit('click', { curList: this.curList, status: 'move' });
  }

  handInput(value, index) {
    this.curList.splice(index, 1, value);
    this.$emit('click', { curList: this.curList, status: 'edit' });
  }
  handleBlur(e, index) {
    const value = e.target.value;
    const isRepeat = this.curList.some(
      (item, i) => item === value && i !== index
    );
    this.getMaxLen();
    if (isRepeat) {
      this.$h3.toast.show({ text: '该选项已存在' });
    }
  }
}
</script>
<style lang="less">
.select__option-list {
  .input-control-box {
    margin-bottom: 0 !important;
  }
}
</style>
<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.select {
  &-wrapper {
    .px2rem(padding-top, 20);
    .px2rem(padding-bottom, 36);
    .px2rem(padding-left, 30);
    // .px2rem(padding-right, 30);
  }
  &__option-list {
    position: relative;
    .option-item {
      display: flex;
      align-items: center;
      .px2rem(height, 112);
    }

    .icon-select-box {
      .px2rem(margin-right, 26);
      .icon {
        color: #ccc;
        .px2rem(font-size, 44);
      }
      .selected {
        color: #107fff;
      }
    }
    .icon-delete-box {
      .px2rem(padding, 18);
      .icon {
        color: #b4b7bc;
        .px2rem(font-size, 36);
      }
    }
    .icon-up-box {
      .px2rem(padding-right, 36);
      .px2rem(padding-left, 18);
      .px2rem(padding-top, 18);
      .px2rem(padding-bottom, 18);
      .icon {
        .px2rem(font-size, 32);
      }
      color: #b4b7bc;
    }
    .option-item-input {
      .px2rem(width, 478);
      .px2rem(font-size, 30);
      .px2rem(margin-right, 18);
      color: #333;
      box-sizing: border-box;
      .input-control-box {
        margin-bottom: 0 !important;
      }
    }
  }

  &__option-add {
    display: flex;
    align-items: center;
    color: #107ff0;
    .px2rem(max-width, 400);
    .px2rem(margin-top, 34);
    .icon-add-box {
      display: flex;
      align-items: center;
      color: #107ff0;
      .px2rem(margin-right, 25);
      .icon {
        .px2rem(font-size, 44);
      }
    }
    .label {
      display: flex;
      .px2rem(font-size, 30);
    }
  }
}
</style>
