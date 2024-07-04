import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { phoneValidator } from "@/utils/validate";
import { employeesAddApi, employeesEditApi } from "@/api/modules/service/business";
interface IFormValidation {
  formData: any;
  rules: any;
  submitForm: (params: any) => Promise<any>;
  resetForm: () => void;
}
const formValidation = reactive<IFormValidation>({
  formData: {
    name: "",
    phone: "",
    company_id: "",
  }, // 表单数据
  rules: {
    name: [
      {
        required: true,
        message: "请输入员工名称",
        trigger: ["blur"],
      },
    ],
    phone: [
      {
        validator: phoneValidator,
        message: "请输入合法的手机号",
        trigger: ["blur"],
      },
    ],
  }, // 校验规则
  submitForm(params: any) {
    return new Promise(resolve => {
      if (params.id) {
        edit().then(() => {
          resolve(true);
        });
      } else {
        add().then(() => {
          resolve(true);
        });
      }
    });
  },
  resetForm() {
    this.formData = {};
  },
});

function edit() {
  const params = {
    ...formValidation.formData,
  };
  return new Promise((resolve, reject) => {
    employeesEditApi(params).then((res: any) => {
      if (res && res.code == 1) {
        handleClose();
        ElMessage.success(res.msg || "操作成功");
        resolve(true);
      } else {
        ElMessage.warning(res.msg);
        reject();
      }
    });
  });
}
function add() {
  const params = {
    ...formValidation.formData,
  };
  return new Promise((resolve, reject) => {
    employeesAddApi(params).then((res: any) => {
      if (res && res.code == 1) {
        handleClose();
        ElMessage.success(res.msg || "操作成功");
        resolve(true);
      } else {
        ElMessage.warning(res.msg);
        reject();
      }
    });
  });
}

function handleClose() {
  formValidation.resetForm();
}

export default formValidation;
