import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    title: "登录",
    rank: 101,
    showLink: "False"
  },
  {
    path: "/redirect",
    component: Layout,
    showLink: "False",
    title: $t("status.hsLoad"),
    rank: 102,
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] as Array<RouteConfigsTable>;
