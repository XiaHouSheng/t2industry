import { GridStack } from "gridstack";
import { defineStore } from "pinia";
import { createVNode, markRaw, render } from "vue";
import { machineComponentMap } from "../utils/MachineMap";
import ConveyerBelt from "../components/simulation/ConveyerBelt.vue";

export const useRootStore = defineStore("sheng-root-store", {
  state: () => ({
    appContext: null,

    isBluePrintImport: false,
    isRecipeChoose: false,
    recipeChooseId: "",
    isZomming: false,
    toolbarMode: "default",
    toolbarModeHistory: "default",
    beltSelect: "turn",

    gridWidgetElements: markRaw({}), //用于非传送带模拟控件的存储|id->{element:el}
    gridWidgets: {}, //用于非传送带模拟控件配置存储|id->{rotate:rotate,recipe:recipe}
    gridBelt2dElement: markRaw({}),
    gridBelts2d: null, //存储传送带的元素|x,y->{rotate:rotate,type:type}

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

    lastBaseNode: null, // 上一次的基准点 { x, y }
    lastDir: null, // 上一次方向（0-3）
  }),

  actions: {
    initGrid(target_el, target_cont, app_context) {
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
      if (localStorage.blueprint)
        this.importBluePrint(JSON.parse(localStorage.blueprint));
    },

    initBelts2d() {
      this.gridBelts2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => ({}))
      );
    },

    //删除单个传送带
    deleteOneBelt(position) {
      const targetElement =
        this.gridBelt2dElement[`${position.x}-${position.y}`];
      if (targetElement) {
        //待定
        this.rootGrid.removeWidget(targetElement);
        this.gridBelts2d[position.x][position.y] = {};
        delete this.gridBelt2dElement[`${position.x}-${position.y}`];
      }
    },

    //删除一些列传送带|2d
    deleteSeriesBelt2d(midDeleteData) {
      const { startX, startY, endX, endY } = midDeleteData;
      const positionStart = this.getPositionFromClick({
        clientX: startX,
        clientY: startY,
      });
      const positionEnd = this.getPositionFromClick({
        clientX: endX,
        clientY: endY,
      });

      //edit by AI
      // 计算矩形区域的边界（取x/y的最小/最大值）
      const minX = Math.min(positionStart.x, positionEnd.x);
      const maxX = Math.max(positionStart.x, positionEnd.x);
      const minY = Math.min(positionStart.y, positionEnd.y);
      const maxY = Math.max(positionStart.y, positionEnd.y);

      // 遍历矩形内所有网格位置，调用deleteOneBelt删除
      for (let x = minX; x <= maxX; x++) {
        // 跳过超出网格行范围的位置
        if (x < 0 || x >= this.gridOptions.minRow) continue;

        for (let y = minY; y <= maxY; y++) {
          // 跳过超出网格列范围的位置
          if (y < 0 || y >= this.numColumn) continue;

          // 构造包含x、y的position对象，符合deleteOneBelt参数要求
          const position = { x, y };
          // 调用原有deleteOneBelt方法删除单个传送带
          this.deleteOneBelt(position);
        }
      }
    },

    //缩放-GPT优化版
    handleScalingChange_(event) {
      event.preventDefault();
      event.stopPropagation();
      // select 模式禁用
      if (this.toolbarMode === "select" || this.isRecipeChoose) return;
      // 初始化（只做一次）
      if (!this.isZomming) {
        this._zomming = true;
        this.rootGrid.setStatic(true);
      }
      // Leaflet 风格：小步长
      const delta = -event.deltaY * 0.001;
      this.gridElContScale = Math.max(
        0.3,
        Math.min(2, this.gridElContScale + delta)
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
        Math.max(this.defaultMinWidth, finalWidth)
      );
      this.isZomming = false;
      this.rootGrid.setStatic(false);
      // 1️先清 transform（避免双重缩放）
      this.gridEl.style.transform = "scale(1)";
      // 2️一次性改真实宽度（只触发一次 layout）
      this.gridEl.style.width = `${finalWidth}px`;
      // 3️重置基准
      this.defaultWidth = finalWidth;
      this.gridElContScale = 1;
    },

    //配方配置对话框关闭回调
    handleDialogRecipeClose() {
      this.rootGrid.enableMove(true);
    },

    //顶部工具栏模式改变回调
    handleBeltModeChange(value) {
      console.log("mode change", this.toolbarMode, this.toolbarModeHistory);
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

    //已经计算scroll - Scroll后会导致定位不准确，需要改
    getPositionFromClick(event) {
      let clientX = event.clientX + this.gridElCont.scrollLeft;
      let clientY = event.clientY + this.gridElCont.scrollTop;
      return this.rootGrid.getCellFromPixel(
        {
          left: clientX,
          top: clientY,
        },
        true
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

    //生成一个传送带|对原makeGrid的封装
    generateOneBelt(position, type = "belt-img", rotate = 0, id_in = null) {
      let craftElement = document.createElement("div");
      let id = id_in ? id_in : `${id_in}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      let vnode = createVNode(ConveyerBelt, {
        gs_id: id,
        rotate: rotate,
        type: type,
        position: position,
      });
      render(vnode, craftElement);
      craftElement = this.rootGrid.makeWidget(craftElement, {
        x: position.x,
        y: position.y,
        w: 1,
        h: 1,
        float: false,
        noResize: true,
        locked: true,
        id: id,
      });
      this.rootGrid.movable(craftElement, false);
      this.gridBelt2dElement[`${position.x}-${position.y}`] = craftElement;
      this.gridBelts2d[position.x][position.y] = {
        rotate: rotate,
        type: type,
        id: id,
      };
    },

    //替换转弯节点的传送带
    replaceNodeAtPosition(position, { type, rotate }, id = "belt") {
      const el = this.gridBelt2dElement[`${position.x}-${position.y}`];
      if (!el) return;
      this.rootGrid.removeWidget(el, true);
      this.gridBelts2d[position.x][position.y] = {};
      this.generateOneBelt(position, type, rotate, id);
    },

    getStraightRotateIndex(dx, dy) {
      if (dx === 1 && dy === 0) return 0; // →
      if (dx === 0 && dy === 1) return 1; // ↓
      if (dx === -1 && dy === 0) return 2; // ←
      if (dx === 0 && dy === -1) return 3; // ↑
    },

    //根据始末得出节点转弯
    getTurnRotateIndex(fromDir, toDir) {
      const map = {
        "0-3": 0, // 左 → 上
        "0-1": 3,

        "1-1": 3, // 右 → 下
        "1-2": 0,
        "1-0": 1,

        "3-0": 2, // 上 → 右
        "3-2": 3,

        "2-3": 1,
        "2-1": 2,
      };
      return map[`${fromDir}-${toDir}`];
    },

    //生成一些列传送带
    generateBelt(newPosition, id = "belt") {
      // 第一次调用：只记录基准点
      if (!this.lastBaseNode) {
        this.lastBaseNode = { ...newPosition };
        this.lastDir = null;
        return;
      }

      const oldNode = this.lastBaseNode;

      const dx = newPosition.x - oldNode.x;
      const dy = newPosition.y - oldNode.y;

      // 只允许直线
      if (dx !== 0 && dy !== 0) {
        console.log("not a straight line");
        return;
      }

      const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
      const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
      const steps = Math.abs(dx + dy);

      const curDir = this.getStraightRotateIndex(stepX, stepY);

      // 拐点：替换基准点为 turn-img
      if (this.lastDir !== null && this.lastDir !== curDir) {
        const turnRotate = this.getTurnRotateIndex(this.lastDir, curDir);
        if (turnRotate === undefined) {
          console.log("invalid turn");
          return;
        }

        this.replaceNodeAtPosition(oldNode, {
          type: "turn-img",
          rotate: turnRotate,
        });
      }

      // 判空
      for (let i = 1; i <= steps; i++) {
        const x = oldNode.x + stepX * i;
        const y = oldNode.y + stepY * i;

        if (!this.isCellEmptyByPosition(x, y)) {
          console.log("not all empty");
          return;
        }
      }

      // 生成直线 belt
      for (let i = 1; i <= steps; i++) {
        const x = oldNode.x + stepX * i;
        const y = oldNode.y + stepY * i;

        this.generateOneBelt({ x, y }, "belt-img", curDir, id);
      }

      // 更新基准点
      this.lastBaseNode = { ...newPosition };
      this.lastDir = curDir;
    },

    //左键事件
    handleLeftClick(event) {
      if (this.toolbarMode == "belts") {
        if (this.isCellEmpty(event)) {
          const position = this.getPositionFromClick(event);
          this.generateBelt(position, "belt");
        }
      }

      if (!["belts", "select", "default"].includes(this.toolbarMode)) {
        if (this.isCellEmpty(event)) {
          const position = this.getPositionFromClick(event);
          this.generateOneBelt(
            position,
            `${this.toolbarMode}-img`,
            0,
            this.toolbarMode
          );
        }
      }
    },

    //右键事件
    handleRightClick(event) {
      event.preventDefault();
      event.stopPropagation();
      //处于连接状态取消连接模式
      if (this.isBeltConnecting) {
      } else {
        //否则就进行删除
        const position = this.getPositionFromClick(event);
        this.deleteOneBelt(position);
      }
    },

    //蓝图导入对话框点击
    handleBluePrintImportDialog() {
      this.isBluePrintImport = true;
    },

    handleBluePrintUpload(file) {
      if (file.status !== 'ready') return
      const rawFile = file.raw;
      if (!rawFile) return;
      if (!rawFile.name.endsWith(".json")) {
        //ElMessage.error("只能导入 JSON 蓝图文件");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const blueprint = JSON.parse(reader.result);
        this.importBluePrint(blueprint);
      };
      reader.readAsText(rawFile);
    },

    //创建机器|对原makeGrid的封装
    makeMachine(config) {
      const { id, machine_id, recipe, rotate, x, y, w, h } = config;
      //step1 gridWidgets创建对应id的dict 并导入 rotate和recipe数据
      this.gridWidgets[id] = { rotate: rotate, recipe: recipe };
      //step2 创建元素并指向id对应的element项
      const vnode = createVNode(machineComponentMap[machine_id], {
        gs_id: id,
        el_name: machine_id,
        el_size: { w: w, h: h },
      });
      vnode.appContext = this.appContext;
      const container = document.createElement("div");
      render(vnode, container);
      this.gridWidgetElements[id] = this.rootGrid.makeWidget(container, {
        x: x,
        y: y,
        w: w,
        h: h,
        noResize: true,
        id: id,
      });
    },

    //保存蓝图
    saveBluePrint() {
      let output = { machine: null, belt: null };
      let machines = [];
      let belts = [];
      const listBelt = Object.entries(this.gridBelt2dElement);
      const listElement = Object.entries(this.gridWidgetElements);
      const listElementConfig = Object.entries(this.gridWidgets);
      console.log(listElement, listElementConfig);
      for (let index = 0; index < listElement.length; index += 1) {
        let [key, { rotate, recipe }] = listElementConfig.at(index);
        let [_, element] = listElement.at(index);
        let storageValue = {
          id: key,
          machine_id: key.split("_")[0],
          recipe: recipe,
          rotate: rotate,
          x: element.gridstackNode.x,
          y: element.gridstackNode.y,
          w: element.gridstackNode.w,
          h: element.gridstackNode.h,
        };
        machines.push(storageValue);
      }
      output.machine = machines;

      for (let index = 0; index < listBelt.length; index += 1) {
        let [position, element] = listBelt.at(index);
        let [x, y] = position.split("-");
        let { rotate, type } = this.gridBelts2d[Number(x)][Number(y)];
        let storageValue = {
          id: element.gridstackNode.id,
          type: type,
          rotate: rotate,
          position: {
            x: Number(x),
            y: Number(y),
          },
        };
        belts.push(storageValue);
      }
      output.belt = belts;
      //默认存在localStorage
      localStorage.removeItem("blueprint");
      localStorage.blueprint = JSON.stringify(output);
      return output;
    },

    //导入蓝图
    importBluePrint(blueprint) {
      let { machine, belt } = blueprint;
      for (let mac of machine) {
        this.makeMachine(mac);
      }
      for (let blt of belt) {
        this.generateOneBelt(blt.position, blt.type, blt.rotate, blt.id);
      }
    },

    //导出蓝图|By GPT
    exportBluePrint(blueprint, fileName = "blueprint.json") {
      blueprint = this.saveBluePrint();
      try {
        // 1. 将对象转换为 JSON 字符串
        const jsonStr = JSON.stringify(blueprint, null); // 格式化缩进为 2 空格

        // 2. 创建 Blob 对象
        const blob = new Blob([jsonStr], { type: "application/json" });

        // 3. 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;

        // 4. 触发点击下载
        a.click();

        // 5. 释放 URL 对象
        URL.revokeObjectURL(url);

        console.log("JSON 文件导出成功！");
      } catch (error) {
        console.error("导出 JSON 出错：", error);
      }
    },
  },
});
