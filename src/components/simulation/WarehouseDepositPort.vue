<script setup>
import RootSpecificContainer from './RootSpecificContainer.vue';
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
  <RootSpecificContainer
    :gs_id="props.gs_id"
    :el_name="props.el_name"
    :el_size="props.el_size"
    :is_deposit="true"
  ></RootSpecificContainer>
</template>

<style scoped></style>
