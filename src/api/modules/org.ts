import http from "@/api/index";

// ==========================岗位===============================
// 岗位列表全部
export const authJobAllApi = (data: any) => {
  return http.get("/admin/dept.jobs/all", data);
};

// 岗位列表
export const authJobListApi = (data: any) => {
  return http.get("/admin/dept.jobs/lists", data);
};

// 添加岗位
export const authJobAddApi = (data: any) => {
  return http.post("/admin/dept.jobs/add", data);
};

// 编辑岗位
export const authJobEditApi = (data: any) => {
  return http.post("/admin/dept.jobs/edit", data);
};

// 岗位详情
export const authJobDetailApi = (data: any) => {
  return http.get("/admin/dept.jobs/detail", data);
};

// 删除岗位
export const authJobDeleteApi = (data: any) => {
  return http.post("/admin/dept.jobs/delete", data);
};

// ==========================部门===============================
// 部门列表全部
export const authDeptListApi = (data: any) => {
  return http.get("/admin/dept.dept/lists", data);
};

// 添加部门
export const authDeptAddApi = (data: any) => {
  return http.post("/admin/dept.dept/add", data);
};

// 编辑部门
export const authDeptEditApi = (data: any) => {
  return http.post("/admin/dept.dept/edit", data);
};

// 部门详情
export const authDeptDetailApi = (data: any) => {
  return http.get("/admin/dept.dept/detail", data);
};

// 删除部门
export const authDeptDeleteApi = (data: any) => {
  return http.post("/admin/dept.dept/delete", data);
};
