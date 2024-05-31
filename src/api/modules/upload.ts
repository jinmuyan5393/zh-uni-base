import http from "@/api/index";
import { uploadHttp } from "@/api/index";
// ==========================文件相关===============================
// 添加分类
export const fileCateAdd = (data: any) => {
  return http.post("/admin/file.file/addCate", data);
};

// 删除分类
export const fileCateDelete = (data: any) => {
  return http.post("/admin/file.file/delCate", data);
};

// 编辑分类
export const fileCateEdit = (data: any) => {
  return http.post("/admin/file.file/editCate", data);
};

// 分类列表
export const fileCateLists = (data: any) => {
  return http.get("/admin/file.file/listCate", data);
};

// 上传文件
export const fileUpload = (data: any) => {
  return uploadHttp.post("/admin/upload/file", data);
};

// 删除文件
export const fileDelete = (data: any) => {
  return http.post("/admin/file.file/delete", data);
};

// 文件列表
export const fileList = (data: any) => {
  return http.get("/admin/file.file/lists", data);
};

// 移动文件
export const fileMove = (data: any) => {
  return http.post("/admin/file.file/move", data);
};

// 重命名文件
export const fileRename = (data: any) => {
  return http.post("/admin/file.file/rename", data);
};

/**
 * 文件下载
 */
export const downloadApi = (data: any) => {
  return http.post("/admin/downLoad/download", data, {
    responseType: "blob",
  });
};
