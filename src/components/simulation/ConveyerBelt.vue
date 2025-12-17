<script setup>
import { ref } from "vue";
import { useRootStore } from "../../stores/SimStore";

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
});
const rotateAngle = ref(0);
rotateAngle.value = props.rotate * 90
const testClass = ref("belt-img");
testClass.value = props.type;
const hadnleRotate = (rotate) => {
  rotateAngle.value = ((rotateAngle.value / 90 + 1) % 4) * 90;
  //rootStore.gridWidgetsRotate[props.gs_id] = rotateAngle.value / 90;
  console.log(rotateAngle.value / 90)
};
</script>

<template>
  <div
    class="max-height-width belt-bg"
    :class="testClass"
    :style="{ transform: `rotate(${rotateAngle}deg)` }"
    @click="hadnleRotate"
  ></div>
</template>

<style scoped></style>
