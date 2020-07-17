<template>
  <div style="display:inline-block;line-height:0;" class="h3-icon h3-svg" @click="handleClick">
    <div style="position:relative;">
      <svg name="" width="32px" height="32px" fill="#000" viewBox="0 -120 1024 1024" >
        <path d="M955.5 641q68.5-118 68.5-257t-68.5-257Q887 9 769-59.5T512-128q-139 0-257 68.5T68.5 127Q0 245 0 384t68.5 257Q137 759 255 827.5T512 896q139 0 257-68.5T955.5 641zM563 384l154 155q11 11 11 25.5a34.15 34.15 0 0 1-10.5 25A34.72 34.72 0 0 1 692 600a37.4 37.4 0 0 1-26-10L512 435 358 590a37.42 37.42 0 0 1-26 10 35.85 35.85 0 0 1-36-36 32.35 32.35 0 0 1 11-25l154-155-154-155a32.36 32.36 0 0 1-11-25 35.85 35.85 0 0 1 36-36 37.37 37.37 0 0 1 26 10l154 155 154-155a37.35 37.35 0 0 1 26-10 35.85 35.85 0 0 1 36 36 32.4 32.4 0 0 1-11 25z">
        </path>
      </svg>
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;" class="h3-icon-mask" >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'h3-photo-del-icon',
  methods: {
    handleClick() {
      this.$emit('onClick');
    },
  },
};
</script>

