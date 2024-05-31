import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/home",
  title: "首页",
  rank: 9999,
  icon: "el-icon-HomeFilled",
  children: [
    {
      path: "/home",
      name: "Welcome",
      component: () => import("@/views/home/index.vue"),
      title: $t("menus.hshome")
    },
    {
      path: "/personInfo",
      name: "personInfo",
      showLink: "False",
      component: () => import("@/views/personInfo/index.vue"),
      title: $t("buttons.hsUserinfo")
    }
  ]
};
