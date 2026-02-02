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
        SelectIndicator.clearIndicator();
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
    if (nowMode == "belts") {
      this.rootStore.handleClickBelts(event);
      console.log("belts");
    }

    console.log(nowMode)
    if (this.isSingleBeltMode(nowMode)) {
      this.rootStore.handleClickSingleBoP(event);
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
}

export default new CommandEvent();
