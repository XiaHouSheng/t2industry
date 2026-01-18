<script setup>
import RootMachine from "./RootMachine.vue";
import RootMachineCuboid from "./RootMachineCuboid.vue";
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
  <RootMachineCuboid
    :gs_id="props.gs_id"
    :el_name="props.el_name"
    :el_size="props.el_size"
  ></RootMachineCuboid>
</template>

<style scoped></style>
