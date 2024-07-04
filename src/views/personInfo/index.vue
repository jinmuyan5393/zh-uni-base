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
          <el-form-item label="角色" prop="roleName">
            <el-input v-model="roleName" :disabled="true" placeholder="" style="width: 320px" clearable />
          </el-form-item>
        </re-col>
        <re-col>
          <!-- 账号输入框 -->
          <el-form-item label="昵称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入昵称" style="width: 320px" clearable />
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
import { ElMessage } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal } from "@zhonghe/utils";
import md5 from "md5";
import { authMySelfApi, authEditSelfApi } from "@/api/modules/sys/role";
onMounted(() => {
  queryUserInfo();
});

const userStore = useUserStoreHook();

const formRef = ref();
const roleName = ref("");
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

// 获取用户信息
function queryUserInfo() {
  authMySelfApi().then((res: any) => {
    if (res && res.code === 1) {
      formData.value = res.data.user;
      const roleNames = res.data?.user?.role_name;
      roleName.value = roleNames && roleNames.length > 0 ? roleNames[0] : "";
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
      authEditSelfApi(params).then((res: any) => {
        if (res && res.code === 1) {
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          userStore.SET_USERNAME(res.data.name);
          userStore.SET_AVATAR(res.data.avatar);
          const userinfo = storageLocal.getItem("user-info");
          storageLocal.setItem("user-info", {
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
</script>

<style scoped></style>
