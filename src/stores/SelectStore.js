import { defineStore } from "pinia";
import { useRootStore } from "./SimStore";
import { nextTick } from "vue";

export const useSelectStore = defineStore("sheng-select-store", {
  state: () => ({
    rootStore: useRootStore(),
    selector: null, //框选元素
    startX: null, //初始X位置 相对屏幕
    startY: null, //初始Y位置 相对屏幕
    isStartSelect: false, //判断是否开始框选
    showSelectMenu: false, //判断是否显示框选菜单
    showSelect: false, //判断是否显示框选器
    midDeleteData: null,
  }),

  actions: {
    //初始化框选器
    initSelector(selector) {
      this.selector = selector;
      this.hideSelectorAMenu();
    },

    //展示框选器的确认菜单
    showMenu() {
      this.showSelectMenu = true;
    },

    //展示框选器
    showSelector() {
      this.showSelect = true;
      this.selector.style.opacity = 1;
    },

    //隐藏框选器与其菜单
    hideSelectorAMenu() {
      this.selector.style.opacity = 0;
      this.showSelectMenu = false;
    },

    //确认删除
    confirmDelete() {
      //console.log(this.midDeleteData)
      if (this.rootStore.quickPlaceMode === 'pipe') {
        this.rootStore.deleteSeriesPipe2d(this.midDeleteData);
      } else {
        this.rootStore.deleteSeriesBelt2d(this.midDeleteData);
      }
      this.hideSelectorAMenu();
    },

    //el-popper的回调事件|用于popper消失之后控制框选器完全隐藏
    handleMenuHide() {
      this.selector.style.width = "0px";
      this.selector.style.height = "0px";
      this.showSelect = false;
      this.rootStore.toolbarMode = "default";
      this.rootStore.handleBeltModeChange("default");
    },

    handleMouseDown(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      ////console.log("down", event);
      this.setPosition(event);
      this.showSelector();
      this.isStartSelect = true;
    },

    handleMouseMove(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      ////console.log("move", event);
      if (this.isStartSelect) {
        let newWidth = Math.abs(this.startX - event.clientX);
        let newHeight = Math.abs(this.startY - event.clientY);
        this.selector.style.width = `${newWidth}px`;
        this.selector.style.height = `${newHeight}px`;
      }
    },

    handleMouseUp(event) {
      if (!(this.rootStore.toolbarMode == "select")) {
        return;
      }
      ////console.log("up", event);
      this.isStartSelect = false;
      this.showMenu();
      let newWidth = Math.abs(this.startX - event.clientX);
      let newHeight = Math.abs(this.startY - event.clientY) / 2
      //console.log(newWidth,newHeight)
      this.endX = this.startX + newWidth;
      this.endY = this.startY + newHeight;
      this.midDeleteData = {
        startX: this.startX,
        startY: this.startY,
        endX: this.startX + newWidth,
        endY: this.endY + newHeight,
      };
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
