import { GridStack } from "gridstack";
import { defineStore } from "pinia";
import { createVNode, markRaw, render } from "vue";
import ConveyerBelt from "../components/simulation/ConveyerBelt.vue";

export const useRootStore = defineStore("sheng-root-store", {
  state: () => ({
    toolbarMode: "default",
    toolbarModeHistory: "default",
    beltSelect: "turn",

    gridWidgets: {}, //用于非传送带模拟控件的存储|id->element
    gridWidgets2d: null, //用于模拟控件的存储（适用于1x1的传送带等)|x,y->element
    
    gridWidgetsRotate: {}, //用于非传送带模拟控件的旋转属性存储|id->rotate
    
    gridBeltsRotate: {}, //存储传送带的旋转属性|id->rotate
    

    rootGrid: null, //存储根gridstack对象
    rootGridEngine: null, //gridstack引擎
    gridEl: null, //存储根元素对象
    gridElCont: null, //存储gridstack的父容器
    defaultWidth: 1578,
    defaultHeight: 1578,
    defaultMaxWidth: 3017,
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
    initGrid(target_el, target_cont) {
      this.initGridWidget2d();
      this.gridEl = markRaw(target_el);
      this.gridElCont = markRaw(target_cont);
      this.rootGrid = markRaw(GridStack.init(this.gridOptions, target_el));
      this.rootGrid.column(this.numColumn);
      this.gridEl.style.width = `${this.defaultWidth}px`;
      this.gridEl.style.height = `${this.defaultHeight}px`;
    },

    initGridWidget2d() {
      this.gridWidgets2d = Array.from({ length: this.gridOptions.minRow }, () =>
        Array.from({ length: this.numColumn }, () => null)
      );
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

    //删除单个传送带
    deleteOneBelt(position) {
      const targetElement = this.gridWidgets2d[position.x][position.y];
      if (targetElement) {
        //待定
        this.rootGrid.removeWidget(targetElement);
        this.gridWidgets2d[position.x][position.y] = null;
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

    //缩放
    handleScalingChange(event) {
      event.preventDefault();
      event.stopPropagation();
      //select模式时禁用滑动
      if (this.toolbarMode == "select") {
        return;
      }
      let deltaPlus = event.deltaY * 5;
      let contWidth = this.gridEl.clientWidth + deltaPlus;
      if (deltaPlus < 0) {
        this.gridEl.style.width = `${Math.max(this.defaultWidth, contWidth)}px`;
      } else {
        this.gridEl.style.width = `${Math.min(
          this.defaultMaxWidth,
          contWidth
        )}px`;
      }
    },

    //模式改变回调
    handleBeltModeChange(value) {
      console.log("mode change", this.toolbarMode, this.toolbarModeHistory);
      //select模式下禁用cont的scroll
      if (value == "select") {
        this.gridElCont.style.overflow = "hidden";
      } else {
        this.gridElCont.style.overflow = "scroll";
      }
      if (this.toolbarModeHistory == "belt") {
        this.lastBaseNode = null;
        this.lastDir = null;
      }
      this.toolbarModeHistory = value;
    },

    //已经计算scroll
    getPositionFromClick(event) {
      let clientX = event.clientX + this.gridElCont.scrollLeft - 26; //offset
      let clientY = event.clientY + this.gridElCont.scrollTop - 76; //offset
      return this.rootGrid.getCellFromPixel({
        left: clientX,
        top: clientY,
      });
    },

    isCellEmpty(event) {
      const { x, y } = this.getPositionFromClick(event);
      return this.rootGrid.isAreaEmpty(x, y, 1, 1);
    },

    isCellEmptyByPosition(x, y) {
      return this.rootGrid.isAreaEmpty(x, y, 1, 1);
    },

    pushNewNodeFromPosition(position, which, gs_id) {
      const node = {
        x: position["x"],
        y: position["y"],
        gs_id: gs_id,
        type: which,
      };
      //specific类个人暂定为分配器等，其坐标就是节点坐标
      //打包节点
      this.connectNodes.push(node);
    },

    pushNewNode(event, which, gs_id) {
      const position = this.getPositionFromClick(event);
      const node = {
        x: position["x"],
        y: position["y"],
        gs_id: gs_id,
        type: which,
      };
      //specific类个人暂定为分配器等，其坐标就是节点坐标
      //打包节点
      this.connectNodes.push(node);
    },

    //取消连接
    cancelBeltConnect() {
      this.isBeltConnecting = false;
      //连接关系清空
    },
    //开始连接 停用
    //记录第一个节点位置，作为下一个节点的铺垫
    startBeltConnect(event, which, gs_id) {
      console.log("start connnect!");
      this.isBeltConnecting = true;
      this.rootGrid.enableMove(false);
      this.pushNewNode(event, which, gs_id);
      console.log(this.connectNodes);
    },
    //完成连接 停用
    //根据inner与outter和specific节点来进行判断
    compeleteBeltConnect() {
      this.isBeltConnecting = false;
      this.rootGrid.enableMove(true);
    },

    //连接过程
    //传送带连接-暂时停用节点关联模式，后续再更新
    handleBeltNode(event) {
      //传送带连接-暂时停用节点关联模式，后续再更新
      if (false) {
        console.log("belt node gene!");
        //当前单元格为空就生成新的节点，途中的传送带一起生成
        //根据上一个节点进行连接
        //暂时限制不能拐弯
        if (this.isCellEmpty(event)) {
          const newPosition = this.getPositionFromClick(event); //可以优化复用 暂定
          const oldNode = this.connectNodes.at(-1); //上一个节点
          /*
          oldnode的gsid是自动生成的
          开始的oldnode gsid = oldnode
          最后的newnode gsid = newnode
          中间的conveyer gsid = oldnode-newnode-i i -> 1,2,3,4...
          */
          const preId =
            "belt" + `-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const newNodeId = this.generateBelt(oldNode, newPosition, preId);
          if (newNodeId) {
            this.pushNewNode(event, "conveyer", newNodeId);
          }
        }
      }
      if (this.toolbarMode == "belt") {
        if (this.isCellEmpty(event)) {
          const position = this.getPositionFromClick(event);
          this.generateBelt(position, "belt");
        }
      }

      if (this.toolbarMode == "belt_one") {
        if (this.isCellEmpty(event)) {
          const position = this.getPositionFromClick(event);
          this.generateOneBelt(position, `${this.beltSelect}-img`,0,this.beltSelect)
        }
      }
    },

    //生成一个传送带
    generateOneBelt(position, type = "belt-img", rotate = 0, id_in = "belt") {
      let craftElement = document.createElement("div");
      let id = `${id_in}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      let vnode = createVNode(ConveyerBelt, {
        gs_id: id,
        rotate: rotate,
        type: type,
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
      this.gridWidgets2d[position.x][position.y] = craftElement;

    },

    replaceNodeAtPosition(position, { type, rotate }, id = "belt") {
      const el = this.gridWidgets2d[position.x]?.[position.y];
      if (!el) return;
      this.rootGrid.removeWidget(el, true);
      this.gridWidgets2d[position.x][position.y] = null;
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
  },
});
