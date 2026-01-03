<script setup>
import RootMachine from "./RootMachine.vue";
const props = defineProps({
  gs_id: {
    required: true,
    type: String,
  },
  el_name: {
    type: String,
  },
  el_size: {
    required: true,
    type: Object,
  },
});
</script>

<template>
  <RootMachine
    :gs_id="props.gs_id"
    :el_name="props.el_name"
    :el_size="props.el_size"
  ></RootMachine>
</template>

<style scoped></style>
