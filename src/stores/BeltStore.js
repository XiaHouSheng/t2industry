import { defineStore } from "pinia";
import { createVNode, markRaw, render } from "vue";
import ConveyerBelt from "../components/simulation/ConveyerBelt.vue";
import { useRootStore } from "./SimStore";

export const useBeltStore = defineStore("sheng-belt-store", {
  state: () => ({
    rootStore: useRootStore(),
    quickPlaceMode: "belt",
    beltSelect: "turn",
    gridBelt2dElement: markRaw({}),
    gridBelts2d: null, //存储传送带的元素|x,y->{rotate:rotate,type:type}
    lastBaseNode: null, // 上一次的基准点 { x, y }
    lastDir: null, // 上一次方向（0-3）
  }),

  /*
  1.对于没有的变量，进行rootStore指向
  2.替换应用中的函数
  
  */

  actions: {
    initBelts2d() {
      this.gridBelts2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => ({})),
      );
    },

    //删除单个传送带
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

    //生成一个传送带|对原makeGrid的封装
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
            this.toolbarMode,
          );
        }
      }
    },

    //右键事件
    handleRightClick(event) {
      event.preventDefault();
      event.stopPropagation();
      const position = this.getPositionFromClick(event);
      this.deleteOneBelt(position);
    },
  },
});
