<template>
  <div class="addDialog">
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="visible" width="800px" class="zh-dialog" :before-close="handleClose" append-to-body>
      <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
        <el-row :gutter="30">
          <re-col :value="112">
            <el-form-item label="菜单类型" prop="type" required>
              <el-radio-group v-model="formData.type">
                <el-radio :value="MenuEnum.CATALOGUE">目录</el-radio>
                <el-radio :value="MenuEnum.MENU">菜单</el-radio>
                <el-radio :value="MenuEnum.BUTTON">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </re-col>
          <re-col :value="112">
            <el-form-item label="父级菜单" prop="pid">
              <el-tree-select
                class="flex-1"
                v-model="formData.pid"
                :data="menuOptions"
                clearable
                node-key="id"
                :props="{
                  label: 'name',
                }"
                :default-expand-all="true"
                placeholder="请选择父级菜单"
                check-strictly />
            </el-form-item>
          </re-col>
          <re-col :value="112">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入菜单名称" clearable />
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type != MenuEnum.BUTTON">
            <el-form-item label="菜单图标" prop="icon">
              <icon-picker class="flex-1" v-model="formData.icon" />
            </el-form-item>
          </re-col>
          <re-col :value="112">
            <el-form-item v-if="formData.type != MenuEnum.BUTTON" label="路由路径" prop="paths">
              <div class="flex-1">
                <el-input v-model="formData.paths" placeholder="请输入路由路径" clearable />
                <div class="form-tips">访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type == MenuEnum.MENU">
            <el-form-item label="组件路径" prop="component">
              <div class="flex-1">
                <el-autocomplete
                  class="w-full"
                  v-model="formData.component"
                  :fetch-suggestions="querySearch"
                  clearable
                  placeholder="请输入组件路径" />
                <div class="form-tips">访问的组件路径，如：`user/setting`，默认在`views`目录下</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type == MenuEnum.MENU">
            <el-form-item label="选中菜单" prop="selected">
              <div class="flex-1">
                <el-input v-model="formData.selected" placeholder="请输入路由路径" clearable />
                <div class="form-tips">访问详情页面，编辑页面时，菜单高亮显示，如`/consumer/lists`</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type != MenuEnum.CATALOGUE">
            <el-form-item label="权限字符" prop="perms">
              <div class="flex-1">
                <el-input v-model="formData.perms" placeholder="请输入权限字符" clearable />
                <div class="form-tips">将作为server端API验权使用，如`auth.admin/user`，请谨慎修改</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type == MenuEnum.MENU">
            <el-form-item label="路由参数" prop="params">
              <div>
                <div class="flex-1">
                  <el-input v-model="formData.params" placeholder="请输入路由参数" clearable />
                </div>
                <div class="form-tips">访问路由的默认传递参数，如：`{"id": 1, "name": "admin"}`或`id=1&name=admin`</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type == MenuEnum.MENU">
            <el-form-item label="是否缓存" prop="is_cache" required>
              <div>
                <el-radio-group v-model="formData.is_cache">
                  <el-radio :value="1">缓存</el-radio>
                  <el-radio :value="0">不缓存</el-radio>
                </el-radio-group>
                <div class="form-tips">选择缓存则会被`keep-alive`缓存</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type != MenuEnum.BUTTON">
            <el-form-item label="是否显示" prop="is_show" required>
              <div>
                <el-radio-group v-model="formData.is_show">
                  <el-radio :value="1">显示</el-radio>
                  <el-radio :value="0">隐藏</el-radio>
                </el-radio-group>
                <div class="form-tips">选择隐藏则路由将不会出现在侧边栏，但仍然可以访问</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112" v-if="formData.type != MenuEnum.BUTTON">
            <el-form-item label="菜单状态" prop="is_disable" required>
              <div>
                <el-radio-group v-model="formData.is_disable">
                  <el-radio :value="0">正常</el-radio>
                  <el-radio :value="1">停用</el-radio>
                </el-radio-group>
                <div class="form-tips">选择停用则路由将不会出现在侧边栏，也不能被访问</div>
              </div>
            </el-form-item>
          </re-col>
          <re-col :value="112">
            <el-form-item label="菜单排序" prop="sort">
              <div>
                <el-input-number v-model="formData.sort" :min="0" :max="9999" />
                <div class="form-tips">数值越大越排前</div>
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
import IconPicker from "@/components/BaseIcon/picker.vue";
import { MenuEnum } from "@/enums/appEnum";
import { arrayToTree, treeToArray } from "@/utils";
import { authMenuListApi, authMenuAddApi, authMenuEditApi, authMenuDetailApi } from "@/api/modules/role";
import { getModulesKey } from "@/router/utils";
import { ElMessage } from "element-plus";
const emits = defineEmits(["success"]);
onMounted(() => {
  getMenu();
});

const title = ref("添加");
const visible = ref(false);
const curRow = ref<any>({});
const formRef = ref();
const formData = reactive({
  id: "",
  //父级id
  pid: 0,
  //类型
  type: MenuEnum.CATALOGUE,
  //图标
  icon: "",
  //名称
  name: "",
  //排序号
  sort: 0,
  // 路由路径
  paths: "",
  //权限链接
  perms: "",
  //前端组件
  component: "",
  //选中路径
  selected: "",
  //路由参数
  params: "",
  //是否缓存 0=否， 1=是
  is_cache: 0,
  //是否显示 0=否， 1=是
  is_show: 1,
  //是否禁用 0=否， 1=是
  is_disable: 0,
});

const rules = {
  pid: [
    {
      required: true,
      message: "请选择父级菜单",
      trigger: ["blur", "change"],
    },
  ],
  name: [
    {
      required: true,
      message: "请输入菜单名称",
      trigger: "blur",
    },
  ],
  paths: [
    {
      required: true,
      message: "请输入路由地址",
      trigger: "blur",
    },
  ],
  component: [
    {
      required: true,
      message: "请输入组件地址",
      trigger: "blur",
    },
  ],
};

const menuOptions = ref<any[]>([]);

const getMenu = async () => {
  menuOptions.value = [];
  const res: any = await authMenuListApi({ page_type: 0 });
  const menu: any = { id: 0, name: "顶级", children: [] };
  menu.children = arrayToTree(treeToArray(res.data.lists).filter(item => item.type != MenuEnum.BUTTON));
  menuOptions.value.push(menu);
};

// 组件智能提示
const componentsOptions = ref(getModulesKey());
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? componentsOptions.value.filter(item => item.toLowerCase().includes(queryString.toLowerCase()))
    : componentsOptions.value;
  cb(results.map(item => ({ value: item })));
};

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
  const res = await authMenuDetailApi({
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
  authMenuEditApi(formData).then((res: any) => {
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
  authMenuAddApi(formData).then((res: any) => {
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
  curRow.value = {};
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
  getMenu();
}

defineExpose({
  open,
  setFormData,
});
</script>

<style scoped></style>
