<script setup>
import { useRootStore } from "../../stores/SimStore";
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
const rootStore = useRootStore();
</script>

<template>
  <div class="supplier-cont max-height-width">
    <div v-if="rootStore.isShowSupplierExtent" class="supplier-extent"></div>
    <RootContainer
      :gs_id="props.gs_id"
      :el_name="props.el_name"
      :el_size="props.el_size"
      :port="{ top: false, bottom: false }"
    ></RootContainer>
  </div>
</template>

<style scoped>
.supplier-cont {
  position: relative;
}
.supplier-extent {
  position: absolute;
  top: -200%;
  left: -200%;
  width: 505%;
  height: 505%;
  background-color: #0077cc30;
  background-size: calc(100% / 10) calc(100% / 10);
  background-image:
    linear-gradient(
      45deg,
      #0077cc20 25%,
      transparent 25%,
      transparent 50%,
      #0077cc20 50%,
      #0077cc20 75%,
      transparent 75%,
      transparent
    ),
    linear-gradient(to right, #0077cc3e 1px, transparent 1px),
    linear-gradient(to bottom, #0077cc3e 1px, transparent 1px);
  background-position:
    0 0,
    0 0,
    0 0;
  background-blend-mode: overlay;
}
</style>
