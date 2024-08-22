<script setup lang="ts">
import { type TooltipProviderProps, useRadixTooltipProvider } from './tooltipProvider'

const props = defineProps<TooltipProviderProps>()
useRadixTooltipProvider(props)
</script>

<template>
  <slot />
</template>
