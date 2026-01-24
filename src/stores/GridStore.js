import { GridStack } from "gridstack";
import { defineStore } from "pinia";
import { markRaw } from "vue";
import { useToolbarStore } from "./ToolbarStore";
import { useDialogStore } from "./DialogStore";
export const useGridStore = defineStore("sheng-grid-store", {
  state: () => ({
    toolbarStore: useToolbarStore(),
    dialogStore: useDialogStore(),

    appContext: null,
    isZomming: false,

    rootGrid: null, //存储根gridstack对象
    rootGridEngine: null, //gridstack引擎
    gridEl: null, //存储根元素对象
    gridElCont: null, //存储gridstack的父容器

    gridElContScale: 1,
    defaultWidth: 1578,
    defaultHeight: 1578,
    defaultMaxWidth: 3017,
    defaultMinWidth: 1578,
    numColumn: 72, //列个数

    gridOptions: {
      minRow: 72, //行个数
      allowNewRow: false, //可向下扩充行
      float: true, //可以随意摆放
      //可以拖入
      acceptWidgets: function (el) {
        return true;
      },
    },
  }),

  actions: {
    initGrid(target_el, target_cont, app_context) {
      // 未在state中声明的方法：initBelts2d
      this.initBelts2d();
      this.appContext = app_context;
      this.gridEl = markRaw(target_el);
      this.gridElCont = markRaw(target_cont);
      this.rootGrid = markRaw(GridStack.init(this.gridOptions, target_el));
      this.rootGrid.column(this.numColumn);
      this.gridEl.style.width = `${this.defaultWidth}px`;
      this.gridEl.style.height = `${this.defaultHeight}px`;
      this.gridEl.style.transformOrigin = "0 0";
      this.gridEl.style.willChange = "transform";
      this.gridElContScale = 1;
      if (localStorage.blueprint) {
        // 未在state中声明的方法：importBluePrint
        this.importBluePrint(JSON.parse(localStorage.blueprint));
      }
    },

    //缩放-GPT优化版
    handleScalingChange_(event) {
      event.preventDefault();
      event.stopPropagation();
      // select 模式禁用
      // 未在state中声明的变量：toolbarMode, isRecipeChoose
      if (
        this.toolbarStore.toolbarMode === "select" ||
        this.useDialogStore.isRecipeChoose
      )
        return;
      // 初始化（只做一次）
      if (!this.isZomming) {
        this._zomming = true;
        this.rootGrid.setStatic(true);
      }
      // Leaflet 风格：小步长
      const delta = -event.deltaY * 0.001;
      this.gridElContScale = Math.max(
        0.3,
        Math.min(2, this.gridElContScale + delta),
      );
      // 合帧（非常关键）
      if (this._zoomRaf) cancelAnimationFrame(this._zoomRaf);
      this._zoomRaf = requestAnimationFrame(() => {});
      // 缩放结束（防抖）

      clearTimeout(this._zoomEndTimer);
      this._zoomEndTimer = setTimeout(() => {
        this._applyZoomEnd();
      }, 120);
    },

    //合帧-GPT优化版
    _applyZoomEnd() {
      let finalWidth = this.defaultWidth * this.gridElContScale;
      finalWidth = Math.min(
        this.defaultMaxWidth,
        Math.max(this.defaultMinWidth, finalWidth),
      );
      this.isZomming = false;
      this.rootGrid.setStatic(false);
      // 2️一次性改真实宽度（只触发一次 layout）
      this.gridEl.style.width = `${finalWidth}px`;
      // 3️重置基准
      this.defaultWidth = finalWidth;
      this.gridElContScale = 1;
    },

    //点击获取cell的位置
    getPositionFromClick(event) {
      ////console.log("clientX",event.clientX,"clientY",event.clientY)
      ////console.log("scrollLeft",this.gridElCont.scrollLeft,"scrollTop",this.gridElCont.scrollTop)
      let clientX = event.clientX;
      let clientY = event.clientY;
      return this.rootGrid.getCellFromPixel(
        {
          left: clientX,
          top: clientY,
        },
        true,
      );
    },

    //判断单元格是否空|通过事件
    isCellEmpty(event) {
      const { x, y } = this.getPositionFromClick(event);
      return this.rootGrid.isAreaEmpty(x, y, 1, 1);
    },

    //判断单元格是否为空|通过位置
    isCellEmptyByPosition(x, y) {
      return this.rootGrid.isAreaEmpty(x, y, 1, 1);
    },
  },
});

