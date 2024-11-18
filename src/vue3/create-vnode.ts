import {
  createVNode,
  defineComponent,
  Fragment,
  PropType,
  SetupContext,
  VNodeTypes
} from 'vue'
import { useMDXComponents } from './context'

const TYPE_PROP_NAME = 'mdxType'

const DEFAULTS: any = {
  inlineCode: 'code',
  wrapper: (props: any, { slots }: SetupContext) =>
    createVNode(Fragment, {...props}, slots.default && slots.default())
}

/**
 * 每个组件定义的组件列表
 */
const MdxCreateComponent = defineComponent({
  name: 'MdxCreateComponent',
  props: {
    components: {
      type: Object as PropType<Record<string, VNodeTypes>>,
      default: () => ({})
    },
    originalType: {
      type: String as PropType<string>
    },
    mdxType: {
      type: String as PropType<string>,
      required: true
    },
    parentName: {
      type: String as PropType<string>
    }
  },
  setup(props, { slots }) {
    const componentsRef = useMDXComponents(() => props.components)

    return () => {
      const components = componentsRef.value
      const { parentName, originalType, mdxType: type, ...etc } = props
      const Component =
        components[`${parentName}.${type}`] ||
        components[type] ||
        DEFAULTS[type] ||
        originalType
      return createVNode(Component, { ...etc }, slots.default&&slots.default())
    }
  }
})

export default function mdx(
  type: VNodeTypes,
  props: any,
  children: unknown,
  patchFlag?: number,
  dynamicProps?: string[] | null,
  isBlockNode?: boolean
) {
  let component = type
  let newProps = props

  const mdxType = props && props.mdxType
  if (typeof type === 'string' || mdxType) {
    component = MdxCreateComponent
    newProps = {}

    for (const key in props) {
      if (Object.hasOwnProperty.call(props, key)) {
        newProps[key] = props[key]
      }
    }

    newProps.originalType = type
    // type如果是string，则mdxType为type(组件名)，否则为mdxType
    newProps[TYPE_PROP_NAME] = typeof type === 'string' ? type : mdxType
  }
  return createVNode(
    component,
    newProps,
    children,
    patchFlag,
    dynamicProps,
    isBlockNode
  )
}
