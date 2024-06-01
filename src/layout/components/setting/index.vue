<script setup lang="ts">
import { ref, unref, watch, reactive, computed, nextTick, onBeforeMount } from "vue";
import { useGlobal, useDark } from "@/lib/baseUtils";
import { debounce, storageLocal, storageSess } from "@zhonghe/utils";
import { getConfig } from "@/config";
import { useRouter } from "vue-router";
import panel from "../panel/index.vue";
import { emitter } from "@/utils/mitt";
import { resetRouter } from "@/router";
import { removeToken } from "@/utils/auth";
import { routerArrays } from "@/layout/types";
import { useNav } from "@/layout/hooks/useNav";
import { useAppStoreHook } from "@/store/modules/app";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

const router = useRouter();
const { isDark } = useDark();
const { device } = useNav();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const mixRef = ref();
const verticalRef = ref();
const horizontalRef = ref();

const { layoutTheme, themeColors, toggleTheme, setEpThemeColor, setLayoutThemeColor } = useDataThemeChange();

/* body添加layout属性，作用于src/style/sidebar.scss */
if (unref(layoutTheme)) {
  const layout = unref(layoutTheme).layout;
  const theme = unref(layoutTheme).theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`,
  });
  setLayoutModel(layout);
}

const logoVal = ref($storage.configure?.showLogo ?? true);

const settings = reactive({
  greyVal: $storage.configure.grey,
  weakVal: $storage.configure.weak,
  tabsVal: $storage.configure.hideTabs,
  showLogo: $storage.configure.showLogo,
  showModel: $storage.configure.showModel,
  multiTagsCache: $storage.configure.multiTagsCache,
});

const getThemeColorStyle = computed(() => {
  return color => {
    return { background: color };
  };
});

/** 当网页为暗黑模式时不显示亮白色切换选项 */
const showThemeColors = computed(() => {
  return themeColor => {
    return themeColor === "light" && isDark.value ? false : true;
  };
});

function storageConfigureChange<T>(key: string, val: T): void {
  const storageConfigure = $storage.configure;
  storageConfigure[key] = val;
  $storage.configure = storageConfigure;
}

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

/** 灰色模式设置 */
const greyChange = (value): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  storageConfigureChange("grey", value);
};

/** 色弱模式设置 */
const weekChange = (value): void => {
  toggleClass(settings.weakVal, "html-weakness", document.querySelector("html"));
  storageConfigureChange("weak", value);
};

const tagsChange = () => {
  const showVal = settings.tabsVal;
  storageConfigureChange("hideTabs", showVal);
  emitter.emit("tagViewsChange", showVal as unknown as string);
};

const multiTagsCacheChange = () => {
  const multiTagsCache = settings.multiTagsCache;
  storageConfigureChange("multiTagsCache", multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};

/** 清空缓存并返回登录页 */
function onReset() {
  removeToken();
  storageLocal.clear();
  storageSess.clear();
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  useAppStoreHook().setLayout(Layout);
  setEpThemeColor(EpThemeColor);
  useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  router.push("/login");
  useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
  resetRouter();
}

/** 侧边栏Logo */
function logoChange() {
  unref(logoVal) ? storageConfigureChange("showLogo", true) : storageConfigureChange("showLogo", false);
  emitter.emit("logoChange", unref(logoVal));
}

function setFalse(Doms): any {
  Doms.forEach(v => {
    toggleClass(false, "is-select", unref(v));
  });
}

/** 主题色 激活选择项 */
const getThemeColor = computed(() => {
  return current => {
    if (current === layoutTheme.value.theme && layoutTheme.value.theme !== "light") {
      return "#fff";
    } else if (current === layoutTheme.value.theme && layoutTheme.value.theme === "light") {
      return "#1d2b45";
    } else {
      return "transparent";
    }
  };
});

/** 设置导航模式 */
function setLayoutModel(layout: string) {
  layoutTheme.value.layout = layout;
  window.document.body.setAttribute("layout", layout);
  $storage.layout = {
    layout,
    theme: layoutTheme.value.theme,
    darkMode: $storage.layout?.darkMode,
    sidebarStatus: $storage.layout?.sidebarStatus,
    epThemeColor: $storage.layout?.epThemeColor,
  };
  useAppStoreHook().setLayout(layout);
}

watch($storage, ({ layout }) => {
  switch (layout["layout"]) {
    case "vertical":
      toggleClass(true, "is-select", unref(verticalRef));
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "horizontal":
      toggleClass(true, "is-select", unref(horizontalRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "mix":
      toggleClass(true, "is-select", unref(mixRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([horizontalRef]), 50);
      break;
  }
});

onBeforeMount(() => {
  /* 初始化项目配置 */
  nextTick(() => {
    settings.greyVal && document.querySelector("html")?.setAttribute("class", "html-grey");
    settings.weakVal && document.querySelector("html")?.setAttribute("class", "html-weakness");
    settings.tabsVal && tagsChange();
  });
});
</script>

<template>
  <panel>
    <el-divider>导航栏模式</el-divider>
    <div class="layout-box">
      <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div :class="['layout-item layout-vertical', { 'is-active': layoutTheme.layout === 'vertical' }]" @click="setLayoutModel('vertical')">
          <div class="layout-dark" />
          <div class="layout-container">
            <div class="layout-light" />
            <div class="layout-content" />
          </div>
          <BaseIcon v-if="layoutTheme.layout == 'vertical'" name="el-icon-CircleCheckFilled" />
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="横向" placement="top" :show-after="200" v-if="device !== 'mobile'">
        <div :class="['layout-item layout-transverse', { 'is-active': layoutTheme.layout == 'horizontal' }]" @click="setLayoutModel('horizontal')">
          <div class="layout-dark" />
          <div class="layout-content" />
          <BaseIcon v-if="layoutTheme.layout == 'horizontal'" name="el-icon-CircleCheckFilled" />
        </div>
      </el-tooltip>
    </div>
    <el-divider>全局主题</el-divider>
    <ul class="theme-color">
      <li
        v-for="(item, index) in themeColors"
        :key="index"
        v-show="showThemeColors(item.themeColor)"
        :style="getThemeColorStyle(item.color)"
        @click="setLayoutThemeColor(item.themeColor)">
        <BaseIcon name="el-icon-Check" style="margin: 0.1em 0.1em 0 0" :size="17" :color="getThemeColor(item.themeColor)" />
      </li>
    </ul>
    <ul class="setting">
      <!-- <li style="margin-top: 0">
        <span class="dark:text-white">暗黑模式</span>
        <el-switch
          v-model="settings.greyVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="greyChange"
        />
      </li> -->
      <li>
        <span class="dark:text-white">主题色</span>
        <el-switch v-model="settings.greyVal" inline-prompt inactive-color="#a6a6a6" active-text="开" inactive-text="关" @change="greyChange" />
      </li>
      <li>
        <span class="dark:text-white">灰色模式</span>
        <el-switch v-model="settings.greyVal" inline-prompt inactive-color="#a6a6a6" active-text="开" inactive-text="关" @change="greyChange" />
      </li>
      <li>
        <span class="dark:text-white">色弱模式</span>
        <el-switch v-model="settings.weakVal" inline-prompt inactive-color="#a6a6a6" active-text="开" inactive-text="关" @change="weekChange" />
      </li>
    </ul>

    <el-divider>界面显示</el-divider>
    <ul class="setting">
      <li>
        <span class="dark:text-white">隐藏标签页</span>
        <el-switch v-model="settings.tabsVal" inline-prompt inactive-color="#a6a6a6" active-text="开" inactive-text="关" @change="tagsChange" />
      </li>
      <li>
        <span class="dark:text-white">侧边栏Logo</span>
        <el-switch
          v-model="logoVal"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="logoChange" />
      </li>
      <li>
        <span class="dark:text-white">标签页持久化</span>
        <el-switch
          v-model="settings.multiTagsCache"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="multiTagsCacheChange" />
      </li>
    </ul>

    <el-divider />
    <el-button type="danger" style="width: 90%; margin: 24px 15px" @click="onReset">
      <BaseIcon name="el-icon-Refresh" />
      清空缓存并返回登录页
    </el-button>
  </panel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 14px;
  font-weight: 500;
}

.is-select {
  border: 2px solid var(--el-color-primary);
}

.setting {
  width: 100%;
  font-size: 14px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 20px;
  }
}

.layout-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 25px 40px 0;
  .layout-item {
    position: relative;
    box-sizing: border-box;
    width: 100px;
    height: 70px;
    padding: 6px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--el-border-color-dark);
    transition: all 0.2s;
    .layout-dark {
      background-color: var(--el-color-primary);
      border-radius: 3px;
    }
    .layout-light {
      background-color: var(--el-color-primary-light-5);
      border-radius: 3px;
    }
    .layout-content {
      background-color: var(--el-color-primary-light-8);
      border: 1px dashed var(--el-color-primary);
      border-radius: 3px;
    }
    .el-icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: var(--el-color-primary);
      transition: all 0.2s;
    }
    &:hover {
      box-shadow: 0 0 5px 1px var(--el-text-color-secondary);
    }
  }
  .is-active {
    box-shadow: 0 0 0 2px var(--el-color-primary) !important;
  }
  .layout-vertical {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .layout-dark {
      width: 20%;
    }
    .layout-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 72%;
      .layout-light {
        height: 20%;
      }
      .layout-content {
        height: 67%;
      }
    }
  }
  .layout-classic {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;
    .layout-dark {
      height: 22%;
    }
    .layout-container {
      display: flex;
      justify-content: space-between;
      height: 70%;
      .layout-light {
        width: 20%;
      }
      .layout-content {
        width: 70%;
      }
    }
  }
  .layout-transverse {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      height: 20%;
    }
    .layout-content {
      height: 67%;
    }
  }
  .layout-columns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      width: 14%;
    }
    .layout-light {
      width: 17%;
    }
    .layout-content {
      width: 55%;
    }
  }
}
.zh-datatheme {
  display: block;
  width: 100%;
  height: 50px;
  padding-top: 25px;
  text-align: center;
}

.zh-theme {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 50px;
  margin-top: 25px;

  li {
    position: relative;
    width: 18%;
    height: 45px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}

.theme-color {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-top: 20px;

  li {
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;

    &:nth-child(2) {
      border: 1px solid #ddd;
    }
  }
}
</style>
