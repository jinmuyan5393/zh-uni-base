/*
 * @Author: jinmuyan888 jinmuyan5393@163.com
 * @Date: 2024-04-22 10:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 09:16:40
 * @FilePath: \photo-analysise:\AAA\trans-disp-sys\ShipperApp\pages.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";

export default defineUniPages({
  globalStyle: {
    navigationStyle: "default",
    navigationBarTitleText: "调度管理-托运人端",
    navigationBarBackgroundColor: "#f8f8f8",
    navigationBarTextStyle: "black",
    backgroundColor: "#FFFFFF",
  },
  easycom: {
    autoscan: true,
    custom: {
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue",
    },
  },
  tabBar: {
    color: "#999999",
    selectedColor: "#1296db",
    backgroundColor: "#F8F8F8",
    borderStyle: "black",
    height: "50px",
    fontSize: "10px",
    iconWidth: "24px",
    spacing: "3px",
    list: [
      {
        iconPath: "static/tabbar/send.png",
        selectedIconPath: "static/tabbar/send-active.png",
        pagePath: "pages/index/index",
        text: "发货",
      },
      {
        iconPath: "static/tabbar/order.png",
        selectedIconPath: "static/tabbar/order-active.png",
        pagePath: "pages/orderList/orderList",
        text: "列表",
      },
      {
        iconPath: "static/tabbar/my.png",
        selectedIconPath: "static/tabbar/my-active.png",
        pagePath: "pages/my/my",
        text: "我的",
      },
    ],
  },
});
