# CookieJar 项目分析文档

## 项目概述

CookieJar 是一个现代化的 Chrome 浏览器扩展，专门用于查看当前网站的 Cookie 信息。该项目采用了最新的 Web 技术栈，为用户提供了简洁、直观的 Cookie 查看体验。

## 核心功能

### 主要特性
- **Cookie 查看器**: 实时显示当前活动标签页的所有 Cookie
- **表格展示**: 以清晰的表格形式展示 Cookie 名称和值
- **现代化 UI**: 基于 React + Tailwind CSS + shadcn-ui 的现代界面设计
- **跨浏览器支持**: 支持 Chrome 和 Firefox 浏览器

### 用户体验
- 点击扩展图标即可查看当前网站的 Cookie
- 响应式表格设计，长文本自动换行
- 简洁的用户界面，专注于核心功能

## 技术架构

### 技术栈
- **框架**: WXT (Web Extension Toolkit) v0.20.6
- **前端库**: React v19.1.0
- **样式框架**: Tailwind CSS v4.1.11
- **UI 组件**: shadcn-ui
- **语言**: TypeScript v5.8.3
- **包管理器**: pnpm

### 项目结构
```
├── entrypoints/
│   ├── popup/
│   │   └── App.tsx          # 主弹窗组件
│   ├── background.ts        # 后台脚本
│   └── content.ts          # 内容脚本
├── components/
│   └── ui/                 # shadcn-ui 组件
├── package.json            # 项目依赖配置
├── wxt.config.ts          # WXT 配置文件
├── tsconfig.json          # TypeScript 配置
└── tailwind.config.ts     # Tailwind CSS 配置
```

### 核心组件分析

#### 1. 弹窗组件 (App.tsx)
- **功能**: 主要的用户界面组件
- **技术实现**:
  - 使用 React Hooks (useState, useEffect) 管理状态
  - 通过 Chrome Extension API 获取当前标签页信息
  - 使用 `browser.cookies.getAll()` API 获取 Cookie 数据
  - 采用 shadcn-ui Table 组件展示数据

#### 2. 后台脚本 (background.ts)
- **功能**: 扩展的后台服务
- **当前状态**: 基础实现，仅包含日志输出

#### 3. 内容脚本 (content.ts)
- **功能**: 在网页中注入的脚本
- **当前配置**: 仅在 Google 网站上运行
- **当前状态**: 基础实现，仅包含日志输出

## 权限配置

### 扩展权限
- `cookies`: 访问 Cookie 数据的权限
- `<all_urls>`: 访问所有网站的权限

这些权限使得扩展能够读取任何网站的 Cookie 信息。

## 开发环境

### 开发脚本
- `pnpm dev`: 启动开发模式 (Chrome)
- `pnpm dev:firefox`: 启动开发模式 (Firefox)
- `pnpm build`: 构建生产版本 (Chrome)
- `pnpm build:firefox`: 构建生产版本 (Firefox)
- `pnpm zip`: 打包扩展文件 (Chrome)
- `pnpm zip:firefox`: 打包扩展文件 (Firefox)

### 开发流程
1. 运行 `pnpm dev` 启动开发服务器
2. 在 Chrome 中加载 `.output/chrome-mv3-dev` 目录
3. 代码修改后自动重新构建

## 代码质量

### 优点
- **类型安全**: 完整的 TypeScript 类型定义
- **现代化架构**: 使用最新的 React 19 和现代 Web 技术
- **代码注释**: 详细的中文注释，便于理解
- **组件化设计**: 良好的组件分离和复用
- **响应式设计**: 使用 Tailwind CSS 实现响应式布局

### 改进建议
- **错误处理**: 可以添加更完善的错误处理机制
- **加载状态**: 可以添加数据加载时的状态提示
- **功能扩展**: 可以考虑添加 Cookie 编辑、删除等功能
- **内容脚本**: 当前内容脚本功能较为简单，可以扩展更多功能

## 部署和分发

### 本地测试
1. 克隆项目并安装依赖
2. 运行开发命令
3. 在浏览器中加载未打包的扩展

### 生产部署
1. 运行构建命令生成生产版本
2. 使用 zip 命令打包扩展
3. 上传到 Chrome Web Store 或 Firefox Add-ons

## 总结

CookieJar 是一个设计良好的现代化浏览器扩展项目，具有以下特点：

**优势**:
- 技术栈现代化，使用了最新的工具和框架
- 代码结构清晰，易于维护和扩展
- 用户界面简洁直观
- 完整的 TypeScript 支持

**适用场景**:
- Web 开发者调试 Cookie 问题
- 学习浏览器扩展开发的示例项目
- 作为更复杂扩展功能的基础框架

这个项目为浏览器扩展开发提供了一个优秀的起点，展示了如何使用现代 Web 技术构建功能完整的浏览器扩展。