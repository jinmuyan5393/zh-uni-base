<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import AddDialog from "./components/addDialog.vue";
import AuthDialog from "./components/authDialog.vue";
import { authRoleListApi, authRoleDeleteApi } from "@/api/modules/sys/role";

onMounted(() => {
  queryList();
});

function queryList() {
  authRoleListApi({}).then((res: any) => {
    if (res && res.code == 1) {
      tableData.value = res.data.lists || [];
      pager.total = res.data.count || 0;
    }
  });
}

const tableData = ref([]);
const columns = ref<any>([
  {
    label: "ID",
    prop: "id",
    minWidth: 100,
  },
  {
    label: "名称",
    prop: "name",
    minWidth: 150,
  },
  {
    label: "排序",
    prop: "sort",
    minWidth: 100,
  },
  {
    label: "管理员人数",
    prop: "num",
    minWidth: 100,
  },
  {
    label: "备注",
    prop: "desc",
    minWidth: 150,
    showOverflowTooltip: true,
  },
  {
    label: "创建时间",
    prop: "create_time",
    minWidth: 180,
  },
  {
    label: "操作",
    prop: "operate",
    isShow: true,
    minWidth: 180,
    fixed: "right",
  },
]);
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const handleCurrentChange = (val: any) => {
  pager.pageNum = val;
  queryList();
};

const handleSizeChange = (val: any) => {
  pager.pageSize = val;
  queryList();
};

// 新增
const addRef = ref();
function add() {
  addRef.value.open();
}

// 编辑菜单
function handleEdit(row: any) {
  addRef.value.open(row);
}

// 分配权限
const authRef = ref();
function handleAuth(row: any) {
  authRef.value.open(row);
}

// 删除菜单
function handleDelete(id: any) {
  ElMessageBox.confirm("删除之后无法恢复，是否确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    authRoleDeleteApi({ id: id }).then((res: any) => {
      if (res && res.code == 1) {
        ElMessage.success("删除成功");
        queryList();
      } else {
        ElMessage.warning(res.msg);
      }
    });
  });
}
</script>

<template>
  <div class="role-manage zh-wrapper">
    <com-table
      :columns="columns"
      :border="true"
      :tableData="tableData"
      :pageInfo="pager"
      :toolButton="false"
      @currentChange="handleCurrentChange"
      @sizeChange="handleSizeChange">
      <template #tableHeader>
        <el-button type="primary" @click="add">新增</el-button>
      </template>
      <template #operate="{ row }">
        <el-button type="primary" link size="small" @click="handleEdit(row)">修改</el-button>
        <el-button type="primary" link size="small" @click="handleAuth(row)">分配权限</el-button>
        <el-button type="primary" link size="small" @click="handleDelete(row.id)">删除</el-button>
      </template>
    </com-table>
    <add-dialog ref="addRef" @success="queryList" />
    <auth-dialog ref="authRef" @success="queryList" />
  </div>
</template>

<style lang="scss" scoped></style>
