<template>
  <!-- 页面加载动画容器 -->
  <div id="loader-wrapper" :class="store.imgLoadStatus ? 'loaded' : null">
    <!-- 加载动画主体 -->
    <div class="loader">
      <!-- 旋转的圆环动画 -->
      <div class="loader-circle" />
      <!-- 加载文字信息 -->
      <div class="loader-text">
        <span class="name">
          {{ siteName }}
        </span>
        <span class="tip"> 加载中 </span>
      </div>
    </div>
    <!-- 左侧遮罩层 -->
    <div class="loader-section section-left" />
    <!-- 右侧遮罩层 -->
    <div class="loader-section section-right" />
  </div>
</template>

<script setup>
// 导入状态管理
import { mainStore } from "@/store";

// 获取全局状态
const store = mainStore();

// 配置网站名称
const siteName = import.meta.env.VITE_SITE_NAME;
</script>

<style lang="scss" scoped>
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;
  
  // 加载动画主体样式
  .loader {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    // 旋转圆环样式
    .loader-circle {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: #fff;
      animation: spin 1.8s linear infinite;
      z-index: 2;

      // 内层旋转圆环
      &:before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #a4a4a4;
        animation: spin-reverse 0.6s linear infinite;
      }

      // 最内层旋转圆环
      &:after {
        content: "";
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #d3d3d3;
        animation: spin 1s linear infinite;
      }
    }
    
    // 加载文字样式
    .loader-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      z-index: 2;
      margin-top: 40px;
      font-size: 24px;
      
      // 提示文字样式
      .tip {
        margin-top: 6px;
        font-size: 18px;
        opacity: 0.6;
      }
    }
  }
  
  // 遮罩层样式
  .loader-section {
    position: fixed;
    top: 0;
    width: 51%;
    height: 100%;
    background: #333;
    z-index: 1;
    
    // 左侧遮罩
    &.section-left {
      left: 0;
    }
    
    // 右侧遮罩
    &.section-right {
      right: 0;
    }
  }
  
  // 加载完成时的样式
  &.loaded {
    visibility: hidden;
    transform: translateY(-100%);
    transition:
      transform 0.3s 1s ease-out,
      visibility 0.3s 1s ease-out;
      
    // 加载完成时隐藏加载动画
    .loader {
      .loader-circle,
      .loader-text {
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
    }
    
    // 加载完成时移动遮罩层
    .loader-section {
      &.section-left {
        transform: translateX(-100%);
        transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      &.section-right {
        transform: translateX(100%);
        transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }
}

// 顺时针旋转动画
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 逆时针旋转动画
@keyframes spin-reverse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>