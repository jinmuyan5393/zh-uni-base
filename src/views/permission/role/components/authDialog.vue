<template>
  <div class="addDialog">
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="visible" width="800px" class="zh-dialog" :before-close="handleClose" append-to-body>
      <el-form ref="formRef" :model="formData" label-width="85px" v-loading="loading">
        <el-scrollbar class="h-[400px] sm:h-[600px]">
          <el-form-item label="权限" prop="menu_id">
            <div>
              <el-checkbox label="展开/折叠" @change="handleExpand" />
              <el-checkbox label="全选/不全选" @change="handleSelectAll" />
              <el-checkbox v-model="checkStrictly" label="父子联动" />
              <div>
                <el-tree
                  ref="treeRef"
                  :data="menuTree"
                  :props="{
                    label: 'name',
                    children: 'children',
                  }"
                  :check-strictly="!checkStrictly"
                  node-key="id"
                  :default-expand-all="isExpand"
                  show-checkbox />
              </div>
            </div>
          </el-form-item>
        </el-scrollbar>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { authMenuAllApi, authRoleEditApi } from "@/api/modules/sys/role";
import { ElMessage } from "element-plus";
import type { CheckboxValueType, ElTree } from "element-plus";
import { treeToArray } from "@/utils/index";
const emits = defineEmits(["success"]);
onMounted(() => {});

const title = ref("添加");
const visible = ref(false);
const curRow = ref<any>({});
const formRef = ref<any>();
const treeRef = ref<InstanceType<typeof ElTree>>();
const formData = reactive({
  id: "",
  name: "",
  desc: "",
  sort: 0,
  menu_id: [] as any[],
});
const isExpand = ref(false);
const checkStrictly = ref(true);
const menuArray = ref<any[]>([]);
const menuTree = ref<any[]>([]);
const loading = ref(false);

const getOptions = () => {
  loading.value = true;
  authMenuAllApi().then((res: any) => {
    const data = res.data || [];
    menuTree.value = data;
    menuArray.value = treeToArray(data);
    nextTick(() => {
      setDeptAllCheckedKeys();
    });
    loading.value = false;
  });
};

// 获取所有选择的节点包括半选中节点
const getDeptAllCheckedKeys = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys();
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys()!;
  checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};

const setDeptAllCheckedKeys = () => {
  formData.menu_id.forEach(v => {
    nextTick(() => {
      treeRef.value?.setChecked(v, true, false);
    });
  });
};

const handleExpand = (check: CheckboxValueType) => {
  const treeList = menuTree.value;
  for (let i = 0; i < treeList.length; i++) {
    //@ts-ignore
    treeRef.value.store.nodesMap[treeList[i].id].expanded = check;
  }
};

const handleSelectAll = (check: CheckboxValueType) => {
  if (check) {
    treeRef.value?.setCheckedKeys(menuArray.value.map(item => item.id));
  } else {
    treeRef.value?.setCheckedKeys([]);
  }
};

const setFormData = (data: Record<any, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key];
    }
  }
};

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      formData.menu_id = getDeptAllCheckedKeys()!;
      edit();
    }
  });
}

function edit() {
  authRoleEditApi(formData).then((res: any) => {
    if (res && res.code == 1) {
      handleClose();
      ElMessage.success(res.msg || "操作成功");
      emits("success");
    } else {
      ElMessage.warning(res.msg);
    }
  });
}

function cancel() {
  handleClose();
}

function handleClose() {
  visible.value = false;
  formRef.value.resetFields();
}

// 打开弹窗
function open(data: any) {
  visible.value = true;
  if (data) {
    title.value = "分配权限";
    curRow.value = data;
    setFormData(data);
  }
  getOptions();
}

defineExpose({
  open,
  setFormData,
});
</script>

<style scoped></style>
