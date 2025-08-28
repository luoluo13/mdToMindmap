import JSZip from 'jszip'
import type { MindMapNode } from '@/types/mindmap'

export function useExporter() {
  const exportFile = async (
    format: string, 
    data: MindMapNode, 
    originalFilename?: string
  ) => {
    const filename = originalFilename 
      ? originalFilename.replace(/\.[^/.]+$/, '') + '_mindmap.' + format
      : 'mindmap.' + format

    switch (format) {
      case 'xmind':
        await exportToXMind(data, filename)
        break
      case 'png':
        await exportToPNG(filename)
        break
      case 'svg':
        await exportToSVG(filename)
        break
      default:
        throw new Error(`不支持的导出格式: ${format}`)
    }
  }

  const exportToXMind = async (data: MindMapNode, filename: string) => {
    const zip = new JSZip()
    
    // 创建XMind文件结构
    const contentXml = generateContentXml(data)
    const manifestXml = generateManifestXml()
    const metaXml = generateMetaXml()
    
    zip.file('content.xml', contentXml)
    zip.file('META-INF/manifest.xml', manifestXml)
    zip.file('meta.xml', metaXml)
    
    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, filename)
  }

  const exportToPNG = async (filename: string) => {
    const svg = document.querySelector('.mindmap-canvas') as SVGSVGElement
    if (!svg) throw new Error('未找到思维导图')

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    
    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, filename)
            resolve()
          } else {
            reject(new Error('生成PNG失败'))
          }
        }, 'image/png')
      }
      
      img.onerror = reject
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    })
  }

  const exportToSVG = async (filename: string) => {
    const svg = document.querySelector('.mindmap-canvas') as SVGSVGElement
    if (!svg) throw new Error('未找到思维导图')

    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    downloadBlob(blob, filename)
  }

  const generateContentXml = (data: MindMapNode): string => {
    const generateTopicXml = (node: MindMapNode, isRoot = false): string => {
      const topicId = node.id
      const title = escapeXml(node.text)
      
      let xml = isRoot 
        ? `<topic id="${topicId}" modified-by="md-to-xmind" timestamp="${Date.now()}"><title>${title}</title>`
        : `<topic id="${topicId}"><title>${title}</title>`
      
      if (node.children.length > 0) {
        xml += '<children><topics type="attached">'
        node.children.forEach(child => {
          xml += generateTopicXml(child)
        })
        xml += '</topics></children>'
      }
      
      xml += '</topic>'
      return xml
    }

    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<xmap-content xmlns="urn:xmind:xmap:xmlns:content:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" version="2.0">
  <sheet id="sheet1" modified-by="md-to-xmind" theme="theme1" timestamp="${Date.now()}">
    <title>Sheet 1</title>
    ${generateTopicXml(data, true)}
  </sheet>
</xmap-content>`
  }

  const generateManifestXml = (): string => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<manifest xmlns="urn:xmind:xmap:xmlns:manifest:1.0" password-hint="">
  <file-entry full-path="content.xml" media-type="text/xml"/>
  <file-entry full-path="META-INF/" media-type=""/>
  <file-entry full-path="META-INF/manifest.xml" media-type="text/xml"/>
  <file-entry full-path="meta.xml" media-type="text/xml"/>
</manifest>`
  }

  const generateMetaXml = (): string => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<meta xmlns="urn:xmind:xmap:xmlns:meta:2.0" version="2.0">
  <Author>
    <Name>MD-to-XMind Tool</Name>
  </Author>
  <Create>
    <Time>${new Date().toISOString()}</Time>
  </Create>
</meta>`
  }

  const escapeXml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    exportFile
  }
}