<template>
  <svg class="h3-progress-circle" viewBox="0 0 100 100">
    <path
      class="h3-progress-circle-trail"
      :d="pathString"
      :strokeWidth="trailWidth"
      fillOpacity="0"
    />
    <path
      className="t-progress-circle-path"
      :d="pathString"
      strokeLinecap="round"
      :strokeWidth="strokeWidth"
      fillOpacity="0"
      :style="pathStyle"
    />
  </svg>
</template>

<script>
export default {
  name: 'h3-progress-circle',
  props: {
    status: {
      type: String,
      default: 'normal',
      validator: val => ['normal', 'exception', 'success'].indexOf(val) > -1,
    },
    percent: {
      type: Number,
      default: 0,
    },
    strokeWidth: {
      type: Number,
      default: 10,
    },
    trailWidth: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 156,
    },
    showInfo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pathString: '',
      pathStyle: null,
      stroke: this.strokeWidth,
      trail: this.trailWidth || this.strokeWidth,
    };
  },
  created() {
    const radius = (50 - (this.strokeWidth / 2));
    this.pathString = `M 50,50 m 0,-${radius}
        a ${radius},${radius} 0 1 1 0,${2 * radius}
        a ${radius},${radius} 0 1 1 0,-${2 * radius}`;
    const len = Math.PI * 2 * radius;
    this.pathStyle = {
      strokeDasharray: `${len}px ${len}px`,
      strokeDashoffset: `${(((100 - this.percent) / 100) * len)}px`,
      transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
    };
  },
};
</script>

