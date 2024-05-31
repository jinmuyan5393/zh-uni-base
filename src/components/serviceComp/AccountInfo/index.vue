<!--
 * @Description:
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-20 16:31:22
-->
<template>
  <div class="account-info pt-3">
    <el-row :gutter="30">
      <re-col>
        <!-- 账号输入框 -->
        <el-form-item label="头像" prop="avatar">
          <material-picker v-model="form.avatar" :limit="1" />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 账号输入框 -->
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" :disabled="!!curRow.id" placeholder="请输入账号" style="width: 320px" clearable />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 名称输入框 -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" style="width: 320px" clearable />
        </el-form-item>
      </re-col>
      <re-col v-if="!curRow.id">
        <!-- 密码输入框 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" style="width: 320px" show-password clearable placeholder="请输入密码" />
        </el-form-item>
      </re-col>
      <re-col v-if="!curRow.id">
        <!-- 确认密码输入框 -->
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input v-model="form.password_confirm" show-password clearable style="width: 320px" placeholder="请输入确认密码" />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 管理员状态 -->
        <el-form-item label="是否禁用">
          <el-switch v-model="form.disable" inline-prompt :active-value="0" active-text="启用" inactive-text="禁用" :inactive-value="1" />
        </el-form-item>
      </re-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  formData: {
    type: Object as any,
    default: () => {},
  },
  curRow: {
    type: Object as any,
    default: () => {},
  },
});
const form = ref<any>(props.formData);
watch(
  () => props.formData,
  val => {
    form.value = val;
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<style scoped lang="scss"></style>
