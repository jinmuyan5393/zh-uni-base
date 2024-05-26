import { uniFileUpload, http } from "@/utils/http";

/** 上传图片 */
export const fileAPI = (filePath: any, data: any) => {
  return uniFileUpload({
    url: `/admin/upload/file`,
    filePath,
    name: "file",
    formData: data,
  });
};

/** 获取个人中心 */
export const centerAPI = () => {
  return http({
    url: `/admin/auth_role/center`,
    method: "GET",
  });
};
/** 修改个人信息 */
export const editSelfAPI = (data: any) => {
  return http({
    url: `/admin/auth_role/editSelf`,
    method: "POST",
    data,
  });
};
/** 修改密码 */
export const changePassWorld = (data: any) => {
  return http({
    url: `/admin/auth_role/changePassWorld`,
    method: "POST",
    data,
  });
};
