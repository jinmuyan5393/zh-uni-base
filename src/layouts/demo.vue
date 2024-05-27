<template>
  <config-provider :themeVars="themeVars">
    <slot />
  </config-provider>
</template>

<script lang="ts" setup>
import ConfigProvider from '@/components/ConfigProvider/ConfigProvider.vue'
import { ConfigProviderThemeVars } from '@/components/ConfigProvider/types'

const themeVars: ConfigProviderThemeVars = {
  // colorTheme: 'red',
  // buttonPrimaryBgColor: '#07c160',
  // buttonPrimaryColor: '#07c160',
}
</script>
