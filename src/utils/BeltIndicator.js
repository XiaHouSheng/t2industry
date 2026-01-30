/**
 * 传送带放置指示器
 * 1. 显示传送带将要放置的位置和方向
 * 2. 跟随鼠标移动实时更新
 * 3. 根据position坐标显示网格位置
 * 4. 只在belts模式下显示
 */
/**
 * 
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
    this.indicatorElement.style.width = `${this.gridSize}px`;
    this.indicatorElement.style.height = `${this.gridSize}px`;
    // 创建斜线背景效果（与路径样式一致）
    this.indicatorElement.style.background =
      "repeating-linear-gradient(45deg, rgba(0,128,255,0.3) 0, rgba(0,128,255,0.3) 1px, transparent 1px, transparent 5px)";
    this.indicatorElement.style.backgroundSize = "7.07px 7.07px";
    this.indicatorElement.style.border = "1px solid rgba(0,128,255,0.5)";
    this.indicatorElement.style.pointerEvents = "none";
    this.indicatorElement.style.zIndex = "0";
    this.indicatorElement.style.display = "none";
    this.indicatorElement.style.transition = "all 0.01s ease";
    // 添加到容器
    this.gridElCont.appendChild(this.indicatorElement);

    // 创建连接线元素
    this.lineElement = document.createElement("div");
    this.lineElement.className = "belt-indicator-line";
    this.lineElement.style.position = "absolute";
    this.lineElement.style.pointerEvents = "none";
    this.lineElement.style.zIndex = "-1";
    this.lineElement.style.display = "none";
    // 添加到容器
    this.gridElCont.appendChild(this.lineElement);
  }

  // 鼠标移动事件处理
  onMoveMouse(event) {
    if (!this.rootStore || !this.indicatorElement) return;

    // 获取网格位置
    const position = this.rootStore.getPositionFromClick(event);
    if (!position) return;
    // 更新指示器位置
    this.updateIndicator(position);
  }

  // 更新指示器位置
  updateIndicator(position) {
    if (!this.indicatorElement || !this.rootStore) return;
    // 计算像素位置
    const pixelX = position.x * this.gridSize;
    const pixelY = position.y * this.gridSize;

    // 更新指示器位置
    this.indicatorElement.style.left = `${pixelX}px`;
    this.indicatorElement.style.top = `${pixelY}px`;
    this.indicatorElement.style.display = "block";

    // 绘制连接线
    this.drawConnectionLine(position);
  }

  // 绘制连接线（使用网格显示传送带路径）
  drawConnectionLine(currentPosition) {
    if (!this.lineElement || !this.rootStore) return;

    const lastBaseNode = this.rootStore.lastBaseNode;
    if (!lastBaseNode) {
      this.lineElement.style.display = "none";
      return;
    }

    // 计算路径上的所有网格点（使用曼哈顿路径，先x后y）
    const gridPoints = [];

    // 水平移动
    const startX = Math.min(lastBaseNode.x, currentPosition.x);
    const endX = Math.max(lastBaseNode.x, currentPosition.x);
    for (let x = startX; x <= endX; x++) {
      gridPoints.push({ x, y: lastBaseNode.y });
    }

    // 垂直移动
    const startY = Math.min(lastBaseNode.y, currentPosition.y);
    const endY = Math.max(lastBaseNode.y, currentPosition.y);
    for (let y = startY; y <= endY; y++) {
      gridPoints.push({ x: currentPosition.x, y });
    }

    // 创建网格元素来显示路径
    let gridHtml = "";
    gridPoints.forEach(point => {
      const pixelX = point.x * this.gridSize;
      const pixelY = point.y * this.gridSize;
      gridHtml += `<div style="
        position: absolute;
        left: ${pixelX}px;
        top: ${pixelY}px;
        width: ${this.gridSize}px;
        height: ${this.gridSize}px;
        background: repeating-linear-gradient(45deg, rgba(0,128,255,0.3) 0, rgba(0,128,255,0.3) 1px, transparent 1px, transparent 5px);
        background-size: 7.07px 7.07px;
        border: 1px solid rgba(0,128,255,0.5);
        pointer-events: none;
      "></div>`;
    });

    // 更新连接线元素
    this.lineElement.innerHTML = gridHtml;
    this.lineElement.style.display = "block";
    this.lineElement.style.left = "0";
    this.lineElement.style.top = "0";
    this.lineElement.style.width = "100%";
    this.lineElement.style.height = "100%";
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
    if (this.lineElement) {
      this.lineElement.style.display = "none";
    }
  }

  // 开始快速放置
  handleStartBelt() {
    this.rootStore = useRootStore();
    if (this.rootStore.quickPlaceMode === "belt") {
      this.rootStore.gridEl.addEventListener("mousemove", this.onMoveMouse);
    } else if (this.rootStore.quickPlaceMode === "pipe") {
      this.rootStore.pipeGrid.addEventListener("mousemove", this.onMoveMouse);
    }
    this.activate();
  }

  // 结束快速放置
  handleEndBelt() {
    if (this.gridElCont) {
      if (this.rootStore.quickPlaceMode === "belt") {
        this.rootStore.gridEl.removeEventListener("mousemove", this.onMoveMouse);
      } else if (this.rootStore.quickPlaceMode === "pipe") {
        this.rootStore.pipeGrid.removeEventListener("mousemove", this.onMoveMouse);
      }
    }
    this.deactivate();
  }

  // 销毁指示器
  destroy() {
    if (this.gridElCont) {
      this.gridElCont.removeEventListener("mousemove", this.onMoveMouse);
      if (this.indicatorElement) {
        this.gridElCont.removeChild(this.indicatorElement);
      }
      if (this.lineElement) {
        this.gridElCont.removeChild(this.lineElement);
      }
    }
    this.indicatorElement = null;
    this.lineElement = null;
    this.gridElCont = null;
    this.rootStore = null;
  }

  
}

// 导出单例实例
export default new BeltIndicator();
