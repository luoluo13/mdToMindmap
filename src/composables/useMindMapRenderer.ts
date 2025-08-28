import * as d3 from 'd3'
import type { MindMapNode, ConversionConfig } from '@/types/mindmap'

export function useMindMapRenderer() {
  const renderMindMap = (
    svgElement: SVGSVGElement, 
    data: MindMapNode, 
    config: ConversionConfig
  ) => {
    console.log('开始渲染思维导图:', data, config)
    
    const svg = d3.select(svgElement)
    svg.selectAll('*').remove()

    const width = svgElement.clientWidth || 800
    const height = svgElement.clientHeight || 600

    svg.attr('width', width).attr('height', height)

    // 创建主容器
    const container = svg.append('g').attr('class', 'mindmap-container')

    // 添加缩放和拖拽
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event: any) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom as any)

    // 创建内容组
    const g = container.append('g')
      .attr('class', 'mindmap-content')

    // 根据布局类型渲染
    switch (config.layout) {
      case 'radial':
        renderRadialLayout(g, data, config, width, height)
        break
      case 'fishbone':
        renderFishboneLayout(g, data, config, width, height)
        break
      default:
        renderTreeLayout(g, data, width, height)
    }

    // 双击重置
    svg.on('dblclick.zoom', () => {
      svg.transition().duration(750).call(
        zoom.transform as any,
        d3.zoomIdentity
      )
    })
  }

  const renderTreeLayout = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: MindMapNode,
    width: number,
    height: number
  ) => {
    console.log('渲染树状布局')
    
    // 创建层次结构
    const hierarchy = d3.hierarchy(data, d => d.children)
    
    // 创建树布局
    const treeLayout = d3.tree<MindMapNode>()
      .size([height - 100, width - 200])
      .separation((a: any, b: any) => a.parent === b.parent ? 1 : 2)

    const nodes = treeLayout(hierarchy)
    
    // 调整位置到中心
    g.attr('transform', `translate(100, 50)`)

    // 绘制连接线
    const links = g.selectAll('.link')
      .data(nodes.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        return `M${d.source.y},${d.source.x}C${(d.source.y + d.target.y) / 2},${d.source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d.target.x}`
      })
      .style('stroke', '#667eea')
      .style('stroke-width', 2)
      .style('fill', 'none')

    // 绘制节点
    const nodeGroups = g.selectAll('.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y}, ${d.x})`)

    // 节点背景
    nodeGroups.append('rect')
      .attr('x', (d: any) => -d.data.width / 2)
      .attr('y', -17)
      .attr('width', (d: any) => d.data.width)
      .attr('height', 34)
      .attr('rx', 8)
      .style('fill', (d: any) => d.data.style.backgroundColor)
      .style('stroke', (d: any) => d.data.style.borderColor)
      .style('stroke-width', (d: any) => d.data.style.borderWidth)
      .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))')

    // 节点文本
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', (d: any) => d.data.style.fontSize + 'px')
      .style('font-weight', (d: any) => d.data.style.fontWeight)
      .style('fill', (d: any) => d.data.style.textColor)
      .style('pointer-events', 'none')
      .text((d: any) => d.data.text)
  }

  const renderRadialLayout = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: MindMapNode,
    config: ConversionConfig,
    width: number,
    height: number
  ) => {
    console.log('渲染放射状布局')
    
    const hierarchy = d3.hierarchy(data, d => d.children)
    
    // 放射状布局
    const radius = Math.min(width, height) / 2 - 100
    const tree = d3.tree<MindMapNode>()
      .size([2 * Math.PI, radius])
      .separation((a: any, b: any) => (a.parent === b.parent ? 1 : 2) / a.depth)

    const nodes = tree(hierarchy)
    
    // 移动到中心
    g.attr('transform', `translate(${width / 2}, ${height / 2})`)

    // 绘制连接线
    g.selectAll('.link')
      .data(nodes.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const sourceAngle = d.source.x - Math.PI / 2
        const targetAngle = d.target.x - Math.PI / 2
        const sourceRadius = d.source.y
        const targetRadius = d.target.y
        
        const sourceX = Math.cos(sourceAngle) * sourceRadius
        const sourceY = Math.sin(sourceAngle) * sourceRadius
        const targetX = Math.cos(targetAngle) * targetRadius
        const targetY = Math.sin(targetAngle) * targetRadius
        
        return `M${sourceX},${sourceY}L${targetX},${targetY}`
      })
      .style('stroke', '#667eea')
      .style('stroke-width', 2)
      .style('fill', 'none')

    // 绘制节点
    const nodeGroups = g.selectAll('.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => {
        const angle = d.x - Math.PI / 2
        const x = Math.cos(angle) * d.y
        const y = Math.sin(angle) * d.y
        return `translate(${x}, ${y})`
      })

    // 节点背景 - 使用椭圆
    nodeGroups.append('ellipse')
      .attr('rx', (d: any) => d.data.width / 2)
      .attr('ry', 20)
      .style('fill', (d: any) => d.data.style.backgroundColor)
      .style('stroke', (d: any) => d.data.style.borderColor)
      .style('stroke-width', (d: any) => d.data.style.borderWidth)
      .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))')

    // 节点文本
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', (d: any) => d.data.style.fontSize + 'px')
      .style('font-weight', (d: any) => d.data.style.fontWeight)
      .style('fill', (d: any) => d.data.style.textColor)
      .style('pointer-events', 'none')
      .text((d: any) => d.data.text)
  }

  const renderFishboneLayout = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: MindMapNode,
    config: ConversionConfig,
    width: number,
    height: number
  ) => {
    console.log('渲染鱼骨图布局')
    
    // 手动计算鱼骨图位置
    const allNodes: Array<{ node: MindMapNode; x: number; y: number; level: number }> = []
    
    // 根节点在左侧
    allNodes.push({ node: data, x: 100, y: height / 2, level: 0 })
    
    // 处理子节点
    if (data.children) {
      data.children.forEach((child, index) => {
        const isUpper = index % 2 === 0
        const branchIndex = Math.floor(index / 2)
        const x = 300 + branchIndex * 150
        const y = height / 2 + (isUpper ? -80 : 80)
        
        allNodes.push({ node: child, x, y, level: 1 })
        
        // 处理子节点的子节点
        if (child.children) {
          child.children.forEach((grandChild, gIndex) => {
            const gx = x + 100
            const gy = y + (gIndex - (child.children!.length - 1) / 2) * 40
            allNodes.push({ node: grandChild, x: gx, y: gy, level: 2 })
          })
        }
      })
    }

    // 绘制主干线
    g.append('line')
      .attr('x1', 50)
      .attr('y1', height / 2)
      .attr('x2', width - 50)
      .attr('y2', height / 2)
      .style('stroke', '#667eea')
      .style('stroke-width', 4)

    // 绘制分支线
    allNodes.forEach(nodeData => {
      if (nodeData.level === 1) {
        // 主分支线
        g.append('line')
          .attr('x1', nodeData.x - 50)
          .attr('y1', height / 2)
          .attr('x2', nodeData.x)
          .attr('y2', nodeData.y)
          .style('stroke', '#667eea')
          .style('stroke-width', 3)
      }
    })

    // 绘制节点
    const nodeGroups = g.selectAll('.node')
      .data(allNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    // 节点背景
    nodeGroups.append('rect')
      .attr('x', d => -d.node.width / 2)
      .attr('y', -17)
      .attr('width', d => d.node.width)
      .attr('height', 34)
      .attr('rx', 8)
      .style('fill', d => d.node.style.backgroundColor)
      .style('stroke', d => d.node.style.borderColor)
      .style('stroke-width', d => d.node.style.borderWidth)
      .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))')

    // 节点文本
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', d => d.node.style.fontSize + 'px')
      .style('font-weight', d => d.node.style.fontWeight)
      .style('fill', d => d.node.style.textColor)
      .style('pointer-events', 'none')
      .text(d => d.node.text)
  }

  return {
    renderMindMap
  }
}