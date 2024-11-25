import { defineComponent } from 'vue';

import Demo from './Demo.mdx'
import { MDXProvider } from 'vite-mdx/vue3'

import components from './components';


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
  
