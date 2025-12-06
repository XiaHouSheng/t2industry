import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";

//test pr new branch
export const useMachineStore = defineStore("sheng-machine-store", {
  state: () => ({
    rootStore: useRootStore(),
  }),

  actions: {
    //test
    test() {},
    //机器设置接口
    handleOpenDialog() {},
    //右键删除机器
    handleRightClick(event, gs_id) {
      event.preventDefault();
      event.stopPropagation();
      this.rootStore.rootGrid.removeWidget(this.rootStore.gridWidgets[gs_id]);
      delete this.rootStore.gridWidgets[gs_id];
    },
    //进出口事件
    handleBeltConnect(event, which, gs_id) {
      event.stopPropagation();
      return;
      if (!this.rootStore.isBeltConnecting) {
        //inner outter specific
        this.rootStore.startBeltConnect(event, which, gs_id);
      } else {
        this.rootStore.compeleteBeltConnect();
      }
    },
  },
});
