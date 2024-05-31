<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Delete, EditPen, Plus } from "@element-plus/icons-vue";
import AddDialog from "./components/addDialog.vue";
import { authMenuListApi, authMenuDeleteApi } from "@/api/modules/role";
import { MenuEnum } from "@/enums/appEnum";

onMounted(() => {
  queryList();
});

function queryList(isRefresh = false) {
  authMenuListApi({}).then((res: any) => {
    if (res && res.code == 1) {
      tableData.value = res.data.lists || [];
      if (isRefresh) {
        ElMessage.success("刷新成功");
      }
    } else {
      ElMessage.error(res.msg);
    }
  });
}

const tableData = ref([]);
const columns = ref<any>([
  {
    label: "菜单名称",
    prop: "name",
    align: "left",
    minWidth: 150
  },
  {
    label: "类型",
    prop: "type",
    minWidth: 150
  },
  {
    label: "图标",
    prop: "icon",
    minWidth: 150
  },
  {
    label: "权限标识",
    prop: "perms",
    minWidth: 150
  },
  {
    label: "是否显示",
    prop: "is_show",
    minWidth: 150
  },
  {
    label: "菜单状态",
    prop: "is_disable",
    minWidth: 150
  },
  {
    label: "排序",
    prop: "sort"
  },
  {
    label: "创建时间",
    prop: "update_time",
    minWidth: 150
  },
  {
    label: "操作",
    prop: "operate",
    isShow: true,
    minWidth: "200px",
    fixed: "right"
  }
]);

// 新增
const addRef = ref();
function add() {
  addRef.value.open();
}

// 新增子菜单
function handleAdd(id?: number) {
  addRef.value.setFormData({
    pid: id
  });
  addRef.value.open();
}

// 编辑菜单
function handleEdit(row: any) {
  addRef.value.open(row);
}

// 删除菜单
function handleDelete(id: any) {
  ElMessageBox.confirm("删除之后无法恢复，是否确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    authMenuDeleteApi({ id: id }).then((res: any) => {
      if (res && res.code == 1) {
        ElMessage.success("删除成功");
        queryList();
      } else {
        ElMessage.warning(res.msg);
      }
    });
  });
}

// 刷新
function refresh() {
  queryList(true);
}
</script>

<template>
  <div class="meun-manage zh-wrapper">
    <com-table
      :columns="columns"
      :border="true"
      :tableData="tableData"
      :isPageable="false"
      :toolButton="true"
      @refresh-table="refresh"
    >
      <template #tableHeader>
        <el-button type="primary" @click="add">新增</el-button>
      </template>
      <template #type="{ row }">
        <div v-if="row.type == MenuEnum.CATALOGUE">目录</div>
        <div v-else-if="row.type == MenuEnum.MENU">菜单</div>
        <div v-else-if="row.type == MenuEnum.BUTTON">按钮</div>
      </template>
      <template #is_show="{ row }">
        <el-tag v-if="row.is_show == 1">显示</el-tag>
        <el-tag v-else type="danger">隐藏</el-tag>
      </template>
      <template #is_disable="{ row }">
        <el-tag v-if="row.is_disable == 0">正常</el-tag>
        <el-tag v-else type="danger">停用</el-tag>
      </template>
      <template #operate="{ row }">
        <el-button
          type="primary"
          :icon="Plus"
          link
          size="small"
          @click="handleAdd(row.id)"
          >新增</el-button
        >
        <el-button
          type="primary"
          :icon="EditPen"
          link
          size="small"
          @click="handleEdit(row)"
          >修改</el-button
        >
        <el-button
          type="primary"
          :icon="Delete"
          link
          size="small"
          @click="handleDelete(row.id)"
          >删除</el-button
        >
      </template>
    </com-table>
    <add-dialog ref="addRef" @success="queryList" />
  </div>
</template>

<style lang="scss" scoped></style>
