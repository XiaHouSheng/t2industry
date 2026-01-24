import { GridStack } from "gridstack";
import { defineStore } from "pinia";
import { createVNode, markRaw, render } from "vue";
import { machineComponentMap } from "../utils/MachineMap";
import ConveyerBelt from "../components/simulation/ConveyerBelt.vue";
import { ElNotification, ElMessageBox } from "element-plus";

export const usePartStore = defineStore("sheng-part-store", {
  state: () => ({
    editPartChoose: "part0", //当前编辑的模块
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
  }),

  actions: {
    

    //创建机器|对原makeGrid的封装
    makeMachine(config) {
      const { id, machine_id, recipe, rotate, x, y, w, h, part } = config;
      //step1 gridWidgets创建对应id的dict 并导入 rotate和recipe数据
      this.gridWidgets[id] = { rotate: rotate, recipe: recipe };
      //step2 创建元素并指向id对应的element项
      const vnode = createVNode(machineComponentMap[machine_id], {
        gs_id: id,
        el_name: machine_id,
        el_size: { w: w, h: h },
        rotate: rotate,
      });

      //测试：将新创建的widget添加到当前编辑的模块中
      //this.partsWidgetId[this.editPartChoose].push(id);

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

    //添加新模块
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

    //选择编辑的模块
    selectEditPart(partName) {
      this.editPartChoose = partName;
    },

    //处理模块显示状态变化
    handlePartShowChange(part, value) {
      this.showPartWidgets(part, value);
    },

    //显示模块对应的widget
    showPartWidgets(part, value) {
      for (let widgetId of this.partsWidgetId[part.name]) {
        this.gridWidgetElements[widgetId].style.opacity = value ? 1 : 0.2;
      }
      // 显示模块对应的传送带
      for (let beltId of this.partsBelts[part.name]) {
        this.gridBelt2dElement[beltId].style.opacity = value ? 1 : 0.2;
      }
    },

    //删除模块
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

    //复制和编辑模块代码
    copyEditCode(part) {
      // 显示输入对话框
      ElMessageBox.prompt("编辑模块代码", "代码编辑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: part.code || "",
        inputPlaceholder: "请输入模块代码",
      })
        .then(({ value }) => {
          // 更新模块代码
          part.code = value;
        })
        .catch(() => {
          // 取消编辑
        });
    },

  },
});
