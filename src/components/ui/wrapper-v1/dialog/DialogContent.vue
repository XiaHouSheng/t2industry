<script setup>
import { DialogPortal, DialogOverlay, DialogContent as RadixDialogContent } from 'radix-vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  overlayClass: {
    type: String,
    default: 'bg-black/50'
  },
  maxWidth: {
    type: String,
    default: 'max-w-lg'
  },
  contentClass: {
    type: String,
    default: 'bg-gray-900/80'
  }
})
</script>

<template>
  <DialogPortal>
    <DialogOverlay :class="`fixed inset-0 z-50 ${overlayClass}`" />
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <RadixDialogContent
        :class="`relative ${maxWidth} w-full rounded-xl border border-gray-700 ${contentClass} p-6 shadow-2xl pointer-events-auto backdrop-blur-xl`"
      >
        <slot />
      </RadixDialogContent>
    </div>
  </DialogPortal>
</template>

<style scoped>
:deep([data-state="open"]) {
  animation: fadeIn 0.2s ease-in-out;
}

:deep([data-state="closed"]) {
  animation: fadeOut 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
