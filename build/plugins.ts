/*
 * @Date: 2024-04-17 14:45:15
 * @LastEditTime: 2024-04-23 14:15:15
 * @Description:
 */
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { configCompressPlugin } from "./compress";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export function getPluginsList(command: string, VITE_COMPRESSION: any) {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve("locales/**")],
    }),
    // jsx、tsx语法支持
    vueJsx(),
    configCompressPlugin(VITE_COMPRESSION),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    viteBuildInfo(),
    // svg组件化支持
    svgLoader(),
    createSvgIconsPlugin({
      // 配置路径在你的src里的svg存放文件
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "local-icon-[dir]-[name]",
    }),
    // 打包分析
    lifecycle === "report" ? visualizer({ open: true, brotliSize: true, filename: "report.html" }) : null,
  ];
}
