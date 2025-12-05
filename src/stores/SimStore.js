import { GridStack } from "gridstack";
import { defineStore } from "pinia";
import { markRaw } from "vue";

export const useRootStore = defineStore("sheng-root-store", {
  state: () => ({
    isStartSelect: false, //是否处于选择状态
    isBeltConnecting: false, //是否处于传送带连接状态
    isDeletingMode: true, //是否处于批量删除模式
    gridWidgets: {}, //用于所有模拟控件的存储|id->element
    gridWidgets2d: null, //用于模拟控件的存储（适用于1x1的传送带等)|x,y->element
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
    connectNodes: [], //存储节点
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
        this.deleteOneBelt(position)
      }
    },

    //删除单个传送带
    deleteOneBelt(position) {
      const targetElement = this.gridWidgets2d[position.x][position.y];
      if (targetElement) {
        this.rootGrid.removeWidget(targetElement);
        delete this.gridWidgets2d[position.x][position.y];
      }
    },

    //缩放
    handleScalingChange(event) {
      event.preventDefault();
      event.stopPropagation();
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

    //选择是否为传送带放置模式
    handleBeltModeChange() {
      if (this.isBeltConnecting) {
        this.isBeltConnecting = false;
        console.log("belt mode off");
        return;
      }
      this.isBeltConnecting = true;
      console.log("belt mode on");
    },

    //已经计算scroll
    getPositionFromClick(event) {
      let clientX = event.clientX + this.gridElCont.scrollLeft - 26; //offset
      let clientY = event.clientY + this.gridElCont.scrollTop - 80; //offset
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
      if (this.isBeltConnecting) {
        //判空
        if (this.isCellEmpty(event)) {
          const position = this.getPositionFromClick(event);
          const oldNode = this.connectNodes.at(-1);
          //判断是否有旧的节点
          if (!oldNode) {
            this.generateOneBelt(position);
            this.pushNewNodeFromPosition(position, "conveyer", "conveyerBelt");
            console.log(this.connectNodes);
            return;
          }
          this.generateBelt(oldNode, position, "conveyerBelt");
        }
      }
    },
    //生成一个传送带
    generateOneBelt(position) {
      const craftElement = this.rootGrid.addWidget({
        x: position.x,
        y: position.y,
        w: 1,
        h: 1,
        noResize: true,
        id: "conveyerBelt",
      });
      this.gridWidgets2d[position.x][position.y] = craftElement;
    },

    //生成一些列传送带
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
          this.generateOneBelt({
            x: oldNode.x,
            y: index + startY,
          });
          index += 1;
        }
        if (startY == newPosition.y) {
          //return id;
        }
        //return id + `-${index - 1}`;
        this.pushNewNodeFromPosition(newPosition, "convyerBelt", "convyerBelt");
        return;
      }
      if (oldNode.y == newPosition.y) {
        /*
        这个判断是当时没考虑机器可以旋转，出入口强制垂直进出而不能水平
        if (oldNode.type != "conveyer") {
          console.log("not conveyer");
          return;
        }
        */
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
          this.generateOneBelt({
            x: index + startX,
            y: oldNode.y,
          });
          index += 1;
        }
        if (startX == newPosition.x) {
          //return id;
        }
        //return id + `-${index - 1}`;
        this.pushNewNodeFromPosition(newPosition, "convyerBelt", "convyerBelt");
        return;
      }
      //暂定非直线不行
      console.log("not a line");
    },
  },
});
