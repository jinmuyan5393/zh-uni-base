<template>
  <div class="common-select">
    <el-select style="width: 100%" v-model="selectVal" :multiple="multiple" collapse-tags @change="change" v-bind="$attrs">
      <template v-for="item in selectList" :key="item.id">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { IProp, stringOrnumber, IOption } from "./types";
const emits = defineEmits(["change", "update:modelValue"]);

const props = defineProps<IProp>();
const selectList = ref<IOption[]>();
const selectVal = ref<stringOrnumber>("");

watch(
  () => props.modelValue,
  val => {
    selectVal.value = val;
  },
  {
    immediate: true,
  },
);

watch(
  () => props.optionList,
  val => {
    selectList.value = val;
  },
  {
    deep: true,
  },
);
const change = (val: any) => {
  emits("update:modelValue", val);
  emits("change", val);
};
</script>

<style scoped></style>
