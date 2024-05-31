/*
 * @Description: 文本复制指令（默认双击复制）
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-13 16:11:21
 */
import feedback from "@/utils/feedback";
import { useEventListener } from "@vueuse/core";
import { copyTextToClipboard } from "@/lib/baseUtils";
import type { Directive, DirectiveBinding } from "vue";

interface CopyEl extends HTMLElement {
  copyValue: string;
}

/** 文本复制指令（默认双击复制） */
export const copy: Directive = {
  mounted(el: CopyEl, binding: DirectiveBinding) {
    const { value } = binding;
    if (value !== undefined) {
      el.copyValue = value;
      const arg = binding.arg ?? "dblclick";
      // Register using addEventListener on mounted, and removeEventListener automatically on unmounted
      useEventListener(el, arg, () => {
        const success = copyTextToClipboard(el.copyValue);
        success ? feedback.msgSuccess("复制成功") : feedback.msgError("复制失败");
      });
    } else {
      throw new Error('[Directive: copy]: need value! Like v-copy="modelValue"');
    }
  },
  updated(el: CopyEl, binding: DirectiveBinding) {
    el.copyValue = binding.value;
  },
};
