<template>
  <!-- 基本信息 -->
  <div class="message">
    <!-- Logo -->
    <div class="logo">
      <img class="logo-img" :src="siteLogo" alt="logo" />
      <div :class="{ name: true, 'text-hidden': true, long: siteUrl[0].length >= 6 }">
        <span class="bg">{{ siteUrl[0] }}</span>
        <span class="sm">.{{ siteUrl[1] }}</span>
      </div>
    </div>
    <!-- 简介 -->
    <div class="description cards" @click="changeBox">
      <div class="content">
        <Icon size="16">
          <QuoteLeft />
        </Icon>
        <Transition name="fade" mode="out-in">
          <div :key="descriptionText.hello + descriptionText.text" class="text">
            <p>{{ descriptionText.hello }}</p>
            <p>{{ descriptionText.text }}</p>
          </div>
        </Transition>
        <Icon size="16">
          <QuoteRight />
        </Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入图标组件
import { Icon } from "@vicons/utils";
import { QuoteLeft, QuoteRight } from "@vicons/fa";
import { Error } from "@icon-park/vue-next";
// 引入状态管理
import { mainStore } from "@/store";
const store = mainStore();

// 获取主页站点logo地址
const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO;

// 站点链接处理
const siteUrl = computed(() => {
  // 从环境变量获取站点URL
  const url = import.meta.env.VITE_SITE_URL;
  // 如果未设置URL，则使用默认值
  if (!url) return "imsyy.top".split(".");
  // 判断是否包含协议前缀
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // 移除协议前缀
    const urlFormat = url.replace(/^(https?:\/\/)/, "");
    return urlFormat.split(".");
  }
  // 直接分割URL
  return url.split(".");
});

// 简介区域文字内容
const descriptionText = reactive({
  hello: import.meta.env.VITE_DESC_HELLO,      // 问候语
  text: import.meta.env.VITE_DESC_TEXT,        // 描述文本
});

// 切换右侧功能区显示状态
const changeBox = () => {
  // 判断页面宽度是否足够开启盒子
  if (store.getInnerWidth >= 721) {
    // 切换盒子打开状态
    store.boxOpenState = !store.boxOpenState;
  } else {
    // 宽度不足时显示提示信息
    ElMessage({
      message: "当前页面宽度不足以开启盒子",
      grouping: true,
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
  }
};

// 监听盒子开关状态变化
watch(
  () => store.boxOpenState,
  (value) => {
    // 根据盒子开关状态切换显示的文本内容
    if (value) {
      // 盒子打开时显示其他文本
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO_OTHER;
      descriptionText.text = import.meta.env.VITE_DESC_TEXT_OTHER;
    } else {
      // 盒子关闭时显示默认文本
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO;
      descriptionText.text = import.meta.env.VITE_DESC_TEXT;
    }
  },
);
</script>

<style lang="scss" scoped>
.message {
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: fade 0.5s;
    max-width: 460px;
    .logo-img {
      border-radius: 50%;
      width: 120px;
    }
    .name {
      width: 100%;
      padding-left: 22px;
      transform: translateY(-8px);
      font-family: "Pacifico-Regular";

      .bg {
        font-size: 5rem;
      }

      .sm {
        margin-left: 6px;
        font-size: 2rem;
        @media (min-width: 721px) and (max-width: 789px) {
          display: none;
        }
      }
    }
    @media (max-width: 768px) {
      .logo-img {
        width: 100px;
      }
      .name {
        height: 128px;
        .bg {
          font-size: 4.5rem;
        }
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
    }
  }

  .description {
    padding: 1rem;
    margin-top: 3.5rem;
    max-width: 460px;
    animation: fade 0.5s;

    .content {
      display: flex;
      justify-content: space-between;

      .text {
        margin: 0.75rem 1rem;
        line-height: 2rem;
        margin-right: auto;
        transition: opacity 0.2s;

        p {
          &:nth-of-type(1) {
            font-family: "Pacifico-Regular";
          }
        }
      }

      .xicon:nth-of-type(2) {
        align-self: flex-end;
      }
    }
    @media (max-width: 720px) {
      max-width: 100%;
      pointer-events: none;
    }
  }
  @media (max-width: 502px) {
    .logo {
      flex-direction: column;
      .logo-img {
        display: none;
      }
      .name {
        margin-left: 0;
        height: auto;
        transform: none;
        text-align: center;
        .bg {
          font-size: 3.5rem;
        }
        .sm {
          font-size: 1.4rem;
        }
      }
    }
    .description {
      margin-top: 2.5rem;
    }
  }
  @media (max-width: 320px) {
    .logo {
      flex-direction: column;
      .logo-img {
        display: none;
      }
      .name {
        margin-left: 0;
        height: auto;
        transform: none;
        text-align: center;
        .bg {
          font-size: 3.0rem;
        }
        .sm {
          font-size: 1.4rem;
        }
      }
    }
    .description {
      margin-top: 1.5rem;
    }
  }
}
</style>