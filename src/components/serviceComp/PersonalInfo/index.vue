<template>
  <div class="person-info pt-3">
    <el-row :gutter="30">
      <re-col>
        <!-- 姓名 -->
        <el-form-item label="姓名" prop="profile.id_card_name">
          <el-input v-model="form.profile.id_card_name" placeholder="请输入姓名" style="width: 320px" clearable />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 联系方式 -->
        <el-form-item label="联系方式" prop="profile.phone">
          <el-input v-model="form.profile.phone" placeholder="请输入联系方式" style="width: 320px" clearable />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 性别 -->
        <el-form-item label="性别" prop="sex">
          <common-select v-model="form.profile.sex" style="width: 320px" type="SEX" />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 身份证号 -->
        <el-form-item label="身份证号" prop="profile.id_card">
          <el-input v-model="form.profile.id_card" placeholder="请输入身份证号" style="width: 320px" clearable />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 驾驶证到期时间 -->
        <el-form-item label="身份证到期时间" prop="profile.id_card_expired">
          <el-date-picker
            v-model="form.profile.id_card_expired"
            type="date"
            placeholder="请输入身份证到期时间"
            style="width: 320px"
            value-format="X" />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 账号输入框 -->
        <el-form-item label="身份证正面照片" prop="avatar">
          <material-picker v-model="form.profile.id_card_front_face" :limit="1" />
        </el-form-item>
      </re-col>
      <re-col>
        <!-- 账号输入框 -->
        <el-form-item label="身份证反面照片" prop="avatar">
          <material-picker v-model="form.profile.id_card_back_face" :limit="1" />
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

<style scoped></style>
