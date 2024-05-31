import http from "@/api/index";

export type UserResult = {
  code: number;
  msg: string;
  data: {
    /** 用户名 */
    name: string;
    /** 当前登陆用户的头像 */
    avatar: string;
    /** 当前登陆用户的角色 */
    role_name: string;
    /** `token` */
    token: string;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: string;
  };
};

/** 登录 */
export const getLogin = (data?: any) => {
  return http.post<UserResult>("/admin/login/account", data);
};

/** 刷新token */
export const refreshTokenApi = (data?: any) => {
  // return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
  return new Promise<RefreshTokenResult>(resolve => {
    if (data?.refreshToken) {
      resolve({
        success: true,
        data: {
          accessToken: "eyJhbGciOiJIUzUxMiJ9.newAdmin",
          refreshToken: "eyJhbGciOiJIUzUxMiJ9.newAdminRefresh",
          // `expires`选择这种日期格式是为了方便调试，后端直接设置时间戳或许更方便（每次都应该递增）。如果后端返回的是时间戳格式，前端开发请来到这个目录`src/utils/auth.ts`，把第`38`行的代码换成expires = data.expires即可。
          expires: "2023/10/30 23:59:59",
        },
      });
    } else {
      resolve({
        success: false,
        data: {},
      } as RefreshTokenResult);
    }
  });
};
