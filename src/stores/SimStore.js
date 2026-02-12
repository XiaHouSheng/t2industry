import { GridStack } from "gridstack";
import { defineStore } from "pinia";
import { markRaw } from "vue";
import { ElNotification } from "element-plus";
import toast from "../components/ui/wrapper-v1/toast/toast.js";
import messagebox from "../components/ui/wrapper-v1/messagebox/messagebox.js";
import KeyBoardHandler from "../utils/KeyBoardHandler.js";

export const useRootStore = defineStore("sheng-root-store", {
  state: () => ({
    // -------------------- 主机地址 --------------------
    host: "https://api.t2blueprint.xyz",
    // -------------------- 应用上下文 --------------------
    appContext: null,

    // -------------------- 状态标志 --------------------
    //这里是Dialog相关的
    isBluePrintImport: false,
    isRecipeChoose: false,
    isWareHouseRecipeChoose: false,
    //一般的状态标志
    isZomming: false,
    isShowSupplierExtent: false,
    isShowMachines: true,
    isShowBelts: true,
    isShowPipes: true,
    isShowPipePort: true,
    quickPlaceMode: "belt",
    //keyboard状态
    keyboardCommand: null,
    selectSubMode: null,
    // -------------------- 选择状态 --------------------
    recipeChooseId: "",
    materialChooseId: "",

    // -------------------- 工具栏状态 --------------------
    toolbarMode: "default",
    beltSelect: "turn",
    editPartChoose: "part0", //当前编辑的模块

    // -------------------- 网格和控件存储 --------------------
    gridWidgetElements: markRaw({}), //用于非传送带模拟控件的存储|id->{element:el}
    gridWidgets: {}, //用于非传送带模拟控件配置存储|id->{rotate:rotate,recipe:recipe,part:partName}
    gridBelt2dElement: markRaw({}),
    gridBelts2d: null, //存储传送带的元素|x,y->{rotate:rotate,type:type}
    gridPipe2dElement: markRaw({}),
    gridPipes2d: null, //存储管道的元素|x,y->{rotate:rotate,type:type}
    // -------------------- 模块相关存储 --------------------
    partsWidgetId: {
      part0: new Set(),
    }, //存储模块对应的widgetId|partName->widgetIdList
    partsBelts: {
      part0: new Set(),
    }, //存储模块对应的传送带|partName->beltIdList
    partsPipes: {
      part0: new Set(),
    }, //存储模块对应的管道|partName -> pipeIdList
    // 模块列表，结构：[{name: "模块", code: "", show: true, edited: false}]
    parts: [
      {
        name: "part0",
        code: "",
        show: true,
      },
    ],

    // -------------------- 网格配置 --------------------
    rootGrid: null, //存储根gridstack对象
    gridEl: null, //存储根元素对象
    gridElCont: null, //存储gridstack的父容器
    overlay: null, //存储遮罩层元素对象
    pipeGrid: null, //存储管道网格元素对象
    rootPipeGrid: null, //管道网格引擎
    // -------------------- 缩放相关配置 --------------------
    gridElContScale: 1,
    defaultWidth: 3017,
    defaultHeight: 3017,
    defaultMaxWidth: 3017,
    defaultMinWidth: 1578,
    numColumn: 72, //列个数

    // -------------------- 网格选项 --------------------
    gridOptions: {
      minRow: 72, //行个数
      allowNewRow: false, //可向下扩充行
      float: true, //可以随意摆放
      //可以拖入
      acceptWidgets: function (el) {
        return true;
      },
    },
    gridPipeOptions: {
      minRow: 72, //行个数
      allowNewRow: false, //可向下扩充行
      float: true, //可以随意摆放
      //可以拖入
      acceptWidgets: function (el) {
        return false;
      },
    },

    // -------------------- 传送带相关状态 --------------------
    lastBaseNode: null, // 上一次的基准点 { x, y }
    lastDir: null, // 上一次方向（0-3）
  }),

  actions: {
    // ======================================================
    // -------------------- 网格管理 --------------------
    // ======================================================

    initGrid(target_el, target_cont, overlay, app_context) {
      this.initBelts2d();
      this.appContext = app_context;
      this.gridEl = markRaw(target_el);
      this.gridElCont = markRaw(target_cont);
      this.overlay = markRaw(overlay);
      this.rootGrid = markRaw(GridStack.init(this.gridOptions, target_el));
      this.rootGrid.column(this.numColumn);
      this.gridEl.style.width = `${this.defaultWidth}px`;
      this.gridEl.style.height = `${this.defaultHeight}px`;
      this.gridElContScale = 1;
    },

    initPipeGrid(pipeGrid) {
      this.pipeGrid = markRaw(pipeGrid);
      this.rootPipeGrid = markRaw(
        GridStack.init(this.gridPipeOptions, pipeGrid),
      );
      this.rootPipeGrid.column(this.numColumn);
      this.pipeGrid.style.width = `${this.defaultWidth}px`;
      this.pipeGrid.style.height = `${this.defaultHeight}px`;
      this.gridPipes2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => ({})),
      );
    },

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

    isCellEmpty(event) {
      const { x, y } = this.getPositionFromClick(event);
      return this.isCellEmptyByPosition(x, y);
    },

    isCellEmptyByPosition(x, y) {
      return this.rootGrid.isAreaEmpty(x, y, 1, 1);
    },

    isCellEmptyPipe(event) {
      const { x, y } = this.getPositionFromClick(event);
      return this.isCellEmptyForPipe(x, y);
    },

    isCellEmptyForPipe(x, y) {
      /*
      机器-判定 传送带-过滤
      */
      //这里进行belt-machine的判断
      let isEmptyMachineOrBelt = this.rootGrid.isAreaEmpty(x, y, 1, 1);
      let isEmptyBelt = Object.keys(this.gridBelts2d[x][y]).length === 0;
      let isEmptyPipe = Object.keys(this.gridPipes2d[x][y]).length === 0;
      //console.log(isEmptyMachineOrBelt,isEmptyBelt,isEmptyPipe)
      //有管道了 - 不为空
      if (!isEmptyPipe) return false;
      //只有机器 - 不为空
      if (!isEmptyMachineOrBelt && isEmptyBelt) return false;
      //只有传送带 - 过滤
      if (!isEmptyMachineOrBelt && !isEmptyBelt) return true;
      // 没管道 - 允许
      if (isEmptyPipe) return true;
    },

    // ======================================================
    // -------------------- 模块管理 --------------------
    // ======================================================

    addNewPart() {
      const newPart = {
        name: `part${this.parts.length}`,
        code: "",
        show: true,
      };
      this.partsBelts[newPart.name] = new Set();
      this.partsWidgetId[newPart.name] = new Set();
      this.partsPipes[newPart.name] = new Set();
      this.parts.push(newPart);
    },

    selectEditPart(partName) {
      this.editPartChoose = partName;
    },

    handlePartShowChange(index, value) {
      const part = this.parts[index];
      this.showPartWidgets(part, value);
    },

    showPartWidgets(part, value) {
      // 显示模块对应的机器
      for (let widgetId of this.partsWidgetId[part.name]) {
        this.gridWidgetElements[widgetId].style.opacity = value ? 1 : 0.2;
      }
      // 显示模块对应的传送带
      for (let beltId of this.partsBelts[part.name]) {
        this.gridBelt2dElement[beltId].style.opacity = value ? 1 : 0.2;
      }
      //显示模块对应的管道
      for (let pipeId of this.partsPipes[part.name]) {
        this.gridPipe2dElement[pipeId].style.opacity = value ? 1 : 0.2;
      }
    },

    deletePart(index) {
      const part = this.parts[index];

      // 显示确认对话框
      messagebox
        .confirm("是否删除？模块中的机器和传送带会被并入part0", "确认删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then((result) => {
          if (!result) return;

          // 如果模块显示为 true，则不重新赋值 opacity 为 1
          for (let widgetId of this.partsWidgetId[part.name]) {
            this.partsWidgetId["part0"].add(widgetId);
            this.gridWidgetElements[widgetId].style.opacity = this.parts[0].show
              ? 1
              : 0.2;
          }
          // 删除模块对应的传送带
          for (let beltId of this.partsBelts[part.name]) {
            this.partsBelts["part0"].add(beltId);
            this.gridBelt2dElement[beltId].style.opacity = this.parts[0].show
              ? 1
              : 0.2;
          }
          // 删除模块对应的管道
          for (let pipeId of this.partsPipes[part.name]) {
            this.partsPipes["part0"].add(pipeId);
            this.gridPipe2dElement[pipeId].style.opacity = this.parts[0].show
              ? 1
              : 0.2;
          }
          // 删除模块
          this.parts.splice(index, 1);
          // 将 editPartChoose 重置为 part0
          this.editPartChoose = "part0";
        });
    },

    copyEditCode(index) {
      // 获取对应索引的模块对象
      //console.log("nowpart", this.parts);
      const part = this.parts[index];
      if (!part) return;
      KeyBoardHandler.disable();
      // 显示输入对话框
      messagebox
        .prompt("编辑模块代码", "代码编辑", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          defaultValue: part.code || "",
        })
        .then((value) => {
          if (value !== null) {
            // 直接通过索引更新parts数组中的对象
            this.parts[index].code = value;
          }
        })
        .finally(() => {
          KeyBoardHandler.enable();
        });
    },

    // ======================================================
    // -------------------- 缩放管理 --------------------
    // ======================================================

    handleScalingChange_(event) {
      event.preventDefault();
      event.stopPropagation();
      // select 模式禁用
      if (this.toolbarMode === "select" || this.isRecipeChoose) return;
      // 初始化（只做一次）
      if (!this.isZomming) {
        this.isZomming = true;
        this.rootGrid.setStatic(true);
      }
      // Leaflet 风格：小步长
      const delta = -event.deltaY * 0.0005;
      this.gridElContScale = Math.max(
        0.35,
        Math.min(2, this.gridElContScale + delta),
      );
      // 更新键盘处理器的缩放比例
      KeyBoardHandler.updateScale(this.gridElContScale);
      // 应用视觉缩放（通过CSS transform: scale()）
      this.gridEl.style.transform = `scale(${this.gridElContScale}) translate(100px, 100px)`;
      // 更新遮罩层的缩放
      this.overlay.style.transform = `scale(${this.gridElContScale}) translate(100px, 100px)`;
      // 更新管道网格的缩放
      this.pipeGrid.style.transform = `scale(${this.gridElContScale}) translate(100px, 100px)`;
      // 缩放结束（防抖）
      clearTimeout(this._zoomEndTimer);
      this._zoomEndTimer = setTimeout(() => {
        this.isZomming = false;
        this.rootGrid.setStatic(false);
      }, 120);
    },

    // ======================================================
    // -------------------- 传送带管理 --------------------
    // ======================================================

    initBelts2d() {
      this.gridBelts2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => ({})),
      );
    },

    deleteOneBelt(position) {
      const targetElement =
        this.gridBelt2dElement[`${position.x}-${position.y}`];
      if (targetElement) {
        //待定
        this.rootGrid.removeWidget(targetElement);
        let part = this.gridBelts2d[position.x][position.y].part;
        this.partsBelts[part].delete(`${position.x}-${position.y}`);
        this.gridBelts2d[position.x][position.y] = {};
        delete this.gridBelt2dElement[`${position.x}-${position.y}`];
      }
    },

    deleteOnePipe(position) {
      const targetElement =
        this.gridPipe2dElement[`${position.x}-${position.y}`];
      if (targetElement) {
        //待定
        this.rootPipeGrid.removeWidget(targetElement);
        let part = this.gridPipes2d[position.x][position.y].part;
        this.partsPipes[part].delete(`${position.x}-${position.y}`);
        this.gridPipes2d[position.x][position.y] = {};
        delete this.gridPipe2dElement[`${position.x}-${position.y}`];
      }
    },

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

    deleteSeriesPipe2d(midDeleteData) {
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
          this.deleteOnePipe(position);
        }
      }
    },

    // ======================================================
    // -------------------- 事件处理 --------------------
    // ======================================================
    handleDialogRecipeClose() {
      this.rootGrid.enableMove(true);
    },

    // 处理overlay点击事件，传递给底层grid-stack
    handleOverlayClick(event, detail = {}) {
      //console.log("handleOverlayClick", event);
      const newEvent = new MouseEvent("click", {
        clientX: event.clientX,
        clientY: event.clientY,
        bubbles: true,
        cancelable: true,
      });
      const newEventEnhance = Object.assign(newEvent, detail);
      // 触发grid-stack的点击事件
      if (this.quickPlaceMode === "belt") {
        this.gridEl.dispatchEvent(newEventEnhance);
      }
      //pipeGrid点击事件
      if (this.quickPlaceMode === "pipe") {
        this.pipeGrid.dispatchEvent(newEventEnhance);
      }
    },

    // ======================================================
    // -------------------- 机器管理 --------------------
    // ======================================================

    checkNodesCanMove(engine, nodes, bias, errorMessage, type) {
      const { biasX, biasY } = bias;

      const canMove = Object.entries(nodes).every(([nodeId, node]) => {
        let preElement = null;
        if (type == "machine") {
          preElement = this.gridWidgetElements[nodeId];
        } else if (type == "belt") {
          preElement = this.gridBelt2dElement[`${node.x}-${node.y}`];
        } else if (type == "pipe") {
          preElement = this.gridPipe2dElement[`${node.x}-${node.y}`];
        }
        const preNode = preElement.gridstackNode;
        const newX = preNode.x + biasX;
        const newY = preNode.y + biasY;
        return engine.isAreaEmpty(newX, newY, preNode.w, preNode.h);
      });

      if (!canMove) {
        toast.error(errorMessage);
        return false;
      }

      return true;
    },

    batchMovePipe(nodes, bias) {
      const { biasX, biasY } = bias;
      const engine = this.rootPipeGrid.engine;

      // 第二步：所有节点的新位置都可用，开始批量更新
      engine.batchUpdate(true, true);
      engine.float = false;

      // 临时存储需要移动的管道数据
      const pipesToMove = [];

      // 第一步：遍历当前位置，清除数据
      Object.entries(nodes).forEach(([nodeId, node]) => {
        const preElement = this.gridPipe2dElement[`${node.x}-${node.y}`];
        const preNode = preElement.gridstackNode;
        const oldX = preNode.x;
        const oldY = preNode.y;

        // 保存管道数据
        const pipeData = this.gridPipes2d[oldX][oldY];
        if (pipeData) {
          pipesToMove.push({
            element: preElement,
            oldX,
            oldY,
            data: pipeData,
          });

          // 从原位置清除数据
          this.gridPipes2d[oldX][oldY] = {};
          delete this.gridPipe2dElement[`${oldX}-${oldY}`];
        }
      });

      // 第二步：更新位置并设置新坐标的数据
      pipesToMove.forEach(({ element, oldX, oldY, data }) => {
        const preNode = element.gridstackNode;
        const newX = preNode.x + biasX;
        const newY = preNode.y + biasY;

        // 更新网格位置
        this.rootPipeGrid.update(element, { x: newX, y: newY });

        // 在新位置设置数据
        this.gridPipes2d[newX][newY] = data;
        this.gridPipe2dElement[`${newX}-${newY}`] = element;

        // 更新partsPipes中的位置
        const part = data.part;
        if (part) {
          this.partsPipes[part].delete(`${oldX}-${oldY}`);
          this.partsPipes[part].add(`${newX}-${newY}`);
        }
      });

      //结束批量更新，进行提交
      engine.batchUpdate(false, true);
      engine.float = true;
      return true;
    },

    batchMoveBelt(nodes, bias) {
      const { biasX, biasY } = bias;
      const engine = this.rootGrid.engine;

      // 第二步：所有节点的新位置都可用，开始批量更新
      engine.batchUpdate(true, true);
      engine.float = false;

      // 临时存储需要移动的传送带数据
      /*
      this.gridBelt2dElement[`${position.x}-${position.y}`] = craftElement;
      this.gridBelts2d[position.x][position.y] = {
        rotate: rotate,
        type: type,
        id: id,
        part: this.editPartChoose,
      };
       */
      const beltsToMove = [];

      // 第一步：遍历当前位置，清除数据
      Object.entries(nodes).forEach(([nodeId, node]) => {
        const preElement = this.gridBelt2dElement[`${node.x}-${node.y}`];
        const preNode = preElement.gridstackNode;
        const oldX = preNode.x;
        const oldY = preNode.y;

        // 保存传送带数据
        const beltData = this.gridBelts2d[oldX][oldY];
        if (beltData) {
          beltsToMove.push({
            element: preElement,
            oldX,
            oldY,
            data: beltData,
          });

          // 从原位置清除数据
          this.gridBelts2d[oldX][oldY] = {};
          delete this.gridBelt2dElement[`${oldX}-${oldY}`];
        }
      });

      // 第二步：更新位置并设置新坐标的数据
      beltsToMove.forEach(({ element, oldX, oldY, data }) => {
        const preNode = element.gridstackNode;
        const newX = preNode.x + biasX;
        const newY = preNode.y + biasY;

        // 更新网格位置
        this.rootGrid.update(element, { x: newX, y: newY });

        // 在新位置设置数据
        this.gridBelts2d[newX][newY] = data;
        this.gridBelt2dElement[`${newX}-${newY}`] = element;

        // 更新partsBelts中的位置
        const part = data.part;
        if (part) {
          this.partsBelts[part].delete(`${oldX}-${oldY}`);
          this.partsBelts[part].add(`${newX}-${newY}`);
        }
      });

      //结束批量更新，进行提交
      engine.batchUpdate(false, true);
      engine.float = true;
      return true;
    },

    batchMoveMahcine(nodes, bias) {
      const { biasX, biasY } = bias;
      const engine = this.rootGrid.engine;

      // 第二步：所有节点的新位置都可用，开始批量更新
      engine.batchUpdate(true, true);
      engine.float = false;
      //进行批量MOVE操作
      Object.entries(nodes)
        .reverse()
        .forEach(([nodeId, node]) => {
          const preElement = this.gridWidgetElements[nodeId];
          const preNode = preElement.gridstackNode;
          const newX = preNode.x + biasX;
          const newY = preNode.y + biasY;
          this.rootGrid.update(preElement, { x: newX, y: newY, w: node.width, h: node.height });
        });

      //结束批量更新，进行提交
      engine.batchUpdate(false, true);
      engine.float = true;
      return true;
    },

    batchMove(nodes, bias) {
      const { machineNodes, beltNodes, pipeNodes } = nodes;
      const engine = this.rootGrid.engine;
      const pipeEngine = this.rootPipeGrid.engine;

      const isOkMachine = this.checkNodesCanMove(
        engine,
        machineNodes,
        bias,
        "有机器位置冲突，无法移动",
        "machine",
      );
      const isOkBelt = this.checkNodesCanMove(
        engine,
        beltNodes,
        bias,
        "有传送带位置冲突，无法移动",
        "belt",
      );
      const isOkPipe = this.checkNodesCanMove(
        pipeEngine,
        pipeNodes,
        bias,
        "有管道位置冲突，无法移动",
        "pipe",
      );

      if (!isOkMachine || !isOkBelt || !isOkPipe) {
        return false;
      }
      this.batchMoveMahcine(machineNodes, bias);
      this.batchMoveBelt(beltNodes, bias);
      this.batchMovePipe(pipeNodes, bias);
      return true;
    },

    deleteMachineById(gs_id) {
      this.rootGrid.removeWidget(this.gridWidgetElements[gs_id]);
      let part = this.gridWidgets[gs_id].part;
      this.partsWidgetId[part].delete(gs_id);
      delete this.gridWidgetElements[gs_id];
      delete this.gridWidgets[gs_id];
    },

    deleteTarget(config) {
      const { machineObjs, beltObjs, pipeObjs } = config;
      const machineNodes = Object.entries(machineObjs);
      const beltNodes = Object.entries(beltObjs);
      const pipeNodes = Object.entries(pipeObjs);
      const deleteMachine = (machineNodes, pipeNodes, beltNodes) => {
        if (machineNodes.length > 0) {
          machineNodes.forEach(([nodeId, node]) => {
            console.log(nodeId, node);
            this.deleteMachineById(nodeId);
          });
        }
        if (beltNodes.length > 0) {
          beltNodes.forEach(([nodeId, node]) => {
            this.deleteOneBelt({ x: node.x, y: node.y });
          });
        }
        if (pipeNodes.length > 0) {
          pipeNodes.forEach(([nodeId, node]) => {
            this.deleteOnePipe({ x: node.x, y: node.y });
          });
        }
        this.toolbarMode = "default";
      };

      if (machineNodes.length > 3) {
        messagebox
          .confirm("确认删除所选？", "删除确认", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
          .then((result) => {
            if (result) {
              deleteMachine(machineNodes, pipeNodes, beltNodes);
            }
          });
      } else {
        deleteMachine(machineNodes, pipeNodes, beltNodes);
      }
    },

    // ======================================================
    // -------------------- 蓝图管理 --------------------
    // ======================================================

    handleBluePrintImportDialog() {
      this.isBluePrintImport = true;
    },

    saveBluePrint() {
      let output = { machine: null, belt: null, part: null };
      let machines = [];
      let belts = [];
      let pipes = [];
      let part_dict = {};
      const listBelt = Object.entries(this.gridBelt2dElement);
      const listPipe = Object.entries(this.gridPipe2dElement);
      const listElement = Object.entries(this.gridWidgetElements);
      const listElementConfig = Object.entries(this.gridWidgets);
      //console.log(listElement, listElementConfig);
      for (let index = 0; index < listElement.length; index += 1) {
        let [key, { rotate, recipe, part }] = listElementConfig.at(index);
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
          part: part,
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

      for (let index = 0; index < listPipe.length; index += 1) {
        let [position, element] = listPipe.at(index);
        let [x, y] = position.split("-");
        let { rotate, type } = this.gridPipes2d[Number(x)][Number(y)];
        let storageValue = {
          id: element.gridstackNode.id,
          type: type,
          rotate: rotate,
          position: {
            x: Number(x),
            y: Number(y),
          },
        };
        pipes.push(storageValue);
      }
      output.pipe = pipes;

      part_dict["parts"] = this.parts;
      part_dict["partsWidgetId"] = {};
      part_dict["partsBelts"] = {};
      part_dict["partsPipes"] = {};
      part_dict["editPartChoose"] = this.editPartChoose;

      for (let partName of Object.keys(this.partsWidgetId)) {
        let widgetIds = Array.from(this.partsWidgetId[partName]);
        let beltIds = Array.from(this.partsBelts[partName]);
        let pipeIds = Array.from(this.partsPipes[partName]);
        part_dict["partsWidgetId"][partName] = widgetIds;
        part_dict["partsBelts"][partName] = beltIds;
        part_dict["partsPipes"][partName] = pipeIds;
      }

      output.part = part_dict;

      //默认存在localStorage
      localStorage.removeItem("blueprint");
      localStorage.blueprint = JSON.stringify(output);
      ElNotification.success({
        title: "成功",
        message: "蓝图保存成功",
      });
      return output;
    },

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

        //console.log("JSON 文件导出成功！");
      } catch (error) {
        console.error("导出 JSON 出错：", error);
      }
    },

    clearBlueprint() {
      // 清空gridstack中的所有元素
      if (this.rootGrid) {
        this.rootGrid.removeAll();
      }

      if (this.rootPipeGrid) {
        this.rootPipeGrid.removeAll();
      }

      // 清空存储的元素和配置
      this.gridWidgetElements = markRaw({});
      this.gridWidgets = {};
      this.gridBelt2dElement = markRaw({});
      this.gridBelts2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => ({})),
      );
      this.gridPipe2dElement = markRaw({});
      this.gridPipes2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => ({})),
      );

      // 清空模块相关数据
      this.partsWidgetId = {
        part0: new Set(),
      };
      this.partsBelts = {
        part0: new Set(),
      };
      this.partsPipes = {
        part0: new Set(),
      };
      this.parts = [
        {
          name: "part0",
          code: "",
          show: true,
        },
      ];
      this.editPartChoose = "part0";
    },

    // ======================================================
    // -------------------- Middleware --------------------
    // ======================================================

    addBelt(config) {
      const { position, type, rotate, id, craftElement } = config;
      this.partsBelts[this.editPartChoose].add(`${position.x}-${position.y}`);
      this.gridBelt2dElement[`${position.x}-${position.y}`] = craftElement;
      this.gridBelts2d[position.x][position.y] = {
        rotate: rotate,
        type: type,
        id: id,
        part: this.editPartChoose,
      };
    },

    addPipe(config) {
      const { position, type, rotate, id, craftElement } = config;
      this.partsPipes[this.editPartChoose].add(`${position.x}-${position.y}`);
      this.gridPipe2dElement[`${position.x}-${position.y}`] = craftElement;
      this.gridPipes2d[position.x][position.y] = {
        rotate: rotate,
        type: type,
        id: id,
        part: this.editPartChoose,
      };
    },

    removeTargetPipe(position) {
      const el = this.gridPipe2dElement[`${position.x}-${position.y}`];
      if (!el) return false;
      this.rootPipeGrid.removeWidget(el, true);
      this.gridPipes2d[position.x][position.y] = {};
      return true;
    },

    removeTargetBelt(position) {
      const el = this.gridBelt2dElement[`${position.x}-${position.y}`];
      if (!el) return false;
      this.rootGrid.removeWidget(el, true);
      this.gridBelts2d[position.x][position.y] = {};
      return true;
    },

    addMachine(config) {
      const { id, recipe, rotate, part, machineElement } = config;
      this.gridWidgetElements[id] = machineElement;
      this.gridWidgets[id] = { rotate: rotate, recipe: recipe, part: part };
      this.partsWidgetId[part].add(id);
    },

    initPart(part) {
      // 加载 part 数据
      if (part) {
        this.parts = part.parts || [];
        // 加载 partsWidgetId，将数组转换回 Set
        this.partsWidgetId = {};
        if (part.partsWidgetId) {
          for (let partName of Object.keys(part.partsWidgetId)) {
            this.partsWidgetId[partName] = new Set(
              part.partsWidgetId[partName],
            );
          }
        }

        // 加载 partsBelts，将数组转换回 Set
        this.partsBelts = {};
        if (part.partsBelts) {
          for (let partName of Object.keys(part.partsBelts)) {
            this.partsBelts[partName] = new Set(part.partsBelts[partName]);
          }
        }

        this.partsPipes = {};
        if (part.partsPipes) {
          for (let partName of Object.keys(part.partsPipes)) {
            this.partsPipes[partName] = new Set(part.partsPipes[partName]);
          }
        }

        // 加载 editPartChoose
        this.editPartChoose = part.editPartChoose || "part0";
      }
    },
  },
});
