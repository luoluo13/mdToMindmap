# MD转XMind思维导图工具

一个轻量级、便携的Markdown文档到XMind思维导图的自动转换工具，支持本地运行，无需复杂依赖。

## 功能特色

- 🚀 **一键转换**: 上传MD文件即可自动生成思维导图
- 🎨 **多种布局**: 支持树状、放射状、鱼骨图布局
- 🎯 **精确解析**: 准确识别标题层级和列表结构
- 💾 **多格式导出**: 支持XMind、PNG、SVG格式导出
- 🔧 **可配置**: 支持主题、间距、深度等参数调整
- 📱 **响应式**: 支持不同屏幕尺寸，移动端友好

## 技术栈

- **前端框架**: Vue.js 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **图形渲染**: D3.js + SVG
- **Markdown解析**: markdown-it
- **文件处理**: JSZip

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 使用说明

1. **上传文件**: 拖拽或点击选择Markdown文件
2. **预览调整**: 查看解析结果，调整配置参数
3. **导出文件**: 选择格式并导出思维导图

## 支持的Markdown语法

- ✅ 标题 (H1-H6)
- ✅ 无序列表 (-, *, +)
- ✅ 有序列表 (1. 2. 3.)
- ✅ 嵌套列表
- ✅ 引用块 (>)
- ✅ 代码块 (\`\`\`)

## 项目结构

```
src/
├── components/          # Vue组件
│   ├── AppHeader.vue   # 头部组件
│   ├── FileUpload.vue  # 文件上传
│   ├── FileList.vue    # 文件列表
│   ├── MarkdownPreview.vue # MD预览
│   ├── MindMapPreview.vue  # 思维导图预览
│   └── ControlPanel.vue    # 控制面板
├── composables/        # 组合式函数
│   ├── useMarkdownParser.ts # MD解析器
│   ├── useMindMapRenderer.ts # 图形渲染器
│   └── useExporter.ts      # 导出处理器
├── stores/             # 状态管理
│   └── app.ts         # 应用状态
├── types/             # 类型定义
│   ├── file.ts        # 文件类型
│   ├── markdown.ts    # MD类型
│   ├── mindmap.ts     # 思维导图类型
│   └── config.ts      # 配置类型
└── assets/            # 静态资源
    └── styles/        # 样式文件
```

## 开发规范

### 代码规范

- 使用TypeScript严格模式
- 遵循Vue 3 Composition API规范
- 使用ESLint + Prettier格式化代码

### 提交规范

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 性能优化

- 代码分割和懒加载
- 组件级别的缓存
- 防抖节流处理
- 虚拟滚动支持

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 问题反馈

如果您遇到任何问题或有改进建议，请在 [Issues](https://github.com/your-repo/issues) 中提出。

## 更新日志

### v1.0.0 (2025-08-28)

- 🎉 初始版本发布
- ✨ 支持基础MD到思维导图转换
- 🎨 支持多种布局和主题
- 💾 支持XMind、PNG、SVG导出