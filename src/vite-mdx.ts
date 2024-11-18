import { Plugin } from 'vite'
import { createCompiler } from '@mdx-js/mdx'
import { createFilter, FilterPattern } from '@rollup/pluginutils'

// 定义渲染器代码片段
const vue3DefaultRenderer = `
import {mdx} from '@shepardliu/vite-plugin-mdx'
`

// 定义jsx pragma代码片段
// 使用 mdx 函数作为 JSX pragma
const vue3DefaultPargma = `
/** @jsx mdx*/
`

const reactDefaultRenderer = `
import React from 'react'
import {mdx} from '@mdx-js/react'
`

const reactDefaultPargma = `
/** @jsxRuntime classic */
/** @jsx mdx */
/** @jsxFrag mdx.Fragment */
`

export enum Framework {
  Vue3 = 'vue3',
  React = 'react'
}

/**
 * Vite MDX 插件的选项接口
 * @property {FilterPattern} include - 文件路径包含模式
 * @property {FilterPattern} exclude - 文件路径排除模式
 */
export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  framework?: Framework
  renderer?: string
  pargma?: string
}

const frameworkRendererPargmaMap = {
  vue3: {
    renderer: vue3DefaultRenderer,
    pargma: vue3DefaultPargma
  } as const,
  react: {
    renderer: reactDefaultRenderer,
    pargma: reactDefaultPargma
  } as const
}

/**
 * Vite MDX 插件工厂函数
 * @param {Options} options - 插件选项
 * @returns {Plugin} Vite 插件对象
 */
export default (options: Options = {}): Plugin => {
  const framework = options.framework || Framework.Vue3

  if (framework !== Framework.Vue3 && framework !== Framework.React) {
    throw new Error(`framework now only support vue3 or react`)
  }

  return {
    name: 'vite-mdx',

    enforce: framework === Framework.React ? 'pre' : undefined,

    config() {
      return framework === Framework.React
        ? {
            esbuild: {
              include: /\.(jsx|tsx|ts|mdx)/,
              loader: 'jsx'
            }
          }
        : {}
    },

    transform(code, id) {
      // 获取选项中的包含和排除模式，默认为匹配 .mdx 文件
      const {
        include = /\.mdx/,
        exclude,
        renderer: optionsRenderer,
        pargma: optionsPargma
      } = options
      // 根据包含和排除模式创建过滤器函数
      const filter = createFilter(include, exclude)

      const { renderer: defaultRenderer, pargma: defaultPargma } =
        frameworkRendererPargmaMap[framework]

      const renderer = optionsRenderer || defaultRenderer
      const pargma = optionsPargma || defaultPargma
      // 检查当前文件是否匹配过滤器
      if (filter(id)) {
        // 创建一个 MDX 编译器实例
        const compiler = createCompiler()
        // 同步处理代码
        const result = compiler.processSync(code)
        // 打印编译结果
        // console.log('🚀 ~ transform ~ result:', result)
        // 返回转换后的代码，前置渲染器和 pragma
        return {
          code: `${renderer}${pargma}${result.contents}`
        }
      }
    }
  }
}
