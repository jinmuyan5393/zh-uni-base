/*
 * @Description: canvas操作相关 (html转图片，html转PDF)
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-13 16:22:04
 */

import html2canvas from "html2canvas";

/**
 *  @description html转图片
 *  @param el 待转换的元素
 *  @param options 配置项 { useCORS: true, scale: 4, width: xxx, height: xxxx }
 *  @return Promise<string> 图片的base64字符串
 *  更多配置选项详见: https://html2canvas.hertzen.com/configuration
 */
export function html2Img(el, options = {}) {
  return new Promise(resolve => {
    html2canvas(el, options).then(canvas => {
      const baseImg = canvas.toDataURL("image/png");
      resolve(baseImg);
    });
  });
}
