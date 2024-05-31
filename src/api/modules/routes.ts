import http from "@/api/index";
import authMenuList from "@/assets/json/authMenu.json";

export const getAsyncRoutes = () => {
  // return http.get("/admin/auth.menu/route");
  return new Promise(resolve => {
    resolve({
      success: true,
      data: authMenuList
    });
  });
};
