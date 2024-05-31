import { $t } from "@/plugins/i18n";

export default {
  path: "/error",
  redirect: "/error/403",
  icon: "informationLine",
  title: $t("menus.hsabnormal"),
  showLink: "False",
  rank: 9,
  children: [
    {
      path: "/error/403",
      name: "403",
      component: () => import("@/views/error/403.vue"),
      title: $t("menus.hsfourZeroOne")
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404.vue"),
      title: $t("menus.hsfourZeroFour")
    },
    {
      path: "/error/500",
      name: "500",
      component: () => import("@/views/error/500.vue"),
      title: $t("menus.hsFive")
    }
  ]
};
