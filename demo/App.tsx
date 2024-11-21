import { defineComponent } from 'vue';

import Demo from './Demo.mdx'
import { MDXProvider } from 'vite-mdx/vue3'

import h1 from './components/h1'

const components = {
  h1: h1,
  h2: () => <h2>h2</h2>,
  h3: () => <h3>h3</h3>,
  h4: () => <h4>h4</h4>
}

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div>
        <div>Hello World</div>
        <MDXProvider components={components}>
          <Demo />
        </MDXProvider>
      </div>
    )
  }
})
  
