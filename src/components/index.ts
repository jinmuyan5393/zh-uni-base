import type { App } from "vue";

import * as Icons from "@element-plus/icons-vue";

// 全局注册按钮级别权限组件
import { Auth } from "@/components/ReAuth";

// 下拉框组件
import CommonSelect from "@/components/CommonSelect/index.vue";

// 搜索组件
import SearchForm from "@/components/SearchForm/index.vue";

// 表格组件
import ComTable from "@/components/ComTable/index.vue";

// col组件
import ReCol from "@/components/ReCol/index";

// 全局图标(element-icons/local-icon)
import BaseIcon from "@/components/BaseIcon/index.vue";

// 全局dialog
import popup from "@/components/popup/index.vue";

import delWrap from "@/components/del-wrap/index.vue";

import overflowTooltip from "@/components/overflow-tooltip/index.vue";

import popoverInput from "@/components/popover-input/index.vue";

import pagination from "@/components/pagination/index.vue";

import materialPicker from "@/components/material/picker.vue";
import fileItem from "@/components/material/file.vue";

import upload from "@/components/upload/index.vue";

export function installComponent(app: App<Element>) {
  app.component("Auth", Auth);
  app.component("CommonSelect", CommonSelect);
  app.component("SearchForm", SearchForm);
  app.component("ComTable", ComTable);
  app.component("ReCol", ReCol);
  app.component("BaseIcon", BaseIcon);
  app.component("popup", popup);
  app.component("delWrap", delWrap);
  app.component("overflowTooltip", overflowTooltip);
  app.component("popoverInput", popoverInput);
  app.component("pagination", pagination);
  app.component("upload", upload);
  app.component("materialPicker", materialPicker);
  app.component("fileItem", fileItem);
  for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component);
  }
}

export default installComponent;
