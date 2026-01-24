// 键盘事件处理器

class KeyboardHandler {
  constructor() {
    this.isListening = false;
    this.gridElCont = null;
    this.gridElContScale = 1;
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  // 初始化键盘事件监听
  init(gridElCont) {
    if (this.isListening) return;
    
    this.gridElCont = gridElCont;
    window.addEventListener('keydown', this.handleKeydown);
    this.isListening = true;
  }

  // 更新缩放比例
  updateScale(scale) {
    this.gridElContScale = scale;
  }

  // 键盘按下事件处理
  handleKeydown(event) {
    // 只处理WASD键
    const key = event.key.toLowerCase();
    if (!['w', 'a', 's', 'd'].includes(key)) return;
    
    // 阻止默认行为（如页面滚动）
    event.preventDefault();
    
    // 根据gridElContScale计算滚动步长
    const baseStep = 50;
    const step = baseStep * this.gridElContScale;
    
    // 根据按键方向计算滚动方向
    switch (key) {
      case 'w': // 上
        this.gridElCont.scrollTop -= step;
        break;
      case 'a': // 左
        this.gridElCont.scrollLeft -= step;
        break;
      case 's': // 下
        this.gridElCont.scrollTop += step;
        break;
      case 'd': // 右
        this.gridElCont.scrollLeft += step;
        break;
    }
  }

  // 销毁键盘事件监听
  destroy() {
    if (!this.isListening) return;
    
    window.removeEventListener('keydown', this.handleKeydown);
    this.isListening = false;
    this.gridElCont = null;
  }
}

// 导出单例实例
export default new KeyboardHandler();
