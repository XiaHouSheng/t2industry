// 键盘事件处理器
import { useRootStore } from "../stores/SimStore";

class KeyboardHandler {
  constructor() {
    this.rootStore = null;
    this.isListening = false;
    this.gridElCont = null;
    this.gridElContScale = 1;
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  // 初始化键盘事件监听
  init(gridElCont) {
    if (this.isListening) return;
    this.gridElCont = gridElCont;
    this.rootStore = useRootStore();
    window.addEventListener("keydown", this.handleKeydown);
    this.isListening = true;
  }

  // 更新缩放比例
  updateScale(scale) {
    this.gridElContScale = scale;
  }

  // 键盘按下事件处理
  handleKeydown(event) {
    const key = event.key.toLowerCase();

    // WASD 保留（输入层行为）
    if (["w", "a", "s", "d"].includes(key)) {
      event.preventDefault();
      const step = 50 * this.gridElContScale;
      if (key === "w") this.gridElCont.scrollTop -= step;
      if (key === "s") this.gridElCont.scrollTop += step;
      if (key === "a") this.gridElCont.scrollLeft -= step;
      if (key === "d") this.gridElCont.scrollLeft += step;
      return;
    }

    // 只做一件事：写命令
    switch (key) {
      case "q":
        event.preventDefault();
        this.rootStore.keyboardCommand = "pipes-pipe";
        break;
      case "e":
        event.preventDefault();
        this.rootStore.keyboardCommand = "belts-belt";
        break;
      case "x":
        event.preventDefault();
        this.rootStore.keyboardCommand = "enter-select";
        break;
      case "f":
        event.preventDefault();
        this.rootStore.keyboardCommand = "select-fold";
        break;
      case "m":
        event.preventDefault();
        this.rootStore.keyboardCommand = "select-move";
        break;
      case "escape":
        event.preventDefault();
        this.rootStore.keyboardCommand = "escape";
        break;
    }
  }

  // 销毁键盘事件监听
  destroy() {
    if (!this.isListening) return;

    window.removeEventListener("keydown", this.handleKeydown);
    this.isListening = false;
    this.gridElCont = null;
    // 重置状态变量
    if (this.rootStore) {
      this.rootStore.isXPressed = false;
      this.rootStore.activeKey = null;
    }
  }

  // 暂时禁用键盘事件监听
  disable() {
    if (!this.isListening) return;

    window.removeEventListener("keydown", this.handleKeydown);
    this.isListening = false;
  }

  // 重新启用键盘事件监听
  enable() {
    if (this.isListening || !this.gridElCont) return;

    window.addEventListener("keydown", this.handleKeydown);
    this.isListening = true;
  }
}

// 导出单例实例
export default new KeyboardHandler();
