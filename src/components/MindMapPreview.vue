<template>
  <div class="mindmap-preview">
    <div v-if="!appStore.mindmapData" class="mindmap-placeholder">
      <div class="mindmap-placeholder-icon">🧠</div>
      <div style="font-size: 16px; margin-bottom: 8px;">思维导图将在此显示</div>
      <div style="font-size: 14px;">上传MD文件后自动生成</div>
    </div>
    <svg 
      v-else
      ref="svgRef"
      class="mindmap-canvas"
    ></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { useMindMapRenderer } from '@/composables/useMindMapRenderer'

const appStore = useAppStore()
const svgRef = ref<SVGSVGElement>()
const { renderMindMap } = useMindMapRenderer()

const renderChart = async () => {
  console.log('开始渲染图表', appStore.mindmapData)
  if (svgRef.value && appStore.mindmapData) {
    await nextTick()
    try {
      renderMindMap(svgRef.value, appStore.mindmapData, appStore.config)
    } catch (error) {
      console.error('渲染思维导图时出错:', error)
    }
  }
}

onMounted(() => {
  console.log('组件挂载完成')
  renderChart()
})

watch(
  () => appStore.mindmapData,
  (newData) => {
    console.log('思维导图数据变化:', newData)
    renderChart()
  }
)

watch(
  () => appStore.config,
  (newConfig) => {
    console.log('配置变化:', newConfig)
    renderChart()
  },
  { deep: true }
)
</script>

<style scoped>
.mindmap-preview {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.mindmap-canvas {
  width: 100%;
  height: 100%;
  min-height: 400px;
  cursor: grab;
}

.mindmap-canvas:active {
  cursor: grabbing;
}

.mindmap-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #6b7280;
}

.mindmap-placeholder-icon {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 16px;
}
</style>