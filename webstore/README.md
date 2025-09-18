# CookieJar Chrome Web Store 上架资料包

## 📁 目录结构

```
webstore/
├── README.md                    # 本文件 - 总览说明
├── PUBLISH_CHECKLIST.md         # 完整上架检查清单
├── docs/                        # 文档资料
│   ├── privacy-policy.md         # 隐私政策文档
│   └── store-description.md      # 商店描述和信息
├── screenshots/                 # 应用截图
│   └── README.md                # 截图制作指南
├── promotional/                 # 推广素材
│   └── README.md                # 推广图片设计规范
└── assets/                      # 其他资源
    └── (待添加图标、截图等文件)
```

## 🚀 快速开始

### 1. 立即可用的资料
- ✅ **隐私政策**: `docs/privacy-policy.md` - 完整的隐私政策文档
- ✅ **商店描述**: `docs/store-description.md` - 包含标题、描述、关键词等
- ✅ **发布检查清单**: `PUBLISH_CHECKLIST.md` - 逐步上架指导

### 2. 需要制作的资料
- 📸 **应用截图**: 参考 `screenshots/README.md` 制作 3-4 张截图
- 🎨 **推广图片**: 参考 `promotional/README.md` 制作推广素材（可选）

### 3. 需要部署的内容
- 🌐 **隐私政策网站**: 将 `docs/privacy-policy.md` 部署到您的网站
- 🔗 **更新链接**: 在商店描述中更新实际的网站链接

## 📋 上架步骤概览

### 准备阶段
1. **制作截图** - 按照 `screenshots/README.md` 指南制作
2. **部署隐私政策** - 将隐私政策发布到网站
3. **更新链接信息** - 修改描述中的占位符链接

### 发布阶段
1. **构建扩展** - 运行 `pnpm build && pnpm zip`
2. **注册开发者账户** - Chrome Web Store ($5 费用)
3. **填写商店信息** - 使用 `docs/store-description.md` 内容
4. **上传资源** - 上传 ZIP、截图、推广图
5. **提交审核** - 等待 1-3 个工作日

### 发布后
1. **监控反馈** - 关注用户评论和评分
2. **用户支持** - 及时回复用户问题
3. **版本更新** - 根据反馈优化功能

## 🎯 关键优势

### 合规性保证
- ✅ 符合 Chrome Web Store 最新政策要求
- ✅ 隐私政策符合 GDPR 和 CCPA 标准
- ✅ 权限使用说明清晰透明

### 专业性
- 🎨 现代化的商店描述风格
- 📝 专业的技术文档
- 🔒 强调隐私保护理念

### 用户友好
- 🚀 突出开发者工具属性
- ⚡ 强调快速便捷的使用体验
- 🛡️ 建立用户信任度

## ⚠️ 重要提醒

### 必须完成的任务
1. **制作应用截图** - 这是必需的，建议制作 3-4 张高质量截图
2. **部署隐私政策** - Chrome Web Store 要求提供有效的隐私政策链接
3. **更新联系信息** - 将文档中的占位符替换为真实信息

### 可选但推荐的任务
1. **制作推广图片** - 提高在商店中的视觉吸引力
2. **准备多语言版本** - 扩大目标用户群体
3. **建立支持页面** - 提供更好的用户体验

## 📞 获取帮助

### 官方资源
- [Chrome Web Store 开发者指南](https://developer.chrome.com/docs/webstore/)
- [扩展程序政策](https://developer.chrome.com/docs/webstore/program-policies/)
- [发布流程文档](https://developer.chrome.com/docs/webstore/publish/)

### 项目资源
- **主要文档**: `CHROME_WEBSTORE_GUIDE.md` (根目录)
- **技术支持**: GitHub Issues
- **开发文档**: README.md (根目录)

## 🎉 祝您发布顺利！

这个资料包包含了 CookieJar 扩展在 Chrome Web Store 上架所需的所有文档和指导。按照检查清单逐步执行，您的扩展将能够顺利通过审核并成功发布。

如有任何问题，请参考相关文档或通过 GitHub Issues 寻求帮助。