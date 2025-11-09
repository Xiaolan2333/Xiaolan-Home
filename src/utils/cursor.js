import { isEqual } from "lodash-es";

let mainCursor;

/**
 * 线性插值函数
 * @param {number} a - 起始值
 * @param {number} b - 目标值
 * @param {number} n - 插值因子 (0-1之间)
 * @returns {number} 插值结果
 */
const lerp = (a, b, n) => {
  if (Math.round(a) === b) {
    return b;
  }
  return (1 - n) * a + n * b;
};

/**
 * 获取元素的样式属性值
 * @param {Element} el - DOM元素
 * @param {string} attr - 样式属性名
 * @returns {string|boolean} 样式属性值，出错时返回false
 */
const getStyle = (el, attr) => {
  try {
    return window.getComputedStyle ? window.getComputedStyle(el)[attr] : el.currentStyle[attr];
  } catch (e) {
    console.error(e);
  }
  return false;
};

/**
 * 初始化光标实例
 * @returns {Cursor} 光标实例
 */
const cursorInit = () => {
  mainCursor = new Cursor();
  return mainCursor;
};

/**
 * 自定义光标类
 * 创建一个可自定义样式的鼠标光标，支持平滑动画效果
 */
class Cursor {
  constructor() {
    // 光标位置信息，包含当前和上一次的位置
    this.pos = {
      curr: null,
      prev: null,
    };
    // 存储所有具有pointer样式的元素
    this.pt = [];
    // 创建光标元素
    this.create();
    // 初始化事件监听
    this.init();
    // 开始渲染动画
    this.render();
  }

  /**
   * 移动光标到指定位置
   * @param {number} left - 左边距
   * @param {number} top - 上边距
   */
  move(left, top) {
    this.cursor.style["left"] = `${left}px`;
    this.cursor.style["top"] = `${top}px`;
  }

  /**
   * 创建自定义光标元素和相关样式
   */
  create() {
    // 如果光标元素不存在，则创建
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden");
      this.cursor.classList.add("hidden");
      document.body.append(this.cursor);
    }

    // 查找所有具有pointer光标的元素
    var el = document.getElementsByTagName("*");
    for (let i = 0; i < el.length; i++)
      if (getStyle(el[i], "cursor") == "pointer") this.pt.push(el[i].outerHTML);

    // 添加自定义光标样式
    document.body.appendChild((this.scr = document.createElement("style")));
    this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto !important}`;
  }
  
  /**
   * 刷新光标状态和样式
   */
  refresh() {
    this.scr.remove();
    this.cursor.classList.remove("active");
    this.pos = {
      curr: null,
      prev: null,
    };
    this.pt = [];

    this.create();
    this.init();
    this.render();
  }

  /**
   * 初始化光标事件监听器
   */
  init() {
    // 鼠标移动事件
    document.onmousemove = (e) => {
      this.pos.curr == null && this.move(e.clientX - 8, e.clientY - 8);
      this.pos.curr = {
        x: e.clientX - 8,
        y: e.clientY - 8,
      };
      this.cursor.classList.remove("hidden");
      this.render();
    };
    
    // 鼠标进入页面事件
    document.onmouseenter = () => this.cursor.classList.remove("hidden");
    
    // 鼠标离开页面事件
    document.onmouseleave = () => this.cursor.classList.add("hidden");
    
    // 鼠标按下事件
    document.onmousedown = () => this.cursor.classList.add("active");
    
    // 鼠标释放事件
    document.onmouseup = () => this.cursor.classList.remove("active");
  }

  /**
   * 渲染光标动画
   * 使用requestAnimationFrame实现平滑动画效果
   */
  render() {
    if (this.pos.prev) {
      // 使用线性插值实现平滑移动效果
      this.pos.prev.x = lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else {
      this.pos.prev = this.pos.curr;
    }
    
    // 如果位置有变化，继续动画帧
    if (!isEqual(this.pos.curr, this.pos.prev)) {
      requestAnimationFrame(() => this.render());
    }
  }
}

export default cursorInit;