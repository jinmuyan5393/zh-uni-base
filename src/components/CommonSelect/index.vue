<template>
  <div class="common-select">
    <el-select style="width: 100%" v-model="selectVal" @change="change" v-bind="$attrs">
      <template v-for="item in optionList" :key="item.id">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as dict from "@/utils/dict";
const emits = defineEmits(["change", "update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    // 下拉框类别，(dict.ts 导出的变量名)
    type: String,
    required: true,
  },
  api: {
    // 字典
    type: String,
  },
});
type stringOrnumber = string | number;
const dictMap: any = dict;
onMounted(() => {
  const list = (dictMap[props.type] as any[]) || [];
  optionList.value = list;
});
const selectVal = ref<stringOrnumber>("");
const optionList = ref([]);
watch(
  () => props.modelValue,
  val => {
    selectVal.value = val;
  },
  {
    immediate: true,
  },
);
const change = (val: any) => {
  emits("update:modelValue", val);
  emits("change", val);
};
</script>

<style scoped></style>
