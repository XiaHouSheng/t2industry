 <script setup>
import RootContainer from "./RootContainer.vue";
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
  <RootContainer
    :gs_id="props.gs_id"
    :el_name="props.el_name"
    :el_size="props.el_size"
  ></RootContainer>
</template>

<style scoped></style>
