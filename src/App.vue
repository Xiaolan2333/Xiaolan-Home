<template>
  <!-- 加载动画组件 -->
  <Loading />
  <!-- 背景壁纸组件，加载完成后触发 loadComplete 事件 -->
  <Background @loadComplete="loadComplete" />
  <!-- 主界面内容，使用淡入淡出过渡效果 -->
  <Transition name="fade" mode="out-in">
    <!-- 当图片加载完成时显示主界面 -->
    <main id="main" v-if="store.imgLoadStatus">
      <div class="container" v-show="!store.backgroundShow">
        <!-- 主要内容区域 -->
        <section class="all" v-show="!store.setOpenState">
          <!-- 左侧主内容 -->
          <MainLeft />
          <!-- 右侧主内容，当盒子未打开时显示 -->
          <MainRight v-show="!store.boxOpenState" />
          <!-- 盒子组件，当盒子打开时显示 -->
          <Box v-show="store.boxOpenState" />
        </section>
        <!-- 更多设置区域，当设置打开时显示，并点击关闭设置 -->
        <section class="more" v-show="store.setOpenState" @click="store.setOpenState = false">
          <MoreSet />
        </section>
      </div>
      <!-- 移动端菜单按钮，当背景未展示时显示 -->
      <Icon
        class="menu"
        size="24"
        v-show="!store.backgroundShow"
        @click="store.mobileOpenState = !store.mobileOpenState"
      >
        <!-- 根据移动端菜单状态切换图标 -->
        <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
      </Icon>
      <!-- 页脚组件，使用淡入淡出过渡效果 -->
      <Transition name="fade" mode="out-in">
        <!-- 当背景未展示且设置未打开时显示页脚 -->
        <Footer class="f-ter" v-show="!store.backgroundShow && !store.setOpenState" />
      </Transition>
    </main>
  </Transition>
</template>

<script setup>
// 导入工具函数
import { helloInit, checkDays } from "@/utils/getTime.js";
// 导入图标组件
import { HamburgerButton, CloseSmall } from "@icon-park/vue-next";
// 导入主存储
import { mainStore } from "@/store";
// 导入图标工具
import { Icon } from "@vicons/utils";
// 导入各组件
import Loading from "@/components/Loading.vue";
import MainLeft from "@/views/Main/Left.vue";
import MainRight from "@/views/Main/Right.vue";
import Background from "@/components/Background.vue";
import Footer from "@/components/Footer.vue";
import Box from "@/views/Box/index.vue";
import MoreSet from "@/views/MoreSet/index.vue";
import cursorInit from "@/utils/cursor.js";
// 导入项目配置
import config from "@/../package.json";

// 获取主存储实例
const store = mainStore();

// 获取当前窗口宽度并更新到存储中
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
};

// 图片加载完成后的处理函数
const loadComplete = () => {
  nextTick(() => {
    // 显示欢迎信息
    helloInit();
    // 检查是否为特殊日期（默哀模式）
    checkDays();
  });
};

// 监听窗口宽度变化，移动端适配
watch(
  () => store.innerWidth,
  (value) => {
    // 当屏幕宽度小于721px时，关闭盒子和设置面板
    if (value < 721) {
      store.boxOpenState = false;
      store.setOpenState = false;
    }
  },
);

// 组件挂载后执行的初始化操作
onMounted(() => {
  // 初始化自定义鼠标样式
  cursorInit();

  // 禁用右键菜单
  document.oncontextmenu = () => {
    ElMessage({
      message: "为了浏览体验，本站禁用右键",
      grouping: true,
      duration: 2000,
    });
    return false;
  };

  // 监听鼠标中键点击事件，切换背景展示状态
  window.addEventListener("mousedown", (event) => {
    if (event.button == 1) {
      store.backgroundShow = !store.backgroundShow;
      ElMessage({
        message: `已${store.backgroundShow ? "开启" : "退出"}壁纸展示状态`,
        grouping: true,
      });
    }
  });

  // 初始化并监听窗口大小变化
  getWidth();
  window.addEventListener("resize", getWidth);

  // 在控制台输出项目信息
  const styleTitle1 = "font-size: 20px;font-weight: 600;color: rgb(135,206,250);";
  const styleTitle2 = "font-size:12px;color: rgb(135,206,250);";
  const styleContent = "color: rgb(135,206,250);";
  const title1 = " __  __  _                   _                 \n \\ \\/ / (_)   __ _   _ __   | |   __ _   _ __  \n  \\  /  | |  / _\` | | '_ \\  | |  / _\` | | '_ \\ \n  /  \\  | | | (_| | | | | | | | | (_| | | | | |\n /_/\\_\\ |_|  \\__,_| |_| |_| |_|  \\__,_| |_| |_|";
  const content = `\n主页: https://www.xiaolan.xin\nGithub: https://github.com/xiaolan111111`;
  console.info(`%c${title1} %c${content}`, styleTitle1, styleTitle2);
});

// 组件卸载前清理事件监听器
onBeforeUnmount(() => {
  window.removeEventListener("resize", getWidth);
});
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s;
  // 页面加载动画
  animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.5s;
  
  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    padding: 0 0.5vw;
    
    .all {
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    
    .more {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(20px);
      z-index: 2;
      // 淡入动画
      animation: fade 0.5s;
    }
    
    // 响应式设计：当屏幕宽度小于1200px时的内边距调整
    @media (max-width: 1200px) {
      padding: 0 2vw;
    }
  }
  
  .menu {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 84%;
    left: calc(50% - 28px);
    width: 56px;
    height: 34px;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    transition: transform 0.3s;
    // 淡入动画
    animation: fade 0.5s;
    
    &:active {
      transform: scale(0.95);
    }
    
    .i-icon {
      transform: translateY(2px);
    }
    
    // 在桌面端隐藏菜单按钮
    @media (min-width: 721px) {
      display: none;
    }
  }
  
  // 当屏幕高度小于720px时的适配
  @media (max-height: 720px) {
    overflow-y: auto;
    overflow-x: hidden;
    
    .container {
      height: 721px;
      
      .more {
        height: 721px;
        width: calc(100% + 6px);
      }
      
      // 不同宽度下的内边距调整
      @media (min-width: 391px) {
        padding-left: 0.5vw;
        padding-right: 0.25vw;
        
        @media (max-width: 1200px) {
          padding-left: 2.3vw;
          padding-right: 1.75vw;
        }
        
        @media (max-width: 1100px) {
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
        
        @media (max-width: 992px) {
          padding-left: 2.3vw;
          padding-right: 1.7vw;
        }
        
        @media (max-width: 900px) {
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
      }
    }
    
    .menu {
      top: 605.64px;
      left: 170.5px;
      
      @media (min-width: 281px) {
        left: calc(50% - 25px);
      }
    }
    
    .f-ter {
      top: 675px;
      
      @media (min-width: 391px) {
        padding-left: 6px;
      }
    }
  }
  
  // 当屏幕宽度小于280px时的适配
  @media (max-width: 280px) {
    overflow-x: auto;
    
    .container {
      width: 281px;
    }
    
    .menu {
      left: 167.5px;
    }
    
    .f-ter {
      width: 281px;
    }
    
    @media (min-height: 721px) {
      overflow-y: hidden;
    }
  }
}
</style>