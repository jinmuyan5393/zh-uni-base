<template>
  <div class="addDialog">
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="visible" width="800px" class="zh-dialog" :before-close="handleClose" append-to-body>
      <el-form ref="formRef" :model="formData" label-width="85px" :rules="formRules">
        <el-row :gutter="30">
          <re-col>
            <!-- 账号输入框 -->
            <el-form-item label="账号" prop="account">
              <el-input v-model="formData.account" :disabled="formData.root == 1" placeholder="请输入账号" clearable />
            </el-form-item>
          </re-col>
          <re-col>
            <!-- 名称输入框 -->
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入名称" clearable />
            </el-form-item>
          </re-col>
          <re-col>
            <el-form-item label="归属部门" prop="dept_id">
              <el-tree-select
                class="flex-1"
                v-model="formData.dept_id"
                :data="optionsData.dept"
                clearable
                multiple
                node-key="id"
                :props="{
                            value: 'id',
                            label: 'name',
                            disabled(data: any) {
                                return data.status !== 1
                            }
                        }"
                check-strictly
                :default-expand-all="true"
                placeholder="请选择上级部门" />
            </el-form-item>
          </re-col>
          <re-col>
            <el-form-item label="岗位" prop="jobs_id">
              <el-select class="flex-1" v-model="formData.jobs_id" clearable multiple placeholder="请选择岗位">
                <el-option v-for="(item, index) in optionsData.jobs" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </re-col>
          <re-col>
            <!-- 角色选择框 -->
            <el-form-item label="角色" prop="role_id">
              <el-select v-model="formData.role_id" :disabled="formData.root == 1" class="flex-1" multiple placeholder="请选择角色" clearable>
                <el-option v-for="(item, index) in optionsData.role" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </re-col>
          <re-col>
            <!-- 密码输入框 -->
            <el-form-item label="密码" prop="password">
              <el-input v-model="formData.password" show-password clearable placeholder="请输入密码" />
            </el-form-item>
          </re-col>
          <re-col>
            <!-- 确认密码输入框 -->
            <el-form-item label="确认密码" prop="password_confirm">
              <el-input v-model="formData.password_confirm" show-password clearable placeholder="请输入确认密码" />
            </el-form-item>
          </re-col>
          <re-col>
            <!-- 管理员状态 -->
            <el-form-item label="管理员状态" v-if="formData.root != 1">
              <el-switch v-model="formData.disable" :active-value="0" :inactive-value="1" />
            </el-form-item>
          </re-col>
          <re-col>
            <!-- 多处登录 -->
            <el-form-item label="多处登录">
              <div>
                <el-switch v-model="formData.multipoint_login" :active-value="1" :inactive-value="0" />
                <div class="form-tips">允许多人同时在线登录</div>
              </div>
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
import { authRoleAllApi, authAdminDetailApi, authAdminAddApi, authAdminEditApi } from "@/api/modules/role";
import { authDeptListApi, authJobAllApi } from "@/api/modules/org";
import { useDictOptions } from "@/hooks/useDictOptions";
import md5 from "md5";
import { ElMessage } from "element-plus";
const emits = defineEmits(["success"]);
onMounted(() => {});

const title = ref("添加");
const visible = ref(false);
const curRow = ref<any>({});
const formRef = ref();
const formData = reactive({
  id: "",
  account: "",
  name: "",
  dept_id: [],
  jobs_id: [],
  role_id: [],
  avatar: "",
  password: "",
  password_confirm: "",
  disable: 0,
  multipoint_login: 1,
  root: 0,
});

const passwordConfirmValidator = (rule: object, value: string, callback: any) => {
  if (formData.password) {
    if (!value) callback(new Error("请再次输入密码"));
    if (value !== formData.password) callback(new Error("两次输入密码不一致!"));
  }
  callback();
};

const roleIdValidator = (rule: object, value: string, callback: any) => {
  if (formData.root) {
    callback();
  } else {
    if (formData.role_id.length) {
      callback();
    } else {
      callback(new Error("请选择角色"));
    }
  }
};
const formRules = reactive({
  account: [
    {
      required: true,
      message: "请输入账号",
      trigger: ["blur"],
    },
  ],
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: ["blur"],
    },
  ],
  role_id: [
    {
      required: true,
      validator: roleIdValidator,
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["blur"],
    },
  ] as any[],
  password_confirm: [
    {
      required: true,
      message: "请输入确认密码",
      trigger: ["blur"],
    },
    {
      validator: passwordConfirmValidator,
      trigger: "blur",
    },
  ] as any[],
});

const { optionsData } = useDictOptions<{
  role: any[];
  jobs: any[];
  dept: any[];
}>({
  role: {
    api: authRoleAllApi,
  },
  jobs: {
    api: authJobAllApi,
  },
  dept: {
    api: authDeptListApi,
  },
});

const setFormData = (data: Record<any, any>) => {
  formRules.password = [];
  formRules.password_confirm = [
    {
      validator: passwordConfirmValidator,
      trigger: "blur",
    },
  ];
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key];
    }
  }
};
// 获取菜单详情
const getDetail = async () => {
  const res: any = await authAdminDetailApi({
    id: curRow.value.id,
  });
  if (res && res.code === 1) {
    setFormData(res.data);
  }
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
  const params = {
    ...formData,
    password: md5(formData.password),
    password_confirm: md5(formData.password_confirm),
  };
  authAdminEditApi(params).then((res: any) => {
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
  const params = {
    ...formData,
    password: md5(formData.password),
    password_confirm: md5(formData.password_confirm),
  };
  authAdminAddApi(params).then((res: any) => {
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
