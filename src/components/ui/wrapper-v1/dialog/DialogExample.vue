<script setup>
import { ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './index.js'

const open = ref(false)

const handleOpen = () => {
  open.value = true
}

const handleClose = () => {
  open.value = false
}

const handleDelete = () => {
  console.log('Delete blueprint')
  open.value = false
}
</script>

<template>
  <div>
    <button 
      class="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-400 transition-colors"
      @click="handleOpen"
    >
      Open Dialog
    </button>

    <Dialog v-model:open="open">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Blueprint</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div class="mt-4">
          <p class="text-gray-300">Are you sure you want to delete this blueprint? All associated data will be permanently removed.</p>
        </div>

        <DialogFooter>
          <button 
            class="px-3 py-2 rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
          <button 
            class="px-3 py-2 rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors"
            @click="handleDelete"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
