<template>
  <view :class="themeClass" :style="themeStyle">
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { configProviderProps } from './types'
const props = defineProps(configProviderProps)

const themeClass = computed(() => {
  return `wot-theme-${props.theme}`
})

const themeStyle = computed(() => {
  return mapThemeVarsToCSSVars(props.themeVars)
})

const kebabCase = (str: string): string => {
  str = str.replace(str.charAt(0), str.charAt(0).toLocaleLowerCase())
  return str.replace(/([a-z])([A-Z])/g, (_, p1, p2) => p1 + '-' + p2.toLowerCase())
}
const colorRgb = (str: string) => {
  if (!str) return
  let sColor = str.toLowerCase()
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return sColorChange.join(',')
  }
  return null
}

const mapThemeVarsToCSSVars = (themeVars: Record<string, string>) => {
  if (!themeVars) return
  const cssVars: Record<string, string> = {}
  Object.keys(themeVars).forEach((key) => {
    cssVars[`--wot-${kebabCase(key)}`] = themeVars[key]
  })

  return cssVars
}
</script>

<style lang="scss" scoped></style>
