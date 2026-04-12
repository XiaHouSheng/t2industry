// 键盘事件处理器
import { useRootStore } from "../stores/SimStore";

class KeyBoardHandler {
  constructor() {
    this.rootStore = null;
    this.isListening = false;
    this.gridElCont = null;
    this.gridElContScale = 1;

    // 支持“模式化”扩展（例如裁剪模式）
    this.mode = "default";
    this.modeHandlers = new Map();

    this.commandMap = {
      q: "pipes-pipe",
      e: "belts-belt",
      x: "enter-select",
      f: "select-fold",
      m: "select-move",
      escape: "escape",
    };

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  // 初始化键盘事件监听
  init(gridElCont) {
    this.gridElCont = gridElCont ?? this.gridElCont;
    this.rootStore = this.rootStore ?? useRootStore();

    if (this.isListening) return;

    window.addEventListener("keydown", this.handleKeydown);
    this.isListening = true;
  }

  // 更新缩放比例
  updateScale(scale) {
    this.gridElContScale = Number.isFinite(scale) ? scale : 1;
  }

  // 注册模式处理器：handler 返回 true 表示已消费事件
  registerMode(modeName, handler) {
    if (!modeName || typeof handler !== "function") return;
    this.modeHandlers.set(modeName, handler);
  }

  // 切换模式
  setMode(modeName = "default") {
    this.mode = modeName;
  }

  // 注销模式
  unregisterMode(modeName) {
    if (!modeName) return;
    this.modeHandlers.delete(modeName);
    if (this.mode === modeName) this.mode = "default";
  }

  // 是否应忽略输入类元素中的按键
  shouldIgnoreEvent(event) {
    const target = event.target;
    if (!target) return false;

    const tagName = target.tagName?.toLowerCase();
    const isTypingElement =
      tagName === "input" ||
      tagName === "textarea" ||
      target.isContentEditable;

    return isTypingElement;
  }

  writeCommand(command) {
    if (!this.rootStore || !command) return;
    this.rootStore.keyboardCommand = command;
  }

  handleWASD(event, key) {
    if (!["w", "a", "s", "d"].includes(key)) return false;
    if (!this.gridElCont) return false;

    event.preventDefault();
    const step = 50 * this.gridElContScale;

    if (key === "w") this.gridElCont.scrollTop -= step;
    if (key === "s") this.gridElCont.scrollTop += step;
    if (key === "a") this.gridElCont.scrollLeft -= step;
    if (key === "d") this.gridElCont.scrollLeft += step;

    return true;
  }

  // 键盘按下事件处理
  handleKeydown(event) {
    if (!this.rootStore) this.rootStore = useRootStore();

    // 输入框中默认不劫持按键
    if (this.shouldIgnoreEvent(event)) return;

    const key = event.key.toLowerCase();

    // 1) 优先执行当前模式处理器（例如裁剪模式）
    const modeHandler = this.modeHandlers.get(this.mode);
    if (typeof modeHandler === "function") {
      const handled = modeHandler(event, {
        key,
        rootStore: this.rootStore,
        gridElCont: this.gridElCont,
        scale: this.gridElContScale,
      });
      if (handled) return;
    }

    // 2) 默认行为：WASD 视图滚动
    if (this.handleWASD(event, key)) return;

    // 3) Ctrl + C 复制
    if (key === "c" && event.ctrlKey) {
      event.preventDefault();
      this.writeCommand("select-copy");
      return;
    }

    // 4) 命令映射
    const command = this.commandMap[key];
    if (command) {
      event.preventDefault();
      this.writeCommand(command);
    }
  }

  // 销毁键盘事件监听
  destroy() {
    if (this.isListening) {
      window.removeEventListener("keydown", this.handleKeydown);
      this.isListening = false;
    }

    this.gridElCont = null;
    this.mode = "default";

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
export default new KeyBoardHandler();
