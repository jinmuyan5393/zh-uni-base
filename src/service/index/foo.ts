/*
 * @Date: 2024-04-22 10:29:36
 * @LastEditTime: 2024-04-25 11:19:32
 * @Description:
 */
/*
 * @Date: 2024-04-19 16:24:20
 * @LastEditTime: 2024-04-20 18:58:40
 * @Description:
 */
import { http } from "@/utils/http";
import type { IFooItem } from "./foo.d";

export { IFooItem };

/** get 请求 */
export const getFooAPI = (name: string) => {
  return http<IFooItem>({
    url: `/foo`,
    method: "GET",
    query: { name },
  });
};

/** post 请求 */
export const postFooAPI = (name: string) => {
  return http<IFooItem>({
    url: `/foo`,
    method: "POST",
    query: { name }, // post 请求也支持 query
    data: { name },
  });
};

/** post 请求 */
export const loginAPI = (data: any) => {
  return http({
    url: `/admin/login/account`,
    method: "POST",
    data,
  });
};
