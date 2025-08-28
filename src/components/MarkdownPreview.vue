<template>
  <div class="markdown-preview">
    <div class="preview-header" v-if="appStore.currentFile">
      <div class="header-info">
        <span class="file-icon">📄</span>
        <span class="file-name">{{ appStore.currentFile?.name || 'Markdown预览' }}</span>
      </div>
    </div>
    <div class="preview-content" v-html="renderedMarkdown"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const renderedMarkdown = computed(() => {
  if (!appStore.currentFile) {
    return `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <div class="empty-title">请上传Markdown文件</div>
        <div class="empty-desc">支持标题、列表、代码块等常用语法</div>
      </div>
    `
  }
  
  return renderMarkdownToHtml(appStore.currentFile.content)
})

// 简单的Markdown渲染函数
function renderMarkdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>')
}
</script>

<style scoped>
.markdown-preview {
  width: 100%;
  height: 600px;
  background: #fff;
  border-radius: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  flex-shrink: 0;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  font-size: 16px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f1f3f4;
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
}

.empty-desc {
  font-size: 14px;
  color: #6b7280;
}
</style>