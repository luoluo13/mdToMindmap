export interface MarkdownNode {
  id: string
  type: 'heading' | 'list' | 'text' | 'code' | 'quote'
  level: number
  content: string
  children: MarkdownNode[]
  parent?: MarkdownNode
  metadata?: Record<string, any>
}