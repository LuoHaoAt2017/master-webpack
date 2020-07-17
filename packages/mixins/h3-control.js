const mixin = {
  data() {
    return {
      ChangeEvents: {},
    };
  },
  methods: {
    SetValue(val) {
      this.value = val;
    },
    GetValue() {
      return this.value;
    },
    SetReadOnly(flag) {
      this.editable = !flag;
    },
    SetVisible(flag) {
      this.visible = flag;
    },
    OnChange(...args) {
      if (this.ChangeEvents == null) return;
      if (this.isEmptyObject(this.ChangeEvents)) return;
      for (const key in this.ChangeEvents) {
        if (this.IsFunc(this.ChangeEvents[key])) {
          this.ChangeEvents[key].apply(this, [args]);
        }
      }
    },

    // 绑定事件
    BindChange(key, callback) {
      this.ChangeEvents[key] = callback;
    },
    // 解除绑定事件
    UnbindChange(key) {
      delete this.ChangeEvents[key];
    },
    ClearValue() {
      if (this.isVisible) {
        this.SetValue('');
      }
    },
  },
};

export default mixin;
