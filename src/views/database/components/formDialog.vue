<template>
  <div class="addDialog">
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="visible" width="800px" class="zh-dialog" :before-close="handleClose" append-to-body>
      <com-table :columns="columns" :border="true" :tableData="tableData" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { settingSystemTablesInfoApi } from "@/api/modules/sys/database";
import validation from "./validate";
onMounted(() => {});
const title = ref("添加");
const visible = ref(false);
const curRow = ref<any>({});
const tableData = ref<any[]>();
const columns = ref<any>([
  {
    label: "序号",
    prop: "id",
    type: "index",
    align: "center",
    width: 60,
  },
  {
    label: "表字段",
    prop: "Field",
    width: 260,
  },
  {
    label: "字段类型",
    prop: "Type",
    minWidth: 160,
  },
  {
    label: "描述",
    prop: "Comment",
    minWidth: 160,
  },
  {
    label: "是否可以为空",
    prop: "Null",
    minWidth: 160,
  },
  {
    label: "主键",
    prop: "Key",
    minWidth: 160,
  },
]);
const setFormData = (data: Record<any, any>) => {
  validation.formData = data;
};

// 关闭弹窗
function handleClose() {
  visible.value = false;
  curRow.value = {};
  validation.resetForm();
}

// 打开弹窗
function open(data: any) {
  visible.value = true;
  const params = {
    table: data.TABLE_NAME,
  };
  detail(params);
}

// 表结构详情
function detail(params) {
  settingSystemTablesInfoApi(params).then((res: any) => {
    if (res && res.code === 1) {
      tableData.value = res.data;
    }
  });
}

defineExpose({
  open,
  setFormData,
});
</script>

<style scoped></style>
