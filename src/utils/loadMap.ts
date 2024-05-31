/*
 * @Description: 百度地图初始化
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-11 15:50:58
 */
export function BMPGL(ak) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      // eslint-disable-next-line
      resolve(BMapGL);
    };
    window.HOST_TYPE = "2";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://api.map.baidu.com/api?v=3.0&type=webgl&ak=${ak}&callback=init&s=1`;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
