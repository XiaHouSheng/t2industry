// 右键拖动滚动处理器
import { useRootStore } from "../stores/SimStore";

class DragScrollHandler {
  constructor() {
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.startScrollLeft = 0;
    this.startScrollTop = 0;
    this.gridElCont = null;
    
    // 绑定事件处理方法
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
  }

  // 初始化
  init(gridElCont) {
    if (!gridElCont) return;
    
    this.gridElCont = gridElCont;
    this.gridElCont.addEventListener('mousedown', this.handleMousedown);
    document.addEventListener('mousemove', this.handleMousemove);
    document.addEventListener('mouseup', this.handleMouseup);
  }

  // 获取工具栏模式
  getToolbarMode() {
    const rootStore = useRootStore();
    return rootStore.toolbarMode;
  }

  // 鼠标按下事件处理
  handleMousedown(event) {
    // 只处理右键（button === 2）
    if (event.button !== 2) return;
    
    // 只在default模式下启用
    if (this.getToolbarMode() !== 'default') return;
    
    // 阻止默认行为（如上下文菜单）
    event.preventDefault();
    
    // 开始拖动
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startScrollLeft = this.gridElCont.scrollLeft;
    this.startScrollTop = this.gridElCont.scrollTop;
    
    // 添加拖动光标样式
    this.gridElCont.style.cursor = 'grabbing';
  }

  // 鼠标移动事件处理
  handleMousemove(event) {
    // 如果不是拖动状态，直接返回
    if (!this.isDragging) return;
    
    // 计算鼠标移动距离
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    
    // 更新滚动位置
    this.gridElCont.scrollLeft = this.startScrollLeft - deltaX;
    this.gridElCont.scrollTop = this.startScrollTop - deltaY;
  }

  // 鼠标释放事件处理
  handleMouseup() {
    // 结束拖动
    this.isDragging = false;
    
    // 恢复光标样式
    if (this.gridElCont) {
      this.gridElCont.style.cursor = '';
    }
  }

  // 销毁
  destroy() {
    if (this.gridElCont) {
      this.gridElCont.removeEventListener('mousedown', this.handleMousedown);
    }
    document.removeEventListener('mousemove', this.handleMousemove);
    document.removeEventListener('mouseup', this.handleMouseup);
    
    this.gridElCont = null;
    this.isDragging = false;
  }
}

// 导出单例实例
export default new DragScrollHandler();
