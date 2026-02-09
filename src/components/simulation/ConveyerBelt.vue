<script setup>
import { ref } from "vue";
import { useRootStore } from "../../stores/SimStore";
// middleware <- rootstore machine
const rootStore = useRootStore();
const props = defineProps({
  gs_id: {
    required: true,
    type: String,
  },
  type: {
    default: "belt-img",
    type: String,
  },
  rotate: {
    default: 0,
    type: Number,
  },
  position: {
    type: Object,
  },
});
const rotateAngle = ref(0);
rotateAngle.value = props.rotate * 90;
const testClass = ref("belt-img");
testClass.value = props.type;
const hadnleRotate = () => {
  rotateAngle.value = ((rotateAngle.value / 90 + 1) % 4) * 90;
  rootStore.gridBelts2d[props.position.x][props.position.y]["rotate"] =
    rotateAngle.value / 90;
};
</script>

<template>
  <div class="max-height-width position-relative" @click="hadnleRotate">
    <div v-if="rootStore.isShowBelts"
      class="max-height-width belt-bg position-absolute"
      :class="testClass"
      :style="{ transform: `rotate(${rotateAngle}deg)` }"
    ></div>
    <!--
    <div v-if="rootStore.isShowPipes" class="max-height-width belt-bg position-absolute pipe-img"></div>
    -->
  </div>
</template>

<style scoped></style>
