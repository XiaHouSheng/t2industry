<script setup>
import { DialogRoot } from 'radix-vue'

const props = defineProps({
  open: Boolean,
  defaultOpen: Boolean,
  modal: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:open'])

function handleOpenChange(value) {
  emit('update:open', value)
}
</script>

<template>
  <DialogRoot
    :open="props.open"
    :default-open="props.defaultOpen"
    :modal="props.modal"
    @update:open="handleOpenChange"
  >
    <slot :open="props.open" />
  </DialogRoot>
</template>