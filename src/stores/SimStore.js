import { GridStack } from "gridstack";
import { defineStore } from "pinia";
import { createVNode, markRaw, render } from "vue";
import { machineComponentMap } from "../utils/MachineMap";
import ConveyerBelt from "../components/simulation/ConveyerBelt.vue";
import { ElNotification, ElMessageBox } from "element-plus";
import keyboardHandler from "../utils/keyboardHandler";
import dragScrollHandler from "../utils/dragScrollHandler";
import beltIndicator from "../utils/beltIndicator";

export const useRootStore = defineStore("sheng-root-store", {
  state: () => ({
    // -------------------- 应用上下文 --------------------
    appContext: null,

    // -------------------- 状态标志 --------------------
    isBluePrintImport: false,
    isRecipeChoose: false,
    isWareHouseRecipeChoose: false,
    isZomming: false,
    isShowSupplierExtent: true,
    isShowMachines: true,
    isShowBelts: true,
    quickPlaceMode: "belt",

    // -------------------- 选择状态 --------------------
    recipeChooseId: "",
    materialChooseId: "",

    // -------------------- 工具栏状态 --------------------
    toolbarMode: "default",
    toolbarModeHistory: "default",
    beltSelect: "turn",
    editPartChoose: "part0", //当前编辑的模块

    // -------------------- 网格和控件存储 --------------------
    gridWidgetElements: markRaw({}), //用于非传送带模拟控件的存储|id->{element:el}
    gridWidgets: {}, //用于非传送带模拟控件配置存储|id->{rotate:rotate,recipe:recipe,part:partName}
    gridBelt2dElement: markRaw({}),
    gridBelts2d: null, //存储传送带的元素|x,y->{rotate:rotate,type:type}

    // -------------------- 模块相关存储 --------------------
    partsWidgetId: {
      part0: new Set(),
    }, //存储模块对应的widgetId|partName->widgetIdList
    partsBelts: {
      part0: new Set(),
    }, //存储模块对应的传送带|partName->beltIdList

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
    rootGridEngine: null, //gridstack引擎
    gridEl: null, //存储根元素对象
    gridElCont: null, //存储gridstack的父容器
    overlay: null, //存储遮罩层元素对象

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

      // 初始化键盘事件监听
      keyboardHandler.init(this.gridElCont);
      keyboardHandler.updateScale(this.gridElContScale);
      // 初始化右键拖动滚动监听
      dragScrollHandler.init(this.gridElCont);
      // 初始化传送带指示器
      beltIndicator.init(this.overlay);
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
      return this.rootGrid.isAreaEmpty(x, y, 1, 1);
    },

    isCellEmptyByPosition(x, y) {
      return this.rootGrid.isAreaEmpty(x, y, 1, 1);
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
        0.2,
        Math.min(2, this.gridElContScale + delta),
      );
      // 更新键盘处理器的缩放比例
      keyboardHandler.updateScale(this.gridElContScale);
      // 应用视觉缩放（通过CSS transform: scale()）
      this.gridEl.style.transform = `scale(${this.gridElContScale}) translate(100px, 100px)`;
      // 更新遮罩层的缩放
      this.overlay.style.transform = `scale(${this.gridElContScale}) translate(100px, 100px)`;
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

    generateOneBelt(position, type = "belt-img", rotate = 0, id_in = null) {
      let craftElement = document.createElement("div");
      let id = id_in
        ? id_in
        : `${id_in}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
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
      // 记录传送带对应的模块
      this.partsBelts[this.editPartChoose].add(`${position.x}-${position.y}`);
      this.gridBelt2dElement[`${position.x}-${position.y}`] = craftElement;
      this.gridBelts2d[position.x][position.y] = {
        rotate: rotate,
        type: type,
        id: id,
        part: this.editPartChoose,
      };
    },

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
        //console.log("not a straight line");
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
          //console.log("invalid turn");
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
          //console.log("not all empty");
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

    // ======================================================
    // -------------------- 事件处理 --------------------
    // ======================================================

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
            this.toolbarMode,
          );
        }
      }
    },

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

    handleDialogRecipeClose() {
      this.rootGrid.enableMove(true);
    },

    handleBeltModeChange(value) {
      //select模式下禁用cont的scroll
      if (value == "select") {
        this.gridElCont.style.overflow = "hidden";
      } else {
        this.gridElCont.style.overflow = "scroll";
      }
      if (this.toolbarMode == "belts") {
        beltIndicator.handleStartBelt();
      }
      if (this.toolbarModeHistory == "belts") {
        this.lastBaseNode = null;
        this.lastDir = null;
        beltIndicator.handleEndBelt();
      }
      this.toolbarModeHistory = value;
    },

    // ======================================================
    // -------------------- 机器管理 --------------------
    // ======================================================

    makeMachine(config) {
      const { id, machine_id, recipe, rotate, x, y, w, h, part } = config;
      console.log(config);
      //step2 创建元素并指向id对应的element项
      console.log(machine_id, w, h);
      const vnode = createVNode(machineComponentMap[machine_id], {
        gs_id: id,
        el_name: machine_id,
        el_size: { w: w, h: h },
        rotate: rotate,
      });
      console.log(vnode)
      //step1 gridWidgets创建对应id的dict 并导入 rotate和recipe数据
      this.gridWidgets[id] = { rotate: rotate, recipe: recipe, part: part };

      //测试：将新创建的widget添加到当前编辑的模块中
      //this.partsWidgetId[this.editPartChoose].push(id);
      //vnode.appContext = this.appContext;

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
      this.parts.push(newPart);
    },

    selectEditPart(partName) {
      this.editPartChoose = partName;
    },

    handlePartShowChange(part, value) {
      this.showPartWidgets(part, value);
    },

    showPartWidgets(part, value) {
      for (let widgetId of this.partsWidgetId[part.name]) {
        this.gridWidgetElements[widgetId].style.opacity = value ? 1 : 0.2;
      }
      // 显示模块对应的传送带
      for (let beltId of this.partsBelts[part.name]) {
        this.gridBelt2dElement[beltId].style.opacity = value ? 1 : 0.2;
      }
    },

    deletePart(index) {
      const part = this.parts[index];

      // 显示确认对话框
      ElMessageBox.confirm(
        "是否删除？模块中的机器和传送带会被并入part0",
        "确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        },
      )
        .then(() => {
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
          // 删除模块
          this.parts.splice(index, 1);
          // 将 editPartChoose 重置为 part0
          this.editPartChoose = "part0";
        })
        .catch(() => {
          // 取消删除
        });
    },

    copyEditCode(index) {
      // 获取对应索引的模块对象
      console.log("nowpart", this.parts);
      const part = this.parts[index];
      if (!part) return;
      keyboardHandler.disable();
      // 显示输入对话框
      ElMessageBox.prompt("编辑模块代码", "代码编辑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: part.code || "",
        inputPlaceholder: "请输入模块代码",
      })
        .then(({ value }) => {
          // 直接通过索引更新parts数组中的对象
          this.parts[index].code = value;
        })
        .catch(() => {
          // 取消编辑
        })
        .finally(() => {
          keyboardHandler.enable();
        });
    },

    // ======================================================
    // -------------------- 蓝图管理 --------------------
    // ======================================================

    handleBluePrintImportDialog() {
      this.isBluePrintImport = true;
    },

    handleBluePrintUpload(file) {
      if (file.status !== "ready") return;
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

    saveBluePrint() {
      let output = { machine: null, belt: null, part: null };
      let machines = [];
      let belts = [];
      let part_dict = {};
      const listBelt = Object.entries(this.gridBelt2dElement);
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

      part_dict["parts"] = this.parts;
      part_dict["partsWidgetId"] = {};
      part_dict["partsBelts"] = {};
      part_dict["editPartChoose"] = this.editPartChoose;

      for (let partName of Object.keys(this.partsWidgetId)) {
        let widgetIds = Array.from(this.partsWidgetId[partName]);
        let beltIds = Array.from(this.partsBelts[partName]);
        part_dict["partsWidgetId"][partName] = widgetIds;
        part_dict["partsBelts"][partName] = beltIds;
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

    importBluePrint(blueprint) {
      let { machine, belt, part } = blueprint;
      for (let mac of machine) {
        this.makeMachine(mac);
      }
      for (let blt of belt) {
        this.generateOneBelt(blt.position, blt.type, blt.rotate, blt.id);
      }

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

        // 加载 editPartChoose
        this.editPartChoose = part.editPartChoose || "part0";
      }
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

    async loadBlueprintByHashCode(hashCode) {
      if (!hashCode) return;

      try {
        // 构建蓝图URL
        const blueprintUrl = `http://117.72.161.160:88/download/${hashCode}.json`;

        // 发送请求获取蓝图数据
        const response = await fetch(blueprintUrl);

        if (!response.ok) {
          throw new Error(`无法获取蓝图: ${response.status}`);
        }
        // 解析蓝图数据
        const blueprintData = await response.json();
        // 清空当前蓝图数据
        this.clearBlueprint();
        // 导入蓝图
        this.importBluePrint(blueprintData);

        //console.log(`蓝图 ${hashCode} 加载成功！`);
        return blueprintData;
      } catch (error) {
        console.error("加载蓝图出错：", error);
        throw error;
      }
    },

    clearBlueprint() {
      // 清空gridstack中的所有元素
      if (this.rootGrid) {
        this.rootGrid.removeAll();
      }

      // 清空存储的元素和配置
      this.gridWidgetElements = markRaw({});
      this.gridWidgets = {};
      this.gridBelt2dElement = markRaw({});
      this.gridBelts2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => ({})),
      );

      // 清空模块相关数据
      this.partsWidgetId = {
        part0: new Set(),
      };
      this.partsBelts = {
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

    loadLocalBlueprint() {
      if (localStorage.blueprint) {
        // 清空当前蓝图数据
        this.clearBlueprint();
        try {
          const blueprint = JSON.parse(localStorage.blueprint);
          this.importBluePrint(blueprint);
          //console.log("本地蓝图加载成功！");
          return blueprint;
        } catch (error) {
          console.error("加载本地蓝图出错：", error);
          throw error;
        }
      }
      return null;
    },
  },
});
