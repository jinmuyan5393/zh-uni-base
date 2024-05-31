/**
 * 主题配置
 */
const themeMultipleVars = [
  { scopeName: "layout-theme-default" },
  { scopeName: "layout-theme-yellow" },
  { scopeName: "layout-theme-mingQing" },
  { scopeName: "layout-theme-pink" },
];

/**
 * 获取正则表达式字符串
 * @param {string} scopeName - 范围名称
 * @returns {string} - 正则表达式字符串
 */
function getRegstr(scopeName) {
  return `(^${scopeName}\\s+|\\s+${scopeName}\\s+|\\s+${scopeName}$|^${scopeName}$)`;
}

// 将className添加到html标签上
export function addClassNameToHtmlTag(scopeName) {
  let currentClassName = document.documentElement.className;

  if (new RegExp(getRegstr(scopeName)).test(currentClassName)) {
    return;
  }
  themeMultipleVars.forEach(item => {
    currentClassName = currentClassName.replace(new RegExp(getRegstr(item.scopeName), "g"), ` ${scopeName} `);
  });
  if (currentClassName.indexOf(scopeName) === -1) {
    currentClassName += ` ${scopeName}`;
  }
  document.documentElement.className = currentClassName.replace(/(^\s+|\s+$)/g, "");
}
