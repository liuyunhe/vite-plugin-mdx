import { defineComponent } from 'vue'

export default defineComponent({
  name: 'h1',
  setup(props, { slots }) {
    return () => (
      <h1 class="text-3xl font-bold mb-4" data-at="h1" {...props}>
        {slots.default && slots.default()}
      </h1>
    )
  }
})
