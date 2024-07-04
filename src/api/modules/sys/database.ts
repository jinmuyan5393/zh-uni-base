import http from "@/api/index";

export const settingSystemTableApi = (data: any) => {
  return http.get("/admin/setting.system.system/tables", data);
};

export const settingSystemTablesInfoApi = (data: any) => {
  return http.get("/admin/setting.system.system/tablesInfo", data);
};
