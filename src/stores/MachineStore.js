import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";
import { nextTick } from "vue";

//test pr new branch
export const useMachineStore = defineStore("sheng-machine-store", {
  state: () => ({
    rootStore: useRootStore(),
  }),

  actions: {
    //test
    test() {},
    //左键配方配置
    handleDialog(event, gs_id) {
      event.stopPropagation();
      this.rootStore.recipeChooseId = gs_id;
      this.rootStore.isRecipeChoose = true;
      this.rootStore.rootGrid.enableMove(false);
    },
    //右键删除机器
    handleRightClick(event, gs_id) {
      event.preventDefault();
      event.stopPropagation();
      this.rootStore.rootGrid.removeWidget(
        this.rootStore.gridWidgetElements[gs_id]
      );
      delete this.rootStore.gridWidgetElements[gs_id];
      delete this.rootStore.gridWidgets[gs_id];
    },
  },
});
