<template>
  <div class="database h-full">
    <search-form class="bg-white pt-[10px] pr-[10px] rounded" :columns="searchCols" :search="search" :reset="reset" :searchParam="searchParam" />
    <div class="table-wrapper bg-white mt-3 p-[10px] rounded">
      <com-table
        :columns="columns"
        :border="true"
        :tableData="tableData"
        :toolButton="true"
        :pageInfo="pager"
        @currentChange="handleCurrentChange"
        @sizeChange="handleSizeChange"
        @refresh-table="refresh">
        <template #operate="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">详情</el-button>
        </template>
      </com-table>
    </div>
    <formDialog ref="addRef" @success="queryList" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { settingSystemTableApi } from "@/api/modules/sys/database";
import formDialog from "./components/formDialog.vue";
import feedback from "@/utils/feedback";
onMounted(() => {
  queryList();
});
const searchCols = ref<any>([{ el: "input", label: "表名", key: "search" }]);
const searchParam = ref({});

const columns = ref<any>([
  {
    label: "序号",
    prop: "id",
    type: "index",
    align: "center",
    width: 60,
  },
  {
    label: "表名",
    prop: "TABLE_NAME",
    width: 260,
  },
  {
    label: "表描述",
    prop: "TABLE_COMMENT",
    minWidth: 160,
  },
  {
    label: "操作",
    prop: "operate",
    width: "180",
    fixed: "right",
  },
]);

const tableData = ref([]);
const pager = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
function queryList(isRefresh = false) {
  const params = {
    ...searchParam.value,
    page_no: pager.pageNum,
    page_size: pager.pageSize,
  };
  settingSystemTableApi(params).then((res: any) => {
    if (res && res.code == 1) {
      tableData.value = res.data.lists || [];
      pager.total = res.data.count || 0;
      if (isRefresh) {
        feedback.msgSuccess("刷新成功");
      }
    } else {
      feedback.msgWarning(res.msg);
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
// 详情
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

// 刷新
function refresh() {
  queryList(true);
}
</script>

<style scoped lang="scss">
.database {
  display: flex;
  flex-direction: column;
  .table-wrapper {
    flex: 1;
    height: 0;
  }
}
</style>
