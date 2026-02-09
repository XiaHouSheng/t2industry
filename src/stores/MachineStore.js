import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";
import messagebox from "../components/ui/wrapper-v1/messagebox/messagebox.js";

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
      
      messagebox.confirm(
        '确定要删除这个机器吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      )
      .then((result) => {
        if (result) {
          this.rootStore.deleteMachineById(gs_id);
        }
      });
    },
  },
});
