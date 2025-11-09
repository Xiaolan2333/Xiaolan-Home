<template>
  <div class="setting">
    <!-- 设置项折叠面板，支持手风琴模式（一次只展开一个面板） -->
    <el-collapse class="collapse" v-model="activeName" accordion>
      <!-- 个性壁纸设置面板 -->
      <el-collapse-item title="个性壁纸" name="1">
        <div class="bg-set">
          <!-- 壁纸类型选择器 -->
          <el-radio-group v-model="coverType" text-color="#ffffff" @change="radioChange">
            <el-radio value="0" size="large" border>默认壁纸</el-radio>
            <el-radio value="1" size="large" border>每日一图</el-radio>
            <el-radio value="2" size="large" border>随机风景</el-radio>
            <el-radio value="3" size="large" border>随机动漫</el-radio>
          </el-radio-group>
        </div>
      </el-collapse-item>
      
      <!-- 个性化调整设置面板 -->
      <el-collapse-item title="个性化调整" name="2">
        <!-- 建站日期显示开关 -->
        <div class="item">
          <span class="text">建站日期显示</span>
          <el-switch
            v-model="siteStartShow"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
        
        <!-- 音乐点击是否打开面板开关 -->
        <div class="item">
          <span class="text">音乐点击是否打开面板</span>
          <el-switch
            v-model="musicClick"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
        
        <!-- 底栏歌词显示开关 -->
        <div class="item">
          <span class="text">底栏歌词显示</span>
          <el-switch
            v-model="playerLrcShow"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
        
        <!-- 底栏背景模糊开关 -->
        <div class="item">
          <span class="text">底栏背景模糊</span>
          <el-switch
            v-model="footerBlur"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
      </el-collapse-item>
      
      <!-- 播放器配置面板 -->
      <el-collapse-item title="播放器配置" name="3">
        <!-- 自动播放开关 -->
        <div class="item">
          <span class="text">自动播放</span>
          <el-switch
            v-model="playerAutoplay"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
        
        <!-- 随机播放开关 -->
        <div class="item">
          <span class="text">随机播放</span>
          <el-switch
            v-model="playerOrder"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
            active-value="random"
            inactive-value="list"
          />
        </div>
        
        <!-- 循环模式选择器 -->
        <div class="item">
          <span class="text">循环模式</span>
          <el-radio-group v-model="playerLoop" size="small" text-color="#FFFFFF">
            <el-radio value="all" border>列表</el-radio>
            <el-radio value="one" border>单曲</el-radio>
            <el-radio value="none" border>不循环</el-radio>
          </el-radio-group>
        </div>
      </el-collapse-item>
      
      <!-- 其他设置面板 -->
      <el-collapse-item title="其他设置" name="4">
        <div>设置内容待增加</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
// 导入图标组件
import { CheckSmall, CloseSmall, SuccessPicture } from "@icon-park/vue-next";
// 导入状态管理store
import { mainStore } from "@/store";
// 导入storeToRefs工具函数，用于保持响应性
import { storeToRefs } from "pinia";

// 获取主存储实例
const store = mainStore();

// 从store中解构出需要的响应式数据
const {
  coverType,          // 壁纸类型
  siteStartShow,      // 建站日期显示控制
  musicClick,         // 音乐点击是否打开面板
  playerLrcShow,      // 底栏歌词显示控制
  footerBlur,         // 底栏背景模糊控制
  playerAutoplay,     // 播放器自动播放控制
  playerOrder,        // 播放器播放顺序控制
  playerLoop,         // 播放器循环模式控制
} = storeToRefs(store);

// 默认展开的面板名称（个性壁纸面板）
const activeName = ref("1");

/**
 * 壁纸切换事件处理函数
 * 当用户更改壁纸类型时触发
 */
const radioChange = () => {
  ElMessage({
    message: "壁纸更换成功",
    icon: h(SuccessPicture, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
};
</script>

<style lang="scss" scoped>
.setting {
  .collapse {
    border-radius: 8px;
    --el-collapse-content-bg-color: #ffffff10; // 设置折叠面板内容区域背景色
    border-color: transparent; // 边框透明
    overflow: hidden; // 隐藏溢出内容

    // 折叠面板头部样式
    :deep(.el-collapse-item__header) {
      background-color: #ffffff30; // 背景色
      color: #fff; // 文字颜色
      font-size: 15px; // 字体大小
      padding-left: 18px; // 左内边距
      border-color: transparent; // 边框透明
    }

    // 折叠面板内容区域样式
    :deep(.el-collapse-item__wrap) {
      border-color: transparent; // 边框透明

      .el-collapse-item__content {
        padding: 20px; // 内边距
        
        // 设置项条目样式
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          font-size: 14px;
          
          // 开关组件样式
          .el-switch__core {
            border-color: transparent;
            background-color: #ffffff30;
          }
          
          // 单选按钮组样式
          .el-radio-group {
            .el-radio {
              margin: 2px 10px 2px 0;
              border-radius: 5px;

              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
        
        // 单选按钮组样式
        .el-radio-group {
          justify-content: space-between;

          .el-radio {
            margin: 10px 16px;
            background: #ffffff26;
            border: 2px solid transparent;
            border-radius: 8px;

            .el-radio__label {
              color: #fff;
            }

            .el-radio__inner {
              background: #ffffff06 !important;
              border: 2px solid #eeeeee !important;
            }

            &.is-checked {
              background: #ffffff06 !important;
              border: 2px solid #eeeeee !important;
            }

            .is-checked {
              .el-radio__inner {
                background-color: #ffffff30 !important;
                border-color: #fff !important;
              }

              & + .el-radio__label {
                color: #fff !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>