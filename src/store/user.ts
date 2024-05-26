/*
 * @Date: 2024-04-22 10:29:36
 * @LastEditTime: 2024-04-25 15:06:24
 * @Description:
 */
/*
 * @Date: 2024-04-22 10:29:36
 * @LastEditTime: 2024-04-25 15:00:48
 * @Description:
 */
import { defineStore } from "pinia";
import { ref } from "vue";

const initState = {
  name: "",
  avatar: "",
  role_name: "",
  token: "",
};

export const useUserStore = defineStore(
  "user",
  () => {
    const userInfo = ref<IUserInfo>({ ...initState });

    // 设置用户信息
    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val;
    };

    // 清除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...initState };
    };

    const isLogined = computed(() => !!userInfo.value.token);

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
    };
  },
  {
    persist: true,
  },
);
