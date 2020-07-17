/* eslint-disable */
export default {
  methods: {
    toggleActive: function(isActive) {
      this.isActive = isActive;
    },
    touchStart: function(){
      this.toggleActive(true);
    },
    touchMove: function() {
      this.toggleActive(false);
    },
    touchEnd: function(){
      this.toggleActive(false);
    },
    touchCancel: function(){
      this.toggleActive(false);
    },
  },
};
