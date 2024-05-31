<template>
  <div class="admin-manager h-full">
    <search-form
      class="bg-white pt-[10px] pr-[10px] rounded"
      :columns="searchCols"
      :search="search"
      :reset="reset"
      :searchParam="searchParam"
    />
    <div class="table-wrapper bg-white mt-3 p-[10px] rounded">
      <com-table
        :columns="columns"
        :border="true"
        :tableData="tableData"
        :toolButton="false"
        :pageInfo="pager"
        @currentChange="handleCurrentChange"
        @sizeChange="handleSizeChange"
      >
        <template #tableHeader>
          <el-button type="primary" @click="add">新增</el-button>
        </template>
        <template #avatar="{ row }">
          <el-avatar :size="50" :src="row.avatar" />
        </template>
        <template #disable="{ row }">
          <el-tag v-if="row.disable === 0" type="primary">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
        <template #operate="{ row }">
          <el-button
            type="primary"
            v-if="row.root !== 1"
            :icon="EditPen"
            link
            size="small"
            @click="handleEdit(row)"
            >修改</el-button
          >
        </template>
      </com-table>
    </div>
    <addDialog ref="addRef" @success="queryList" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { authAdminListApi, authRoleAllApi } from "@/api/modules/role";
import { EditPen } from "@element-plus/icons-vue";
import { ElAvatar, ElMessage } from "element-plus";
import addDialog from "./components/addDialog.vue";
onMounted(() => {
  queryList();
  queryAllRole();
});
const roleList = ref([]);
const searchCols = ref<any>([
  { el: "input", label: "管理员账号", key: "account" },
  { el: "input", label: "管理员名称", key: "name" },
  {
    el: "select",
    label: "管理员角色",
    key: "role_id",
    optionList: roleList
  }
]);
const searchParam = ref({});

const columns = ref<any>([
  {
    label: "ID",
    prop: "id",
    align: "left",
    minWidth: 60
  },
  {
    label: "头像",
    prop: "avatar",
    minWidth: 100
  },
  {
    label: "账号",
    prop: "account",
    minWidth: 140
  },
  {
    label: "名称",
    prop: "name",
    minWidth: 160
  },
  {
    label: "角色",
    prop: "role_name",
    minWidth: 150
  },
  {
    label: "部门",
    prop: "dept_name"
  },
  {
    label: "状态",
    prop: "disable",
    minWidth: 150
  },
  {
    label: "创建时间",
    prop: "create_time",
    minWidth: 120
  },
  {
    label: "最近登录时间",
    prop: "login_time",
    minWidth: 120
  },
  {
    label: "最近登录IP",
    prop: "login_ip",
    minWidth: 120
  },
  {
    label: "操作",
    prop: "operate",
    isShow: true,
    minWidth: "100px",
    fixed: "right"
  }
]);

const tableData = ref([]);
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
function queryList() {
  const params = {
    ...searchParam.value,
    page_no: pager.pageNum,
    page_size: pager.pageSize
  };
  authAdminListApi(params).then((res: any) => {
    if (res && res.code == 1) {
      tableData.value = res.data.lists || [];
      pager.total = res.data.count || 0;
    } else {
      ElMessage.warning(res.msg);
    }
  });
}

// 获取全部角色
function queryAllRole() {
  authRoleAllApi().then((res: any) => {
    if (res && res.code === 1) {
      let data = res.data || [];
      data = [{ name: "全部", id: "" }].concat(data);
      roleList.value = data.map(item => {
        return {
          label: item.name,
          value: item.id
        };
      });
    }
  });
}

function search() {
  pager.pageNum = 1;
  queryList();
}

function reset() {
  searchParam.value = {};
  queryList();
}

const addRef = ref();
function add() {
  addRef.value.open();
}

// 编辑
function handleEdit(row: any) {
  addRef.value.open(row);
}

const handleCurrentChange = (val: any) => {
  pager.pageNum = val;
  queryList();
};

const handleSizeChange = (val: any) => {
  pager.pageSize = val;
  queryList();
};

// const changeStatus = (data: any) => {
//   if (data && !isNullOrUnDef(data.root) && data.root != 1) {
//     authAdminEditApi({
//       id: data.id,
//       avatar: data.avatar,
//       account: data.account,
//       name: data.name,
//       role_id: data.role_id,
//       job_id: data.job_id,
//       dept_id: data.dept_id,
//       disable: data.disable,
//       multipoint_login: data.multipoint_login
//     })
//       .then(res => {
//         if (res && res.code == 1) {
//           ElMessage.success(res.msg);
//         } else {
//           ElMessage.warning(res.msg);
//         }
//       })
//       .finally(() => {
//         queryList();
//       });
//   }
// };
</script>

<style scoped lang="scss">
.admin-manager {
  display: flex;
  flex-direction: column;
  .table-wrapper {
    flex: 1;
    height: 0;
  }
}
</style>
