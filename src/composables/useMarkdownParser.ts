import { ref } from 'vue'
import type { MindMapNode } from '@/types/mindmap'

export function useMarkdownParser() {
  const parseMarkdown = (content: string): MindMapNode | null => {
    if (!content.trim()) return null

    const lines = content.split('\n')
    if (lines.length === 0) return null

    // 解析所有内容项（标题、列表项、普通文本）
    const items: Array<{
      level: number
      text: string
      line: number
      type: 'heading' | 'list' | 'text'
      indent: number // 添加缩进信息
    }> = []

    let currentHeadingLevel = 0 // 当前标题层级
    let inTextBlock = false // 是否在文本块中
    let lastParentLevel = 0 // 最近的带冒号父级项目的层级

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      
      if (!trimmed) {
        inTextBlock = false
        continue
      }
      
      // 特别关注包含"核心特征"的行
      if (line.includes('核心特征')) {
        console.log(`发现核心特征行 ${i}: "${line}"`)
        console.log(`缩进长度: ${line.length - line.trimStart().length}`)
      }

      // 匹配标题格式 # ## ### 等
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        let text = headingMatch[2].trim()
        
        // 清理文本中的markdown标记
        text = cleanMarkdownText(text)
        
        if (text) {
          items.push({
            level,
            text,
            line: i,
            type: 'heading',
            indent: 0
          })
          currentHeadingLevel = level
          inTextBlock = false
          lastParentLevel = 0 // 重置父级层级
          lastParentLevel = 0 // 重置父级层级
        }
        continue
      }

      // 匹配列表项格式 • - * 等 (注意处理换行符)
      const listMatch = line.match(/^(\s*)[•·*-]\s+(.+?)[\r\n]*$/)
      console.log(`测试列表匹配 第${i}行: "${line}" -> 匹配结果: ${listMatch ? '成功' : '失败'}`)
      if (listMatch) {
        const indent = listMatch[1].length
        let rawText = listMatch[2].trim() // 保留原始文本
        
        // 先检查是否是带有冒号的父级列表项（在清理标记之前）
        const isParentItem = rawText.endsWith('：') || rawText.endsWith(':')
        
        // 清理文本中的markdown标记
        let cleanText = cleanMarkdownText(rawText)
        
        if (cleanText) {
          let listLevel: number
          
          if (isParentItem) {
            // 带冒号的父级项目
            const indentLevel = Math.floor(indent / 2)
            listLevel = currentHeadingLevel + indentLevel + 1
            lastParentLevel = listLevel // 记录父级层级
            // 移除冒号
            cleanText = cleanText.replace(/[：:]\s*$/, '')
          } else {
            // 普通列表项，如果有缩进且存在父级，则作为父级的子项
            if (indent > 0 && lastParentLevel > 0) {
              listLevel = lastParentLevel + 1 // 作为最近父级的子项
            } else {
              // 没有缩进或没有父级，按正常逻辑计算
              const indentLevel = Math.floor(indent / 2)
              listLevel = currentHeadingLevel + indentLevel + 1
            }
          }
          
          console.log(`解析列表项: "${rawText}" -> 层级: ${listLevel}, 类型: ${isParentItem ? 'heading' : 'list'}, 缩进: ${indent}`)
          
          items.push({
            level: listLevel,
            text: cleanText,
            line: i,
            type: isParentItem ? 'heading' : 'list',
            indent
          })
          
          inTextBlock = false
        }
        continue
      }

      // 匹配数字列表 1. 2. 等 (注意处理换行符)
      const numberedListMatch = line.match(/^(\s*)\d+\.\s+(.+?)[\r\n]*$/)
      if (numberedListMatch) {
        const indent = numberedListMatch[1].length
        let rawText = numberedListMatch[2].trim() // 保留原始文本
        
        // 先检查是否是带有冒号的父级列表项（在清理标记之前）
        const isParentItem = rawText.endsWith('：') || rawText.endsWith(':')
        
        // 清理文本中的markdown标记
        let cleanText = cleanMarkdownText(rawText)
        
        if (cleanText) {
          let listLevel: number
          
          if (isParentItem) {
            // 带冒号的父级项目
            const indentLevel = Math.floor(indent / 2)
            listLevel = currentHeadingLevel + indentLevel + 1
            lastParentLevel = listLevel // 记录父级层级
            // 移除冒号
            cleanText = cleanText.replace(/[：:]\s*$/, '')
          } else {
            // 普通列表项，如果有缩进且存在父级，则作为父级的子项
            if (indent > 0 && lastParentLevel > 0) {
              listLevel = lastParentLevel + 1 // 作为最近父级的子项
            } else {
              // 没有缩进或没有父级，按正常逻辑计算
              const indentLevel = Math.floor(indent / 2)
              listLevel = currentHeadingLevel + indentLevel + 1
            }
          }
          
          console.log(`解析数字列表: "${rawText}" -> 层级: ${listLevel}, 类型: ${isParentItem ? 'heading' : 'list'}, 缩进: ${indent}`)
          
          items.push({
            level: listLevel,
            text: cleanText,
            line: i,
            type: isParentItem ? 'heading' : 'list',
            indent
          })
          
          inTextBlock = false
        }
        continue
      }

      // 匹配中文序号格式 一、二、三、等
      const chineseNumberMatch = trimmed.match(/^([一二三四五六七八九十]+)、\s*(.+)$/)
      if (chineseNumberMatch) {
        let text = chineseNumberMatch[2].trim()
        text = cleanMarkdownText(text)
        
        if (text) {
          // 中文序号作为二级标题处理
          const level = currentHeadingLevel + 1
          items.push({
            level,
            text,
            line: i,
            type: 'heading',
            indent: 0
          })
          currentHeadingLevel = level
          currentHeadingLevel = level
          inTextBlock = false
        }
        continue
      }

      // 处理普通文本段落
      if (trimmed && !trimmed.startsWith('#')) {
        let text = cleanMarkdownText(trimmed)
        
        if (text) {
          // 普通文本作为当前标题的子节点
          let textLevel = currentHeadingLevel + 1
          
          // 如果是连续的文本行，可能需要合并或作为同级处理
          if (inTextBlock && items.length > 0 && items[items.length - 1].type === 'text') {
            // 如果前一个也是文本，保持同级
            textLevel = items[items.length - 1].level
          }
          
          items.push({
            level: textLevel,
            text,
            line: i,
            type: 'text',
            indent: 0
          })
          inTextBlock = true
        }
      }
    }

    if (items.length === 0) return null

    console.log('解析的所有项目:', items)

    // 如果第一个不是标题，创建一个默认根节点
    let root: MindMapNode
    let startIndex = 0

    if (items[0].type !== 'heading') {
      root = createMindMapNode('文档内容', 0)
      startIndex = 0
    } else {
      root = createMindMapNode(items[0].text, items[0].level - 1)
      startIndex = 1
    }

    const stack: Array<{ node: MindMapNode; level: number }> = [{ node: root, level: items[0]?.level || 1 }]

    for (let i = startIndex; i < items.length; i++) {
      const item = items[i]
      const newNode = createMindMapNode(item.text, item.level - 1)

      // 找到正确的父节点
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop()
      }

      if (stack.length > 0) {
        const parent = stack[stack.length - 1].node
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(newNode)
      } else {
        // 如果没有父节点，作为根节点的子节点
        if (!root.children) {
          root.children = []
        }
        root.children.push(newNode)
      }

      stack.push({ node: newNode, level: item.level })
    }

    console.log('构建的思维导图结构:', root)
    return root
  }

  // 清理markdown文本标记的辅助函数
  const cleanMarkdownText = (text: string): string => {
    return text
      .replace(/^\*+\s*/, '') // 移除开头的星号
      .replace(/\*+$/, '') // 移除结尾的星号
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
      .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
      .replace(/`(.*?)`/g, '$1') // 移除代码标记
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留文本
      .replace(/^[•·*-]\s*/, '') // 移除列表标记
      .replace(/^\d+\.\s*/, '') // 移除数字列表标记
      .replace(/^[一二三四五六七八九十]+、\s*/, '') // 移除中文序号
      .trim()
  }

  const createMindMapNode = (text: string, level: number): MindMapNode => {
    // 根据层级设置不同的样式
    // 根据层级设置不同的样式
    const styles = {
      0: { // 根节点
        backgroundColor: '#4f46e5',
        textColor: '#ffffff',
        borderColor: '#3730a3',
        borderWidth: 2,
        fontSize: 16,
        fontWeight: 'bold',
        shape: 'rounded' as const
      },
      1: { // 一级节点
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        borderColor: '#5b21b6',
        borderWidth: 2,
        fontSize: 14,
        fontWeight: 'bold',
        shape: 'rounded' as const
      },
      2: { // 二级节点
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        borderColor: '#1d4ed8',
        borderWidth: 1,
        fontSize: 13,
        fontWeight: 'normal',
        shape: 'rounded' as const
      },
      3: { // 三级节点
        backgroundColor: '#059669',
        textColor: '#ffffff',
        borderColor: '#047857',
        borderWidth: 1,
        fontSize: 12,
        fontWeight: 'normal',
        shape: 'rounded' as const
      },
      4: { // 四级节点
        backgroundColor: '#dc2626',
        textColor: '#ffffff',
        borderColor: '#b91c1c',
        borderWidth: 1,
        fontSize: 11,
        fontWeight: 'normal',
        shape: 'rounded' as const
      }
    }

    const defaultStyle = {
      backgroundColor: '#6b7280',
      textColor: '#ffffff',
      borderColor: '#4b5563',
      borderWidth: 1,
      fontSize: 10,
      fontWeight: 'normal',
      shape: 'rounded' as const
    }

    const style = styles[level as keyof typeof styles] || defaultStyle

    return {
      id: `node-${Date.now()}-${Math.random()}`,
      text,
      x: 0,
      y: 0,
      level,
      style,
      width: Math.max(text.length * 8 + 40, 80),
      height: 35,
      children: []
    }
  }

  return {
    parseMarkdown
  }
}
