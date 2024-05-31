<script setup lang="ts">
import { toRaw } from "vue";
import { useRenderIcon } from "@/components/BaseIcon/hooks";

const props = defineProps({
  extraIcon: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <div v-if="props.extraIcon" class="flex justify-center items-center">
    <component
      :is="useRenderIcon(toRaw(props.extraIcon))"
      class="w-[30px] h-[30px]"
    />
  </div>
</template>
