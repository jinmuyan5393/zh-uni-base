import { RouterHistory, RouteRecordRaw, RouteComponent, createWebHistory, createWebHashHistory } from "vue-router";
import { router } from "./index";
import { isProxy, toRaw } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import { isString, cloneDeep, intersection, isAllEmpty, isIncludeAllChildren } from "@/lib/baseUtils";
import { menuType } from "@/layout/types";
import { buildHierarchyTree } from "@/utils/tree";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
const IFrame = () => import("@/layout/frameView.vue");
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");

// 动态路由
import { getAsyncRoutes } from "@/api/modules/routes";

export function getModulesKey() {
  return Object.keys(modulesRoutes).map(item => item.replace("/src/views/", "").replace(".vue", ""));
}

function handRank(routeInfo: any) {
  const { name, path, parentId, rank } = routeInfo;
  return isAllEmpty(parentId) ? (isAllEmpty(rank) || (rank === 0 && name !== "Home" && path !== "/") ? true : false) : false;
}

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
    if (handRank(v)) v.rank = index + 2;
  });
  return arr.sort((a: { rank: number }, b: { rank: number }) => {
    return b?.rank - a?.rank;
  });
}

/** 过滤meta中showLink为false的菜单 */
function filterTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: any) => v?.showLink !== "False");
  newTree.forEach((v: { children }) => v.children && (v.children = filterTree(v.children)));
  return newTree;
}

/** 判断两个数组彼此是否存在相同值 */
function isOneOfArray(a: Array<string>, b: Array<string>) {
  return Array.isArray(a) && Array.isArray(b) ? (intersection(a, b).length > 0 ? true : false) : true;
}

/** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
function getParentPaths(value: string, routes: RouteRecordRaw[], key = "path") {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], value: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 返回父级path
      if (item[key] === value) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, value, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, value, []);
}

/** 查找对应 `path` 的路由信息 */
function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
  let res = routes.find((item: { path: string }) => item.path == path);
  if (res) {
    return isProxy(res) ? toRaw(res) : res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].children instanceof Array && routes[i].children.length > 0) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return isProxy(res) ? toRaw(res) : res;
        }
      }
    }
    return null;
  }
}

function addPathMatch() {
  if (!router.hasRoute("pathMatch")) {
    router.addRoute({
      path: "/:pathMatch(.*)",
      name: "pathMatch",
      redirect: "/error/404",
    });
  }
}

/** 处理动态路由（后端返回的路由） */
function handleAsyncRoutes(routeList) {
  if (routeList.length === 0) {
    usePermissionStoreHook().handleWholeMenus([]);
  } else {
    formatFlatteningRoutes(addAsyncRoutes(routeList)).map((v: RouteRecordRaw) => {
      // 防止重复添加路由
      if (router.options.routes[0].children.findIndex(value => value.path === v.path) !== -1) {
        return;
      } else {
        // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
        router.options.routes[0].children.push(v);
        // 最终路由进行升序
        ascending(router.options.routes[0].children);
        if (!router.hasRoute(v?.name)) router.addRoute(v);
        const flattenRouters: any = router.getRoutes().find(n => n.path === "/");
        router.addRoute(flattenRouters);
      }
    });
    usePermissionStoreHook().handleWholeMenus(routeList);
  }
  addPathMatch();
}

/** 初始化路由（`new Promise` 写法防止在异步请求中造成无限循环）*/
function initRouter() {
  return new Promise(resolve => {
    getAsyncRoutes().then(({ data }) => {
      // 将后台的菜单转换为前端的格式
      const menuList = formatBackMenus(data as any);
      handleAsyncRoutes(cloneDeep(menuList));
      resolve(router);
    });
  });
}

/**
 * 将后台的菜单转换为前端的格式
 * @param menus 后台数据
 */
function formatBackMenus(menus: any[], parentPath = "") {
  const menuList = [];
  menus.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      item.children = formatBackMenus(item.children, item.paths);
    }
    const menuItem = {
      ...item,
      backstage: true,
      showLink: item.is_show === 1 ? "True" : "False",
      rank: item.sort,
      path: parentPath ? `/${parentPath}/${item.paths}` : `/${item.paths}`,
      title: item.name,
      name: parentPath ? `${parentPath}.${item.paths}` : `${item.paths}`,
    };
    menuList.push(menuItem);
  });
  return menuList;
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList.slice(0, i + 1).concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      });
    } else {
      newRoutesList[0]?.children.push({ ...v });
    }
  });
  return newRoutesList;
}

/** 处理缓存路由（添加、删除、刷新） */
function handleAliveRoute({ name }: ToRouteType, mode?: string) {
  switch (mode) {
    case "add":
      usePermissionStoreHook().cacheOperate({
        mode: "add",
        name,
      });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name,
      });
      break;
    case "refresh":
      usePermissionStoreHook().cacheOperate({
        mode: "refresh",
        name,
      });
      break;
    default:
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name,
      });
      useTimeoutFn(() => {
        usePermissionStoreHook().cacheOperate({
          mode: "add",
          name,
        });
      }, 100);
  }
}

/** 过滤后端传来的动态路由 重新生成规范路由 替换component为前端组件 */
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length) return;
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: any) => {
    // 将backstage属性加入meta，标识此路由为后端返回路由
    v.backstage = true;
    // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path；如果子级存在且父级的redirect属性存在，取存在的redirect属性，会覆盖默认值
    if (v?.children && v.children.length && !v.redirect) v.redirect = v.children[0].path;
    // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name；如果子级存在且父级的name属性存在，取存在的name属性，会覆盖默认值（注意：测试中发现父级的name不能和子级name重复，如果重复会造成重定向无效（跳转404），所以这里给父级的name起名的时候后面会自动加上`Parent`，避免重复）
    if (v?.children && v.children.length && !v.name) {
      v.name = (v.children[0].name as string) + "Parent";
    }
    if (v?.frameSrc) {
      v.component = IFrame;
    } else {
      // 对后端传component组件路径和不传做兼容
      //（如果后端传component组件路径，那么path可以随便写，
      // 如果不传，component组件路径会跟path保持一致）
      const index = v?.component
        ? modulesRoutesKeys.findIndex(ev => ev.includes(v.component as any))
        : modulesRoutesKeys.findIndex(ev => ev.includes(v.path));
      v.component = modulesRoutes[modulesRoutesKeys[index]];
    }
    if (v?.children && v.children.length) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
}

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
function getHistoryMode(routerHistory): RouterHistory {
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash") {
      return createWebHashHistory("");
    } else if (leftMode === "h5") {
      return createWebHistory("");
    }
  } //has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash") {
      return createWebHashHistory(rightMode);
    } else if (leftMode === "h5") {
      return createWebHistory(rightMode);
    }
  }
}

/** 获取当前页面按钮级别的权限 */
function getAuths(): Array<string> {
  return router.currentRoute.value.meta.auths as Array<string>;
}

/** 是否有按钮级别的权限 */
function hasAuth(value: string | Array<string>): boolean {
  if (!value) return false;
  /** 从当前路由的`meta`字段里获取按钮级别的所有自定义`code`值 */
  const metaAuths = getAuths();
  if (!metaAuths) return false;
  const isAuths = isString(value) ? metaAuths.includes(value) : isIncludeAllChildren(value, metaAuths);
  return isAuths ? true : false;
}

/** 获取所有菜单中的第一个菜单（顶级菜单）*/
function getTopMenu(tag = false): menuType {
  const firstMenu = usePermissionStoreHook().wholeMenus[0];
  if (!firstMenu) return { path: "/", title: "首页" };
  const topMenu = firstMenu.children && firstMenu.children.length > 0 ? firstMenu.children[0] : firstMenu;
  tag && useMultiTagsStoreHook().handleTags("push", topMenu);
  return topMenu;
}

export {
  hasAuth,
  getAuths,
  ascending,
  filterTree,
  initRouter,
  getTopMenu,
  addPathMatch,
  isOneOfArray,
  getHistoryMode,
  addAsyncRoutes,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes,
};
