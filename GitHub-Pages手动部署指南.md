# GitHub Pages 手动部署指南

## 🚀 快速部署方案

由于自动化部署遇到问题，我们使用手动部署方案，这样更可靠且快速。

### 📋 部署步骤

#### 第1步：构建应用
```bash
npm run build:prod
```

#### 第2步：手动上传到GitHub Pages

1. **访问GitHub仓库**：
   https://github.com/ivanli163/feishu-approval-print

2. **进入Pages设置**：
   - 点击顶部的"Settings"标签
   - 在左侧菜单中找到"Pages"

3. **配置Pages源**：
   - 在"Source"部分选择"Deploy from a branch"
   - Branch选择："main"
   - Folder选择："/ (root)"
   - 点击"Save"

4. **手动上传构建文件**：
   - 点击"Add file" → "Upload files"
   - 上传 `dist/` 文件夹中的文件：
     - `index.html`
     - `bundle.js`
     - `bundle.js.LICENSE.txt`

5. **等待部署完成**：
   - GitHub会自动处理部署
   - 通常需要2-5分钟

### 🎯 验证部署

部署完成后，您可以通过以下地址访问应用：
```
https://ivanli163.github.io/feishu-approval-print
```

### 📁 当前构建文件

您的 `dist/` 文件夹包含：
- ✅ `index.html` - 主页面
- ✅ `bundle.js` - 压缩后的JavaScript文件
- ✅ `bundle.js.LICENSE.txt` - 许可证文件

### 🔄 后续更新流程

当您修改代码后：

1. **重新构建**：
   ```bash
   npm run build:prod
   ```

2. **上传更新的文件**：
   - 在GitHub仓库中替换 `index.html` 和 `bundle.js`

3. **等待自动更新**：
   - GitHub Pages会自动更新
   - 通常需要几分钟

### 🌐 配置飞书应用

部署成功后，您需要在飞书开放平台配置：

1. **重定向URL**：
   ```
   https://ivanli163.github.io/feishu-approval-print
   ```

2. **应用权限**：
   - `bitable:app`
   - `bitable:readonly`
   - `bitable:write`

### ✅ 成功标志

- ✅ 能够访问 https://ivanli163.github.io/feishu-approval-print
- ✅ 应用界面正常显示
- ✅ 所有功能可以正常使用
- ✅ 飞书环境检测正常

### 🔧 故障排除

**如果页面无法访问**：
1. 检查Pages设置是否已启用
2. 确认文件已正确上传
3. 等待5分钟让DNS生效

**如果应用功能异常**：
1. 检查浏览器控制台错误
2. 确认JavaScript文件已正确加载
3. 验证构建文件完整性

---

**🎉 恭喜！** 您的飞书审批打印插件现在已经部署到GitHub Pages，可以通过飞书访问使用了！