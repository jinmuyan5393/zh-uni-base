export function copyTextToClipboard(text: string): boolean {
  // 创建一个textarea元素来临时保存文本
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // 设置位置离视口很远以避免干扰
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  // 将textarea添加到文档中
  document.body.appendChild(textarea);

  // 选中并复制文本
  textarea.select();
  const success = document.execCommand("copy");

  // 从文档中移除textarea
  document.body.removeChild(textarea);

  return success;
}
