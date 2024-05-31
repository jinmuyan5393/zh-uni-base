<template>
  <template v-if="props.column?.el === 'commonSelect'">
    <common-select
      :type="props.column?.selectType"
      v-bind="column"
      v-model="_searchParam[props.column?.key]"
    />
  </template>
  <component
    v-else
    :is="props.column?.render ?? `el-${props.column?.el}`"
    v-bind="{
      ...handleSearchProps,
      ...placeholder,
      searchParam: _searchParam,
      clearable
    }"
    v-model.trim="_searchParam[props.column?.key]"
    :data="props.column?.el === 'tree-select' ? props.column.optionList : []"
    :options="['cascader', 'select-v2'].includes(props.column?.el!) ? props.column.optionList : []"
  >
    <template v-if="props.column?.el === 'cascader'" #default="{ data }">
      <span>{{ data[fieldNames.label] }}</span>
    </template>
    <template v-if="props.column?.el === 'select'">
      <component
        :is="`el-option`"
        v-for="(col, index) in props.column.optionList"
        :key="index"
        :label="col[fieldNames.label]"
        :value="col[fieldNames.value]"
      />
    </template>
    <slot v-else />
  </component>
</template>

<script setup lang="ts" name="SearchFormItem">
import { computed } from "vue";
import { SearchProps } from "@/components/SearchForm/interface";

interface SearchFormItem {
  column: SearchProps;
  searchParam: { [key: string]: any };
}
const props = defineProps<SearchFormItem>();

// Re receive SearchParam
const _searchParam = computed(() => props.searchParam);

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
  return {
    label: props.column.fieldNames?.label ?? "label",
    value: props.column.fieldNames?.value ?? "value",
    children: props.column.fieldNames?.children ?? "children"
  };
});

// 处理透传的 searchProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleSearchProps = computed(() => {
  const label = fieldNames.value.label;
  const value = fieldNames.value.value;
  const children = fieldNames.value.children;
  const searchEl = props.column?.el;
  let searchProps = props.column?.props ?? {};
  if (searchEl === "tree-select") {
    searchProps = {
      ...searchProps,
      props: { ...searchProps.props, label, children },
      nodeKey: value
    };
  }
  if (searchEl === "cascader") {
    searchProps = {
      ...searchProps,
      props: { ...searchProps.props, label, value, children }
    };
  }
  return searchProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const search = props.column;
  if (
    ["datetimerange", "daterange", "monthrange"].includes(
      search?.props?.type
    ) ||
    search?.props?.isRange
  ) {
    return {
      rangeSeparator: search?.props?.rangeSeparator ?? "至",
      startPlaceholder: search?.props?.startPlaceholder ?? "开始时间",
      endPlaceholder: search?.props?.endPlaceholder ?? "结束时间"
    };
  }
  const placeholder =
    search?.props?.placeholder ??
    (search?.el?.includes("input") ? "请输入" : "请选择");
  return { placeholder };
});

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const search = props.column;
  return (
    search?.props?.clearable ??
    (search?.defaultValue == null || search?.defaultValue == undefined)
  );
});
</script>
