<template>
  <!-- 社交链接组件 -->
  <div class="social">
    <div class="link">
      <!-- 遍历渲染社交链接图标 -->
      <a
        v-for="item in socialLinks"
        :key="item.name"
        :href="item.url"
        target="_blank"
        @mouseenter="socialTip = item.tip"
        @mouseleave="socialTip = '通过这里联系我吧'"
      >
        <img class="icon" :src="item.icon" height="24" />
      </a>
    </div>
    <!-- 显示当前悬停的社交链接提示信息 -->
    <span class="tip">{{ socialTip }}</span>
  </div>
</template>

<script setup>
// 导入社交链接数据
import socialLinks from "@/assets/socialLinks.json";

// 社交链接提示信息响应式数据，默认显示提示语
const socialTip = ref("通过这里联系我吧");
</script>

<style lang="scss" scoped>
.social {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 460px;
  width: 100%;
  height: 42px;
  background-color: transparent;
  border-radius: 6px;
  backdrop-filter: blur(0);
  animation: fade 0.5s;
  transition:
    background-color 0.3s,
    backdrop-filter 0.3s;
    
  // 移动端样式适配
  @media (max-width: 840px) {
    max-width: 100%;
    justify-content: center;
    .link {
      justify-content: space-evenly !important;
      width: 90%;
    }
    .tip {
      display: none !important;
    }
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    
    a {
      display: inherit;
      
      .icon {
        margin: 0 12px;
        transition: transform 0.3s;
        
        // 图标悬停效果
        &:hover {
          transform: scale(1.1);
        }
        
        // 图标点击效果
        &:active {
          transform: scale(1);
        }
      }
    }
  }
  
  .tip {
    display: none;
    margin-right: 12px;
    animation: fade 0.5s;
  }
  
  // 桌面端悬停效果
  @media (min-width: 768px) {
    &:hover {
      background-color: #00000040;
      backdrop-filter: blur(5px);
      .tip {
        display: block;
      }
    }
  }
}
</style>