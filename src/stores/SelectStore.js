import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";
import SelectIndicator from "../utils/SelectIndicator";

export const useSelectStore = defineStore("sheng-select-store", {
  state: () => ({
    rootStore: useRootStore(),
    selector: null, //框选元素
    startX: null, //初始X位置 相对屏幕
    startY: null, //初始Y位置 相对屏幕
    isStartSelect: false, //判断是否开始框选
    canSelect: false, //允许框选
    midDeleteData: null,
  }),

  actions: {
    //初始化框选器
    initSelector(selector) {
      this.selector = selector;
    },

    enableSelect() {
      this.canSelect = true;
    },

    disableSelect() {
      this.canSelect = false;
    },

    //展示框选器
    showSelector() {
      this.selector.style.opacity = 1;
    },

    //隐藏框选器与其菜单
    hideSelector() {
      this.selector.style.opacity = 0;
    },

    //确认删除 - 暂时弃用
    confirmDelete() {
      //console.log(this.midDeleteData)
      /*
      this.midDeleteData = {
        startX: this.startX,
        startY: this.startY,
        endX: this.startX + newWidth,
        endY: this.endY + newHeight,
      };
      */
      if (this.rootStore.quickPlaceMode === "pipe") {
        this.rootStore.deleteSeriesPipe2d(this.midDeleteData);
      } else {
        this.rootStore.deleteSeriesBelt2d(this.midDeleteData);
      }
      this.hideSelectorAMenu();
    },

    //结束select重置
    handleSelectOver() {
      this.hideSelector();
      this.isStartSelect = false;
      this.selector.style.width = "0px";
      this.selector.style.height = "0px";
    },

    handleMouseDown(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      if (!this.canSelect) return;
      ////console.log("down", event);
      this.setPosition(event);
      this.showSelector();
      this.isStartSelect = true;
    },

    handleMouseMove(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      if (!this.isStartSelect) return;
      let newWidth = Math.abs(this.startX - event.clientX);
      let newHeight = Math.abs(this.startY - event.clientY);
      this.selector.style.width = `${newWidth}px`;
      this.selector.style.height = `${newHeight}px`;
    },

    handleMouseUp(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      if (!this.canSelect) return;
      //this.showMenu();
      let newWidth = Math.abs(this.startX - event.clientX);
      let newHeight = Math.abs(this.startY - event.clientY) / 2;

      //console.log(newWidth,newHeight)
      this.endX = this.startX + newWidth;
      this.endY = this.startY + newHeight;

      //这里将cellPosition传递给SelectIndicator
      const cellPosition = {
        startCell: this.rootStore.getPositionFromClick({
          clientX: this.startX,
          clientY: this.startY,
        }),
        endCell: this.rootStore.getPositionFromClick({
          clientX: this.startX + newWidth,
          clientY: this.endY + newHeight,
        }),
      };

      //更新指示器的内容
      SelectIndicator.updateIndicatorContent(cellPosition);

      //结束select重置
      this.handleSelectOver();
    },

    //工具方法，设置框选器的位置
    setPosition(event) {
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.selector.style.top = `${event.clientY}px`;
      this.selector.style.left = `${event.clientX}px`;
    },
  },
});
