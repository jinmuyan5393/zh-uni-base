import { getCurrentInstance } from "vue";
export function useGlobal<T>(): T {
  const {
    appContext: {
      config: { globalProperties: t },
    },
  } = getCurrentInstance();
  return t as T;
}
