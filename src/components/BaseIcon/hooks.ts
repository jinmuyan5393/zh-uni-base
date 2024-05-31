import { h, defineComponent, type Component } from "vue";
import BaseIcon from "@/components/BaseIcon/index.vue";
import { IIconType } from "./types";

/**
 * 图标hooks
 * @param icon
 * @param attrs
 * @returns
 */
export function useRenderIcon(icon: any, attrs?: IIconType): Component {
  return defineComponent({
    name: "BaseIcon",
    render: () => {
      return h(BaseIcon, { name: icon, ...attrs });
    }
  });
}
