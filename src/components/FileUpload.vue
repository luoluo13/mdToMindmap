<template>
  <div 
    class="upload-area" 
    :class="{ dragover: isDragOver }"
    @click="triggerFileInput"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div class="upload-icon">📁</div>
    <div class="upload-text">拖拽MD文件到此处</div>
    <div class="upload-hint">或点击选择文件 (支持 .md, .markdown)</div>
    <button class="btn btn-primary" @click.stop="triggerFileInput">
      选择文件
    </button>
    <input 
      ref="fileInput"
      type="file" 
      class="file-input" 
      accept=".md,.markdown" 
      multiple
      @change="handleFileSelect"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  fileUploaded: [file: File]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
}

const processFiles = (files: File[]) => {
  const mdFiles = files.filter(file => 
    file.name.endsWith('.md') || file.name.endsWith('.markdown')
  )

  if (mdFiles.length === 0) {
    alert('请选择有效的Markdown文件')
    return
  }

  mdFiles.forEach(file => {
    emit('fileUploaded', file)
  })
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fafbfc;
  position: relative;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-area.dragover {
  border-color: #667eea;
  background: #f0f4ff;
  transform: scale(1.02);
}

.upload-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.upload-text {
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.file-input {
  display: none;
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

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>