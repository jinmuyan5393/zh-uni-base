<template>
  <div class="addDialog">
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="visible" width="800px" class="zh-dialog" :before-close="handleClose" append-to-body>
      <el-form ref="formRef" :model="formData" label-width="85px" :rules="formRules">
        <el-row :gutter="30">
          <re-col>
            <el-form-item label="名称" prop="name">
              <el-input class="ls-input" v-model="formData.name" placeholder="请输入名称" clearable />
            </el-form-item>
          </re-col>
          <re-col>
            <el-form-item label="备注" prop="desc">
              <el-input
                v-model="formData.desc"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入备注"
                maxlength="200"
                show-word-limit />
            </el-form-item>
          </re-col>
          <re-col>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" :min="0" :max="9999" />
            </el-form-item>
          </re-col>
        </el-row>
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
import { ref, reactive, onMounted } from "vue";
import { authRoleDetailApi, authRoleAddApi, authRoleEditApi } from "@/api/modules/sys/role";
import { ElMessage } from "element-plus";
const emits = defineEmits(["success"]);
onMounted(() => {});

const title = ref("添加");
const visible = ref(false);
const curRow = ref<any>({});
const formRef = ref();
const formData = reactive({
  id: "",
  name: "",
  desc: "",
  sort: 0,
  menu_id: [],
});

const formRules = reactive({
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: ["blur"],
    },
  ],
});

const setFormData = (data: Record<any, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key];
    }
  }
};
// 获取菜单详情
const getDetail = async () => {
  const res = await authRoleDetailApi({
    id: curRow.value.id,
  });
  setFormData(res.data);
};

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      if (curRow.value.id) {
        edit();
      } else {
        add();
      }
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

function add() {
  authRoleAddApi(formData).then((res: any) => {
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
    title.value = "编辑";
    curRow.value = data;
    getDetail();
  } else {
    title.value = "添加";
  }
}

defineExpose({
  open,
  setFormData,
});
</script>

<style scoped></style>
