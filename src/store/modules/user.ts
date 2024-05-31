import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageLocal } from "@/lib/baseUtils";
import { getLogin, refreshTokenApi } from "@/api/modules/user";
import { RefreshTokenResult } from "@/api/modules/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";

export const useUserStore = defineStore({
  id: "zh-user",
  state: (): userType => ({
    // 用户名
    username: storageLocal().getItem<DataInfo>(sessionKey)?.username ?? "",
    // 头像
    avatar: storageLocal().getItem<DataInfo>(sessionKey)?.avatar ?? "",
    // 页面级别权限
    roles: [], // storageSession().getItem<DataInfo>(sessionKey)?.roles ?? []
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(data: any) {
      return new Promise<any>((resolve, reject) => {
        getLogin(data)
          .then((res: any) => {
            if (res.code) {
              setToken(res.data);
              resolve(res);
            } else {
              resolve(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
