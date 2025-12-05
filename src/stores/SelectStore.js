import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";

export const useSelectStore = defineStore("sheng-select-store", {
  state: () => ({
    rootStore: useRootStore(),
    selector: null, //框选元素
    startX: null,
    startY: null,
  }),

  actions: {
    initSelector(selector) {
      this.selector = selector;
    },
    handleMouseDown(event) {
      console.log("down");
      this.setPosition(event);
      this.rootStore.isStartSelect = true
    },

    handleMouseMove(event) {
      if (this.rootStore.isStartSelect) {
        let newWidth = Math.abs(this.startX - event.clientX);
        let newHeight = Math.abs(this.startY - event.clientY);
        console.log(newWidth, newHeight);
        this.selector.style.width = `${newWidth}px`;
        this.selector.style.height = `${newHeight}px`;
      }
    },

    handleMouseUp(event) {
      console.log("up", event);
      this.rootStore.isStartSelect = false;
    },
    setPosition(event) {
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.selector.style.top = `${event.clientY}px`;
      this.selector.style.left = `${event.clientX}px`;
    },
  },
});
