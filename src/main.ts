/*
 * @Date: 2024-04-23 18:05:04
 * @LastEditTime: 2024-04-25 15:18:01
 * @Description:
 */
import { createSSRApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { routeInterceptor, requestInterceptor, prototypeInterceptor } from "./interceptors";
import "virtual:uno.css";
import "@/style/index.scss";

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  app.use(routeInterceptor);
  app.use(requestInterceptor);
  app.use(prototypeInterceptor);
  return {
    app,
  };
}
