<script>
import H3AvatarImg from './img';
import H3AvatarIcon from './icon';

const hashCode = (strKey, isLong) => {
  const MAX_VALUE = 0x7fffffff;
  const MIN_VALUE = -0x80000000;
  const intValue = (num) => {
    if (num > MAX_VALUE || num < MIN_VALUE) {
      return num & 0xFFFFFFFF; // eslint-disable-line no-bitwise
    }
    return num;
  };

  let hash = 0;
  if (typeof strKey === 'string') {
    for (let i = 0, l = strKey.length; i < l; i += 1) {
      hash = (hash * 31) + strKey.charCodeAt(i);
      if (!isLong) {
        hash = intValue(hash);
      }
    }
  }
  return hash;
};

export default {
  name: 'h3-avatar',
  props: {
    className: String,
    styleObj: Object,
    colors: {
      type: Array,
    },
    defaultColor: String,
    defaultSrc: String,
    icon: String,
    isLong: {
      type: Boolean,
      default: false,
    },
    name: String,
    size: {
      type: [Number, String],
      default: 'normal',
    },
    src: String,
  },
  components: {
    H3AvatarImg,
    H3AvatarIcon,
  },
  data() {
    return {
      iconWrapperStyle: {
        position: 'absolute',
        lineHeight: 1,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      avatarColors: ['#40a9ff', '#ffa940', '#ff6851', '#73d13d', '#36cfc9'],
    };
  },
  render(h) {
    let size;
    switch (this.size) {
      case 'normal':
        size = '40px';
        break;
      case 'large':
        size = '48px';
        break;
      default:
        size = `${this.size}px`;
    }

    const tmpStyle = {
      width: size,
      height: size,
      lineHeight: size,
      fontSize: '14px',
      position: 'relative',
      ...this.styleObj,
    };
    if ((!this.name && !this.icon) || this.src) {
      return h(H3AvatarImg, {
        props: {
          src: this.src,
          className: this.className,
          styleObj: tmpStyle,
        },
      });
    }
    const arrColors = this.colors || this.avatarColors;
    if (this.defaultColor) {
      tmpStyle.backgroundColor = this.defaultColor;
    } else if (arrColors.length === 1) {
      [tmpStyle.backgroundColor] = arrColors;
    } else {
      const tmpCode = hashCode(this.name, this.isLong);
      const index = Math.abs(tmpCode) % arrColors.length;
      tmpStyle.backgroundColor = arrColors[index];
    }
    return h(H3AvatarIcon, {
      props: {
        ...this.$props,
        styleObj: tmpStyle,
      },
    });
  },
};
</script>

<style lang="less">
.h3-avatar {
  border-radius: 50%;
  text-align: center;
  overflow: hidden;
  color: #fff;
}
</style>




