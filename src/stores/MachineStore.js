import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";
import { ElMessageBox } from "element-plus";

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
      
      ElMessageBox.confirm(
        '确定要删除这个机器吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      .then(() => {
        this.rootStore.rootGrid.removeWidget(
          this.rootStore.gridWidgetElements[gs_id]
        );
        let part = this.rootStore.gridWidgets[gs_id].part;
        this.rootStore.partsWidgetId[part].delete(gs_id);
        delete this.rootStore.gridWidgetElements[gs_id];
        delete this.rootStore.gridWidgets[gs_id];
      })
      .catch(() => {
        // 取消删除操作
      });
    },
  },
});
