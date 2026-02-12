import { createVNode, render } from "vue";
import { useRootStore } from "../stores/SimStore";
import { machineComponentMap } from "../utils/MachineComponentMap";
import ConveyerBelt from "../components/simulation/ConveyerBelt.vue";
import Pipe from "../components/simulation/Pipe.vue";
class MachineMiddleware {
  constructor() {}
  init() {
    this.rootStore = useRootStore();
  }

  importBluePrint(blueprint) {
    let { machine, belt, part, pipe } = blueprint;
    for (let mac of machine) {
      this.makeMachine(mac);
    }
    for (let blt of belt) {
      this.generateOneBelt(blt.position, blt.type, blt.rotate, blt.id);
    }
    for (let pip of pipe) {
      this.generateOnePipe(pip.position, pip.type, pip.rotate, pip.id);
    }
    this.rootStore.initPart(part);
  }

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
    craftElement = this.rootStore.rootGrid.makeWidget(craftElement, {
      x: position.x,
      y: position.y,
      w: 1,
      h: 1,
      float: false,
      noResize: true,
      locked: true,
      id: id,
    });
    this.rootStore.rootGrid.movable(craftElement, false);
    // 记录传送带对应的模块
    const config = {
      position,
      type,
      rotate,
      id,
      craftElement,
    };
    this.rootStore.addBelt(config);
  }

  generateOnePipe(position, type = "belt-img-pipe", rotate = 0, id_in = null) {
    let craftElement = document.createElement("div");
    let id = id_in
      ? id_in
      : `${id_in}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let vnode = createVNode(Pipe, {
      gs_id: id,
      rotate: rotate,
      type: type,
      position: position,
    });
    render(vnode, craftElement);
    craftElement = this.rootStore.rootPipeGrid.makeWidget(craftElement, {
      x: position.x,
      y: position.y,
      w: 1,
      h: 1,
      float: false,
      noResize: true,
      locked: true,
      id: id,
    });
    this.rootStore.rootPipeGrid.movable(craftElement, false);
    // 记录传送带对应的模块 - 需要修改part的数据
    const config = {
      position,
      type,
      rotate,
      id,
      craftElement,
    };
    this.rootStore.addPipe(config);
  }

  replacePipeNodeAtPosition(position, { type, rotate }, id = "pipe") {
    if (!this.rootStore.removeTargetPipe(position)) return false;
    this.generateOnePipe(position, type, rotate, id);
  }

  replaceNodeAtPosition(position, { type, rotate }, id = "belt") {
    if (!this.rootStore.removeTargetBelt(position)) return false;
    this.generateOneBelt(position, type, rotate, id);
  }

  generateStraightPipe(from, to, id = "pipe") {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // 必须是直线
    if (dx !== 0 && dy !== 0) return false;

    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    const steps = Math.abs(dx + dy);

    const curDir = this.getStraightRotateIndex(stepX, stepY);

    // 拐点处理
    if (this.rootStore.lastDir !== null && this.rootStore.lastDir !== curDir) {
      const turnRotate = this.getTurnRotateIndex(
        this.rootStore.lastDir,
        curDir,
      );
      if (turnRotate === undefined) return false;

      this.replacePipeNodeAtPosition(from, {
        type: "turn-img-pipe",
        rotate: turnRotate,
      });
    }

    // 判空
    for (let i = 1; i <= steps; i++) {
      const x = from.x + stepX * i;
      const y = from.y + stepY * i;
      if (!this.rootStore.isCellEmptyForPipe(x, y)) return false;
    }

    // 生成 pipe
    for (let i = 1; i <= steps; i++) {
      const x = from.x + stepX * i;
      const y = from.y + stepY * i;
      this.generateOnePipe({ x, y }, "belt-img-pipe", curDir, id);
    }

    this.rootStore.lastDir = curDir;
    return true;
  }

  generateStraightBelt(from, to, id = "belt") {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // 必须是直线
    if (dx !== 0 && dy !== 0) return false;

    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    const steps = Math.abs(dx + dy);

    const curDir = this.getStraightRotateIndex(stepX, stepY);

    // 拐点处理
    if (this.rootStore.lastDir !== null && this.rootStore.lastDir !== curDir) {
      const turnRotate = this.getTurnRotateIndex(
        this.rootStore.lastDir,
        curDir,
      );
      if (turnRotate === undefined) return false;
      this.replaceNodeAtPosition(from, {
        type: "turn-img",
        rotate: turnRotate,
      });
    }

    // 判空
    for (let i = 1; i <= steps; i++) {
      const x = from.x + stepX * i;
      const y = from.y + stepY * i;
      if (!this.rootStore.isCellEmptyByPosition(x, y)) return false;
    }

    // 生成 belt
    for (let i = 1; i <= steps; i++) {
      const x = from.x + stepX * i;
      const y = from.y + stepY * i;
      this.generateOneBelt({ x, y }, "belt-img", curDir, id);
    }

    this.rootStore.lastDir = curDir;
    return true;
  }

  getStraightRotateIndex(dx, dy) {
    if (dx === 1 && dy === 0) return 0; // →
    if (dx === 0 && dy === 1) return 1; // ↓
    if (dx === -1 && dy === 0) return 2; // ←
    if (dx === 0 && dy === -1) return 3; // ↑
  }

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
  }

  generateBelt(newPosition, id = "belt") {
    // 第一次调用：只记录基准点
    if (!this.rootStore.lastBaseNode) {
      this.rootStore.lastBaseNode = { ...newPosition };
      this.rootStore.lastDir = null;
      return;
    }

    const startNode = { ...this.rootStore.lastBaseNode };

    // ===== 曼哈顿路径：先 X 后 Y =====

    // 第一段：X
    const midNode = { x: newPosition.x, y: startNode.y };

    if (
      (midNode.x !== startNode.x &&
        !this.generateStraightBelt(startNode, midNode)) ||
      (newPosition.y !== midNode.y &&
        !this.generateStraightBelt(midNode, newPosition))
    ) {
      return;
    }

    // 更新基准点
    this.rootStore.lastBaseNode = { ...newPosition };
  }

  generatePipe(newPosition, id = "pipe") {
    // 第一次调用：只记录基准点
    if (!this.rootStore.lastBaseNode) {
      this.rootStore.lastBaseNode = { ...newPosition };
      this.rootStore.lastDir = null;
      return;
    }

    const startNode = { ...this.rootStore.lastBaseNode };

    // ===== 曼哈顿路径：先 X 后 Y =====
    const midNode = { x: newPosition.x, y: startNode.y };

    if (
      (midNode.x !== startNode.x &&
        !this.generateStraightPipe(startNode, midNode)) ||
      (newPosition.y !== midNode.y &&
        !this.generateStraightPipe(midNode, newPosition))
    ) {
      return;
    }

    // 更新基准点
    this.rootStore.lastBaseNode = { ...newPosition };
  }

  handleClickSingleBoP(event) {
    //对于pipe模式下需要修改材质
    const position = this.rootStore.getPositionFromClick(event);
    //特殊
    if (
      this.rootStore.quickPlaceMode === "pipe" &&
      ["belt", "turn"].includes(this.rootStore.toolbarMode) &&
      this.rootStore.isCellEmptyPipe(event)
    ) {
      let name = `${this.rootStore.toolbarMode}-img-pipe`;
      this.generateOnePipe(position, name, 0, this.rootStore.toolbarMode);
      return;
    }
    //标准
    if (
      this.rootStore.quickPlaceMode === "pipe" &&
      !["belt", "turn"].includes(this.rootStore.toolbarMode) &&
      this.rootStore.isCellEmpty(event)
    ) {
      let name = `${this.rootStore.toolbarMode}-img-pipe`;
      this.generateOneBelt(position, name, 0, this.rootStore.toolbarMode);
      return;
    }
    if (
      this.rootStore.quickPlaceMode === "belt" &&
      this.rootStore.isCellEmpty(event)
    ) {
      let name = `${this.rootStore.toolbarMode}-img`;
      this.generateOneBelt(position, name, 0, this.rootStore.toolbarMode);
      return;
    }
  }

  makeMachine(config) {
    const { id, machine_id, recipe, rotate, x, y, w, h, part } = config;
    const vnode = createVNode(machineComponentMap[machine_id], {
      gs_id: id,
      el_name: machine_id,
      el_size: { w: w, h: h },
      rotate: rotate,
    });
    const container = document.createElement("div");
    render(vnode, container);
    const machineElement = this.rootStore.rootGrid.makeWidget(container, {
      x: x,
      y: y,
      w: w,
      h: h,
      noResize: true,
      id: id,
    });
    const machine_config = { id, recipe, rotate, part, machineElement };
    this.rootStore.addMachine(machine_config);
  }

  makeNewMachine(config) {
    const { machineId, recipe, rotate, x, y, w, h, part } = config;
    const id = `${machineId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const vnode = createVNode(machineComponentMap[machineId], {
      gs_id: id,
      el_name: machineId,
      el_size: { w: w, h: h },
      rotate: rotate,
    });
    const container = document.createElement("div");
    render(vnode, container);
    const machineElement = this.rootStore.rootGrid.makeWidget(container, {
      x: x,
      y: y,
      w: w,
      h: h,
      noResize: true,
      id: id,
    });
    const machine_config = { id, recipe, rotate, part, machineElement };
    this.rootStore.addMachine(machine_config);
  }

  handleBluePrintUpload = (file) => {
    if (file.status !== "ready") return;

    const rawFile = file.raw;
    if (!rawFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const blueprint = JSON.parse(reader.result);
      this.importBluePrint(blueprint);
    };

    reader.readAsText(rawFile);
  };

  async loadBlueprintByHashCode(hashCode) {
    if (!hashCode) return;

    try {
      // 构建蓝图URL
      const blueprintUrl = `${this.rootStore.host}/download/${hashCode}.json`;

      // 发送请求获取蓝图数据
      const response = await fetch(blueprintUrl);

      if (!response.ok) {
        throw new Error(`无法获取蓝图: ${response.status}`);
      }
      // 解析蓝图数据
      const blueprintData = await response.json();
      // 清空当前蓝图数据
      this.rootStore.clearBlueprint();
      // 导入蓝图
      this.importBluePrint(blueprintData);

      //console.log(`蓝图 ${hashCode} 加载成功！`);
      return blueprintData;
    } catch (error) {
      console.error("加载蓝图出错：", error);
      throw error;
    }
  }

  loadLocalBlueprint() {
    if (localStorage.blueprint) {
      // 清空当前蓝图数据
      this.rootStore.clearBlueprint();
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
  }

  handleClickBelts(event) {
    const position = this.rootStore.getPositionFromClick(event);
    if (this.rootStore.quickPlaceMode === "belt") {
      if (this.rootStore.isCellEmpty(event) || event.isBeltPort) {
        this.generateBelt(position, "belt");
      }
    }
    if (
      this.rootStore.quickPlaceMode === "pipe" &&
      this.rootStore.isCellEmptyPipe(event)
    ) {
      this.generatePipe(position, "pipe");
    }
  }

  batchCopyMachine(nodes, bias) {
    const { biasX, biasY } = bias;
    Object.entries(nodes)
      .reverse()
      .forEach(([nodeId, node]) => {
        const preNode = this.rootStore.gridWidgetElements[nodeId].gridstackNode;
        const old_config = this.rootStore.gridWidgets[nodeId];
        const newX = preNode.x + biasX;
        const newY = preNode.y + biasY;
        const machineId = preNode.id.match(/^[a-zA-Z]+/)[0];
        const config = {
          machineId,
          recipe: old_config.recipe,
          rotate: old_config.rotate,
          x: newX,
          y: newY,
          w: preNode.w,
          h: preNode.h,
          part: old_config.part,
        };
        this.makeNewMachine(config);
      });
    return true;
  }

  batchCopyBelt(nodes, bias) {
    const { biasX, biasY } = bias;
    Object.entries(nodes)
      .reverse()
      .forEach(([nodeId, node]) => {
        const preNode = this.rootStore.gridBelt2dElement[`${node.x}-${node.y}`].gridstackNode;
        const old_config = this.rootStore.gridBelts2d[preNode.x][preNode.y];
        const x = preNode.x + biasX;
        const y = preNode.y + biasY;
        this.generateOneBelt({x, y}, old_config.type, old_config.rotate, old_config.id);
      });
    return true;
  }

  batchCopyPipe(nodes, bias) {
    const { biasX, biasY } = bias;
    Object.entries(nodes)
      .reverse()
      .forEach(([nodeId, node]) => {
        const preNode = this.rootStore.gridPipe2dElement[`${node.x}-${node.y}`].gridstackNode;
        const old_config = this.rootStore.gridPipes2d[preNode.x][preNode.y];
        const x = preNode.x + biasX;
        const y = preNode.y + biasY;
        this.generateOnePipe({x, y}, old_config.type, old_config.rotate, old_config.id);
      });
    return true;
  }

  batchCopy(nodes, bias) {
    const { machineNodes, beltNodes, pipeNodes } = nodes;
    this.batchCopyMachine(machineNodes, bias);
    this.batchCopyBelt(beltNodes, bias);
    this.batchCopyPipe(pipeNodes, bias);
  }
}

export default new MachineMiddleware();
