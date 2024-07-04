<template>
  <div class="upload">
    <el-upload
      v-model:file-list="fileList"
      ref="uploadRefs"
      :action="action"
      :multiple="multiple"
      :limit="limit"
      :show-file-list="false"
      :headers="headers"
      :data="data"
      :before-upload="handleBeforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :accept="getAccept">
      <slot />
    </el-upload>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, shallowRef } from "vue";
import feedback from "@/utils/feedback";
import type { ElUpload } from "element-plus";
import { RequestCodeEnum } from "@/enums/requestEnums";
export default defineComponent({
  components: {},
  props: {
    // 上传文件类型
    type: {
      type: String,
      default: "image",
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: true,
    },
    // 当前文件长度
    fileLength: {
      type: Number,
    },
    // 文件大小限制 单位(MB)
    fileSize: {
      type: Number,
      default: 10,
    },
    // 多选时最多选择几条
    limit: {
      type: Number,
      default: 10,
    },
    // 上传时的额外参数
    data: {
      type: Object,
      default: () => ({
        cid: 0,
      }),
    },
    // 是否显示上传进度
    showProgress: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["change", "error", "success", "allSuccess"],
  setup(props, { emit }) {
    const uploadRefs = shallowRef<InstanceType<typeof ElUpload>>();
    const baseUrl = import.meta.env.VITE_API_URL;
    const action = ref(`${baseUrl}/admin/upload/file`);
    const headers = computed(() => ({
      token: localStorage.getItem("token"),
      version: "1",
    }));
    const visible = ref(false);
    const fileList = ref<any[]>([]);

    const handleProgress = () => {
      visible.value = true;
    };
    let uploadLen = 0;
    const handleSuccess = (response: any, file: any) => {
      uploadLen++;
      if (uploadLen == fileList.value.length) {
        uploadLen = 0;
        fileList.value = [];
        emit("allSuccess");
      }
      emit("change", file);
      if (response.code == RequestCodeEnum.SUCCESS) {
        emit("success", response);
      }
      if (response.code == RequestCodeEnum.FAIL && response.msg) {
        feedback.msgError(response.msg);
      }
    };
    const handleBeforeUpload = (file: any) => {
      // 文件大小限制
      const isInSizeLimit = file.size / 1024 / 1024 < props.fileSize;
      if (!isInSizeLimit) {
        feedback.msgWarning(`文件${file.name}的大小超过${props.fileSize}MB, 请重新选择`);
      }
      // 文件数量限制
      const isInLenLimit = props.fileLength < props.limit;
      console.log("🚀 ~ handleBeforeUpload ~ fileLength:", props.fileLength);
      return isInSizeLimit && isInLenLimit;
    };
    const handleError = (event: any, file: any) => {
      uploadLen++;
      if (uploadLen == fileList.value.length) {
        uploadLen = 0;
        fileList.value = [];
        emit("allSuccess");
      }
      feedback.msgError(`${file.name}文件上传失败`);
      uploadRefs.value?.abort(file);
      visible.value = false;
      emit("change", file);
      emit("error", file);
    };
    const handleExceed = () => {
      feedback.msgError(`超出上传上限${props.limit}，请重新上传`);
    };
    const handleClose = () => {
      fileList.value = [];
      visible.value = false;
    };

    const getAccept = computed(() => {
      switch (props.type) {
        case "image":
          return ".jpg,.png,.gif,.jpeg,.ico";
        case "video":
          return ".wmv,.avi,.mpg,.mpeg,.3gp,.mov,.mp4,.flv,.rmvb,.mkv";
        case "file":
          return ".zip, .rar, .txt, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .csv, .txt, .ftr, .7z, .gz,.step, .prt, .dwg, .sldprt, .slddrw, .jpg, .png, .gif, .jpeg, .webp, .log";
        default:
          return "*";
      }
    });
    return {
      uploadRefs,
      action,
      headers,
      visible,
      fileList,
      getAccept,
      handleBeforeUpload,
      handleProgress,
      handleSuccess,
      handleError,
      handleExceed,
      handleClose,
    };
  },
});
</script>

<style lang="scss"></style>
