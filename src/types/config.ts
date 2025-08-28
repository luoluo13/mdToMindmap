export interface ConversionConfig {
  layout: 'tree' | 'radial' | 'fishbone'
  theme: string
  nodeStyle: Partial<import('./mindmap').NodeStyle>
  spacing: {
    horizontal: number
    vertical: number
  }
  maxDepth: number
  includeContent: boolean
}

export interface ExportOptions {
  format: 'xmind' | 'png' | 'svg' | 'pdf'
  quality?: number
  theme?: string
  filename?: string
  includeMetadata?: boolean
}