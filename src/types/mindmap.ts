export interface MindMapNode {
  id: string
  text: string
  x: number
  y: number
  width: number
  height: number
  level: number
  children: MindMapNode[]
  style: NodeStyle
}

export interface NodeStyle {
  backgroundColor: string
  borderColor: string
  textColor: string
  fontSize: number
  fontWeight: string
  shape: 'rectangle' | 'rounded' | 'ellipse'
  borderWidth: number
}

export interface ConversionConfig {
  layout: 'tree' | 'radial' | 'fishbone'
  spacing: number
  nodeSize: {
    width: number
    height: number
  }
  colors: {
    primary: string
    secondary: string
    background: string
  }
}
