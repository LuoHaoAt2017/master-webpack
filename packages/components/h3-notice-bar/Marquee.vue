<script>
export default {
  name: 'Marquee',
  props: {
    prefixCls: {
      type: String,
    },
    text: {
      type: null,
      // default: '',
    },
    loop: {
      type: Boolean,
      default: false,
    },
    leading: {
      type: Number,
      default: 500,
    },
    trailing: {
      type: Number,
      default: 800,
    },
    fps: {
      type: Number,
      default: 40,
    },
    className: {
      type: String,
      default: '',
    },
    h3Style: {
      type: null,
    },
  },
  data() {
    return {
      state: {
        animatedWidth: 0,
        overflowWidth: 0,
      },
      marqueeTimer: null,
    };
  },
  mounted() {
    this.componentDidMount();
  },
  updated() {
    this.componentDidUpdate();
  },
  beforeDestroy() {
    this.componentWillUnmount();
  },
  methods: {
    componentDidMount() {
      this.measureText();
      this.startAnimation();
    },
    componentDidUpdate() {
      this.measureText();
      if (!this.marqueeTimer) {
        this.startAnimation();
      }
    },
    componentWillUnmount() {
      clearTimeout(this.marqueeTimer);
    },
    startAnimation() {
      if (this.marqueeTimer) {
        clearTimeout(this.marqueeTimer);
      }
      const fps = this.$props.fps;
      const TIMEOUT = (1 / fps) * 1000;
      const isLeading = this.state.animatedWidth === 0;
      const timeout = isLeading ? this.$props.leading : TIMEOUT;

      const animate = () => {
        const { overflowWidth } = this.state;
        let animatedWidth = this.state.animatedWidth + 1;
        const isRoundOver = animatedWidth > overflowWidth;

        if (isRoundOver) {
          if (this.$props.loop) {
            animatedWidth = 0;
          } else {
            return;
          }
        }

        if (isRoundOver && this.$props.trailing) {
          this.marqueeTimer = setTimeout(() => {
            this.state.animatedWidth = animatedWidth;

            this.marqueeTimer = setTimeout(animate, TIMEOUT);
          }, this.$props.trailing);
        } else {
          this.state.animatedWidth = animatedWidth;
          this.marqueeTimer = setTimeout(animate, TIMEOUT);
        }
      };

      if (this.state.overflowWidth !== 0) {
        this.marqueeTimer = setTimeout(animate, timeout);
      }
    },
    measureText() {
      const container = this.$refs.thisDom;
      const node = this.$refs.textRef;
      if (container && node) {
        const containerWidth = container.offsetWidth;
        const textWidth = node.offsetWidth;
        const overflowWidth = textWidth - containerWidth;
        if (overflowWidth !== this.state.overflowWidth) {
          this.state.overflowWidth = overflowWidth;
        }
      }
    },
  },
  render(h) {
    const self = this;
    const { prefixCls, className, text } = this.$props;
    const style = {
      position: 'relative',
      right: `${this.state.animatedWidth}px`,
      whiteSpace: 'nowrap',
      display: 'inline-block',
      ...self.$props.h3Style,
    };
    const result = h(
      'div',
      {
        class: `${prefixCls}-marquee-wrap ${className}`,
        style: { overflow: 'hidden' },
        attrs: {
          role: 'marquee',
        },
        ref: 'thisDom',
      },
      [
        h(
          'div',
          {
            class: `${prefixCls}-marquee`,
            style,
            ref: 'textRef',
          },
          [
            text,
            ' ',
          ],
        ),
      ],
    );
    return result;
  },
};
</script>
