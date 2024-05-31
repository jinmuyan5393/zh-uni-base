import { ref } from "vue";
import { getConfig } from "@/config";
import { useLayout } from "./useLayout";
import { themeColorsType } from "../types";
import { useGlobal } from "@/lib/baseUtils";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";

export interface multipleScopeVarsOptions {
  /** 预设主题色的名称 */
  scopeName?: string;
  /** 变量文件内容不应该夹带样式代码，设定上只需存在变量 */
  path?: any;
  /** `varsContent` 参数等效于 `path` 文件的内容，可以让 `defaultPrimaryColor` 与 `@primary-color` 值只写一遍，`varsContent` 与 `path` 必须选一个使用 */
  varsContent?: string;
}

/** hex转rgb */
function hexToRgb(str) {
  const hxs = str.replace("#", "").match(/../g);
  for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);
  return hxs;
}

/** rgb转hex */
function rgbToHex(a, b, c) {
  const hexs = [a.toString(16), b.toString(16), c.toString(16)];
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
  }
  return `#${hexs.join("")}`;
}

/** 加深颜色值 */
export function darken(color, level) {
  const rgbc = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));
  return rgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

/** 变浅颜色值 */
export function lighten(color, level) {
  const rgbc = hexToRgb(color);
  for (let i = 0; i < 3; i++)
    rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);
  return rgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

function toggleTheme(options: multipleScopeVarsOptions): void {
  // 将className添加到html标签上
  console.log(options);
}

export function useDataThemeChange() {
  const { layoutTheme, layout } = useLayout();
  const themeColors = ref<Array<themeColorsType>>([
    /* 道奇蓝（默认） */
    { color: "#1b2a47", themeColor: "default" },
    /* 亮白色 */
    { color: "#ffffff", themeColor: "light" },
    /* 猩红色 */
    { color: "#f5222d", themeColor: "dusk" },
    /* 橙红色 */
    { color: "#fa541c", themeColor: "volcano" },
    /* 金色 */
    { color: "#fadb14", themeColor: "yellow" },
    /* 绿宝石 */
    { color: "#13c2c2", themeColor: "mingQing" },
    /* 酸橙绿 */
    { color: "#52c41a", themeColor: "auroraGreen" },
    /* 深粉色 */
    { color: "#eb2f96", themeColor: "pink" },
    /* 深紫罗兰色 */
    { color: "#722ed1", themeColor: "saucePurple" }
  ]);

  const { $storage } = useGlobal<GlobalPropertiesApi>();
  const dataTheme = ref<boolean>($storage?.layout?.darkMode);
  const body = document.documentElement as HTMLElement;

  /** 设置导航主题色 */
  function setLayoutThemeColor(theme = getConfig().Theme ?? "default") {
    layoutTheme.value.theme = theme;
    toggleTheme({
      scopeName: `layout-theme-${theme}`
    });
    $storage.layout = {
      layout: layout.value,
      theme,
      darkMode: dataTheme.value,
      sidebarStatus: $storage.layout?.sidebarStatus,
      epThemeColor: $storage.layout?.epThemeColor
    };

    if (theme === "default" || theme === "light") {
      setEpThemeColor(getConfig().EpThemeColor);
    } else {
      const colors = themeColors.value.find(v => v.themeColor === theme);
      setEpThemeColor(colors.color);
    }
  }

  function setPropertyPrimary(mode: string, i: number, color: string) {
    document.documentElement.style.setProperty(
      `--el-color-primary-${mode}-${i}`,
      dataTheme.value ? darken(color, i / 10) : lighten(color, i / 10)
    );
  }

  /** 设置 `element-plus` 主题色 */
  const setEpThemeColor = (color: string) => {
    useEpThemeStoreHook().setEpThemeColor(color);
    document.documentElement.style.setProperty("--el-color-primary", color);
    for (let i = 1; i <= 2; i++) {
      setPropertyPrimary("dark", i, color);
    }
    for (let i = 1; i <= 9; i++) {
      setPropertyPrimary("light", i, color);
    }
  };

  /** 日间、夜间主题切换 */
  function dataThemeChange() {
    /* 如果当前是light夜间主题，默认切换到default主题 */
    if (useEpThemeStoreHook().epTheme === "light" && dataTheme.value) {
      setLayoutThemeColor("default");
    } else {
      setLayoutThemeColor(useEpThemeStoreHook().epTheme);
    }

    if (dataTheme.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return {
    body,
    dataTheme,
    layoutTheme,
    themeColors,
    dataThemeChange,
    setEpThemeColor,
    setLayoutThemeColor
  };
}
