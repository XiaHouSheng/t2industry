import { watch } from "vue";
import { useRootStore } from "../stores/SimStore";
import { useSelectStore } from "../stores/SelectStore";
import toast from "../components/ui/wrapper-v1/toast/toast.js";
import BeltIndicator from "./BeltIndicator";
import SelectIndicator from "./SelectIndicator";
import MachineMiddleware from "./MachineMiddleware.js";

class CommandEvent {
  constructor() {
    this.rootStore = null;
    this.selectStore = null;
    this.singleBeltModes = ["belts", "select", "default"];
    //绑定
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  init() {
    this.rootStore = useRootStore();
    this.selectStore = useSelectStore();
    //监听toolbarMode变化
    this.initDogToolbar();
    //监听keybboard的变化
    this.initDogKeyboard();
    //监听select子命令
    this.initDogSelectSub();
    //监听快速放置模式
    this.initDogQuickPlace();
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
        this.selectStore.disableSelect();
        SelectIndicator.reset()
        SelectIndicator.deactivateMouseMoveListener();
        break;

      case "belts":
        this.rootStore.lastBaseNode = null;
        this.rootStore.lastDir = null;
        BeltIndicator.handleEndBelt("belt");
        BeltIndicator.handleEndBelt("pipe");
        break;
    }
  }

  enterMode(mode) {
    switch (mode) {
      case "select":
        this.rootStore.rootGrid.setStatic(true);
        this.rootStore.gridElCont.style.overflow = "hidden";
        this.selectStore.enableSelect();
        break;

      case "belts":
        BeltIndicator.handleStartBelt(this.rootStore.quickPlaceMode);
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
      MachineMiddleware.handleClickBelts(event);
      console.log("belts");
    }
    //放置单个的传送带元素
    if (this.isSingleBeltMode(nowMode)) {
      MachineMiddleware.handleClickSingleBoP(event);
    }
    //批量移动选中机器
    if (this.rootStore.selectSubMode === "move") {
      const { biasX, biasY } = SelectIndicator.bias;
      const { minX, maxX, minY, maxY } = SelectIndicator.selectRange;
      // 边界检查：确保移动后不超出网格边界
      const isWithinBounds =
        minX + biasX >= 0 &&
        maxX + biasX <= 72 &&
        minY + biasY >= 0 &&
        maxY + biasY <= 72;
      if (!isWithinBounds) {
        toast.error("移动超出边界，无法移动");
        return;
      }

      const moveSuccess = this.rootStore.batchMove(
        {
          machineNodes: SelectIndicator.selectedConfigs,
          beltNodes: SelectIndicator.selectedBeltConfigs,
          pipeNodes: SelectIndicator.selectedPipeConfigs,
        },
        SelectIndicator.bias,
      );

      if (!moveSuccess) return;

      //退出选择模式
      this.rootStore.toolbarMode = "default";
    }
    //复制选中的机器
    if (this.rootStore.selectSubMode === "copy") {
      const { biasX, biasY } = SelectIndicator.bias;
      const { minX, maxX, minY, maxY } = SelectIndicator.selectRange;
      // 边界检查：确保移动后不超出网格边界
      const isWithinBounds =
        minX + biasX >= 0 &&
        maxX + biasX <= 72 &&
        minY + biasY >= 0 &&
        maxY + biasY <= 72;
      if (!isWithinBounds) {
        toast.error("移动超出边界，无法移动");
        return;
      }
      //复制选中的机器
      const copySuccess = MachineMiddleware.batchCopy(
        {
          machineNodes: SelectIndicator.selectedConfigs,
          beltNodes: SelectIndicator.selectedBeltConfigs,
          pipeNodes: SelectIndicator.selectedPipeConfigs,
        },
        SelectIndicator.bias,
      );
      if (!copySuccess) return;
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

  //quickPlaceMode管理
  initDogQuickPlace() {
    watch(
      () => this.rootStore.quickPlaceMode,
      (next, prev) => {
        this.exitModeQuickPlace(prev);
        this.enterModeQuickPlace(next);
      },
    );
  }

  exitModeQuickPlace(quickPlaceMode) {
    this.rootStore.lastBaseNode = null;
    this.rootStore.lastDir = null;
    switch (quickPlaceMode) {
      case "belt":
        BeltIndicator.handleEndBelt("belt");
        break;
      case "pipe":
        BeltIndicator.handleEndBelt("pipe");
        break;
    }
  }

  enterModeQuickPlace(quickPlaceMode) {
    switch (quickPlaceMode) {
      case "belt":
        BeltIndicator.handleStartBelt("belt");
        break;
      case "pipe":
        BeltIndicator.handleStartBelt("pipe");
        break;
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
        this.selectStore.enableSelect();
        break;
      case "copy":
        SelectIndicator.reset();
        SelectIndicator.deactivateMouseMoveListener();
        this.selectStore.enableSelect();
        break;
    }
  }

  enterModeSelectSub(submode) {
    switch (submode) {
      case "move":
        SelectIndicator.activateMouseMoveListener();
        this.selectStore.disableSelect();
        break;
      case "copy":
        SelectIndicator.activateMouseMoveListener();
        this.selectStore.disableSelect();
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
          case "pipes-pipe":
            //BeltIndicator.handleEndBelt();
            this.rootStore.toolbarMode = "belts";
            this.rootStore.quickPlaceMode = "pipe";
            break;

          case "belts-belt":
            //BeltIndicator.handleEndBelt();
            this.rootStore.toolbarMode = "belts";
            this.rootStore.quickPlaceMode = "belt";
            break;

          case "enter-select":
            this.rootStore.toolbarMode = "select";
            this.rootStore.quickPlaceMode = "belt";
            this.rootStore.selectSubMode = null;
            break;

          case "select-fold":
            if (this.rootStore.toolbarMode !== "select") return;
            if (this.rootStore.selectSubMode) return;
            //这里不需要删除的子模式，因为fold模式是用于删除的瞬间模式
            const config = {
              machineObjs: SelectIndicator.selectedConfigs,
              beltObjs: SelectIndicator.selectedBeltConfigs,
              pipeObjs: SelectIndicator.selectedPipeConfigs,
            }
            this.rootStore.deleteTarget(config);
            break;

          case "select-move":
            if (this.rootStore.toolbarMode !== "select") return;
            this.rootStore.selectSubMode = "move";
            break;

          case "select-copy":
            //非瞬时任务
            if (this.rootStore.toolbarMode !== "select") return;
            this.rootStore.selectSubMode = "copy";
            break

          case "select-rotate":
            //瞬间任务，改rotate值
            break

          case "escape":
            //框选模式下
            if (this.rootStore.selectSubMode) {
              this.rootStore.selectSubMode = null;
            } else if (this.rootStore.toolbarMode === "select") {
              this.rootStore.toolbarMode = "default";
            }
            //快速放置传送带模式下
            if (this.rootStore.toolbarMode === "belts") {
              this.rootStore.toolbarMode = "default";
            }
            break;
        }

        //  关键：命令消费完立刻清空
        this.rootStore.keyboardCommand = null;
      },
    );
  }
}

export default new CommandEvent();
