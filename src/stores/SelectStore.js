import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";

export const useSelectStore = defineStore("sheng-select-store", {
  state: () => ({
    rootStore: useRootStore(),
    selector: null, //框选元素
    startX: null,
    startY: null,
    isStartSelect: false,
  }),

  actions: {
    initSelector(selector) {
      this.selector = selector;
    },

    handleMouseDown(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      console.log("down", event);
      this.setPosition(event);
      this.isStartSelect = true;
    },

    handleMouseMove(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      console.log("move", event);
      if (this.isStartSelect) {
        let newWidth = Math.abs(this.startX - event.clientX);
        let newHeight = Math.abs(this.startY - event.clientY);
        console.log(newWidth, newHeight);
        this.selector.style.width = `${newWidth}px`;
        this.selector.style.height = `${newHeight}px`;
      }
    },

    handleMouseUp(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      console.log("up", event);
      this.isStartSelect = false;
      this.rootStore.toolbarMode = "default";
      let newWidth = Math.abs(this.startX - event.clientX);
      let newHeight = Math.abs(this.startY - event.clientY);
      return {
        startX: this.startX,
        startY: this.startY,
        endX: this.startX + newWidth,
        endY: this.endY + newHeight,
      };
    },

    setPosition(event) {
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.selector.style.top = `${event.clientY}px`;
      this.selector.style.left = `${event.clientX}px`;
    },
  },
});
