import { watch } from "vue";
import { useRootStore } from "../stores/SimStore";
import BeltIndicator from "./BeltIndicator";
import SelectIndicator from "./SelectIndicator";
class CommandEvent {
  constructor() {
    this.rootStore = null;
    this.singleBeltModes = ["belts", "select", "default"];
    //绑定
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  init() {
    this.rootStore = useRootStore();
    //监听toolbarMode变化
    this.initDogToolbar();
    //监听keybboard的变化
    this.initDogKeyboard();
    //监听select子命令
    this.initDogSelectSub();
  }

  initDogToolbar() {
    watch(
      () => this.rootStore.toolbarMode,
      (next, prev) => {
        this.exitMode(prev);
        this.enterMode(next);
      },
    );
  }

  exitMode(mode) {
    switch (mode) {
      case "select":
        this.rootStore.rootGrid.setStatic(false);
        this.rootStore.gridElCont.style.overflow = "scroll";
        this.rootStore.selectSubMode = null;
        SelectIndicator.reset();
        break;

      case "belts":
        this.rootStore.lastBaseNode = null;
        this.rootStore.lastDir = null;
        BeltIndicator.handleEndBelt();
        break;
    }
  }

  enterMode(mode) {
    switch (mode) {
      case "select":
        this.rootStore.rootGrid.setStatic(true);
        this.rootStore.gridElCont.style.overflow = "hidden";
        break;

      case "belts":
        BeltIndicator.handleStartBelt();
        break;
    }
  }

  isSingleBeltMode(mode) {
    return !this.singleBeltModes.includes(mode);
  }

  //蓝图-全局左键管理
  handleLeftClick(event) {
    const nowMode = this.rootStore.toolbarMode;
    //快速放置传送带
    if (nowMode == "belts") {
      this.rootStore.handleClickBelts(event);
      console.log("belts");
    }
    //放置单个的传送带元素
    if (this.isSingleBeltMode(nowMode)) {
      this.rootStore.handleClickSingleBoP(event);
    }
    //批量移动选中机器
    if (this.rootStore.selectSubMode === "move") {
      const canMove = this.rootStore.batchMoveMachines(
        SelectIndicator.selectedConfigs,
        SelectIndicator.bias,
      );
      if (!canMove) return;
      //退出选择模式
      this.rootStore.toolbarMode = "default";
    }
  }

  //蓝图-全局右键管理
  handleRightClick(event) {
    event.preventDefault();
    event.stopPropagation();
    //处于连接状态取消连接模式
    const nowQuickPlaceMode = this.rootStore.quickPlaceMode;
    const position = this.rootStore.getPositionFromClick(event);
    if (nowQuickPlaceMode === "belt") {
      this.rootStore.deleteOneBelt(position);
    }
    if (nowQuickPlaceMode === "pipe") {
      this.rootStore.deleteOnePipe(position);
    }
  }
  //select子命令管理
  initDogSelectSub() {
    watch(
      () => this.rootStore.selectSubMode,
      (next, prev) => {
        this.exitModeSelectSub(prev);
        this.enterModeSelectSub(next);
      },
    );
  }

  exitModeSelectSub(submode) {
    switch (submode) {
      case "move":
        SelectIndicator.reset();
        SelectIndicator.deactivateMouseMoveListener();
        break;
    }
  }

  enterModeSelectSub(submode) {
    switch (submode) {
      case "move":
        SelectIndicator.activateMouseMoveListener();
        break;
    }
  }

  //键入管理
  initDogKeyboard() {
    watch(
      () => this.rootStore.keyboardCommand,
      (cmd) => {
        if (!cmd) return;

        switch (cmd) {
          case "enter-select":
            this.rootStore.toolbarMode = "select";
            this.rootStore.selectSubMode = null;
            break;

          case "select-fold":
            if (this.rootStore.toolbarMode !== "select") return;
            //这里不需要删除的子模式，因为fold模式是用于删除的瞬间模式
            break;

          case "select-move":
            if (this.rootStore.toolbarMode !== "select") return;
            this.rootStore.selectSubMode = "move";
            break;

          case "escape":
            if (this.rootStore.selectSubMode) {
              this.rootStore.selectSubMode = null;
            } else if (this.rootStore.toolbarMode === "select") {
              this.rootStore.toolbarMode = "default";
            }
            break;
        }

        // 🔥 关键：命令消费完立刻清空
        this.rootStore.keyboardCommand = null;
      },
    );
  }
}

export default new CommandEvent();
