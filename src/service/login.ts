import { http } from "@/utils/http";

/** post 请求 */
export const loginAPI = (data: any) => {
  return http({
    url: `/admin/login/account`,
    method: "POST",
    data,
  });
};
