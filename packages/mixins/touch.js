export default {
  methods: {
    toggleActive(isActive) {
      this.isActive = isActive;
    },

    onTouchStart() {
      this.toggleActive(true);
    },

    onTouchMove() {
      this.toggleActive(false);
    },

    onTouchEnd() {
      this.toggleActive(false);
    },

    onTouchCancel() {
      this.toggleActive(false);
    },
  },
};
