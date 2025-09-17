# Chrome Web Store 上架操作指南

本指南详细介绍如何将 CookieJar 扩展发布到 Chrome Web Store。

## 📋 准备工作检查清单

### 1. 项目准备
- [x] 项目代码完成并测试
- [x] 版本号设置 (当前: v1.2.4)
- [x] 扩展图标准备 (16, 32, 48, 96, 128px)
- [x] 构建文件生成 (.output/chrome-mv3/)
- [ ] 应用截图准备
- [ ] 推广图片准备
- [ ] 隐私政策文档

### 2. 开发者账户
- [ ] Chrome Web Store 开发者账户 ($5 一次性注册费)
- [ ] Google 账户验证

## 🔧 构建发布版本

### 1. 生成生产构建
```bash
# 安装依赖
pnpm install

# 构建生产版本
pnpm build

# 生成 ZIP 包
pnpm zip
```

构建完成后，ZIP 文件位于 `.output/cookiejar-1.2.4-chrome.zip`

### 2. 验证构建内容
确保 ZIP 包包含以下文件：
- `manifest.json` - 扩展清单文件
- `popup.html` - 弹窗页面
- `background.js` - 后台脚本
- `icon/` 目录 - 各尺寸图标
- 其他必要的资源文件

## 🎨 准备上架资源

### 1. 应用图标 (已准备)
- ✅ 16x16px - 工具栏图标
- ✅ 32x32px - Windows 系统图标
- ✅ 48x48px - 扩展管理页面
- ✅ 96x96px - 高 DPI 显示
- ✅ 128x128px - Chrome Web Store

### 2. 应用截图 (需要准备)
**要求：**
- 尺寸: 1280x800 或 640x400 像素
- 格式: PNG 或 JPEG
- 数量: 1-5 张
- 内容: 展示扩展主要功能

**建议截图内容：**
1. 扩展弹窗显示 cookies 列表
2. 不同网站的 cookies 展示
3. 扩展在浏览器中的位置

### 3. 推广图片 (可选但推荐)
**小推广图片 (440x280px):**
- 在搜索结果中显示
- PNG 或 JPEG 格式

**大推广图片 (920x680px):**
- 在详情页显示
- PNG 或 JPEG 格式

**宣传图块 (1400x560px):**
- 在 Chrome Web Store 首页展示时使用

## 📝 商店信息填写

### 1. 基本信息
```
应用名称: CookieJar
简短描述: A modern browser extension for viewing and managing cookies
详细描述:
CookieJar is a simple yet powerful Chrome extension that allows you to view the cookies of the current website in a clean, organized table. Click the extension icon, and instantly see all the cookie names and their corresponding values.

✨ Features:
• View Cookies: Instantly view all cookies for the active tab
• Clear Presentation: Displays cookies in a clean, easy-to-read table
• Modern UI: Built with React, Tailwind CSS, and shadcn-ui
• Fast & Efficient: Built with WXT for optimized performance

Perfect for developers, web designers, and anyone who needs to quickly inspect website cookies.

🛠️ Tech Stack:
• Framework: WXT (Web Extension Toolkit)
• UI Library: React
• Styling: Tailwind CSS
• UI Components: shadcn-ui
```

### 2. 分类和标签
- **主要类别**: 开发者工具 (Developer Tools)
- **标签建议**: cookies, developer, web development, debugging, privacy

### 3. 语言和地区
- **主要语言**: 英语
- **支持地区**: 全球

## 🔒 隐私和权限

### 1. 权限说明
CookieJar 请求以下权限：

**Host Permissions (`<all_urls>`):**
- **用途**: 访问所有网站以读取 cookies
- **说明**: 扩展需要此权限来获取当前标签页的 cookies 信息

**Cookies Permission:**
- **用途**: 读取网站 cookies
- **说明**: 这是扩展核心功能，用于显示 cookie 信息

### 2. 隐私政策 (必需)
创建隐私政策文档，包含：
- 数据收集说明 (本扩展不收集个人数据)
- 权限使用说明
- 数据存储和处理方式
- 联系信息

**隐私政策模板:**
```
隐私政策

CookieJar 扩展隐私说明：

1. 数据收集：我们不收集、存储或传输任何个人数据
2. Cookie 访问：扩展仅在本地读取和显示当前网站的 cookies，不会将数据发送到外部服务器
3. 权限使用：所有权限仅用于扩展核心功能
4. 联系方式：[您的联系邮箱]

最后更新：2024年9月
```

## 🚀 发布流程

### 1. 注册开发者账户
1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. 使用 Google 账户登录
3. 支付 $5 一次性注册费
4. 验证身份信息

### 2. 创建新扩展
1. 点击 "新增项目"
2. 上传 ZIP 文件 (`cookiejar-1.2.4-chrome.zip`)
3. 填写商店信息：
   - 应用名称和描述
   - 上传截图和图标
   - 设置类别和标签
   - 添加隐私政策链接

### 3. 配置发布设置
```
可见性: 公开
分发: Chrome Web Store
定价: 免费
目标受众: 适合所有年龄段
```

### 4. 提交审核
1. 检查所有必填字段
2. 预览商店页面
3. 提交审核 (通常需要 1-3 个工作日)

## ⚠️ 常见问题和注意事项

### 1. 审核被拒的常见原因
- **权限过度**: 确保只请求必要权限
- **描述不清**: 清楚说明权限用途
- **截图质量**: 提供高质量的功能截图
- **隐私政策**: 必须提供有效的隐私政策链接

### 2. 优化建议
- **关键词优化**: 在标题和描述中使用相关关键词
- **高质量截图**: 展示最佳使用场景
- **定期更新**: 保持扩展更新以获得更好排名

### 3. 发布后维护
- **用户反馈**: 及时回复用户评论和问题
- **版本更新**: 修复 bug 和添加新功能
- **统计分析**: 使用 Chrome Web Store Analytics

## 📊 发布后跟踪

### 1. 性能指标
- 安装量
- 用户评分
- 使用率统计
- 卸载率

### 2. 用户反馈
- 监控用户评论
- 收集功能需求
- 处理 bug 报告

## 🔄 更新流程

发布新版本时：
1. 更新 `package.json` 中的版本号
2. 重新构建: `pnpm build && pnpm zip`
3. 在开发者控制台上传新的 ZIP 文件
4. 更新变更日志
5. 提交新版本审核

---

## 📞 技术支持

如遇到问题，可参考：
- [Chrome 扩展程序开发文档](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store 发布指南](https://developer.chrome.com/docs/webstore/publish/)
- [WXT 框架文档](https://wxt.dev/)

---

**注意**: 首次发布可能需要更长的审核时间。确保所有信息准确完整，以提高审核通过率。