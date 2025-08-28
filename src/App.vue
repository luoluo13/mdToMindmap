<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <AppHeader />
    
    <!-- 主工作区 -->
    <main class="main-content">
      <!-- 左侧：文件上传和Markdown预览 -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <div class="panel-icon">📝</div>
            Markdown文档
          </div>
          <button class="btn btn-small btn-secondary" @click="clearFiles">清空</button>
        </div>
        <div class="panel-content">
          <FileUpload @file-uploaded="handleFileUploaded" />
          <FileList v-if="appStore.files.length > 0" />
          <MarkdownPreview />
        </div>
      </div>

      <!-- 右侧：思维导图预览 -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <div class="panel-icon">🧠</div>
            思维导图预览（似乎作用不大...）
          </div>
          <div class="zoom-controls">
            <button class="btn btn-small btn-secondary" @click="zoomOut">🔍-</button>
            <button class="btn btn-small btn-secondary" @click="resetZoom">{{ zoomLevel }}%</button>
            <button class="btn btn-small btn-secondary" @click="zoomIn">🔍+</button>
          </div>
        </div>
        <div class="panel-content">
          <MindMapPreview />
        </div>
      </div>
    </main>

    <!-- 控制面板 -->
    <ControlPanel />
    
    <!-- 底部跳转到顶部按钮 -->
    <div class="bottom-actions">
      <button class="btn btn-scroll-top" @click="scrollToTop" title="跳转到页面顶部">
        <span>⬆️</span>
        回到顶部
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppHeader from '@/components/AppHeader.vue'
import FileUpload from '@/components/FileUpload.vue'
import FileList from '@/components/FileList.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import MindMapPreview from '@/components/MindMapPreview.vue'
import ControlPanel from '@/components/ControlPanel.vue'

const appStore = useAppStore()

const zoomLevel = computed(() => Math.round(appStore.zoomLevel * 100))

const handleFileUploaded = (file: File) => {
  appStore.uploadFile(file)
}

const clearFiles = () => {
  appStore.clearFiles()
}

const zoomIn = () => {
  appStore.zoomMindmap(1.2)
}

const zoomOut = () => {
  appStore.zoomMindmap(0.8)
}

const resetZoom = () => {
  appStore.resetZoom()
}

const scrollToTop = () => {
  // 平滑滚动到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.panel:hover {
  transform: translateY(-2px);
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafbfc;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.panel-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.zoom-controls {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
}

.btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bottom-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  margin-top: 40px;
}

.btn-scroll-top {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #667eea;
  border: 2px solid #667eea;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  animation: float 3s ease-in-out infinite;
}

.btn-scroll-top:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  animation: none;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .bottom-actions {
    padding: 20px 0;
    margin-top: 20px;
  }
}
</style>