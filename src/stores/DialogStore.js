import { defineStore } from "pinia";


export const useDialogStore = defineStore("sheng-dialog-store", {
  state: () => ({
    appContext: null,
    isBluePrintImport: false,
    isRecipeChoose: false,
    isWareHouseRecipeChoose: false,
  }),

  actions: {
    //配方配置对话框关闭回调
    handleDialogRecipeClose() {
      this.rootGrid.enableMove(true);
    },

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
  },
});
