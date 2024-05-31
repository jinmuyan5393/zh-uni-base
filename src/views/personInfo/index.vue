<template>
  <div class="zh-wrapper person-info">
    <div class="mb-5 px-3 pt-3">基本信息</div>
    <el-form ref="formRef" :model="formData" label-width="85px" :rules="formRules">
      <el-row :gutter="30">
        <re-col>
          <!-- 账号输入框 -->
          <el-form-item label="头像" prop="account">
            <material-picker v-model="formData.avatar" :limit="1" />
          </el-form-item>
        </re-col>
        <re-col>
          <!-- 账号输入框 -->
          <el-form-item label="账号" prop="account">
            <el-input v-model="formData.account" disabled style="width: 320px" />
          </el-form-item>
        </re-col>
        <re-col>
          <!-- 账号输入框 -->
          <el-form-item label="昵称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入昵称" style="width: 320px" clearable />
          </el-form-item>
        </re-col>
        <re-col v-if="isOperator">
          <el-form-item label="状态">
            <el-switch
              v-model="formData.operator.status"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              :active-value="1"
              :inactive-value="2"
              active-text="工作中"
              inactive-text="休息中"
              :before-change="handleSwitchChange" />
          </el-form-item>
        </re-col>
        <re-col>
          <!-- 名称输入框 -->
          <el-form-item label="当前密码" prop="password_old">
            <el-input v-model="formData.password_old" placeholder="请输入当前密码" type="password" style="width: 320px" clearable />
          </el-form-item>
        </re-col>
        <re-col>
          <!-- 名称输入框 -->
          <el-form-item label="新的密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入新的密码" type="password" style="width: 320px" clearable />
          </el-form-item>
        </re-col>
        <re-col>
          <!-- 名称输入框 -->
          <el-form-item label="确认密码" prop="password_confirm">
            <el-input v-model="formData.password_confirm" placeholder="请再次输入密码" type="password" style="width: 320px" clearable />
          </el-form-item>
        </re-col>
        <re-col>
          <!-- 提交按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">保存修改</el-button>
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal } from "@/lib/baseUtils";
import md5 from "md5";
import feedback from "@/utils/feedback";
import { isRoleIn } from "@/utils/auth";
import { authRoleCenterApi, authAdminEditSelfApi, setLeaveStatusApi, setWorkeStatusApi } from "@/api/modules/role";
import { RoleEnum } from "@/enums/appEnum";
onMounted(() => {
  queryUserInfo();
});

const userStore = useUserStoreHook();

const formRef = ref();
const formData = ref({
  avatar: "",
  account: "",
  name: "",
  password_old: "",
  password: "",
  password_confirm: "",
  operator: {
    status: 0,
  },
});

const formRules = ref({
  name: [
    {
      required: true,
      message: "请输入昵称",
      trigger: ["blur"],
    },
  ],
});

const isOperator = isRoleIn(RoleEnum.INTERMODAL_OPERATORS);
// 状态切换
function handleSwitchChange() {
  const prevStatus = formData.value.operator.status;
  if (!prevStatus) return false;
  switch (prevStatus) {
    case 1:
      return handleLeave();
    case 2:
      return handleWork();
  }
}

// 获取用户信息
function queryUserInfo() {
  authRoleCenterApi().then((res: any) => {
    if (res && res.code === 1) {
      formData.value = res.data;
    }
  });
}

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      const params = {
        ...formData.value,
      };
      if (formData.value.password) {
        params.password = md5(formData.value.password);
      }
      if (formData.value.password_confirm) {
        params.password_confirm = md5(formData.value.password_confirm);
      }
      if (formData.value.password_old) {
        params.password_old = md5(formData.value.password_old);
      }
      authAdminEditSelfApi(params).then((res: any) => {
        if (res && res.code === 1) {
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          userStore.SET_USERNAME(res.data.name);
          userStore.SET_AVATAR(res.data.avatar);
          const userinfo = storageLocal().getItem("user-info");
          storageLocal().setItem("user-info", {
            ...userinfo,
            avatar: res.data.avatar,
          });
        } else {
          ElMessage({
            message: res.msg,
            type: "error",
          });
        }
      });
    }
  });
}

// 设置休息状态
function handleLeave(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm("是否确认将状态变更为休息状态？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        setLeaveStatusApi()
          .then(res => {
            if (res && res.code === 1) {
              feedback.msgSuccess("设置成功");
              resolve(true);
            } else {
              feedback.msgError("设置失败");
              reject(false);
            }
          })
          .catch(() => {
            reject(false);
          });
      })
      .catch(() => {
        reject(false);
      });
  });
}

// 设置工作状态
function handleWork(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm("是否确认将状态变更为工作状态？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        setWorkeStatusApi()
          .then(res => {
            if (res && res.code === 1) {
              feedback.msgSuccess("设置成功");
              resolve(true);
            } else {
              feedback.msgError("设置失败");
              reject(false);
            }
          })
          .catch(() => {
            reject(false);
          });
      })
      .catch(() => {
        reject(false);
      });
  });
}
</script>

<style scoped></style>
