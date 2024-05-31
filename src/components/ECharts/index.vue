<template>
  <div id="echarts" ref="chartRef" :style="echartsStyle" />
</template>

<script setup lang="ts" name="ECharts">
import { ref, onMounted, onBeforeUnmount, watch, computed, markRaw, nextTick } from "vue";
import { EChartsType, ECElementEvent } from "echarts/core";
import echarts, { ECOption } from "./config";

interface Props {
  option: ECOption;
  renderer?: "canvas" | "svg";
  resize?: boolean;
  theme?: Object | string;
  width?: number | string;
  height?: number | string;
  onClick?: (event: ECElementEvent) => any;
}

const props = withDefaults(defineProps<Props>(), {
  renderer: "canvas",
  resize: true,
});

const echartsStyle = computed(() => {
  return props.width || props.height ? { height: props.height + "px", width: props.width + "px" } : { height: "100%", width: "100%" };
});

const chartRef = ref<HTMLDivElement | HTMLCanvasElement>();
const chartInstance = ref<EChartsType>();

const draw = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(props.option, { notMerge: true });
  }
};

watch(props, () => {
  draw();
});

const handleClick = (event: ECElementEvent) => props.onClick && props.onClick(event);

const init = () => {
  if (!chartRef.value) return;
  chartInstance.value = echarts.getInstanceByDom(chartRef.value);

  if (!chartInstance.value) {
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, props.theme, {
        renderer: props.renderer,
      }),
    );
    chartInstance.value.on("click", handleClick);
    draw();
  }
};

const resize = () => {
  if (chartInstance.value && props.resize) {
    chartInstance.value.resize({ animation: { duration: 300 } });
  }
};

const debouncedResize = debounce(resize, 300);

onMounted(() => {
  nextTick(() => init());
  window.addEventListener("resize", debouncedResize);
});

onBeforeUnmount(() => {
  chartInstance.value?.dispose();
  window.removeEventListener("resize", debouncedResize);
});

/**
 * 封装一个防抖动方法
 * debounce: 防抖函数,  它的两个参数=>  func:函数(要进行防抖的函数)    delay: 毫秒(传入一个时间限制,毫秒)
 *使用示例 const debouncedTask = debounce(heavyTask, 200);
 */
function debounce(fn: any, delay: number) {
  let timer: any = null;
  return function (this: any, ...args: any) {
    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

defineExpose({
  getInstance: () => chartInstance.value,
  resize,
  draw,
});
</script>
