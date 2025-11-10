#!/bin/bash

# 部署到GitHub Pages的脚本

echo "🚀 开始部署到GitHub Pages..."

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "❌ dist目录不存在，请先运行 npm run build:prod"
    exit 1
fi

# 创建gh-pages分支（如果不存在）
git branch --show gh-pages 2>/dev/null || {
    echo "📝 创建gh-pages分支..."
    git checkout --orphan gh-pages
    git rm -rf . > /dev/null 2>&1
}

# 切换到gh-pages分支
git checkout gh-pages

# 复制dist目录内容到根目录
echo "📂 复制构建文件..."
cp -r dist/* .
cp dist/.gitignore . 2>/dev/null || true

# 添加所有文件
git add .

# 提交更改
git commit -m "部署飞书审批打印插件到GitHub Pages - $(date)"

# 推送到远程
echo "📤 推送到GitHub Pages..."
git push origin gh-pages --force

# 切换回main分支
git checkout main

echo "✅ 部署完成！"
echo "🌐 您的应用现在可以通过以下地址访问："
echo "   https://ivanli163.github.io/feishu-approval-print"