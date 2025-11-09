<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <!-- 底部信息显示区域 -->
      <div v-if="!store.playerState || !store.playerLrcShow" class="power">
        <span>
          <!-- 如果建站年份小于当前年份，则显示完整版权时间范围 -->
          <span :class="startYear < fullYear ? 'c-hidden' : 'hidden'">Copyright&nbsp;</span>
          &copy;
          <span v-if="startYear < fullYear"
            class="site-start">
            {{ startYear }}
            -
          </span>
          {{ fullYear }}
          <a :href="siteUrl">{{ siteAuthor }}</a>
        </span>
        <!-- 系统信息，不要修改 -->
        <span class="hidden">
          &amp;&nbsp;Made&nbsp;by
          <a :href="config.github" target="_blank">
            {{ config.author }}
          </a>
        </span>
        <!-- 站点备案信息 -->
        <span>
          <a v-if="siteIcp" href="https://beian.miit.gov.cn" target="_blank">
            {{ siteIcp }}
          </a>
        </span>
      </div>
      <!-- 音乐播放器歌词显示区域 -->
      <div v-else class="lrc">
        <Transition name="fade" mode="out-in">
          <div class="lrc-all" :key="store.getPlayerLrc">
            <music-one theme="filled" size="18" fill="#efefef" />
            <span class="lrc-text text-hidden" v-html="store.getPlayerLrc" />
            <music-one theme="filled" size="18" fill="#efefef" />
          </div>
        </Transition>
      </div>
    </Transition>
  </footer>
</template>

<script setup>
// 导入图标组件和状态管理
import { MusicOne } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import config from "@/../package.json";

// 获取全局状态管理实例
const store = mainStore();
// 获取当前年份
const fullYear = new Date().getFullYear();

// 加载配置数据
// 站点开始年份（从环境变量获取）
const startYear = ref(
  import.meta.env.VITE_SITE_START?.length >= 4 ? 
  import.meta.env.VITE_SITE_START.substring(0, 4) : null
);
// 站点备案信息（从环境变量获取）
const siteIcp = ref(import.meta.env.VITE_SITE_ICP);
// 站点作者信息（从环境变量获取）
const siteAuthor = ref(import.meta.env.VITE_SITE_AUTHOR);
// 站点链接（从环境变量获取，并处理协议前缀）
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_FOOTER_URL;
  if (!url) return "www.xiaolan.xin";
  // 判断协议前缀，如果不存在则自动添加
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "//" + url;
  }
  return url;
});
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 46px;
  line-height: 46px;
  text-align: center;
  z-index: 0;
  font-size: 14px;
  // 文字不换行
  word-break: keep-all;
  white-space: nowrap;
  .power {
    animation: fade 0.3s;
  }
  .lrc {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .lrc-all {
      width: 98%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .lrc-text {
        margin: 0 8px;
      }
      .i-icon {
        width: 18px;
        height: 18px;
        display: inherit;
      }
    }
  }
  // 模糊效果样式
  &.blur {
    backdrop-filter: blur(10px);
    background: rgb(0 0 0 / 25%);
    font-size: 16px;
  }
  // 淡入淡出动画
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease-in-out;
  }
    /* 响应式设计 */
  @media (max-width: 720px) {
    font-size: 0.9rem;  /* 中屏幕字体调整 */
    &.blur {
      font-size: 0.9rem;
    }
  }
  /* 超小屏幕隐藏开发者信息 */
  @media (max-width: 480px) {
    .hidden {
      display: none;
    }
  }
}
</style>