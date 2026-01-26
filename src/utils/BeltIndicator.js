/**
 * 传送带放置指示器
 * 1. 显示传送带将要放置的位置和方向
 * 2. 跟随鼠标移动实时更新
 * 3. 根据position坐标显示网格位置
 * 4. 只在belts模式下显示
 */
import { useRootStore } from "../stores/SimStore";

class BeltIndicator {
  constructor() {
    this.gridElCont = null;
    this.rootStore = null;
    this.indicatorElement = null;
    this.gridSize = 3017 / 72; // 每个网格单元的大小（像素）

    // 绑定事件处理方法的this上下文
    this.onMoveMouse = this.onMoveMouse.bind(this);
    this.updateIndicator = this.updateIndicator.bind(this);
  }

  // 初始化
  init(gridElCont) {
    if (!gridElCont) return;
    this.gridElCont = gridElCont;
    this.createIndicatorElement();
  }

  // 创建指示器元素
  createIndicatorElement() {
    // 创建指示器容器
    this.indicatorElement = document.createElement("div");
    this.indicatorElement.className = "belt-indicator";
    this.indicatorElement.style.position = "absolute";
    this.indicatorElement.style.width = `${this.gridSize * 5}px`;
    this.indicatorElement.style.height = `${this.gridSize * 5}px`;
    // 创建由中心向外发散的网格效果
    this.indicatorElement.style.background = "linear-gradient(rgba(0,128,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,128,255,0.3) 1px, transparent 1px)";
    this.indicatorElement.style.backgroundSize = "20% 20%";
    this.indicatorElement.style.border = "2px solid #0080ff";
    this.indicatorElement.style.borderRadius = "4px";
    this.indicatorElement.style.pointerEvents = "none";
    this.indicatorElement.style.zIndex = "0";
    this.indicatorElement.style.display = "none";
    this.indicatorElement.style.transition = "all 0.1s ease";
    // 添加到容器
    this.gridElCont.appendChild(this.indicatorElement);
  }

  // 鼠标移动事件处理
  onMoveMouse(event) {
    if (!this.rootStore || !this.indicatorElement) return;

    // 获取网格位置
    const position = this.rootStore.getPositionFromClick(event);
    if (!position) return;
    console.log(position);
    // 更新指示器位置
    this.updateIndicator(position);
  }

  // 更新指示器位置
  updateIndicator(position) {
    if (!this.indicatorElement || !this.rootStore) return;
    console.log(`position: ${position.x}, ${position.y}`);
    // 计算像素位置
    const pixelX = position.x * this.gridSize - 2 * this.gridSize;
    const pixelY = position.y * this.gridSize - 2 * this.gridSize;

    // 更新指示器位置
    this.indicatorElement.style.left = `${pixelX}px`;
    this.indicatorElement.style.top = `${pixelY}px`;
    this.indicatorElement.style.display = "block";
  }

  // 激活指示器
  activate() {
    this.gridElCont.style.zIndex = "1000";
    if (this.indicatorElement) {
      this.indicatorElement.style.display = "block";
    }
  }

  // 禁用指示器
  deactivate() {
    this.gridElCont.style.zIndex = "0";
    if (this.indicatorElement) {
      this.indicatorElement.style.display = "none";
    }
  }

  // 开始快速放置
  handleStartBelt() {
    this.rootStore = useRootStore();
    this.gridElCont.addEventListener("mousemove", this.onMoveMouse);
    this.activate();
  }

  // 结束快速放置
  handleEndBelt() {
    if (this.gridElCont) {
      this.gridElCont.removeEventListener("mousemove", this.onMoveMouse);
    }
    this.deactivate();
  }

  // 销毁指示器
  destroy() {
    if (this.gridElCont && this.indicatorElement) {
      this.gridElCont.removeEventListener("mousemove", this.onMoveMouse);
      this.gridElCont.removeChild(this.indicatorElement);
    }
    this.indicatorElement = null;
    this.gridElCont = null;
    this.rootStore = null;
  }

  // 处理overlay点击事件，传递给底层grid-stack
  handleOverlayClick(event) {
    const gridStackEl = document.getElementById("grid-stack");
    if (gridStackEl) {
      // 创建一个新的点击事件，坐标与原事件相同
      const newEvent = new MouseEvent("click", {
        clientX: event.clientX,
        clientY: event.clientY,
        bubbles: true,
        cancelable: true,
      });
      // 触发grid-stack的点击事件
      gridStackEl.dispatchEvent(newEvent);
    }
  }
}

// 导出单例实例
export default new BeltIndicator();
