<template>
  <div class="time-capsule">
    <!-- 标题区域，包含沙漏图标和文字 -->
    <div class="title">
      <hourglass-full theme="two-tone" size="24" :fill="['#efefef', '#00000020']" />
      <span>时光胶囊</span>
    </div>
    <!-- 时间进度展示区域 -->
    <div v-if="timeData" class="all-capsule">
      <!-- 遍历展示各项时间进度 -->
      <div v-for="(item, tag, index) in timeData" :key="index" class="capsule-item">
        <div class="item-title">
          <!-- 已度过时间显示 -->
          <span class="percentage">
            {{ item.name }}已度过
            <strong>{{ item.passed }}</strong>
            {{ tag === "day" ? "小时" : "天" }}
          </span>
          <!-- 剩余时间显示 -->
          <span class="remaining">
            剩余&nbsp;{{ item.remaining }}&nbsp;{{ tag === "day" ? "小时" : "天" }}
          </span>
        </div>
        <!-- 进度条组件，显示时间进度百分比 -->
        <el-progress :text-inside="true" :stroke-width="20" :percentage="parseFloat(item.percentage)" />
      </div>
      <!-- 建站日期信息展示 -->
      <div v-if="store.siteStartShow" class="capsule-item start">
        <div class="item-title">{{ startDateText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入沙漏图标组件
import { HourglassFull } from "@icon-park/vue-next";
// 引入时间计算工具函数
import { getTimeCapsule, siteDateStatistics } from "@/utils/getTime.js";
// 引入状态管理store
import { mainStore } from "@/store";
// 获取store实例
const store = mainStore();

// 初始化进度条数据，通过getTimeCapsule函数获取
const timeData = ref(getTimeCapsule());
// 从环境变量中获取建站日期
const startDate = ref(import.meta.env.VITE_SITE_START);
// 建站日期文本内容
const startDateText = ref(null);
// 定时器引用，用于更新时间数据
const timeInterval = ref(null);

// 组件挂载后执行，设置定时更新时间数据
onMounted(() => {
  timeInterval.value = setInterval(() => {
    // 每秒更新一次时间进度数据
    timeData.value = getTimeCapsule();
    // 如果设置了建站日期，则计算并更新建站日期相关信息
    if (startDate.value) startDateText.value = siteDateStatistics(new Date(startDate.value));
  }, 1000);
});

// 组件卸载前清除定时器，避免内存泄漏
onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.time-capsule {
  width: 100%;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.2rem 0 1.5rem;
    font-size: 1.1rem;
    .i-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 6px;
    }
  }
  .all-capsule {
    .capsule-item {
      margin-bottom: 1rem;
      .item-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 1rem 0rem 0.5rem 0rem;
        font-size: 0.95rem;
        .remaining {
          opacity: 0.6;
          font-size: 0.85rem;
          font-style: oblique;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
      // 建站日期特殊样式
      &.start {
        .item-title {
          justify-content: center;
          opacity: 0.8;
          font-size: 0.85rem;
        }
      }
    }
  }
}
</style>