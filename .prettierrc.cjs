/*
 * @Date: 2024-04-19 16:24:20
 * @LastEditTime: 2024-04-19 16:28:40
 * @Description:
 */
// @see https://prettier.io/docs/en/options
module.exports = {
  bracketSameLine: true, // > 标签放在最后一行的末尾，而不是单独放在下一行
  semi: true, //每行末尾自动添加分号
  tabWidth: 2, // tab缩进大小,默认为2
  useTabs: false, // 使用tab缩进，默认false
  bracketSpacing: true, //对象中打印空格 默认true
  singleQuote: false, //使用单引号代替双引号
  arrowParens: "avoid", //箭头函数参数括号 默认avoid 可选 avoid(省略括号的时候就省略 例如x => x) | always(总是有括号)
  trailingComma: "all", //在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  endOfLine: "auto", //行结尾形式 mac和linux是\n  windows是\r\n
  htmlWhitespaceSensitivity: "ignore", //html存在空格是不敏感的
  overrides: [
    {
      files: "*.json",
      options: {
        trailingComma: "none",
      },
    },
  ],
  printWidth: 150, //换行长度，默认80
};
