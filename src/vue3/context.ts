import { computed, ComputedRef, defineComponent, inject, PropType, provide, VNodeTypes } from "vue"

export const contextKey = '__MDX_PROVIDE_KEY__'


/**
 * 整个应用级别的组件列表
*/
export const MDXProvider = defineComponent({
  name: 'MDXProvider',
  props: {
    components: {
      type: Object as PropType<Record<string, VNodeTypes>>,
      required: true
    }
  },
  setup(props, { slots }) {
    const componentsRef = computed(() => props.components)

    provide(contextKey, componentsRef)
    return () => slots.default && slots.default()
  }
})

const defaultComponentsRef = computed(() => ({}))
export const useMDXComponents = (
  getPropsComponents: () => Record<string, VNodeTypes>
): ComputedRef<Record<string, VNodeTypes>> => {
  const providedComponentsRef = inject(contextKey, defaultComponentsRef)

  const mergedComponentsRef = computed(() => ({
    ...providedComponentsRef.value,
    ...getPropsComponents()
  }))

  return mergedComponentsRef
}