<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站列表</span>
    </div>
    <!-- 网站列表 -->
    <Swiper
      v-if="siteLinks[0]"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
    >
      <SwiperSlide v-for="site in siteLinksList" :key="site">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="(item, index) in site" :span="8" :key="item">
            <div
              class="item cards"
              :style="index < 3 ? 'margin-bottom: 20px' : null"
              @click="jumpLink(item)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup>
// 导入图标工具组件
import { Icon } from "@vicons/utils";
// 可前往 https://www.xicons.org 自行挑选并在此处引入
import { Link, Blog, CompactDisc, Cloud, Compass, Book, Fire, LaptopCode } from "@vicons/fa"; // 注意使用正确的类别
// 导入状态管理
import { mainStore } from "@/store";
// 导入Swiper组件和模块
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
// 导入网站链接数据
import siteLinks from "@/assets/siteLinks.json";

// 获取全局状态
const store = mainStore();

// 计算网站链接分组 - 每6个为一组，用于分页显示
const siteLinksList = computed(() => {
  const result = [];
  for (let i = 0; i < siteLinks.length; i += 6) {
    const subArr = siteLinks.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

// 网站链接图标映射对象
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
};

// 链接跳转处理函数
const jumpLink = (data) => {
  // 特殊处理音乐链接，如果音乐功能已启用且存在全局函数则调用
  if (data.name === "音乐" && store.musicClick) {
    if (typeof $openList === "function") $openList();
  } else {
    // 普通链接在新窗口打开
    window.open(data.link, "_blank");
  }
};

// 组件挂载后打印网站链接数据到控制台
onMounted(() => {
  console.log(siteLinks);
});
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;
    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
  }
  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;
    .swiper-slide {
      height: 100%;
    }
    .swiper-pagination {
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 20px;
        height: 4px;
        margin: 0 4px;
        border-radius: 4px;
        opacity: 0.2;
        transition: opacity 0.3s;
        &.swiper-pagination-bullet-active {
          opacity: 1;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .link-all {
    height: 220px;
    .item {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;

      &:hover {
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
      }
      // 在中等屏幕设备上隐藏网站名称
      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }
      // 在小屏幕上减小项目高度
      @media (max-width: 720px) {
        height: 80px;
      }
      // 在极小屏幕上改为垂直布局
      @media (max-width: 460px) {
        flex-direction: column;
        .name {
          font-size: 1rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
    // 在小屏幕上减小整体高度
    @media (max-width: 720px) {
      height: 180px;
    }
  }
}
</style>