import { defineStore } from 'pinia'
import type { FileInfo } from '@/types/file'
import type { MarkdownNode } from '@/types/markdown'
import type { MindMapNode } from '@/types/mindmap'
import type { ConversionConfig } from '@/types/mindmap'
import { useMarkdownParser } from '@/composables/useMarkdownParser'

export const useAppStore = defineStore('app', {
  state: () => ({
    files: [] as FileInfo[],
    currentFile: null as FileInfo | null,
    mindmapData: null as MindMapNode | null,
    config: {
      layout: 'tree',
      spacing: 50,
      nodeSize: {
        width: 120,
        height: 40
      },
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#ffffff'
      }
    } as ConversionConfig,
    zoomLevel: 1,
    isLoading: false,
    statusMessage: '',
    statusType: 'info' as 'success' | 'error' | 'info'
  }),

  actions: {
    async uploadFile(file: File) {
      this.setLoading(true)
      
      try {
        const content = await readFileContent(file)
        const fileInfo: FileInfo = {
          id: generateFileId(),
          name: file.name,
          size: file.size,
          content,
          uploadTime: new Date()
        }
        
        this.files.push(fileInfo)
        this.setCurrentFile(fileInfo)
        this.showStatus('success', `文件上传成功: ${file.name}`)
      } catch (error) {
        this.showStatus('error', '文件上传失败: ' + (error as Error).message)
      } finally {
        this.setLoading(false)
      }
    },

    setCurrentFile(file: FileInfo) {
      this.currentFile = file
      this.convertToMindMap()
    },

    removeFile(fileId: string) {
      const index = this.files.findIndex(f => f.id === fileId)
      if (index > -1) {
        this.files.splice(index, 1)
        
        if (this.currentFile?.id === fileId) {
          this.currentFile = this.files.length > 0 ? this.files[0] : null
          if (this.currentFile) {
            this.convertToMindMap()
          } else {
            this.mindmapData = null
          }
        }
      }
    },

    clearFiles() {
      this.files = []
      this.currentFile = null
      this.mindmapData = null
    },

    async convertToMindMap() {
      if (!this.currentFile) return

      this.setLoading(true)
      
      try {
        const { parseMarkdown } = useMarkdownParser()
        this.mindmapData = parseMarkdown(this.currentFile.content)
        console.log('解析结果:', this.mindmapData)
        this.showStatus('success', '思维导图生成成功')
      } catch (error) {
        console.error('转换失败:', error)
        this.showStatus('error', '转换失败: ' + (error as Error).message)
      } finally {
        this.setLoading(false)
      }
    },

    updateMindmap() {
      if (this.currentFile) {
        this.convertToMindMap()
      }
    },

    zoomMindmap(factor: number) {
      this.zoomLevel = Math.max(0.1, Math.min(3, this.zoomLevel * factor))
    },

    resetZoom() {
      this.zoomLevel = 1
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    showStatus(type: 'success' | 'error' | 'info', message: string) {
      this.statusType = type
      this.statusMessage = message
      
      setTimeout(() => {
        this.statusMessage = ''
      }, 5000)
    }
  },

  // 辅助方法
  getters: {
    // 可以添加计算属性
  }
})

// 辅助函数
function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
