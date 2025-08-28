<template>
  <div class="file-list">
    <div 
      v-for="(file, index) in appStore.files" 
      :key="file.id"
      class="file-item fade-in"
      :class="{ active: file.id === appStore.currentFile?.id }"
    >
      <div class="file-icon">MD</div>
      <div class="file-info">
        <div class="file-name">{{ file.name }}</div>
        <div class="file-size">{{ formatFileSize(file.size) }}</div>
      </div>
      <div class="file-actions">
        <button 
          class="btn btn-small btn-primary" 
          @click="loadFile(file)"
          :disabled="file.id === appStore.currentFile?.id"
        >
          {{ file.id === appStore.currentFile?.id ? '当前' : '预览' }}
        </button>
        <button 
          class="btn btn-small btn-secondary" 
          @click="removeFile(file.id)"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import type { FileInfo } from '@/types/file'

const appStore = useAppStore()

const loadFile = (file: FileInfo) => {
  appStore.setCurrentFile(file)
}

const removeFile = (fileId: string) => {
  appStore.removeFile(fileId)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.file-list {
  margin-top: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.file-item:hover {
  background: #e9ecef;
}

.file-item.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.file-icon {
  width: 32px;
  height: 32px;
  background: #28a745;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  margin-right: 12px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: #6c757d;
}

.file-actions {
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

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.fade-in {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>