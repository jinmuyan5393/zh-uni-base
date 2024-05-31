/*
 * @Date: 2024-04-17 14:45:15
 * @LastEditTime: 2024-05-06 11:46:18
 * @Description:
 */
import { ElCol } from "element-plus";
import { h, defineComponent } from "vue";

// 封装element-plus的el-col组件
export default defineComponent({
  name: "ReCol",
  props: {
    value: {
      // 111: 大中小屏幕都独占一行；
      // 112：大屏幕一行两列，中小屏幕独占一行；
      // 113: 大屏幕一行三列，中小屏幕独占一行；
      // 123: 大屏幕一行三列， 中屏幕一行两列，小屏幕独占一行
      // 1132: 大屏幕占一行三列中的两列， 中小屏幕独占一行
      type: Number,
      default: 111,
    },
  },
  render() {
    const attrs = this.$attrs;
    const spanObj = this.calcSpan();
    return h(
      ElCol,
      {
        ...spanObj,
        ...attrs,
      },
      { default: () => this.$slots.default() },
    );
  },
  methods: {
    calcSpan() {
      const val = this.value;
      const spanObj = {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 24,
      };
      switch (val) {
        case 111:
          return spanObj;
        case 112:
          spanObj.lg = 12;
          spanObj.xl = 12;
          return spanObj;
        case 113:
          spanObj.lg = 8;
          spanObj.xl = 8;
          return spanObj;
        case 123:
          spanObj.lg = 12;
          spanObj.xl = 8;
          return spanObj;
        case 1132:
          spanObj.lg = 16;
          spanObj.xl = 16;
          return spanObj;
        default:
          return spanObj;
      }
    },
  },
});
