/*
 * @Date: 2024-04-25 15:11:35
 * @LastEditTime: 2024-04-29 09:55:06
 * @Description:
 */

import { unix } from "dayjs";

/** 提示 */
export function Toast(title: string, callback?: any, icon?: any) {
  uni.showToast({
    title,
    icon: icon || "none",
    complete: () => {
      setTimeout(() => {
        callback && callback();
      }, 300);
    },
  });
}

/** 拼接文件路径 */
export function getFileUrl(url: string) {
  if (url.startsWith("http") || url === "") {
    return url;
  }
  return import.meta.env.VITE_SERVER_BASEURL + "/" + url;
}

/**
 * @description 将秒转为对应的时间格式
 * @param  second 秒
 * @param  format 格式 YYYY-MM-DD HH:mm:ss
 */
export function formatTime(second: number, format = "YYYY-MM-DD HH:mm:ss") {
  if (!second) return "";
  if (isNaN(second * 1000)) return;
  return unix(second).format(format);
}

/**
 * 根据code值 转换为对应中文
 * @param sourceList
 * @param code
 * @param valueKey 数组中code对应的key值
 * @param labelKey 数组中label对应的key值
 * @returns label
 */
export function transCodeToName(sourceList: any[], code: any, valueKey = "value", labelKey = "label") {
  let label = "";
  if (!sourceList || !Array.isArray(sourceList)) return "";
  const findItem = sourceList.find((item: any) => item[valueKey] === code);
  if (findItem) {
    label = findItem[labelKey] ? findItem[labelKey] : "";
  }

  return label;
}
