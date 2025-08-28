<template>
  <div class="control-panel">
    <div class="control-grid">
      <div class="control-group">
        <label class="control-label">布局方式</label>
        <select 
          class="control-select" 
          v-model="appStore.config.layout"
          @change="updateConfig"
        >
          <option value="tree">树状布局</option>
          <option value="radial">放射状布局</option>
          <option value="fishbone">鱼骨图布局</option>
        </select>
      </div>
      
      <div class="control-group">
        <label class="control-label">主题样式</label>
        <select 
          class="control-select" 
          v-model="appStore.config.theme"
          @change="updateConfig"
        >
          <option value="default">默认主题</option>
          <option value="modern">现代主题</option>
          <option value="minimal">简约主题</option>
          <option value="colorful">彩色主题</option>
        </select>
      </div>
      
      <div class="control-group">
        <label class="control-label">节点间距: {{ appStore.config.spacing.horizontal }}</label>
        <input 
          type="range" 
          class="control-input" 
          min="20" 
          max="100" 
          v-model="appStore.config.spacing.horizontal"
          @input="updateConfig"
        >
      </div>
      
      <div class="control-group">
        <label class="control-label">最大深度</label>
        <select 
          class="control-select" 
          v-model="appStore.config.maxDepth"
          @change="updateConfig"
        >
          <option :value="0">无限制</option>
          <option :value="3">3层</option>
          <option :value="4">4层</option>
          <option :value="5">5层</option>
        </select>
      </div>
    </div>

    <!-- 进度条 -->
    <div v-if="appStore.isLoading" class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- 状态消息 -->
    <div 
      v-if="appStore.statusMessage" 
      class="status-message"
      :class="`status-${appStore.statusType}`"
    >
      <span class="status-icon">{{ getStatusIcon(appStore.statusType) }}</span>
      <span class="status-text">{{ appStore.statusMessage }}</span>
    </div>

    <!-- 导出操作 -->
    <div class="export-actions">
      <button 
        class="btn-export btn-export-primary" 
        @click="exportFile('xmind')"
        :disabled="!appStore.mindmapData"
      >
        <span>💾</span>
        导出XMind
      </button>
      <button 
        class="btn-export btn-export-secondary" 
        @click="exportFile('png')"
        :disabled="!appStore.mindmapData"
      >
        <span>🖼️</span>
        导出PNG
      </button>
      <button 
        class="btn-export btn-export-secondary" 
        @click="exportFile('svg')"
        :disabled="!appStore.mindmapData"
      >
        <span>📐</span>
        导出SVG
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useExporter } from '@/composables/useExporter'

const appStore = useAppStore()
const { exportFile: exportFileHandler } = useExporter()
const progress = ref(0)

const updateConfig = () => {
  appStore.updateMindmap()
}

const exportFile = async (format: string) => {
  if (!appStore.mindmapData) return
  
  try {
    appStore.setLoading(true)
    await exportFileHandler(format, appStore.mindmapData, appStore.currentFile?.name)
    appStore.showStatus('success', `${format.toUpperCase()}文件导出成功`)
  } catch (error) {
    appStore.showStatus('error', '导出失败: ' + (error as Error).message)
  } finally {
    appStore.setLoading(false)
  }
}

const getStatusIcon = (type: string) => {
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }
  return icons[type as keyof typeof icons] || 'ℹ️'
}

// 模拟进度动画
onMounted(() => {
  const updateProgress = () => {
    if (appStore.isLoading) {
      progress.value = Math.min(progress.value + Math.random() * 10, 90)
      setTimeout(updateProgress, 200)
    } else {
      progress.value = 0
    }
  }
  
  // 监听加载状态变化
  const unwatch = appStore.$subscribe((mutation, state) => {
    if (mutation.events?.key === 'isLoading' && state.isLoading) {
      progress.value = 0
      updateProgress()
    }
  })
  
  return unwatch
})
</script>

<style scoped>
.control-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.8s ease-out 0.4s both;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.control-select, .control-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.control-select:focus, .control-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin: 20px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.status-message {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.export-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-export {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-export-primary {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.btn-export-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.btn-export-secondary {
  background: #6c757d;
  color: white;
}

.btn-export-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .control-grid {
    grid-template-columns: 1fr;
  }
  
  .export-actions {
    flex-direction: column;
  }
}
</style>