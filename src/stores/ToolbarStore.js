import { defineStore } from "pinia";
import { markRaw } from "vue";

export const useRootStore = defineStore("sheng-root-store", {
  state: () => ({
    toolbarMode: "default",
    toolbarModeHistory: "default",
  }),

  actions: {
    //顶部工具栏模式改变回调
    handleBeltModeChange(value) {
      //console.log("mode change", this.toolbarMode, this.toolbarModeHistory);
      //select模式下禁用cont的scroll
      if (value == "select") {
        this.gridElCont.style.overflow = "hidden";
      } else {
        this.gridElCont.style.overflow = "scroll";
      }
      if (this.toolbarModeHistory == "belts") {
        this.lastBaseNode = null;
        this.lastDir = null;
      }
      this.toolbarModeHistory = value;
    },

  },
});
