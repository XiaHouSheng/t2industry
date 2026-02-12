import { useRootStore } from "../stores/SimStore";

class SelectIndicator {
  constructor() {
    //方法调用
    this.selectStore = null;
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
    this.selectedConfigs = {};
    this.selectedBeltConfigs = {};
    this.selectedPipeConfigs = {};
    // 复制选中的配置
    this.selectedConfigsCopy = {};
    this.selectedBeltConfigsCopy = {};
    this.selectedPipeConfigsCopy = {};
    // 旋转配置
    this.rotate = 0;
    //鼠标移动事件
    this.handleMouseMove = this.handleMouseMove.bind(this);
    //偏移
    this.bias = {
      biasX: 0,
      biasY: 0,
    };
    //旋转中心点a
    this.center = {
      centerX: 0,
      centerY: 0,
    };
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
    this.indicatorContainer.style.position = "relative";
    this.indicatorContainer.style.zIndex = 1000;
    this.indicatorContainer.style.pointerEvents = "none";
    this.indicatorContainer.style.left = "0px";
    this.indicatorContainer.style.top = "0px";
    this.rootContainer.appendChild(this.indicatorContainer);
  }

  updateSelectRange(x, y, w, h) {
    this.selectRange.minX = Math.min(this.selectRange.minX ?? x, x);
    this.selectRange.maxX = Math.max(this.selectRange.maxX ?? x + w, x + w);
    this.selectRange.minY = Math.min(this.selectRange.minY ?? y, y);
    this.selectRange.maxY = Math.max(this.selectRange.maxY ?? y + h, y + h);
    //更新指示器的尺寸
    this.indicatorContainer.style.width = `${(this.selectRange.maxX - this.selectRange.minX) * this.gridSize}px`;
    this.indicatorContainer.style.height = `${(this.selectRange.maxY - this.selectRange.minY) * this.gridSize}px`;
  }

  clearSelectRange() {
    this.selectRange.minX = null;
    this.selectRange.maxX = null;
    this.selectRange.minY = null;
    this.selectRange.maxY = null;
  }

  //生成拓印
  generatePrint(config) {
    const { x, y, width, height } = config;
    const { minX, minY, maxX, maxY } = this.selectRange;
    const indicator = document.createElement("div");
    indicator.style.position = "absolute";
    indicator.style.left = `${(x - minX) * this.gridSize}px`;
    indicator.style.top = `${(y - minY) * this.gridSize}px`;
    indicator.style.width = `${width * this.gridSize}px`;
    indicator.style.height = `${height * this.gridSize}px`;
    indicator.style.backgroundColor = "rgba(0, 115, 255, 0.66)";
    indicator.style.zIndex = 2000;
    this.indicatorContainer.appendChild(indicator);
    return indicator;
  }

  //激活监听MouseMove事件
  activateMouseMoveListener() {
    if (this.rootStore && this.rootStore.gridEl) {
      this.rootStore.gridEl.addEventListener("mousemove", this.handleMouseMove);
    }
  }

  //取消监听MouseMove事件
  deactivateMouseMoveListener() {
    if (this.rootStore && this.rootStore.gridEl) {
      this.rootStore.gridEl.removeEventListener(
        "mousemove",
        this.handleMouseMove,
      );
    }
  }

  //处理MouseMove事件
  handleMouseMove(event) {
    if (!this.indicatorContainer) return;

    const rect = this.rootContainer.getBoundingClientRect();
    // 屏幕坐标 → 容器视觉坐标
    const visualX = event.clientX - rect.left;
    const visualY = event.clientY - rect.top;
    // 视觉坐标 → 逻辑坐标（关键）
    const logicX = visualX / this.rootStore.gridElContScale;
    const logicY = visualY / this.rootStore.gridElContScale;

    const newBaseX = Math.floor(logicX / this.gridSize);
    const newBaseY = Math.floor(logicY / this.gridSize);

    const width = this.selectRange.maxX - this.selectRange.minX;
    const height = this.selectRange.maxY - this.selectRange.minY;

    // 网格吸附（逻辑空间）
    const col = newBaseX - Math.floor(width / 2);
    const row = newBaseY - Math.floor(height / 2);

    const snappedX = col * this.gridSize;
    const snappedY = row * this.gridSize;

    this.bias = {
      biasX: newBaseX - this.selectRange.minX - Math.floor(width / 2),
      biasY: newBaseY - this.selectRange.minY - Math.floor(height / 2),
    };

    this.center = {
      centerX: newBaseX,
      centerY: newBaseY,
    };

    // 放回逻辑坐标（不要再 * scale）
    this.indicatorContainer.style.left = `${snappedX}px`;
    this.indicatorContainer.style.top = `${snappedY}px`;
  }

  clearConfig() {
    // 清空选中的配置对象
    this.selectedConfigs = {};
    this.selectedBeltConfigs = {};
    this.selectedPipeConfigs = {};
    // 清空复制配置
    this.selectedConfigsCopy = {};
    this.selectedBeltConfigsCopy = {};
    this.selectedPipeConfigsCopy = {};
    // 清空偏移数据
    this.bias = {
      biasX: 0,
      biasY: 0,
    };
  }

  rotatePoint90(machine, rotate) {
    const { x, y, width, height } = machine;
    const { biasX, biasY } = this.bias;
    const { centerX, centerY } = this.center;

    const step = this.rotate / 90;
    console.log(step)

    const machineCenterX = Math.floor(x + width / 2) + biasX;
    const machineCenterY = Math.floor(y + height / 2) + biasY;

    let vx = machineCenterX - centerX;
    let vy = machineCenterY - centerY;

    let rx = vx;
    let ry = vy;

    let newWidth = width;
    let newHeight = height;

    switch (step) {
      case 0:
        break;
      case 1: // 90°
        rx = -vy;
        ry = vx;
        newWidth = height;
        newHeight = width;
        break;
      case 2: // 180°
        rx = -vx;
        ry = -vy;
        break;
      case 3: // 270°
        rx = vy;
        ry = -vx;
        newWidth = height;
        newHeight = width;
        break;
    }

    return {
      rotateX: rx + centerX,
      rotateY: ry + centerY,
      newWidth:  newWidth,
      newHeight: newHeight,
    };
  }

  rotateClockwise() {
    /*  
    base baseX,baseY 基准坐标：位移元素群环绕的基准坐标（跟随鼠标移动）
    bias biasX,biasY 偏移坐标：选中元素群相对于基准坐标的偏移量（可以通过copy的config文件的坐标推算位移后的坐标）
    rotate 旋转角度：选中元素群的旋转角度（顺时针旋转90度）
    this.selectedConfigsCopy = {};
    this.selectedBeltConfigsCopy = {};
    this.selectedPipeConfigsCopy = {};
    const config = {
          x: x,
          y: y,
          width: w,
          height: h,
          id: id,
          //el: item,
        };
    */

    //const firstMachine = this.selectedConfigs[Object.keys(this.selectedConfigs)[0]];
    //const { centerX, centerY } = this.center; //旋转中心点坐标
    //const { biasX, biasY } = this.bias; //选中元素群相对于基准坐标的偏移量
    //const { x, y, width, height } = firstMachine;

    if (this.rotate === 0) {
      this.rotate = 90;
    } else if (this.rotate === 90) {
      this.rotate = 180;
    } else if (this.rotate === 180) {
      this.rotate = 270;
    } else if (this.rotate === 270) {
      this.rotate = 0;
    }

    //const { rotateX, rotateY } = this.rotatePoint90(firstMachine, this.rotate);
    //console.log("rotateX", rotateX, "rotateY", rotateY);

    this.indicatorContainer.style.transform = `rotate(${this.rotate}deg)`;
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

    //可复用
    const firstStepCheck = (item, type = "machine") => {
      const x = parseInt(item.getAttribute("gs-x")) || 0;
      const y = parseInt(item.getAttribute("gs-y")) || 0;
      const w = parseInt(item.getAttribute("gs-w")) || 1;
      const h = parseInt(item.getAttribute("gs-h")) || 1;
      const id = item.getAttribute("gs-id");

      // 检查是否在框选范围内
      if (x >= startX && x <= endX && y >= startY && y <= endY) {
        // 创建配置对象
        const config = {
          x: x,
          y: y,
          width: w,
          height: h,
          id: id,
          //el: item,
        };

        this.updateSelectRange(x, y, w, h);

        // 添加到对应选中的配置集合
        if (type === "machine") {
          this.selectedConfigs[id] = config;
        }
        if (type === "belt") {
          this.selectedBeltConfigs[id] = config;
        }
        if (type === "pipe") {
          this.selectedPipeConfigs[id] = config;
        }
      }
    };

    // 遍历所有 gridWidgetElements
    Object.values(this.rootStore.gridWidgetElements).forEach((item) => {
      // 获取元素的位置和大小
      firstStepCheck(item, "machine");
    });

    // 遍历传送带和管道
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const beltElement = this.rootStore.gridBelt2dElement[`${x}-${y}`];
        const pipeElement = this.rootStore.gridPipe2dElement[`${x}-${y}`];
        if (beltElement) {
          firstStepCheck(beltElement, "belt");
        }
        if (pipeElement) {
          firstStepCheck(pipeElement, "pipe");
        }
      }
    }

    console.log(this.selectRange)
    this.indicatorContainer.style.left = `${this.selectRange.minX * this.gridSize}px`;
    this.indicatorContainer.style.top = `${this.selectRange.minY * this.gridSize}px`;

    // 遍历选中的配置对象，生成拓印
    Object.values(this.selectedConfigs).forEach((config) => {
      //console.log(config)
      this.generatePrint(config);
    });
    Object.values(this.selectedBeltConfigs).forEach((config) => {
      //console.log(config)
      this.generatePrint(config);
    });
    Object.values(this.selectedPipeConfigs).forEach((config) => {
      //console.log(config)
      this.generatePrint(config);
    });
  }

  //清空指示器
  clearIndicator() {
    this.indicatorContainer.innerHTML = "";
  }

  processConfigData() {
    Object.entries(this.selectedConfigs).forEach(([nodeId, node]) => {
      const { x, y, width, height, id } = node;
      const { rotateX, rotateY, newWidth, newHeight } = this.rotatePoint90(node, this.rotate)
      this.selectedConfigs[id] = {
        x: rotateX - newWidth / 2,
        y: rotateY - newHeight / 2,
        width: newWidth,
        height: newHeight,
        id: id,
      };
    });
  }

  //重置指示器
  reset() {
    this.clearConfig();
    this.clearIndicator();
    this.deactivateMouseMoveListener();
    this.indicatorContainer.style.left = `0`;
    this.indicatorContainer.style.top = `0`;
  }
}

export default new SelectIndicator();
