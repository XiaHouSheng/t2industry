import { GridStack, GridStackEngine } from "gridstack";
import { defineStore } from "pinia";
import { markRaw } from "vue";

export const useRootStore = defineStore("sheng-root-store", {
  state: () => ({
    isBeltConnecting: false, //是否处于传送带连接状态
    gridWidgets: {}, //用于所有模拟控件的存储
    rootGrid: null, //存储根gridstack对象
    rootGridEngine: null, //gridstack引擎
    gridEl: null, //存储根元素对象
    defaultWidth: null,
    defaultHeight: null,
    numColumn: 72, //列个数
    gridOptions: {
      cellHeight: null, //单元格的高度 = 父控件宽度 / 列个数 | 保持正方体
      minRow: 72, //行个数
      allowNewRow: true, //可向下扩充行
      float: true, //可以随意摆放
      //可以拖入
      acceptWidgets: function (el) {
        return true;
      },
    },
    connectNodes: [], //存储节点，限制为一次连接，完成或者取消时清空
  }),

  actions: {
    initGrid(target_el) {
      this.gridEl = markRaw(target_el);
      this.defaultHeight = target_el.clientHeight;
      this.defaultWidth = target_el.clientWidth;
      this.rootGrid = markRaw(GridStack.init(this.gridOptions, target_el));
      this.rootGrid.column(this.numColumn);
      this.gridOptions.cellHeight = this.rootGrid.cellWidth();
    },

    //缩放
    handleScalingChange(event) {
      event.preventDefault();
      event.stopPropagation();
      let deltaPlus = event.deltaY * 5;
      let contWidth = this.gridEl.clientWidth + deltaPlus;
      this.gridEl.style.width = `${Math.max(this.defaultWidth,contWidth)}px`;
      this.gridOptions.cellHeight = this.rootGrid.cellWidth();
      this.rootGrid.cellHeight(this.gridOptions.cellHeight);
    },

    //此方法目前没有算scroll量后续还需要修改
    getPositionFromClick(event) {
      let clientX = event.clientX;
      clientX -= 26; //offset
      let clientY = event.clientY;
      clientY -= 80; //offset
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
      this.rootGrid.enableMove(true);
      //连接关系清空
    },
    //开始连接
    //记录第一个节点位置，作为下一个节点的铺垫
    startBeltConnect(event, which, gs_id) {
      console.log("start connnect!");
      this.isBeltConnecting = true;
      this.rootGrid.enableMove(false);
      this.pushNewNode(event, which, gs_id);
      console.log(this.connectNodes);
    },
    //完成连接
    //根据inner与outter和specific节点来进行判断
    compeleteBeltConnect() {
      this.isBeltConnecting = false;
      this.rootGrid.enableMove(true);
    },

    //连接过程
    handleBeltNode(event) {
      //传送带连接
      if (this.isBeltConnecting) {
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
      return;
    },

    generateBelt(oldNode, newPosition, id) {
      if (oldNode.x == newPosition.x) {
        //console.log(oldNode,newPosition)
        let startY = Math.min(oldNode.y + 1, newPosition.y);
        let preDelta = Math.abs(oldNode.y - newPosition.y);
        let index = 0;
        while (index < preDelta) {
          console.log(oldNode.x, index + startY);
          if (!this.isCellEmptyByPosition(oldNode.x, index + startY)) {
            console.log("not all empty", oldNode.x, index + startY);
            return;
          }
          index += 1;
        }
        //可以优化暂定
        index = 0;
        while (index < preDelta) {
          this.rootGrid.addWidget({
            x: oldNode.x,
            y: index + startY,
            w: 1,
            h: 1,
            noResize: true,
            //通过id对关联关系进行分配
            id: id,
          });
          index += 1;
        }
        if (startY == newPosition.y) {
          return id;
        }
        return id + `-${index - 1}`;
      }
      if (oldNode.y == newPosition.y) {
        if (oldNode.type != "conveyer") {
          console.log("not conveyer");
          return;
        }

        //console.log(oldNode,newPosition)
        let startX = Math.min(oldNode.x + 1, newPosition.x);
        let preDelta = Math.abs(oldNode.x - newPosition.x);
        let index = 0;
        while (index < preDelta) {
          //console.log(oldNode.x, index + startX);
          if (!this.isCellEmptyByPosition(index + startX, oldNode.y)) {
            console.log("not all empty");
            return;
          }
          index += 1;
        }
        //可以优化暂定
        index = 0;
        while (index < preDelta) {
          this.rootGrid.addWidget({
            x: index + startX,
            y: oldNode.y,
            w: 1,
            h: 1,
            noResize: true,
            id: id,
          });
          index += 1;
        }
        if (startX == newPosition.x) {
          return id;
        }
        return id + `-${index - 1}`;
      }
      //暂定非直线不行
      return;
    },
  },
});
