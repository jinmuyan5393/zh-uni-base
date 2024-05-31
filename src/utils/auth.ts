import Cookies from "js-cookie";
import { storageLocal } from "@/lib/baseUtils";
import { useUserStoreHook } from "@/store/modules/user";
import { RoleEnum } from "@/enums/appEnum";

export interface DataInfo {
  /** token */
  token: string;
  // /** `accessToken`的过期时间（时间戳） */
  // expires: T;
  // /** 用于调用刷新accessToken的接口时所需的token */
  // refreshToken: string;
  /** 用户名 */
  username?: string;
  avatar?: string;
  /** 当前登陆用户的角色 */
  role_name: "系统管理员";
  // roles?: Array<string>;
}

export const sessionKey = "user-info";
export const TokenKey = "token";

/** 获取`token` */
export function getToken(): DataInfo {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey) ? JSON.parse(Cookies.get(TokenKey)) : storageLocal().getItem(sessionKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: any) {
  const { token, name: username, role_name, avatar } = data;
  function setSessionKey(name: string) {
    useUserStoreHook().SET_USERNAME(name);
    useUserStoreHook().SET_AVATAR(avatar);
    // useUserStoreHook().SET_ROLES(role_name);
    const info = {
      username: name,
      ...data,
    };
    delete info.name;
    storageLocal().setItem(sessionKey, info);
  }

  if (username && role_name) {
    setSessionKey(username);
    localStorage.setItem("token", token);
  } else {
    const username = storageLocal().getItem<DataInfo>(sessionKey)?.username ?? "";
    setSessionKey(username);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
  storageLocal().clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/**
 * 获取账号所属角色类型
 */
export const getRoles = (): Array<RoleEnum> => {
  const userinfo = storageLocal().getItem("user-info");
  return userinfo.role_id;
};

/** 判断账号是否所属当前角色 */
export const isRoleIn = (val: RoleEnum): boolean => {
  return getRoles().includes(val);
};
