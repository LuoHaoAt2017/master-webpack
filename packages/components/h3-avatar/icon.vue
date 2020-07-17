<template>
  <div class="h3-avatar" :style="styleObj">
    <span :style="iconWrapperStyle" v-if="icon">
      <icon :type="icon"></icon>
    </span>
    <span v-else>{{displayName}}</span>
  </div>
</template>

<script>
import Icon from '../h3-icon';

const formatName = (name) => {
  let formattedName = name;
  const isEnglishName = /^[A-Za-z,. ]+$/.test(formattedName);
  formattedName = formattedName.replace(/[,. ]+/g, isEnglishName ? ' ' : '');
  if (formattedName.indexOf(' ') !== -1) {
    formattedName = formattedName.split(' ').map(p => p.slice(0, 1)).join('');
  }
  return isEnglishName
    ? formattedName.slice(0, 2)
    : formattedName.slice(formattedName.length - 2, formattedName.length);
};

export default {
  name: 'h3-avatar-icon',
  props: {
    className: String,
    styleObj: Object,
    colors: {
      type: Array,
    },
    defaultColor: String,
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
  },
  components: {
    Icon,
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
    };
  },
  computed: {
    displayName() {
      return formatName(this.name);
    },
  },
};
</script>

