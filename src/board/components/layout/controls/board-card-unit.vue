<script lang="ts">
import { FormControlType } from '../../../typings/const';
import { calcAvatarColor, getUserName } from '../../../utils/calc-icon-color';

export default {
  functional: true,
  props: {
    type: {
      type: Number,
      required: true,
    },
    value: {
      type: [Array, Object, String],
    },
  },
  render (h, { props }) {
    const cls = 'board-card__field-unit';
    const childrens: any = [];
    let items = props.value;
    if (items.constructor !== Array) {
      items = [items];
    }
    const isFormUser = [FormControlType.FormCreater, FormControlType.FormUser, FormControlType.FormMultiUser, FormControlType.FormOwner].indexOf(props.type) > -1;
    items.forEach(item => {
      if (!item) {
        return;
      }
      // 创建用户或部门的图标，用户为缩略图地址， 部门为图标
      const flag = isFormUser ? h('div', {}, item.Avatar ? [h('img', {
        attrs: { src: item.Avatar },
      }, [])] : [h('div', {
        style: { background: `${calcAvatarColor(item.Name)}` },
      }, [`${getUserName(item.Name || item)}`])]) : h('div', { class: ['board-card__field-unit-dept'] }, [h('span', { class: ['icon h3yun_All department-o'] }, [])]);
      childrens.push(h('div', { class: ['board-card__field-unit-item', isFormUser ? 'board-card__field-unit-user' : ''] }, [flag, h('span', [`${item.Name || item}`])]));
    });
    return h('div', { class: [cls] }, childrens);
  },
};
</script>

<style lang='less'>
@import '~@/styles/light-app.less';
.board-card__field-unit {
  display: flex;
  flex-wrap: wrap;
  &-item {
    display: flex;
    align-items: center;
    .px2rem(margin-right, 16);
    .px2rem(margin-bottom, 20);
    .px2rem(padding-left, 16);
    .px2rem(padding-right, 16);
    .px2rem(padding-top, 10);
    .px2rem(padding-bottom, 10);
    .px2rem(border-radius, 6);
    overflow: hidden;
    background: #eceff2;
    &:nth-child(3) {
      margin-right: 0;
    }
    >div {
      flex-shrink: 0;
      .px2rem(width, 44);
      .px2rem(height, 44);
      .px2rem(margin-right, 8);
      img,div {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      div{
        display: flex;
        align-items: center;
        justify-content: center;
        color:#333;
      }
      &.board-card__field-unit-dept {
        background: #107fff;
        border-radius: 50%;
        text-align: center;
        & > span {
          color: #fff;
        }
      }
    }
    span {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex-shrink: 0;
      color: #333;

    }
  }
}

</style>
