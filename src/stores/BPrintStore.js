import { defineStore } from "pinia";
import { markRaw } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";

export const useBPrintStore = defineStore("sheng-bprint-store", {
  state: () => ({
    isBluePrintImport: false,
    editPartChoose: "part0", //当前编辑的模块
    gridWidgetElements: markRaw({}), //用于非传送带模拟控件的存储|id->{element:el}
    gridWidgets: {}, //用于非传送带模拟控件配置存储|id->{rotate:rotate,recipe:recipe,part:partName}
    gridBelt2dElement: markRaw({}),
    gridBelts2d: null, //存储传送带的元素|x,y->{rotate:rotate,type:type}
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

    //蓝图导入对话框点击
    handleBluePrintImportDialog() {
      this.isBluePrintImport = true;
    },

    //蓝图导入回调
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

    //保存蓝图
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
      console.log(part_dict);

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

    //导入蓝图
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
            this.partsWidgetId[partName] = new Set(part.partsWidgetId[partName]);
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

        //console.log("JSON 文件导出成功！");
      } catch (error) {
        console.error("导出 JSON 出错：", error);
      }
    },

    // 根据hashCode从URL加载蓝图
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

    // 清空蓝图数据
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
    },

    // 加载本地蓝图（从localStorage）
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
