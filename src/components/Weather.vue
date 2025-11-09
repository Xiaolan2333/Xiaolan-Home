<template>
  <!-- 天气信息展示组件 -->
  <div class="weather" v-if="weatherData.city && weatherData.data.type">
    <!-- 城市名称 -->
    <span>{{ weatherData.city }}&nbsp;</span>
    <!-- 天气类型 -->
    <span>{{ weatherData.data.type }}&nbsp;</span>
    <!-- 最低温度 -->
    <span>{{ weatherData.data.low }}°C</span>
    <!-- 风向（在小屏幕上隐藏） -->
    <span class="sm-hidden">
      &nbsp;{{ weatherData.data.fengxiang }}&nbsp;
    </span>
    <!-- 风力（在小屏幕上隐藏） -->
    <span class="sm-hidden">{{ weatherData.data.fengli }}</span>
  </div>
  <!-- 天气数据获取失败时的提示 -->
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { h } from "vue";
import { Error } from "@icon-park/vue-next";
import { ElMessage } from "element-plus";
import { getAdcode, getWeather, getOtherWeather } from "@/api";

// 高德开发者 Key，从环境变量中获取
const mainKey = import.meta.env.VITE_WEATHER_KEY;

// 天气数据响应式对象
const weatherData = reactive({
  city: null, // 城市
  data: {
    type: null, // 天气现象
    low: null, // 最低气温
    high: null, // 最高气温
    fengxiang: null, // 风向描述
    fengli: null, // 风力级别
  },
});

/**
 * 获取天气数据
 * 优先使用高德地图API，如果失败则使用韩小韩API作为备选方案
 */
const getWeatherData = async () => {
  try {
    // 检查是否配置了高德地图的key
    if (mainKey) {
      // 使用高德地图 API 获取行政区域编码
      const adCode = await getAdcode(mainKey);
      // 检查接口返回是否成功
      if (adCode.infocode !== "10000") {
        throw "地区查询失败";
      }
      // 设置城市名称
      weatherData.city = adCode.city;
      // 根据区域编码获取天气信息
      const result = await getWeather(mainKey, adCode.adcode);
      // 更新天气数据
      weatherData.data = {
        type: result.lives[0].weather,
        low: result.lives[0].temperature,
        high: result.lives[0].temperature,
        fengxiang: result.lives[0].winddirection,
        fengli: result.lives[0].windpower,
      };
    } else {
      // 如果没有配置高德地图key，则抛出错误
      throw "未配置高德Key";
    }
  } catch (error) {
    try {
      // 使用韩小韩 API 作为兜底方案
      console.log("尝试使用韩小韩天气接口");
      const result = await getOtherWeather();
      // 检查接口是否返回成功
      if (result.success) {
        // 设置城市名称
        weatherData.city = result.city;
        // 更新天气数据，并去除温度中的℃符号
        weatherData.data = {
          type: result.data.type,
          low: result.data.low.replace('℃', ''),
          high: result.data.high.replace('℃', ''),
          fengxiang: result.data.fengxiang,
          fengli: result.data.fengli,
        };
      } else {
        // 韩小韩API返回失败状态
        console.warn("韩小韩天气接口返回失败状态");
        throw "韩小韩天气接口失败";
      }
    } catch (hanError) {
      // 所有天气接口都失败，重置天气数据并显示错误信息
      console.error("所有天气接口均失败:", hanError);
      weatherData.city = null;
      weatherData.data = {
        type: null,
        low: null,
        high: null,
        fengxiang: null,
        fengli: null,
      };
      onError("天气信息获取失败");
    }
  }
};

/**
 * 显示错误信息
 * @param {string} message - 错误信息内容
 */
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

// 组件挂载后获取天气数据
onMounted(() => {
  // 调用获取天气
  getWeatherData();
});
</script>