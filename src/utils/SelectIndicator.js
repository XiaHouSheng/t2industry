import { useRootStore } from "../stores/SimStore";

class SelectIndicator {
  constructor() {
    //方法调用
    this.rootStore = null;
    //指示器容器
    this.indicatorContainer = null;
    //根容器
    this.rootContainer = null;
    //维护所框选机器所构成的范围
    this.selectRange = {
      minX: null,
      maxX: null,
      minY: null,
      maxY: null,
    };
    //网格大小
    this.gridSize = 3017 / 72;
    //存储选中的配置
    this.selectedConfigs = {}
    //鼠标移动事件
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  /**
   * now: 目前select的逻辑是，先框选范围提交左上角和右下角的坐标
   * 提交给特殊方法遍历所有的传送带元素，接着弹出是否删除对话框
   * 确认后进行批量删除。（需要完全修改，这里做一个indicator方法
   * 对接select的总方法，后续需要修改原select的方法）
   * 原select的方法需要修改的内容如下：
   * 1.原本的popper的删除需要替换掉。替换成ElMessage[]
   * 2.ElMessage对话框的触发条件改为框选后按下delete，在keyBoardHandler
   * 中直接注册使用[]
   * 最大框选元素的数量
   * --------------------------
   * 3.select后需要把数据先加入一个集合，后续删除时遍历这个集合进行删除
   *,注意数组内部存储的东西不只是element，应该分类为machine,belt,pipe后续
   * 后续遍历分别调用删除方法进行删除。
   * 4.若不进行删除操作，则需要跟随鼠标的位置进行移动，但是不移动元素本身，
   * 现在overlay层上按照所选的元素生成一个遮罩（即指示器）指示器需要跟随
   * 鼠标移动。基准点应当为所框选的元素所构成的元素组所构成的cubio的中心点
   * 。
   * 5.遮罩的生成，应当从框选所选择的元素数据进行生成，例如3*3等尺寸数据，
   * 相当于进行了一次拓印
   * 。
   *
   */

  //初始化
  init(rootContainer) {
    this.rootContainer = rootContainer;
    this.rootStore = useRootStore();
    this.createIndicator();
  }

  //生成指示器
  createIndicator() {
    this.indicatorContainer = document.createElement("div");
    this.indicatorContainer.style.position = "absolute";
    this.indicatorContainer.style.zIndex = 1000;
    this.indicatorContainer.style.pointerEvents = "none";
    this.indicatorContainer.style.backgroundColor = "rgba(0, 115, 255, 0.82)";
    this.rootContainer.appendChild(this.indicatorContainer);
  }

  //生成拓印
  generatePrint(config) {
    const { x, y, width, height } = config;

    const indicator = document.createElement("div");
    indicator.style.position = "absolute";
    indicator.style.left = `${x * this.gridSize}px`;
    indicator.style.top = `${y * this.gridSize}px`;
    indicator.style.width = `${width * this.gridSize}px`;
    indicator.style.height = `${height * this.gridSize}px`;
    indicator.style.backgroundColor = "rgba(0, 115, 255, 0.66)";
    this.indicatorContainer.appendChild(indicator);
    return indicator;
  }

  //校准鼠标的位置
  calibrateMousePosition(x, y) {
    if (!this.indicatorContainer) return;

    // 这里的 x 和 y 是从 SelectStore 传入的 newWidth 和 newHeight
    // 我们需要将指示器容器定位到合适的位置
    // 计算中心位置
    const centerX = x / 2;
    const centerY = y / 2;

    // 将指示器容器定位到框选区域的中心
    this.indicatorContainer.style.left = `${centerX}px`;
    this.indicatorContainer.style.top = `${centerY}px`;
  }

  //激活监听MouseMove事件
  activateMouseMoveListener() {
    if (this.rootStore && this.rootStore.gridEl) {
      this.rootStore.gridEl.addEventListener("mousemove", this.handleMouseMove);
    }
  }

  //处理MouseMove事件
  handleMouseMove(event) {
    if (!this.indicatorContainer) return;
    const biasX = Math.floor(
      this.selectRange.minX +
        (this.selectRange.maxX - this.selectRange.minX) / 2,
    );
    const biasY = Math.floor(
      this.selectRange.minY +
        (this.selectRange.maxY - this.selectRange.minY) / 2,
    );
    const rect = this.rootContainer.getBoundingClientRect();
    // 屏幕坐标 → 容器视觉坐标
    const visualX = event.clientX - rect.left;
    const visualY = event.clientY - rect.top;
    // 视觉坐标 → 逻辑坐标（关键）
    const logicX = visualX / this.rootStore.gridElContScale;
    const logicY = visualY / this.rootStore.gridElContScale;
    // 网格吸附（逻辑空间）
    const col = Math.floor(logicX / this.gridSize) - biasX;
    const row = Math.floor(logicY / this.gridSize) - biasY;
    const snappedX = col * this.gridSize;
    const snappedY = row * this.gridSize;
    // 放回逻辑坐标（不要再 * scale）
    this.indicatorContainer.style.left = `${snappedX}px`;
    this.indicatorContainer.style.top = `${snappedY}px`;
  }

  resetAll() {
    // 清空选中的配置对象
    this.selectedConfigs = {};
  }

  //更新指示器的内容
  updateIndicatorContent(position) {
    const { startCell, endCell } = position;

    // 重置选择范围
    this.selectRange = {
      minX: null,
      maxX: null,
      minY: null,
      maxY: null,
    };
    // 清空所有拓印
    this.clearIndicator();

    // 计算框选范围
    const startX = Math.min(startCell.x, endCell.x);
    const endX = Math.max(startCell.x, endCell.x);
    const startY = Math.min(startCell.y, endCell.y);
    const endY = Math.max(startCell.y, endCell.y);

    // 遍历所有 gridWidgetElements
    Object.values(this.rootStore.gridWidgetElements).forEach((item) => {
      // 获取元素的位置和大小
      const x = parseInt(item.getAttribute("gs-x")) || 0;
      const y = parseInt(item.getAttribute("gs-y")) || 0;
      const w = parseInt(item.getAttribute("gs-w")) || 1;
      const h = parseInt(item.getAttribute("gs-h")) || 1;
      const id = item.getAttribute("gs-id");

      //贪心维护
      this.selectRange.minX = Math.min(this.selectRange.minX ?? x, x);
      this.selectRange.maxX = Math.max(
        this.selectRange.maxX ?? x + w,
        x + w,
      );
      this.selectRange.minY = Math.min(this.selectRange.minY ?? y, y);
      this.selectRange.maxY = Math.max(
        this.selectRange.maxY ?? y + h,
        y + h,
      );

      // 检查是否在框选范围内
      if (x >= startX && x <= endX && y >= startY && y <= endY) {
        // 创建配置对象
        const config = {
          x: x,
          y: y,
          width: w,
          height: h,
          id: id,
        };
        // 添加到选中的配置集合
        this.selectedConfigs[id] = config;
      }
    });

    console.log(this.selectedConfigs);

    // 遍历选中的配置对象，生成拓印
    Object.values(this.selectedConfigs).forEach((config) => {
      this.generatePrint(config);
    });

    //生命周期还需要重新绑定事件
    this.activateMouseMoveListener();
  }

  //清空指示器
  clearIndicator() {
    this.indicatorContainer.innerHTML = "";
  }
}

export default new SelectIndicator();
