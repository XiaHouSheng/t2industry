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
    <div
      class="max-height-width belt-bg position-absolute"
      :class="testClass"
      :style="{ transform: `rotate(${rotateAngle}deg)` }"
    ></div>
    <!-- 这里是准备给管道pipe的，这个管道做起来有点麻烦，因为涉及到传送带的
     部分方法重写，毕竟相当于再写一个传送带对吧。因此这边先放着了，毕竟管道
     连接相对简单，现在需要的管道的机器还相对较少。
    <div class="max-height-width belt-bg position-absolute pipe-img"></div>
    -->
  </div>
</template>

<style scoped></style>
