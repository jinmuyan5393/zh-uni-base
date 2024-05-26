<template>
  <view class="items-box">
    <view class="item" :class="{ active: curSelect === item.value }" v-for="item in options" :key="item.value" @click="handleSelect(item)">
      {{ item.label }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----变量等------------------------------------------------------------------
const props = defineProps({
  options: {
    type: Array as PropType<{ label: string; value: any }[]>,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: [String, Number, Array],
  },
});
watch(
  () => props.modelValue,
  (val: any) => {
    curSelect.value = val;
  },
);
const emits = defineEmits(["update:modelValue"]);
const curSelect = ref(props.modelValue);
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
function handleSelect(item) {
  curSelect.value = item.value;
  emits("update:modelValue", item.value);
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------

// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped></style>
