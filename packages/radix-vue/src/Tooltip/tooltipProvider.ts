import { type Ref, ref, toRefs } from 'vue'
import { createContext, useForwardExpose } from '@/shared'
import { useTimeoutFn } from '@vueuse/shared'

interface TooltipProviderContext {
  isOpenDelayed: Ref<boolean>
  delayDuration: Ref<number>
  onOpen: () => void
  onClose: () => void
  isPointerInTransitRef: Ref<boolean>
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
  disabled: Ref<boolean>
  ignoreNonKeyboardFocus: Ref<boolean>
}

export const [injectTooltipProviderContext, provideTooltipProviderContext]
  = createContext<TooltipProviderContext>('TooltipProvider')

export interface TooltipProviderProps {
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   * @defaultValue 700
   */
  delayDuration?: number
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   * @defaultValue 300
   */
  skipDelayDuration?: number
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @defaultValue false
   */
  disableHoverableContent?: boolean
  /**
   * When `true`, clicking on trigger will not close the content.
   * @defaultValue false
   */
  disableClosingTrigger?: boolean
  /**
   * When `true`, disable tooltip
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Prevent the tooltip from opening if the focus did not come from
   * the keyboard by matching against the `:focus-visible` selector.
   * This is useful if you want to avoid opening it when switching
   * browser tabs or closing a dialog.
   * @defaultValue false
   */
  ignoreNonKeyboardFocus?: boolean
}

const defaultValues: Partial<TooltipProviderProps> = {
  delayDuration: 700,
  skipDelayDuration: 300,
  disableHoverableContent: false,
  ignoreNonKeyboardFocus: false,
} as const

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export function useRadixTooltipProvider(props: TooltipProviderProps) {
  const propsWithDefaults = Object.assign(props, defaultValues) as RequiredFields<TooltipProviderProps, keyof typeof defaultValues>

  const { delayDuration, skipDelayDuration, disableHoverableContent, disableClosingTrigger, ignoreNonKeyboardFocus, disabled } = toRefs(propsWithDefaults)
  useForwardExpose()

  const isOpenDelayed = ref(true)
  // Reset the inTransit state if idle/scrolled.
  const isPointerInTransitRef = ref(false)

  const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
    isOpenDelayed.value = true
  }, skipDelayDuration, { immediate: false })

  provideTooltipProviderContext({
    isOpenDelayed,
    delayDuration,
    onOpen() {
      clearTimer()
      isOpenDelayed.value = false
    },
    onClose() {
      startTimer()
    },
    isPointerInTransitRef,
    disableHoverableContent,
    disableClosingTrigger,
    disabled,
    ignoreNonKeyboardFocus,
  })
}
