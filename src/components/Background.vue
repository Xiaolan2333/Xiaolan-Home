<template>
  <!-- 背景封面容器，根据backgroundShow状态切换样式 -->
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <!-- 背景图片，根据加载状态显示 -->
    <img
      v-show="store.imgLoadStatus"
      :src="bgUrl"
      class="bg"
      alt="cover"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />
    <!-- 灰色遮罩层，根据backgroundShow状态控制显示 -->
    <div :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
    <!-- 壁纸下载链接过渡动画 -->
    <Transition name="fade" mode="out-in">
      <!-- 当背景展示且类型不为3时显示下载链接 -->
      <a
        v-if="store.backgroundShow && store.coverType != '3'"
        class="down"
        :href="bgUrl"
        target="_blank"
      >
        下载壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup>
// 导入主存储
import { mainStore } from "@/store";
// 导入错误图标
import { Error } from "@icon-park/vue-next";

// 获取主存储实例
const store = mainStore();
// 壁纸URL响应式变量
const bgUrl = ref(null);
// 图片超时处理引用
const imgTimeout = ref(null);
// 定义事件发射器
const emit = defineEmits(["loadComplete"]);

// 壁纸随机数
// 请依据文件夹内的图片个数修改 Math.random() 后面的第一个数字
const bgRandom = Math.floor(Math.random() * 1 + 1);

// 更换壁纸链接方法
// 根据类型选择不同的壁纸源
const changeBg = (type) => {
  if (type == 0) {
    // 本地壁纸
    bgUrl.value = `/images/background${bgRandom}.jpg`;
  } else if (type == 1) {
    // 必应每日壁纸
    bgUrl.value = "https://api.dujin.org/bing/1920.php";
  } else if (type == 2) {
    // 风景壁纸API
    bgUrl.value = "https://api.vvhan.com/api/wallpaper/views";
  } else if (type == 3) {
    // 动漫壁纸API
    bgUrl.value = "https://api.vvhan.com/api/wallpaper/acg";
  }
};

// 图片加载完成处理函数
const imgLoadComplete = () => {
  // 设置随机延迟时间，模拟加载效果
  imgTimeout.value = setTimeout(
    () => {
      store.setImgLoadStatus(true);
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300,
  );
};

// 图片动画完成处理函数
const imgAnimationEnd = () => {
  console.log("壁纸加载且动画完成");
  // 发射加载完成事件
  emit("loadComplete");
};

// 图片加载错误处理函数
const imgLoadError = () => {
  console.error("壁纸加载失败：", bgUrl.value);
  // 显示错误提示信息
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认",
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  // 切换回默认本地壁纸
  bgUrl.value = `/images/background${bgRandom}.jpg`;
};

// 监听壁纸类型变化
watch(
  () => store.coverType,
  (value) => {
    changeBg(value);
  },
);

// 组件挂载后执行
onMounted(() => {
  // 根据存储中的壁纸类型加载壁纸
  changeBg(store.coverType);
});

// 组件卸载前清理
onBeforeUnmount(() => {
  // 清除图片超时处理
  clearTimeout(imgTimeout.value);
});
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;

  // 展示状态下的层级提升
  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    // 模糊和亮度滤镜效果
    filter: blur(20px) brightness(0.3);
    transition:
      filter 0.3s,
      transform 0.3s;
    // 淡入模糊动画
    animation: fade-blur-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.45s;
  }
  
  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // 径向渐变背景遮罩
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);

    transition: 1.5s;
    // 隐藏状态下的透明度
    &.hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }
  
  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    // 悬停效果
    &:hover {
      transform: scale(1.05);
      background-color: #00000060;
    }
    
    // 按下效果
    &:active {
      transform: scale(1);
    }
  }
}
</style>