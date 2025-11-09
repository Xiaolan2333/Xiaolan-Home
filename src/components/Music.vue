<template>
  <!-- 音乐控制面板 -->
  <div
    class="music"
    @mouseenter="volumeShow = true"
    @mouseleave="volumeShow = false"
    v-show="store.musicOpenState"
  >
    <div class="btns">
      <span @click="openMusicList()">音乐列表</span>
      <span @click="store.musicOpenState = false">回到一言</span>
    </div>
    <div class="control">
      <go-start theme="filled" size="30" fill="#efefef" @click="changeMusicIndex(0)" />
      <Transition name="fade" mode="out-in">
        <div :key="store.playerState" class="state" @click="changePlayState">
          <play-one theme="filled" size="50" fill="#efefef" v-show="!store.playerState" />
          <pause theme="filled" size="50" fill="#efefef" v-show="store.playerState" />
        </div>
      </Transition>
      <go-end theme="filled" size="30" fill="#efefef" @click="changeMusicIndex(1)" />
    </div>
    <div class="menu">
      <div class="name" v-show="!volumeShow">
        <span>{{
          store.getPlayerData.name
            ? store.getPlayerData.name + " - " + store.getPlayerData.artist
            : "未播放音乐"
        }}</span>
      </div>
      <div class="volume" v-show="volumeShow">
        <div class="icon">
          <volume-mute theme="filled" size="24" fill="#efefef" v-if="volumeNum == 0" />
          <volume-small
            theme="filled"
            size="24"
            fill="#efefef"
            v-else-if="volumeNum > 0 && volumeNum < 0.7"
          />
          <volume-notice theme="filled" size="24" fill="#efefef" v-else />
        </div>
        <el-slider v-model="volumeNum" :show-tooltip="false" :min="0" :max="1" :step="0.01" />
      </div>
    </div>
  </div>
  <!-- 音乐列表弹窗 -->
  <Transition name="fade" mode="out-in">
    <div class="music-list" v-show="musicListShow" @click="closeMusicList()">
      <Transition name="zoom">
        <div class="list" v-show="musicListShow" @click.stop>
          <close-one
            class="close"
            theme="filled"
            size="28"
            fill="#ffffff60"
            @click="closeMusicList()"
          />
          <Player
            ref="playerRef"
            :songServer="playerData.server"
            :songType="playerData.type"
            :songId="playerData.id"
            :volume="volumeNum"
          />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
// 导入图标组件
import {
  GoStart,
  PlayOne,
  Pause,
  GoEnd,
  CloseOne,
  VolumeMute,
  VolumeSmall,
  VolumeNotice,
} from "@icon-park/vue-next";
// 导入音乐播放器组件
import Player from "@/components/Player.vue";
// 导入状态管理
import { mainStore } from "@/store";
const store = mainStore();

// 音量条显示控制
const volumeShow = ref(false);
// 音量数值，从store中获取或默认为0.7
const volumeNum = ref(store.musicVolume ? store.musicVolume : 0.7);

// 音乐列表弹窗显示控制
const musicListShow = ref(false);
// Player组件引用
const playerRef = ref(null);
// 播放器配置数据
const playerData = reactive({
  // 音乐服务器地址
  server: import.meta.env.VITE_SONG_SERVER,
  // 音乐类型
  type: import.meta.env.VITE_SONG_TYPE,
  // 音乐ID
  id: import.meta.env.VITE_SONG_ID,
});

// 开启播放列表
const openMusicList = () => {
  musicListShow.value = true;
  playerRef.value.toggleList();
};

// 关闭播放列表
const closeMusicList = () => {
  musicListShow.value = false;
  playerRef.value.toggleList();
};

// 切换音乐播放状态
const changePlayState = () => {
  playerRef.value.playToggle();
};

// 切换音乐曲目
// type: 0-上一曲, 1-下一曲
const changeMusicIndex = (type) => {
  playerRef.value.changeSong(type);
};

// 组件挂载后执行
onMounted(() => {
  // 监听键盘事件，空格键控制播放/暂停
  window.addEventListener("keydown", (e) => {
    // 如果音乐未准备就绪则返回
    if (!store.musicIsOk) {
      return;
    }
    // 检测是否按下空格键
    if (e.code == "Space") {
      changePlayState();
    }
  });
  // 将打开音乐列表方法挂载到window对象上
  window.$openList = openMusicList;
});

// 监听音量变化并同步到store和播放器
watch(
  () => volumeNum.value,
  (value) => {
    store.musicVolume = value;
    playerRef.value.changeVolume(store.musicVolume);
  },
);
</script>

<style lang="scss" scoped>
.music {
  width: 100%;
  height: 100%;
  background: #00000040;
  backdrop-filter: blur(10px);
  border-radius: 6px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  animation: fade 0.5s;
  .btns {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    span {
      background: #ffffff26;
      padding: 2px 8px;
      border-radius: 6px;
      margin: 0px 6px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      &:hover {
        background: #ffffff4d;
      }
    }
  }
  .control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    .state {
      transition: opacity 0.1s;
      .i-icon {
        width: 50px;
        height: 50px;
        display: block;
      }
    }
    .i-icon {
      width: 36px;
      height: 36px;
      display: flex;
      border-radius: 6px;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transform: scale(1);
      &:hover {
        background: #ffffff33;
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
  .menu {
    height: 26px;
    width: 100%;
    line-height: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .name {
      width: 100%;
      text-align: center;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      animation: fade 0.3s;
    }
    .volume {
      width: 100%;
      padding: 0 12px;
      display: flex;
      align-items: center;
      flex-direction: row;
      animation: fade 0.3s;
      .icon {
        margin-right: 12px;
        span {
          width: 24px;
          height: 24px;
          display: block;
        }
      }
      :deep(*) {
        transition: none;
      }
      :deep(.el-slider__button) {
        transition: 0.3s;
      }
      .el-slider {
        margin-right: 12px;
        --el-slider-main-bg-color: #efefef;
        --el-slider-runway-bg-color: #ffffff40;
        --el-slider-button-size: 16px;
      }
    }
  }
}
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  backdrop-filter: blur(20px);
  z-index: 1;
  .list {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: calc(50% - 300px);
    left: calc(50% - 320px);
    width: 640px;
    height: 600px;
    background-color: #ffffff66;
    border-radius: 6px;
    z-index: 999;
    @media (max-width: 720px) {
      left: calc(50% - 45%);
      width: 90%;
    }
    .close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      display: block;
      &:hover {
        transform: scale(1.2);
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 弹窗动画
.zoom-enter-active {
  animation: zoom 0.4s ease-in-out;
}
.zoom-leave-active {
  animation: zoom 0.3s ease-in-out reverse;
}
@keyframes zoom {
  0% {
    opacity: 0;
    transform: scale(0) translateY(-600px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>