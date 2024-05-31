import http from "@/api/index";
// ==========================菜单===============================
// 菜单列表
export const authMenuListApi = (data: any) => {
  return http.get("/admin/auth.menu/lists", data);
};

// 全部菜单
export const authMenuAllApi = (data: any) => {
  return http.get("/admin/auth.menu/all", data);
};

// 添加菜单
export const authMenuAddApi = (data: any) => {
  return http.post("/admin/auth.menu/add", data);
};

// 编辑菜单
export const authMenuEditApi = (data: any) => {
  return http.post("/admin/auth.menu/edit", data);
};

// 菜单详情
export const authMenuDetailApi = (data: any) => {
  return http.get("/admin/auth.menu/detail", data);
};

// 删除菜单
export const authMenuDeleteApi = (data: any) => {
  return http.post("/admin/auth.menu/delete", data);
};

// =============================管理员==============================
// 管理员列表
export const authAdminListApi = (data: any) => {
  return http.get("/admin/auth.admin/lists", data);
};

// 添加管理员
export const authAdminAddApi = (data: any) => {
  return http.post("/admin/auth.admin/add", data);
};

// 编辑管理员
export const authAdminEditApi = (data: any) => {
  return http.post("/admin/auth.admin/edit", data);
};

// 管理员详情
export const authAdminDetailApi = (data: any) => {
  return http.get("/admin/auth.admin/detail", data);
};

// 管理员详情
export const authAdminMySelfApi = () => {
  return http.get("/admin/auth.admin/mySelf");
};

// 编辑个人资料
export const authAdminEditSelfApi = (data: any) => {
  return http.post("/admin/auth.admin/editSelf", data);
};

// 删除管理员
export const authAdminDeleteApi = (data: any) => {
  return http.post("/admin/auth.admin/delete", data);
};

// =======================角色=====================================
// 角色列表
export const authRoleListApi = (data: any) => {
  return http.get("/admin/auth.role/lists", data);
};

// 角色列表全部
export function authRoleAllApi() {
  return http.get("/admin/auth.role/all");
}

// 添加角色
export const authRoleAddApi = (data: any) => {
  return http.post("/admin/auth.role/add", data);
};

// 编辑角色
export const authRoleEditApi = (data: any) => {
  return http.post("/admin/auth.role/edit", data);
};

// 角色详情
export const authRoleDetailApi = (data: any) => {
  return http.get("/admin/auth.role/detail", data);
};

// 删除角色
export const authRoleDeleteApi = (data: any) => {
  return http.post("/admin/auth.role/delete", data);
};

// 个人中心详情
export const authRoleCenterApi = () => {
  return http.get("/admin/auth_role/center");
};

// 设置自身为空闲状态
export const setLeaveStatusApi = () => {
  return http.post("/admin/center.operator_center/setLeaveStatus");
};

// 设置自身为工作状态
export const setWorkeStatusApi = () => {
  return http.post("/admin/center.operator_center/setWorkeStatus");
};
