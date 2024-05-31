import type { SFCWithInstall } from "./types";
import { storageLocal, storageSession } from "./storage";
import { copyTextToClipboard } from "./copyText";
import useDark from "./useDark";
import { useGlobal } from "./useGlobal";
import {
  isEqual,
  isBoolean,
  isObject,
  isFunction,
  cloneDeep,
  isString,
  isArray,
  isNull,
  isUndefined
} from "lodash-es";

export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
) => {
  (main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp);
    }
  };

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp;
    }
  }
  return main as SFCWithInstall<T> & E;
};

// 判断当前设备是mobile还是desktop
export function deviceDetection(): boolean {
  const userAgent = window.navigator.userAgent;
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  if (mobileRegex.test(userAgent)) {
    return true;
  } else {
    return false;
  }
}

// 判断是不是链接
function isUrl(url: string) {
  const reg =
    "^((https|http|ftp|rtsp|mms)?://)(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,5})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  return new RegExp(reg, "ig").test(url);
}

/**
 * 返回字符串 `str` 中第 `n` 个出现的子字符串之前的部分。
 * 如果 `n` 是字符串类型，则返回从 0 开始到 `n` 第一个出现位置之前的子字符串；
 * 如果 `n` 不是字符串类型，则返回空字符串。
 * @param {string} str - 输入的字符串
 * @param {(string | number)} n - 子字符串的名称或位置
 * @returns {string} - 在 `str` 中第 `n` 个出现的子字符串之前的部分
 */
function subBefore(str, n) {
  return isString(n) ? str.substring(0, str.indexOf(n)) : "";
}
/**
 * 返回字符串中第n个出现的子字符串之后的字符串
 * @param str 源字符串
 * @param n 第n个出现的子字符串
 * @returns 字符串中第n个出现的子字符串之后的字符串
 */
function subAfter(str, n) {
  return isString(n)
    ? str.substring(str.lastIndexOf(n) + n.length, str.length)
    : "";
}

/**
 * 获取指定key的不重复值列表
 * @param source 数组类型的源数据
 * @param key 指定的key
 * @returns 不重复值列表
 */
function getKeyList(source: any, key: string): any[] {
  const arr = [];
  for (const r of source) r[key] && arr.push(r[key]);
  return Array.from(new Set(arr));
}

/**
 * 打开链接
 * @param href - 链接地址
 * @param target - 目标窗口（默认为"_blank")
 * @returns 无
 */
function openLink(href: string, target = "_blank"): void {
  const element = document.createElement("a");
  element.setAttribute("href", href),
    element.setAttribute("target", target),
    element.setAttribute("rel", "noreferrer noopener"),
    element.setAttribute("id", "external");
  const dom = document.getElementById("external");
  dom && document.body.removeChild(dom),
    document.body.appendChild(element),
    element.click(),
    element.remove();
}

/**
 * 获取由基本数据类型组成的数组交集
 */
function intersection(...rest: any[]) {
  return [...rest].reduce((arr, currentArray) => {
    return arr.filter(element => currentArray.includes(element));
  });
}
/**
 * @description 判断一个数组（这里简称为母体）中是否包含了另一个由基本数据类型组成的数组（这里简称为子体）中的全部元素
 * @param c 子体
 * @param m 母体
 */
function isIncludeAllChildren(
  c: Array<string | number | unknown>,
  m: Array<unknown>
): boolean {
  return c.every(childElement => m.includes(childElement));
}

function isAllEmpty(t) {
  return !!(isEmpty(t) || isNullOrUndef(t));
}

function isEmpty(t) {
  return isArray(t) || isString(t)
    ? t.length === 0
    : t instanceof Map || t instanceof Set
      ? t.size === 0
      : isObject(t)
        ? Object.keys(t).length === 0
        : false;
}

function delay(delay = 20) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

function isNullOrUndef(t) {
  return isNull(t) || isUndefined(t);
}

// 判断元素中是否有对应的类名
const hasClass = (element: HTMLElement | Element, name: string): boolean =>
  !!element?.className.match(new RegExp("(\\s|^)" + name + "(\\s|$)"));

/**
 * @description 是否向当前元素添加指定类名
 * @param bool `boolean`
 * @param name 类名
 * @param element 当前元素（可选，如果不填，默认 `document.body` ）
 */
function toggleClass(
  bool: boolean,
  name: string,
  element?: HTMLElement | Element
) {
  const rootEle = element || document.body;
  const { className: s } = rootEle;
  const o = s.replace(name, "").trim().split(/\s+/).join(" ");
  rootEle.className = bool ? `${o} ${name}` : o;
}

/**
 * @description 创建一个防抖函数，用于延迟执行目标函数
 * @param {Function} targetFunction - 要执行的目标函数
 * @param {number} delay - 防抖的延迟时间，默认为 200 毫秒
 * @param {boolean} immediate - 是否使用立即执行模式，默认为 false，即延迟执行模式
 * @returns {Function} - 新的防抖函数
 */
const debounce = (targetFunction, delay = 200, immediate = false) => {
  let timerId;
  const waitTime = delay;
  const context = undefined;

  return function (...args) {
    // 清除之前的定时器，取消之前的延迟执行
    timerId && clearTimeout(timerId);

    if (immediate) {
      // 立即执行模式
      if (!timerId) {
        // 如果定时器不存在，则立即执行目标函数，并传递相应的参数
        targetFunction.call(context, ...args);
      }

      // 设置一个新的定时器，在延迟时间 waitTime 后将定时器重置为 null
      timerId = setTimeout(() => (timerId = null), waitTime);
    } else {
      // 延迟执行模式
      // 设置一个新的定时器，在延迟时间 waitTime 后执行目标函数
      timerId = setTimeout(
        () => targetFunction.call(context, ...args),
        waitTime
      );
    }
  };
};

/**
 * @description 创建一个防抖函数，用于延迟执行目标函数
 * @param {Function} targetFunction - 要执行的目标函数
 * @param {number} delay - 防抖的延迟时间，默认为 1000 毫秒
 * @returns {Function} - 新的防抖函数
 */
const throttle = (targetFunction, delay = 1000) => {
  let timeoutId;

  return function (...args) {
    // 如果定时器存在，清除之前的定时器
    timeoutId && clearTimeout(timeoutId);

    // 设置一个新的定时器，在延迟时间 delay 后执行目标函数
    timeoutId = setTimeout(() => {
      targetFunction.call(undefined, ...args);
      timeoutId = null;
    }, delay);
  };
};

export {
  storageLocal,
  storageSession,
  isBoolean,
  isObject,
  isEqual,
  isFunction,
  isUrl,
  isString,
  isArray,
  cloneDeep,
  debounce,
  throttle,
  copyTextToClipboard,
  subBefore,
  subAfter,
  getKeyList,
  openLink,
  intersection,
  isIncludeAllChildren,
  isAllEmpty,
  delay,
  useDark,
  useGlobal,
  hasClass,
  toggleClass
};
export default {
  withInstall,
  storageLocal,
  storageSession
};
