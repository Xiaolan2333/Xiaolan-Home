<template>
  <!-- 音乐播放器组件 -->
  <APlayer
    v-if="playList[0]"
    ref="player"
    :audio="playList"
    :autoplay="store.playerAutoplay"
    :theme="theme"
    :autoSwitch="false"
    :loop="store.playerLoop"
    :order="store.playerOrder"
    :volume="volume"
    :showLrc="true"
    :listFolded="listFolded"
    :listMaxHeight="listMaxHeight"
    :noticeSwitch="false"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeUp"
    @error="loadMusicError"
  />
</template>

<script setup>
// 导入图标组件
import { MusicOne, PlayWrong } from "@icon-park/vue-next";
// 导入获取播放列表的API
import { getPlayerList } from "@/api";
// 导入主存储
import { mainStore } from "@/store";
// 导入APlayer音乐播放器组件
import APlayer from "@worstone/vue-aplayer";

// 获取主存储实例
const store = mainStore();

// 获取播放器 DOM 引用
const player = ref(null);

// 歌曲播放列表
const playList = ref([]);

// 当前播放歌曲索引
const playIndex = ref(0);

// 定义组件属性
const props = defineProps({
  // 主题色
  theme: {
    type: String,
    default: "#efefef",
  },
  // 默认音量 (0-1之间)
  volume: {
    type: Number,
    default: 0.7,
    validator: (value) => {
      return value >= 0 && value <= 1;
    },
  },
  // 歌曲服务器 ( netease-网易云, tencent-qq音乐 )
  songServer: {
    type: String,
    default: "netease", //'netease' | 'tencent'
  },
  // 播放类型 ( song-歌曲, playlist-播放列表, album-专辑, search-搜索, artist-艺术家 )
  songType: {
    type: String,
    default: "playlist",
  },
  // 歌曲ID (根据songType不同，可以是歌曲ID、播放列表ID等)
  songId: {
    type: String,
    default: "7452421335",
  },
  // 列表是否默认折叠
  listFolded: {
    type: Boolean,
    default: false,
  },
  // 列表最大高度
  listMaxHeight: {
    type: Number,
    default: 420,
  },
});

// 计算属性：列表高度样式值
const listHeight = computed(() => {
  return props.listMaxHeight + "px";
});

// 组件挂载后初始化播放器
onMounted(() => {
  nextTick(() => {
    try {
      // 调用API获取播放列表
      getPlayerList(props.songServer, props.songType, props.songId).then((res) => {
        console.log(res);
        // 设置音乐加载状态为成功
        store.musicIsOk = true;
        // 设置播放列表
        playList.value = res;
        console.log("音乐加载完成");
        console.log(playList.value);
        console.log(playIndex.value, playList.value.length, props.volume);
      });
    } catch (err) {
      // 处理音乐加载错误
      console.error(err);
      store.musicIsOk = false;
      ElMessage({
        message: "播放器加载失败",
        grouping: true,
        icon: h(PlayWrong, {
          theme: "filled",
          fill: "#efefef",
        }),
      });
    }
  });
});

// 播放事件处理函数
const onPlay = () => {
  console.log("播放");
  // 更新当前播放歌曲索引
  playIndex.value = player.value.aplayer.index;
  // 更新播放状态到存储中 (paused为false表示正在播放)
  store.setPlayerState(player.value.audioRef.paused);
  // 存储当前播放歌曲的信息
  store.setPlayerData(playList.value[playIndex.value].name, playList.value[playIndex.value].artist);
  // 显示当前播放歌曲的通知
  ElMessage({
    message: store.getPlayerData.name + " - " + store.getPlayerData.artist,
    grouping: true,
    icon: h(MusicOne, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
};

// 暂停事件处理函数
const onPause = () => {
  // 更新播放状态到存储中 (paused为true表示已暂停)
  store.setPlayerState(player.value.audioRef.paused);
};

// 音频时间更新事件处理函数 (用于同步歌词显示)
const onTimeUp = () => {
  // 获取当前歌曲的歌词数据
  let lyrics = player.value.aplayer.lyrics[playIndex.value];
  // 获取当前播放位置对应的歌词索引
  let lyricIndex = player.value.aplayer.lyricIndex;
  // 如果没有歌词数据或歌词索引无效，则返回
  if (!lyrics || !lyrics[lyricIndex]) {
    return;
  }
  // 获取当前歌词文本
  let lrc = lyrics[lyricIndex][1];
  // 处理歌词加载状态
  if (lrc === "Loading") {
    lrc = "歌词加载中";
  } else if (lrc === "Not available") {
    lrc = "歌词加载失败";
  }
  // 将当前歌词存储到全局状态中
  store.setPlayerLrc(lrc);
};

// 切换播放/暂停状态
const playToggle = () => {
  player.value.toggle();
};

// 改变音量
const changeVolume = (value) => {
  // 设置音量，第二个参数为是否静音
  player.value.setVolume(value, false);
};

// 切换歌曲 (上一首/下一首)
const changeSong = (type) => {
  // type: 0表示上一首，1表示下一首
  type === 0 ? player.value.skipBack() : player.value.skipForward();
  nextTick(() => {
    // 确保切换后立即播放
    player.value.play();
  });
};

// 切换歌曲列表显示状态
const toggleList = () => {
  player.value.toggleList();
};

// 音乐加载错误处理函数
const loadMusicError = () => {
  let notice = "";
  // 根据播放列表长度显示不同的错误信息
  if (playList.value.length > 1) {
    notice = "播放歌曲出现错误，播放器将在 2s 后进行下一首";
  } else {
    notice = "播放歌曲出现错误";
  }
  // 显示错误通知
  ElMessage({
    message: notice,
    grouping: true,
    icon: h(PlayWrong, {
      theme: "filled",
      fill: "#EFEFEF",
      duration: 2000,
    }),
  });
  // 在控制台输出详细错误信息
  console.error(
    "播放歌曲: " + player.value.aplayer.audio[player.value.aplayer.index].name + " 出现错误",
  );
};

// 暴露子组件方法供父组件调用
defineExpose({ playToggle, changeVolume, changeSong, toggleList });
</script>

<style lang="scss" scoped>
// 音乐播放器样式定制
.aplayer {
  width: 80%;
  border-radius: 6px;
  font-family: "HarmonyOS_Regular", sans-serif !important;
  
  // 深度选择器，用于修改子组件样式
  :deep(.aplayer-body) {
    background-color: transparent;
    
    // 隐藏专辑封面
    .aplayer-pic {
      display: none;
    }
    
    // 播放器信息区域样式
    .aplayer-info {
      margin-left: 0;
      background-color: #ffffff40;
      border-color: transparent !important;
      
      // 音乐信息区域
      .aplayer-music {
        flex-grow: initial;
        margin-bottom: 2px;
        overflow: initial;
        
        // 歌曲标题样式
        .aplayer-title {
          font-size: 16px;
          margin-right: 6px;
        }
        
        // 歌手信息样式
        .aplayer-author {
          color: #efefef;
        }
      }
      
      // 歌词显示区域
      .aplayer-lrc {
        text-align: left;
        margin: 7px 0 6px 6px;
        height: 44px;
        // 使用遮罩实现歌词渐变效果
        mask: linear-gradient(
          #fff 15%,
          #fff 85%,
          hsla(0deg, 0%, 100%, 0.6) 90%,
          hsla(0deg, 0%, 100%, 0)
        );
        -webkit-mask: linear-gradient(
          #fff 15%,
          #fff 85%,
          hsla(0deg, 0%, 100%, 0.6) 90%,
          hsla(0deg, 0%, 100%, 0)
        );
        
        // 隐藏默认的歌词前后缀
        &::before,
        &::after {
          display: none;
        }
        
        // 歌词文本样式
        p {
          color: #efefef;
        }
        
        // 当前播放歌词样式
        .aplayer-lrc-current {
          font-size: 0.95rem;
          margin-bottom: 4px !important;
        }
      }
      
      // 隐藏默认控制器
      .aplayer-controller {
        display: none;
      }
    }
  }
  
  // 播放列表样式
  :deep(.aplayer-list) {
    margin-top: 6px;
    height: v-bind(listHeight);
    background-color: transparent;
    
    ol {
      // 自定义滚动条轨道样式
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      
      // 列表项样式
      li {
        border-color: transparent;
        
        // 当前播放项样式
        &.aplayer-list-light {
          background: #ffffff40;
          border-radius: 6px;
        }
        
        // 悬停项样式
        &:hover {
          background: #ffffff26 !important;
          border-radius: 6px !important;
        }
        
        // 序号和作者文字颜色
        .aplayer-list-index,
        .aplayer-list-author {
          color: #efefef;
        }
      }
    }
  }
}
</style>